const {UnauthenticatedError} = require("../errors");
const {isTokenValid} = require("../utils");



const authenticateUser = async (request,response,next) =>{

    // ? Passing along cookie token
    const token = request.signedCookies.token

    // ! Error if there was no token
    if (!token){
        throw new UnauthenticatedError("Authentication invalid")
    }

    try {
        // + Validating a token
        const payload = isTokenValid(token)

        // ? Sending other useful information
        request.authUserInfo = {
            userId:payload.id,
            name:payload.name,
            role:payload.role
        }

        next()
    }
    catch (error){
        throw new UnauthenticatedError("Authentication invalid")
    }
}

module.exports = {
    authenticateUser
}