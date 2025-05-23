"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as Templates from "../templates";

import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabase/supabaseClient'
import { User } from '@supabase/supabase-js';
import Navbar from '../../../navbar';

const CreateForm: React.FC = () => {
	const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
	const [accessToken, setAccessToken] = useState<string>("")
    const [loading, setLoading] = useState(true);

	const [isClient, setIsClient] = useState(false);
	const [selectedType, setSelectedType] = useState("");
	const [questions, setQuestions] = useState<{ 
		id: number; 
		type: string; 
		value: string;
		options?: string[] 
	}[]>([]);		

	const [formData, setFormData] = useState({
		formTitle: "",
		formDescription: "",
	});

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
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
        }
    
    }, [user, loading, router]);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	if (!isClient) return null; 

	const addQuestion = (type: "shortAnswer" | "longAnswer" | "multipleChoice" | "checkboxes" | "dropdown" | "date") => {
		setQuestions((prevQuestions) => [
			...prevQuestions,
			{ 	id: Date.now(), 
				type, 
				value: "",
				options: type === "multipleChoice" || type === "checkboxes" || type === "dropdown" ? [""] : undefined
			}
		]);
	};

	const handleAddQuestion = () => {
		if (selectedType) {
			addQuestion(selectedType as "shortAnswer" | "longAnswer" | "multipleChoice" | "checkboxes" | "dropdown" | "date");
		}

		console.log(questions)
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedType(e.target.value);
	};

	const handleQuestionChange = (id: number, value: string) => {
		setQuestions((prevQuestions) =>
			prevQuestions.map((q) => {
				if (q.id === id) {
					return { ...q, value };
				}
				return q;
			})
		);
	};

	const updateOptionValue = (q: { id: number; type: string; value: string; options?: string[] }, index: number, value: string) => {
		if (Array.isArray(q.options)) {
			return { ...q, options: q.options.map((opt, i) => (i === index ? value : opt)) };
		}
		return q; 
	};

	const handleOptionChange = (id: number, index: number, value: string) => {
		setQuestions((prevQuestions) =>
			prevQuestions.map((q) =>
				q.id === id ? updateOptionValue(q, index, value) : q
			)
		);
	};

	const addOption = (id: number) => {
		setQuestions((prevQuestions) =>
			prevQuestions.map((q) =>
				q.id === id 
					? { ...q, options: q.options ? [...q.options, ""] : [""] }
					: q
			)
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form Submitted");
	};

	const handleFormulate = async (e: React.FormEvent) => {
		e.preventDefault();

		const formMetadata = {
			form_name: formData.formTitle,
			form_description: formData.formDescription,
			id: user?.id,
			questions
		}

		console.log(formMetadata);
		
		const response = await fetch('http://localhost:8000/api/surveys/create_form/', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization': `Bearer ${accessToken}`
			},
			body: JSON.stringify( formMetadata ),
		});
	
		if (response.ok) {
			const data = await response.json();
			console.log('Form created successfully:', data);
		} else {
			const errorData = await response.json();
			console.error('Error creating form:', errorData);
		}
	};

	return (
		<div className="min-h-screen bg-[#0F0E47] text-white flex flex-col">

			<Navbar/>

			{/* Main Content */}
			<main className="flex-grow flex items-start justify-center">
				<div className="w-4/5 mx-auto max-w-4xl mx-auto mt-6 space-y-6">
					<form onSubmit={handleSubmit} className="space-y-6">

						{/* Form Title and Description */}
						<div className="text-center p-6 rounded-lg shadow-lg bg-[#272757] w-full">
							<input
								type="text"
								name="formTitle"
								value={formData.formTitle}  
								onChange={handleChange}
								placeholder="Title"
								className="w-full px-4 mb-4 py-3 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
							/>
							<textarea
								name="formDescription" 
								value={formData.formDescription} 
								onChange={handleChange}
								placeholder="Description"
								className="w-full px-4 py-2 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
							/>
						</div>

						{questions.map((q) => {
							switch (q.type) {
								case "shortAnswer":
									return (
										<Templates.ShortAnswerQuestion
											key={q.id}
											name={`question_${q.id}`}
											value={q.value}
											onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleQuestionChange(q.id, e.target.value)}
										/>
									);
								case "longAnswer":
									return (
										<Templates.LongAnswerQuestion
											key={q.id}
											name={`question_${q.id}`}
											value={q.value}
											onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleQuestionChange(q.id, e.target.value)}
										/>
									);
								case "multipleChoice":
									return (
										<Templates.MultipleChoiceQuestion
											key={q.id}
											name={`question_${q.id}`}
											value={q.value}
											options={q.options}
											onOptionChange={(index: number, val: string) => handleOptionChange(q.id, index, val)}
											onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleQuestionChange(q.id, e.target.value)}
											addOption={() => addOption(q.id)}
										/>
									);
								case "checkboxes":
									return (
										<Templates.CheckboxQuestion
											key={q.id}
											name={`question_${q.id}`}
											value={q.value}
											options={q.options}
											onOptionChange={(index: number, val: string) => handleOptionChange(q.id, index, val)}
											onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleQuestionChange(q.id, e.target.value)}
											addOption={() => addOption(q.id)}
										/>
									);
								case "dropdown":
									return (
										<Templates.DropdownQuestion
											key={q.id}
											name={`question_${q.id}`}
											value={q.value}
											options={q.options}
											onOptionChange={(index: number, val: string) => handleOptionChange(q.id, index, val)}
											onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleQuestionChange(q.id, e.target.value)}
											addOption={() => addOption(q.id)}
										/>
									);
								case "date":
									return (
										<Templates.DateQuestion
											key={q.id}
											name={`question_${q.id}`}
											value={q.value}
											onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleQuestionChange(q.id, e.target.value)}
										/>
									);
								default:
									return null;
							}
						})}

						{/* Add Question */}
						<div className="flex space-x-3">
							<select 
								onChange={handleSelectChange} 
								value={selectedType}
								className="w-full px-4 py-2 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
							>
								<option value="">Select Question Type</option>
								<option value="shortAnswer">Short Answer</option>
								<option value="longAnswer">Long Answer</option>
								<option value="multipleChoice">Multiple Choice</option>
								<option value="checkboxes">Checkboxes</option>
								<option value="dropdown">Dropdown</option>
								<option value="date">Date</option>
							</select>

							<button 
								onClick={handleAddQuestion} 
								disabled={!selectedType} 
								className="bg-[#6EACDA] text-[#0F0E47] px-4 py-2 rounded-lg shadow-md hover:bg-[#505081] transition duration-300 disabled:opacity-50"
							>
								Add Question
							</button>
							</div>

						<button onClick={handleFormulate}
							className="bg-[#6EACDA] text-[#0F0E47] px-4 mb-10 py-3 rounded-lg shadow-md hover:bg-[#505081] transition duration-300 mt-2">
							Formulate
						</button>
					</form>
				</div>
			</main>

		</div>
	);
};

export default CreateForm;