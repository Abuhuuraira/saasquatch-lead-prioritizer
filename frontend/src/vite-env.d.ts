/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional: unset in production, where the API is served from the same origin. */
  readonly VITE_API_URL?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
