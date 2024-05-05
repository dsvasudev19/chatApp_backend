const router=require("express").Router();

const authRoutes=require("./authRoutes")
router.use("/auth",authRoutes);

const messageRoutes=require("./messageRoutes")
router.use("/message",messageRoutes)

const userRoutes=require("./userRoutes");
router.use("/user",userRoutes)

const chatRoutes=require("./chatRoutes");
router.use("/chat",chatRoutes)


module.exports=router;