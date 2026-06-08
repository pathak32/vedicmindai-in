// base44Client.js — stub file for Vercel deployment
// The app uses VedicAuthContext (localStorage) for auth — this file is kept 
// only for backward compatibility with any stray imports.

export const base44 = {
  auth: {
    me: async () => null,
    logout: () => {},
    redirectToLogin: () => {},
    loginViaEmailPassword: async () => { throw new Error('Use VedicAuthContext instead'); },
    loginWithProvider: () => {},
    register: async () => { throw new Error('Use VedicAuthContext instead'); },
    verifyOtp: async () => { throw new Error('Use VedicAuthContext instead'); },
    setToken: () => {},
    resendOtp: async () => { throw new Error('Use VedicAuthContext instead'); },
    resetPasswordRequest: async () => { throw new Error('Use VedicAuthContext instead'); },
    resetPassword: async () => { throw new Error('Use VedicAuthContext instead'); },
  },
  functions: {
    invoke: async () => null,
  },
  integrations: {
    Core: {
      InvokeLLM: async () => null,
    }
  }
};
