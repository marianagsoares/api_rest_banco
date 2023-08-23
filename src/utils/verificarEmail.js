function verificarSeEmailCadastrado(contasCadastradas, usuario) {
  const indiceContaCadastrada = contasCadastradas.findIndex((conta) => {
    return conta.usuario.email === usuario.email;
  });

  return indiceContaCadastrada !== -1;
}

function buscarEmailCadastrado(contasCadastradas, usuario) {
  const contaCadastrada = contasCadastradas.find((conta) => {
    return conta.usuario.email === usuario.email;
  });

  if(contaCadastrada)
    return contaCadastrada.usuario.email;

  return null;
}

module.exports = {
  verificarSeEmailCadastrado,
  buscarEmailCadastrado,
};
