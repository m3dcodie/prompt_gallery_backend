import { createUser } from "../controllers/userController";
import * as userModel from "../models/userModel";
describe("createUser", () => {
    it("should create a user and respond with status 201", async () => {
        // Mock the service to return a user object
        jest.spyOn(userModel, "createUserService").mockResolvedValue({
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
        });
        const req = {
            body: {
                first_name: "John",
                last_name: "Doe",
                email: "john.doe@example.com",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        await createUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 201,
            message: "User created successfully",
            data: expect.objectContaining({
                first_name: "John",
                last_name: "Doe",
                email: "john.doe@example.com",
            }),
        }));
    });
});
