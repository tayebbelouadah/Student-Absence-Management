/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  AbsenceRecord,
  StaffMember,
  UniversityConfig,
  ActiveDesktopTab,
} from './types';
import {
  getStoredRecords,
  saveRecords,
  getStoredStaff,
  saveStaff,
  getStoredConfig,
  saveConfig,
  getStoredAuthorities,
  saveAuthorities,
  exportRecordsToCSV,
  exportBackupJSON,
} from './utils/storage';

import { DesktopWindowFrame } from './components/DesktopWindowFrame';
import { HeaderBranding } from './components/HeaderBranding';
import { DashboardView } from './components/DashboardView';
import { AbsenceRecordsView } from './components/AbsenceRecordsView';
import { StaffManagementView } from './components/StaffManagementView';
import { IssuingAuthoritiesView } from './components/IssuingAuthoritiesView';
import { AbsenceEntryModal } from './components/AbsenceEntryModal';
import { OfficialPrintReceipt } from './components/OfficialPrintReceipt';
import { AboutDialog } from './components/AboutDialog';

export default function App() {
  const [records, setRecords] = useState<AbsenceRecord[]>(getStoredRecords);
  const [staffList, setStaffList] = useState<StaffMember[]>(getStoredStaff);
  const [config, setConfig] = useState<UniversityConfig>(getStoredConfig);
  const [authorities, setAuthorities] = useState<string[]>(getStoredAuthorities);

  const [activeTab, setActiveTab] = useState<ActiveDesktopTab>('dashboard');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AbsenceRecord | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPrintRecord, setSelectedPrintRecord] = useState<AbsenceRecord | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Active clerk
  const activeStaff = staffList.find((s) => s.isActive) || staffList[0];

  // Save to localStorage when state changes
  useEffect(() => {
    saveRecords(records);
  }, [records]);

  useEffect(() => {
    saveStaff(staffList);
  }, [staffList]);

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  useEffect(() => {
    saveAuthorities(authorities);
  }, [authorities]);

  // Keyboard shortcut: F2 to create a new absence entry, Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setEditingRecord(null);
        setIsEntryModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenNewEntry = useCallback(() => {
    setEditingRecord(null);
    setIsEntryModalOpen(true);
  }, []);

  const handleEditRecord = useCallback((record: AbsenceRecord) => {
    setEditingRecord(record);
    setIsEntryModalOpen(true);
  }, []);

  const handleDeleteRecord = useCallback((recordId: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== recordId));
  }, []);

  const handleSaveRecord = useCallback((savedRecord: AbsenceRecord) => {
    setRecords((prev) => {
      const exists = prev.some((r) => r.id === savedRecord.id);
      if (exists) {
        return prev.map((r) => (r.id === savedRecord.id ? savedRecord : r));
      } else {
        return [savedRecord, ...prev];
      }
    });

    // Ask if user wants to print the official receipt immediately
    setTimeout(() => {
      setSelectedPrintRecord(savedRecord);
      setIsPrintModalOpen(true);
    }, 150);
  }, []);

  const handleSelectRecordForPrint = useCallback((record: AbsenceRecord) => {
    setSelectedPrintRecord(record);
    setIsPrintModalOpen(true);
  }, []);

  const handleExportCSV = useCallback(() => {
    exportRecordsToCSV(records);
  }, [records]);

  const handleBackupJSON = useCallback(() => {
    exportBackupJSON(records, staffList, config);
  }, [records, staffList, config]);

  return (
    <DesktopWindowFrame
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onOpenNewEntry={handleOpenNewEntry}
      onOpenAbout={() => setIsAboutOpen(true)}
      onExportCSV={handleExportCSV}
      onBackupJSON={handleBackupJSON}
      records={records}
      activeStaff={activeStaff}
      onOpenStaffModal={() => setActiveTab('staff')}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    >
      {/* Top Branding Section (University, Faculty, Creator Attribution) */}
      <HeaderBranding
        config={config}
        onUpdateConfig={setConfig}
        activeStaff={activeStaff}
        onOpenStaffModal={() => setActiveTab('staff')}
      />

      {/* Main View Router */}
      <main className="mt-4">
        {activeTab === 'dashboard' && (
          <DashboardView
            records={records}
            onOpenNewEntry={handleOpenNewEntry}
            onSelectRecordForPrint={handleSelectRecordForPrint}
            onNavigateToRecords={() => setActiveTab('records')}
            activeStaff={activeStaff}
            config={config}
          />
        )}

        {activeTab === 'records' && (
          <AbsenceRecordsView
            records={records}
            onOpenNewEntry={handleOpenNewEntry}
            onEditRecord={handleEditRecord}
            onDeleteRecord={handleDeleteRecord}
            onSelectRecordForPrint={handleSelectRecordForPrint}
            onExportCSV={handleExportCSV}
            initialSearch={searchTerm}
          />
        )}

        {activeTab === 'staff' && (
          <StaffManagementView
            staffList={staffList}
            onUpdateStaffList={setStaffList}
            records={records}
          />
        )}

        {activeTab === 'authorities' && (
          <IssuingAuthoritiesView
            authorities={authorities}
            onUpdateAuthorities={setAuthorities}
            records={records}
          />
        )}
      </main>

      {/* Modal: New / Edit Absence Record */}
      <AbsenceEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => {
          setIsEntryModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        existingRecord={editingRecord}
        allRecords={records}
        activeStaff={activeStaff}
        issuingAuthorities={authorities}
        config={config}
      />

      {/* Modal: Official University Print Document & Receipt */}
      {isPrintModalOpen && selectedPrintRecord && (
        <OfficialPrintReceipt
          record={selectedPrintRecord}
          config={config}
          activeStaff={activeStaff}
          onClose={() => {
            setIsPrintModalOpen(false);
            setSelectedPrintRecord(null);
          }}
        />
      )}

      {/* Modal: About & Creator Attribution Dialog */}
      <AboutDialog
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        config={config}
      />
    </DesktopWindowFrame>
  );
}
