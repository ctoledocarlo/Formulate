"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase/supabaseClient'
import { User } from '@supabase/supabase-js';
import Navbar from '../../navbar';

const Dashboard: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    interface Form {
        form_id: string;
        form_name: string;
        form_description: string;
        questions: string[];
        responses: object;
        id: string;
      }

    const [myForms, setMyForms] = useState<Form[] | null>(null)


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
    
    useEffect(() => {
        if (!loading && !user) {
            router.push('/signin');
        }
    
    }, [user, loading, router]);

    return (
        <div className="min-h-screen bg-[#0F0E47] text-white flex flex-col">
            <Navbar/>
            {/* Main Content */}
            <main className="flex-grow flex justify-center">
                <div className="text-left p-8 mt-4 shadow-lg bg-[#272757] w-99/100 rounded-lg">
                    <h1 className="text-2xl font-semibold mb-4">My Forms</h1>

                    {/* Grid container with scrollable behavior */}
                    <div className="w-full max-h-screen mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 15 }).map((_, index) => (
                            <div key={index} className="bg-[#0F0E47] h-30 flex items-center justify-center rounded-lg shadow-lg">
                                <div className="text-center">
                                    <h2 className="font-bold">Form Item {index + 1}</h2>
                                    <p className="text-sm">Description for form item {index + 1}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
