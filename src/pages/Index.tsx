
import { useState } from 'react';
import { Header } from '@/components/Header';
import { DataUploadSection } from '@/components/DataUploadSection';
import { DataTablesSection } from '@/components/DataTablesSection';
import { AIValidationCard } from '@/components/AIValidationCard';
import { NaturalLanguageModificationCard } from '@/components/NaturalLanguageModificationCard';
import { DefineRulesCard } from '@/components/DefineRulesCard';
import { NaturalLanguageSearchCard } from '@/components/NaturalLanguageSearchCard';
import { AIFixModal } from '@/components/AIFixModal';
import { ConfirmationModal } from '@/components/ConfirmationModal';

export interface DataRow {
  [key: string]: string | number;
}

export interface ValidationError {
  row: number;
  column: string;
  error: string;
  suggestion?: string;
}

const Index = () => {
  const [clientsData, setClientsData] = useState<DataRow[]>([]);
  const [workersData, setWorkersData] = useState<DataRow[]>([]);
  const [tasksData, setTasksData] = useState<DataRow[]>([]);
  
  const [clientsErrors, setClientsErrors] = useState<ValidationError[]>([]);
  const [workersErrors, setWorkersErrors] = useState<ValidationError[]>([]);
  const [tasksErrors, setTasksErrors] = useState<ValidationError[]>([]);
  
  const [aiFixModal, setAIFixModal] = useState<{
    isOpen: boolean;
    row: number;
    column: string;
    currentValue: string;
    suggestion: string;
    dataType: 'clients' | 'workers' | 'tasks';
  } | null>(null);
  
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    message: string;
    affectedRows: number;
    onConfirm: () => void;
  } | null>(null);

  const handleDataUpload = (dataType: 'clients' | 'workers' | 'tasks', data: DataRow[]) => {
    switch (dataType) {
      case 'clients':
        setClientsData(data);
        break;
      case 'workers':
        setWorkersData(data);
        break;
      case 'tasks':
        setTasksData(data);
        break;
    }
  };

  const handleAIValidation = () => {
    // Simulate AI validation with some sample errors
    const sampleClientErrors: ValidationError[] = [
      { row: 0, column: 'email', error: 'Invalid email format', suggestion: 'john.doe@example.com' },
      { row: 2, column: 'phone', error: 'Invalid phone number', suggestion: '+1-555-0123' }
    ];
    setClientsErrors(sampleClientErrors);
    console.log('AI validation completed');
  };

  const handleAIFixClick = (row: number, column: string, dataType: 'clients' | 'workers' | 'tasks') => {
    const errors = dataType === 'clients' ? clientsErrors : 
                   dataType === 'workers' ? workersErrors : tasksErrors;
    const error = errors.find(e => e.row === row && e.column === column);
    
    if (error && error.suggestion) {
      const data = dataType === 'clients' ? clientsData : 
                   dataType === 'workers' ? workersData : tasksData;
      
      setAIFixModal({
        isOpen: true,
        row,
        column,
        currentValue: String(data[row][column]),
        suggestion: error.suggestion,
        dataType
      });
    }
  };

  const handleAIFixApply = () => {
    if (!aiFixModal) return;
    
    const { row, column, suggestion, dataType } = aiFixModal;
    
    if (dataType === 'clients') {
      const newData = [...clientsData];
      newData[row][column] = suggestion;
      setClientsData(newData);
      setClientsErrors(prev => prev.filter(e => !(e.row === row && e.column === column)));
    } else if (dataType === 'workers') {
      const newData = [...workersData];
      newData[row][column] = suggestion;
      setWorkersData(newData);
      setWorkersErrors(prev => prev.filter(e => !(e.row === row && e.column === column)));
    } else if (dataType === 'tasks') {
      const newData = [...tasksData];
      newData[row][column] = suggestion;
      setTasksData(newData);
      setTasksErrors(prev => prev.filter(e => !(e.row === row && e.column === column)));
    }
    
    setAIFixModal(null);
  };

  const handleNaturalLanguageModification = (command: string) => {
    const affectedRows = Math.floor(Math.random() * 10) + 1; // Simulate affected rows count
    
    setConfirmationModal({
      isOpen: true,
      message: `This modification will affect ${affectedRows} rows. Are you sure you want to proceed?`,
      affectedRows,
      onConfirm: () => {
        console.log('Applying modification:', command);
        setConfirmationModal(null);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <Header />
        
        <DataUploadSection onDataUpload={handleDataUpload} />
        
        <DataTablesSection
          clientsData={clientsData}
          workersData={workersData}
          tasksData={tasksData}
          clientsErrors={clientsErrors}
          workersErrors={workersErrors}
          tasksErrors={tasksErrors}
          onAIFixClick={handleAIFixClick}
        />
        
        <AIValidationCard onValidate={handleAIValidation} />
        
        <NaturalLanguageModificationCard onModify={handleNaturalLanguageModification} />
        
        <DefineRulesCard />
        
        <NaturalLanguageSearchCard />
      </div>
      
      {aiFixModal && (
        <AIFixModal
          isOpen={aiFixModal.isOpen}
          currentValue={aiFixModal.currentValue}
          suggestion={aiFixModal.suggestion}
          onApply={handleAIFixApply}
          onCancel={() => setAIFixModal(null)}
        />
      )}
      
      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          message={confirmationModal.message}
          onConfirm={confirmationModal.onConfirm}
          onCancel={() => setConfirmationModal(null)}
        />
      )}
    </div>
  );
};

export default Index;
