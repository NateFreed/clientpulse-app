import { supabase } from './supabase';

export interface CSVParseResult {
  columns: string[];
  rows: Record<string, string | number>[];
  rowCount: number;
}

/**
 * Parse a CSV file into structured data.
 * Auto-detects numeric columns and converts values.
 */
export function parseCSV(text: string): CSVParseResult {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return { columns: [], rows: [], rowCount: 0 };

  const columns = parseCSVLine(lines[0]).map(c => c.trim());
  const rows: Record<string, string | number>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== columns.length) continue;

    const row: Record<string, string | number> = {};
    for (let j = 0; j < columns.length; j++) {
      const val = values[j].trim();
      // Try to parse as number (strip currency symbols and commas)
      const cleaned = val.replace(/[$€£,]/g, '');
      const num = Number(cleaned);
      row[columns[j]] = !isNaN(num) && cleaned !== '' ? num : val;
    }
    rows.push(row);
  }

  return { columns, rows, rowCount: rows.length };
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }
  fields.push(current);
  return fields;
}

/**
 * Import parsed CSV data into Supabase for a client's dashboard.
 */
export async function importCSVData(
  clientId: string,
  sourceName: string,
  columns: string[],
  rows: Record<string, string | number>[]
): Promise<{ importId: string; rowCount: number }> {
  // Create the data import record
  const { data: importRecord, error: importError } = await supabase
    .from('cp_data_imports')
    .insert({
      client_id: clientId,
      source_type: 'csv',
      source_name: sourceName,
      columns,
      row_count: rows.length,
    })
    .select()
    .single();

  if (importError) throw importError;

  // Insert data rows in batches of 100
  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize).map(row => ({
      import_id: importRecord.id,
      data: row,
    }));

    const { error: rowError } = await supabase.from('cp_data_rows').insert(batch);
    if (rowError) throw rowError;
  }

  return { importId: importRecord.id, rowCount: rows.length };
}

/**
 * Detect column types for widget configuration.
 */
export function detectColumnTypes(columns: string[], rows: Record<string, string | number>[]): Record<string, 'number' | 'string' | 'date'> {
  const types: Record<string, 'number' | 'string' | 'date'> = {};

  for (const col of columns) {
    const values = rows.map(r => r[col]).filter(v => v !== '' && v !== null && v !== undefined);
    if (values.length === 0) {
      types[col] = 'string';
      continue;
    }

    const numericCount = values.filter(v => typeof v === 'number').length;
    const dateCount = values.filter(v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v as string)).length;

    if (numericCount > values.length * 0.7) {
      types[col] = 'number';
    } else if (dateCount > values.length * 0.7) {
      types[col] = 'date';
    } else {
      types[col] = 'string';
    }
  }

  return types;
}
