import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// /ref/:code — saves referral code to localStorage and redirects to demo page
// Landing on /demo first lets the visitor try 3 questions before signing up —
// much stronger conversion than landing on the homepage cold.
export default function ReferralLandingPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      localStorage.setItem('vedicmind_ref', code.toUpperCase());
    }
    navigate('/demo', { replace: true });
  }, [code]);

  return null;
}
