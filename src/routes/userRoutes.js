const router=require("express").Router();
const userController=require("./../controllers/userController")


router.get("/",userController.getAll)

router.get("/:id",userController.getById)

router.get("/search/:username",userController.getUserByUsernameSearch)

router.post("/",userController.create);

router.put("/:id",userController.update);

router.delete("/:id",userController.deleteUser)


module.exports=router