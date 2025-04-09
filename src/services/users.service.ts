import { pool } from '../db/db';

export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

export const getUserById = async (id: string) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

export const createUser = async (data: any) => {
    const { email, first_name, last_name, role, password_hash, manager_id, department_id } = data;
    const result = await pool.query(
        `INSERT INTO users (email, first_name, last_name, role, password_hash, manager_id, department_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [email, first_name, last_name, role, password_hash, manager_id, department_id]
    );
    return result.rows[0];
};

export const updateUser = async (id: string, data: any) => {
    const { email, first_name, last_name, role, manager_id, department_id } = data;
    const result = await pool.query(
        `UPDATE users SET email = $1, first_name = $2, last_name = $3, role = $4, manager_id = $5, department_id = $6,
     updated_at = NOW() WHERE id = $7 RETURNING *`,
        [email, first_name, last_name, role, manager_id, department_id, id]
    );
    return result.rows[0];
};

export const deleteUser = async (id: string) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
};
