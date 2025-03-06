"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";
import * as Templates from "./templates";

const CreateForm: React.FC = () => {
	const [isClient, setIsClient] = useState(false);
	const [selectedType, setSelectedType] = useState("");
	const [questions, setQuestions] = useState<{ id: number; type: string; value: string | string[] }[]>([]);	
	const [optionQuestions, setOptionQuestions] = useState<{ id: number; type: string; value: string | string[], options: string[] }[]>([]);	
	// try this later

	const [formData, setFormData] = useState({
		formTitle: "",
		formDescription: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	useEffect(() => {
		setIsClient(true);
	}, []);

	useAuth(); // Ensure it runs after hydration

	if (!isClient) return null; // Avoid mismatches by not rendering on the server

	const addQuestion = (type: "shortAnswer" | "longAnswer" | "multipleChoice" | "checkboxes" | "dropdown" | "date") => {
		setQuestions((prevQuestions) => [
			...prevQuestions,
			{ id: Date.now(), type, value: type === "multipleChoice" || type === "checkboxes" || type === "dropdown" ? [""] : "" }
		]);
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedType(e.target.value);
	  };
	  
	const handleAddQuestion = () => {
		if (selectedType) {
			addQuestion(selectedType as "shortAnswer" | "longAnswer" | "multipleChoice" | "checkboxes" | "dropdown" | "date");
		}
	};

	const handleQuestionChange = (id: number, value: string | string[]) => {
		setQuestions((prevQuestions) =>
			prevQuestions.map((q) => (q.id === id ? { ...q, value } : q))
		);
	};

	const updateOptionValue = (q: { id: number; type: string; value: string | string[] }, index: number, value: string) => {
		if (Array.isArray(q.value)) {
			return { ...q, value: q.value.map((opt, i) => (i === index ? value : opt)) };
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
				q.id === id ? { ...q, value: [...q.value, ""] } : q
			)
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form Submitted");
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
											options={q.value}
											onChange={(index: number, val: string) => handleOptionChange(q.id, index, val)}
											addOption={() => addOption(q.id)}
										/>
									);
								case "checkboxes":
									return (
										<Templates.CheckboxQuestion
											key={q.id}
											name={`question_${q.id}`}
											value={q.value}
											options={q.value}
											onChange={(index: number, val: string) => handleOptionChange(q.id, index, val)}
											addOption={() => addOption(q.id)}
										/>
									);
								case "dropdown":
									return (
										<Templates.DropdownQuestion
											key={q.id}
											name={`question_${q.id}`}
											value={q.value}
											options={q.value}
											onChange={(index: number, val: string) => handleOptionChange(q.id, index, val)}
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

						<button onClick={() => handleSubmit}
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
