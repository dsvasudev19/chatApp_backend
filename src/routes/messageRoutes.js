const router=require("express").Router();
const messageController=require("./../controllers/messageController")


router.get("/:chatId",messageController.getAllMessageOfChat);

router.post("/",messageController.createMessage);

router.delete("/:id",messageController.deleteMessage)

module.exports=router;
