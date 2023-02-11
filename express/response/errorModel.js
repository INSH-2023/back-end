const moment = require('moment')

errorModel = (msg, endpoint) => {
    return {
        error: msg,
        endpoint: endpoint,
        timestamp: moment().format()
    }
}

module.exports = errorModel