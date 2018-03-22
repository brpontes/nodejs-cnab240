const validateCobranca = require('./validateCobranca')
const validatePag = require('./validatePag')

module.exports = ( shipment, kind = 'COBRANÇA' ) => kind == 'COBRANÇA' ? validateCobranca : validatePag