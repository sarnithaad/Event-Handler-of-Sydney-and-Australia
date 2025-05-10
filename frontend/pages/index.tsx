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
      const contentType = res.headers.get('content-type');
      if (!res.ok) {
        setEvents([]);
        setError(`Server error: ${res.status}`);
      } else if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setEvents(data);
          setError(null);
        } else {
          setEvents([]);
          setError(data?.message || data?.error || 'Unexpected response from server.');
        }
      } else {
        // Not JSON, probably an error HTML page
        const text = await res.text();
        setEvents([]);
        setError('Server returned non-JSON response. Please try again later.');
        // Optionally log text for debugging
        // console.error('Non-JSON response:', text);
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
