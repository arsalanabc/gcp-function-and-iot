import iot from '@google-cloud/iot';
import nconf from "nconf"

const version = 0;

const iotClient = new iot.v1.DeviceManagerClient({
// optional auth parameters.
});

export async function modifyCloudToDeviceConfig(data:string) {
  // Construct request
  const {
    projectId,
    deviceId,
    registryId,
    cloudRegion,
  } = nconf.get('iot')

  const formattedName = iotClient.devicePath(
    projectId,
    cloudRegion,
    registryId,
    deviceId
  );

  const binaryData = Buffer.from(data).toString('base64');
  const request = {
    name: formattedName,
    versionToUpdate: version,
    binaryData: binaryData,
  };

  const [response] = await iotClient.modifyCloudToDeviceConfig(request);
  console.log('Success:', response);
}

export async function listDeviceConfigVersions() {
  const {
    projectId,
    deviceId,
    registryId,
    cloudRegion,
  } = nconf.get('iot')
  // Construct request
  const devicePath = iotClient.devicePath(
    projectId,
    cloudRegion,
    registryId,
    deviceId
  );

  const [response] = await iotClient.listDeviceConfigVersions({
    name: devicePath,
  });
  const configs = response.deviceConfigs || [];


  if (configs.length === 0) {
    console.log(`No configs for device: ${deviceId}`);
  } else {
    console.log('Configs:');
  }

  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    console.log(
      'Config:',
      config,
      '\nData:\n',
      config.binaryData?.toString()
    );
  }
}
