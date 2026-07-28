// Detects whether the site is currently running inside the installed
// Android app (a Trusted Web Activity) rather than a regular mobile/
// desktop browser tab.
//
// Chrome sets document.referrer to "android-app://<package-name>" when
// a page is opened via a Trusted Web Activity. This is the standard,
// well-documented way to detect a TWA context — no native code or
// extra permissions needed.
//
// Used to hide payment/subscription entry points inside the Android
// app (Google Play policy requires Google Play Billing for in-app
// digital purchases) while keeping the full Razorpay checkout flow
// working normally on the website.
export function isRunningInTWA() {
  try {
    return document.referrer.startsWith('android-app://');
  } catch {
    return false;
  }
}
