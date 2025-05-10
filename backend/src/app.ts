import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { scrapeSydneyEvents } from './scraper/eventScraper';

const app = express();

app.use(cors());
app.use(express.json());

// Health check or welcome route
app.get('/', (req: Request, res: Response) => {
  res.send('Louder World API is running.');
});

app.get('/api/events', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await scrapeSydneyEvents();
    res.json(events);
  } catch (e) {
    next(e); // Forward error to global error handler
  }
});

// Global error-handling middleware (must be after all routes)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message || err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

export default app;
