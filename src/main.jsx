import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from '@/App.jsx'
import '@/index.css'

// Error monitoring. Does nothing unless VITE_SENTRY_DSN is set in the build
// environment, so local dev and builds without a DSN are unaffected.
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0,
    // Never send personal data: no IPs, no cookies, no request bodies.
    sendDefaultPii: false,
  })
  // Diagnostic: visit /?sentrytest=1 to send one test event. Normal visitors never trigger it.
  if (new URLSearchParams(window.location.search).has('sentrytest')) {
    Sentry.captureMessage('Sentry init test from VedicMind')
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
