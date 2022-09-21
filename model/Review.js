const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,"Please provide a title"],
        maxLength:[100, "Name can not be more then 100 characters"]
    },
    rating:{
        type:Number,
        required:[true,"Please provide a rating"],
        min:1,
        max:5,
    },
    comment:{
        type:String,
        required:[true,"Please provide a description"],
        maxLength:[1000, "Description can not be more then 1000 characters"]
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    product:{
        type: mongoose.Types.ObjectId,
        ref:"Product",
        required:true
    }
},{timestamps:true})

// ? Middleware for unique product review
ReviewSchema.index(
    {product: 1, user: 1},
    {unique:true}
)

ReviewSchema.statics.calculate = async function (productId) {
    const result = await this.aggregate([
        {$match: {product: productId}},
        {
            $group: {
                _id: null,
                averageRating: {$avg: "$rating"},
                numberOfRiviews: {$sum: 1}
            }
        }
    ])
    try {
        await this.model("Product").findOneAndUpdate(
            {_id: productId},
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numberOfRiviews: Math.ceil(result[0]?.averageRating || 0)
            },
            {new: true}
        )}
    catch (error) {console.log(error)}
}

ReviewSchema.post("save", async function(){
    await this.constructor.calculate(this.product)
})
ReviewSchema.post("remove", async function(){
    await this.constructor.calculate(this.product)
})

module.exports = mongoose.model("Review",ReviewSchema)