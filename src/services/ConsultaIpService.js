import apiIp from "../config/apiIp.js";

const ACCESS_KEY = "584b9a864a98b74707a60971efda7b8d";

// Realizar a busca por endereços IP através da API: IP Stack
async function ConsultaIpService(ip) {
  if (!ip) {
    throw Error("Valor informado para IP não pode ser nulo");
  }

  // Obtém retorno com todos os dados de localização do IP requisitado
  const { data } = await apiIp.get(`${ip}?access_key=${ACCESS_KEY}`);

  return data;
}

export default ConsultaIpService;
