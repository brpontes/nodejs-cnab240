const cnab240 = require('../index.js')
const fs = require('fs')
const datasource = require('./datasource')

cnab240
    .init( datasource )
    .then( res => fs.writeFileSync('C:/A/TESTE.txt', res) )
    .catch( err => console.log(err) )