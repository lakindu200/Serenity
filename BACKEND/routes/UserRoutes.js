import express from "express";

import { getAllUsers, addUsers, getById, updateUser, deleteUser } from "../controllers/UserControllers.js";

const router = express.Router();


  
  const upload = multer({ storage });


router.get("/", getAllUsers);
router.post("/", addUsers);
router.get("/:id", getById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
