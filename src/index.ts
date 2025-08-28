import express from 'express';
import cors from 'cors';

import { config } from './shared/config.js';
import { imagesRoutes } from './features/images/images.routes.js';
import { listImages } from './features/images/images.controllers.js';

const app = express();

app.use(
  cors({
    origin: config.clientOrigin,
    methods: ['GET'],
    credentials: true,
  })
);
app.use(express.json());

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
