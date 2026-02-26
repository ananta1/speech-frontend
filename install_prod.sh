
# Note: Ensure the following environment variables are set or values match your .env
S3_BUCKET="YOUR_S3_BUCKET_NAME"
DIST_ID="YOUR_CLOUDFRONT_DIST_ID"

npm install
npm run build
aws s3 sync dist s3://$S3_BUCKET --delete
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
