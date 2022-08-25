import axios from 'axios';

// Definições de conexão com a API externa
const apiIp = axios.create({
    baseURL: "http://api.ipstack.com/"
});

export default apiIp;