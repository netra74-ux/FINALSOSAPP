import { useState } from 'react';
import styles from './add-contact-form.module.css';

interface AddContactFormProps {
  onAdd: (contact: { name: string; phone: string; relation: string }) => void;
  onCancel: () => void;
}

export function AddContactForm({ onAdd, onCancel }: AddContactFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onAdd({ name: name.trim(), phone: phone.trim(), relation: relation.trim() || 'Contact' });
    setName('');
    setPhone('');
    setRelation('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.title}>Add Emergency Contact</div>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>Full Name *</label>
          <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Phone Number *</label>
          <input className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" type="tel" required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Relation</label>
          <input className={styles.input} value={relation} onChange={e => setRelation(e.target.value)} placeholder="Spouse, Parent, Doctor..." />
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnSecondary} type="button" onClick={onCancel}>Cancel</button>
        <button className={styles.btnPrimary} type="submit">Add Contact</button>
      </div>
    </form>
  );
}
