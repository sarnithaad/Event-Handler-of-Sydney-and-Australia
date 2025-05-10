import { useEffect, useState } from 'react';
import EventCard, { Event } from '../components/EventCard';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${apiUrl}/api/events`);
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main>
      <h1>Sydney Events</h1>
      {loading ? (
        <div>Loading events…</div>
      ) : events.length === 0 ? (
        <div>No events found.</div>
      ) : (
        events.map(event => <EventCard key={event.id} event={event} />)
      )}
    </main>
  );
}
