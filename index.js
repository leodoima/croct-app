import express from "express";

// Tratar rotas
const app = express();
app.use(express.json());

// Receber evento de entrada de IP e destinar ao serviço especializado
app.post("/event/ip/", async (req, res) => {
  const { client_id, ip, timestamp } = req.body;

  console.log(`ID: ${client_id} - IP: ${ip} - ${timestamp}`);

  return res.json({ message: true });
});

app.get("/", (req, res) => {
  return res.json({ message: "Ok" });
});

app.listen("3333");
