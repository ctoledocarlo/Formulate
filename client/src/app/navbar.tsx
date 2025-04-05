'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from './supabase/supabaseClient'
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';


export default function Navbar() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            console.log(session)
            setLoading(false);
        };
    
        fetchSession();
    
        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });
    
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Sign out error:', error.message);
            return { error: error.message };
        }

        router.push('/signin');
        return { success: true };
    };

    return (
        <nav className="bg-[#272757] p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                
                {user ? 
                    (
                        <div className="flex items-center justify-between w-full">
                            <Link href="/dashboard" className="text-2xl font-bold hover:text-[#6EACDA]">
                                Formulate
                            </Link>

                            <div className="space-x-4"> 
                                <Link className="hover:text-[#6EACDA] transition duration-300" 
                                    href="/dashboard/createform">
                                    Create Form
                                </Link>

                                <button onClick={handleLogout} className="hover:text-[#6EACDA] transition duration-300">
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : 
                    (
                        <div className="flex items-center justify-between w-full">
                            <Link href="/" className="text-2xl font-bold hover:text-[#6EACDA]">
                                Formulate
                            </Link>

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
                    )
                }

            </div>
        </nav>
    );
}