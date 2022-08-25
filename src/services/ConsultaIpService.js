import apiIp from "../config/apiIp.js";

const ACCESS_KEY = "16b3c0169b7b0624f9a9cd4771b47d58";

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
