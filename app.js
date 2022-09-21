require("dotenv").config()
require("express-async-errors")

// * The classic
const express = require("express")
const fileUpload = require("express-fileupload")
const {connectDB} = require("./db/db");
const {ErrorHandlerMiddleware} = require("./middleware/error-handler");
const {NotFound} = require("./middleware/not-found");
const app = express()
const port = process.env.PORT

// + Other packages
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const {authRoutes,productRoutes,reviewRoutes,userRoutes, orderRoutes} = require("./routes");

// + Packages for extra security
const helmet = require("helmet")
const cors  = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")


// * DB
connectDB()
    .then(()=>console.log("Connected"))
    .catch(error=>console.log(error))

// + App security
app.set("trust proxy", 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // ? 15 minutes
    max: 60 // ? limit each IP to 60 requests per windowsMs
}))
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

// ? Middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(morgan("dev")) // ? It's a login middleware to help us see on what site we are on and other stuff as well
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static("./public"))
app.use(fileUpload())

// * Routes
app.get("/api/v1",(request,response)=>{
    console.log('Signed Cookies: ', request.signedCookies)
    response.send("Welcome")
})
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/users",userRoutes)
app.use("/api/v1/products",productRoutes)
app.use("/api/v1/reviews",reviewRoutes)
app.use("/api/v1/orders",orderRoutes)

// ! Errors
app.use(NotFound)
app.use(ErrorHandlerMiddleware)

// + http serve
app.listen(port,()=>{
    console.log(`We are connected at ${port}`)
})