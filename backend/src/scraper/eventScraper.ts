import puppeteer, { Browser, HTTPResponse } from 'puppeteer';
import fs from 'fs';

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  url: string;
}

export async function scrapeSydneyEvents(): Promise<Event[]> {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
        '--no-zygote'
      ],
    });

    const page = await browser.newPage();

    // Try navigation with a sensible timeout and error handling
    let response: HTTPResponse | null = null;
    try {
      response = await page.goto(
        'https://www.eventbrite.com.au/d/australia--sydney/events/',
        { waitUntil: 'networkidle2', timeout: 30000 }
      );
    } catch (error: any) {
      if (error && error.name === 'TimeoutError') {
        console.error('Navigation timed out, continuing with partially loaded page...');
      } else if (error.message && error.message.startsWith('net::ERR')) {
        throw new Error('Network error during navigation: ' + error.message);
      } else {
        throw error;
      }
    }

    if (response && response.status() >= 400) {
      throw new Error(`HTTP error: ${response.status()}`);
    }

    if (page.url().startsWith('chrome-error://')) {
      throw new Error('Page load failed: default browser error page returned.');
    }

    // Wait for the event cards to appear, with extended timeout and debugging
    try {
      await page.waitForSelector('[data-event-id]', { timeout: 30000, visible: true });
    } catch (waitError) {
      // Take a screenshot and dump HTML for debugging
      await page.screenshot({ path: '/tmp/eventbrite_wait_error.png' });
      const html = await page.content();
      fs.writeFileSync('/tmp/eventbrite_wait_error.html', html);
      console.error('Selector [data-event-id] not found. Screenshot and HTML dumped to /tmp/.');
      throw new Error('Could not find any events on Eventbrite. The page structure may have changed, or you are being blocked.');
    }

    // Scrape event data
    const events: Event[] = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[data-event-id]'));
      return cards.slice(0, 10).map(card => {
        const title = card.querySelector('div.eds-event-card-content__primary-content > a > div > div > div > div > div > div > h3')?.textContent?.trim() || '';
        const date = card.querySelector('div.eds-event-card-content__sub-title')?.textContent?.trim() || '';
        const venue = card.querySelector('div.card-text--truncated__one')?.textContent?.trim() || '';
        const url = (card.querySelector('a.eds-event-card-content__action-link') as HTMLAnchorElement)?.href || '';
        const id = card.getAttribute('data-event-id') || url;
        return { id, title, date, venue, url };
      });
    });

    return events;
  } catch (err: any) {
    // Log and rethrow for API error handling
    console.error('scrapeSydneyEvents error:', err.message || err);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
