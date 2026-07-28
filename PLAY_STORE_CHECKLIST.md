# Play Store Pre-Submission Checklist

Run through this **every single time**, right before hitting submit —
not just once at launch. Every item on this list caused or nearly
caused a real rejection at some point (see submission history below).
"We checked it once in June" is not the same as "it's true today."

## 1. Demo/reviewer login — test it live, that exact day
Log in yourself with the exact demo credentials Play Console has on
file, fresh, right before submitting. Don't assume a login set up
weeks ago still works. (Submission 9's rejection: this exact check
was skipped.)

## 2. In-app purchase declaration matches reality
Play Console → App content → your monetization declaration. If the
app doesn't currently sell anything in-app (e.g. after the TWA
payment-hiding change, commit 7e67cff), "Offers in-app purchases"
must be unchecked. If it does, Google Play Billing must actually be
wired up — a checkbox that doesn't match app behavior is itself a
policy risk.

## 3. No false claims anywhere reachable from the app
Pricing, trial offers, feature claims — check the actual live site
and the actual installed app, not the code you remember writing.
Things drift: a promo banner, a meta tag, a WhatsApp share string
can go stale independently of the main UI. (Real incident: "7-day
free trial" survived in 3 places — a banner, a referral message, and
raw HTML meta tags — for a month after the feature itself was
retired.)

## 4. Privacy Policy / Data Safety form matches actual behavior
What the app actually collects and sends (analytics, ads, personal
info) must match what's declared in Play Console's Data Safety
section and the linked Privacy Policy page. Check this after any
change that adds a new third-party service or data collection point.

## 5. Permissions requested match permissions used
Open the app's manifest / permission requests. Every one should map
to something the app visibly does. Unused or leftover permissions
are a common, avoidable rejection trigger.

## 6. One full click-through as a logged-out first-time user
Not just the specific thing that got fixed — the whole path a
reviewer actually takes: install → open → sign up or use demo login
→ browse core features → (if applicable) try the purchase flow →
confirm no dead ends, no crashes, no broken links. This is what
catches the thing none of the other five items would.

---

## Submission history (for context, not exhaustive)

- **Submission 9** — rejected for demo login credentials not working.
  Root cause: not re-tested before resubmission. Fixed with a new
  demo account (8175081334) — but the deeper fix is item #1 above,
  so this specific failure mode can't recur silently.
