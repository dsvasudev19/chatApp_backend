const router=require("express").Router();
const chatController=require("./../controllers/chatController")

router.get("/user/:id",chatController.getAllChatsOfUser);

router.post("/:id",chatController.createChat);

router.delete("/:id",chatController.deleteChat)

module.exports=router;