"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

export default function FileExplorer({ mainFolder, podcastID, user, podcast }) {
  const [fileTree, setFileTree] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);
  const BasePath = "http://localhost:3000/";

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/v1/files/all/${encodeURIComponent(mainFolder)}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setFileTree(data.fileTree);
      } catch (err) {
        setError(err.message || "Failed to load files");
      } finally {
        setLoading(false);
      }
    };

    const fetchIsFollowing = async () => {
      try {
        const response = await fetch("/api/v1/follow/isFollow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: Cookies.get("userID"), podcasterName: user.username }),
        });
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFiles();
    fetchIsFollowing();
  }, [mainFolder, podcastID, user.username]);

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/v1/follow/makeFollow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: Cookies.get("userID"), podcasterName: user.username }),
      });
      const data = await response.json();
      if (data.message === "Followed successfully") setIsFollowing(true);
      user.totalSubs++;
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`/api/v1/follow/removeFollow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: Cookies.get("userID"), podcasterName: user.username }),
      });
      const data = await response.json();
      if (data.message === "Unfollowed successfully") setIsFollowing(false);
      user.totalSubs--;
    } catch (err) {
      console.log(err);
    }
  };

  const toggleFolder = (folderName) => {
    setExpandedFolders((prev) => {
      const newExpanded = new Set(prev);
      newExpanded.has(folderName) ? newExpanded.delete(folderName) : newExpanded.add(folderName);
      return newExpanded;
    });
  };

  const handleFileClick = async (filePath, fileName) => {
    setSelectedFile(fileName);
    try {
      const fullPath = `C:\\Users\\ULTRAPC\\Desktop\\Projects\\nextapp\\prog-cast\\public\\uploads\\${mainFolder}\\${filePath}`;
      const response = await fetch(`/api/v1/files/${encodeURIComponent(fullPath)}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setSelectedFileContent(data.content || "No content available.");
    } catch (err) {
      setError(err.message || "Failed to load file content");
    }
  };

  const renderFileTree = (nodes, path = "") =>
    Array.isArray(nodes)
      ? nodes.map((node) => {
          const newPath = path ? `${path}/${node.name}` : node.name;
          if (node.type === "file") {
            return (
              <li key={newPath} className="flex items-center mb-1">
                <span className="text-gray-500 mr-2">📄</span>
                <span
                  onClick={() => handleFileClick(newPath, node.name)}
                  className={`cursor-pointer hover:text-blue-600 ${
                    selectedFile === node.name ? "text-blue-600" : "text-gray-800"
                  }`}
                >
                  {node.name}
                </span>
              </li>
            );
          }
          return (
            <li key={newPath} className="mb-1">
              <div
                onClick={() => toggleFolder(newPath)}
                className="flex items-center font-semibold text-blue-600 cursor-pointer"
              >
                <span className="mr-2">{expandedFolders.has(newPath) ? "📂" : "📁"}</span>
                {node.name}
              </div>
              {expandedFolders.has(newPath) && (
                <ul className="ml-6">{renderFileTree(node.children, newPath)}</ul>
              )}
            </li>
          );
        })
      : null;

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setAudioProgress((currentTime / duration) * 100 || 0);
  };

  const handleSliderChange = (e) => {
    const value = e.target.value;
    setAudioProgress(value);
    if (audioRef.current) {
      audioRef.current.currentTime = (audioRef.current.duration * value) / 100;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col h-screen">
      {/* Main content section */}
      <div className="flex flex-1">
        {/* File explorer section */}
        <aside className="w-1/4 bg-gray-100 p-4 border-r border-gray-300 overflow-y-auto">
          <ul className="space-y-1">{renderFileTree(fileTree)}</ul>
        </aside>

        {/* File preview section */}
        <main className="flex-1 p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            {selectedFile || "Select a file"}
          </h2>
          <textarea
            readOnly
            value={selectedFileContent}
            className="w-full h-[calc(100%-2rem)] p-2 bg-white border border-gray-300 rounded resize-none focus:outline-none"
          />
        </main>
      </div>

      {/* Bottom section with user and audio controls */}
      <div className="flex flex-col w-full bg-white border-t border-gray-300 p-4 space-x-4">
        {/* Audio player */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center mt-2 space-x-4 mb-6">
            <button onClick={handlePlayPause} className="p-2 bg-blue-500 text-white rounded w-16">
              {isPlaying ? "Pause" : "Play"}
            </button>
            <audio
              ref={audioRef}
              src={BasePath + podcast.audioFile}
              onTimeUpdate={handleAudioTimeUpdate}
              className="hidden"
            />
            <input
              type="range"
              className="w-full"
              value={audioProgress}
              onChange={handleSliderChange}
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{podcast.title}</h1>
        </div>

        {/* User info */}
        <div className="flex items-center space-x-4 pt-8 mt-4">
          <img src={user.image} alt="" className="h-14 w-14 rounded-full" />
          <div>
            <h3 className="text-lg font-bold text-gray-800">{user.username}</h3>
            <p className="text-sm text-gray-600">{user.totalSubs} followers</p>
          </div>
          <div>
            {Cookies.get("userID") !== user._id && (
              <button
                className="w-32 py-1 rounded-md bg-secondary text-white"
                onClick={isFollowing ? handleUnfollow : handleFollow}
              >
                {isFollowing ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 bg-gray-300 text-black rounded-xl p-4">
          <div className="flex mb-4">
            <p>{podcast.views} views - </p>
            <p>{new Date(podcast.createdAt).toLocaleDateString()}</p>
          </div>
          <p>{podcast.description}</p>
        </div>
      </div>
    </div>
  );
}
