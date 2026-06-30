/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PREINSCRIPTION_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
