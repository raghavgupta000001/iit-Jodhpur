
import React from 'react';
import { Shield, Zap, CheckCircle, Users, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-32">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-700 tracking-wide uppercase">Real-Time Incident Network</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
              Respond Faster. <br />
              <span className="text-blue-600">Coordinate Better.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Anginat is an AI-powered platform designed for communities and emergency responders to bridge the gap in critical incident reporting and resource management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                Join the Network <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Critical Moments</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Our platform streamlines communication between citizens and responders when seconds count.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-blue-600" />,
                title: "AI Analysis",
                desc: "Every report is analyzed in real-time by Gemini AI to determine severity and detect potential duplicates."
              },
              {
                icon: <CheckCircle className="text-blue-600" />,
                title: "Smart Verification",
                desc: "Crowdsourced verification through community upvoting reduces false alarms and builds trust."
              },
              {
                icon: <Shield className="text-blue-600" />,
                title: "Responder Tools",
                desc: "Dedicated interfaces for emergency units to prioritize, coordinate, and resolve incidents efficiently."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold mb-2">40%</p>
              <p className="text-blue-100 text-sm">Faster Response</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-2">99%</p>
              <p className="text-blue-100 text-sm">Report Accuracy</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-2">5k+</p>
              <p className="text-blue-100 text-sm">Verified Responders</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-2">24/7</p>
              <p className="text-blue-100 text-sm">AI Monitoring</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
