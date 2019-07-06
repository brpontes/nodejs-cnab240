exports.getContext = (type, path) => {
    if ( !['COBRANCA', 'PAGAMENTO'].includes(type) ) {
        throw 'INFORME UM TIPO DE REMESSA VÁLIDO: COBRANCA || PAGAMENTO'   
    }

    const wrapper = `./${path}/${type.toLowerCase()}`
    return require(wrapper)
}