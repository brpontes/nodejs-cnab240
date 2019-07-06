const moment = require('moment')
const leftPad = require('left-pad')
const rightPad = require('right-pad')
const TODAY = moment()
const { HEADER } = require('../../layouts/bb/constants')
const { validTipoMov,
        validBanks,
        validCodInstrucaoMovimento,
        validCodCamara,
        validCodAviso,
        validInscKind,
        validUF } = require('../params')
const { isValidCPF, isValidCNPJ } = require('../util')

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
                return
            } else if ( !validTipoMov.includes(el.tipo_movimento) ) {
                reject(`\`tipo_movimento\` inválido ${objectIndex}`)
                return
            }
            // Código de instrução da movimentação
            if ( !el.cod_instrucao ) {
                reject(`Parâmetro \`cod_instrucao\` é obrigatório ${objectIndex}`)
                return
            } else if ( !validCodInstrucaoMovimento.includes(el.cod_instrucao) ) {
                reject(`\`cod_instrucao\` inválido ${objectIndex}`)
                return
            }
            /*
            * FAVORECIDO
            */
            // Código da câmara centralizadora
            if ( !el.cod_camara ) {
                reject(`Parâmetro \`cod_camara\` é obrigatório ${objectIndex}`)
                return
            } else if ( !validCodCamara.includes(el.cod_camara) ) {
                reject(`\`cod_camara\` inválido ${objectIndex}`)
                return
            }
            // Código do banco
            if ( !el.banco_favorecido ) {
                reject(`Parâmetro \`banco_favorecido\` é obrigatório ${objectIndex}`)
                return
            } else if ( !validBanks.includes(el.banco_favorecido) ) {
                reject(`\`banco_favorecido\` inválido ${objectIndex}`)
                return
            }
            // Agencia
            if ( !el.agencia_favorecido ) {
                reject(`Parâmetro \`agencia_favorecido\` é obrigatório ${objectIndex}`)
                return
            }

            obj.agencia_favorecido = el.agencia_favorecido.toString().substring(0, 5)
            // Número da conta
            if ( !el.conta_favorecido ) {
                reject(`Parâmetro \`conta_favorecido\` é obrigatório ${objectIndex}`)
                return
            }

            obj.conta_favorecido = el.conta_favorecido.toString().substring(0, 12)
            // Nome
            if ( !el.nome ) {
                reject(`Parâmetro \`nome\` é obrigatório ${objectIndex}`)
                return
            }
            
            obj.nome = obj.nome.substring(0, 30)
            /*
            * CRÉDITO
            */
            // Seu número
            if ( !el.seu_numero ) {
                reject(`Parâmetro \`seu_numero\` é obrigatório ${objectIndex}`)
                return
            }

            obj.seu_numero = obj.seu_numero.substring(0, 20)
            // Data de Pagamento
            if ( !el.data_pgto ) {
                reject(`Parâmetro \`data_pgto\` é obrigatório ${objectIndex}`)            
                return
            } else if ( !(el.data_pgto instanceof Date) ) {
                reject(`\`data_pgto\` deve ser instância do objeto Date ${objectIndex}`)      
                return   
            } 
            
            obj.data_pgto = !TODAY.diff(el.data_pgto, 'days', true) > 0 
                ? moment(TODAY.toDate()).format('DDMMYYYY')
                : moment(el.data_pgto).format('DDMMYYYY')
            // Valor do Pagamento
            if ( !el.valor_pgto ) {
                reject(`Parâmetro \`valor_pgto\` é obrigatório ${objectIndex}`)
                return
            } else if ( typeof el.valor_pgto != 'number' ) {
                reject(`\`valor_pgto\` deve ser um número real ${objectIndex}`)
                return
            }
            
            const VALOR_TITULO_STRING = (Math.abs(parseFloat(el.valor_pgto))).toFixed(2).replace('.', '')
            obj.valor_pgto = leftPad(VALOR_TITULO_STRING, 15, 0)
            // Nosso número
            if ( !el.nosso_numero ) {
                reject(`Parâmetro \`nosso_numero\` é obrigatório ${objectIndex}`)
                return
            }
            
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
                return
            } else if ( !validCodAviso.includes(el.cod_aviso) ) {
                reject(`Parâmetro \`cod_aviso\` inválido ${objectIndex}`)
                return
            }
            /*
            * DADOS COMPLEMENTARES
            */
            // Tipo de inscrição
            if ( !el.tipo_inscricao_pagador ) {
                reject(`Parâmetro \`tipo_inscricao_pagador\` é obrigatório ${objectIndex}`)     
                return       
            } else if ( !validInscKind.includes(el.tipo_inscricao_pagador) ) {
                reject(`\`tipo_inscricao_pagador\` inválido ${objectIndex}`) 
                return           
            }
            // Número de inscrição
            if ( !el.inscricao_pagador ) {
                reject(`Parâmetro \`inscricao_pagador\` é obrigatório ${objectIndex}`)  
                return          
            } else if ( 
                (el.tipo_inscricao_pagador == '1' && !isValidCPF(el.inscricao_pagador) ) ||
                (el.tipo_inscricao_pagador == '2' && !isValidCNPJ(el.inscricao_pagador) )
            ) {
                reject(`\`inscricao_pagador\` inválido ${objectIndex}`)       
                return                     
            }

            obj.inscricao_pagador = el.tipo_inscricao_pagador == '1' 
                ? el.inscricao_pagador.substring(0, 11) : el.inscricao_pagador.substring(0, 14)
            // Nome da rua
            if ( !el.logradouro ) {
                reject(`Parâmetro \`logradouro\` é obrigatório ${objectIndex}`)
                return
            }
        
            obj.logradouro = el.logradouro.toString().substring(0, 30)
            // Número do local
            if ( !el.numero ) {
                reject(`Parâmetro \`numero\` é obrigatório ${objectIndex}`)
                return
            } else if ( isNaN(el.numero) ) {
                reject(`Parâmetro \`numero\` deve ser numeral ${objectIndex}`)
                return
            }
            
            obj.numero = el.numero.toString().substring(0, 6)
            // Complemento
            if ( el.hasOwnProperty('complemento') && el.complemento.toString().length < 1 ) {
                reject(`Parâmetro \`complemento\` deve conter ao menos 1 caractere ${objectIndex}`)
                return
            }
            
            obj.complemento = rightPad(el.complemento || ' ', 15, ' ')
            // Bairro
            if ( !el.bairro ) {
                reject(`Parâmetro \`bairro\` é obrigatório ${objectIndex}`)
                return
            }
            
            obj.bairro = el.bairro.toString().substring(0, 15)
            // Cidade
            if ( !el.cidade ) {
                reject(`Parâmetro \`cidade\` é obrigatório ${objectIndex}`)
                return
            }
        
            obj.cidade = el.cidade.toString().substring(0, 15)
            //CEP
            if ( !el.cep ) {
                reject(`Parâmetro \`cep\` é obrigatório ${objectIndex}`)        
                return        
            } else if ( !(/^[0-9]+$/).test(el.cep) ) {
                reject(`\`cep\` deve conter apenas números ${objectIndex}`)
                return        
            } else if ( el.cep.length != 8 ) {
                reject(`\`cep\` tamanho inválido ${objectIndex}`)                
                return
            }
            // UF
            if ( !el.uf ) {
                reject(`Parâmetro \`uf\` é obrigatório ${objectIndex}`)
                return
            } else if ( !validUF.includes(el.uf) ) {
                reject(`\`uf\` inválido ${objectIndex}`)
                return
            }
            /*
            * NÃO OBRIGATÓRIOS
            */
            // Abatimento
            if ( el.abatimento ) {
                if ( typeof el.abatimento != 'number' ) {
                    reject(`\`abatimento\` deve ser um número real ${objectIndex}`)
                    return
                }

                const VALOR_ABATIMENTO_STRING = (Math.abs(parseFloat(el.abatimento))).toFixed(2).replace('.', '')
                obj.abatimento = leftPad(VALOR_ABATIMENTO_STRING, 15, 0)
            }
            // Desconto
            if ( el.desconto ) {
                if ( typeof el.desconto != 'number' ) {
                    reject(`\`desconto\` deve ser um número real ${objectIndex}`)
                    return
                }

                const VALOR_DESCONTO_STRING = (Math.abs(parseFloat(el.desconto))).toFixed(2).replace('.', '')
                obj.desconto = leftPad(VALOR_DESCONTO_STRING, 15, 0)
            }
            // Juros
            if ( el.juros ) {
                if ( typeof el.juros != 'number' ) {
                    reject(`\`juros\` deve ser um número real ${objectIndex}`)
                    return
                }

                const VALOR_JUROS_STRING = (Math.abs(parseFloat(el.juros))).toFixed(2).replace('.', '')
                obj.juros = leftPad(VALOR_JUROS_STRING, 15, 0)
            }
            // Multa
            if ( el.multa ) {
                if ( typeof el.multa != 'number' ) {
                    reject(`\`multa\` deve ser um número real ${objectIndex}`)
                    return
                }

                const VALOR_MULTA_STRING = (Math.abs(parseFloat(el.multa))).toFixed(2).replace('.', '')
                obj.multa = leftPad(VALOR_MULTA_STRING, 15, 0)
            }

            return obj
        }    
        
        if ( !(shipment instanceof Object) ) reject('Deve ser um array de objetos')
        
        resolve({shipping: shipment.map( isValidShipping ), kind: 'PAGAMENTO'})
    })
}

module.exports = validatePag