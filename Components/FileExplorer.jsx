"use client";

import { useState, useEffect } from "react";

export default function FileExplorer({ mainFolder, podcastID }) {
  const [fileTree, setFileTree] = useState([]);  // Initialize as an array
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/v1/files/all/${encodeURIComponent(mainFolder)}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("data", data.fileTree)
        // Ensure data is an array before setting it to fileTree
        setFileTree(data.fileTree);
        console.log("fileTree", fileTree)
      } catch (err) {
        setError(err.message || "Failed to load files");
      } finally {
        setLoading(false); // Ensure loading is false after the fetch completes (success or failure)
      }
    };
    
    fetchFiles();
  }, [mainFolder, podcastID]);

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
        const fullPath = `C:\\Users\\ULTRAPC\\Desktop\\Projects\\nextapp\\prog-cast\\public\\uploads\\${mainFolder}\\${filePath}`
        console.log("path", fullPath)
      const response = await fetch(`/api/v1/files/${encodeURIComponent(fullPath)}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setSelectedFileContent(data.content || "No content available.");
    } catch (err) {
      setError(err.message || "Failed to load file content");
    }
  };

  const renderFileTree = (nodes, path = "") =>
    Array.isArray(nodes)  // Check if nodes is an array
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
                <ul className="ml-6">
                  {renderFileTree(node.children, newPath)}
                </ul>
              )}
            </li>
          );
        })
      : null;  // Return null if nodes is not an array

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex h-full">
      {/* Sidebar for File Management */}
      <aside className="w-1/4 bg-gray-100 p-4 border-r border-gray-300">
       
        <ul className="space-y-1">{renderFileTree(fileTree)}</ul>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* File Content Editor */}
        <div className="flex-1 p-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            {selectedFile || "Select a file"}
          </h2>
          <textarea
            readOnly
            value={selectedFileContent}
            className="w-full h-[90%] p-2 bg-white border border-gray-300 rounded resize-none focus:outline-none"
          />
        </div>
      </main>
    </div>
  );
}
