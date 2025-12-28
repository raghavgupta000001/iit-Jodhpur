
import React from 'react';
import { Shield, AlertCircle, LayoutDashboard, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'CITIZEN' | 'RESPONDER';
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('feed')}>
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold tracking-tight text-gray-900">ANGINAT</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setActiveTab('feed')}
                className={`${activeTab === 'feed' ? 'border-blue-600 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Incident Feed
              </button>
              <button 
                onClick={() => setActiveTab('report')}
                className={`${activeTab === 'report' ? 'border-blue-600 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Report Incident
              </button>
              {userRole === 'RESPONDER' && (
                <button 
                  onClick={() => setActiveTab('admin')}
                  className={`${activeTab === 'admin' ? 'border-blue-600 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                >
                  Admin Portal
                </button>
              )}
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-1 bg-gray-100 rounded-lg text-gray-600 tracking-wider">
                {userRole}
              </span>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Log out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl pb-24 md:pb-8">
        {children}
      </main>

      <footer className="hidden md:block bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; 2024 Anginat Incident Response System. All rights reserved.
        </div>
      </footer>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 px-2 z-[40]">
        <button onClick={() => setActiveTab('feed')} className={`flex flex-col items-center gap-1 ${activeTab === 'feed' ? 'text-blue-600' : 'text-gray-400'}`}>
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-[10px] font-bold">Feed</span>
        </button>
        <button onClick={() => setActiveTab('report')} className={`flex flex-col items-center gap-1 ${activeTab === 'report' ? 'text-blue-600' : 'text-gray-400'}`}>
          <AlertCircle className="h-6 w-6" />
          <span className="text-[10px] font-bold">Report</span>
        </button>
        {userRole === 'RESPONDER' && (
          <button onClick={() => setActiveTab('admin')} className={`flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'text-blue-600' : 'text-gray-400'}`}>
            <Shield className="h-6 w-6" />
            <span className="text-[10px] font-bold">Admin</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Layout;
