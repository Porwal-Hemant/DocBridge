import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => 
{
//  const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })
// from appContext I have sended token state that i have extracted this token state in the MyProfile.jsx page from where i have done this above call 
    const { token } = req.headers
    if (!token) 
    {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        // we will process the token with the help of secret key 
        req.body.userId = token_decode.id
        // any route can now use req.body.userId  in order to obtain this id which we found with the help of token with the help of verification method in userController.js file

        // req.body.userId = token_decode.id   // we are extracting user id from the token and sending it to the next function
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        // By using this we will get user id with the help of token 
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authUser  ;

 
