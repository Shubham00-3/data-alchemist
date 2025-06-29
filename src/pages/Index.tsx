// src/pages/Index.tsx

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
import { validateClientsData, validateWorkersData, validateTasksData } from '@/lib/validators';
import { RuleRecommendationCard, Recommendation } from '@/components/RuleRecommendationCard';
import { toast } from "sonner";


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
  // Original Data State
  const [clientsData, setClientsData] = useState<DataRow[]>([]);
  const [workersData, setWorkersData] = useState<DataRow[]>([]);
  const [tasksData, setTasksData] = useState<DataRow[]>([]);

  // Filtered Data State (for search)
  const [filteredClientsData, setFilteredClientsData] = useState<DataRow[] | null>(null);
  const [filteredWorkersData, setFilteredWorkersData] = useState<DataRow[] | null>(null);
  const [filteredTasksData, setFilteredTasksData] = useState<DataRow[] | null>(null);

  // Error and Rule State
  const [clientsErrors, setClientsErrors] = useState<ValidationError[]>([]);
  const [workersErrors, setWorkersErrors] = useState<ValidationError[]>([]);
  const [tasksErrors, setTasksErrors] = useState<ValidationError[]>([]);
  const [rules, setRules] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);


  // Modal State
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
    onConfirm: () => void;
  } | null>(null);

  const handleDataUpload = (dataType: 'clients' | 'workers' | 'tasks', data: DataRow[]) => {
    switch (dataType) {
      case 'clients':
        setClientsData(data);
        setClientsErrors(validateClientsData(data));
        break;
      case 'workers':
        setWorkersData(data);
        setWorkersErrors(validateWorkersData(data));
        break;
      case 'tasks':
        setTasksData(data);
        setTasksErrors(validateTasksData(data));
        break;
    }
  };

  const handleAIValidation = () => {
    // Re-run all validators
    const clientErrors = validateClientsData(clientsData);
    const workerErrors = validateWorkersData(workersData);
    const taskErrors = validateTasksData(tasksData);
  
    setClientsErrors(clientErrors);
    setWorkersErrors(workerErrors);
    setTasksErrors(taskErrors);
  
    // Calculate total errors
    const totalErrors = clientErrors.length + workerErrors.length + taskErrors.length;
  
    // Show a toast notification!
    if (totalErrors > 0) {
      toast.error(`Validation complete. Found ${totalErrors} error(s).`);
    } else {
      toast.success("Validation complete. No errors found!");
    }
  };

  const handleAIFixClick = async (row: number, column: string, dataType: 'clients' | 'workers' | 'tasks') => {
    const errors = dataType === 'clients' ? clientsErrors :
                     dataType === 'workers' ? workersErrors : tasksErrors;
    const error = errors.find(e => e.row === row && e.column === column);
  
    const data = dataType === 'clients' ? clientsData :
                     dataType === 'workers' ? workersData : tasksData;
    const currentValue = String(data[row][column]);
  
    if (error) {
      try {
        // Step 1: Call the backend to get a real AI suggestion
        toast.info("Asking AI for a suggestion...");
        const response = await fetch('/api/get-suggestion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            column: error.column,
            error: error.error,
            currentValue: currentValue,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch AI suggestion.');
        }
  
        const { suggestion } = await response.json();
  
        // Step 2: If a suggestion is returned, open the modal with it
        if (suggestion) {
          setAIFixModal({
            isOpen: true,
            row,
            column,
            currentValue,
            suggestion, // Use the fetched suggestion
            dataType
          });
        } else {
          toast.warning("The AI couldn't find a suggestion for this error.");
        }
      } catch (e) {
        console.error(e);
        toast.error("Error contacting the AI suggestion service.");
      }
    }
  };

  const handleAIFixApply = () => {
    if (!aiFixModal) return;
    const { row, column, suggestion, dataType } = aiFixModal;
    let currentData, dataSetter, errorSetter, validator;

    switch (dataType) {
      case 'clients': [currentData, dataSetter, errorSetter, validator] = [[...clientsData], setClientsData, setClientsErrors, validateClientsData]; break;
      case 'workers': [currentData, dataSetter, errorSetter, validator] = [[...workersData], setWorkersData, setWorkersErrors, validateWorkersData]; break;
      case 'tasks': [currentData, dataSetter, errorSetter, validator] = [[...tasksData], setTasksData, setTasksErrors, validateTasksData]; break;
    }

    currentData[row][column] = suggestion;
    dataSetter(currentData);
    errorSetter(validator(currentData));
    setAIFixModal(null);
  };
  
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery) {
        setFilteredClientsData(null);
        setFilteredWorkersData(null);
        setFilteredTasksData(null);
        return;
    }

    const searchPromises = [
        fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataType: 'clients', searchQuery, data: clientsData }),
        }).then(res => res.json()),
        fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataType: 'workers', searchQuery, data: workersData }),
        }).then(res => res.json()),
        fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataType: 'tasks', searchQuery, data: tasksData }),
        }).then(res => res.json()),
    ];

    try {
        const [clientsResult, workersResult, tasksResult] = await Promise.all(searchPromises);
        setFilteredClientsData(clientsResult.data);
        setFilteredWorkersData(workersResult.data);
        setFilteredTasksData(tasksResult.data);
    } catch (error) {
        console.error("Search failed:", error);
    }
  };

  const handleAddRule = (rule: string) => setRules(prev => [...prev, rule]);

  const handleExportConfig = (config: any) => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rules.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = async (dataType: 'clients' | 'workers' | 'tasks') => {
    let dataToExport: DataRow[] = [];
    switch (dataType) {
      case 'clients': dataToExport = clientsData; break;
      case 'workers': dataToExport = workersData; break;
      case 'tasks': dataToExport = tasksData; break;
    }
  
    if (dataToExport.length === 0) {
      alert(`No ${dataType} data to export.`);
      return;
    }
  
    try {
      const response = await fetch('/api/export-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataToExport }),
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dataType}_cleaned.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const errorResult = await response.json();
        alert(`Failed to export data: ${errorResult.error}`);
      }
    } catch (error) {
        console.error('Export failed:', error);
        alert('An unexpected error occurred during export.');
    }
  };

  const handleNaturalLanguageModification = async (command: string) => {
    const dataType = 'clients';
    const data = clientsData;

    if (data.length === 0) {
        alert("Please upload client data before trying to modify it.");
        return;
    }

    try {
        const response = await fetch('/api/propose-modification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command, data, dataType }),
        });

        if (!response.ok) throw new Error("Failed to get a proposal from the AI.");

        const proposal = await response.json();

        if (!proposal.modifications || proposal.modifications.length === 0) {
            alert("The AI could not determine any modifications from your command. Please try rephrasing.");
            return;
        }

        setConfirmationModal({
            isOpen: true,
            message: proposal.summary,
            onConfirm: () => {
                let updatedData = [...data];
                proposal.modifications.forEach((mod: { rowIndex: number, column: string, newValue: string | number }) => {
                    if (updatedData[mod.rowIndex]) {
                        updatedData[mod.rowIndex][mod.column] = mod.newValue;
                    }
                });
                
                setClientsData(updatedData);
                setClientsErrors(validateClientsData(updatedData));
                setConfirmationModal(null);
            },
        });

    } catch (e) {
        console.error(e);
        alert("An error occurred while communicating with the AI.");
    }
  };

  const handleGetRecommendations = async () => {
    const dataType = 'clients';
    const data = clientsData;

    if (data.length === 0) {
        alert("Upload client data first to get recommendations.");
        return;
    }

    try {
        const response = await fetch('/api/recommend-rules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, dataType }),
        });
        if (!response.ok) throw new Error("AI recommendation service failed.");

        const result = await response.json();
        setRecommendations(result.recommendations || []);

    } catch (e) {
        console.error(e);
        alert("Failed to fetch rule recommendations from the AI.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <Header />
        <DataUploadSection onDataUpload={handleDataUpload} />
        <DataTablesSection
          clientsData={filteredClientsData ?? clientsData}
          workersData={filteredWorkersData ?? workersData}
          tasksData={filteredTasksData ?? tasksData}
          clientsErrors={clientsErrors}
          workersErrors={workersErrors}
          tasksErrors={tasksErrors}
          onAIFixClick={handleAIFixClick}
        />
        <AIValidationCard onValidate={handleAIValidation} />
        <NaturalLanguageModificationCard onModify={handleNaturalLanguageModification} />
        
        <RuleRecommendationCard
          recommendations={recommendations}
          onGetRecommendations={handleGetRecommendations}
          onApplyRecommendation={handleAddRule}
        />
        
        <DefineRulesCard 
          rules={rules} 
          onAddRule={handleAddRule} 
          onExportConfig={handleExportConfig} 
          onExportCsv={handleExportCsv}
        />
        <NaturalLanguageSearchCard onSearch={handleSearch} />
      </div>

      {aiFixModal && <AIFixModal isOpen={aiFixModal.isOpen} currentValue={aiFixModal.currentValue} suggestion={aiFixModal.suggestion} onApply={handleAIFixApply} onCancel={() => setAIFixModal(null)} />}
      {confirmationModal && <ConfirmationModal isOpen={confirmationModal.isOpen} message={confirmationModal.message} onConfirm={confirmationModal.onConfirm} onCancel={() => setConfirmationModal(null)} />}
    </div>
  );
};

export default Index;