const moment = require('moment')

errorModel = (msg, endpoint, status) => {
    let errormsg = new Error(msg)
    errormsg.msg = msg
    errormsg.status = status
    errormsg.endpoint = endpoint
    errormsg.timestamp = moment().format()
    // throw errormsg
    return errormsg
}

module.exports = errorModel