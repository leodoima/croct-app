import express from "express";
import { Kafka, Partitioners } from "kafkajs";



// Tratar rotas
const app = express();

app.use(express.json());



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



const admin = kafka.admin();



const run = async () => {
  await admin.connect();

  await admin.createTopics({
    validateOnly: true,
    waitForLeaders: false,
    timeout: 1,
    topics: [{ topic: "ip-request" }],
  });



  await producer.connect();

  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello San Francisco" }],
  });

  



  // Receber evento de entrada de IP e destinar ao serviço especializado
  app.post("/event/ip/", async (req, res) => {
    const { client_id, ip, timestamp } = req.body;

    console.log(`ID: ${client_id} - IP: ${ip} - ${timestamp}`);

    // Chamar micro serviço
    await producer.send({
      topic: 'test-topic',
      messages: [
        {
          key: String(client_id),
          value: String(ip),
          timestamp: timestamp
        },
      ],
    });

    return res.json({ok: true});
  });


  const consumer = kafka.consumer({ groupId: 'test-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      })
    },
  });



  app.get("/", (req, res) => {
    return res.json({ message: "Ok" });
  });



  app.listen("3333");
};


run().catch(console.error);