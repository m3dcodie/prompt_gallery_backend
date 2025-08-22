import express from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/userController";
import { validateData } from "../middlewares/validationMiddleware";
import { userRegistrationSchema } from "../schemas/userSchemas";

const router = express.Router();

router.get("/user",getAllUsers);
router.post("/user", validateData(userRegistrationSchema), createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.get("/user/:id", getUserById);

export default  router;
