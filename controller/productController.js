const {StatusCodes} = require("http-status-codes");
const Product = require("../model/Product")
const {NotFoundError, BadRequestError} = require("../errors");
const path = require("path")

// ? -------------------------------------------------------

const getAllProduct = async (request ,response) =>{

    // + Get all products
    const products = await Product.find({})

    // * Send all products
    response.status(StatusCodes.OK).json({products, count:products.length})
}

// ? -------------------------------------------------------

const getSingleProduct = async (request ,response) =>{

    // + For selecting a product
    const product = await Product.findOne({_id:request.params.id}).populate("reviews")

    // ! Error if no product is there
    if(!product){
        throw new NotFoundError(`No product with id ${request.params.id}`)
    }

    // * Displaying the product
    response.status(StatusCodes.OK).json({product})
}

// ? -------------------------------------------------------

const createProduct = async (request ,response) =>{

    // + Giving user id
    request.body.user = request.authUserInfo.userId

    // + Creating a product
    const product = await Product.create(request.body)

    // * Conforming created product
    response.status(StatusCodes.CREATED).json({product})
}

// ? -------------------------------------------------------

const updateProduct = async (request ,response) =>{

    // + For updating a product
    const product = await Product.findOneAndUpdate(
        {_id:request.params.id},
        request.body,
        {
            new:true,
            runValidators:true
        }
    )

    // ! Error if no product is there
    if(!product){
        throw new NotFoundError(`No product with id ${request.params.id}`)
    }

    // * Displaying an updated product
    response.status(StatusCodes.OK).json({product})
}

// ? -------------------------------------------------------

const deleteProduct = async (request ,response) =>{

    // + For selecting a product
    const product = await Product.findOne({_id:request.params.id})

    // ! Error if no product is there
    if(!product){
        throw new NotFoundError(`No product with id ${request.params.id}`)
    }

    // ? For removing a product
    await product.remove()

    // * Displaying an updated product
    response.status(StatusCodes.OK).json({msg : "Product is removed"})
}

// ? -------------------------------------------------------

const uploadProductImage = async (request ,response) =>{

    // ! Error if not file is uploaded
    if(!request.files){
        throw new BadRequestError("No file uploaded")
    }

    // + For selecting an image
    const productImage = request.files.image

    // ! Error if no image is uploaded
    if(!productImage.mimetype.startsWith("image")){
        throw new BadRequestError("Please upload image")
    }

    // ? Image size
    const maxSize = 1024 * 1024

    // ! Error if an image is too big
    if(productImage.size > maxSize){
        throw new BadRequestError("Please provide smaller file image")
    }

    // ? Image path
    const imagePath = path.join(__dirname,"../public/uploads/" + `${productImage.name}`)

    // ? Moving image to the upload file
    await productImage.mv(imagePath)

    // * Image uploaded
    response.status(StatusCodes.OK).json({image:`/uploads/${productImage.name}`})
}

module.exports = {
    getAllProduct,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage
}
