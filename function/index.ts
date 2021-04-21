import iot from '@google-cloud/iot';
import nconf from "nconf"
import path from 'path';

console.log(__dirname)
nconf.argv()
  .env()
  .file({ file: path.resolve("appsettings.json") });

// Construct request
const {
  projectId,
  deviceId,
  registryId,
  cloudRegion,
} = nconf.get('iot')

export const sendConfigToDevice = async (req: any, res: any) => {
  const version = 0;

  try {
    const iotClient = new iot.v1.DeviceManagerClient({
      // optional auth parameters.
    });
    const formattedName = iotClient.devicePath(
      projectId,
      cloudRegion,
      registryId,
      deviceId
    );

    const data = JSON.stringify({ story: 12345, sync: true, message: "from function", time: Date.now() })

    const binaryData = Buffer.from(data).toString('base64');
    const request = {
      name: formattedName,
      versionToUpdate: version,
      binaryData: binaryData,
    };

    const [response] = await iotClient.modifyCloudToDeviceConfig(request);
    console.log('Success:', response);
    res.status(200).send(response)
  } catch (error) {
    console.error(error)
  }
}

sendConfigToDevice(null, null).then(console.log)