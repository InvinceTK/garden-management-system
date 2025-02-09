import axios from 'axios'
import express, { type RequestHandler } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import fs from 'fs'
import config from 'config'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { createApi, withToken } from '@pexip/vpaas-api'

const host: string = config.get('server.host')
const port: number = config.get('server.port')

const app = express()
app.use(helmet())

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
      iss: clientId, // Application Client UUID
      sub: clientId, // Application Client UUID
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
    origin: ["http://localhost:3000", `http://${host}:3000` ], // client port
  })
)

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
      return res.status(500).send(`Cannot get participants from the meeting`)
    }
  } catch (error) {
    return res.status(500).send(`Cannot get participants from the meeting`)
  }
}) as RequestHandler)

app.listen(port, host, () => {
  console.log(
    `VPaaS server listening on port ${port}: http://127.0.0.1:${port}`
  )
})

app.post('/weed-detection', express.json({ limit: "50mb" }), async (req, res) => {
  try {
    if (!req.body || !req.body.image) {
      return res.status(400).send({ message: 'No image provided' });
    }

    const { image } = req.body;  // Get the image data

    console.log("Received image data:", image.substring(0, 50) + "..."); // Log first 50 chars

    // Process base64 image for API request
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");


    // Process the image and detect weeds (you can use a pre-trained model here)
    const response = await axios({
      method: "POST",
      url: "https://detect.roboflow.com/weeds-nxe1w/1",  // Your Roboflow API URL
      params: {
        api_key: "n2RyYvxkxa3vbPrQOsha",  // Replace with your actual Roboflow API key
      },
      data: base64Data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Return the Roboflow detection results to the frontend
    res.status(200).send(response.data);
  } catch (error) {
    console.error('Error in weed detection:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});
