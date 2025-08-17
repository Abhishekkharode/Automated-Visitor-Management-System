
import React from 'react';
import type { VisitorProfile } from '../types';
import { UserIcon } from './icons/UserIcon';
import { AgeIcon } from './icons/AgeIcon';
import { GenderIcon } from './icons/GenderIcon';
import { ProfessionIcon } from './icons/ProfessionIcon';
import { EditIcon } from './icons/EditIcon';

interface AnalysisResultCardProps {
  profile: VisitorProfile;
  onEdit: () => void;
}

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-cyan-500">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ profile, onEdit }) => {
  return (
    <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl border border-gray-200 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-500">Visitor Profile</h2>
        <button 
          onClick={onEdit}
          className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 font-semibold rounded-full text-sm transition-all"
          aria-label="Edit visitor profile"
        >
          <EditIcon />
          Edit
        </button>
      </div>
      <div className="space-y-4">
        <InfoItem icon={<UserIcon />} label="Name / Description" value={profile.name} />
        <InfoItem icon={<AgeIcon />} label="Estimated Age Range" value={profile.age} />
        <InfoItem icon={<GenderIcon />} label="Gender" value={profile.gender} />
        <InfoItem icon={<ProfessionIcon />} label="Likely Profession" value={profile.profession} />
      </div>
    </div>
  );
};