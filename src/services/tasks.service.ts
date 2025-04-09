import { pool } from '../db/db';

export const getAllTasks = async () => {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return rows;
};

export const getTaskById = async (id: string) => {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return rows[0];
};

export const createTask = async (task: any) => {
    const {
        title, description, status, priority, created_by,
        assigned_to, start_date, due_date, closed_date, recurrence
    } = task;

    const { rows } = await pool.query(`
        INSERT INTO tasks (
            title, description, status, priority,
            created_by, assigned_to, start_date,
            due_date, closed_date, recurrence
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *
    `, [title, description, status, priority, created_by, assigned_to, start_date, due_date, closed_date, recurrence]);

    return rows[0];
};

export const updateTask = async (id: string, updates: any) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

    const query = `UPDATE tasks SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`;
    const { rows } = await pool.query(query, [...values, id]);
    return rows[0];
};

export const deleteTask = async (id: string) => {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
};
