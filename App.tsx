
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import IncidentCard from './components/IncidentCard';
import ReportForm from './components/ReportForm';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import { Incident, IncidentStatus, IncidentType, Severity, LocationData } from './types';
import { storageService } from './services/storageService';
import { geminiService } from './services/geminiService';
import { Search, SlidersHorizontal, Map as MapIcon, List, Bell } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'auth' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('feed');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filterType, setFilterType] = useState<string>('All');
  const [userRole, setUserRole] = useState<'CITIZEN' | 'RESPONDER'>('CITIZEN');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Initial load
    setIncidents(storageService.getIncidents());
    
    // Check if previously logged in (mock)
    const savedAuth = localStorage.getItem('anginat_auth');
    if (savedAuth) {
      setUserRole(savedAuth as 'CITIZEN' | 'RESPONDER');
      setAppState('app');
    }

    // Simulate real-time polling
    const interval = setInterval(() => {
      setIncidents(storageService.getIncidents());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (role: 'CITIZEN' | 'RESPONDER') => {
    setUserRole(role);
    setAppState('app');
    localStorage.setItem('anginat_auth', role);
    showNotification(`Welcome back! Logged in as ${role.toLowerCase()}`);
  };

  const handleLogout = () => {
    setAppState('landing');
    localStorage.removeItem('anginat_auth');
  };

  const handleReportSubmit = async (data: { type: IncidentType; description: string; location: LocationData; mediaUrl?: string }) => {
    // 1. Check for duplicates using AI
    const duplicateId = await geminiService.checkDuplicates(
      data.description, 
      incidents.slice(0, 10).map(i => ({ id: i.id, description: i.description }))
    );

    // 2. Analyze severity using AI
    const analysis = await geminiService.analyzeIncident(data.description, data.type);

    const newIncident: Incident = {
      id: crypto.randomUUID(),
      type: data.type,
      description: data.description,
      location: data.location,
      timestamp: Date.now(),
      status: analysis.isLikelyFalse ? IncidentStatus.UNVERIFIED : IncidentStatus.UNVERIFIED,
      severity: analysis.severity as Severity,
      upvotes: 0,
      reporterId: 'user-1',
      mediaUrl: data.mediaUrl,
      isDuplicateOf: duplicateId || undefined
    };

    storageService.saveIncident(newIncident);
    setIncidents(prev => [newIncident, ...prev]);
    showNotification('Report submitted successfully!');
    setActiveTab('feed');
  };

  const handleUpvote = (id: string) => {
    storageService.upvoteIncident(id);
    setIncidents(storageService.getIncidents());
  };

  const handleUpdateStatus = (id: string, status: IncidentStatus) => {
    storageService.updateIncident(id, { status });
    setIncidents(storageService.getIncidents());
    showNotification(`Status updated for incident #${id.slice(0, 5)}`);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchesType = filterType === 'All' || inc.type === filterType;
    const matchesSearch = inc.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (appState === 'landing') {
    return <LandingPage onGetStarted={() => setAppState('auth')} />;
  }

  if (appState === 'auth') {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      userRole={userRole} 
      onLogout={handleLogout}
    >
      {notification && (
        <div className="fixed top-20 right-4 z-[100] bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-1 bg-blue-500 rounded-lg">
            <Bell size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {activeTab === 'feed' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="Search incidents by keyword..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl text-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             
             <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-2xl shrink-0">
                   <SlidersHorizontal size={14} className="text-gray-400" />
                   <select 
                    className="bg-transparent text-xs font-bold focus:outline-none appearance-none cursor-pointer"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                   >
                      <option value="All">All Incidents</option>
                      {Object.values(IncidentType).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-2xl shrink-0">
                    <button className="p-2 bg-white shadow-sm rounded-xl text-blue-600">
                      <List size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MapIcon size={16} />
                    </button>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIncidents.map(inc => (
              <IncidentCard 
                key={inc.id} 
                incident={inc} 
                onUpvote={handleUpvote} 
                isAdmin={userRole === 'RESPONDER'}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
            {filteredIncidents.length === 0 && (
              <div className="col-span-full py-32 text-center flex flex-col items-center">
                 <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
                    <Search size={32} className="text-gray-300" />
                 </div>
                 <h3 className="text-xl font-extrabold text-gray-900 mb-2">No Reports Found</h3>
                 <p className="text-gray-500 max-w-xs text-sm">We couldn't find any reports matching your criteria. Try adjusting your filters or search term.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <ReportForm onSubmit={handleReportSubmit} />
      )}

      {activeTab === 'admin' && userRole === 'RESPONDER' && (
        <AdminDashboard incidents={incidents} onUpdateStatus={handleUpdateStatus} />
      )}
    </Layout>
  );
};

export default App;
