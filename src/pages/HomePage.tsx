import React from 'react'
import { Mic, FileText, Calendar, FileEdit } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to AI Playground</h1>
      <p className="text-gray-600">Manage your recordings, transcripts, calendar, and notes all in one place.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard icon={<Mic className="w-8 h-8 text-blue-500" />} title="Recordings" count={5} />
        <DashboardCard icon={<FileText className="w-8 h-8 text-green-500" />} title="Transcripts" count={3} />
        <DashboardCard icon={<Calendar className="w-8 h-8 text-purple-500" />} title="Upcoming Events" count={2} />
        <DashboardCard icon={<FileEdit className="w-8 h-8 text-yellow-500" />} title="Notes" count={10} />
      </div>
    </div>
  )
}

const DashboardCard = ({ icon, title, count }: { icon: React.ReactNode; title: string; count: number }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {icon}
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <span className="text-2xl font-bold text-gray-700">{count}</span>
      </div>
    </div>
  )
}

export default HomePage