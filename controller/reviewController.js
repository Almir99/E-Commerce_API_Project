const Product = require("../model/Product")
const Review = require("../model/Review")
const {BadRequestError, NotFoundError, } = require("../errors");
const {StatusCodes} = require("http-status-codes");
const {checkPermissions} = require("../utils");

// ? -------------------------------------------------------

const getAllReviews = async (request,response) => {

    // + Get all reviews
    const reviews = await Review.find({}).populate({
        path:"product", select:"name price company",
        path:"user", select:"name"
    })
    // ? .populate is for adding adrenalin's information

    // * Show all review
    response.status(StatusCodes.OK).json({reviews, count: reviews.length})
}

// ? -------------------------------------------------------

const getSingleReview = async (request,response) => {

    // + Find the existing product
    const review  = await Review.findOne({_id:request.params.id})

    // ! Error if the product doesn't exist
    if (!review){
        throw new NotFoundError("This review does not exist")
    }

    // * Show the review
    response.status(StatusCodes.OK).json({review})
}

// ? -------------------------------------------------------

const createReview = async (request,response) => {

    // * Product ID
    const {product:productId} = request.body

    // + Find the existing product
    const product  = await Product.find({_id:productId})

    // ! Error if the product doesn't exist
    if (!product){
        throw new NotFoundError("This product does not exist")
    }

    // + Check if the user already submitted a review
    const isReviewSubmitted = await Review.findOne({product:product,user:request.authUserInfo.userId})

    console.log(isReviewSubmitted)


    // ! Error if a user already submitted a review
    if(isReviewSubmitted){
        throw new BadRequestError("Review was already submitted")
    }

    // + To give a user same id
    request.body.user = request.authUserInfo.userId

    // * Create a review
    const review = await Review.create(request.body)

    // * Post a successful review
    response.status(StatusCodes.CREATED).json({review})

}

// ? -------------------------------------------------------

const updateReview = async (request,response) => {

    // + Getting all the required info
    const {rating,title,comment} = request.body

    // ? Finding the review
    const review = await Review.findOne({_id: request.params.id})

    // ! Error if the review doesn't exist
    if (!review) {
        throw new NotFoundError("This review does not exist")
    }

    // ! Error if someone is trying to delete a review, but they are not Authorized
    checkPermissions(request.authUserInfo, review.user)

    // ? For changing the review
    review.rating = rating
    review.title = title
    review.comment = comment

    // + For saving the review
    await review.save()

    // * Update a review
    response.status(StatusCodes.OK).json({review})
}

// ? -------------------------------------------------------

const deleteReview = async (request,response) => {

    // + For selecting a product
    const review = await Review.findOne({_id:request.params.id})

    // ! Error if no product is there
    if(!review){
        throw new NotFoundError("This review does not exist")
    }

    // ! Error if someone is trying to delete a review, but they are not Authorized
    checkPermissions(request.authUserInfo, review.user)

    // ? For removing a product
    await review.remove()

    // * Displaying an updated product
    response.status(StatusCodes.OK).json({msg : "Review is removed"})
}

// ? Another why to get reviews for a single product
const SingleProductReview = async (request, response)=>{

    const productId = request.params.id

    const review = await Review.find({product:productId})

    response.status(StatusCodes.OK).json({review, count:review.length})

}

module.exports = {
    getAllReviews,
    getSingleReview,
    createReview,
    updateReview,
    deleteReview,
    SingleProductReview
}