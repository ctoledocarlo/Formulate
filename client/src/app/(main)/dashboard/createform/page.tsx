"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";

const CreateForm: React.FC = () => {
	const [isClient, setIsClient] = useState(false);
	const [formData, setFormData] = useState({
		shortAnswer: "",
		longAnswer: "",
		multipleChoice: "",
		checkboxes: [] as string[],
		dropdown: "",
		range: 50,
		date: "",
	});

	useEffect(() => {
		setIsClient(true);
	}, []);

	useAuth(); // Ensure it runs after hydration

	if (!isClient) return null; // Avoid mismatches by not rendering on the server

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = e.target;
		setFormData((prevData) => ({
			...prevData,
			checkboxes: checked ? [...prevData.checkboxes, value] : prevData.checkboxes.filter((item) => item !== value),
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form Submitted:", formData);
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
							Forms
						</Link>
						<Link href="#" className="hover:text-[#6EACDA] transition duration-300">
							Settings
						</Link>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="flex-grow flex items-start justify-center">
				<div className="w-4/5 mx-auto max-w-4xl mx-auto mt-6 space-y-6">
					<form onSubmit={handleSubmit} className="space-y-6">
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

						<div>
							<select
								name="addQuestion"
								value={formData.addQuestion}
								onChange={handleChange}
								className="w-full px-4 py-2 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
							>
								<option value="">Select Question Type</option>
								<option value="Choice 1">Short Answer</option>
								<option value="Choice 2">Long Answer</option>
								<option value="Choice 3">Multiple Choice</option>
								<option value="Choice 4">Checkboxes</option>
								<option value="Choice 5">Dropdown</option>
								<option value="Choice 6">Range</option>
								<option value="Choice 7">Date</option>
							</select>
						</div>
					</form>
				</div>
			</main>

		</div>
	);
};

export default CreateForm;
