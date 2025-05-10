import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { scrapeSydneyEvents } from './scraper/eventScraper';

const app = express();

const corsOptions = {
  origin: 'https://event-handler-of-sydney-sarnitha-a-ds-projects.vercel.app', // no trailing slash!
  optionsSuccessStatus: 200,
  // credentials: true, // Uncomment if using cookies/auth
};
app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Louder World API is running.');
});

app.get('/api/events', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await scrapeSydneyEvents();
    res.json(events);
  } catch (e) {
    next(e);
  }
});

// Global error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message || err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

export default app;
