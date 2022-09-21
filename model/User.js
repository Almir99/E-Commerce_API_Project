const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please provide a name"],
        minLength:3,
        maxLength:50
    },
    email:{
        type:String,
        required:[true, "Please provide a email"],
        validate:{
          validator: validator.isEmail,
          message:"Please provide a valid email"
        },
        unique:true
    },
    password:{
        type:String,
        required:[true, "Please provide a password"],
        minLength:6
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }

})

// ? Middleware for hashing pw
UserSchema.pre("save", async function(){
    if(this.isModified("password")){
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
    }
})

// ? Password comparator
UserSchema.methods.comparePassword = async function(typedPassword){
    return bcrypt.compare(typedPassword, this.password); // + this gives bouillon (true or false)
}


module.exports = mongoose.model("User",UserSchema)