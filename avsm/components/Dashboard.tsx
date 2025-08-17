import React, { useState, useMemo } from 'react';
import type { LoggedVisitor } from '../types';
import { VisitorLog } from './VisitorLog';
import { CameraIcon } from './icons/CameraIcon';
import { ExportIcon } from './icons/ExportIcon';

interface DashboardProps {
  log: LoggedVisitor[];
  onScanNew: () => void;
  onViewDetails: (visitor: LoggedVisitor) => void;
  onDeleteVisitor: (visitorId: string) => void;
  onUpdateVisitor: (visitorId: string, updates: Partial<LoggedVisitor>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ log, onScanNew, onViewDetails, onDeleteVisitor, onUpdateVisitor }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [nameFilter, setNameFilter] = useState('');

  const filteredLog = useMemo(() => {
    return log.filter(visitor => {
      const checkinDate = new Date(visitor.timestamp);
      if (startDate && checkinDate < new Date(startDate)) {
        return false;
      }
      // Add 1 day to end date to include the whole day
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        if (checkinDate > end) return false;
      }
      if (statusFilter !== 'All' && visitor.status !== statusFilter) {
        return false;
      }
      if (nameFilter && !visitor.enhancedProfile.name.toLowerCase().includes(nameFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [log, startDate, endDate, statusFilter, nameFilter]);

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Age', 'Gender', 'Profession', 'Check-in', 'Check-out', 'Status'];
    const rows = filteredLog.map(v => [
      v.id,
      v.enhancedProfile.name,
      v.enhancedProfile.age,
      v.enhancedProfile.gender,
      v.enhancedProfile.profession,
      new Date(v.timestamp).toLocaleString(),
      v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : 'N/A',
      v.status
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `visitor_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full animate-fade-in bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl">
      <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-cyan-500">Visitor Log</h2>
         <button
            onClick={onScanNew}
            className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-lg shadow-lg hover:bg-cyan-400 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <CameraIcon className="w-5 h-5" />
            <span className="font-bold">Scan New Visitor</span>
          </button>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end border-b border-gray-200">
          <div className="w-full">
            <label className="text-xs text-gray-500">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 bg-gray-50 rounded-md border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"/>
          </div>
          <div className="w-full">
            <label className="text-xs text-gray-500">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 bg-gray-50 rounded-md border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"/>
          </div>
           <div className="w-full">
            <label className="text-xs text-gray-500">Name</label>
            <input type="text" placeholder="Filter by name..." value={nameFilter} onChange={e => setNameFilter(e.target.value)} className="w-full p-2 bg-gray-50 rounded-md border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"/>
          </div>
          <div className="w-full">
            <label className="text-xs text-gray-500">Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-2 bg-gray-50 rounded-md border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500">
                <option value="All">All Status</option>
                <option value="Checked-in">Checked-in</option>
                <option value="Checked-out">Checked-out</option>
            </select>
          </div>
          <div className="w-full">
            <button onClick={handleExport} className="w-full p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-md flex items-center justify-center gap-2 transition-colors">
                <ExportIcon />
                Export
            </button>
          </div>
      </div>
      
      <div className="p-4">
        <VisitorLog log={filteredLog} onViewDetails={onViewDetails} onDeleteVisitor={onDeleteVisitor} onUpdateVisitor={onUpdateVisitor} />
      </div>
    </div>
  );
};