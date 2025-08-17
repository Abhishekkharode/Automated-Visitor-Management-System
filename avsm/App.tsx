import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { getVisitorLog, saveVisitorLog } from './services/logService';
import type { LoggedVisitor } from './types';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { VisitorDetailModal } from './components/VisitorDetailModal';

type View = 'dashboard' | 'scanning';

export default function App(): React.ReactNode {
  const [view, setView] = useState<View>('dashboard');
  const [visitorLog, setVisitorLog] = useState<LoggedVisitor[]>([]);
  const [selectedVisitor, setSelectedVisitor] = useState<LoggedVisitor | null>(null);

  useEffect(() => {
    setVisitorLog(getVisitorLog());
  }, []);

  const updateLog = (newLog: LoggedVisitor[]) => {
    const sortedLog = newLog.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setVisitorLog(sortedLog);
    saveVisitorLog(sortedLog);
  };

  const handleScanComplete = useCallback((newVisitor: LoggedVisitor) => {
    const updatedLog = [newVisitor, ...visitorLog];
    updateLog(updatedLog);
    setView('dashboard');
  }, [visitorLog]);

  const handleDeleteVisitor = useCallback((visitorId: string) => {
    const updatedLog = visitorLog.filter(v => v.id !== visitorId);
    updateLog(updatedLog);
    setSelectedVisitor(null); // Close modal if open
  }, [visitorLog]);

  const handleUpdateVisitor = useCallback((visitorId: string, updates: Partial<LoggedVisitor>) => {
    const updatedLog = visitorLog.map(v =>
      v.id === visitorId ? { ...v, ...updates } : v
    );
    updateLog(updatedLog);
  }, [visitorLog]);


  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-7xl flex-grow flex flex-col items-center justify-center mt-8">
        {view === 'dashboard' ? (
          <Dashboard
            log={visitorLog}
            onScanNew={() => setView('scanning')}
            onViewDetails={setSelectedVisitor}
            onDeleteVisitor={handleDeleteVisitor}
            onUpdateVisitor={handleUpdateVisitor}
          />
        ) : (
          <Scanner onCancel={() => setView('dashboard')} onScanComplete={handleScanComplete} />
        )}
      </main>
      <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>VisioTrack AI &copy; 2024. Powered by Gemini API.</p>
        <p>This tool provides AI-based estimations for informational purposes only.</p>
      </footer>
      
      {selectedVisitor && (
        <VisitorDetailModal 
          visitor={selectedVisitor}
          onClose={() => setSelectedVisitor(null)}
        />
      )}
    </div>
  );
}