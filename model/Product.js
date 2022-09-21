const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide a name"],
        maxLength:[100, "Name can not be more then 100 characters"]
    },
    price:{
        type:Number,
        required:[true,"Please provide a price"],
        default:0
    },
    description:{
        type:String,
        required:[true,"Please provide a description"],
        maxLength:[1000, "Description can not be more then 1000 characters"]
    },
    image:{
        type:String,
        default: '/uploads/computer-1.jpeg',
    },
    category:{
        type:String,
        required:[true,"Please provide a category"],
        enum:["office","kitchen","bedroom"]
    },
    company:{
        type:String,
        required:[true,"Please provide a company"],
        enum:{
            values:["ikea","liddy","marcos"],
            message:"{VALUE} is not supported"
        }
    },
    colors:{
        type:[String],
        default:["#fff"],
        required:[true,"Please provide a color"]
    },
    featured:{
        type:Boolean,
        default:false
    },
    freeShipping:{
        type:Boolean,
        default:false
    },
    inventory:{
        type:Number,
        required:true,
        default:15
    },
    averageRating:{
        type:Number,
        default:0
    },
    numberOfRiviews:{
        type:Number,
        default:0
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
    timestamps:true,
    toJSON:{virtuals:true}, // + these two are to allow as to use pollute for other schemas that we didn't include before
    toObject:{virtuals:true}
})

ProductSchema.virtual("reviews", {
    ref:"Review", // + This is the reference for the model
    localField:"_id", // + The id of the reviews-model
    foreignField:"product", // + reference to the field of that is using this schema in the other schema aka review is using product in its schema, so we are just invoking similar but just reverse
    justOne:false // + To get a list
})

ProductSchema.pre("remove", async function(){
    await this.model("Review").deleteMany({product:this._id})
})

module.exports = mongoose.model("Product",ProductSchema)