module.exports = ( shipping, kind ) => {
    switch ( kind ) {
        case 'COBRANCA':
            return require('./cobranca')(shipping)
        case 'PAGAMENTO':
            return require('./pagamento')(shipping)
        default:
            throw 'INFORME UM TIPO DE REMESSA VÁLIDO: COBRANCA || PAGAMENTO'
    }
}