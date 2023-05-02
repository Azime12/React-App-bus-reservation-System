const jwt = require('jsonwebtoken')

module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];

    if(!token){
        res.status(401).send({
            message:'Auth failed',
            success:false
        })
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET)
    req.body.userId = decode.userId
    next()
    } catch (err) {
        res.status(500).send({
            message:err.message,
            success:false
        })
    }
    
}