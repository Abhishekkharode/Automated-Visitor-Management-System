
import React from 'react';
import type { VisitorProfile } from '../types';
import { UserIcon } from './icons/UserIcon';
import { AgeIcon } from './icons/AgeIcon';
import { GenderIcon } from './icons/GenderIcon';
import { ProfessionIcon } from './icons/ProfessionIcon';

interface AnalysisEditCardProps {
  profile: VisitorProfile;
  onUpdate: (updatedProfile: VisitorProfile) => void;
}

const EditItem: React.FC<{ icon: React.ReactNode; label: string; value: string; name: keyof VisitorProfile; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ icon, label, value, name, onChange }) => (
    <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-cyan-500">
            {icon}
        </div>
        <div className="w-full">
            <label htmlFor={name} className="text-sm text-gray-500">{label}</label>
            <input
                id={name}
                name={name}
                type="text"
                value={value}
                onChange={onChange}
                className="w-full bg-transparent text-lg font-bold text-gray-900 border-b-2 border-gray-300 focus:border-cyan-400 outline-none transition-colors"
            />
        </div>
    </div>
);


export const AnalysisEditCard: React.FC<AnalysisEditCardProps> = ({ profile, onUpdate }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onUpdate({
            ...profile,
            [name]: value,
        });
    };

    return (
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl border border-gray-200 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-6 text-cyan-500">Edit Profile</h2>
            <div className="space-y-4">
                <EditItem icon={<UserIcon />} label="Name / Description" name="name" value={profile.name} onChange={handleChange} />
                <EditItem icon={<AgeIcon />} label="Estimated Age Range" name="age" value={profile.age} onChange={handleChange} />
                <EditItem icon={<GenderIcon />} label="Gender" name="gender" value={profile.gender} onChange={handleChange} />
                <EditItem icon={<ProfessionIcon />} label="Likely Profession" name="profession" value={profile.profession} onChange={handleChange} />
            </div>
        </div>
    );
};