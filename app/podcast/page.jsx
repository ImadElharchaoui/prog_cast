"use client";

import { useEffect, useState } from 'react';
import PodcastCard from '@/Components/PodcastCard'; // Adjust the path based on your folder structure

export default function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch('/api/v1/podcasts/all');
        const data = await response.json();
        setPodcasts(data);
      } catch (error) {
        console.error('Failed to fetch podcasts:', error);
      }
    };

    fetchPodcasts();
  }, []);

  return (
    <div className="max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-4">Podcasts</h1>
      {podcasts.length === 0 ? (
        <p>No podcasts available.</p>
      ) : (
        <ul className="flex space-y-4">
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast._id} podcast={podcast} />
          ))}
        </ul>
      )}
    </div>
  );
}
