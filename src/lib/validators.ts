// src/lib/validators.ts

import { DataRow, ValidationError } from "@/pages/Index";

// Helper to check for required columns
const checkRequiredColumns = (data: DataRow[], requiredColumns: string[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (data.length === 0) return errors;

  const firstRow = data[0];
  const missingColumns = requiredColumns.filter(col => !(col in firstRow));

  if (missingColumns.length > 0) {
    // This error applies to the whole file, so we'll add it once without a specific row.
    // In a more advanced UI, this could be a file-level warning.
    // For now, we'll log it and you can decide how to display it.
    console.error(`Missing required columns: ${missingColumns.join(', ')}`);
    // Or, add an error to each row for visibility
    data.forEach((_, index) => {
        missingColumns.forEach(col => {
            errors.push({
                row: index,
                column: col,
                error: `Missing required column: ${col}`
            });
        })
    });
  }
  return errors;
}

// Function to check for duplicate IDs in a dataset
const findDuplicateIds = (data: DataRow[], idColumn: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const seenIds = new Map<string | number, number[]>();

  data.forEach((row, index) => {
    const id = row[idColumn];
    if (id === null || id === undefined || id === '') return;

    if (!seenIds.has(id)) {
      seenIds.set(id, []);
    }
    seenIds.get(id)!.push(index);
  });

  seenIds.forEach((indices, id) => {
    if (indices.length > 1) {
      indices.forEach(index => {
        errors.push({
          row: index,
          column: idColumn,
          error: `Duplicate ID: ${id}`,
        });
      });
    }
  });

  return errors;
};

// --- Main Validation Functions ---

export const validateClientsData = (data: DataRow[]): ValidationError[] => {
  let errors: ValidationError[] = [];

  // Check for required columns
  const required = ['ClientID', 'ClientName', 'PriorityLevel', 'RequestedTaskIDs', 'AttributesJSON'];
  errors = errors.concat(checkRequiredColumns(data, required));

  // Check for duplicate ClientIDs
  errors = errors.concat(findDuplicateIds(data, 'ClientID'));

  // Validate individual rows
  data.forEach((row, index) => {
    // Check for out-of-range values in PriorityLevel
    const priority = Number(row.PriorityLevel);
    if (row.PriorityLevel && !isNaN(priority) && (priority < 1 || priority > 5)) {
      errors.push({
        row: index,
        column: 'PriorityLevel',
        error: 'Priority must be between 1-5',
        suggestion: String(Math.max(1, Math.min(5, priority)))
      });
    }

    // Check for broken JSON in AttributesJSON
    try {
      JSON.parse(row.AttributesJSON as string);
    } catch (e) {
      errors.push({
        row: index,
        column: 'AttributesJSON',
        error: 'Invalid JSON format',
      });
    }
  });

  return errors;
};

export const validateWorkersData = (data: DataRow[]): ValidationError[] => {
  let errors: ValidationError[] = [];
  const required = ['WorkerID', 'WorkerName', 'Skills', 'AvailableSlots', 'MaxLoadPerPhase'];
  errors = errors.concat(checkRequiredColumns(data, required));
  errors = errors.concat(findDuplicateIds(data, 'WorkerID'));

  data.forEach((row, index) => {
    // Check for malformed list in AvailableSlots
    const slots = (row.AvailableSlots as string).replace(/[\[\]]/g, '').split(',').filter(s => s.trim() !== '');
    if (slots.some(slot => isNaN(Number(slot)))) {
        errors.push({
            row: index,
            column: 'AvailableSlots',
            error: 'AvailableSlots contains non-numeric values'
        })
    }
  });

  return errors;
};

export const validateTasksData = (data: DataRow[]): ValidationError[] => {
  let errors: ValidationError[] = [];
  const required = ['TaskID', 'TaskName', 'Category', 'Duration', 'RequiredSkills'];
  errors = errors.concat(checkRequiredColumns(data, required));
  errors = errors.concat(findDuplicateIds(data, 'TaskID'));

  // Add more task-specific validations here...

  return errors;
};