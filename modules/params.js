const params = {
    validBanks: ['001', '104', '237', '341'],
    validCodMov: ['01', '02', '04', '05', '06', '07', '08', '09', '10', '30', '31', '40'],
    validTipoMov: ['0', '1', '3', '5', '7', '9'],
    validCodInstrucaoMovimento: ['00', '09', '10', '11', '17', '19', '23', '25', '27', '33', '40', '99'],
    validCodCamara: ['018', '700'], // 018 -> TED | 700 -> DOC
    validCodDoc: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '16', '17', '18', '19'],
    validCodAviso: ['0', '2', '5', '6', '7'],
    validInscKind: ['1', '2'],
    validJurosKind: ['0', '1', '2'],
    validMultaKind: ['0', '1', '2'],
    validDescontoKind: ['0', '1', '2', '3'],
    validUF: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES',
    'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ',
    'RN', 'RO', 'RS', 'RR', 'SC', 'SE', 'SP', 'TO']
}

module.exports = params