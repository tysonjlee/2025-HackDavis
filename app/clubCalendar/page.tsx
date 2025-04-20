'use client';

import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
//import 'tailwindcss/tailwind.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert('Please fill out all fields');
      return;
    }

    const start = new Date(newEvent.start);
    const end = new Date(newEvent.end);

    if (start > end) {
      alert('Start date must be before end date');
      return;
    }

    setEvents([...events, { title: newEvent.title, start, end }]);
    setNewEvent({ title: '', start: '', end: '' });
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-[#002855] mb-4 text-center">Club Calendar</h1>

      {/* 📝 Add Event Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
        <div className="md:col-span-3 text-center mt-2">
          <Button className="bg-[#FFD200] text-[#002855] hover:bg-[#e6c100]" onClick={handleAddEvent}>
            ➕ Add Event
          </Button>
        </div>
      </div>

      {/* 📅 Calendar */}
      <div className="h-[70vh] bg-white shadow rounded">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
}
