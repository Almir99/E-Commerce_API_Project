const express = require("express")
const {authPermissions} = require("../utils/Permissions");
const {getAllProduct, getSingleProduct, createProduct, updateProduct, deleteProduct, uploadProductImage} = require("../controller/productController");
const {authenticateUser} = require("../middleware/authentication");
const {SingleProductReview} = require("../controller/reviewController");
const productRoutes = express.Router()

productRoutes.route("/")
    .get(getAllProduct)
    .post(authenticateUser,authPermissions("admin"),createProduct)

productRoutes.route("/uploadImage")
    .post(uploadProductImage)

productRoutes.route("/:id")
    .get(getSingleProduct)
    .patch(authenticateUser,authPermissions("admin"),updateProduct)
    .delete(authenticateUser,authPermissions("admin"),deleteProduct)

productRoutes.route("/:id/reviews")
    .get(SingleProductReview)


module.exports = {
    productRoutes
}