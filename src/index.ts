import express from 'express';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', profileRoutes);
app.use('/admin/users', adminRoutes);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'user-service' }));

app.listen(PORT, () => console.log(`User service running on port ${PORT}`));
