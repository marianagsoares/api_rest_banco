function validarSenha (req, res, next) {
    const { senha_banco } = req.query;

    if(!senha_banco)    return res.status(401).send({ message: 'Não autorizado'});
    if(senha_banco === "Cubos123Bank") return next();
    if(senha_banco !== "Cubos123Bank") return res.status(401).send({ message: 'A senha do banco está inválida'});
}

module.exports = validarSenha;