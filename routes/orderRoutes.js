const express = require("express")
const {getAllOrders, getSingleOrder, updateOrder, createOrder, getCurrentUserOrders} = require("../controller/orderController");
const {authenticateUser} = require("../middleware/authentication");
const {authPermissions} = require("../utils");
const orderRoutes = express.Router()

orderRoutes.route("/")
    .get(authenticateUser ,authPermissions("admin"),getAllOrders)
    .post(authenticateUser,createOrder)

orderRoutes.route("/showAllMyOrders")
    .get(authenticateUser,getCurrentUserOrders)

orderRoutes.route("/:id")
    .get(authenticateUser,getSingleOrder)
    .patch(authenticateUser,updateOrder)

module.exports = {
    orderRoutes
}