const {UnauthorizedError} = require("../errors");

const authPermissions = (...allowedRoles) =>{

    return (req,res,next)=>{
        if(!allowedRoles.includes(req.authUserInfo.role)){
            throw new UnauthorizedError("Unauthorized to access this route")
        }
        next()
    }
}

const checkPermissions = (requestUser, resourceUserId) =>{

    if (requestUser.role == "admin") return

    if (requestUser.userId == resourceUserId) return

    throw new UnauthorizedError("Not authorized to access this route")
}

module.exports = {
    authPermissions,
    checkPermissions
}