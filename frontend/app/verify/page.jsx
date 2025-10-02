// app/verify/page.js
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Verify() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token && email) {
      fetch(
        `http://localhost:4000/api/v1/auth/verify?token=${token}&email=${encodeURIComponent(
          email
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log('Verification response:', data);
          alert(data.message || 'Verification done');
          window.location.href = '/';
        })
        .catch((err) => console.error(err));
    }
  }, [token, email]);

  return <h1>Verifying your email...</h1>;
}
