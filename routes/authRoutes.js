const express = require("express")
const {register, login, logout} = require("../controller/authController");
const authRoutes = express.Router()

authRoutes.route("/register").post(register)

authRoutes.route("/login").post(login)

authRoutes.route("/logout").get(logout)

module.exports = {
    authRoutes
}