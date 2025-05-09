import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  const { email, eventUrl } = req.body;
  if (!email || !eventUrl) {
    res.status(400).json({ message: 'Invalid input' });
    return;
  }
  // Here you can integrate with your email service.
  console.log(`Opt-in: ${email} for event ${eventUrl}`);
  res.status(200).json({ message: 'OK' });
}
