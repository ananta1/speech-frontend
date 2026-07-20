
# Note: Ensure the following environment variables are set or values match your .env
S3_BUCKET="practiceyourspeech"
DIST_ID="E16LNC06XBNOCK"

npm install
npm run build
aws s3 sync dist s3://practiceyourspeech --delete
aws cloudfront create-invalidation --distribution-id E16LNC06XBNOCK --paths "/*"
