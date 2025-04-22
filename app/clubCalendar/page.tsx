'use client';
//test
import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    start: new Date(),
    end: new Date(),
  });

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert('Please fill out all fields.');
      return;
    }

    if (newEvent.start > newEvent.end) {
      alert('Start date must be before end date.');
      return;
    }

    setEvents([...events, { title: newEvent.title, start: newEvent.start, end: newEvent.end }]);
    setNewEvent({ title: '', start: new Date(), end: new Date() });
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
    <div className="relative min-h-screen bg-gradient-to-br from-sky-200 to-blue-400 overflow-x-hidden px-4 py-10">
      {/* Portal for DatePickers */}
      <div id="datepicker-portal" className="z-[9999] relative"></div>

      {/* Logo */}
      <div className="absolute top-4 left-4 z-10">
        <a href="/clubLists">
          <img
            src="/images/clubhub3.png"
            alt="App Icon"
            className="w-32 h-32 hover:scale-110 hover:rotate-[-3deg] transition-transform"
          />
        </a>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white text-center mt-24 mb-6 z-10 relative">
        Club Calendar
      </h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 z-10 relative max-w-5xl mx-auto">
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
          <DatePicker
            selected={newEvent.start}
            onChange={(date) => setNewEvent({ ...newEvent, start: date! })}
            showTimeSelect
            timeIntervals={15}
            dateFormat="Pp"
            popperPlacement="bottom-start"
            portalId="datepicker-portal"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <Label>End</Label>
          <DatePicker
            selected={newEvent.end}
            onChange={(date) => setNewEvent({ ...newEvent, end: date! })}
            showTimeSelect
            timeIntervals={15}
            dateFormat="Pp"
            popperPlacement="bottom-start"
            portalId="datepicker-portal"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="md:col-span-3 text-center">
          <Button
            className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 px-6 py-2 rounded-xl"
            onClick={handleAddEvent}
          >
            ➕ Add Event
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-xl bg-white/80 p-6 shadow-lg z-10 relative max-w-6xl mx-auto mb-12 overflow-visible">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '70vh' }}
          onSelectEvent={handleEventClick}
        />
      </div>

      {/* Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 transition transform scale-95">
            <h3 className="text-xl font-bold mb-4">Event Details</h3>
            <p><strong>Name:</strong> {selectedEvent.title}</p>
            <p><strong>Start:</strong> {selectedEvent.start.toLocaleString()}</p>
            <p><strong>End:</strong> {selectedEvent.end.toLocaleString()}</p>
            <div className="mt-4 space-y-2 text-center">
              <Button
                className="bg-red-500 text-white hover:bg-red-600 w-full"
                onClick={handleRemoveEvent}
              >
                Remove Event
              </Button>
              <Button
                className="bg-gray-300 text-black hover:bg-gray-400 w-full"
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
