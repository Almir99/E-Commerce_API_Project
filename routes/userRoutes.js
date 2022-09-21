const express = require("express")
const {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword} = require("../controller/userController");
const {authenticateUser} = require("../middleware/authentication");
const {authPermissions} = require("../utils/Permissions");
const userRoutes = express.Router()

userRoutes.route("/").get(authenticateUser, authPermissions("admin","owner"),getAllUsers)

userRoutes.route("/updatePassword").patch(authenticateUser,updateUserPassword)

userRoutes.route("/updateUser").patch(authenticateUser,updateUser)

userRoutes.route("/showMe").get(authenticateUser,showCurrentUser)

userRoutes.route("/:id").get(authenticateUser,getSingleUser)

module.exports = {
    userRoutes
}