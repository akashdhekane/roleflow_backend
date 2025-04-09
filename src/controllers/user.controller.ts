import { Request, Response } from 'express';
import * as userService from '../services/users.service';

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await userService.getAllUsers();
    return res.json(users);
};

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
};

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    console.log("create user api called by user: {}", req.body)
    const newUser = await userService.createUser(req.body);
    return res.status(201).json(newUser);
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    return res.json(updatedUser);
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    await userService.deleteUser(req.params.id);
    return res.status(204).send();
};
