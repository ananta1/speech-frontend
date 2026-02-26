# Practice Your Speech - Frontend

This is the frontend application for **Practice Your Speech**, built with React and Vite.

## 🚀 Deployment Guide

We use **AWS CloudFront** and **S3** to host the frontend securely.

### 1. Initial Deployment (Already Completed)
The application has been deployed to the following CloudFront URL:
👉 **[Live Site Link](https://d1kjyzh2fecnyq.cloudfront.net)** *(See `.env` for the URL)*

### 2. How to Update the Frontend
When you make changes to the React code, follow these steps to deploy the update:

1.  **Build the project:**
    ```bash
    npm run build
    ```
    *(This creates a `dist` folder with the production assets)*

2.  **Upload to S3:**
    Use the AWS CLI to sync the `dist` folder to your S3 bucket.
    ```bash
    aws s3 sync dist s3://YOUR_S3_BUCKET_NAME
    ```
    *(Note: You do NOT need to run `deploy_cf.py` again, as that would create a duplicate CloudFront distribution.)*

3.  **Invalidate CloudFront Cache (Optional but Recommended):**
    To ensure users see the changes immediately:
    ```bash
    aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
    ```

### 3. Custom Domain Setup (`practiceyourspeech.com`)
To point your custom domain to the application:

1.  **Purchase the Domain:**
    *   Go to the [AWS Route 53 Console](https://console.aws.amazon.com/route53/home#DomainRegistration:).
    *   Purchase `practiceyourspeech.com`.
    *   **Wait ~15 minutes** for the "Hosted Zone" to appear in your account.

2.  **Run the Setup Script:**
    We provided a script to automate SSL and DNS configuration.
    ```bash
    python setup_domain.py
    ```
    *This script requests an SSL certificate, validates it via DNS, and updates CloudFront.*

---

## 🔒 Security Configurations

### Google OAuth
*   **Client ID:** Managed in `src/config.js` (via `.env`).
*   **Authorized Origins:** You must add your production domain(s) to the **Authorized JavaScript origins** in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

The backend API allows requests **only** from authorized domains (localhost and your production domains). See backend configuration for details.

If you access the API from any other domain, it will be blocked.

---

### Deployment Documentation
For a comprehensive guide on deploying the frontend, including prerequisites and troubleshooting, please refer to:
👉 **[DEPLOYMENT.md](DEPLOYMENT.md)**

## 💻 Local Development

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start Dev Server:**
    ```bash
    npm run dev
    ```
