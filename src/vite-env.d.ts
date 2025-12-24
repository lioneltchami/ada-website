/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ORG_NAME: string
  readonly VITE_ORG_EMAIL: string
  readonly VITE_ORG_PHONE: string
  readonly VITE_ORG_LOCATION: string
  readonly VITE_SOCIAL_FACEBOOK: string
  readonly VITE_SOCIAL_INSTAGRAM: string
  readonly VITE_SOCIAL_TWITTER: string
  readonly VITE_TAX_ID: string
  readonly VITE_API_URL: string
  readonly VITE_EMAILJS_SERVICE_ID: string
  readonly VITE_EMAILJS_TEMPLATE_ID: string
  readonly VITE_EMAILJS_PUBLIC_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
