const {BadRequestError, NotFoundError} = require("../errors");
const Product = require("../model/Product")
const Order = require("../model/Order")
const {StatusCodes} = require("http-status-codes");
const {checkPermissions} = require("../utils");

// ? -------------------------------------------------------

// ! Fake function  just for testing
const fakeStripeApi = async ({amount, currency}) =>{
    const client_secret = "Random String"
    return ({client_secret, amount})
}

// ? -------------------------------------------------------

const getAllOrders = async (request,response) =>{

    // + Get all orders
    const orders = await Order.find({})

    // * Send all orders
    response.status(StatusCodes.OK).json({orders, count: orders.length})
}

// ? -------------------------------------------------------

const getSingleOrder = async (request,response) =>{
    // + Get a signal order
    const order = await Order.findOne({_id:request.params.id})

    // ! Error if no product is there
    if(!order){
        throw new NotFoundError(`No order with id ${request.params.id}`)
    }

    // + Check user permission
    checkPermissions(request.authUserInfo, order.user)

    // * Displaying the order
    response.status(StatusCodes.OK).json({order})
}

// ? -------------------------------------------------------

const getCurrentUserOrders = async (request,response) =>{

    // + Get all of your orders
    const orders = await Order.find({user:request.authUserInfo.userId})


    // * Send all orders
    response.status(StatusCodes.OK).json({orders, count: orders.length})

}

// ? -------------------------------------------------------

const createOrder = async (request,response) =>{

    // + Get info from the front end
    const {items:cartItems,tax,shippingFee}= request.body

    // ! Error if there is no items
    if(!cartItems || cartItems.length === 0){
        throw new BadRequestError("No cart items provided")
    }

    // ! Error for the tax and shippingFee
    if(!tax || !shippingFee){
        throw new BadRequestError("Please provide a tax and shipping fee")
    }

    // + Variables
    let orderItems = []
    let subTotal = 0

    // + To get all product info
    for(const item of cartItems){
        const dbProduct = await Product.findOne({_id: item.product})

        if(!dbProduct){
            throw new NotFoundError(`Product with the id of ${item.product} dose not exist`)
        }

        const {name,image,price} = dbProduct

        const singleOrderItem = {
            amount:item.amount,
            name:name,
            price:price,
            image:image,
            product:item.product
        }

        orderItems = [...orderItems,singleOrderItem]

        subTotal += item.amount * price
    }

    console.log(orderItems)
    const total = subTotal + tax + shippingFee

    const paymentIntent = await fakeStripeApi({amount: total, currency: "usd"})

    console.log(paymentIntent)
    console.log(paymentIntent.client_secret)

    const order = await Order.create({
        orderItems,
        total,
        subTotal,
        tax,
        shippingFee,
        clientSecret:paymentIntent.client_secret,
        user:request.authUserInfo.userId
    })

    response.status(StatusCodes.CREATED).json({order, clientSecret:order.clientSecret})
}

// ? -------------------------------------------------------

const updateOrder = async (request,response) =>{

    const {paymentIntentId} = request.body

    // + Get a signal order
    const order = await Order.findOne({_id:request.params.id})

    // ! Error if no product is there
    if(!order){
        throw new NotFoundError(`No order with id ${request.params.id}`)
    }

    // + Check user permission
    checkPermissions(request.authUserInfo, order.user)

    order.paymentIntentId = paymentIntentId
    order.status = "paid"

    await order.save()

    // * Displaying the order
    response.status(StatusCodes.OK).json({order})
}

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder
}