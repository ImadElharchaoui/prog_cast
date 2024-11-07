"use client";

import { useState, useEffect } from "react";
import FileExplorer from "@/Components/FileExplorer";  // Assuming the FileExplorer is in the same directory

export default function Page({ params }) {
  const podcastID = params.podcastID;
  const [podcast, setPodcast] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcastData = async () => {
      try {
        const response = await fetch(`/api/v1/podcasts/podcast/${podcastID}`);
        if (!response.ok) throw new Error("Failed to fetch podcast data");
        const data = await response.json();
        setPodcast(data);
        setUser(data.podcaster);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPodcastData();
  }, [podcastID]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col h-[90%]">
      {/* Left Sidebar for File Management */}
      {console.log("podcast",podcast)}
      <aside className=" bg-gray-100 h-[60%]">
        <h2 className="text-lg font-bold mb-2 text-gray-800">Podcast Files</h2>
        <FileExplorer mainFolder={podcast.programmingFiles} podcastID={podcastID} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-4 border-b border-gray-300">
          
          {/* Audio Player */}
          <div className="flex items-center space-x-4">
            <button className="p-2 bg-blue-500 text-white rounded">Play</button>
            <input type="range" className="w-32" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{podcast.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{podcast.description}</p>

        </div>

        {/* Bottom User Info */}
        <footer className="border-t border-gray-300 p-4 flex justify-between items-center bg-gray-100">
          {/* User Profile */}
          {user && (
            <div className="flex items-end">
                <img src={user.image} className="h-14 w-14 rounded-full mr-4" alt="" srcset="" />
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{user.username}</h3>
                    <p className="text-sm text-gray-600">{user.totalSubs} followers</p>
                </div>
              
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}
