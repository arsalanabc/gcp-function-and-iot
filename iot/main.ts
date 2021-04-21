import nconf from "nconf"
import path from 'path';
import { modifyCloudToDeviceConfig, listDeviceConfigVersions } from "./src/deviceConfig";
import { IoTClient } from "./src/iot-client";

nconf.argv()
  .env()
  .file({ file: path.resolve(__dirname, "appsettings.json") });


  const client = new IoTClient()

  client.connect()

const testData = {story: 12345, sync: true, message: "after close"}


// modifyCloudToDeviceConfig(JSON.stringify(testData))
// listDeviceConfigVersions()

 