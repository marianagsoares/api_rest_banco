function verificarSeCpfCadastrado(contasCadastradas, usuario) {
  const indexContaEncontrada = contasCadastradas.findIndex((conta) => {
    return conta.usuario.cpf === usuario.cpf;
  });
  return indexContaEncontrada !== -1;
}

function buscarCpfCadastrado(contasCadastradas, usuario) {
  const contaCadastrada = contasCadastradas.find((conta) => {
    return conta.usuario.cpf === usuario.cpf;
  });

  if(contaCadastrada)
    return contaCadastrada.usuario.cpf;

  return null;
}

module.exports = {
  verificarSeCpfCadastrado,
  buscarCpfCadastrado,
};
