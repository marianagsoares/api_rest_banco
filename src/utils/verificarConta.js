const verificarSeContaExiste = (contasCadastradas, numeroDaConta) => {

    const indexContaEncontrada = contasCadastradas.findIndex((conta) => {
        return conta.numero === numeroDaConta;
    });
        
    return {
        indexContaEncontrada: indexContaEncontrada,
        contaExiste: indexContaEncontrada !== -1
    }
}

function buscarContaCadastrada(contasCadastradas, numeroDaConta) {
    const contaCadastrada = contasCadastradas.find((conta) => {
      return conta.numero === numeroDaConta;
    });
  
    return contaCadastrada;
}

module.exports = {
    verificarSeContaExiste,
    buscarContaCadastrada
}