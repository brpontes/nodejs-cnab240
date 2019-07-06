const moment = require('moment')
const leftPad = require('left-pad')
const today = moment().format("DDMMYYYY")
const now = moment().format("HHmmss")
const { getBankNameByCode } = require('../../modules/util')

module.exports = (profile) => {
    
    const { COD_BANCO, TIPO_INSCRICAO, INSCRICAO, CONVENIO, CONVENIO_PAG, CARTEIRA, 
        VARIACAO_CARTEIRA, AGENCIA, NUMERO_CONTA, NOME_EMPRESA } = profile

    return {
        HEADER: {
            COD_BANCO: COD_BANCO || '001',
            NOME_BANCO: getBankNameByCode(COD_BANCO),
            TIPO_INSCRICAO: TIPO_INSCRICAO || '2',
            INSCRICAO: (INSCRICAO || 'CNPJ/CPF DA EMPRESA').substring(0, 14),
            CONVENIO: (CONVENIO || '9999999').substring(0, 7),
            CONVENIO_PAG: CONVENIO_PAG || '9999999999999',
            CARTEIRA: CARTEIRA || '99',
            VARIACAO_CARTEIRA: VARIACAO_CARTEIRA || '999',
            AGENCIA: AGENCIA || '9999',
            NUMERO_CONTA: NUMERO_CONTA || '99999',
            NOME_EMPRESA: (NOME_EMPRESA || 'NOME DA EMPRESA AQUI').substring(0, 30),
            COBRANCA_CEDENTE: '0014',
            LOTE_SERVICO_ARQUIVO: leftPad('0', 4, '0'),
            LOTE_SERVICO_LOTE: '0001',
            TIPO_REGISTRO_ARQUIVO: '0',
            TIPO_REGISTRO_LOTE: '1',
            TESTE: '',
            TIPO_OPERACAO: 'R',
            TIPO_OPERACAO_PAG: 'C', 
            TIPO_SERVICO: '01',
            TIPO_SERVICO_PAG: '20',
            FORMA_LANCAMENTO_PAG: '03',
            DATA_GERACAO: today,
            HORA_GERACAO: now,
            VERSAO_LEIAUTE: '000',
            VERSAO_LEIAUTE_PAG_HEADER: '050',
            VERSAO_LEIAUTE_PAG: '031',
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
            MOEDA: '09',
            PGTO_PARCIAL: '2',
            TIPO_MOEDA: 'BRL',
            QTDE_TIPO_MOEDA: '0'
        }
    }
}