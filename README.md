# Function and iot-device
Use a function to send config updates to a device and have the device listen on message type
'config'


### Setup
 - Create a registry and a device in GCP
 - Set the appsettings in both projects

### Setup For IOT
 - Create a public/private key pair
 - Congifure the device with the public key
`npm install`


### Setup for the function
`npm run build`
 - deploy the function on gcp
 - call the funciton

### Test
 - Run the iot locally and call the function
 - Iot device should receive the message
