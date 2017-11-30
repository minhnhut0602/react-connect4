const {deepstream} = require('deepstream.io-client-js')

let playersCount = 0

const provider = deepstream('localhost:6020')

const provideRpc = function (provider) {
    provider.rpc.provide('get-player-color', (data, response) => {
        response.accept()

        if (playersCount === 0) {
            response.send('red')
            playersCount++
        } else if (playersCount === 1) {
            response.send('blue')
            playersCount++
        } else {
            response.reject()
        }
    })
}

provider.login({
    username: 'provider'
}).then(provideRpc.bind(null, provider))