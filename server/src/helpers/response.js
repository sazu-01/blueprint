


const successResponse = (res, {statusCode = 200, message = "success response", ...rest }) => {

    const payload = rest.payload || {};

    return res.status(statusCode).json({
        message : message,
        success : true,
        payload
    })
}



 const errorResponse = (res, {statusCode=500, message = "internal server error"}) => {
   return res.status(statusCode).json({
    success : false,
    message : message
   })
}


export {successResponse, errorResponse}