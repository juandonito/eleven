// DO NOT TOUCH

import express from 'express';
import cors from 'cors';
import ImageRouter from './src/routes/ImageRouter';
import PlanetRouter from './src/routes/PlanetRouter';
import AstronautRouter from './src/routes/AstronautRouter';
import { errorHandler } from './src/errorHandling/errorHandler';

const app = express();

app.use(express.json());

app.use(cors());

app.use('/images', ImageRouter);
app.use('/planets', PlanetRouter);
app.use('/astronauts', AstronautRouter);

app.use(errorHandler);

app.listen(4000, () => {});
