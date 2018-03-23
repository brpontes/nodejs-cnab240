const create = require('./modules/create')

module.exports = (() => {

    const init = ( shipping, kind = 'COBRANCA' ) => {
        return new Promise((resolve, reject) => {
            if ( !shipping ) throw 'Should contain an object array'
            
            let validate 
            
            switch ( kind ) {
                case 'COBRANCA':
                    validate = require('./modules/validate/cobranca')
                    break
                case 'PAGAMENTO':
                    validate = require('./modules/validate/pagamento')
                    break
                default:
                    throw 'INFORME UM TIPO DE REMESSA VÁLIDO: COBRANCA || PAGAMENTO'
                    break
            }

            validate( shipping )
            .then( create )
            .then( result => resolve(result) )
            .catch( err => reject(err) )
        })
    }

    return {
        init: (shipping, kind) => init(shipping, kind)
    }

})()