const leftPad = require('left-pad')
const rightPad = require('right-pad')
const os = require('os')
const { HEADER, DETAIL } = require('../layouts/bb/contants')

const create = (shipping) => {
    
    let NUMERO_REGISTRO = 0

    const header_file = () => {
        let header = `${HEADER.COD_BANCO}${HEADER.LOTE_SERVICO_ARQUIVO}${HEADER.TIPO_REGISTRO_ARQUIVO}${leftPad('', 9)}`
        header += `${HEADER.TIPO_INSCRICAO}${leftPad(HEADER.INSCRICAO, 14, '0')}`
        header += `${leftPad(HEADER.CONVENIO, 9, '0')}${HEADER.COBRANCA_CEDENTE + HEADER.CARTEIRA + HEADER.VARIACAO_CARTEIRA}  `
        header += `${leftPad(HEADER.AGENCIA, 6, '0')}${leftPad(HEADER.NUMERO_CONTA, 13, '0')} ${leftPad(HEADER.NOME_EMPRESA, 30)}`
        header += `${leftPad(HEADER.NOME_BANCO, 30)}${leftPad(' ', 10)}${HEADER.CODIGO_REM_RET}${HEADER.DATA_GERACAO}`
        header += `${HEADER.HORA_GERACAO}${HEADER.NSA}${HEADER.VERSAO_LEIAUTE}${leftPad('', 5, '0')}${leftPad(' ', 69)}${os.EOL}`

       return header
    }

    const header_lote = () => {
        let header = `${HEADER.COD_BANCO}${HEADER.LOTE_SERVICO_LOTE}${HEADER.TIPO_REGISTRO_LOTE}${HEADER.TIPO_OPERACAO}${HEADER.TIPO_SERVICO}  `
        header += `${HEADER.VERSAO_LEIAUTE} ${HEADER.TIPO_INSCRICAO}${leftPad(HEADER.INSCRICAO, 15, '0')}`
        header += `${leftPad(HEADER.CONVENIO, 9, '0')}${HEADER.COBRANCA_CEDENTE}${HEADER.CARTEIRA}${HEADER.VARIACAO_CARTEIRA}`
        header += `${leftPad(HEADER.TESTE, 2)}${leftPad(HEADER.AGENCIA, 6, '0')}${leftPad(HEADER.NUMERO_CONTA, 13, '0')} `
        header += `${leftPad(HEADER.NOME_EMPRESA, 30)}${leftPad('', 80)}${leftPad('', 8, '0')}${HEADER.DATA_GERACAO}${leftPad('', 41)}${os.EOL}`
        
        return header
    }

    const segmento_p = ( shipping_detail ) => {
        
        shipping_detail.tipo_juros = shipping_detail.tipo_juros || DETAIL.COD_JUROS
        shipping_detail.data_juros =  shipping_detail.data_juros || DETAIL.DATA_JUROS
        shipping_detail.juros = shipping_detail.juros || DETAIL.JUROS
        shipping_detail.tipo_desconto = shipping_detail.tipo_desconto || DETAIL.COD_DESCONTO
        shipping_detail.data_desconto =  shipping_detail.data_desconto || DETAIL.DATA_DESCONTO
        shipping_detail.desconto = shipping_detail.desconto || DETAIL.DESCONTO

        let segmento = `${HEADER.COD_BANCO}${HEADER.LOTE_SERVICO_LOTE}3${leftPad(++NUMERO_REGISTRO, 5, '0')}P ${shipping_detail.cod_mov}`
        segmento += `${leftPad(HEADER.AGENCIA, 6, '0')}${leftPad(HEADER.NUMERO_CONTA, 13, '0')}0${rightPad(shipping_detail.nosso_numero, 20, ' ')}`
        segmento += `${DETAIL.COD_CARTEIRA}${DETAIL.FORMA_CADASTRAMENTO}0${DETAIL.TIPO_EMISSAO}${DETAIL.TIPO_DISTRIBUICAO}`
        segmento += `${leftPad(shipping_detail.numero_documento, 15)}${shipping_detail.data_vencimento}${shipping_detail.valor_titulo}`
        segmento += `${leftPad('', 5, '0')} ${DETAIL.ESPECIE}${DETAIL.ACEITE}${shipping_detail.data_emissao}`
        segmento += `${shipping_detail.tipo_juros}${shipping_detail.data_juros}${shipping_detail.juros}`
        segmento += `${shipping_detail.tipo_desconto}${shipping_detail.data_desconto}${shipping_detail.desconto}`
        segmento += `${DETAIL.IOF}${DETAIL.ABATIMENTO}${leftPad(shipping_detail.numero_documento, 25)}${DETAIL.COD_PROTESTO}`
        segmento += `${DETAIL.NUM_DIAS_PROTESTO}${DETAIL.COD_BAIXA}${DETAIL.NUM_DIAS_BAIXA}${DETAIL.MOEDA}${leftPad('', 10, '0')} ${os.EOL}`

        return segmento
    }

    const segmento_q = ( shipping_detail ) => {
        let segmento = `${HEADER.COD_BANCO}${HEADER.LOTE_SERVICO_LOTE}3${leftPad(++NUMERO_REGISTRO, 5, '0')}Q ${shipping_detail.cod_mov}`
        segmento += `${shipping_detail.tipo_inscricao_pagador}${leftPad(shipping_detail.inscricao_pagador, 15, '0')}`
        segmento += `${leftPad(shipping_detail.nome_pagador, 40)}${leftPad(shipping_detail.endereco_pagador, 40)}`
        segmento += `${leftPad(shipping_detail.bairro_pagador, 15)}${shipping_detail.cep_pagador}${leftPad(shipping_detail.cidade_pagador, 15)}`
        segmento += `${shipping_detail.uf_pagador}${leftPad('', 16, '0')}${leftPad('', 40)}000${leftPad('', 28)}${os.EOL}`

        return segmento
    }

    const segmento_r = ( shipping_detail ) => {

        shipping_detail.tipo_multa = shipping_detail.tipo_multa || DETAIL.COD_MULTA
        shipping_detail.data_multa =  shipping_detail.data_multa || DETAIL.DATA_MULTA
        shipping_detail.multa = shipping_detail.multa || DETAIL.MULTA

        let segmento = `${HEADER.COD_BANCO}${HEADER.LOTE_SERVICO_LOTE}3${leftPad(++NUMERO_REGISTRO, 5, '0')}R ${shipping_detail.cod_mov}`
        segmento += `${leftPad('', 48, '0')}${shipping_detail.tipo_multa}${shipping_detail.data_multa}${shipping_detail.multa}${leftPad('', 10, '0')}`
        segmento += `${leftPad('', 100)}${leftPad('', 32, '0')}${leftPad('', 9)}${os.EOL}`

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
        trailer += `${leftPad(SHIPPING_STRING_LENGTH, 6, '0')}${leftPad('', 211)}`

        return trailer
    }

    return new Promise((resolve, reject) => {
        const shipping_content = (el) => `${segmento_p(el)}${segmento_q(el)}${segmento_r(el)}`

        const get_header = `${header_file()}${header_lote()}`
        const get_content = shipping.map( shipping_content ).join('')
        const get_trailer = `${trailer_lote(shipping)}${trailer_file(shipping)}${os.EOL}`

        resolve(`${get_header}${get_content}${get_trailer}`)
    })

}

module.exports = create