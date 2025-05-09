import express, { Request, Response } from 'express';
import cors from 'cors';
import { scrapeSydneyEvents } from './scraper/eventScraper';

const app = express();

app.use(cors());
app.use(express.json());

// Health check or welcome route
app.get('/', (req: Request, res: Response) => {
  res.send('Louder World API is running.');
});

app.get('/api/events', async (req: Request, res: Response) => {
  try {
    const events = await scrapeSydneyEvents();
    res.json(events);
  } catch (e) {
    console.error('Error fetching events:', e);
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
});

export default app;
