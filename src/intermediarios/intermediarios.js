const { contas, banco } = require('../dados/bancodedados');

const verificarSenha_Banco = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(400).json({ 'mensagem': 'Senha do banco não informada!' });
    }

    if (senha_banco !== banco.senha) {
        return res.status(401).json({ 'mensagem': 'Senha do banco informada é inválida!' });
    }
    next();
}

const validarCamposObrigatorios = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ 'mensagem': 'O nome é obrigatório informar!' });
    }
    if (!cpf) {
        return res.status(400).json({ 'mensagem': 'O cpf é obrigatório informar!' });
    }
    if (!data_nascimento) {
        return res.status(400).json({ 'mensagem': 'O data_nascimento é obrigatório informar!' });
    }
    if (!telefone) {
        return res.status(400).json({ 'mensagem': 'O telefone é obrigatório informar!' });
    }
    if (!email) {
        return res.status(400).json({ 'mensagem': 'O email é obrigatório informar!' });
    }
    if (!senha) {
        return res.status(400).json({ 'mensagem': 'A senha é obrigatório informar!' });
    }
    next();
}

const ValidarCpfEEmail = (req, res, next) => {
    const { cpf, email } = req.body;
    const cpfInformado = contas.find(conta => {
        return conta.usuario.cpf === cpf;
    });
    if (cpfInformado) {
        return res.status(400).json('Já existe conta cadastrado com o cpf informado!');
    }

    const emailInformado = contas.find(conta => {
        return conta.usuario.email === email;
    });

    if (emailInformado) {
        return res.status(400).json('Já existe conta cadastrado com o email informado!');
    }
    next();
}

const ValidarSeContaCadastrada = (req, res, next) => {//verificar se esta sendo usada
    const { numeroConta } = req.params;

    const numeroContaInformado = contas.find((conta) => {
        return conta.numero === numeroConta;
    })
    if (!numeroContaInformado) {
        return res.status(404).json({ 'mensagem': 'Não existe conta cadastrada para o numero informado!' });
    }
    req.contaEncontrada = numeroContaInformado
    next();
}

const ValidarSeContaCadastradaParaExclusão = (req, res, next) => {
    const { numeroConta } = req.params;

    const numeroContaInformado = contas.find((conta) => {
        return conta.numero === numeroConta;
    })
    if (!numeroContaInformado) {
        return res.status(404).json({ 'mensagem': 'Não existe conta cadastrada para o numero informado!' });
    }

    if (numeroContaInformado.saldo !== 0) {
        return res.status(400).json('A conta só pode ser removida se o saldo for zero!')
    }
    next();
}

const validacoesDepositoBancario = (req, res, next) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta) {
        return res.status(400).json({ 'mensagem': 'O número da conta é obrigatório!' });
    }

    if (!valor) {
        return res.status(400).json({ 'mensagem': 'O valor é obrigatório!' });
    }


    if (valor <= 0) {
        return res.status(400).json({ 'mensagem': 'O valor informado é invalido!' })
    }
    next();
}

const validacoesSaqueBancario = (req, res, next) => {
    const { numero_conta, valor, senha } = req.body;
    if (!numero_conta) {
        return res.status(400).json({ 'mensagem': 'O numero da conta precisa ser informada!' });
    }
    if (!valor) {
        return res.status(400).json({ 'mensagem': 'O valor precisa ser informada!' });
    }
    if (!senha) {
        return res.status(400).json({ 'mensagem': 'A senha precisa ser informada!' });
    }

    if (valor <= 0) {
        return res.status(400).json({ 'mensagem': 'Valor invalido' });
    }
    next();
}

const validacoesTransferencias = (req, res, next) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    if (!numero_conta_origem) {
        res.status(400).json({ 'mensagem': 'Informar o numero da conta de origem é obrigatório!' });
    }
    if (!numero_conta_destino) {
        res.status(400).json({ 'mensagem': 'Informar o numero da conta de destino é obrigatório!' });
    }
    if (!senha) {
        res.status(400).json({ 'mensagem': 'Informar a senha é obrigatório!' });
    }
    if (!valor) {
        res.status(400).json({ 'mensagem': 'Informar o valor é obrigatório!' });
    }
    if (valor <= 0) {
        return res.status(400).json({ 'mensagem': 'Valor invalido' });
    }
    next();
}

const validacoesSaldo = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        return res.status(400).json({ 'mensagem': 'Numero da conta é obrigatório informar' });
    }
    if (!senha) {
        return res.status(400).json({ 'mensagem': 'A senha é obrigatório informar' });
    }
    next();
}

const validacoesExtrato = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        return res.status(400).json({ 'mensagem': 'Numero da conta é obrigatório informar' });
    }
    if (!senha) {
        return res.status(400).json({ 'mensagem': 'Informar a senha é obrigatório informar' });
    }
    next();
}

module.exports = {
    validarCamposObrigatorios,
    ValidarCpfEEmail,
    ValidarSeContaCadastrada,
    ValidarSeContaCadastradaParaExclusão,
    verificarSenha_Banco,
    validacoesDepositoBancario,
    validacoesSaqueBancario,
    validacoesTransferencias,
    validacoesSaldo,
    validacoesExtrato
}
