const { Router } = require('express');
const validarSenha = require('../middlewares/auth.middleware');
const bancoController = require('../controllers/banco.controller');

const router = Router();

router.post('/contas', bancoController.criarConta);
router.put('/contas/:numeroConta/usuario', bancoController.editarConta);
router.delete('/contas/:numeroConta', bancoController.deletarConta);
router.post('/transacoes/depositar', bancoController.depositarValor);
router.post('/transacoes/sacar', bancoController.sacarValor);
router.post('/transacoes/transferir', bancoController.transferirValor);
router.get('/contas/extrato', bancoController.emitirExtratoConta);
router.get('/contas/saldo', bancoController.verificarSaldo);

router.use(validarSenha);
router.get('/contas', bancoController.listarContas);

module.exports =  router;