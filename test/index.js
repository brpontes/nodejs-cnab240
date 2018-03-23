const cnab240 = require('../index.js')
const fs = require('fs')
const datasource = require('./datasource')
const datasource_pagamento = require('./datasource_pag')

cnab240
    .init( datasource_pagamento, 'PAGAMENTO' )
    .then( res => fs.writeFileSync('C:/A/TESTE.txt', res) )
    .catch( err => console.log(err) )