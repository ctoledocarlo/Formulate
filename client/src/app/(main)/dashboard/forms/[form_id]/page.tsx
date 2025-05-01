'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../supabase/supabaseClient';
import { User } from '@supabase/supabase-js';
import * as Templates from '../../templates';

import Navbar from '../../../../navbar';

interface Question {
  id: number;
  type: string;
  value: string;
  options?: string[];
}

interface Form {
  form_id: string;
  form_name: string;
  form_description: string;
  questions: Question[];
  responses: object;
  id: string;
}

export default function ViewAndEditForm() {
  const { form_id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [accessToken, setAccessToken] = useState<string>('');

  const [formMetaData, setFormMetaData] = useState({
    form_name: '',
    form_description: '',
  });

  const [questions, setQuestions] = useState<Question[]>([]);

  // Session and Authentication
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? '');
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? '');
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Form population
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/surveys/forms/retrieve_form/?form_id=${form_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setForm(data.form['0']);
          setQuestions(data.form['0'].questions);
          setFormMetaData({
            form_name: data.form['0'].form_name,
            form_description: data.form['0'].form_description,
          });
        } else {
          const errorData = await response.json();
          console.error('Error retrieving form:', errorData);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (user && accessToken) {
      fetchData();
    }
  }, [user, accessToken, loading, form_id]);

  // Update form metadata
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormMetaData({ ...formMetaData, [name]: value });
  };

  // Update question value
  const handleQuestionChange = (id: number, value: string) => {
    setForm((prevForm) =>
      prevForm
        ? {
            ...prevForm,
            questions: prevForm.questions.map((q) =>
              q.id === id ? { ...q, value } : q
            ),
          }
        : prevForm
    );
  };

  // Update question options
  const handleOptionChange = (id: number, index: number, value: string) => {
    setForm((prevForm) =>
      prevForm
        ? {
            ...prevForm,
            questions: prevForm.questions.map((q) =>
              q.id === id && Array.isArray(q.options)
                ? {
                    ...q,
                    options: q.options.map((opt, i) =>
                      i === index ? value : opt
                    ),
                  }
                : q
            ),
          }
        : prevForm
    );
  };

  // Add a new question
  const addQuestion = (type: "shortAnswer" | "longAnswer" | "multipleChoice" | "checkboxes" | "dropdown" | "date") => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: Date.now(),
        type,
        value: '',
        options: type === 'multipleChoice' || type === 'checkboxes' || type === 'dropdown' ? [''] : undefined,
      },
    ]);
  };

  const handleAddQuestion = () => {
    if (selectedType) {
      addQuestion(selectedType as "shortAnswer" | "longAnswer" | "multipleChoice" | "checkboxes" | "dropdown" | "date");
    }
  };

  // Add an option to a question
  const addOption = (id: number) => {
    setForm((prevForm) =>
      prevForm
        ? {
            ...prevForm,
            questions: prevForm.questions.map((q) =>
              q.id === id
                ? {
                    ...q,
                    options: q.options ? [...q.options, ''] : [''],
                  }
                : q
            ),
          }
        : prevForm
    );
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted');
  };

  // Handle form update submission
  const handleFormUpdate = async () => {
    if (!form) return;

    const updatedForm = {
      form_id: form.form_id,
      authorId: form.form_id,
      form_name: formMetaData.form_name,
      form_description: formMetaData.form_description,
      questions: questions,
      responses: form.responses,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/surveys/forms/edit_form/?form_id=${form.form_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedForm),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Form updated successfully:', data);
        alert('Form updated!');
      } else {
        const errorData = await response.json();
        console.error('Error updating form:', errorData);
        alert('Error updating form.');
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  if (loading || !form) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0F0E47] text-white flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex items-start justify-center">
        <div className="w-4/5 mx-auto max-w-4xl mx-auto mt-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Form Title and Description */}
            <div className="text-center p-6 rounded-lg shadow-lg bg-[#272757] w-full">
              <input
                type="text"
                name="form_name"
                value={formMetaData.form_name}  
                onChange={handleChange}
                placeholder="Title"
                className="w-full px-4 mb-4 py-3 border rounded-lg bg-[#0F0E47] text-white focus:ring-2 focus:ring-[#6EACDA]"
              />
              <textarea
                name="form_description" 
                value={formMetaData.form_description} 
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
                default:
                  return null;
              }
            })}

            {/* Add a Question */}
            <div className="flex justify-between items-center">
              <select
                value={selectedType}
                onChange={handleSelectChange}
                className="bg-[#0F0E47] text-white border-2 border-[#6EACDA] p-2 rounded-md"
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
                type="button"
                onClick={handleAddQuestion}
                className="bg-[#6EACDA] px-4 py-2 rounded-lg text-white hover:bg-[#5e9bb7]"
              >
                Add Question
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleFormUpdate}
              className="w-full bg-[#6EACDA] py-3 rounded-lg text-white hover:bg-[#5e9bb7]"
            >
              Update Form
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
