import cors from 'cors';
import express from 'express';

import { authRoutes } from './features/auth/auth.routes.js';
import { imagesRoutes } from './features/images/images.routes.js';
import { config, envDevelopment } from './shared/config.js';
import { handleApiErrors } from './shared/middleware/auth.js';

const app = express();

app.use(
  cors({
    origin: [
      'https://personal-website-frontend-production.vercel.app',
      'https://personal-website-frontend-staging.vercel.app',
      config.env === envDevelopment ? 'http://localhost:5173' : undefined,
    ].filter((origin) => typeof origin !== 'undefined'),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api/images', imagesRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.use(handleApiErrors);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
