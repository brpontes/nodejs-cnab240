const moment = require('moment')
const leftPad = require('left-pad')
const TODAY = moment()
const { HEADER } = require('../layouts/bb/contants')
const { validCodMov, 
        validInscKind,
        validJurosKind,
        validMultaKind,
        validDescontoKind,
        validUF,
        isValidCPF,
        isValidCNPJ } = require('./params')
const NOSSO_NUMERO_LENGTH = 17

const validate = ( shipment ) => {
    return new Promise((resolve, reject) => {

        const isValidShipping = ( el, idx ) => {

            if ( !(el instanceof Object) ) reject(`Deve ser um objeto literal [object index: ${idx}]`)

            const obj = Object.assign({}, el)
            const objectIndex = `[object index: ${idx}]`

            /*
            * Validação do código de movimentação
            */
            if ( !el.cod_mov ) {
                reject(`Parâmetro \`cod_mov\` é obrigatório ${objectIndex}`)
            } else if ( !validCodMov.includes(el.cod_mov) ) {
                reject(`\`cod_mov\` inválido ${objectIndex}`)
            }
            /*
            * Validação do nosso número
            */
            if ( !el.nosso_numero ) {
                reject(`Parâmetro \`nosso_numero\` é obrigatório ${objectIndex}`)
            } else if ( !el.nosso_numero.substring(0, HEADER.CONVENIO.length) == HEADER.CONVENIO ) {
                reject(`\`nosso_numero\` com convênio inválido ${objectIndex}`)
            } else if ( !(/^[0-9]+$/).test(el.nosso_numero) ) {
                reject(`\`nosso_numero\` deve conter apenas números ${objectIndex}`)
            } else if ( el.nosso_numero.length != NOSSO_NUMERO_LENGTH ) {
                reject(`\`nosso_numero\` tamanho inválido ${objectIndex}`)
            }
            /*
            * Validação do número do documento
            */
            //Se existir deverá ser o número informado
            //Caso contrário será o `nosso_número` sem o convênio
            if ( !el.numero_documento ) 
                obj.numero_documento = el.nosso_numero.substring(HEADER.CONVENIO.length)
           
            if ( obj.numero_documento.length > 15 ) {
                reject(`\`numero_documento\` tamanho inválido ${objectIndex}`)
            } else if ( !(/^[0-9]+$/).test(obj.numero_documento) ) {
                reject(`\`numero_documento\` deve conter apenas números ${objectIndex}`)
            }
            /*
            * Validação da data de vencimento
            */
            //Se a data informada for menor que a do processamento
            //A data torna-se o dia de HOJE
            //Caso contrário, será a própria data
            if ( !el.data_vencimento ) {
                reject(`Parâmetro \`data_vencimento\` é obrigatório ${objectIndex}`)            
            } else if ( !el.data_vencimento instanceof Date ) {
                reject(`\`data_vencimento\` deve ser instância do objeto Date ${objectIndex}`)         
            } 
            
            obj.data_vencimento = !TODAY.diff(el.data_vencimento, 'days', true) > 0 
                ? moment(TODAY.toDate()).format('DDMMYYYY')
                : moment(el.data_vencimento).format('DDMMYYYY')
            /*
            * Valor do título
            */
            if ( !el.valor_titulo ) {
                reject(`Parâmetro \`valor_titulo\` é obrigatório ${objectIndex}`)                        
            } else if ( typeof el.valor_titulo != 'number' ) {
                reject(`\`valor_titulo\` deve ser um número real ${objectIndex}`)                        
            }
    
            const VALOR_TITULO_STRING = (Math.abs(parseFloat(el.valor_titulo))).toFixed(2).replace('.', '')
            obj.valor_titulo = leftPad(VALOR_TITULO_STRING, 15, 0)
            /*
            * Validação da data de emissão
            */
            if ( !el.data_emissao ) {
                reject(`Parâmetro \`data_emissao\` é obrigatório ${objectIndex}`)            
            } else if ( !el.data_emissao instanceof Date ) {
                reject(`\`data_emissao\` deve ser instância do objeto Date ${objectIndex}`)            
            }
            
            obj.data_emissao = moment(el.data_emissao).diff(el.data_vencimento, 'days', true) > 0
                ? moment(el.data_vencimento).format('DDMMYYYY')
                : moment(el.data_emissao).format('DDMMYYYY')
            /*
            * Validação do tipo de inscrição do pagador
            */
            if ( !el.tipo_inscricao_pagador ) {
                reject(`Parâmetro \`tipo_inscricao_pagador\` é obrigatório ${objectIndex}`)            
            } else if ( !validInscKind.includes(el.tipo_inscricao_pagador) ) {
                reject(`\`tipo_inscricao_pagador\` inválido ${objectIndex}`)            
            }
            /*
            * Validação da inscrição do pagador
            */
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
            /*
            * Validação do nome do pagador
            */
            if ( !el.nome_pagador ) {
                reject(`Parâmetro \`nome_pagador\` é obrigatório ${objectIndex}`)                            
            } else if ( el.nome_pagador.length > 40 ) {
                obj.nome_pagador = el.nome_pagador.substring(0, 40)
            }
            /*
            * Validação do endereço do pagador
            */
            if ( !el.endereco_pagador ) {
                reject(`Parâmetro \`endereco_pagador\` é obrigatório ${objectIndex}`)
            } else if ( el.endereco_pagador.length > 40 ) {
                obj.endereco_pagador = el.endereco_pagador.substring(0, 40)
            }
            /*
            * Validação do bairro do pagador
            */
            if ( !el.bairro_pagador ) {
                reject(`Parâmetro \`bairro_pagador\` é obrigatório ${objectIndex}`)
            } else if ( el.bairro_pagador.length > 15 ) {
                obj.bairro_pagador = el.bairro_pagador.substring(0, 15)
            }        
            /*
            * Validação CEP
            */
            if ( !el.cep_pagador ) {
                reject(`Parâmetro \`cep_pagador\` é obrigatório ${objectIndex}`)                
            } else if ( !(/^[0-9]+$/).test(el.cep_pagador) ) {
                reject(`\`cep_pagador\` deve conter apenas números ${objectIndex}`)                
            } else if ( el.cep_pagador.length != 8 ) {
                reject(`\`cep_pagador\` tamanho inválido ${objectIndex}`)                
            }
            /*
            * Validação da cidade do pagador
            */
            if ( !el.cidade_pagador ) {
                reject(`Parâmetro \`cidade_pagador\` é obrigatório ${objectIndex}`)
            } else if ( el.cidade_pagador.length > 15 ) {
                obj.cidade_pagador = el.cidade_pagador.substring(0, 15)
            }
            /*
            * Validação UF do pagador
            */
            if ( !el.uf_pagador ) {
                reject(`Parâmetro \`uf_pagador\` é obrigatório ${objectIndex}`)
            } else if ( !validUF.includes(el.uf_pagador) ) {
                reject(`\`uf_pagador\` inválido ${objectIndex}`)
            }
            /*
            * 
            * CAMPOS NÃO OBRIGATÓRIOS
            *
            */
            /*
            * Validação do campo juros
            */
            //Se houver alguma propriedade relacionada a JUROS
            //Todos as outras propriedades que tem relação com o mesmo passam a ser obrigatórios
            if ( el.tipo_juros || el.data_juros || el.juros ) {
                if ( !el.tipo_juros ) {
                    reject(`Parâmetro \`tipo_juros\` é obrigatório ${objectIndex}`)
                } else if ( !el.data_juros ) {
                    reject(`Parâmetro \`data_juros\` é obrigatório ${objectIndex}`)
                } else if ( !el.juros ) {
                    reject(`Parâmetro \`juros\` é obrigatório ${objectIndex}`)
                }

                if ( !validJurosKind.includes(el.tipo_juros) ) {
                    reject(`\`tipo_juros\` inválido ${objectIndex}`)
                } else if ( !(el.data_juros instanceof Date) ) {
                    reject(`\`data_juros\` deve ser instância do objeto Date ${objectIndex}`)         
                } else if ( typeof el.juros != 'number' ) {
                    reject(`\`juros\` deve ser um número real ${objectIndex}`)                        
                }
                
                obj.data_juros = moment(el.data_juros).diff(el.data_vencimento, 'days') < 0
                    ? moment(el.data_vencimento).format('DDMMYYYY')
                    : moment(el.data_juros).format('DDMMYYYY')

                const VALOR_JUROS_STRING = (Math.abs(parseFloat(el.juros))).toFixed(2).replace('.', '')
                    obj.juros = leftPad(VALOR_JUROS_STRING, 15, 0)
            }
            /*
            * Validação do campo multa
            */
            //Se houver alguma propriedade relacionada a MULTA
            //Todos as outras propriedades que tem relação com o mesmo passam a ser obrigatórios
            if ( el.tipo_multa || el.data_multa || el.multa ) {
                if ( !el.tipo_multa ) {
                    reject(`Parâmetro \`tipo_multa\` é obrigatório ${objectIndex}`)
                } else if ( !el.data_multa ) {
                    reject(`Parâmetro \`data_multa\` é obrigatório ${objectIndex}`)
                } else if ( !el.multa ) {
                    reject(`Parâmetro \`multa\` é obrigatório ${objectIndex}`)
                }

                if ( !validMultaKind.includes(el.tipo_multa) ) {
                    reject(`\`tipo_multa\` inválido ${objectIndex}`)
                } else if ( !(el.data_multa instanceof Date) ) {
                    reject(`\`data_multa\` deve ser instância do objeto Date ${objectIndex}`)         
                } else if ( typeof el.multa != 'number' ) {
                    reject(`\`juros\` deve ser um número real ${objectIndex}`)                        
                }
                
                obj.data_multa = moment(el.data_multa).diff(el.data_vencimento, 'days') < 0
                    ? moment(el.data_vencimento).format('DDMMYYYY')
                    : moment(el.data_multa).format('DDMMYYYY')

                const VALOR_MULTA_STRING = (Math.abs(parseFloat(el.multa))).toFixed(2).replace('.', '')
                    obj.multa = leftPad(VALOR_MULTA_STRING, 15, 0)
            }
            //Se houver alguma propriedade relacionada a DESCONTO
            //Todos as outras propriedades que tem relação com o mesmo passam a ser obrigatórios
            if ( el.tipo_desconto || el.data_desconto || el.desconto ) {
                if ( !el.tipo_desconto ) {
                    reject(`Parâmetro \`tipo_desconto\` é obrigatório ${objectIndex}`)
                } else if ( !el.data_desconto ) {
                    reject(`Parâmetro \`data_desconto\` é obrigatório ${objectIndex}`)
                } else if ( !el.desconto ) {
                    reject(`Parâmetro \`desconto\` é obrigatório ${objectIndex}`)
                }

                if ( !validDescontoKind.includes(el.tipo_desconto) ) {
                    reject(`\`tipo_desconto\` inválido ${objectIndex}`)
                } else if ( !(el.data_desconto instanceof Date) ) {
                    reject(`\`data_desconto\` deve ser instância do objeto Date ${objectIndex}`)         
                } else if ( typeof el.desconto != 'number' ) {
                    reject(`\`desconto\` deve ser um número real ${objectIndex}`)                        
                }
                
                obj.data_desconto = moment(el.data_desconto).diff(el.data_vencimento, 'days') < 0
                    ? moment(el.data_vencimento).format('DDMMYYYY')
                    : moment(el.data_desconto).format('DDMMYYYY')

                const VALOR_DESCONTO_STRING = (Math.abs(parseFloat(el.desconto))).toFixed(2).replace('.', '')
                    obj.desconto = leftPad(VALOR_DESCONTO_STRING, 15, 0)
            }

            return obj
        }    
        
        if ( !(shipment instanceof Object) ) reject('Deve ser um array de objetos')
        
        resolve(shipment.map( isValidShipping ))
    })
}

module.exports = validate