const { init } = require('../index')
const datasource = require('../example/datasource')

describe('#index.js', () => {

    it('should throws if first argument is not an array of objects', () => {
        return init()
            .catch(error => expect(error).toBe('Should contain an object array'))
    })

    it('should be an promise', () => {
        expect(init(datasource)).toBeInstanceOf(Promise)
    })

    it('should return a string content', () => {
        init(datasource).then(response => expect(response).not.toBe(''))
    })
})