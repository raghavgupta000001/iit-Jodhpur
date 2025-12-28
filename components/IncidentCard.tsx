
import React from 'react';
import { MapPin, Clock, ThumbsUp, AlertTriangle, CheckCircle2, MoreVertical, ExternalLink } from 'lucide-react';
import { Incident, IncidentStatus, Severity } from '../types';

interface IncidentCardProps {
  incident: Incident;
  onUpvote?: (id: string) => void;
  isAdmin?: boolean;
  onUpdateStatus?: (id: string, status: IncidentStatus) => void;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onUpvote, isAdmin, onUpdateStatus }) => {
  const getSeverityColor = (sev: Severity) => {
    switch(sev) {
      case Severity.CATASTROPHIC: return 'bg-red-600 text-white';
      case Severity.CRITICAL: return 'bg-red-500 text-white';
      case Severity.HIGH: return 'bg-orange-500 text-white';
      case Severity.MEDIUM: return 'bg-yellow-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch(status) {
      case IncidentStatus.VERIFIED: return <span className="flex items-center gap-1 text-green-600 text-xs font-semibold"><CheckCircle2 size={14}/> Verified</span>;
      case IncidentStatus.RESPONDING: return <span className="text-blue-600 text-xs font-semibold px-2 py-0.5 bg-blue-50 rounded-full">Responders Active</span>;
      case IncidentStatus.RESOLVED: return <span className="text-gray-500 text-xs font-semibold px-2 py-0.5 bg-gray-100 rounded-full">Resolved</span>;
      default: return <span className="flex items-center gap-1 text-yellow-600 text-xs font-semibold"><AlertTriangle size={14}/> Pending Verification</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getSeverityColor(incident.severity)}`}>
                Severity {incident.severity}
              </span>
              <span className="text-sm font-bold text-gray-900">{incident.type}</span>
            </div>
            {getStatusBadge(incident.status)}
          </div>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={12} /> {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {incident.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-blue-500" />
            <span>{incident.location.address || `${incident.location.lat.toFixed(4)}, ${incident.location.lng.toFixed(4)}`}</span>
          </div>
        </div>

        {incident.mediaUrl && (
          <div className="mb-4 rounded-lg overflow-hidden h-40">
            <img src={incident.mediaUrl} alt="Incident media" className="w-full h-full object-cover" />
          </div>
        )}

        {incident.isDuplicateOf && (
          <div className="bg-yellow-50 text-yellow-700 text-[10px] p-2 rounded-lg mb-4 border border-yellow-100">
            Possible duplicate of report #{incident.isDuplicateOf.slice(0, 5)}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onUpvote && onUpvote(incident.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <ThumbsUp size={16} />
              <span className="text-sm font-medium">{incident.upvotes}</span>
            </button>
            <button className="text-gray-400 hover:text-blue-600">
              <ExternalLink size={16} />
            </button>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <select 
                className="text-xs border rounded px-2 py-1 bg-gray-50"
                value={incident.status}
                onChange={(e) => onUpdateStatus && onUpdateStatus(incident.id, e.target.value as IncidentStatus)}
              >
                <option value={IncidentStatus.UNVERIFIED}>Unverified</option>
                <option value={IncidentStatus.VERIFIED}>Verified</option>
                <option value={IncidentStatus.RESPONDING}>Responding</option>
                <option value={IncidentStatus.RESOLVED}>Resolved</option>
                <option value={IncidentStatus.FALSE_ALARM}>False Alarm</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentCard;
