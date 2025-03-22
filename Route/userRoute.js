const express = require("express");
const router = express.Router();
//insert Model
const user = require("../Model/userModel");
//insert user controller
const usercontroller = require("../Controles/usercontrol");

router.get("/",usercontroller.getAllUsers);
router.post("/",usercontroller.addUsers);
router.get("/:id",usercontroller.getById);
router.put("/:id",usercontroller.updateUser); 
router.delete("/:id",usercontroller.deleteUser);

//export
module.exports = router;