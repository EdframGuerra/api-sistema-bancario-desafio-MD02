let { contas, depositos, saques, transferencias } = require('../dados/bancodedados');
const { v4: idContas } = require('uuid');
const { format } = require('date-fns');


const listarContas = (req, res) => {
    return res.status(200).json(contas);
}

const criarContas = (req, res) => {
    const criarConta = {
        numero: idContas(), saldo: 0, usuario: { ...req.body }
    }
    contas.push(criarConta);

    return res.status(201).json();
}

const atualizarCadastroUsuario = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const numeroContaInformado = contas.find((conta) => {
        return conta.numero === numeroConta;
    })
    if (!numeroContaInformado) {
        return res.status(404).json({ 'mensagem': 'Não existe conta cadastrada para o numero informado!' });
    }

    const cpfInformado = contas.find(conta => {
        return conta.usuario.cpf === cpf && conta.numero !== numeroConta;
    });

    if (cpfInformado) {
        return res.status(400).json('Já existe conta cadastrado com o cpf informado!');
    }

    const emailInformado = contas.find(conta => {
        return conta.usuario.email === email && conta.numero !== numeroConta;
    });
    if (emailInformado) {
        return res.status(400).json('Já existe conta cadastrado com o email informado!');
    }

    numeroContaInformado.usuario.nome = nome;
    numeroContaInformado.usuario.cpf = cpf;
    numeroContaInformado.usuario.data_nascimento = data_nascimento;
    numeroContaInformado.usuario.telefone = telefone;
    numeroContaInformado.usuario.email = email;
    numeroContaInformado.usuario.senha = senha;

    return res.status(204).json();
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    contas = contas.filter((conta) => {
        return conta.numero !== numeroConta;
    })
    return res.status(204).json();
}

const depositoEmConta = (req, res) => {
    const { numero_conta, valor } = req.body;

    const numeroContaInformado = contas.find((conta) => {
        return conta.numero === numero_conta;
    })
    if (!numeroContaInformado) {
        return res.status(404).json({ 'mensagem': 'Não existe conta cadastrada para o numero informado!' });
    }

    const registroDeposito = {
        data: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        numero_conta: numero_conta,
        valor: parseInt(valor)
    }
    depositos.push(registroDeposito);

    parseInt(numeroContaInformado.saldo += parseInt(valor));

    return res.status(201).json();
}

const saque = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    const contaInformada = contas.find((conta) => {
        return conta.numero === numero_conta;
    })
    if (!contaInformada) {
        return res.status(404).json({ 'mensagem': 'Não existe conta cadastrada para o numero informado!' });
    }

    if (contaInformada.usuario.senha !== senha) {
        return res.status(401).json({ 'mensagem': 'Senha invalida!' });
    }

    if (valor > contaInformada.saldo) {
        return res.status(400).json({ 'mensagem': 'Saldo insuficiente indisponivel!' });
    }

    const registroSaque = {
        data: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        numero_conta: numero_conta,
        valor: parseInt(valor)
    }
    saques.push(registroSaque)
    contaInformada.saldo -= valor
    return res.status(201).json();
}

const tranferenciaEntreContas = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    const contaOrigemInformada = contas.find((conta) => {
        return conta.numero === numero_conta_origem;
    })
    if (!contaOrigemInformada) {
        return res.status(404).json({ 'mensagem': 'Não existe conta origem cadastrada para o numero informado!' });
    }

    const contaDestinoInformada = contas.find((conta) => {
        return conta.numero === numero_conta_destino;
    })
    if (!contaDestinoInformada) {
        return res.status(404).json({ 'mensagem': 'Não existe conta destino cadastrada para o numero informado!' });
    }

    if (contaOrigemInformada.usuario.senha !== senha) {
        return res.status(401).json({ 'mensagem': 'Senha invalida!' });
    }

    if (valor > contaOrigemInformada.saldo) {
        return res.status(403).json({ 'mensagem': 'Saldo insuficiente' });
    }

    const registroTransferencias = {
        data: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor: parseInt(valor)
    }

    transferencias.push(registroTransferencias)
    contaOrigemInformada.saldo -= parseInt(valor);
    contaDestinoInformada.saldo += parseInt(valor);
    return res.status(204).json();
}

const saldoContaBanco = (req, res) => {
    const { numero_conta, senha } = req.query;

    const contaInformada = contas.find((conta) => {
        return conta.numero === numero_conta;
    })
    if (!contaInformada) {
        return res.status(404).json({ 'mensagem': 'Não existe conta cadastrada para o numero informado!' });
    }

    if (contaInformada.usuario.senha !== senha) {
        return res.status(401).json({ 'mensagem': 'Senha inválida!' })
    }

    return res.status(201).json({

        saldo: contaInformada.saldo
    });
}

const extratoBancario = (req, res) => {
    const { numero_conta, senha } = req.query;

    const contaInformada = contas.find((conta) => {
        return conta.numero === numero_conta;
    })
    if (!contaInformada) {
        return res.status(404).json({ 'mensagem': 'Não existe conta cadastrada para o numero informado!' });
    }

    if (contaInformada.usuario.senha !== senha) {
        return res.status(401).json({ 'mensagem': 'A senha do banco informada é inválida!' });
    }

    const arraySaque = saques.filter((saque) => {
        return saque.numero_conta === numero_conta;
    })

    const arrayDeposito = depositos.filter((deposito) => {
        return deposito.numero_conta === numero_conta;
    })
    const transferenciasRealizadas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === numero_conta;
    })
    const transferenciasRecebidas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === numero_conta;
    })

    return res.status(201).json({

        saques: arraySaque,
        depositos: arrayDeposito,
        transferenciasOrigem: transferenciasRealizadas,
        transferenciasDetino: transferenciasRecebidas
    })
}

module.exports = {
    listarContas,
    criarContas,
    atualizarCadastroUsuario,
    excluirConta,
    depositoEmConta,
    saque,
    tranferenciaEntreContas,
    saldoContaBanco,
    extratoBancario
}