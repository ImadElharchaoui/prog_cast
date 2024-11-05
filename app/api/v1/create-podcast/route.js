import { NextResponse } from 'next/server';
import connection from '@/utils/database';
import Podcast from '@/models/podcast';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    await connection();

    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const audioFile = formData.get('audioFile');
    const imageFile = formData.get('imageFile');
    const userID = formData.get('userID');
    
    // Get all programming files from the folder
    const programmingFiles = formData.getAll('programmingFiles');
    const categories = formData.getAll('categories'); // Retrieve categories

    // Define a path to save the uploaded files
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // Function to save a file
    const saveFile = async (file, folder) => {
      const relativePath = file.webkitRelativePath || file.name;
      const filePath = path.join(uploadDir, folder, relativePath);
      const dirPath = path.dirname(filePath); 

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      return filePath;
    };

    const audioFilePath = await saveFile(audioFile, 'audio');
    const imageFilePath = await saveFile(imageFile, 'images');

    const programmingFilePaths = await Promise.all(
      programmingFiles.map((file) => saveFile(file, 'programming'))
    );

    const podcast = new Podcast({
      podcaster: userID,
      title,
      description,
      audioFile: audioFilePath, 
      imageFile: imageFilePath,  
      programmingFiles: programmingFilePaths,
      categories, // Store the selected categories
    });

    await podcast.save();

    return NextResponse.json({ message: 'Podcast created successfully' });
  } catch (error) {
    console.error('Error creating podcast:', error);
    return NextResponse.json({ error: 'Failed to create podcast' }, { status: 500 });
  }
}
