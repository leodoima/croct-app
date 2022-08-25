import express from "express";

// Tratar rotas
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Olá! Estamos utilizando Kafka nesta aplicação!" });
});

app.listen("3333");