import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px', fontFamily: 'DM Sans, sans-serif', color: '#0A1628' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#4B5563', marginBottom: 32 }}>Last updated: June 9, 2026</p>
      <h2>1. Introduction</h2>
      <p>VedicMind operates the VedicMind application and website at vedicmindai.in. This Privacy Policy explains how we collect, use, and protect your information.</p>
      <h2>2. Information We Collect</h2>
      <ul>
        <li><strong>Account Information:</strong> Name, email address, date of birth</li>
        <li><strong>Profile Information:</strong> Grade, board, learning goals, age group</li>
        <li><strong>Usage Data:</strong> Lessons completed, quiz scores, XP points, streaks</li>
        <li><strong>Payment Information:</strong> Processed securely by Razorpay</li>
      </ul>
      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>To provide personalized AI-powered learning experience</li>
        <li>To track your progress and award badges/XP</li>
        <li>To show your rank on leaderboards</li>
        <li>To improve our app and content</li>
      </ul>
      <h2>4. Data Storage</h2>
      <p>Your data is stored securely on Supabase servers in Mumbai, India. All transmission is encrypted using SSL/TLS.</p>
      <h2>5. Children's Privacy</h2>
      <p>VedicMind is designed for students including children. Parents may contact us to review or delete their child's data.</p>
      <h2>6. Data Sharing</h2>
      <p>We do not sell your personal information. We share data only with Razorpay (payments) and Anthropic Claude API (AI tutoring), or when required by law.</p>
      <h2>7. Leaderboard Privacy</h2>
      <p>Your name is shown as "First name + Last initial" only. You can opt out in Profile Settings.</p>
      <h2>8. Data Deletion</h2>
      <p>Delete your account anytime from Profile page or email us at <a href="mailto:hitesh@vedicmindai.in">hitesh@vedicmindai.in</a>.</p>
      <h2>9. Contact Us</h2>
      <p><strong>Email:</strong> hitesh@vedicmindai.in<br/>
      <strong>Website:</strong> https://vedicmindai.in<br/>
      <strong>Address:</strong> Lucknow, Uttar Pradesh, India</p>
    </div>
  );
}
