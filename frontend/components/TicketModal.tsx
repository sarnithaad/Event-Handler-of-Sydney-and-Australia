import React, { useState } from 'react';

const TicketModal: React.FC<{ eventUrl: string; onClose: () => void }> = ({
  eventUrl,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) {
      setError('Enter a valid email.');
      return;
    }
    try {
      await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, eventUrl }),
      });
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = eventUrl;
      }, 1200);
    } catch {
      setError('Submission failed.');
    }
  }

  return (
    <div className="modal-bg">
      <div className="modal" style={{ position: 'relative' }}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        {!submitted ? (
          <>
            <h2 style={{ marginBottom: '1em' }}>Get Tickets</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
              <button className="get-tickets" type="submit">
                Continue
              </button>
            </form>
          </>
        ) : (
          <div>
            <p style={{ color: 'green', marginBottom: 0 }}>Thank you! Redirecting…</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketModal;
