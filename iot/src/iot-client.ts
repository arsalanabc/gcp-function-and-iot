import mqtt from 'mqtt'
import nconf from 'nconf'
import { createJwt } from './tokenGenerator'

export class IoTClient {

  connect() {
    const {
      projectId,
      deviceId,
      registryId,
      cloudRegion,
      mqttBridgeHostname,
      mqttBridgePort,
      algorithm,
      privateKeyFilePath,
    } = nconf.get('iot')

    // The mqttClientId is a unique string that identifies this device. For Google
    // Cloud IoT Core, it must be in the format below. This path to device used in JWT creation
    const mqttClientId = `projects/${projectId}/locations/${cloudRegion}/registries/${registryId}/devices/${deviceId}`

    // With Google Cloud IoT Core, the username field is ignored, however it must be
    // non-empty. The password field is used to transmit a JWT to authorize the
    // device. The "mqtts" protocol causes the library to connect using SSL, which
    // is required for Cloud IoT Core.
    const connectionArgs: mqtt.IClientOptions = {
      host: mqttBridgeHostname,
      port: mqttBridgePort,
      clientId: mqttClientId,
      username: 'unused',
      password: createJwt(
        projectId,
        privateKeyFilePath,
        algorithm
      ),
      protocol: 'mqtts',
    }

    this.stayConnected(connectionArgs)
  }

  async stayConnected(connectionArgs: mqtt.IClientOptions, iatTime?: number, client?: mqtt.MqttClient) {

    iatTime = Date.now() / 1000
    const {
      deviceId
    } = nconf.get('iot')

    // Close previous client connection (if any)
    client?.end()

    client = mqtt.connect(connectionArgs)

    client.subscribe(`/devices/${deviceId}/commands/#`, { qos: 0 });
    // Subscribe to the /devices/{device-id}/config topic to receive config updates.
    // Config updates are recommended to use QoS 1 (at least once delivery)
    client.subscribe(`/devices/${deviceId}/config`, { qos: 1 });

    const messageType = "state"
    const mqttTopic = `/devices/${deviceId}/${messageType}`;

    console.log(mqttTopic)



    client.on('connect', success => {
      if (success) {
        console.log('Mqtt client connected')
      } else {
        console.warn('Mqtt client not connected...')
      }
    })

    client.on('close', () => {
      console.log('Mqtt connection closed...')
    })

    client.on('error', err => {
      console.error('Mqtt client error', err)
    })


    client.on('message', (topic, message) => {
      let messageStr = 'Message received: ';
      if (topic === `/devices/${deviceId}/config`) {
        messageStr = 'Config message received: ';
      } else if (topic.startsWith(`/devices/${deviceId}/commands`)) {
        messageStr = 'Command message received: ';
      }

      messageStr += Buffer.from(message).toString('ascii');
      console.log(messageStr);
    });
  }
}

