const params = {
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
    'RN', 'RO', 'RS', 'RR', 'SC', 'SE', 'SP', 'TO'],
    isValidCPF: ( cpf ) => {
        const cpfTest = ( cpf ) => {
            let [soma, resto] = [0]
            cpf = cpf.trim()
            
            const invalidCPF = ['00000000000', '11111111111', '22222222222', '33333333333',
                '44444444444', '55555555555', '66666666666', '77777777777', '88888888888',
                '99999999999']

            if ( invalidCPF.includes(cpf) ) return false
            
            for ( let i = 1 ; i <= 9 ; i++ ) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i)

            resto = (soma * 10) % 11
            resto = resto == 10 || resto == 11 ? 0 : resto

            if ( resto != parseInt(cpf.substring(9, 10)) ) return false
            
            soma = 0
            for ( let i = 1 ; i <= 10 ; i++ ) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i)
            resto = (soma * 10) % 11
            
            resto = resto == 10 || resto == 11 ? 0 :  resto
            if ( resto != parseInt(cpf.substring(10, 11) ) ) return false
            
            return true
        }

        if ( !cpf ) return false
        
        return cpfTest(cpf)
    },
    isValidCNPJ: (cnpj) => {
                
        cnpj = cnpj.replace(/[^\d]+/g,'')
        
        const cnpjTest = ( cnpj ) => {
            if ( cnpj == '' || cnpj.length != 14 ) return false
        
            // Elimina CNPJs invalidos conhecidos
            if (cnpj == "00000000000000" || 
                cnpj == "11111111111111" || 
                cnpj == "22222222222222" || 
                cnpj == "33333333333333" || 
                cnpj == "44444444444444" || 
                cnpj == "55555555555555" || 
                cnpj == "66666666666666" || 
                cnpj == "77777777777777" || 
                cnpj == "88888888888888" || 
                cnpj == "99999999999999")
                return false
                
            // Valida DVs
            let tamanho = cnpj.length - 2
            let numeros = cnpj.substring(0,tamanho)
            let digitos = cnpj.substring(tamanho)
            let soma = 0
            let pos = tamanho - 7
        
            for ( let i = tamanho ; i >= 1 ; i-- ) {
                soma += numeros.charAt(tamanho - i) * pos--
                if ( pos < 2 ) pos = 9
            }
        
            let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
            if ( resultado != digitos.charAt(0) ) return false
                
            tamanho = tamanho + 1;
            numeros = cnpj.substring(0,tamanho);
            soma = 0
            pos = tamanho - 7;
            for ( let i = tamanho ; i >= 1 ; i-- ) {
                soma += numeros.charAt(tamanho - i) * pos--
                if ( pos < 2 ) pos = 9
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
            if ( resultado != digitos.charAt(1) ) return false
                
            return true
        }

        if ( !cnpj ) throw 'CNPJ é obrigatório'
        
        return cnpjTest(cnpj)
    }
}

module.exports = params