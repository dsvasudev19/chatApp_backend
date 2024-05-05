const {User,RefreshToken}=require("./../models")

const verify=async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({success:false,message:"No login token found"})
        }
        const {id}=jwt.verify(token,"secretissecret");
        if(!id){
            return res.status(401).json({success:false,message:"No User found.Not a valid token"})
        }
        const user=await User.findByPk(id);
        if(!user){
            return res.status(401).json({success:false,message:"No user found"})
        }
        req.user=user;
        res.cookie("token",token)

        next();
        
    } catch (error) {
        console.log(error);
    }
}

module.exports=verify;