'use client';

import { useContext } from 'react';
import { Calendar, Clock, DollarSign, Phone, Info } from 'lucide-react';
import { SiteContext } from '../ShowcaseLayoutClient';

interface ScheduleClass {
  grade: string;
  day: string;
  time: string;
  monthly: string;
}

export default function ShowcaseSchedulePage() {
  const site = useContext(SiteContext);

  if (!site) return null;

  const pages = site.pages as Record<string, unknown>;
  const schedule = pages.schedule as {
    title?: string;
    subtitle?: string;
    note?: string;
    classes?: ScheduleClass[];
  } | undefined;

  // Default FSM schedule data as fallback
  const defaultClasses: ScheduleClass[] = [
    { grade: 'Grade 1', day: 'Sat', time: '1:00 - 2:00pm', monthly: '$140' },
    { grade: 'Grade 2', day: 'Sat', time: '2:00 - 4:00pm', monthly: '$280' },
    { grade: 'Grade 3', day: 'Thu', time: '4:00 - 6:00pm', monthly: '$280' },
    { grade: 'Grade 4', day: 'Wed', time: '4:00 - 6:00pm', monthly: '$280' },
    { grade: 'Grade 5', day: 'Tue', time: '4:00 - 6:00pm', monthly: '$280' },
    { grade: 'Grade 6', day: 'Wed', time: '6:00 - 8:00pm', monthly: '$280' },
    { grade: 'Grade 7', day: 'Tue', time: '6:00 - 8:00pm', monthly: '$280' },
    { grade: 'Grade 8', day: 'Thu', time: '6:00 - 8:00pm', monthly: '$280' },
    { grade: 'Grade 9', day: 'Tue', time: '6:00 - 8:00pm', monthly: '$280' },
    { grade: 'Grade 10', day: 'Mon', time: '6:00 - 8:00pm', monthly: '$280' },
    { grade: 'Grade 10-11', day: 'Wed', time: '6:00 - 8:00pm', monthly: '$280' },
    { grade: 'Calculus', day: 'Thu', time: '6:00 - 8:00pm', monthly: '$280' },
    { grade: 'SAT Prep', day: 'Mon', time: '6:00 - 8:00pm', monthly: '$280' },
  ];

  const classes = schedule?.classes?.length ? schedule.classes : defaultClasses;

  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-16 md:py-20"
        style={{
          background: `linear-gradient(135deg, ${site.branding.primaryColor} 0%, ${site.branding.secondaryColor} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {schedule?.title || 'Class Schedule'}
            </h1>
            <p className="text-xl text-white/90">
              {schedule?.subtitle || 'Find the right class time for your student'}
            </p>
          </div>
        </div>
      </section>

      {/* Schedule Table */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Quick Info */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ backgroundColor: `${site.branding.primaryColor}10` }}
            >
              <Calendar className="w-8 h-8" style={{ color: site.branding.primaryColor }} />
              <div>
                <div className="font-semibold text-gray-900">36-Week Program</div>
                <div className="text-sm text-gray-500">Full academic year</div>
              </div>
            </div>
            <div
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ backgroundColor: `${site.branding.primaryColor}10` }}
            >
              <Clock className="w-8 h-8" style={{ color: site.branding.primaryColor }} />
              <div>
                <div className="font-semibold text-gray-900">1.5-2 Hour Sessions</div>
                <div className="text-sm text-gray-500">Weekly classes</div>
              </div>
            </div>
            <div
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ backgroundColor: `${site.branding.primaryColor}10` }}
            >
              <DollarSign className="w-8 h-8" style={{ color: site.branding.primaryColor }} />
              <div>
                <div className="font-semibold text-gray-900">$140-$280/month</div>
                <div className="text-sm text-gray-500">Based on grade level</div>
              </div>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Weekly Class Schedule</h2>
              <p className="text-gray-500 text-sm mt-1">All times are Eastern Time (ET)</p>
            </div>

            {classes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Class</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Day</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Time</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Monthly Tuition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {classes.map((cls, idx) => (
                      <tr key={idx} className="hover:bg-white transition">
                        <td className="py-4 px-6">
                          <span className="font-medium text-gray-900">{cls.grade}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: `${site.branding.primaryColor}15`,
                              color: site.branding.primaryColor,
                            }}
                          >
                            {cls.day}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{cls.time}</td>
                        <td className="py-4 px-6">
                          <span className="font-semibold" style={{ color: site.branding.accentColor }}>
                            {cls.monthly}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Schedule information coming soon</p>
              </div>
            )}
          </div>

          {/* Note */}
          {schedule?.note && (
            <div
              className="mt-6 p-4 rounded-xl flex items-start gap-3"
              style={{ backgroundColor: `${site.branding.accentColor}10` }}
            >
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: site.branding.accentColor }} />
              <p className="text-sm" style={{ color: site.branding.accentColor }}>
                {schedule.note}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Schedule by Day */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Classes by Day</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Sat'].map((day) => {
              const dayClasses = classes.filter((c) => c.day === day);
              if (dayClasses.length === 0) return null;

              return (
                <div key={day} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" style={{ color: site.branding.primaryColor }} />
                    {day === 'Mon' && 'Monday'}
                    {day === 'Tue' && 'Tuesday'}
                    {day === 'Wed' && 'Wednesday'}
                    {day === 'Thu' && 'Thursday'}
                    {day === 'Sat' && 'Saturday'}
                  </h3>
                  <div className="space-y-3">
                    {dayClasses.map((cls, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 rounded-lg"
                        style={{ backgroundColor: `${site.branding.primaryColor}08` }}
                      >
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{cls.grade}</div>
                          <div className="text-xs text-gray-500">{cls.time}</div>
                        </div>
                        <div className="font-semibold text-sm" style={{ color: site.branding.primaryColor }}>
                          {cls.monthly}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12" style={{ backgroundColor: site.branding.accentColor }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Questions About Our Schedule?
          </h2>
          <p className="text-white/90 mb-6">
            Call us to discuss the best class time for your student or to arrange a trial class.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${site.contact.phone}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition"
            >
              <Phone className="w-5 h-5" />
              {site.contact.phone}
            </a>
            <a
              href={`/showcase/${site.slug}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
