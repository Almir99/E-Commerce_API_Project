const User = require("../model/User")
const {StatusCodes} = require("http-status-codes");
const {NotFoundError, BadRequestError, UnauthenticatedError, } = require("../errors");
const {createTokenUser, attachCookiesToResponse, checkPermissions} = require("../utils");

const getAllUsers = async (request,response) =>{

    // + Find All Users
    const users = await User.find({role:"user"}).select("-password")

    // * Show all users
    response.status(StatusCodes.OK).json(users)
}
const getSingleUser = async (request,response) =>{

    // + Find a sur tent User
    const user = await User.findById(request.params.id).select("-password")

    // ! Error if a User doesn't exist
    if (!user){
        throw new NotFoundError(`No user with id ${request.params.id}`)
    }

    // ? Middleware for permissions
    checkPermissions(request.authUserInfo, user._id)

    // * Show the user
    response.status(StatusCodes.OK).json({user})

}
const showCurrentUser = async (request,response) =>{

    // + Find Me
    const itsMe = await User.findOne({_id:request.authUserInfo.userId})

    if(!itsMe){
        throw new NotFoundError(`No user with id ${request.params.id}`)
    }

    // * Show Me
    response.status(StatusCodes.OK).json({user:itsMe})
}
const updateUser = async (request,response) =>{

    // + Getting name and email
    const {name, email} = request.body

    // ! Error if one is missing
    if(!name || !email){
        throw new BadRequestError("Please provide bout")
    }
    console.log(request.authUserInfo.userId)
    // ? Find and update name/email
    const user = await User.findOneAndUpdate(
        {_id:request.authUserInfo.userId},
        {name,email},
        {
            new:true,
            runValidators:true
        }
    )

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse(response,tokenUser)

    // * Providing confirmation
    response.status(StatusCodes.OK).json(tokenUser)


}
const updateUserPassword = async (request,response) =>{

    // + Getting old and new password
    const {old_password,new_password} = request.body

    // ! Error if one is missing
    if(!old_password || !new_password){
        throw new BadRequestError("Please provide bout passwords")
    }

    // + Getting users info
    const user = await User.findOne({_id:request.authUserInfo.userId})

    // ? Checking if user provided good password
    const isCorrect = await user.comparePassword(old_password)

    // ! Error for bad input
    if(!isCorrect){
        throw new UnauthenticatedError("Invalid credentials")
    }

    // + Repleting old PW
    user.password = new_password

    // * Saving PW
    await user.save()

    // * Providing confirmation
    response.status(StatusCodes.OK).json({msg:"Password Saved"})

}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}