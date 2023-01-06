const express = require('express');

const { listarContas, criarContas, atualizarCadastroUsuario, excluirConta, depositoEmConta, saque, tranferenciaEntreContas, saldoContaBanco, extratoBancario } = require("../controladores/controladorContaUuarios");
const { validarCamposObrigatorios, ValidarCpfEEmail, verificarSenha_Banco, ValidarSeContaCadastrada, ValidarSeContaCadastradaParaExclusão, validacoesdepositobancario, validacoesSaqueBancario, validacoesTransferencias, validacoesSaldo, validacoesExtrato } = require('../intermediarios/intermediarios');

const rotas = express.Router();

rotas.get('/contas', verificarSenha_Banco, listarContas);
rotas.post('/contas', validarCamposObrigatorios, ValidarCpfEEmail, criarContas);
rotas.put('/contas/:numeroConta/usuario', ValidarSeContaCadastrada, validarCamposObrigatorios, atualizarCadastroUsuario);
rotas.delete('/contas/:numeroConta', ValidarSeContaCadastradaParaExclusão, excluirConta);
rotas.post('/transacoes/depositar', validacoesdepositobancario, depositoEmConta);
rotas.post('/transacoes/sacar', validacoesSaqueBancario, saque);
rotas.post('/transacoes/transferir', validacoesTransferencias, tranferenciaEntreContas);
rotas.get('/contas/saldo', validacoesSaldo, saldoContaBanco);
rotas.get('/contas/extrato', validacoesExtrato, extratoBancario);

module.exports = rotas;