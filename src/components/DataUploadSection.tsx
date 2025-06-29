
import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { DataRow } from '@/pages/Index';

interface DataUploadSectionProps {
  onDataUpload: (dataType: 'clients' | 'workers' | 'tasks', data: DataRow[]) => void;
}

export const DataUploadSection = ({ onDataUpload }: DataUploadSectionProps) => {
  const clientsInputRef = useRef<HTMLInputElement>(null);
  const workersInputRef = useRef<HTMLInputElement>(null);
  const tasksInputRef = useRef<HTMLInputElement>(null);

  const [uploadStatus, setUploadStatus] = React.useState<{
    clients?: number;
    workers?: number;
    tasks?: number;
  }>({});

  const parseCSV = (csvText: string): DataRow[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: DataRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
  };

  // src/components/DataUploadSection.tsx

const handleFileUpload = async (dataType: 'clients' | 'workers' | 'tasks', file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('dataType', dataType);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    onDataUpload(dataType, data.data);
    setUploadStatus(prev => ({ ...prev, [dataType]: data.data.length }));

  } catch (error) {
    console.error('Error uploading file:', error);
    // You can add a user-facing error message here
  }
};

  const FileUploader = ({ 
    type, 
    inputRef, 
    title 
  }: { 
    type: 'clients' | 'workers' | 'tasks'; 
    inputRef: React.RefObject<HTMLInputElement>;
    title: string;
  }) => (
    <div className="flex-1">
      <h3 className="text-lg font-medium mb-4 text-center">{title}</h3>
      <div
        className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500 transition-colors bg-slate-800/30"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(type, file);
          }}
        />
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        {uploadStatus[type] ? (
          <div className="text-green-400 font-medium">
            {uploadStatus[type]} {title} records loaded
          </div>
        ) : (
          <div className="text-slate-400">
            Drop your {title.toLowerCase()} CSV file here or click to browse
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Upload Your Data Files</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FileUploader type="clients" inputRef={clientsInputRef} title="Clients" />
        <FileUploader type="workers" inputRef={workersInputRef} title="Workers" />
        <FileUploader type="tasks" inputRef={tasksInputRef} title="Tasks" />
      </div>
    </div>
  );
};
