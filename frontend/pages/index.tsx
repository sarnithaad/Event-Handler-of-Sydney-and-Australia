import { useEffect, useState } from 'react';
import EventCard, { Event } from '../components/EventCard';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      try {
        const res = await fetch(`${apiUrl}/api/events`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setEvents(data);
          setError(null);
        } else {
          setEvents([]);
          setError(data?.message || data?.error || 'Unexpected response from server.');
        }
      } catch (err: any) {
        setEvents([]);
        setError(err.message || 'Failed to fetch events.');
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main>
      <h1>Sydney Events</h1>
      {loading ? (
        <div>Loading events…</div>
      ) : error ? (
        <div style={{ color: 'red' }}>Error: {error}</div>
      ) : events.length === 0 ? (
        <div>No events found.</div>
      ) : (
        events.map(event => <EventCard key={event.id} event={event} />)
      )}
    </main>
  );
}
