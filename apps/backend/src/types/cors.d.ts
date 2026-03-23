declare module 'cors' {
  import type { RequestHandler } from 'express';

  export interface CorsOptions {
    [key: string]: unknown;
  }

  export default function cors(options?: CorsOptions): RequestHandler;
}
