import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// /ref/:code — saves referral code to localStorage and redirects to homepage
// The referral code is picked up during signup and subscription
export default function ReferralLandingPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      localStorage.setItem('vedicmind_ref', code.toUpperCase());
    }
    navigate('/', { replace: true });
  }, [code]);

  return null;
}
