const create = require('./modules/create')
const validate = require('./modules/validate')

module.exports = (() => {

    const init = ( shipping, kind = 'COBRANCA', profile = {} ) => {
        return new Promise((resolve, reject) => {
            if ( !shipping ) throw 'Should contain an object array'
            
            validate( shipping, kind, profile )
            .then( create )
            .then( result => resolve(result) )
            .catch( err => reject(err) )
        })
    }

    return {
        init: (profile, shipping, kind) => init(profile, shipping, kind)
    }

})()