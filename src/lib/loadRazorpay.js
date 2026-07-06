// Loads Razorpay's checkout.js on demand instead of on every page load.
// Previously this script (and its ~6MB of internal chunks) loaded globally
// via index.html on every single route, including the public homepage —
// this defers it to only the moment a payment is actually initiated.

let loadPromise = null;

export function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => {
      loadPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return loadPromise;
}
