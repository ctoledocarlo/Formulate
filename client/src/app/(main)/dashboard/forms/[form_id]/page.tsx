'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../supabase/supabaseClient';
import { User } from '@supabase/supabase-js';
import * as Templates from '../../templates';

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
  const [accessToken, setAccessToken] = useState<string>('');

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
          setForm(data.form["0"]);
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

  const handleFormUpdate = async () => {
    if (!form) return;

    const updatedForm = {
      form_id: form.form_id,
      form_name: form.form_name,
      form_description: form.form_description,
      questions: form.questions,
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
    <div className="p-6 text-white bg-[#0F0E47] min-h-screen">
      <h1 className="text-3xl font-bold mb-2">{form.form_name}</h1>
      <p className="mb-6">{form.form_description}</p>

      {form.questions.map((q) => {
        const sharedProps = {
            name: `question_${q.id}`,
            value: q.value,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleQuestionChange(q.id, e.target.value),
        };

        switch (q.type) {
          case 'shortAnswer':
            return <Templates.ShortAnswerQuestion key={q.id} {...sharedProps} />;
          case 'longAnswer':
            return <Templates.LongAnswerQuestion key={q.id} {...sharedProps} />;
          case 'multipleChoice':
            return (
              <Templates.MultipleChoiceQuestion 
                key={q.id}
                {...sharedProps}
                options={q.options}
                onOptionChange={(i: number, v: string) =>
                  handleOptionChange(q.id, i, v)
                }
                addOption={() => addOption(q.id)}
              />
            );
          case 'checkboxes':
            return (
              <Templates.CheckboxQuestion
                key={q.id}
                {...sharedProps}
                options={q.options}
                onOptionChange={(i: number, v: string) =>
                  handleOptionChange(q.id, i, v)
                }
                addOption={() => addOption(q.id)}
              />
            );
          case 'dropdown':
            return (
              <Templates.DropdownQuestion
                key={q.id}
                {...sharedProps}
                options={q.options}
                onOptionChange={(i: number, v: string) =>
                  handleOptionChange(q.id, i, v)
                }
                addOption={() => addOption(q.id)}
              />
            );
          case 'date':
            return <Templates.DateQuestion key={q.id} {...sharedProps} />;
          default:
            return null;
        }
      })}

      <button
        onClick={handleFormUpdate}
        className="mt-6 bg-[#6EACDA] text-[#0F0E47] px-6 py-3 rounded-lg shadow hover:bg-[#505081] transition"
      >
        Save Changes
      </button>
    </div>
  );
}
