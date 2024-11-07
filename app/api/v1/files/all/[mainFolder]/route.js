import fs from 'fs';
import path from 'path';

// Base directory for the uploads folder
const baseUploadDir = path.join(process.cwd(), 'public/uploads');

function getFileTree(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  return files.map((file) => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      return {
        type: 'folder',
        name: file.name,
        children: getFileTree(filePath),
      };
    }
    return {
      type: 'file',
      name: file.name,
      path: filePath,
    };
  });
}

export const GET = async (req, { params }) => {
    console.log("pass here")
  try {
    // Join the base directory with the requested path to avoid issues with inconsistent separators
    const mainFolderPath = path.join(baseUploadDir, params.mainFolder.replace(/\\/g, '/'));
    console.log("Resolved Path:", mainFolderPath);

    // Check if the path exists
    if (!fs.existsSync(mainFolderPath)) {
      throw new Error(`Directory does not exist: ${mainFolderPath}`);
    }

    const fileTree = getFileTree(mainFolderPath);
    return new Response(JSON.stringify({ fileTree }), { status: 200 });
  } catch (error) {
    console.log("Error fetching file tree:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
