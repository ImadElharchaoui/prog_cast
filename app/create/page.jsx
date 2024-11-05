"use client";

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreatePodcast() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [programmingFiles, setProgrammingFiles] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const route = useRouter();

  const handleAudioFileChange = (e) => setAudioFile(e.target.files[0]);
  const handleImageFileChange = (e) => setImageFile(e.target.files[0]);
  const handleProgrammingFilesChange = (e) => setProgrammingFiles([...e.target.files]);

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setCategories(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('userID', Cookies.get("userID"));
    formData.append('title', title);
    formData.append('description', description);
    formData.append('audioFile', audioFile);
    formData.append('imageFile', imageFile);
    programmingFiles.forEach((file) => formData.append('programmingFiles', file));
    categories.forEach((category) => formData.append('categories', category)); // Append categories

    const response = await fetch('/api/v1/create-podcast', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Podcast created successfully');
      route.push("/");
      // Reset form or redirect as needed
    } else {
      console.error('Error creating podcast');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Podcast</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Podcast Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioFileChange}
            required
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Podcast Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            required
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Programming Files</label>
          <input
            type="file"
            webkitdirectory="true" // folder
            onChange={handleProgrammingFilesChange}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Categories</label>
          <select
            multiple
            value={categories}
            onChange={handleCategoryChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            {/* Replace with your categories */}
            <option value="technology">Technology</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="entertainment">Entertainment</option>
            <option value="science">Science</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm font-serif text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700"
        >
          Submit Podcast
        </button>
      </form>
    </div>
  );
}
