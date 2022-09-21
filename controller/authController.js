const User = require("../model/User")
const {StatusCodes} = require("http-status-codes");
const {attachCookiesToResponse} = require("../utils/jwt");
const {UnauthenticatedError, BadRequestError} = require("../errors");
const {createTokenUser} = require("../utils");

const register = async (request,response)=>{

    // + For registering users
    const {name,email,password} = request.body

    // + Checking if it's a first user
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser? "admin":"user"

    // * Creating a user in DB
    const user = await User.create({name,email,password, role})

    // ? Token information
    const tokenUser = createTokenUser(user)

    // ? Attaching cookies and creating token
    attachCookiesToResponse(response, tokenUser)

    // + Info about a user
    response.status(StatusCodes.CREATED).json({user:tokenUser})

}
const login = async (request,response)=>{

    // + For login in a users
    const {email,password} = request.body

    // ! Error for checking email and password
    if (!email || !password){
        throw new BadRequestError("Please provide email and password")

    }
    // * Finding a given user
    const user = await User.findOne({email})

    // ! Error for the unexciting user
    if (!user){
        throw new UnauthenticatedError("Invalid credentials")
    }

    // + Validating users password
    const isCorrect = await user.comparePassword(password)

    // ! Error for the wrong password
    if (!isCorrect){
        throw new UnauthenticatedError("Wrong password")
    }

    // ? Token information
    const tokenUser = createTokenUser(user)

    // ? Attaching cookies and creating token
    attachCookiesToResponse(response, tokenUser)

    // + Info about a user
    response.status(StatusCodes.CREATED).json({user:tokenUser})
}
const logout = async (request,response)=>{

    // + Just to remove the token and the cookie
    response.cookie("token","logout",
        {
            httpOnly:true,
            expires:new Date(Date.now()),
        })

    response.send("You are logged out")
}

module.exports = {
    register,
    login,
    logout
}