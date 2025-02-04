import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        // we will process the token with the help of secret key 
        req.body.userId = token_decode.id
        // By using this we will get user id with the help of token 
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authUser;


