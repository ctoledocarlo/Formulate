import Link from 'next/link';
import Navbar from './navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F0E47] text-white flex flex-col">
      <Navbar/>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center p-10 rounded-lg shadow-2xl bg-[#272757] max-w-lg">
          <h1 className="text-5xl font-bold mb-6">Welcome to Formulate!</h1>
          <p className="text-xl mb-10">
            Build and manage your surveys effortlessly. Sign in or sign up to get started.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/signin" className="bg-[#6EACDA] text-[#0F0E47] px-8 py-3 rounded-lg shadow-lg hover:bg-[#505081] transition duration-300">
              Sign In
            </Link>
            <Link href="/signup" className="bg-[#6EACDA] text-[#0F0E47] px-8 py-3 rounded-lg shadow-lg hover:bg-[#505081] transition duration-300">
              Sign Up
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#272757] p-4 text-center">
        <p className="text-sm">© 2025 Formulate. All rights reserved.</p>
      </footer>
    </div>
  );
}
