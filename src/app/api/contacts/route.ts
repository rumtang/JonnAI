import { NextResponse } from 'next/server';
import { parseCSVContacts, parseVCardContacts } from '@/lib/contacts/parser';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();

    let contacts;
    if (file.name.endsWith('.csv')) {
      contacts = parseCSVContacts(text);
    } else if (file.name.endsWith('.vcf') || file.name.endsWith('.vcard')) {
      contacts = parseVCardContacts(text);
    } else {
      return NextResponse.json({ error: 'Unsupported format. Use .csv or .vcf' }, { status: 400 });
    }

    return NextResponse.json({ contacts, count: contacts.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to parse file' }, { status: 500 });
  }
}
