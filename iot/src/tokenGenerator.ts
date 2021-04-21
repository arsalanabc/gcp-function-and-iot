import jwt, { Algorithm } from 'jsonwebtoken'
import { readFileSync } from 'fs'


export function createJwt (projectId: string, privateKeyFile: string, algorithm: Algorithm) {
    // Create a JWT to authenticate this device. The device will be disconnected
    // after the token expires, and will have to reconnect with a new token. The
    // audience field should always be set to the GCP project id.
    const payload = {
      iat: Date.now() / 1000,
      exp: Date.now() / 1000 + 20 * 60,
      aud: projectId
    }
    const privateKey = readFileSync(privateKeyFile, 'utf8')

    return jwt.sign(payload, privateKey, { algorithm: algorithm })
  };
  
  
  