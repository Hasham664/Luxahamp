// app/reset-password/page.jsx
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token');
  const email = params.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token || !email) setMessage('Invalid or missing reset token/email.');
  }, [token, email]);

  const handleSubmit = async () => {
    if (!token || !email) return setMessage('Missing token/email in URL.');
    if (newPassword.length < 6)
      return setMessage('Password must be at least 6 characters.');
    if (newPassword !== confirmPassword)
      return setMessage('Passwords do not match.');

    setLoading(true);
    try {
      const res = await fetch(
        'http://localhost:4000/api/v1/auth/reset-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            email,
            newPassword,
            confirmPassword,
          }),
        }
      );
      const data = await res.json();
      setLoading(false);
      setMessage(
        data.message || (data.success ? 'Password updated' : 'Failed to update')
      );
      if (data.success) {
        // optional: redirect to login after a short delay
        setTimeout(() => router.push('/login'), 1500);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage('Network error. Check console.');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 420 }}>
      <h1>Reset password</h1>
      {message && <p>{message}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type='password'
          placeholder='New password'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type='password'
          placeholder='Confirm new password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
}
