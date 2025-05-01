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
    const [accessToken, setAccessToken] = useState<string>("")

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
            setAccessToken(session?.access_token ?? "")
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
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/surveys/retrieve_user_forms/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                });
            
                if (response.ok) {
                    const data = await response.json();
                    setMyForms(data.forms);
                    console.log('User forms retrieved successfully:', data);
                } else {
                    const errorData = await response.json();
                    console.error('Error retrieving forms:', errorData);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [user, loading, router]);

    return (
        <div className="min-h-screen bg-[#0F0E47] text-white flex flex-col">
            <Navbar/>
            {/* Main Content */}
            <main className="flex-grow flex justify-center">
                <div className="text-left p-8 mt-4 shadow-lg bg-[#272757] w-99/100 rounded-lg">
                    <h1 className="text-2xl font-semibold mb-4">My Forms</h1>
                        <div className="w-full max-h-screen mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                            {myForms && myForms.length > 0 ? (
                                myForms.map((form) => (
                                    <div key={form.form_id} className="bg-[#0F0E47] h-30 flex items-center justify-center rounded-lg shadow-lg p-4">
                                        <div className="text-center">
                                            <h2 className="font-bold text-lg">{form.form_name}</h2>
                                            <p className="text-sm">{form.form_description}</p>
                                            <Link href={`dashboard/forms/${form.form_id}`} className="text-blue-400 underline mt-2 block">View Form</Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-full text-center">No forms found.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
