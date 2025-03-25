'use client';

import { useState } from 'react';
import { ApplicationType } from '../../src/core/types';
import IdeaForm from './components/IdeaForm'

export default function Home() {
  const [idea, setIdea] = useState({
    name: '',
    title: '',
    description: '',
    type: ApplicationType.WEB,
    features: [],
    technologies: [],
    dependencies: []
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idea })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process idea');
      }

      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Cursor Composer Automation
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Transform your ideas into fully functional applications with AI-powered automation
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Submit Your Idea
          </h2>
          <IdeaForm />
        </div>
      </div>
    </div>
  );
} 