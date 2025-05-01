'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from './supabase/supabaseClient'
import React, { useState, useEffect } from 'react';


export default function Navbar() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string>("")

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setAccessToken(session?.access_token ?? "")
            console.log(session)
            setLoading(false);
        };
    
        fetchSession();
    
        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            setAccessToken(session?.access_token ?? "")
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

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        console.log("Create Form clicked");

        const response = await fetch('http://localhost:8000/api/surveys/create_form/', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization': `Bearer ${accessToken}`
			},
		});

        console.log(response);
	
		if (response.ok) {
			const data = await response.json();
			console.log('Form created successfully:', data);
            router.push(`dashboard/forms/${data.form.form_id}`);
		} else {
			const errorData = await response.json();
			console.error('Error creating form:', errorData);
		}
    };

    return (
        <nav className="bg-[#272757] p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                
                {accessToken ? 
                    (
                        <div className="flex items-center justify-between w-full">
                            <Link href="/dashboard" className="text-2xl font-bold hover:text-[#6EACDA]">
                                Formulate
                            </Link>

                            <div className="space-x-4"> 
                                <button 
                                    onClick={handleClick} className="hover:text-[#6EACDA] transition duration-300 cursor-pointer">
                                    Create Form
                                </button>
                                
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