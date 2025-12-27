# CircuitIQ Enterprise Deployment Guide - Environment Variables

To run CircuitIQ in production (Vercel) as a fully functioning "Gold Star" SaaS application, you need to configure the following Environment Variables.

## 1. Core Application
| Variable | Description | Where to get it |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | The public URL of your app (e.g. `https://your-app.vercel.app`) | Vercel Deployment Dashboard |
| `AUTH_SECRET` | Secret key for encrypting sessions. **CRITICAL** for NextAuth v5. | Generate with `openssl rand -base64 32` or any random string. |

## 2. Database (Neon / PostgreSQL)
| Variable | Description | Where to get it |
| :--- | :--- | :--- |
| `DATABASE_URL` | The connection string to your Neon database. | [Neon Console](https://console.neon.tech) (Dashboard > Connection Details) |

## 3. Storage (UploadThing)
| Variable | Description | Where to get it |
| :--- | :--- | :--- |
| `UPLOADTHING_TOKEN` | Token for authenticating uploads. | [UploadThing Dashboard](https://uploadthing.com/dashboard) |

## 4. Artificial Intelligence (OpenAI) - **CRITICAL**
**This is the most likely cause of "Upgrade Required" or "Connection Issues".**

| Variable | Description | Where to get it |
| :--- | :--- | :--- |
| `OPENAI_API_KEY` | Key for GPT-4 Vision & Turbo. | [OpenAI Platform](https://platform.openai.com/api-keys) |

### ⚠️ IMPORTANT: OpenAI Requirements
*   **Credit Balance:** You must have a **paid** OpenAI account with credits loaded (pre-paid).
*   **Tier 1+:** To use `gpt-4-vision-preview` (required for interpreting diagrams), you often need to be "Usage Tier 1" (spent at least $5).
*   **Check Limits:** If you see "Upgrade Required", your limits are exhausted or your payment method failed.

## 5. Authentication Providers (Optional but Recommended)
If you want "Google Login" or "GitHub Login" to work in production:

| Variable | Description | Where to get it |
| :--- | :--- | :--- |
| `GOOGLE_CLIENT_ID` | OAuth Client ID | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GITHUB_ID` | OAuth Client ID | [GitHub Developer Settings](https://github.com/settings/developers) |
| `GITHUB_SECRET` | OAuth Client Secret | [GitHub Developer Settings](https://github.com/settings/developers) |

## How to Add Variables in Vercel
1.  Go to your Project Dashboard on Vercel.
2.  Click **Settings** > **Environment Variables**.
3.  Add each Key and Value listed above.
4.  **Re-deploy** your application (or promote the latest commit) for changes to take effect.
