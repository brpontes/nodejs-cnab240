module.exports = ( shipping, kind, profile ) => {
    switch ( kind ) {
        case 'COBRANCA':
            return require('./cobranca')(shipping, profile)
        case 'PAGAMENTO':
            return require('./pagamento')(shipping, profile)
        default:
            throw 'INFORME UM TIPO DE REMESSA VÁLIDO: COBRANCA || PAGAMENTO'
    }
}