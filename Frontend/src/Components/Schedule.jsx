import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaPlus, FaTimes, FaTrash, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./schedule.css";

export default function FullPageCalendar() {
  // Persist events
  const [events, setEvents] = useState(() => {
    return JSON.parse(localStorage.getItem("events")) || [];
  });

  // Persist selected date
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem("selectedDate");
    return savedDate ? new Date(savedDate) : new Date();
  });

  const [showModal, setShowModal] = useState(false);
  const [eventText, setEventText] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Save selected date to localStorage
  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate.toISOString());
  }, [selectedDate]);

  const handleSaveEvent = () => {
    if (!eventText.trim()) return;

    if (selectedEvent) {
      // Edit event
      setEvents(
        events.map((e) =>
          e === selectedEvent
            ? { ...e, text: eventText, date: eventDate.toDateString() }
            : e
        )
      );
    } else {
      // Add new event
      setEvents([
        ...events,
        {
          text: eventText,
          date: eventDate.toDateString(),
          color: `hsl(${Math.random() * 360},70%,60%)`,
        },
      ]);
    }
    resetModal();
  };

  const resetModal = () => {
    setShowModal(false);
    setEventText("");
    setSelectedEvent(null);
    setEventDate(new Date());
  };

  const deleteEvent = (event) => {
    setEvents(events.filter((e) => e !== event));
    resetModal();
  };

  const eventsForSelectedDate = events.filter(
    (e) => e.date === selectedDate.toDateString()
  );

  const upcomingEvents = [...events]
    .filter((e) => new Date(e.date) >= new Date())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold text-black flex items-center gap-3">
          📅Schedule.
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full shadow-lg font-medium transition"
          >
            <FaPlus /> Add Event
          </button>
          <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full shadow-lg font-medium transition">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-6"
        >
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={({ date }) =>
              date.toDateString() === selectedDate.toDateString()
                ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl shadow-md transform scale-105 transition-all"
                : "hover:bg-purple-100 hover:text-purple-700 rounded-xl transition-all"
            }
            tileContent={({ date, view }) => {
              if (view === "month") {
                const eventsForDate = events.filter(
                  (e) => e.date === date.toDateString()
                );
                if (eventsForDate.length > 0) {
                  const maxDots = 3;
                  return (
                    <div className="flex justify-center mt-1 space-x-1">
                      {eventsForDate.slice(0, maxDots).map((e, idx) => (
                        <span
                          key={idx}
                          className="w-3 h-3 rounded-full block"
                          style={{ backgroundColor: e.color }}
                        ></span>
                      ))}
                      {eventsForDate.length > maxDots && (
                        <span className="text-[0.6rem] text-gray-500">
                          +{eventsForDate.length - maxDots}
                        </span>
                      )}
                    </div>
                  );
                }
              }
              return null;
            }}
          />
        </motion.div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Selected Day Events */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="font-semibold text-xl mb-4">
              Events on {selectedDate.toDateString()}
            </h2>
            <AnimatePresence>
              {eventsForSelectedDate.length === 0 ? (
                <p className="text-sm text-gray-400">No events for this day</p>
              ) : (
                eventsForSelectedDate.map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex justify-between items-center p-3 mb-3 rounded-xl shadow hover:shadow-lg transition border-l-4"
                    style={{ borderLeftColor: e.color }}
                  >
                    <div>
                      <p className="font-medium text-sm">{e.text}</p>
                      <p className="text-xs text-gray-400">{e.date}</p>
                    </div>
                    <div className="flex gap-3 text-lg">
                      <FaEdit
                        className="cursor-pointer text-blue-500 hover:text-blue-600 transition"
                        onClick={() => {
                          setSelectedEvent(e);
                          setEventText(e.text);
                          setEventDate(new Date(e.date));
                          setShowModal(true);
                        }}
                      />
                      <FaTrash
                        className="cursor-pointer text-red-500 hover:text-red-600 transition"
                        onClick={() => deleteEvent(e)}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Upcoming Events */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-400 rounded-3xl shadow-xl p-6 text-white">
            <h2 className="font-semibold text-xl mb-4">Upcoming Events</h2>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm opacity-70">No upcoming events</p>
            ) : (
              upcomingEvents.map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/20 rounded-xl p-3 mb-3 hover:bg-white/30 transition"
                >
                  <p className="text-sm font-medium">{e.text}</p>
                  <p className="text-xs opacity-80">{e.date}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md relative shadow-2xl"
            >
              <FaTimes
                className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600 transition"
                onClick={resetModal}
              />
              <h3 className="font-semibold text-xl mb-4">
                {selectedEvent ? "Edit Event" : "Add New Event"}
              </h3>
              <input
                className="w-full border rounded-xl p-3 mb-4 focus:ring-2 focus:ring-purple-400 outline-none transition"
                placeholder="Event title"
                value={eventText}
                onChange={(e) => setEventText(e.target.value)}
              />
              <input
                type="date"
                className="w-full border rounded-xl p-3 mb-4 focus:ring-2 focus:ring-purple-400 outline-none transition"
                value={eventDate.toISOString().substring(0, 10)}
                onChange={(e) => setEventDate(new Date(e.target.value))}
              />
              <button
                onClick={handleSaveEvent}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium transition mb-2"
              >
                Save
              </button>
              {selectedEvent && (
                <button
                  onClick={() => deleteEvent(selectedEvent)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition"
                >
                  Delete
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
