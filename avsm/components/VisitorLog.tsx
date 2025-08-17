import React from 'react';
import type { LoggedVisitor } from '../types';
import { ViewIcon } from './icons/ViewIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { CheckOutIcon } from './icons/CheckOutIcon';

interface VisitorLogProps {
  log: LoggedVisitor[];
  onViewDetails: (visitor: LoggedVisitor) => void;
  onDeleteVisitor: (visitorId: string) => void;
  onUpdateVisitor: (visitorId: string, updates: Partial<LoggedVisitor>) => void;
}

const VisitorLogItem: React.FC<{ visitor: LoggedVisitor; index: number; onViewDetails: (visitor: LoggedVisitor) => void; onDeleteVisitor: (visitorId: string) => void; onUpdateVisitor: (visitorId: string, updates: Partial<LoggedVisitor>) => void; }> = ({ visitor, index, onViewDetails, onDeleteVisitor, onUpdateVisitor }) => {
  const handleCheckOut = () => {
    onUpdateVisitor(visitor.id, {
      status: 'Checked-out',
      checkOutTime: new Date().toISOString(),
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <tr className="bg-white border-b last:border-b-0 border-gray-200 hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 font-medium text-gray-500">{index}</td>
      <td className="px-6 py-4">
        <img src={visitor.photo} alt={visitor.enhancedProfile.name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" />
      </td>
      <td className="px-6 py-4 font-bold text-gray-900">{visitor.enhancedProfile.name}</td>
      <td className="px-6 py-4 text-gray-600">{formatDate(visitor.timestamp)}</td>
      <td className="px-6 py-4 text-gray-600">{formatDate(visitor.checkOutTime)}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${visitor.status === 'Checked-in' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {visitor.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
           <button onClick={() => onViewDetails(visitor)} className="p-2 text-gray-400 hover:text-cyan-500 transition-colors" aria-label="View Details">
            <ViewIcon />
          </button>
           {visitor.status === 'Checked-in' && (
            <button onClick={handleCheckOut} className="p-2 text-gray-400 hover:text-amber-500 transition-colors" aria-label="Check-out">
              <CheckOutIcon />
            </button>
          )}
          <button onClick={() => onDeleteVisitor(visitor.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete Record">
            <DeleteIcon />
          </button>
        </div>
      </td>
    </tr>
  );
};

export const VisitorLog: React.FC<VisitorLogProps> = ({ log, onViewDetails, onDeleteVisitor, onUpdateVisitor }) => {
  if (log.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500 font-semibold">No visitors found for the selected filters.</p>
        <p className="text-gray-400 mt-2">Try adjusting your search criteria or log a new visitor.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Image</th>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Check-in</th>
            <th scope="col" className="px-6 py-3">Check-out</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {log.map((visitor, index) => (
            <VisitorLogItem 
              key={visitor.id} 
              visitor={visitor} 
              index={index + 1} 
              onViewDetails={onViewDetails} 
              onDeleteVisitor={onDeleteVisitor}
              onUpdateVisitor={onUpdateVisitor}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};