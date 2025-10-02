// 'use client';
// import { useState } from 'react';


// export default function Home() {
//   const [form, setForm] = useState({});
//   const [email, setEmail] = useState('');

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const callApi = async (endpoint, method = 'POST', body = {}) => {
//     try {
//       const res = await fetch(`http://localhost:4000/api/v1/auth/${endpoint}`, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include', // ✅ for cookies
//         body: method !== 'GET' ? JSON.stringify(body) : undefined,
//       });
//       const data = await res.json();
//       console.log(`${endpoint} response:`, data);
//       alert(`${endpoint} -> check console`);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Luxahamp Auth Test</h1>

//       {/* Signup */}
//       <h2>Signup</h2>
//       <input name='name' placeholder='Name' onChange={handleChange} />
//       <input name='email' placeholder='Email' onChange={handleChange} />
//       <input
//         name='password'
//         type='password'
//         placeholder='Password'
//         onChange={handleChange}
//       />
//       <input
//         name='confirmPassword'
//         type='password'
//         placeholder='Confirm Password'
//         onChange={handleChange}
//       />
//       <button onClick={() => callApi('signup', 'POST', form)}>Signup</button>

//       {/* Login */}
//       <h2>Login</h2>
//       <input
//         name='loginEmail'
//         placeholder='Email'
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         name='loginPassword'
//         type='password'
//         placeholder='Password'
//         onChange={handleChange}
//       />
//       <button
//         onClick={() =>
//           callApi('login', 'POST', { email, password: form.loginPassword })
//         }
//       >
//         Login
//       </button>

//       {/* Forgot Password */}
//       <h2>Forgot Password</h2>
//       <input
//         name='forgotEmail'
//         placeholder='Email'
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <button onClick={() => callApi('forgot-password', 'POST', { email })}>
//         Forgot Password
//       </button>

//       {/* Reset Password */}
//       <h2 className='text-red-500'>update Password</h2>
//       <input
//         name='currentPassword'
//         placeholder='currentPassword'
//         onChange={handleChange}
//       />
//       <input
//         name='newPassword'
//         placeholder='newPassword'
//         onChange={handleChange}
//       />

//       <input
//         name='confirmPassword'
//         type='password'
//         placeholder='confirmPassword'
//         onChange={handleChange}
//       />
//       <button onClick={() => callApi('reset-password', 'POST', form)}>
//         Reset Password
//       </button>

//       {/* Update Profile */}
//       <h2>Update Profile</h2>
//       <input
//         name='description'
//         placeholder='Description'
//         onChange={handleChange}
//       />
//       <button
//         onClick={() => callApi('me', 'PUT', { description: form.description })}
//       >
//         Update Profile
//       </button>
//     </div>
//   );
// }

// app/page.js

import HeroAllComponents from '@/components/home/HomeAllComponents';
export default async function Home() {
  return (
    <div className=''>
      <HeroAllComponents />
    </div>
  );
}
