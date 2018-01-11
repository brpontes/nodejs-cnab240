const moment = require('moment')
const leftPad = require('left-pad')
const today = moment().format("DDMMYYYY")
const now = moment().format("HHmmss")

const CONSTANTS = {
    HEADER: {
        COD_BANCO: '001',
        NOME_BANCO: 'BANCO DO BRASIL S.A',
        TIPO_INSCRICAO: '2',
        INSCRICAO: '03377700000198',
        CONVENIO: '3061856',
        CARTEIRA: '17',
        VARIACAO_CARTEIRA: '051',
        COBRANCA_CEDENTE: '0014',
        AGENCIA: '29068',
        NUMERO_CONTA: '77771',
        NOME_EMPRESA: 'SETYDEIAS SERVICOS LTDA.',
        LOTE_SERVICO_ARQUIVO: leftPad('0', 4, '0'),
        LOTE_SERVICO_LOTE: '0001',
        TIPO_REGISTRO_ARQUIVO: '0',
        TIPO_REGISTRO_LOTE: '1',
        TESTE: '',
        TIPO_OPERACAO: 'R', 
        TIPO_SERVICO: '01',
        DATA_GERACAO: today,
        HORA_GERACAO: now,
        VERSAO_LEIAUTE: '000',
        NUMERO_REM_RET: leftPad('0', 8, '0'),
        CODIGO_REM_RET: '1',
        NSA: leftPad('0', 6, '0')
    },
    DETAIL: {
        COD_CARTEIRA: '7',
        FORMA_CADASTRAMENTO: '1',
        TIPO_EMISSAO: '2',
        TIPO_DISTRIBUICAO: '2',
        ESPECIE: '17',
        ACEITE: 'N',
        COD_JUROS: '0',
        DATA_JUROS: leftPad('0', 8, '0'),
        JUROS: leftPad('0', 15, '0'),
        COD_MULTA: '0',
        DATA_MULTA: leftPad('0', 8, '0'),
        MULTA: leftPad('0', 15, '0'),
        COD_DESCONTO: '0',
        DATA_DESCONTO: leftPad('0', 8, '0'),
        DESCONTO: leftPad('0', 15, '0'),
        ABATIMENTO: leftPad('0', 15, '0'),
        IOF: leftPad('0', 15, '0'),
        COD_PROTESTO: '3',
        NUM_DIAS_PROTESTO: '00',
        COD_BAIXA: '0',
        NUM_DIAS_BAIXA: '000',
        MOEDA: '09'
    }
}

module.exports = CONSTANTS