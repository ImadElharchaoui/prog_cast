"use client";

import { useEffect, useState } from 'react';
import PodcastCard from '@/Components/PodcastCard'; // Import your podcast card component

export default function UserProfile({ params }) {
  const { username } = params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    if (!username) return; // Wait for username to be available

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/v1/user/profile/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPodcasts = async () => {
      try {
        const response = await fetch(`/api/v1/podcasts/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user podcasts');
        }

        const data = await response.json();
        setPodcasts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserProfile();
    fetchUserPodcasts();
  }, [username]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>No user profile available.</p>;
  }

  return (
    <div className="max-w-2xl mx-20 p-6">
      <div className='flex mb-4'>
        <img src={user.image} alt="" className='h-20 w-20 rounded-full mr-4' />
        <div>
          <h1 className="text-3xl font-bold mb-4">{user.username}</h1>
          <p className="text-sm text-gray-600">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className='flex'>
        
        {podcasts.length === 0 ? (
          <p>No podcasts available.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {podcasts.map(podcast => (
              <PodcastCard key={podcast._id} podcast={podcast} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
