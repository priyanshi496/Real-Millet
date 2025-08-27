import jwt from 'jsonwebtoken'

const generatedAccessToken = async(userId)=>{
    const token = await jwt.sign({ id : userId},
        process.env.SECRET_KEY_ACCESS_TOKEN,
        { expiresIn : '5h'}
    )

    return token
}
// This function generates an access token for a user based on their user ID.
// The token is signed with a secret key and has an expiration time of 5 hours.
// The generated token can be used for authenticating user requests in the application.
// The user ID is included in the token payload to identify the user.
// The function returns the generated token as a string.
// Usage: Call this function with the user's ID to get a valid access token.

export default generatedAccessToken