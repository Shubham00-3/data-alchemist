
import React from 'react';
import { DataRow, ValidationError } from '@/pages/Index';

interface DataTablesSectionProps {
  clientsData: DataRow[];
  workersData: DataRow[];
  tasksData: DataRow[];
  clientsErrors: ValidationError[];
  workersErrors: ValidationError[];
  tasksErrors: ValidationError[];
  onAIFixClick: (row: number, column: string, dataType: 'clients' | 'workers' | 'tasks') => void;
}

export const DataTablesSection = ({
  clientsData,
  workersData,
  tasksData,
  clientsErrors,
  workersErrors,
  tasksErrors,
  onAIFixClick
}: DataTablesSectionProps) => {
  const DataTable = ({ 
    title, 
    data, 
    errors, 
    dataType 
  }: { 
    title: string; 
    data: DataRow[]; 
    errors: ValidationError[];
    dataType: 'clients' | 'workers' | 'tasks';
  }) => {
    if (data.length === 0) {
      return (
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">{title}</h3>
          <div className="text-slate-400 text-center py-8">No data loaded</div>
        </div>
      );
    }

    const headers = Object.keys(data[0]);
    const hasError = (rowIndex: number, column: string) => 
      errors.some(e => e.row === rowIndex && e.column === column);

    return (
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-medium mb-4">{title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600">
                {headers.map(header => (
                  <th key={header} className="text-left p-2 text-slate-300 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-slate-700/50">
                  {headers.map(column => (
                    <td key={column} className="p-2 relative">
                      <div className={`relative ${hasError(rowIndex, column) ? 'border-2 border-red-500 rounded px-2 py-1' : ''}`}>
                        {String(row[column])}
                        {hasError(rowIndex, column) && (
                          <button
                            onClick={() => onAIFixClick(rowIndex, column, dataType)}
                            className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded hover:bg-blue-600 transition-colors"
                          >
                            AI
                          </button>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <DataTable title="Clients" data={clientsData} errors={clientsErrors} dataType="clients" />
      <DataTable title="Workers" data={workersData} errors={workersErrors} dataType="workers" />
      <DataTable title="Tasks" data={tasksData} errors={tasksErrors} dataType="tasks" />
    </div>
  );
};
