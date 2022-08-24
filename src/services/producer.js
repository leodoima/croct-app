import randomIpv4 from "random-ipv4";
import { Kafka, Partitioners } from "kafkajs";

// Realizar conexão Kafka
const kafka = new Kafka({
  clientId: "api",
  brokers: ["localhost:9092"],
});

// Criar producer para tratar input de endereços IP
const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
  allowAutoTopicCreation: true,
});

// Gerar eventos constantes de entrada de IP
const generatedEvent = async () => {
  const ip = randomIpv4();
  const timestamp = Date.now();
  const client_id = Math.floor(Math.random() * 10); // Gerando registro de 0 - 9

  await producer.send({
    topic: "test-topic",
    messages: [
      { key: String(client_id), value: String(ip), timestamp: timestamp },
    ],
  });

  console.log(`Registro gerado: ID ${client_id} - IP: ${ip}`);
};

const run = async () => {
  // Configurações administrativas do tópico
  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
    validateOnly: true,
    waitForLeaders: false,
    timeout: 1,
    topics: [{ topic: "ip-request" }],
  });

  await producer.connect();

  // Acionar gerador de eventos
  setInterval(generatedEvent, 1000);
};

run().catch(console.error);
