'use client';

import { useState } from 'react';
import { ApplicationType } from '../../src/core/types';

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
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Cursor Composer Automation</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={idea.name}
              onChange={(e) => setIdea({ ...idea, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={idea.title}
              onChange={(e) => setIdea({ ...idea, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
            <textarea
              id="description"
              value={idea.description}
              onChange={(e) => setIdea({ ...idea, description: e.target.value })}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-2">Type</label>
            <select
              id="type"
              value={idea.type}
              onChange={(e) => setIdea({ ...idea, type: e.target.value as ApplicationType })}
              className="w-full p-2 border rounded"
            >
              {Object.values(ApplicationType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="features" className="block text-sm font-medium mb-2">Features (comma-separated)</label>
            <input
              type="text"
              id="features"
              value={idea.features.join(', ')}
              onChange={(e) => setIdea({ ...idea, features: e.target.value.split(',').map(f => f.trim()) })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="technologies" className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
            <input
              type="text"
              id="technologies"
              value={idea.technologies.join(', ')}
              onChange={(e) => setIdea({ ...idea, technologies: e.target.value.split(',').map(t => t.trim()) })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="dependencies" className="block text-sm font-medium mb-2">Dependencies (comma-separated)</label>
            <input
              type="text"
              id="dependencies"
              value={idea.dependencies.join(', ')}
              onChange={(e) => setIdea({ ...idea, dependencies: e.target.value.split(',').map(d => d.trim()) })}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Processing...' : 'Process Idea'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Result</h2>
            <pre className="p-4 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
} 