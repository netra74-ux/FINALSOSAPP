import { useState, useCallback } from 'react';
import type { EmergencyContact } from '~/data/mock-data';
import { MOCK_CONTACTS } from '~/data/mock-data';

export function useContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(MOCK_CONTACTS);

  const addContact = useCallback((contact: Omit<EmergencyContact, 'id' | 'avatar'>) => {
    const initials = contact.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const newContact: EmergencyContact = {
      id: `c-${Date.now()}`,
      avatar: initials,
      ...contact,
    };
    setContacts((prev) => [...prev, newContact]);
  }, []);

  const removeContact = useCallback((id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateContact = useCallback((id: string, updates: Partial<EmergencyContact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  return { contacts, addContact, removeContact, updateContact };
}
