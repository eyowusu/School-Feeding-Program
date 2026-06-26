import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const EventCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [, setSelectedDate] = useState(null);
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'

  const events = [
    {
      id: 1,
      title: "Nutrition Education Workshop",
      date: "2024-01-25",
      time: "10:00 AM - 2:00 PM",
      location: "Accra Community Center",
      type: "Workshop",
      description: "Interactive workshop on nutrition education for school teachers and parents.",
      attendees: 85,
      status: "upcoming"
    },
    {
      id: 2,
      title: "Annual Impact Report Launch",
      date: "2024-01-30",
      time: "3:00 PM - 5:00 PM",
      location: "Ghana International Conference Centre",
      type: "Conference",
      description: "Launch of our 2024 annual impact report showcasing program achievements.",
      attendees: 150,
      status: "upcoming"
    },
    {
      id: 3,
      title: "Local Farmers Partnership Meeting",
      date: "2024-02-05",
      time: "9:00 AM - 12:00 PM",
      location: "Ministry of Agriculture, Accra",
      type: "Meeting",
      description: "Quarterly meeting with local farmers and agricultural cooperatives.",
      attendees: 45,
      status: "upcoming"
    },
    {
      id: 4,
      title: "School Feeding Program Review",
      date: "2024-02-12",
      time: "11:00 AM - 4:00 PM",
      location: "Tamale Regional Office",
      type: "Review",
      description: "Comprehensive review of Northern Region school feeding programs.",
      attendees: 60,
      status: "upcoming"
    },
    {
      id: 5,
      title: "Community Outreach Day",
      date: "2024-02-18",
      time: "8:00 AM - 5:00 PM",
      location: "Cape Coast Central Park",
      type: "Outreach",
      description: "Community health screening and nutrition education event.",
      attendees: 200,
      status: "upcoming"
    }
  ];

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'Workshop':
        return 'bg-ghana-primary-100 text-ghana-primary-800';
      case 'Conference':
        return 'bg-ghana-secondary-100 text-ghana-secondary-800';
      case 'Meeting':
        return 'bg-yellow-100 text-yellow-800';
      case 'Review':
        return 'bg-ghana-primary-100 text-ghana-primary-800';
      case 'Outreach':
        return 'bg-ghana-secondary-100 text-ghana-secondary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add day headers
    dayNames.forEach(day => {
      days.push(
        <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
          {day}
        </div>
      );
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateString);
      const isToday = new Date().toDateString() === new Date(dateString).toDateString();

      days.push(
        <div
          key={day}
          className={`p-2 border border-gray-200 cursor-pointer hover:bg-ghana-primary-50 transition-colors duration-200 ${
            isToday ? 'bg-ghana-primary-100 font-semibold' : ''
          }`}
          onClick={() => setSelectedDate(dateString)}
        >
          <div className="text-sm text-center mb-1">{day}</div>
          {dayEvents.length > 0 && (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-ghana-primary-500 rounded-full"></div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">{monthName}</h3>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-ghana-primary-500 rounded-full mr-2"></div>
              <span>Events</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-ghana-primary-100 rounded-full mr-2"></div>
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEventList = () => {
    return (
      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 mr-3">{event.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                </div>
                <p className="text-gray-700 mt-3">{event.description}</p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Users className="h-4 w-4 mr-1" />
                  {event.attendees} expected
                </div>
                <button className="bg-ghana-primary-600 hover:bg-ghana-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Register
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gray-50" id="events">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Event Calendar
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed about upcoming workshops, conferences, community events, and important program milestones
          </p>
        </motion.div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('calendar')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                view === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                view === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar/List View */}
          <div className="lg:col-span-2">
            {view === 'calendar' ? renderCalendar() : renderEventList()}
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <h5 className="font-medium text-gray-900 mb-2">{event.title}</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-ghana-primary-600 to-ghana-secondary-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Event Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{upcomingEvents.length}</div>
                  <div className="text-sm opacity-90">Upcoming</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">850+</div>
                  <div className="text-sm opacity-90">Total Attendees</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup for Events */}
      </div>
    </section>
  );
};

export default EventCalendar;
