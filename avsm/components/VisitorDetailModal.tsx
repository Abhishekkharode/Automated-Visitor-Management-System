import React from 'react';
import type { LoggedVisitor, VisitorProfile } from '../types';
import { Modal } from './Modal';
import { UserIcon } from './icons/UserIcon';
import { AgeIcon } from './icons/AgeIcon';
import { GenderIcon } from './icons/GenderIcon';
import { ProfessionIcon } from './icons/ProfessionIcon';

interface VisitorDetailModalProps {
  visitor: LoggedVisitor;
  onClose: () => void;
}

const ProfileDetailColumn: React.FC<{ title: string; profile: VisitorProfile; isRaw?: boolean }> = ({ title, profile, isRaw = false }) => (
  <div className={`w-full p-4 rounded-lg ${isRaw ? 'bg-gray-100' : 'bg-gray-50'}`}>
    <h3 className={`text-lg font-bold mb-4 ${isRaw ? 'text-gray-500' : 'text-cyan-600'}`}>{title}</h3>
    <div className="space-y-3 text-sm">
      <div className="flex items-start gap-3">
        <UserIcon />
        <div>
          <p className="font-semibold text-gray-500">Name / Desc.</p>
          <p className="text-gray-900">{profile.name}</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <AgeIcon />
        <div>
          <p className="font-semibold text-gray-500">Age Range</p>
          <p className="text-gray-900">{profile.age}</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <GenderIcon />
        <div>
          <p className="font-semibold text-gray-500">Gender</p>
          <p className="text-gray-900">{profile.gender}</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <ProfessionIcon />
        <div>
          <p className="font-semibold text-gray-500">Profession</p>
          <p className="text-gray-900">{profile.profession}</p>
        </div>
      </div>
    </div>
  </div>
);


export const VisitorDetailModal: React.FC<VisitorDetailModalProps> = ({ visitor, onClose }) => {
    const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Modal isOpen={!!visitor} onClose={onClose} title="Visitor Details">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 flex flex-col items-center">
            <img 
                src={visitor.photo} 
                alt={visitor.enhancedProfile.name} 
                className="w-48 h-48 rounded-full object-cover border-4 border-cyan-500 shadow-lg"
            />
             <div className="text-center mt-4">
                <p className="text-xl font-bold text-gray-900">{visitor.enhancedProfile.name}</p>
                <p className="text-sm text-gray-500">Status: <span className={visitor.status === 'Checked-in' ? 'text-green-600' : 'text-gray-600'}>{visitor.status}</span></p>
                <p className="text-sm text-gray-500">Check-in: {formatDate(visitor.timestamp)}</p>
                <p className="text-sm text-gray-500">Check-out: {formatDate(visitor.checkOutTime)}</p>
            </div>
        </div>
        <div className="w-full md:w-2/3 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProfileDetailColumn title="Raw AI Data" profile={visitor.rawProfile} isRaw />
            <ProfileDetailColumn title="Enhanced Data" profile={visitor.enhancedProfile} />
        </div>
      </div>
    </Modal>
  );
};