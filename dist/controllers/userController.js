import { createUserService, getAllUsersService, getUserByIdService, updateUsersService, deleteUsersService, } from "../models/userModel";
const handleResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        statusCode,
        message,
        data,
    });
};
export const createUser = async (req, res, next) => {
    const { first_name, last_name, email } = req.body;
    const userCreateRequest = {
        first_name,
        last_name,
        email,
    };
    try {
        const newUser = await createUserService(userCreateRequest);
        handleResponse(res, 201, "User created successfully", newUser);
    }
    catch (err) {
        next(err);
    }
};
export const getAllUsers = async (req, res, next) => {
    try {
        console.log("Request received");
        const allUsers = await getAllUsersService();
        handleResponse(res, 200, "Getting all users", allUsers);
    }
    catch (err) {
        next(err);
    }
};
export const getUserById = async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const userDetails = await getUserByIdService(id);
        if (!userDetails || userDetails.length === 0) {
            handleResponse(res, 404, "User not found");
            return;
        }
        handleResponse(res, 200, "User detail", userDetails[0]);
    }
    catch (err) {
        next(err);
    }
};
export const updateUser = async (req, res, next) => {
    const { name, email } = req.body;
    const id = parseInt(req.params.id);
    try {
        const userDetails = await updateUsersService(id, name, email);
        if (!userDetails || userDetails.length === 0) {
            handleResponse(res, 404, "User not found");
            return;
        }
        handleResponse(res, 200, "User updated", userDetails[0]);
    }
    catch (err) {
        next(err);
    }
};
export const deleteUser = async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const userDetails = await deleteUsersService(id);
        if (!userDetails) {
            handleResponse(res, 404, "User not found");
            return;
        }
        handleResponse(res, 200, "User deleted", 1);
    }
    catch (err) {
        next(err);
    }
};
