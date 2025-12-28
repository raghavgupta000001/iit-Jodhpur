
import React from 'react';
import { Activity, Users, CheckCircle, AlertOctagon } from 'lucide-react';
import { Incident, IncidentStatus } from '../types';
import IncidentCard from './IncidentCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  incidents: Incident[];
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ incidents, onUpdateStatus }) => {
  const stats = {
    active: incidents.filter(i => i.status !== IncidentStatus.RESOLVED).length,
    unverified: incidents.filter(i => i.status === IncidentStatus.UNVERIFIED).length,
    critical: incidents.filter(i => i.severity >= 4 && i.status !== IncidentStatus.RESOLVED).length,
    resolved: incidents.filter(i => i.status === IncidentStatus.RESOLVED).length
  };

  const chartData = [
    { name: 'Accidents', count: incidents.filter(i => i.type === 'Accident').length },
    { name: 'Medical', count: incidents.filter(i => i.type === 'Medical').length },
    { name: 'Fire', count: incidents.filter(i => i.type === 'Fire').length },
    { name: 'Infrastructure', count: incidents.filter(i => i.type === 'Infrastructure').length },
    { name: 'Safety', count: incidents.filter(i => i.type === 'Public Safety').length },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Active', value: stats.active, icon: <Activity className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Unverified', value: stats.unverified, icon: <Users className="text-yellow-600" />, bg: 'bg-yellow-50' },
          { label: 'High Priority', value: stats.critical, icon: <AlertOctagon className="text-red-600" />, bg: 'bg-red-50' },
          { label: 'Resolved Today', value: stats.resolved, icon: <CheckCircle className="text-green-600" />, bg: 'bg-green-50' }
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-4 rounded-2xl border border-white shadow-sm flex items-center justify-between`}>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Priority Queue</h3>
            <div className="flex gap-2">
               <span className="text-[10px] px-2 py-1 bg-red-100 text-red-600 rounded-full font-bold">LATEST FIRST</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incidents.filter(i => i.status !== IncidentStatus.RESOLVED).map(inc => (
              <IncidentCard 
                key={inc.id} 
                incident={inc} 
                isAdmin 
                onUpdateStatus={onUpdateStatus}
              />
            ))}
            {incidents.filter(i => i.status !== IncidentStatus.RESOLVED).length === 0 && (
              <div className="col-span-2 py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">All clear. No active incidents reported.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-6">Incidents by Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl text-white shadow-xl">
             <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <AlertOctagon size={16} className="text-red-500" /> System Status
             </h3>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Response Units Available</span>
                   <span className="text-green-400">12 Available</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full">
                   <div className="bg-green-500 h-1.5 w-3/4 rounded-full"></div>
                </div>
                <div className="flex justify-between items-center text-xs pt-2">
                   <span className="text-gray-400">Mean Dispatch Time</span>
                   <span>4.2 mins</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2">
                   <span className="text-gray-400">AI Verification Load</span>
                   <span>Nominal</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
