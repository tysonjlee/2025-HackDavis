'use client';

import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';


// Import the custom CSS file
import './styles.css'; // Update the path as needed

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

  const [colorScheme, setColorScheme] = useState('blue');
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // State to hold the event clicked
  const [showModal, setShowModal] = useState(false); // State to show/hide the modal

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

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'blue' ? 'green' : 'blue');
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event); // Set the selected event to show details
    setShowModal(true); // Show the modal
  };

  const handleRemoveEvent = () => {
    setEvents(events.filter((event) => event !== selectedEvent)); // Remove the event from the list
    setShowModal(false); // Close the modal after removal
    setSelectedEvent(null); // Clear the selected event
  };

  return (
    <div
      className={`min-h-screen p-4 relative ${
        colorScheme === 'blue'
          ? 'bg-gradient-to-br from-[#004e92] via-[#006bb3] to-[#004a6f]'
          : 'bg-gradient-to-br from-[#a1e9c8] via-[#b0f8d3] to-[#91e7c6]'
      } bg-[length:200%_200%] animate-bg-blue text-black`}
    >
      {/* Image as a button redirecting to the homepage */}
      <div className="absolute top-0 left-0 z-10">
        <a href="/" title="Go to homepage">
          <img
            src="/images/clubhub3.png"
            alt="App Icon"
            className="w-40 h-40 opacity-90 transition-opacity duration-300 hover:opacity-100 focus:outline-none bg-transparent cursor-pointer"
          />
        </a>
      </div>

      <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 28"
          preserveAspectRatio="none"
          className="w-full h-full animate-wave"
        >
          <path
            d="M0 0C30 10 30 10 60 10C90 10 90 10 120 10V28H0V0Z"
            className="fill-[#66aaff]"
          ></path>
        </svg>
      </div>

      <h1
        className={`text-3xl font-bold mb-4 text-center ${
          colorScheme === 'blue' ? 'text-[#ffffff]' : 'text-[#0c4a2f]'
        } mt-16 z-10 relative`}
      >
        Club Calendar
      </h1>

      <div className="text-center mb-4 z-10 relative">
        <Button
          className="bg-[#FFD200] text-[#002855] hover:bg-[#e6c100]"
          onClick={toggleColorScheme}
        >
          Toggle Color Scheme
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 z-10 relative">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            required
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            placeholder="Event Title"
          />
        </div>
        <div>
          <Label>Start</Label>
          <Input
            type="datetime-local"
            required
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
          />
        </div>
        <div>
          <Label>End</Label>
          <Input
            type="datetime-local"
            required
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
          />
        </div>
        <div className="md:col-span-3 text-center mt-2">
          <Button
            className="bg-[#FFD200] text-[#002855] hover:bg-[#e6c100]"
            onClick={handleAddEvent}
          >
            ➕ Add Event
          </Button>
        </div>
      </div>

      <div
        className={`h-[70vh] rounded-xl border p-2 shadow-xl animate-bg-yellow ${
          colorScheme === 'blue'
            ? 'bg-gradient-to-br from-[#f6e3b4] via-[#f5d176] to-[#e4c24e]'
            : 'bg-gradient-to-br from-[#d4f5e2] via-[#e0f9e7] to-[#c5f0e0]'
        } z-10 relative`}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', backgroundColor: 'transparent' }}
          onSelectEvent={handleEventClick} // Handles event click
        />
      </div>

      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-bold mb-4">Event Details</h3>
            <p><strong>Name:</strong> {selectedEvent.title}</p>
            <p><strong>Start:</strong> {selectedEvent.start.toLocaleString()}</p>
            <p><strong>End:</strong> {selectedEvent.end.toLocaleString()}</p>
            <div className="mt-4 text-center">
              <Button
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={handleRemoveEvent} // Removes the event
              >
                Remove Event
              </Button>
            </div>
            <div className="mt-4 text-center">
              <Button
                className="bg-gray-300 text-black hover:bg-gray-400"
                onClick={() => setShowModal(false)} // Closes the modal
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
