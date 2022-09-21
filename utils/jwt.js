const jwt = require("jsonwebtoken")

// ? Middleware for token
const createJWT = ({payload}) => {
    return  jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_LIFETIME}
    )}

// ? For validating a token
const isTokenValid = (token)=>{
    return  jwt.verify(token,process.env.JWT_SECRET)
}

// ? Middleware for cookie
const attachCookiesToResponse = (response, user) =>{

    const token = createJWT({payload:user})

    const oneDay = 1000 * 60 * 60 * 24

    response.cookie("token",token,
        {
            httpOnly:true,
            expires:new Date(Date.now() + oneDay),
            secure: process.env.NODE_ENV === "production",
            signed: true
        })
}


module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse}