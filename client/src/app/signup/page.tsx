"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, username, password } = formData;
    const response = await fetch('http://localhost:8000/api/surveys/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, username, password }),
      });
    
      if (response.ok) {
        const data = await response.json();
        console.log('User created successfully:', data);
      } else {
        const errorData = await response.json();
        console.error('Error creating user:', errorData);
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center p-8 rounded-lg shadow-lg bg-[#272757] max-w-md w-full">
          <h1 className="text-3xl font-semibold text-[#E2E2B6] mb-4">Sign Up</h1>
          <p className="text-lg text-[#6EACDA] mb-8">
            Create a new account to get started.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-left text-[#E2E2B6] mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6EACDA] bg-[#0F0E47] text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-left text-[#E2E2B6] mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6EACDA] bg-[#0F0E47] text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-left text-[#E2E2B6] mb-1">Email</label>
              <input
                type="email"
                name="username"
                id="username"
                placeholder="Email"
                value={formData.username}
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
              className="w-full bg-[#6EACDA] text-[#0F0E47] px-4 py-2 rounded-lg shadow-lg hover:bg-[#505081] transition duration-300"
            >
              Sign Up
            </button>
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

export default SignUp;