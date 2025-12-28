
import React, { useState, useEffect } from 'react';
import { MapPin, Camera, AlertCircle, Loader2 } from 'lucide-react';
import { IncidentType, LocationData } from '../types';

interface ReportFormProps {
  onSubmit: (data: { type: IncidentType; description: string; location: LocationData; mediaUrl?: string }) => Promise<void>;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit }) => {
  const [type, setType] = useState<IncidentType>(IncidentType.ACCIDENT);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mediaFile, setMediaFile] = useState<string | null>(null);

  useEffect(() => {
    // Get location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: 'Current Location' });
      });
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !location) return;
    
    setLoading(true);
    try {
      await onSubmit({
        type,
        description,
        location,
        mediaUrl: mediaFile || undefined
      });
      // Reset
      setDescription('');
      setMediaFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertCircle className="text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Report an Incident</h2>
          <p className="text-sm text-gray-500">Provide accurate details to help emergency responders.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Incident Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.values(IncidentType).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  type === t 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">What is happening?</label>
          <textarea
            required
            rows={4}
            className="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Describe the situation, number of people involved, any visible hazards..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Location</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <MapPin className="text-blue-500 h-5 w-5" />
              <span className="text-xs text-gray-600 truncate">
                {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Fetching location...'}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Evidence (Optional)</label>
            <label className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
              <Camera className="text-gray-400 h-5 w-5" />
              <span className="text-xs text-gray-600">{mediaFile ? 'Photo Attached' : 'Attach Photo'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>

        <button
          disabled={loading || !location}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
