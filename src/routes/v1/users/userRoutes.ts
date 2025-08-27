import express from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../../../controllers/userController.js";
import { validateData } from "../../../middlewares/validationMiddleware.js";
import { userRegistrationSchema } from "../../../schemas/userSchemas.js";

const userRouter = express.Router();

userRouter.get("/",getAllUsers);
userRouter.post("/", validateData(userRegistrationSchema), createUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.get("/:id", getUserById);

export default userRouter;
