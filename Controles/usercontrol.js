const user = require("../Model/userModel");

//Data display part
const getAllUsers = async (req, res, next) =>{

    let users;
    // Get all users
    try{
        users = await user.find();
    }catch (err) {
        console.log(err);
    }
    // not found
    if (!users){
        return res.status(404).json({message: "user not found" })
    }
//Display all users
return res.status(200).json({users});
};

//data insert
const addUsers = async (req, res, next) => {
    const {name, gmail,age,address}= req.body;

    let users;

    try{
        users = new user({name,gmail,age,address});
        await users.save();
    }catch (err){
    console.log(err);
}

//not insert users
if (!users) {
    return res.status(404).json({message: "unable to add users"})
}
return res.status(200).json({users});
};
//get by id
const getById = async (req, res, next)=>{
    const id = req.params.id;

    let foundUser;

    try{
        foundUser = await user.findById(id);
    }catch (err) {
        console.log(err);
    }
//not available users
if (!foundUser) {
    return res.status(404).json({message: "user not found"});
}
return res.status(200).json({foundUser});    
}

//update user details
const updateUser = async (req, res, next)=> {
    const id = req.params.id;
    const {name, gmail,age,address}= req.body;

    let   upUser;

    try{
        upUser = await user.findByIdAndUpdate(id,{name : name, gmail: gmail,age : age,address : address});
        upUser = await upUser.save()
    }catch(err) {
        console.log(err);
    }
    if (!upUser) {
        return res.status(404).json({message: "unable to update user details"});
    }
    return res.status(200).json({upUser});
    
};
//Delete User Details
const deleteUser = async (req, res, next)=> {
    const id = req.params.id;

    let delUser;

    try{
        delUser = await user.findByIdAndDelete(id)
    }catch (err) {
        console.log(err);
    }
    if (!delUser) {
        return res.status(404).json({message: "unable to delete user details"});
    }
    return res.status(200).json({delUser});
}




exports.getAllUsers = getAllUsers;
exports.addUsers=addUsers;
exports.getById=getById;
exports.updateUser=updateUser;
exports.deleteUser=deleteUser;

