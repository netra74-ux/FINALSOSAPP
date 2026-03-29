import { useState } from 'react';
import { UserPlus, Info } from 'lucide-react';
import type { EmergencyContact } from '~/data/mock-data';
import { ContactCard } from '~/components/contact-card/contact-card';
import { AddContactForm } from '~/components/add-contact-form/add-contact-form';
import styles from './tab-contacts.module.css';

interface TabContactsProps {
  contacts: EmergencyContact[];
  onAdd: (contact: { name: string; phone: string; relation: string }) => void;
  onRemove: (id: string) => void;
}

export function TabContacts({ contacts, onAdd, onRemove }: TabContactsProps) {
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (contact: { name: string; phone: string; relation: string }) => {
    onAdd(contact);
    setShowForm(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>Contacts ({contacts.length})</div>
        {!showForm && (
          <button className={styles.addBtn} onClick={() => setShowForm(true)} type="button">
            <UserPlus size={14} /> Add
          </button>
        )}
      </div>

      {showForm && (
        <AddContactForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      <div className={styles.infoBox}>
        <Info size={16} className={styles.infoIcon} />
        <span>
          All {contacts.length} contacts will receive an SMS with your name, live location link, and a Google Maps
          link when SOS is triggered.
        </span>
      </div>

      {contacts.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>👥</div>
          <div className={styles.emptyText}>
            No emergency contacts added yet.<br />Add at least one contact to use SOS alerts.
          </div>
        </div>
      ) : (
        <div className={styles.list}>
          {contacts.map((c) => (
            <ContactCard key={c.id} contact={c} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
