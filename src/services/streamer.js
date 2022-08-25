import { Kafka, Partitioners } from "kafkajs";

import ConsultaIpService from "./ConsultaIpService.js";

// Realizar conexão Kafka
const kafka = new Kafka({
  clientId: "api",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
  allowAutoTopicCreation: true,
});

const run = async () => {
  const consumer = kafka.consumer({ groupId: "test-group" });

  // Realizar consumo de endereços recebidos através de evento
  await consumer.connect();
  await consumer.subscribe({ topic: "ip-request", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const eventListner = `Registro consumido: ID: ${message.key.toString()} - IP: ${message.value.toString()}`;
      console.log(eventListner);

      // Buscar localização do endereço IP
      const data = await ConsultaIpService(message.value);

      const info = [
        {
          ip: message.value,
          city: data.city,
          region_name: data.region_name,
          country_name: data.country_name,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      ];

      // Registrar novos valores para o evento e inserir em um novo tópico
      await producer.connect();
      producer.send({
        topic: "ip-response",
        messages: [
          {
            key: message.key,
            value: String(info),
            timestamp: Date.now(),
          },
        ],
      });

      console.log(
        `Endereço registrado: ID ${message.key} - IP: ${message.value} - Localização: ${data.city} - ${data.country_name}`
      );
    },
  });
};

run().catch(console.error);
