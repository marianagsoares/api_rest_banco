const bancoDeDados = require("../database/database");
const { data, horas,  minutos,  segundos,} = require("../utils/buscarDataEHorarioTransacoes");
const { verificarSeEmailCadastrado, buscarEmailCadastrado } = require("../utils/verificarEmail");
const { verificarSeCpfCadastrado, buscarCpfCadastrado } = require("../utils/verificarCpf");
const { verificarSeContaExiste, buscarContaCadastrada } = require("../utils/verificarConta");
const verificarCamposObrigatorios = require("../utils/verificarCamposObrigatorios");

const listarContas = (req, res) => {
  if(bancoDeDados.contas.length === 0)
    return res.status(404).send({ message: "Esse banco não possui contas registradas" });

  return res.status(200).send(bancoDeDados.contas);
};

const criarConta = (req, res) => {
  const { usuario } = req.body;

  const camposObrigatoriosPreenchidos = verificarCamposObrigatorios(usuario);

  if (!camposObrigatoriosPreenchidos)
    return res.status(400).send({ message: "Preencha os campos obrigatórios antes de enviar a requisição para criar a conta"});

  if(usuario.cpf.length !== 11)
    return res.status(200).send({ message: "O CPF precisa conter 11 dígitos" });

  const emailCadastrado = verificarSeEmailCadastrado(bancoDeDados.contas,usuario);
  const cpfCadastrado = verificarSeCpfCadastrado(bancoDeDados.contas, usuario);

  if (emailCadastrado || cpfCadastrado)
    return res.status(400).send({ message: "Já existe uma conta com o cpf ou e-mail informado!" });

  const novaConta = {
    numero: bancoDeDados.contas.length + 1,
    usuario: {
      nome: usuario.nome,
      cpf: usuario.cpf,
      data_nascimento: usuario.data_nascimento,
      telefone: usuario.telefone,
      email: usuario.email,
      senha: usuario.senha,
    },
    saldo: 0,
  };

  bancoDeDados.contas.push(novaConta);
  return res.status(201).send();
};

const editarConta = (req, res, next) => {
  const { usuario } = req.body;
  let { numeroConta } = req.params;
  numeroConta = Number(numeroConta);

  if (isNaN(numeroConta))
    return res.status(400).send({ message: "Número da conta é inválido" });

  const { contaExiste, indexContaEncontrada } = verificarSeContaExiste( bancoDeDados.contas, numeroConta);

  if (!contaExiste)
    return res.status(404).send({ message: "Conta bancária não encontrada" });

  const camposObrigatoriosPreenchidos = verificarCamposObrigatorios(usuario);

  if (!camposObrigatoriosPreenchidos)
    return res.status(400).send({ message: "Preencha os campos obrigatórios antes de criar a conta" });

  if(usuario.cpf.length !== 11)
    return res.status(200).send({ message: "O CPF precisa conter 11 dígitos" });

  const emailEncontrado = buscarEmailCadastrado(bancoDeDados.contas, usuario);

  const emailPertenceAoUsuario = emailEncontrado === bancoDeDados.contas[indexContaEncontrada].usuario.email;

  if (emailEncontrado && !emailPertenceAoUsuario)
    return res.status(400).send({ message: "O Email informado já existe cadastrado!" });

  const cpfEncontrado = buscarCpfCadastrado(bancoDeDados.contas, usuario);

  const cpfPertenceAoUsuario = cpfEncontrado === bancoDeDados.contas[indexContaEncontrada].usuario.cpf;

  if (cpfEncontrado && !cpfPertenceAoUsuario)
    return res.status(400).send({ message: "O CPF informado já existe cadastrado!" });

    const contaEditada = {
      numero: numeroConta,
      usuario: {
        nome: usuario.nome,
        cpf: usuario.cpf,
        data_nascimento: usuario.data_nascimento,
        telefone: usuario.telefone,
        email: usuario.email,
        senha: usuario.senha,
      },
      saldo: bancoDeDados.contas[indexContaEncontrada].saldo
    };

  bancoDeDados.contas[indexContaEncontrada] = contaEditada;

  res.status(200).send(contaEditada);
};

const depositarValor = (req, res) => {
  const { numero_conta, valor } = req.body;

  let contaEncontrada = buscarContaCadastrada(bancoDeDados.contas, numero_conta);

  if (!contaEncontrada)
    return res.status(404).send({ message: "Conta bancária não encontrada" });

  if (valor === 0 || valor < 0)
    return res.status(400).send({ message: "O depósito deve ser um valor superior a 0" });

  if (!numero_conta || !valor)
    return res.status(400).send({ message: "O número da conta e o valor são obrigatórios!" });

  const novoDeposito = {
    data_deposito: data,
    horario_deposito: `${horas}:${minutos}:${segundos}`,
    numero_conta: numero_conta,
    valor: valor
  };

  contaEncontrada.saldo += novoDeposito.valor;

  bancoDeDados.depositos.push(novoDeposito);

  return res.status(201).send();
};

