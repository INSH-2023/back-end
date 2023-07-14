const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')

// get config vars
dotenv.config();

// get token
const getToken = (user,date) => {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: date });
}

// refresh token
const refreshToken = (jwttoken, result, user, date) => {
    try {
        let user = jwt.verify(jwttoken,process.env.TOKEN_SECRET)
    } catch (err) {
        result = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: date });
    }
    return result
}

// convert to user email
const getUser = (jwttoken, secret) => {
    let user = {}
    try {
        user = jwt.verify(jwttoken, process.env.TOKEN_SECRET)
    } catch (err) {
        // throw new Error(err.message)
    }
    return user
}

// check is expired
const isExpired = (jwtrefreshtoken) => {
    let isExpired = false
    try {
        let user = jwt.verify(jwtrefreshtoken,process.env.TOKEN_SECRET)
    } catch (err) {
        isExpired = true
    }
    console.log(isExpired)
    return isExpired
}

module.exports.getToken = getToken
module.exports.refreshToken = refreshToken
module.exports.getUser=getUser
module.exports.isExpired = isExpired