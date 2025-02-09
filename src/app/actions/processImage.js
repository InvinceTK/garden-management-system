// app/actions/processImage.js
'use server'

import { writeFile } from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

export async function processImage(formData) {
  try {
    const file = formData.get('image');
    if (!file) {
      throw new Error('No image provided');
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filenames for input and output
    const timestamp = Date.now();
    const inputFilename = `${timestamp}-input-${file.name}`;
    const outputFilename = `${timestamp}-output-${file.name}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const inputPath = path.join(uploadDir, inputFilename);
    const outputPath = path.join(uploadDir, outputFilename);

    // Save the input file
    await writeFile(inputPath, buffer);

    // Process the image with the weed detection AI
    await detectWeeds(inputPath, outputPath);

    // Return both the original and processed image paths
    return { 
      success: true,
      originalImage: `/uploads/${inputFilename}`,
      processedImage: `/uploads/${outputFilename}`
    };

  } catch (error) {
    console.error('Error processing image:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

async function detectWeeds(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      // Use the Python interpreter from the virtual environment
      const pythonInterpreter = path.join(process.cwd(), 'scripts', 'venv', 'bin', 'python3');
      
      const pythonProcess = spawn(pythonInterpreter, [
        path.join(process.cwd(), 'scripts', 'detect_weeds.py'),
        inputPath,
        outputPath
      ]);
  
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
      });
  
      // Add stdout logging to help debug
      pythonProcess.stdout.on('data', (data) => {
        console.log(`Python output: ${data}`);
      });
  
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}`));
        } else {
          resolve();
        }
      });
    });
  }