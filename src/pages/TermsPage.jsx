import React from 'react';
import { Link } from 'react-router-dom';

const s = {
  wrap: { maxWidth: 800, margin: '0 auto', padding: '40px 24px', fontFamily: 'DM Sans, sans-serif', color: '#0A1628' },
  h1:   { fontFamily: 'Playfair Display, serif', fontSize: 32, marginBottom: 8 },
  h2:   { fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8, color: '#1e40af' },
  p:    { lineHeight: 1.7, marginBottom: 12, color: '#374151' },
  li:   { lineHeight: 1.7, marginBottom: 6, color: '#374151' },
  muted:{ color: '#6B7280', marginBottom: 32 },
  back: { display: 'inline-block', marginBottom: 24, color: '#1e40af', textDecoration: 'none', fontSize: 14 },
};

export default function TermsPage() {
  return (
    <div style={s.wrap}>
      <Link to="/" style={s.back}>← Back to Home</Link>
      <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 8, padding: '12px 16px', marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 13, color: '#92400E', fontWeight: 500 }}>
          ™ VedicMindAI™ is a registered trademark applicant. Unauthorized use of this name or logo is prohibited.
          <br/><strong>Application Nos: 7785746 (Class 9) | 7785747 (Class 41) | 7785748 (Class 42)</strong>
          <br/>Filed: 11 June 2026 | Proprietor: Hitesh Pathak, Lucknow | Government of India Trade Marks Registry
        </p>
      </div>

      <h1 style={s.h1}>Terms &amp; Conditions</h1>
      <p style={s.muted}>Last updated: June 13, 2026 &nbsp;|&nbsp; Effective immediately</p>

      <h2 style={s.h2}>1. Acceptance of Terms</h2>
      <p style={s.p}>By downloading, installing, or using VedicMindAI™ ("App", "Service") operated by VedicMindAI™ (UDYAM-UP-50-0073523), you agree to be bound by these Terms & Conditions. If you do not agree, do not use the Service.</p>

      <h2 style={s.h2}>2. Description of Service</h2>
      <p style={s.p}>VedicMindAI™ is an AI-powered Vedic Mathematics learning platform providing:</p>
      <ul>
        <li style={s.li}>40+ structured Vedic Mathematics lessons</li>
        <li style={s.li}>Daily Quiz, Weekly Exam, and Olympiad competitions</li>
        <li style={s.li}>AI-powered practice and aptitude tests</li>
        <li style={s.li}>Leaderboard and progress tracking</li>
        <li style={s.li}>Subscription-based premium content</li>
      </ul>

      <h2 style={s.h2}>3. Eligibility</h2>
      <p style={s.p}>The Service is intended for users of all ages. Users under 13 must have parental consent. By registering, you confirm you meet these requirements or have parental/guardian approval.</p>

      <h2 style={s.h2}>4. Account Registration</h2>
      <ul>
        <li style={s.li}>You must provide accurate mobile number and personal information</li>
        <li style={s.li}>You are responsible for maintaining the confidentiality of your password</li>
        <li style={s.li}>One account per user. Multiple accounts may be suspended</li>
        <li style={s.li}>You may delete your account at any time from Profile Settings</li>
      </ul>

      <h2 style={s.h2}>5. Subscription & Payments</h2>
      <ul>
        <li style={s.li}><strong>Free Trial:</strong> 7-day full access, no credit card required</li>
        <li style={s.li}><strong>Basic Plan:</strong> ₹499/month — Core lessons and daily quiz</li>
        <li style={s.li}><strong>Pro Plan:</strong> ₹999/month — All features including Olympiad and Battle Mode</li>
        <li style={s.li}><strong>Family Plan:</strong> ₹1,499/month — Up to 5 family members</li>
        <li style={s.li}>Annual plans available at discounted rates</li>
        <li style={s.li}>All payments are processed securely via Razorpay</li>
        <li style={s.li}>Subscriptions auto-renew unless cancelled before the renewal date</li>
      </ul>

      <h2 style={s.h2}>6. Refund Policy</h2>
      <p style={s.p}>We offer a 7-day money-back guarantee for first-time subscribers. Refund requests after 7 days are evaluated on a case-by-case basis. To request a refund, email <a href="mailto:hitesh@vedicmindai.in">hitesh@vedicmindai.in</a> within the eligible period.</p>

      <h2 style={s.h2}>7. Intellectual Property</h2>
      <p style={s.p}>All content on VedicMindAI™ — including lessons, questions, UI design, logos, and the VedicMindAI™ trademark (filed under Classes 9, 41 & 42; App. Nos. 7785746, 7785747, 7785748) — is owned by VedicMindAI™. You may not copy, reproduce, distribute, or create derivative works without written permission.</p>

      <h2 style={s.h2}>8. User Conduct</h2>
      <p style={s.p}>You agree not to:</p>
      <ul>
        <li style={s.li}>Share your account credentials with others</li>
        <li style={s.li}>Use automated tools to scrape or collect content</li>
        <li style={s.li}>Attempt to reverse-engineer or hack the platform</li>
        <li style={s.li}>Post offensive, abusive, or misleading content in reviews</li>
        <li style={s.li}>Use the Service for commercial purposes without written consent</li>
      </ul>

      <h2 style={s.h2}>9. Leaderboard & Competitions</h2>
      <p style={s.p}>Quiz scores, XP points, and leaderboard rankings are determined by our system. VedicMindAI™ reserves the right to disqualify users found cheating or exploiting the system. Olympiad prizes (if any) are subject to verification of eligibility.</p>

      <h2 style={s.h2}>10. Disclaimer of Warranties</h2>
      <p style={s.p}>The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access. Educational outcomes depend on individual effort and practice.</p>

      <h2 style={s.h2}>11. Limitation of Liability</h2>
      <p style={s.p}>VedicMindAI™'s liability is limited to the amount paid by you in the 3 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.</p>

      <h2 style={s.h2}>12. Privacy</h2>
      <p style={s.p}>Your use of the Service is also governed by our <Link to="/privacy-policy" style={{ color: '#1e40af' }}>Privacy Policy</Link>, which is incorporated by reference into these Terms.</p>

      <h2 style={s.h2}>13. Account Deletion</h2>
      <p style={s.p}>You may delete your account at any time from Profile → Account Settings → Delete Account. Upon deletion, all your personal data, progress, and quiz history will be permanently removed within 30 days, except where retention is required by law.</p>

      <h2 style={s.h2}>14. Changes to Terms</h2>
      <p style={s.p}>We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance. We will notify users of material changes via email or in-app notification.</p>

      <h2 style={s.h2}>15. Governing Law</h2>
      <p style={s.p}>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Lucknow, Uttar Pradesh, India.</p>

      <h2 style={s.h2}>16. Contact Us</h2>
      <p style={s.p}>
        <strong>Email:</strong> hitesh@vedicmindai.in<br/>
        <strong>Website:</strong> https://vedicmindai.in<br/>
        <strong>Address:</strong> Lucknow, Uttar Pradesh, India<br/>
        <strong>UDYAM Registration:</strong> UDYAM-UP-50-0073523
      </p>
    </div>
  );
}
