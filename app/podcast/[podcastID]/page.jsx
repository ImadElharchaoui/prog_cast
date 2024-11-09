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
      
      <div className=" bg-gray-100 h-[60%]">
        <h2 className="text-lg font-bold mb-2 text-gray-800">Podcast Files</h2>
        <FileExplorer mainFolder={podcast.programmingFiles} podcastID={podcastID} user={user} podcast={podcast} />
      </div>

    </div>
  );
}
