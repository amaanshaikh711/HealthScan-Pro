/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CLERK_PUBLISHABLE_KEY: string;
    readonly VITE_DEEPSEEK_API_KEY: string;
    readonly VITE_DEEPSEEK_BASE_URL?: string;
    readonly VITE_VAPI_PUBLIC_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
