import User from "../models/UserModel.js";


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Add a new user
export const addUsers = async (req, res) => {
  const { Product_name, product_type, Category, size, Material, price, stock_quantity } = req.body;
   // Get the uploaded file path

  try {
    const newUser = new User({
      Product_name,
      product_type,
      Category,
      size,
      Material,
      price,
      stock_quantity,
    
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
};

// Get a user by ID
export const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { Product_name, product_type, Category, size, Material, price, stock_quantity } = req.body;
  

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        Product_name,
        product_type,
        Category,
        size,
        Material,
        price,
        stock_quantity,
        
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};