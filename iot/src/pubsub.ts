import nconf from "nconf"
import path from 'path';
// Imports the Google Cloud client library
import { PubSub } from '@google-cloud/pubsub';

nconf.argv()
  .env()
  .file({ file: path.resolve(__dirname, "..", "appsettings.json") });

const { subscriptionName, apiEndpoint } = nconf.get("pubsub")

const timeout = 60;

// Creates a client; cache this for further use
const pubSubClient = new PubSub({ apiEndpoint });

function listenForMessages() {
  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message: { id: any; data: any; attributes: any; ack: () => void; }) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);
    messageCount += 1;
    const parsedData = JSON.parse(message.data)
    console.log(parsedData)
    parsedData.dev === 100 ?
      // "Ack" (acknowledge receipt of) the message
      message.ack() :
      null
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
}

listenForMessages();
