const validate = require('../modules/validate')
const datasource = require('../example/datasource')
const datasource_pag = require('../example/datasource_pag')

describe('#validate', () => {

    it('should throws if file type is invalid', () => {
        try {
            validate(datasource, 'foo')
        } catch (error) {
            expect(error).toBe('INFORME UM TIPO DE REMESSA VÁLIDO: COBRANCA || PAGAMENTO')
        }
    })

    it('should be an promise', () => {
        expect(validate(datasource, 'COBRANCA')).toBeInstanceOf(Promise)
        expect(validate(datasource_pag, 'PAGAMENTO')).toBeInstanceOf(Promise)
    })

    describe('type is `COBRANCA`', () => {

        it('should return an object named shipping and shoud be an array', () => {
            validate(datasource, 'COBRANCA')
            .then( result => {
                expect(result).toHaveProperty('shipping')
                expect(Array.isArray(result.shipping)).toBe(true)
                expect(result.shipping.length).toBe(3)
            })
        })

    })

    describe('type is `PAGAMENTO`', () => {

        it('should return an object named shipping and shoud be an array', () => {
            validate(datasource_pag, 'PAGAMENTO')
            .then( result => {
                expect(result).toHaveProperty('shipping')
                expect(Array.isArray(result.shipping)).toBe(true)
                expect(result.shipping.length).toBe(1)
            })
        })

    })

})