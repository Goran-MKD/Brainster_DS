"use client";

import { useState } from 'react';
import Cookies from 'js-cookie';
import { generateProductDescription } from '@/lib/api';

export default function ProductDescriptionGenerator({ onGenerationSuccess }) {
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGeneratedDescription('');

    const token = Cookies.get('token');
    if (!token) {
      setError('You are not logged in.');
      setIsLoading(false);
      return;
    }

    try {
      const featuresArray = features.split(',').map(f => f.trim());
      const description = await generateProductDescription(token, productName, featuresArray);
      setGeneratedDescription(description);
      onGenerationSuccess(); // Notify parent component to refresh user data
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-6 mt-6 bg-white border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Product Description Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Key Features (comma-separated)</label>
          <input
            type="text"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-md" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Description'}
        </button>
      </form>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      {generatedDescription && (
        <div className="p-4 mt-4 bg-gray-100 border rounded-md">
          <h3 className="font-semibold">Generated Description:</h3>
          <p className="mt-2">{generatedDescription}</p>
        </div>
      )}
    </div>
  );
}
