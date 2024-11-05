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

    const saveFile = async (file, folder) => {
      const relativePath = path.join('uploads', folder, file.webkitRelativePath || file.name);
      const absolutePath = path.join(process.cwd(), 'public', relativePath);
    
      // Ensure the directory exists
      const dir = path.dirname(absolutePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(absolutePath, buffer);
    
      return relativePath;
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
      image: imageFilePath,  
      programmingFiles: programmingFilePaths,
      // Store the selected categories
    });

    await podcast.save();

    return NextResponse.json({ message: 'Podcast created successfully' });
  } catch (error) {
    console.error('Error creating podcast:', error);
    return NextResponse.json({ error: 'Failed to create podcast' }, { status: 500 });
  }
}
