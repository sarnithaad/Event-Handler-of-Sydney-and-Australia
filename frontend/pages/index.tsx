import { useEffect, useState } from 'react';
import EventCard, { Event } from '../components/EventCard';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch('http://localhost:4000/api/events');
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
