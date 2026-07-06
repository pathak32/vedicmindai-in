import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// TEMPORARY DEBUG INSTRUMENTATION — catches any programmatic navigation
// to /auth and logs exactly what triggered it. Safe to remove after
// diagnosing the mystery redirect issue.
if (typeof window !== 'undefined') {
  const logJump = (label, url) => {
    if (String(url).includes('/auth')) {
      // eslint-disable-next-line no-console
      console.warn(`[NAV-DEBUG] ${label} → ${url}`);
      // eslint-disable-next-line no-console
      console.trace('[NAV-DEBUG] stack trace for the above navigation');
    }
  };
  const origPush = window.history.pushState.bind(window.history);
  window.history.pushState = function (state, title, url) {
    logJump('pushState', url);
    return origPush(state, title, url);
  };
  const origReplace = window.history.replaceState.bind(window.history);
  window.history.replaceState = function (state, title, url) {
    logJump('replaceState', url);
    return origReplace(state, title, url);
  };
  window.addEventListener('popstate', () => {
    logJump('popstate', window.location.pathname);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
