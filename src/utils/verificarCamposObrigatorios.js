const verificarCamposObrigatorios = (usuario) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = usuario;

    return nome && cpf && data_nascimento && telefone && email && senha;        
}

module.exports = verificarCamposObrigatorios;