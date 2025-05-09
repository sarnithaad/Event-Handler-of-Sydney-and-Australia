import React, { useState } from 'react';
import TicketModal from './TicketModal';

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  url: string;
}

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="event-card">
      <div className="event-title">{event.title}</div>
      <div className="event-meta">{event.date}</div>
      <div className="event-meta">{event.venue}</div>
      <button className="get-tickets" onClick={() => setShowModal(true)}>
        GET TICKETS
      </button>
      {showModal && (
        <TicketModal
          eventUrl={event.url}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default EventCard;