const sacarValor = (req, res) => {
  const { numero_conta, valor } = req.body;

  let contaEncontrada = buscarContaCadastrada(bancoDeDados.contas, numero_conta);

  if (!contaEncontrada)
    return res.status(404).send({ message: "Conta bancária não encontrada" });

  if (valor === 0 || valor < 0)
    return res.status(400).send({ message: "O saque deve ser um valor superior a 0" });

  if (!numero_conta || !valor)
    return res.status(400).send({ message: "O número da conta e o valor são obrigatórios!" });

  if(valor > contaEncontrada.saldo)
    return res.status(404).send({ message: "Saldo insuficiente" });

  const novoSaque = {
    data_saque: data,
    horario_saque: `${horas}:${minutos}:${segundos}`,
    numero_conta: numero_conta,
    valor: valor
  }

  contaEncontrada.saldo -= novoSaque.valor;

  bancoDeDados.saques.push(novoSaque);
  return res.status(201).send();
};

const transferirValor = (req, res) => {
  let {numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  if(!numero_conta_origem || !numero_conta_destino, !valor, !senha)
    return res.status(400).send("Preencha todos os campos obrigatórios!");

  const contaOrigemEncontrada = buscarContaCadastrada(bancoDeDados.contas, numero_conta_origem);

  const contaDestinhoEncontrada = buscarContaCadastrada(bancoDeDados.contas, numero_conta_destino);

  if(!contaOrigemEncontrada)
    return res.status(404).send({ message: "Conta bancária de origem não encontrada!" });

  if(!contaDestinhoEncontrada)
    return res.status(404).send({ message: "Conta bancária de destino não encontrada!" });

  if(senha !== contaOrigemEncontrada.usuario.senha)
    return res.status(401).send({ message: "Senha incorreta" });

  if(valor > contaOrigemEncontrada.usuario.saldo)
    return res.status(400).send("Saldo insuficiente");

  const novaTransferencia = {
      data_transferencia: data,
      horario_transferencia:  `${horas}:${minutos}:${segundos}`,
      numero_conta_destino: numero_conta_destino,
      numero_conta_origem: numero_conta_origem,
      valor: valor
  };

  contaOrigemEncontrada.saldo -= novaTransferencia.valor;
  contaDestinhoEncontrada.saldo += novaTransferencia.valor;

  bancoDeDados.transferencias.push(novaTransferencia);
  return res.status(201).send();  
};

const emitirExtratoConta = (req, res) => {
  let { numero_conta, senha } = req.query;
  numero_conta = Number(numero_conta);

  if (!numero_conta || !senha)
    return res.status(400).send({ message: "Número da conta e senha são obrigatórios" });

  const contaEncontrada = buscarContaCadastrada(bancoDeDados.contas, numero_conta);

  if (!contaEncontrada)
    return res.status(404).send({ message: "Conta bancária não encontrada" });

  if (senha !== contaEncontrada.usuario.senha)
    return res.status(401).send({ message: "Senha incorreta" });

  const depositos = bancoDeDados.depositos.filter((deposito) => deposito.numero_conta == numero_conta);

  const saques = bancoDeDados.saques.filter((saque) => saque.numero_conta == numero_conta);

  const transferenciasRealizadas = bancoDeDados.transferencias.filter((transferenciaRealizada) => transferenciaRealizada.numero_conta_origem == numero_conta);

  const transferenciasRecebidas = bancoDeDados.transferencias.filter((transferenciaRecebida) => transferenciaRecebida.numero_conta_destino == numero_conta);

  return res.send({ depositos, saques, transferenciasRealizadas, transferenciasRecebidas });
};

const verificarSaldo = (req, res) => {
  let { numero_conta, senha } = req.query;
  numero_conta = Number(numero_conta);

  const contaEncontrada = buscarContaCadastrada(bancoDeDados.contas, numero_conta);

  if(!contaEncontrada)
    return res.status(404).send({ message: "Conta bancária não encontrada" });

  if(senha !== contaEncontrada.usuario.senha)
    return res.status(401).send({ message: "Senha incorreta" });

  const { saldo } = contaEncontrada;
  return res.status(200).send({ Saldo: saldo });
}

const deletarConta = (req, res) => {
  let { numeroConta } = req.params;
  numeroConta = Number(numeroConta);

  const contaEncontrada = buscarContaCadastrada(bancoDeDados.contas, numeroConta);

  if(!contaEncontrada)
    return res.status(404).send({ message: "Conta bancária não encontrada" });

  if(contaEncontrada.saldo > 0)
    return res.status(400).send({ message: "Não é possível apagar uma conta com saldo superior a 0" });

  const contaExiste = verificarSeContaExiste(bancoDeDados.contas, numeroConta);
  bancoDeDados.contas.splice(contaExiste.indexContaEncontrada, 1);
  return res.status(204).send();
}

module.exports = {
  listarContas,
  criarConta,
  editarConta,
  deletarConta,
  depositarValor,
  sacarValor,
  transferirValor,
  emitirExtratoConta,
  verificarSaldo
};
