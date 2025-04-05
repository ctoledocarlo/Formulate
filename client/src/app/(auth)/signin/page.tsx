'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../navbar';

import { supabase } from '../../supabase/supabaseClient'

const SignIn: React.FC = () => {
  const [loginMessage, setLoginMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    const { email, password } = formData;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log("Sign-in response:", data, error);

    const session = await supabase.auth.getSession();
    console.log("Current session:", session);

    const user = data.user

    if (error) {
      console.error('Sign in error:', error.message);
      setLoading(false)
      setLoginMessage("Invalid Credentials")
      return { error: error.message };}

    if (user) {
      router.push('/dashboard');
    }
    
    setLoading(false)
    return { user };
  };

  return (
    <div className="min-h-screen bg-[#0F0E47] text-white flex flex-col">
      <Navbar/>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center p-8 rounded-lg shadow-lg bg-[#272757] max-w-md w-full">
          <h1 className="text-3xl font-semibold text-[#E2E2B6] mb-4">Sign In</h1>
          <p className="text-lg text-[#6EACDA] mb-8">
            Please enter your credentials to sign in.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-left text-[#E2E2B6] mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6EACDA] bg-[#0F0E47] text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-left text-[#E2E2B6] mb-1">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6EACDA] bg-[#0F0E47] text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6EACDA] text-[#0F0E47] px-4 py-2 rounded-lg shadow-lg hover:bg-[#505081] transition duration-300"
            >
              {loading ? 'Signing in...': 'Sign In'}
            </button>
            <p className="text-sm text-[#fa8072] mb-3">{loginMessage}</p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#272757] p-4 text-center">
        <p className="text-sm">© 2025 Formulate. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default SignIn;
