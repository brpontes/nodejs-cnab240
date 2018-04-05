const leftPad = require('left-pad')
const rightPad = require('right-pad')
const os = require('os')
const { HEADER, DETAIL } = require('../../layouts/bb/constants')

module.exports = (( shipping ) => {
    
    let NUMERO_REGISTRO = 0

    const header_file = () => {
        let header = `${HEADER.COD_BANCO}${HEADER.LOTE_SERVICO_ARQUIVO}${HEADER.TIPO_REGISTRO_ARQUIVO}${leftPad('', 9)}`
        header += `${HEADER.TIPO_INSCRICAO}${leftPad(HEADER.INSCRICAO, 14, '0')}`
        header += `${rightPad(HEADER.CONVENIO_PAG, 20, ' ')}${leftPad(HEADER.AGENCIA, 6, '0')}${leftPad(HEADER.NUMERO_CONTA, 13, '0')}0${rightPad(HEADER.NOME_EMPRESA, 30)}`
        header += `${rightPad(HEADER.NOME_BANCO, 30)}${leftPad(' ', 10)}${HEADER.CODIGO_REM_RET}${HEADER.DATA_GERACAO}`
        header += `${HEADER.HORA_GERACAO}${HEADER.NSA}${HEADER.VERSAO_LEIAUTE_PAG_HEADER}${leftPad('', 5, '0')}${leftPad(' ', 69)}${os.EOL}`

       return header
    }

    const header_lote = () => {
        let header = `${HEADER.COD_BANCO}${HEADER.LOTE_SERVICO_LOTE}${HEADER.TIPO_REGISTRO_LOTE}${HEADER.TIPO_OPERACAO_PAG}${HEADER.TIPO_SERVICO_PAG}${HEADER.FORMA_LANCAMENTO_PAG}`
        header += `${HEADER.VERSAO_LEIAUTE_PAG} ${HEADER.TIPO_INSCRICAO}${leftPad(HEADER.INSCRICAO, 14, '0')}`
        header += `${rightPad(HEADER.CONVENIO_PAG, 20, ' ')}${leftPad(HEADER.AGENCIA, 6, '0')}${leftPad(HEADER.NUMERO_CONTA, 13, '0')}0`
        header += `${rightPad(HEADER.NOME_EMPRESA, 30)}${rightPad(' ', 138, ' ')}${os.EOL}`
        
        return header
    }

    const segmento_a = ( shipping_detail ) => {
        
        shipping_detail.informacao_judicial = shipping_detail.informacao_judicial || ' '
        shipping_detail.compl_tipo_servico = shipping_detail.compl_tipo_servico || ' '
        shipping_detail.finalidade_ted = shipping_detail.finalidade_ted || ' '
        shipping_detail.compl_finalidade_pgto = shipping_detail.compl_finalidade_pgto || ' '
        
        let segmento = `${HEADER.COD_BANCO}${HEADER.LOTE_SERVICO_LOTE}3${leftPad(++NUMERO_REGISTRO, 5, '0')}A${shipping_detail.tipo_movimento}`
        segmento += `${shipping_detail.cod_camara}${shipping_detail.banco_favorecido}${leftPad(shipping_detail.agencia_favorecido, 5, '0')}`
        segmento += `${leftPad(shipping_detail.conta_favorecido, 12, '0')} ${rightPad(shipping_detail.nome, 30, ' ')}${rightPad(shipping_detail.seu_numero, 20, ' ')}`
        segmento += `${shipping_detail.data_pgto}${DETAIL.TIPO_MOEDA}${leftPad(DETAIL.QTDE_TIPO_MOEDA, 15, '0')}${shipping_detail.valor_pgto}`
        segmento += `${rightPad(shipping_detail.nosso_numero, 20, ' ')}${shipping_detail.data_pgto}${shipping_detail.valor_pgto}`
        segmento += `${rightPad(shipping_detail.informacao_judicial, 40, ' ')}${rightPad(shipping_detail.compl_tipo_servico, 2, ' ')}`
        segmento += `${rightPad(shipping_detail.finalidade_ted, 5, ' ')}${rightPad(shipping_detail.compl_finalidade_pgto, 2, ' ')}`
        segmento += `${rightPad(' ', 3, ' ')}${shipping_detail.cod_aviso}${rightPad(' ', 10, ' ')}${os.EOL}`

        return segmento
    }

    const segmento_b = ( shipping_detail ) => {

        shipping_detail.abatimento = shipping_detail.abatimento || DETAIL.ABATIMENTO
        shipping_detail.desconto = shipping_detail.desconto || DETAIL.DESCONTO
        shipping_detail.juros = shipping_detail.juros || DETAIL.JUROS
        shipping_detail.multa = shipping_detail.multa || DETAIL.MULTA

        let segmento = `${HEADER.COD_BANCO}${HEADER.LOTE_SERVICO_LOTE}3${leftPad(++NUMERO_REGISTRO, 5, '0')}B ${rightPad(' ', 3, ' ')}`
        segmento += `${shipping_detail.tipo_inscricao_pagador}${leftPad(shipping_detail.inscricao_pagador, 14, '0')}`
        segmento += `${rightPad(shipping_detail.logradouro, 30, ' ')}${leftPad(shipping_detail.numero, 5, '0')}${rightPad(shipping_detail.bairro, 15, ' ')}`
        segmento += `${rightPad(shipping_detail.cidade, 15)}${shipping_detail.cep}${shipping_detail.uf}${shipping_detail.data_pgto}${shipping_detail.valor_pgto}`
        segmento += `${shipping_detail.abatimento}${shipping_detail.desconto}${shipping_detail.juros}${shipping_detail.multa} ${shipping_detail.cod_aviso}`
        segmento += `${leftPad(' ', 6, '0')}${rightPad(' ', 8, ' ')}${os.EOL}`

        return segmento
    }

    const trailer_lote = ( shipping ) => {
        //Quantidade de registros * 3 (QUANTIDADE DE SEGMENTOS) + 3 ( HEADER DE LOTE E TRAILER DE LOTE )
        const SHIPPING_STRING_LENGTH = shipping.length * 3 + 2

        let trailer = `${HEADER.COD_BANCO}${HEADER.LOTE_SERVICO_LOTE}5${leftPad('', 9)}`
        trailer += `${leftPad(SHIPPING_STRING_LENGTH, 6, '0')}${leftPad('', 217)}${os.EOL}`

        return trailer
    }

    const trailer_file = ( shipping ) => {
        //Quantidade de registros * 3 (QUANTIDADE DE SEGMENTOS) + 4 ( HEADERS E TRAILERS )
        const SHIPPING_STRING_LENGTH = shipping.length * 3 + 4
        
        let trailer = `${HEADER.COD_BANCO}99999${leftPad('', 9)}${leftPad('1', 6, '0')}`
        trailer += `${leftPad(SHIPPING_STRING_LENGTH, 6, '0')}${leftPad('', 211)}${os.EOL}`

        return trailer
    }

    return {
        header_file: () => header_file(),
        header_lote: () => header_lote(),
        segments: (shipping_detail) => `${segmento_a(shipping_detail)}${segmento_b(shipping_detail)}`,
        trailer_lote: (shipping) => trailer_lote(shipping),
        trailer_file: (shipping) => trailer_file(shipping)
    }

})()