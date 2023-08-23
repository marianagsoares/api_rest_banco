const { format } = require("date-fns");
const { ptBR } = require("date-fns/locale");

const dataAgora = Date.now();
const data = format(dataAgora, "dd/MM/yyyy", { locale: ptBR });

const timestamp = Date.now();
const horario = new Date(timestamp);
const horas = horario.getHours();
const minutos = horario.getMinutes();
const segundos = horario.getSeconds();

module.exports = {
  data,
  horas,
  minutos,
  segundos
};