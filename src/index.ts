import cors from 'cors';
import express from 'express';

import { authRoutes } from './features/auth/auth.routes.js';
import { imagesRoutes } from './features/images/images.routes.js';
import { config } from './shared/config.js';

const app = express();

app.use(
  cors({
    origin: config.clientOrigin,
    methods: ['GET'],
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api/images', imagesRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
