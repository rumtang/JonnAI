'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUIStore } from '@/lib/store/ui-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { parseCSVContacts, parseVCardContacts } from '@/lib/contacts/parser';
import { ParsedContact } from '@/lib/graph/types';
import { Upload, UserPlus, Check } from 'lucide-react';

const ROLES = [
  'CMO', 'VP Marketing', 'Content Director', 'Analytics Lead', 'Brand Manager',
  'Social Media Manager', 'Email Specialist', 'SEO Specialist', 'Paid Media Manager',
  'Marketing Ops', 'Product Marketing', 'Creative Director', 'PR Manager',
  'Community Manager', 'Growth Lead', 'Content Strategist', 'Data Analyst',
];

const DEPARTMENTS = [
  'Executive', 'Content', 'Analytics', 'Brand', 'Growth',
  'Operations', 'Product', 'Communications', 'Creative',
];

const HUMAN_ROLES = [
  'Context Curator', 'Strategist', 'Escalation Point',
  'Culture Guardian', 'Data Steward', 'Experience Architect',
];

interface ContactWithRole extends ParsedContact {
  selected: boolean;
  role: string;
  department: string;
  humanRoleEvolution: string;
}

export default function ContactImporter() {
  const { contactImporterOpen, closeContactImporter } = useUIStore();
  // addPersonNode was removed in the content-production-graph refactor.
  // This component is unused; keeping for potential future re-integration.
  const _graphStore = useGraphStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contacts, setContacts] = useState<ContactWithRole[]>([]);
  const [step, setStep] = useState<'upload' | 'assign'>('upload');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    let parsed: ParsedContact[] = [];

    if (file.name.endsWith('.csv')) {
      parsed = parseCSVContacts(text);
    } else if (file.name.endsWith('.vcf') || file.name.endsWith('.vcard')) {
      parsed = parseVCardContacts(text);
    }

    if (parsed.length > 0) {
      setContacts(parsed.map(c => ({
        ...c,
        selected: true,
        role: c.title || ROLES[0],
        department: DEPARTMENTS[0],
        humanRoleEvolution: HUMAN_ROLES[0],
      })));
      setStep('assign');
    }
  };

  const handleAddContacts = () => {
    const selected = contacts.filter(c => c.selected);
    // TODO: Re-implement for new type system if contact import is re-enabled.
    // selected.forEach(c => { ... });
    closeContactImporter();
    setContacts([]);
    setStep('upload');
  };

  const handleClose = () => {
    closeContactImporter();
    setContacts([]);
    setStep('upload');
  };

  const updateContact = (index: number, field: keyof ContactWithRole, value: string | boolean) => {
    setContacts(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  return (
    <Dialog open={contactImporterOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-[#0a0a1a] border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Import Contacts</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add real people from your contacts to the organizational knowledge graph.
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="flex flex-col items-center gap-6 py-8">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-cyan-500/30 transition-colors"
            >
              <Upload className="w-10 h-10 text-slate-500" />
              <p className="text-sm text-slate-300">Click to upload a CSV or vCard file</p>
              <p className="text-xs text-slate-500">Supported: .csv, .vcf, .vcard</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.vcf,.vcard"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {step === 'assign' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Found {contacts.length} contacts. Select which to add and assign roles:
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {contacts.map((contact, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border transition-colors ${
                    contact.selected
                      ? 'border-cyan-500/20 bg-cyan-500/5'
                      : 'border-white/5 bg-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateContact(i, 'selected', !contact.selected)}
                        className={`w-5 h-5 rounded border flex items-center justify-center ${
                          contact.selected
                            ? 'bg-cyan-500 border-cyan-500'
                            : 'border-white/20'
                        }`}
                      >
                        {contact.selected && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <span className="text-sm font-medium text-slate-200">{contact.name}</span>
                    </div>
                    {contact.email && (
                      <span className="text-xs text-slate-500">{contact.email}</span>
                    )}
                  </div>

                  {contact.selected && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>
                        <Label className="text-xs text-slate-500">Role</Label>
                        <select
                          value={contact.role}
                          onChange={e => updateContact(i, 'role', e.target.value)}
                          className="w-full mt-1 px-2 py-1.5 rounded bg-black/40 border border-white/10 text-xs text-slate-200 outline-none"
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500">Department</Label>
                        <select
                          value={contact.department}
                          onChange={e => updateContact(i, 'department', e.target.value)}
                          className="w-full mt-1 px-2 py-1.5 rounded bg-black/40 border border-white/10 text-xs text-slate-200 outline-none"
                        >
                          {DEPARTMENTS.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500">Future Role</Label>
                        <select
                          value={contact.humanRoleEvolution}
                          onChange={e => updateContact(i, 'humanRoleEvolution', e.target.value)}
                          className="w-full mt-1 px-2 py-1.5 rounded bg-black/40 border border-white/10 text-xs text-slate-200 outline-none"
                        >
                          {HUMAN_ROLES.map(h => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <Button variant="ghost" onClick={() => setStep('upload')} className="text-slate-400">
                Back
              </Button>
              <Button
                onClick={handleAddContacts}
                className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/20"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add {contacts.filter(c => c.selected).length} Contacts
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
