import puppeteer from 'puppeteer-core';

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  url: string;
}

export async function scrapeSydneyEvents() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium', // Path to system Chromium on Ubuntu
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('https://www.eventbrite.com.au/d/australia--sydney/events/', { waitUntil: 'networkidle2' });

  const events = await page.evaluate(() => {
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

  await browser.close();
  return events;
}
