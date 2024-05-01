
const {Contact,User}=require("./../models")

const getAllContactsOfUser=async(req,res,next)=>{
    try {
        const contacts=await Contact.findAll({
            where:{
                // TODO:instead of gettig the user id from params we need to implement it from auth middleware
                userId:req.params.id
            }
        })
        if(contacts){
            return res.status(200).json({success:true,message:"Successfully fetched the contacts",data:contacts})
        }else{
            return res.status(200).json({success:false,message:"No contacts found",data:[]})
        }
    } catch (error) {
        console.log(error);
    }
}

const getContactById=async(req,res,next)=>{
    try {
        const contact=await Contact.findByPk(req.params.id);
        if(contact){
            return res.status(200).json({success:true,message:"Successfully fetched the contact",data:contact})
        }else{
            return res.status(200).json({success:false,message:"No Contact found",data:{}})
        }
    } catch (error) {
        console.log(error)   
    }
}


const createContact=async(req,res,next)=>{
    try {
        const user=await User.findOne({
            where:{
                email:req.body.email
            }
        }) 
        if(user){
            const contact=await Contact.create({
                userId:req.params.id,
                contactId:user.id
            })
            return res.status(200).json({success:true,message:"Created a contact successfully",data:contact})
        }else{
            return res.status(404).json({success:false,message:"Provided user email is not an Existing User"})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal Error occured"})
    }
}

const deleteContact=async(req,res,next)=>{
    try {
        const contact=await Contact.findByPk(req.params.id);
        if(contact){
            await contact.destroy();
            return res.status(200).json({success:true,message:"Successfully deleted the contact"})
        }else{
            return res.status(404).json({success:false,message:"No contact found"})
        }
    } catch (error) {
        
    }
}

module.exports={
    getAllContactsOfUser,
    getContactById,
    createContact,
    deleteContact
}