const validate = require('./modules/validate')
const create = require('./modules/create')

module.exports = (() => {

    const init = ( shipping ) => {
        return new Promise((resolve, reject) => {
            if ( !shipping ) throw 'Deve conter um array de objetos'

            validate( shipping )
            .then( create )
            .then( result => resolve(result) )
            .catch( err => reject(err) )
        })
    }

    return {
        init: (shipping) => init(shipping)
    }

})()