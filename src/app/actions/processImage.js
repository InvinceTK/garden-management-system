// app/actions/processImage.js
'use server'

import { writeFile } from 'fs/promises';
import path from 'path';

export async function processImage(formData) {
  try {
    const file = formData.get('image');
    if (!file) {
      throw new Error('No image provided');
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);

    // Save the file
    await writeFile(filepath, buffer);

    // For now, just return the path to the saved image
    return { 
      success: true, 
      image: `/uploads/${filename}` 
    };

  } catch (error) {
    console.error('Error processing image:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}