const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')

// get config vars
dotenv.config();

// get token
const getToken = (user,date) => {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: date });
}

// refresh token
const refreshToken = (jwttoken, date) => {
    let user = {}
    try {
        user = jwt.verify(jwttoken,process.env.TOKEN_SECRET)
    } catch (err) {
        jwttoken = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: date });
    }
    return jwttoken
}

// convert to user email
const getUserEmail = (jwttoken) => {
    let user = {}
    try {
        user = jwt.verify(jwttoken,process.env.TOKEN_SECRET)
    } catch (err) {
        throw new Error(err)
    }
    return user.user_email
}

// convert to user role
const getUserRole = (jwttoken) => {
    let user = {}
    try {
        user = jwt.verify(jwttoken,process.env.TOKEN_SECRET)
    } catch (err) {
        throw new Error(err)
    }
    return user.user_role
}

// check is expired
const isExpired = (jwttoken) => {
    let isExpired = false
    try {
        user = jwt.verify(jwttoken,process.env.TOKEN_SECRET)
    } catch (err) {
        isExpired = true
    }
    return isExpired
}

module.exports.getToken = getToken
module.exports.refreshToken = refreshToken
module.exports.getUserEmail = getUserEmail
module.exports.getUserRole = getUserRole
module.exports.isExpired = isExpired