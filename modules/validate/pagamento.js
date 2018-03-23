const moment = require('moment')
const leftPad = require('left-pad')
const rightPad = require('right-pad')
const TODAY = moment()
const { HEADER } = require('../../layouts/bb/constants')
const { validTipoMov,
        validCodInstrucaoMovimento,
        validCodCamara,
        validInscKind,
        validUF,
        isValidCPF,
        isValidCNPJ } = require('../params')

const validatePag = ( shipment ) => {
    return new Promise((resolve, reject) => {
        
        const isValidShipping = ( el, idx ) => {

            if ( !(el instanceof Object) ) reject(`Deve ser um objeto literal [object index: ${idx}]`)

            const obj = Object.assign({}, el)
            const objectIndex = `[object index: ${idx}]`

            /*
            * SERVIÇO
            */
            // Tipo de movimentação
            if ( !el.tipo_movimento ) {
                reject(`Parâmetro \`tipo_movimento\` é obrigatório ${objectIndex}`)
            } else if ( !validTipoMov.includes(el.tipo_movimento) ) {
                reject(`\`tipo_movimento\` inválido ${objectIndex}`)
            }
            // Código de instrução da movimentação
            if ( !el.cod_instrucao ) {
                reject(`Parâmetro \`cod_instrucao\` é obrigatório ${objectIndex}`)
            } else if ( !validCodInstrucaoMovimento.includes(el.cod_instrucao) ) {
                reject(`\`cod_instrucao\` inválido ${objectIndex}`)
            }
            /*
            * FAVORECIDO
            */
            // Código da câmara centralizadora
            if ( !el.cod_camara ) {
                reject(`Parâmetro \`cod_camara\` é obrigatório ${objectIndex}`)
            } else if ( !validCodCamara.includes(el.cod_camara) ) {
                reject(`\`cod_camara\` inválido ${objectIndex}`)
            }
            // Agencia
            
            // Número da conta

            // Nome
            if ( !el.nome ) 
                reject(`Parâmetro \`nome\` é obrigatório ${objectIndex}`)
            
            obj.nome = obj.nome.substring(0, 30)
            /*
            * CRÉDITO
            */
            // Seu número
            if ( !el.seu_numero )
                reject(`Parâmetro \`nome\` é obrigatório ${objectIndex}`)

            obj.seu_numero = obj.seu_numero.substring(0, 20)
            // Data de Pagamento
            if ( !el.data_pgto ) {
                reject(`Parâmetro \`data_pgto\` é obrigatório ${objectIndex}`)            
            } else if ( !el.data_pgto instanceof Date ) {
                reject(`\`data_pgto\` deve ser instância do objeto Date ${objectIndex}`)         
            } 
            
            obj.data_pgto = !TODAY.diff(el.data_pgto, 'days', true) > 0 
                ? moment(TODAY.toDate()).format('DDMMYYYY')
                : moment(el.data_pgto).format('DDMMYYYY')
            // Valor do Pagamento
            if ( !el.valor_pgto ) {
                reject(`Parâmetro \`valor_pgto\` é obrigatório ${objectIndex}`)
            } else if ( typeof el.valor_pgto != 'number' ) {
                reject(`\`valor_pgto\` deve ser um número real ${objectIndex}`)
            }
    
            const VALOR_TITULO_STRING = (Math.abs(parseFloat(el.valor_pgto))).toFixed(2).replace('.', '')
            obj.valor_pgto = leftPad(VALOR_TITULO_STRING, 15, 0)
            // Nosso número
            if ( !el.nosso_numero )
                reject(`Parâmetro \`nosso_numero\` é obrigatório ${objectIndex}`)

            obj.nosso_numero = obj.nosso_numero.substring(0, 20)
            // Data real
            obj.data_real = rightPad('0', 8, '0')
            // Valor real
            obj.valor_real = rightPad('0', 15, '0')
            /*
            * OUTROS
            */
            // Cód. finalidade DOC

            // Cód. finalidade TED

            // Cód. finalidade COMPLEMENTAR

            // Aviso
            if ( !el.cod_aviso ) {
                reject(`Parâmetro \`cod_aviso\` é obrigatório ${objectIndex}`)
            } else if ( !validCodAviso.includes(el.cod_aviso) ) {
                reject(`Parâmetro \`cod_aviso\` inválido ${objectIndex}`)
            }
            /*
            * DADOS COMPLEMENTARES
            */
            // Tipo de inscrição
            if ( !el.tipo_inscricao_pagador ) {
                reject(`Parâmetro \`tipo_inscricao_pagador\` é obrigatório ${objectIndex}`)            
            } else if ( !validInscKind.includes(el.tipo_inscricao_pagador) ) {
                reject(`\`tipo_inscricao_pagador\` inválido ${objectIndex}`)            
            }
            // Número de inscrição
            if ( !el.inscricao_pagador ) {
                reject(`Parâmetro \`inscricao_pagador\` é obrigatório ${objectIndex}`)            
            } else if ( 
                (el.tipo_inscricao_pagador == '1' && !isValidCPF(el.inscricao_pagador) ) ||
                (el.tipo_inscricao_pagador == '2' && !isValidCNPJ(el.inscricao_pagador) )
            ) {
                reject(`\`inscricao_pagador\` inválido ${objectIndex}`)                            
            }

            obj.inscricao_pagador = el.tipo_inscricao_pagador == '1' 
                ? el.inscricao_pagador.substring(0, 11) : el.inscricao_pagador.substring(0, 14)
            // Nome da rua
            if ( !el.endereco ) 
                reject(`Parâmetro \`endereco\` é obrigatório ${objectIndex}`)
        
            obj.endereco = el.endereco.toString().substring(0, 30)
            // Número do local
            if ( !el.numero ) 
                reject(`Parâmetro \`endereco\` é obrigatório ${objectIndex}`)
            
            obj.numero = el.numero.substring(0, 6)
            // Complemento
            obj.complemento = rightPad(el.complemento || '', 15, ' ')
            // Bairro
            if ( !el.bairro )
                reject(`Parâmetro \`bairro\` é obrigatório ${objectIndex}`)
            
            obj.bairro = el.bairro.toString().substring(0, 15)
            // Cidade
            if ( !el.cidade ) 
                reject(`Parâmetro \`cidade\` é obrigatório ${objectIndex}`)
        
            obj.cidade = el.cidade.toString().substring(0, 15)
            //CEP
            if ( !el.cep ) {
                reject(`Parâmetro \`cep\` é obrigatório ${objectIndex}`)                
            } else if ( !(/^[0-9]+$/).test(el.cep) ) {
                reject(`\`cep\` deve conter apenas números ${objectIndex}`)                
            } else if ( el.cep.length != 8 ) {
                reject(`\`cep\` tamanho inválido ${objectIndex}`)                
            }
            // UF
            if ( !el.uf ) {
                reject(`Parâmetro \`uf\` é obrigatório ${objectIndex}`)
            } else if ( !validUF.includes(el.uf) ) {
                reject(`\`uf\` inválido ${objectIndex}`)
            }

            return obj
        }    
        
        if ( !(shipment instanceof Object) ) reject('Deve ser um array de objetos')
        
        resolve(shipment.map( isValidShipping ))
    })
}

module.exports = validatePag