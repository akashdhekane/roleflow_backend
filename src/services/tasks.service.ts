import { pool } from '../db/db';

export const getAllTasks = async () => {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return rows;
};

export const getVisibleTasksForUser = async (id: string) => {
    const query = `
      WITH cur_user AS (
        SELECT 
          u.id AS user_id,
          u.role,
          u.department_id,
          CASE u.role
            WHEN 'SuperAdmin' THEN 1
            WHEN 'Admin' THEN 2
            WHEN 'GroupLeader' THEN 3
            WHEN 'DepartmentManager' THEN 4
            WHEN 'Manager' THEN 5
            WHEN 'TeamLead' THEN 6
            WHEN 'Employee' THEN 7
            WHEN 'Contractor' THEN 8
            WHEN 'Guest' THEN 8
            ELSE 100
          END AS role_level
        FROM users u
        WHERE u.id = $1
      ),
      department_users AS (
        SELECT u.id
        FROM users u, cur_user cu
        WHERE u.department_id = cu.department_id
      ),
      reportees AS (
        SELECT u.id FROM users u WHERE u.manager_id = $1
      ),
      visible_tasks AS (
        SELECT t.*
        FROM tasks t, cur_user cu
        WHERE
          cu.role_level IN (1, 2) -- SuperAdmin and Admin see all
  
          OR (cu.role_level = 3 AND (
            t.assigned_to = cu.user_id
            OR t.assigned_to IN (SELECT id FROM department_users)
          ))
  
          OR (cu.role_level = 4 AND (
            t.assigned_to = cu.user_id
            OR t.assigned_to IN (SELECT id FROM department_users)
          ))
  
          OR (cu.role_level = 5 AND (
            t.assigned_to = cu.user_id
            OR t.assigned_to IN (SELECT id FROM department_users)
          ))
  
          OR (cu.role_level = 6 AND (
            t.assigned_to = cu.user_id
            OR t.assigned_to IN (SELECT id FROM reportees)
          ))
  
          OR (cu.role_level >= 7 AND t.assigned_to = cu.user_id)
      )
      SELECT * FROM visible_tasks;
    `;

    const { rows } = await pool.query(query, [id]);
    return rows;
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
