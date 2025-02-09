import axios from 'axios'
import express, { type RequestHandler } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import fs from 'fs'
import os from 'os'
import path from 'path'
import config from 'config'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { createApi, withToken } from '@pexip/vpaas-api'
import { spawn } from 'child_process'

// Type definitions for weed detection
interface WeedDetectionRequest {
  image: string;
}

interface WeedDetectionResponse {
  success: boolean;
  num_detections?: number;
  weed_centres?: number[][];
  processed_image?: string; // base64-encoded processed image
  bounding_boxes?: number[][];
  error?: string;
}

const host: string = config.get('server.host')
const port: number = config.get('server.port')

const app = express()
app.use(helmet())
// Increase the JSON body size limit to support large base64 images
app.use(express.json({ limit: "50mb" })) 

const createJwt = (): string => {
  const apiAddress: string = config.get('vpaas.apiAddress')
  const authEndpoint = `${apiAddress}/oauth/token`
  const clientId = config.get('vpaas.credentials.clientId')
  const privateKey = fs.readFileSync(
    config.get('vpaas.credentials.privateKeyPath')
  )

  const scope = [
    'meeting:create',
    'meeting:read',
    'meeting:write',
    'participant:create',
    'participant:read',
    'participant:write'
  ]
  const requestId = uuidv4()

  const token = jwt.sign(
    {
      iss: clientId,
      sub: clientId,
      aud: authEndpoint,
      scope: scope.join(' ')
    },
    privateKey,
    {
      algorithm: 'RS384',
      expiresIn: '60s',
      jwtid: requestId
    }
  )

  return token
}

const api = withToken(createJwt, config.get('vpaas.apiAddress'))(createApi())

app.use(
  cors({
    origin: ["http://localhost:3000", `http://${host}:3000`],
  })
)

// VPaaS endpoints (unchanged) ...
app.get('/api-address', (async (req, res) => {
  res.send(config.get('vpaas.apiAddress'))
}) as RequestHandler)

app.post('/meetings', (async (req, res) => {
  try {
    const response = await api.create()
    if (response.status === 200) {
      return res.json(response.data)
    } else {
      return res.status(500).send(`Cannot create the meeting (res): ${response}`)
    }
  } catch (error) {
    return res.status(500).send(`Cannot create the meeting (error): ${error}`)
  }
}) as RequestHandler)

app.post('/meetings/:meetingId/participants', (async (req, res) => {
  try {
    const response = await api.participants({ meetingId: req.params.meetingId })
    if (response.status === 200) {
      return res.json(response.data)
    } else {
      return res.status(500).send('Cannot get participants from the meeting')
    }
  } catch (error) {
    return res.status(500).send('Cannot get participants from the meeting')
  }
}) as RequestHandler)

// Weed detection endpoint
// app.post('/weed-detection', (async (req, res) => {
//   try {
//     const { image } = req.body as WeedDetectionRequest
//     if (!image) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'No image provided' 
//       })
//     }

//     // --- Decode Base64 in Express and save as a PNG file ---
//     let base64Data = image;
//     // Remove any data header if present, e.g. "data:image/png;base64,"
//     if (base64Data.startsWith("data:image")) {
//       base64Data = base64Data.split(",")[1];
//     }
//     // Convert base64 string to a binary buffer
//     const imageBuffer = Buffer.from(base64Data, 'base64');

//     // Write the decoded image to a temporary PNG file.
//     const inputFileName = `${uuidv4()}_input.png`
//     const inputFilePath = path.join(os.tmpdir(), inputFileName)
//     fs.writeFileSync(inputFilePath, imageBuffer)
//     console.log('Image written to:', inputFilePath)
//     // --------------------------------------------------------

//     // Define a temporary file for the output processed image.
//     const outputFileName = `${uuidv4()}_processed.png`
//     const outputFilePath = path.join(os.tmpdir(), outputFileName)

//     // Use the virtual environment's Python3 executable.
//     // Update this path to the correct location of your venv's python3.
//     const pythonInterpreter = path.join(process.cwd(), 'src', 'venv', 'bin', 'python3');
//     const pythonProcess = spawn(pythonInterpreter, [
//       path.join(process.cwd(), 'detect_weeds.py'),
//       inputFilePath,
//       outputFilePath
//     ]);

//     let stdoutData = ''
//     let stderrData = ''
    
//     pythonProcess.stdout.on('data', (data) => {
//       stdoutData += data.toString()
//     })
    
//     pythonProcess.stderr.on('data', (data) => {
//       stderrData += data.toString()
//     })
    
//     pythonProcess.on('close', (code) => {
//       // Clean up the temporary input file.
//       fs.unlinkSync(inputFilePath)
      
//       if (code !== 0) {
//         return res.status(500).json({ 
//           success: false, 
//           error: `Python process exited with code ${code}: ${stderrData}` 
//         })
//       }
      
//       // Read the processed image file and convert it to a base64 string.
//       let processedImageBase64 = ''
//       try {
//         const processedImageBuffer = fs.readFileSync(outputFilePath)
//         processedImageBase64 = processedImageBuffer.toString('base64')
//       } catch (readError) {
//         return res.status(500).json({
//           success: false,
//           error: 'Processed image file not found or could not be read.'
//         })
//       } finally {
//         // Clean up the output file.
//         fs.unlinkSync(outputFilePath)
//       }
      
//       let detectionResults: WeedDetectionResponse = { success: true }
//       try {
//         detectionResults = JSON.parse(stdoutData) as WeedDetectionResponse
//       } catch (parseError) {
//         console.error('Error parsing Python output:', parseError)
//       }
      
//       detectionResults.processed_image = processedImageBase64
//       return res.status(200).json(detectionResults)
//     })
    
//   } catch (error) {
//     console.error('Error in weed detection:', error)
//     return res.status(500).json({ 
//       success: false, 
//       error: error instanceof Error ? error.message : 'Unknown error'
//     })
//   }
// }) as RequestHandler)

// Start server
app.listen(port, host, () => {
  console.log(`Server listening on port ${port}: http://127.0.0.1:${port}`)
})
