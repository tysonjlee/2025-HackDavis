'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMemo } from 'react';

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

// 🔹 Placeholder events — you can later load from Supabase
const events = [
  {
    title: 'Aggie Coding Club Meetup',
    start: new Date(),
    end: new Date(),
    allDay: false,
  },
  {
    title: 'HackDavis Kickoff',
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
  },
];

export default function ClubCalendarPage() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-[#002855] mb-4 text-center">Club Calendar</h1>
      <div className="h-[80vh] bg-white shadow rounded">
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
