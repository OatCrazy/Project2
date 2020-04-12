const jwt = require('jsonwebtoken')
const User = require('../models/User')

//middleware
const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const payload = jwt.verify(token, process.env.TOKEN_KEY)

        const user = await User.findOne( {_id: payload._id,
                                            'tokens.token': token} )

        if(!user) { throw new Error() }

        //attach user
        req.user = user
        req.token = token

        next()
        
    } catch (error) {
        
        res.status(401).json({ error: 'Not authorized'})
        
    }


}

module.exports = auth