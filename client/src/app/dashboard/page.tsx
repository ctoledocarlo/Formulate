"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;  // Show a loading message or spinner
  }

  if (!isAuthenticated) {
    return null;  // Prevent rendering if redirecting (optional)
  }

  const getCsrfToken = async () => {
    const response = await fetch('http://localhost:8000/api/surveys/csrf/', {
      credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
  };

  const handleLogout = async () => {
    try {
      const csrfToken = await getCsrfToken(); // Fetch CSRF token
      const logoutResponse = await fetch('http://localhost:8000/api/surveys/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Include CSRF token in headers
        },
      });
      
      console.log(logoutResponse);
      if (logoutResponse.ok) {
        console.log('Logged out successfully');
        router.push('/signin');
      } else {
        console.error('Logout failed:', logoutResponse.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E47] text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#272757] p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Formulate</div>
          <div className="space-x-4">
            <Link href="#" className="hover:text-[#6EACDA] transition duration-300">
              Home
            </Link>
            <Link href="#" className="hover:text-[#6EACDA] transition duration-300">
              Features
            </Link>
            <Link href="#" className="hover:text-[#6EACDA] transition duration-300">
              Pricing
            </Link>
            <Link href="#" className="hover:text-[#6EACDA] transition duration-300">
              Contact
            </Link>
            <Link href="#" onClick={handleLogout} className="hover:text-[#6EACDA] transition duration-300">
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center p-8 rounded-lg shadow-lg bg-[#272757] max-w-md w-full">
          <h1 className="text-3xl font-semibold text-[#E2E2B6] mb-4">Dashboard</h1>
          <p className="text-lg text-[#6EACDA] mb-8">
            Welcome to your dashboard! Here you can manage your account and view your data.
          </p>
          {/* Add more dashboard content here */}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#272757] p-4 text-center">
        <p className="text-sm">© 2025 Formulate. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
