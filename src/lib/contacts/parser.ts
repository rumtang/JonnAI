import { ParsedContact } from '../graph/types';

export function parseCSVContacts(csvText: string): ParsedContact[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  const nameIdx = headers.findIndex(h => h.includes('name') && !h.includes('last') && !h.includes('first'));
  const firstNameIdx = headers.findIndex(h => h.includes('first'));
  const lastNameIdx = headers.findIndex(h => h.includes('last'));
  const emailIdx = headers.findIndex(h => h.includes('email'));
  const phoneIdx = headers.findIndex(h => h.includes('phone'));
  const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('role') || h.includes('position'));
  const companyIdx = headers.findIndex(h => h.includes('company') || h.includes('org'));

  return lines.slice(1).filter(line => line.trim()).map(line => {
    const fields = parseCSVLine(line);
    let name = '';
    if (nameIdx >= 0) {
      name = fields[nameIdx] || '';
    } else if (firstNameIdx >= 0 || lastNameIdx >= 0) {
      const first = firstNameIdx >= 0 ? fields[firstNameIdx] || '' : '';
      const last = lastNameIdx >= 0 ? fields[lastNameIdx] || '' : '';
      name = `${first} ${last}`.trim();
    }

    return {
      name: name || 'Unknown',
      email: emailIdx >= 0 ? fields[emailIdx] : undefined,
      phone: phoneIdx >= 0 ? fields[phoneIdx] : undefined,
      title: titleIdx >= 0 ? fields[titleIdx] : undefined,
      company: companyIdx >= 0 ? fields[companyIdx] : undefined,
    };
  }).filter(c => c.name !== 'Unknown');
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseVCardContacts(vcardText: string): ParsedContact[] {
  const cards = vcardText.split('BEGIN:VCARD').filter(c => c.trim());

  return cards.map(card => {
    const lines = card.split('\n').map(l => l.trim());

    let name = '';
    let email: string | undefined;
    let phone: string | undefined;
    let title: string | undefined;
    let company: string | undefined;

    for (const line of lines) {
      if (line.startsWith('FN:') || line.startsWith('FN;')) {
        name = line.split(':').slice(1).join(':').trim();
      } else if (line.startsWith('EMAIL') && line.includes(':')) {
        email = line.split(':').slice(1).join(':').trim();
      } else if (line.startsWith('TEL') && line.includes(':')) {
        phone = line.split(':').slice(1).join(':').trim();
      } else if (line.startsWith('TITLE:')) {
        title = line.split(':').slice(1).join(':').trim();
      } else if (line.startsWith('ORG:')) {
        company = line.split(':').slice(1).join(':').trim().replace(/;/g, ', ');
      }
    }

    return { name, email, phone, title, company };
  }).filter(c => c.name);
}
