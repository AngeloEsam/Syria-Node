const jwt = require('jsonwebtoken');
function auth(req,res,next){
    let {authorization} =req.headers;
    if(!authorization){
      return  res.json({message:"Please login"})
    }
    try{
        let decode = jwt.verify(authorization,process.env.SECRET_KEY);
        req.id=decode.data.id;
        req.role=decode.data.role;
        next()
    }   catch(error){
        res.json({message: error});
    } 
 
}
function restrictTo(...roles){
    return (req,res,next) =>{
        if(!roles.includes(req.role)){
            return res.status(401).json({message:'You are not authorized to view this resource'})
        }
        next();
    }
}
module.exports={auth,restrictTo};