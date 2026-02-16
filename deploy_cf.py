import boto3
import os
import json
import botocore
import mimetypes
import time

s3 = boto3.client('s3')
cf = boto3.client('cloudfront')

BUCKET_NAME = 'practiceyourspeech'
REGION = 'us-east-1' 

def create_bucket():
    try:
        if REGION == 'us-east-1':
            s3.create_bucket(Bucket=BUCKET_NAME)
        else:
            s3.create_bucket(
                Bucket=BUCKET_NAME,
                CreateBucketConfiguration={'LocationConstraint': REGION}
            )
        print(f"Bucket {BUCKET_NAME} created/verified.")
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == 'BucketAlreadyOwnedByYou':
            print(f"Bucket {BUCKET_NAME} already exists and is owned by you.")
        elif e.response['Error']['Code'] == 'BucketAlreadyExists':
            print(f"Error: Bucket {BUCKET_NAME} already exists globally! Choose another name.")
            return False
        else:
            print(f"Error creating bucket: {e}")
            return False
    return True

def upload_files():
    dist_path = 'dist'
    if not os.path.exists(dist_path):
        print("Error: 'dist' folder not found. Run 'npm run build' first.")
        return False

    for root, dirs, files in os.walk(dist_path):
        for file in files:
            local_path = os.path.join(root, file)
            # Create S3 key (relative path, forward slashes)
            s3_path = os.path.relpath(local_path, dist_path).replace("\\", "/")
            
            # Guess MIME type
            content_type, _ = mimetypes.guess_type(local_path)
            if not content_type:
                content_type = 'application/octet-stream'
            
            print(f"Uploading {s3_path} ({content_type})...")
            try:
                s3.upload_file(
                    local_path, 
                    BUCKET_NAME, 
                    s3_path, 
                    ExtraArgs={'ContentType': content_type}
                )
            except Exception as e:
                print(f"Failed to upload {s3_path}: {e}")
                return False
    print("Upload complete.")
    return True

def create_cloudfront_distribution():
    # 1. Create Origin Access Control (OAC)
    oac_name = f'{BUCKET_NAME}-oac-{int(time.time())}'
    try:
        oac = cf.create_origin_access_control(
            OriginAccessControlConfig={
                'Name': oac_name,
                'Description': 'OAC for practiceyourspeech',
                'SigningProtocol': 'sigv4',
                'SigningBehavior': 'always',
                'OriginAccessControlOriginType': 's3'
            }
        )
        oac_id = oac['OriginAccessControl']['Id']
        print(f"Created OAC: {oac_id}")
    except Exception as e:
        print(f"Error creating OAC: {e}")
        return None

    # 2. Create Distribution
    origin_id = f"S3-{BUCKET_NAME}"
    try:
        distribution = cf.create_distribution(
            DistributionConfig={
                'CallerReference': str(time.time()), 
                'Aliases': { 'Quantity': 0 },
                'DefaultRootObject': 'index.html',
                'Origins': {
                    'Quantity': 1,
                    'Items': [
                        {
                            'Id': origin_id,
                            'DomainName': f'{BUCKET_NAME}.s3.{REGION}.amazonaws.com',
                            'S3OriginConfig': {
                                'OriginAccessIdentity': '' # Empty for OAC
                            },
                            'OriginAccessControlId': oac_id
                        }
                    ]
                },
                'DefaultCacheBehavior': {
                    'TargetOriginId': origin_id,
                    'ViewerProtocolPolicy': 'redirect-to-https',
                    'AllowedMethods': {
                        'Quantity': 2,
                        'Items': ['GET', 'HEAD'],
                        'CachedMethods': {
                            'Quantity': 2,
                            'Items': ['GET', 'HEAD']
                        }
                    },
                    'ForwardedValues': {
                        'QueryString': False,
                        'Cookies': {'Forward': 'none'}
                    },
                    'MinTTL': 0,
                    'DefaultTTL': 86400,
                    'MaxTTL': 31536000
                },
                'CacheBehaviors': { 'Quantity': 0 },
                'CustomErrorResponses': {
                    'Quantity': 2,
                    'Items': [
                        {
                            'ErrorCode': 403,
                            'ResponsePagePath': '/index.html',
                            'ResponseCode': '200',
                            'ErrorCachingMinTTL': 10
                        },
                        {
                            'ErrorCode': 404,
                            'ResponsePagePath': '/index.html',
                            'ResponseCode': '200',
                            'ErrorCachingMinTTL': 10
                        }
                    ]
                },
                'Comment': 'practiceyourspeech frontend',
                'Enabled': True
            }
        )
        dist_arn = distribution['Distribution']['ARN']
        dist_id = distribution['Distribution']['Id']
        domain_name = distribution['Distribution']['DomainName']
        print(f"CloudFront Distribution created: {dist_id} ({domain_name})")
        return dist_id, domain_name, dist_arn
    except Exception as e:
        print(f"Error creating distribution: {e}")
        return None

def update_bucket_policy(dist_arn):
    # Allow CloudFront to read bucket
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowCloudFrontServicePrincipal",
                "Effect": "Allow",
                "Principal": {
                    "Service": "cloudfront.amazonaws.com"
                },
                "Action": "s3:GetObject",
                "Resource": f"arn:aws:s3:::{BUCKET_NAME}/*",
                "Condition": {
                    "StringEquals": {
                        "AWS:SourceArn": dist_arn
                    }
                }
            }
        ]
    }
    try:
        s3.put_bucket_policy(Bucket=BUCKET_NAME, Policy=json.dumps(policy))
        print("Bucket policy updated to allow CloudFront access.")
    except Exception as e:
        print(f"Error updating bucket policy: {e}")

if __name__ == "__main__":
    print("Starting deployment...")
    if create_bucket():
        if upload_files():
            result = create_cloudfront_distribution()
            if result:
                dist_id, domain, dist_arn = result
                update_bucket_policy(dist_arn)
                print(f"\nDeployment Complete! \nCloudFront Domain: https://{domain}")
                print("Note: CloudFront distributions take 5-15 minutes to deploy globally. The URL might return 404 initially.")
