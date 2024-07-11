const ammqplib = require('amqplib');

const {MESSAGE_BROKER_URL, EXCHANGE_NAME} = require('../config/serverConfig');

const createChannel = async () => {
    try {
        const connection = await ammqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
        return channel;
    } catch (error) {
        console.log(error);
    }
}

const subscribeMessage = async (channel, service, binding_key) => {
    try {
        const applicationQueue = await channel.assertQueue('QUEUE_NAME');
        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);

        channel.consume(applicationQueue.queue, msg =>{
            console.log('recieved data');
            console.log(msg.content.toString());
            channel.ack(msg);
    });
    } catch (error) {
        console.log('unable to subscribe message');
        throw error;
    }
}

const publishMessage = async (channel, binding_key, message) => {
    try {
        await channel.assertQueue('QUEUE_NAME'); 
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    } catch (error) {
        console.log("unable to PUBLISH");
    }
}

module.exports = {
    createChannel,
    subscribeMessage,
    publishMessage
}