import {pool} from "../config/database";
import {UserCreateRequest} from "../types/user";

export const getAllUsersService = async () => {
    const result = await pool.query("SELECT first_name,last_name, email, createdAt, updatedAt, user_status FROM users");
    return result.rows;
};
export const getUserByIdService = async (id: number) => {
    const result = await pool.query("SELECT first_name,last_name, email, createdAt, updatedAt, user_status FROM users where id = $1",[id]);
    return result.rows[0];
};
export const createUserService = async (userCreateRequest: UserCreateRequest) => {
    const result = await pool.query("INSERT INTO users (first_name,last_name, email) VALUES ($1, $2, $3) RETURNING *", [userCreateRequest.first_name,userCreateRequest.last_name , userCreateRequest.email]);
    return result.rows[0];
};
export const updateUsersService = async (id: number,first_name: string,last_name: string) => {
    const result = await pool.query("UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *", [first_name, last_name, id]);
    return result.rows[0];
};
export const deleteUsersService = async (id: number) => {
    const result = await pool.query("UPDATE users SET user_status = FALSE, updatedAt = CURRENT_TIMESTAMP WHERE id = $1");
    return true;
};