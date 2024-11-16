const router=require("express").Router();
const messageController=require("./../controllers/messageController")
const {upload}=require("./../utils/multer")

router.get("/:chatId",messageController.getAllMessageOfChat);

router.post("/",upload.single("file"),messageController.createMessage);

router.delete("/:id",messageController.deleteMessage)

module.exports=router;
