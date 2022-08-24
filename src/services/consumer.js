import { Kafka } from "kafkajs";

// Realizar conexão Kafka
const kafka = new Kafka({
  clientId: "api",
  brokers: ["localhost:9092"],
});

const run = async () => {

  const consumer = kafka.consumer({ groupId: "test-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const eventListner = `Registro consumido: ID: ${message.key.toString()} - IP: ${message.value.toString()}`;
      console.log(eventListner);
    },
  });
};

run().catch(console.error);
