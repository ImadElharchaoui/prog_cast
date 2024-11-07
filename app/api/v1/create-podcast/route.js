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
    
    // Retrieve all programming files and categories
    const programmingFiles = formData.getAll('programmingFiles');
    const categories = formData.getAll('categories');

    // Define base upload directory within 'public' for public accessibility
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Helper function to save individual files
    const saveFile = async (file, folder) => {
      const relativePath = path.join('uploads', folder, file.webkitRelativePath || file.name);
      const absolutePath = path.join(process.cwd(), 'public', relativePath);

      const dir = path.dirname(absolutePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(absolutePath, buffer);

      return relativePath;
    };

    // Save audio and image files as usual
    const audioFilePath = await saveFile(audioFile, 'audio');
    const imageFilePath = await saveFile(imageFile, 'images');

    // Create a folder for programming files
    const programmingFolder = path.join('uploads', 'programming', `${userID}_${Date.now()}`);
    const programmingFolderPath = path.join(process.cwd(), 'public', programmingFolder);
    if (!fs.existsSync(programmingFolderPath)) {
      fs.mkdirSync(programmingFolderPath, { recursive: true });
    }

    // Save each programming file to this folder
    await Promise.all(
      programmingFiles.map((file) => saveFile(file, programmingFolder))
    );

    // Create and save the new Podcast document
    const podcast = new Podcast({
      podcaster: userID,
      title,
      description,
      audioFile: audioFilePath,
      image: imageFilePath,
      programmingFiles: programmingFolder,  // Save only the folder path
      
    });

    await podcast.save();

    return NextResponse.json({ message: 'Podcast created successfully' });
  } catch (error) {
    console.error('Error creating podcast:', error);
    return NextResponse.json({ error: 'Failed to create podcast' }, { status: 500 });
  }
}
