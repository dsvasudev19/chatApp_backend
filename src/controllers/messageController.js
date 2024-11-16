const { Chat, Message, Attachment } = require("./../models");
const { sequelize } = require("./../models");

const getAllMessageOfChat = async (req, res, next) => {
  try {
    const messages = await Message.findAll({
      where: {
        chatId: req.params.chatId,
      },
      include:[{
        model:Attachment,
        as:"attachments"
      }]
      // TODO:inclusion of attachments with the messagees is not done
    });
    if (messages) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Successfully fetched all messages",
          data: messages,
        });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "No messages found", data: [] });
    }
  } catch (error) {
    console.log(error);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const message = await Message.create(req.body);
    if (req.file) {
      const attachDetails = {
        messageId: message.id,
        name: req.file.originalname,
        file_name: req.file.filename,
        type: req.file.mimetype,
        url: "",
        size: req.file.size,
      };
      const attachement = await Attachment.create(attachDetails);
    }
    return res
      .status(200)
      .json({ success: true, message: "Message Created Successfully" ,data:message});
  } catch (error) {
    console.log(error);
  }
};


const deleteMessage=async(req,res,next)=>{
    try {
        const message=await Message.findByPk(req.params.id);
        if(message){
            message.destroy();
            return res.status(200).json({success:true,message:"Successfully deleted the message"})
        }else{
            return res.status(404).json({success:false,message:"No message found"})
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports={
  getAllMessageOfChat,
  createMessage,
  deleteMessage
}