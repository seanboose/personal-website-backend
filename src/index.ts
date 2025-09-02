import cors from 'cors';
import express from 'express';

import { listImages } from './features/images/images.controllers.js';
import { imagesRoutes } from './features/images/images.routes.js';
import { grantAuth } from './shared/auth.js';
// import { requireAuth } from './shared/auth.js';
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
// app.use(requireAuth);

app.post('/api/auth/grant', grantAuth);

/**
 * @deprecated use api/images/list instead
 */
app.get('/api/listImages', listImages);
app.use('/api/images', imagesRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
