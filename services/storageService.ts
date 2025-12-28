
import { Incident, IncidentStatus } from '../types';

const STORAGE_KEY = 'anginat_incidents';

export const storageService = {
  getIncidents: (): Incident[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveIncident: (incident: Incident): void => {
    const current = storageService.getIncidents();
    const updated = [incident, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateIncident: (id: string, updates: Partial<Incident>): void => {
    const current = storageService.getIncidents();
    const updated = current.map(inc => 
      inc.id === id ? { ...inc, ...updates } : inc
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  upvoteIncident: (id: string): void => {
    const current = storageService.getIncidents();
    const updated = current.map(inc => {
      if (inc.id === id) {
        const newUpvotes = inc.upvotes + 1;
        // Auto-verify if upvotes reach threshold
        const newStatus = (newUpvotes >= 5 && inc.status === IncidentStatus.UNVERIFIED) 
          ? IncidentStatus.VERIFIED 
          : inc.status;
        return { ...inc, upvotes: newUpvotes, status: newStatus };
      }
      return inc;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
