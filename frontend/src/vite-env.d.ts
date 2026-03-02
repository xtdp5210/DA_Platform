/// <reference types="vite/client" />

// Uppercase image extensions (e.g. camera-exported .JPG files)
declare module "*.JPG" {
  const src: string;
  export default src;
}
declare module "*.PNG" {
  const src: string;
  export default src;
}
