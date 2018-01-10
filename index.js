const cnab240 = require('./lib')
const fs = require('fs')
const data = require('./datasource')

cnab240
    .init( data )
    .then( result => fs.writeFileSync('C:/A/file.txt', result) )
    .catch( err => console.log(err) )