import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/tasks.routes';
import cors from 'cors';
const app = express();
app.use(bodyParser.json());
app.use(cors());
// ✅ Place test route here to verify everything works
app.get('/hello', (_req, res) => {
    res.send('👋 Hello from server!');
});

// ✅ Actual APIs
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// ❌ Catch-all fallback (should come at the end)
app.use((req, res) => {
    console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: 'Route not found' });
});

export default app;
