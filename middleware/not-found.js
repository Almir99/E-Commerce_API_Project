const {StatusCodes} = require("http-status-codes");

const NotFound = async (requset,respnse)=>{
    respnse.status(StatusCodes.NOT_FOUND).send("Route does not exist")
}

module.exports = {
    NotFound
}