const leftPad = require('left-pad')
const os = require('os')
const fs = require('fs')
const { HEADER, DETAIL } = require('../layouts/bb/contants')

const create = (shipping) => {
    
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
        let header = `${HEADER.COD_BANCO}${HEADER.LOTE_SERVICO_LOTE}300000P ${shipping_detail.cod_mov}`
        header += `${leftPad(HEADER.AGENCIA, 6, '0')}${leftPad(HEADER.NUMERO_CONTA, 13, '0')}0${leftPad(shipping_detail.nosso_numero, 20, '0')}`
        header += `${DETAIL.COD_CARTEIRA}${DETAIL.FORMA_CADASTRAMENTO}0${DETAIL.TIPO_EMISSAO}${DETAIL.TIPO_DISTRIBUICAO}`
        header += `${leftPad(shipping_detail.numero_documento, 15)}${shipping_detail.data_vencimento}${shipping_detail.valor_titulo}`
        header += `${leftPad('', 5, '0')} ${DETAIL.ESPECIE}${DETAIL.ACEITE}${shipping_detail.data_emissao}`
        header += `${DETAIL.COD_JUROS}${DETAIL.DATA_JUROS}${DETAIL.JUROS}${DETAIL.COD_DESCONTO}${DETAIL.DATA_DESCONTO}${DETAIL.DESCONTO}`
        header += `${DETAIL.IOF}${DETAIL.ABATIMENTO}${leftPad(shipping_detail.numero_documento, 25)}${DETAIL.COD_PROTESTO}`
        header += `${DETAIL.NUM_DIAS_PROTESTO}${DETAIL.COD_BAIXA}${DETAIL.NUM_DIAS_BAIXA}${DETAIL.MOEDA}${leftPad('', 10, '0')} ${os.EOL}`

        return header
    }

    const segmento_q = ( shipping_detail ) => {
        let header = `${HEADER.COD_BANCO}${HEADER.LOTE_SERVICO_LOTE}300000Q ${shipping_detail.cod_mov}`
        header += `${shipping_detail.tipo_inscricao_pagador}${leftPad(shipping_detail.inscricao_pagador, 15, '0')}`
        header += `${leftPad(shipping_detail.nome_pagador, 40)}${leftPad(shipping_detail.endereco_pagador, 40)}`
        header += `${leftPad(shipping_detail.bairro_pagador, 15)}${shipping_detail.cep_pagador}${leftPad(shipping_detail.cidade_pagador, 15)}`
        header += `${shipping_detail.uf_pagador}${leftPad('', 16, '0')}${leftPad('', 40)}000${leftPad('', 28)}${os.EOL}`

        return header
    }

    const segmento_r = ( shipping_detail ) => {
        let header = `${HEADER.COD_BANCO}${HEADER.LOTE_SERVICO_LOTE}300000R ${shipping_detail.cod_mov}`
        header += `${leftPad('', 48, '0')}${leftPad('', 34, '0')}${leftPad('', 100)}${leftPad('', 32, '0')}`
        header += `${leftPad('', 9)}${os.EOL}`

        return header
    }

    return new Promise((resolve, reject) => {
        const shipping_content = (el) => `${segmento_p(el)}${segmento_q(el)}${segmento_r(el)}`

        const get_header = `${header_file()}${header_lote()}`
        const get_content = shipping.map( (el, idx) => shipping_content(el) ).join('')

        fs.writeFile('C:/A/file.txt', `${get_header}${get_content}`, (err) => {
            if ( err ) console.log(err)

            console.log('Arquivo gerado com sucesso!')
        })
    })

}

module.exports = create