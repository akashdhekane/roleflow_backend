import { Request, Response } from 'express';
import * as taskService from '../services/tasks.service';

export const getAllTasks = async (req: Request, res: Response) => {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
};

export const getTaskById = async (req: Request, res: Response) => {
    const task = await taskService.getTaskById(req.params.id);
    if (task) res.json(task);
    else res.status(404).json({ message: 'Task not found' });
};

export const createTask = async (req: Request, res: Response) => {
    const newTask = await taskService.createTask(req.body);
    res.status(201).json(newTask);
};

export const updateTask = async (req: Request, res: Response) => {
    const updated = await taskService.updateTask(req.params.id, req.body);
    if (updated) res.json(updated);
    else res.status(404).json({ message: 'Task not found' });
};

export const deleteTask = async (req: Request, res: Response) => {
    const deleted = await taskService.deleteTask(req.params.id);
    if (deleted) res.status(204).send();
    else res.status(404).json({ message: 'Task not found' });
};

export const getVisibleTasksForUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const tasks = await taskService.getVisibleTasksForUser(userId);
    res.json(tasks);
};
