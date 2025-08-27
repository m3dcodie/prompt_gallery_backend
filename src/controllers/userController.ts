import { Request, Response, NextFunction } from 'express';
import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUsersService,
  deleteUsersService,
} from "../models/userModel";
import { UserCreateRequest } from "../types/user";

const handleResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
) => {
  res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { first_name, last_name, email } = req.body;
  const userCreateRequest: UserCreateRequest = {
    first_name,
    last_name,
    email,
  };
  try {
    const newUser = await createUserService(userCreateRequest);
    handleResponse(res, 201, "User created successfully", newUser);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Request received");
    const allUsers = await getAllUsersService();
    handleResponse(res, 200, "Getting all users", allUsers);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  try {
    const userDetails = await getUserByIdService(id);
    if (!userDetails || userDetails.length === 0) {
      handleResponse(res, 404, "User not found");
      return;
    }
    handleResponse(res, 200, "User detail", userDetails[0]);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body;
  const id = parseInt(req.params.id);
  try {
    const userDetails = await updateUsersService(id, name, email);
    if (!userDetails || userDetails.length === 0) {
      handleResponse(res, 404, "User not found");
      return;
    }
    handleResponse(res, 200, "User updated", userDetails[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  try {
    const userDetails = await deleteUsersService(id);
    if (!userDetails) {
      handleResponse(res, 404, "User not found");
      return;
    }
    handleResponse(res, 200, "User deleted", 1);
  } catch (err) {
    next(err);
  }
};
