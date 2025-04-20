'use client';

import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import './styles.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function ClubCalendarPage() {
  const [events, setEvents] = useState([
    {
      title: 'Aggie Coding Club Meetup',
      start: new Date(),
      end: new Date(),
      allDay: false,
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
  });

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert('Please fill out all fields');
      return;
    }

    const start = new Date(newEvent.start);
    const end = new Date(newEvent.end);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert('Invalid date format');
      return;
    }

    if (start > end) {
      alert('Start date must be before end date');
      return;
    }

    setEvents([...events, { title: newEvent.title, start, end }]);
    setNewEvent({ title: '', start: '', end: '' });
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleRemoveEvent = () => {
    setEvents(events.filter((event) => event !== selectedEvent));
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="relative min-h-screen animated-gradient overflow-hidden px-4 py-10 text-black">
      {/* 🌊 Animated sine wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden z-0 pointer-events-none">
        <svg
          className="w-full h-[400px] animate-sine-wave transform-gpu"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="0.1"
            d="M0,224L60,224C120,224,240,224,360,197.3C480,171,600,117,720,96C840,75,960,85,1080,96C1200,107,1320,117,1380,122.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* ⬅️ Top-left logo with bend effect */}
      <div className="absolute top-4 left-4 z-10">
        <a href="/clubLists" title="Back to Club List">
          <img
            src="/images/clubhub3.png"
            alt="App Icon"
            className="w-32 h-32 transition-transform duration-500 ease-in-out hover:scale-135 hover:rotate-[-3deg] hover:skew-y-1 cursor-pointer"
          />
        </a>
      </div>

      {/* 🗓️ Title */}
      <h1 className="text-3xl font-bold text-white text-center mt-20 mb-6 z-10 relative">
        My Calendar
      </h1>

      {/* 🧾 Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 z-10 relative max-w-5xl mx-auto">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            placeholder="Event Title"
          />
        </div>
        <div>
          <Label>Start</Label>
          <Input
            type="datetime-local"
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
          />
        </div>
        <div>
          <Label>End</Label>
          <Input
            type="datetime-local"
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
          />
        </div>
        <div className="md:col-span-3 text-center">
          <Button
            className="bg-[#FFD200] text-[#002855] hover:bg-[#e6c100]"
            onClick={handleAddEvent}
          >
            ➕ Add Event
          </Button>
        </div>
      </div>

      {/* 📅 Calendar */}
      <div className="rounded-xl bg-white/80 p-4 shadow-lg z-10 relative max-w-6xl mx-auto">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '70vh' }}
          onSelectEvent={handleEventClick}
        />
      </div>

      {/* 🪟 Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <h3 className="text-xl font-bold mb-4">Event Details</h3>
            <p><strong>Name:</strong> {selectedEvent.title}</p>
            <p><strong>Start:</strong> {selectedEvent.start.toLocaleString()}</p>
            <p><strong>End:</strong> {selectedEvent.end.toLocaleString()}</p>
            <div className="mt-4 text-center">
              <Button
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={handleRemoveEvent}
              >
                Remove Event
              </Button>
            </div>
            <div className="mt-2 text-center">
              <Button
                className="bg-gray-300 text-black hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
