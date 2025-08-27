import jwt from 'jsonwebtoken'

const auth = async(request,response,next)=>{
    try {
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]
       
        if(!token){
            return response.status(401).json({
                message : "Please login",
                error : true,
                success : false
            })
        }

        const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)

        console.log(decode);
        

        if(!decode){
            return response.status(401).json({
                message : "unauthorized access",
                error : true,
                success : false
            })
        }

        request.userId = decode.id

        next()

    } catch (error) {
          if (error.name === 'TokenExpiredError') {
            return response.status(401).json({
                message: "Access token has expired.",
                error: true,
                success: false
            });
        }

        return response.status(500).json({
            message : "You have not login",///error.message || error,
            error : true,
            success : false
        })
    }
}

export default auth

// This middleware protects routes by checking if the request has a valid JWT token. 
// If yes → continue, if no → block the request.

// This middleware checks if a request comes from a logged-in user by verifying their JWT token. 
// If the token is missing or invalid, the request is rejected.