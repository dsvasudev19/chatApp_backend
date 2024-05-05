const router=require("express").Router();
const authController=require("./../controllers/authController")


router.post("/login",authController.login)

router.post("/register",authController.register);

router.get("/user/by/token",authController.getUserByToken)


module.exports=router