const cnab240 = require('../index.js')
const fs = require('fs')
const datasource = require('./datasource')

const company = {
    COD_BANCO: '001',
    TIPO_INSCRICAO: '2',
    INSCRICAO: '03377700000198',
    CONVENIO: '3061856',
    //CONVENIO_PAG: '0007709780126',
    CARTEIRA: '17',
    VARIACAO_CARTEIRA: '051',
    AGENCIA: '28126',
    NUMERO_CONTA: '634107',
    NOME_EMPRESA: 'BP SMART TECH',
}

cnab240
    .init( datasource, 'COBRANCA' )
    .then( res => fs.writeFileSync('/home/bruno/workspace/TESTE.txt', res) )
    .catch( err => console.log(err) )