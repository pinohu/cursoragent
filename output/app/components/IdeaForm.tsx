'use client'

import { useState } from 'react'

interface IdeaFormData {
  name: string
  title?: string
  description: string
  applicationType: string
  features: string
  technologies: string
  dependencies: string
}

export default function IdeaForm() {
  const [formData, setFormData] = useState<IdeaFormData>({
    name: '',
    title: '',
    description: '',
    applicationType: '',
    features: '',
    technologies: '',
    dependencies: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to process idea')
      }

      setSuccess(true)
      setFormData({
        name: '',
        title: '',
        description: '',
        applicationType: '',
        features: '',
        technologies: '',
        dependencies: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title (Optional)
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="applicationType" className="block text-sm font-medium text-gray-700">
          Application Type *
        </label>
        <select
          id="applicationType"
          name="applicationType"
          required
          value={formData.applicationType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="">Select a type</option>
          <option value="web">Web Application</option>
          <option value="mobile">Mobile Application</option>
          <option value="desktop">Desktop Application</option>
          <option value="cli">Command Line Tool</option>
        </select>
      </div>

      <div>
        <label htmlFor="features" className="block text-sm font-medium text-gray-700">
          Features (comma-separated) *
        </label>
        <input
          type="text"
          id="features"
          name="features"
          required
          value={formData.features}
          onChange={handleChange}
          placeholder="e.g., user authentication, data visualization, API integration"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">
          Technologies (comma-separated) *
        </label>
        <input
          type="text"
          id="technologies"
          name="technologies"
          required
          value={formData.technologies}
          onChange={handleChange}
          placeholder="e.g., React, Node.js, MongoDB"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="dependencies" className="block text-sm font-medium text-gray-700">
          Dependencies (comma-separated) *
        </label>
        <input
          type="text"
          id="dependencies"
          name="dependencies"
          required
          value={formData.dependencies}
          onChange={handleChange}
          placeholder="e.g., axios, express, mongoose"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {success && (
        <div className="text-green-600 text-sm">Idea submitted successfully!</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Processing...' : 'Submit Idea'}
      </button>
    </form>
  )
} 