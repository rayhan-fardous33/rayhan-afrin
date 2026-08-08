import { createAuthClient } from 'better-auth/react';

const getBaseURL = () => {
  // In the browser, always use the current origin — works on both localhost and Vercel
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Server-side: use the env var (must be set to the deployed URL in Vercel)
  return process.env.BETTER_AUTH_URL || 'http://localhost:3000';
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signUp, useSession } = authClient;