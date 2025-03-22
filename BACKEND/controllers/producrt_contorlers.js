const User = require("../Model/UserModel");

// Get all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "Users not found" });
        }
        return res.status(200).json({ users });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error fetching users" });
    }
};

// Add a new user
const addUsers = async (req, res, next) => {
    const { Product_name, product_type, Category, size, Material, price, stock_quantity } = req.body;

    if (!product_type) {
        return res.status(400).json({ message: "product_type is required" });
    }

    try {
        const user = new User({ Product_name, product_type, Category, size, Material, price, stock_quantity });
        await user.save();
        return res.status(201).json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error adding user" });
    }
};

// Get user by ID
const getById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching user" });
    }
};

// Update user
const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { Product_name, product_type, Category, size, Material, price, stock_quantity } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            id, 
            { Product_name, product_type, Category, size, Material, price, stock_quantity },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating user" });
    }
};

// Delete user
const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error deleting user" });
    }
};

// Export functions
exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
