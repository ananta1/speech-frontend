# Frontend Deployment Guide

This document outlines the steps to build and deploy the **Practice Your Speech** frontend application to AWS CloudFront.

## 📋 Prerequisites

Before you begin, ensure you have the following installed and configured:

1.  **Node.js & npm**
    *   **Required Version**: Node.js v18 or higher.
    *   **Verify**: Run `node -v` and `npm -v`.

2.  **AWS CLI**
    *   **Required**: Version 2.x.
    *   **Verify**: Run `aws --version`.
    *   **Configuration**: Run `aws configure` and enter your AWS Access Key ID, Secret Access Key, Region (`us-east-1`), and Output format (`json`).

## ⚙️ Environment Configuration

The application relies on environment variables for API endpoints and third-party integrations (like Google OAuth).

1.  **Create a `.env` file** in the root of the `speech-frontend` directory if it doesn't exist.
2.  **Add the following variables**:

    ```env
    VITE_API_BASE_URL=https://YOUR_API_ENDPOINT.amazonaws.com
    VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
    ```

    > **Note**: Do not commit this file to version control (git). It is already in `.gitignore`.

## 🚀 Deployment Steps

Follow these steps to deploy updates to the live site.

### 1. Install Dependencies
Ensure all dependencies are up to date.

```powershell
npm install
```

### 2. Build the Application
Compile the React code into static assets (HTML, CSS, JS) optimized for production.

```powershell
npm run build
```

*   **Output**: This creates a `dist` folder in your project directory containing the production-ready files.

### 3. Upload to S3
Sync the contents of the `dist` folder to your S3 hosting bucket. The `--delete` flag removes old files that are no longer needed.

```powershell
aws s3 sync dist s3://YOUR_S3_BUCKET_NAME --delete
```

### 4. Invalidate CloudFront Cache
To ensure users see the latest version immediately (bypassing the CDN cache), create an invalidation.

*   **Distribution ID**: Found in your AWS CloudFront Console or `.env` file.

```powershell
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

---

## 🔄 Summary Command (One-Liner)

You can run this single command chain in PowerShell to perform the full deployment:

```powershell
npm run build; if ($?) { aws s3 sync dist s3://YOUR_S3_BUCKET_NAME --delete; aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*" }
```

---

## 🛠️ Troubleshooting

### "Access Denied" on S3 Upload
*   **Cause**: AWS CLI credentials are missing or lack permission.
*   **Solution**: Run `aws configure` again or check if your IAM user has `s3:PutObject` and `s3:ListBucket` permissions for the target bucket.

### "Vite requires Node.js version..."
*   **Cause**: You are using an outdated version of Node.js.
*   **Solution**: Update Node.js to the latest LTS version (e.g., v20 or v22).

### Changes not visible on the site
*   **Cause**: CloudFront is serving cached content.
*   **Solution**: Ensure you ran the **Invalidation** step (Step 4) successfully. Wait 1-2 minutes and hard-refresh your browser (`Ctrl + F5` or `Cmd + Shift + R`).

## 🌐 Domain Information

*   **CloudFront URL**: Found in AWS Console
*   **Custom Domain**: `https://yourdomain.com`
