const express = require("express")
const {authenticateUser} = require("../middleware/authentication");
const {getAllReviews, getSingleReview, createReview, updateReview, deleteReview} = require("../controller/reviewController");
const reviewRoutes = express.Router()

reviewRoutes.route("/")
    .get(getAllReviews)
    .post(authenticateUser,createReview)

reviewRoutes.route("/:id")
    .get(getSingleReview)
    .patch(authenticateUser,updateReview)
    .delete(authenticateUser,deleteReview)

module.exports = {
    reviewRoutes
}