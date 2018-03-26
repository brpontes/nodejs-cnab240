
const getContext = ( kind ) => {
    switch ( kind ) {
        case 'COBRANCA':
            return require('./cobranca')
        case 'PAGAMENTO':
            return require('./pagamento')
        default:
            throw 'INFORME UM TIPO DE REMESSA VÁLIDO: COBRANCA || PAGAMENTO'
    }
}

module.exports = ( obj ) => {
    return new Promise((resolve, reject) => {
        const { shipping, kind } = obj
        const context = getContext(kind)    
        const header = `${context.header_file()}${context.header_lote()}`
        const shipping_content = (el) => context.segments(el)
        const content = shipping.map( shipping_content ).join('')
        const trailer = `${context.trailer_lote(shipping)}${context.trailer_file(shipping)}`
        
        resolve(`${header}${content}${trailer}`)
    })
}