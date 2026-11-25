import { useEffect, useState } from 'react';
import { STATUSES, TYPES } from '../config';
import { toInputDate } from '../utils';
import { Close } from './Icons';

const EMPTY = { company: '', role: '', status: 'Applied', type: 'Full-time', location: '', ctc: '', deadline: '', link: '', notes: '' };

export default function ApplicationModal({ initial, onClose, onSave }) {
  const editing = !!initial;
  const [form, setForm] = useState(
    initial ? { ...EMPTY, ...initial, deadline: toInputDate(initial.deadline) } : EMPTY
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onSave({ ...form, deadline: form.deadline || null });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-label={editing ? 'Edit application' : 'New application'}>
        <header className="modal-head">
          <h2>{editing ? 'Edit application' : 'New application'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><Close /></button>
        </header>

        <div className="modal-body">
          {error && <div className="form-error">{error}</div>}
          <div className="grid-2">
            <label className="field"><span>Company *</span><input name="company" value={form.company} onChange={onChange} placeholder="Google" required autoFocus /></label>
            <label className="field"><span>Role *</span><input name="role" value={form.role} onChange={onChange} placeholder="Software Engineer" required /></label>
            <label className="field"><span>Status</span>
              <select name="status" value={form.status} onChange={onChange}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            </label>
            <label className="field"><span>Job type</span>
              <select name="type" value={form.type} onChange={onChange}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            </label>
            <label className="field"><span>Location</span><input name="location" value={form.location} onChange={onChange} placeholder="Bengaluru / Remote" /></label>
            <label className="field"><span>CTC / Stipend</span><input name="ctc" value={form.ctc} onChange={onChange} placeholder="12 LPA or 40k/month" /></label>
            <label className="field"><span>Next deadline</span><input type="date" name="deadline" value={form.deadline} onChange={onChange} /></label>
            <label className="field"><span>Job post link</span><input type="url" name="link" value={form.link} onChange={onChange} placeholder="https://..." /></label>
          </div>
          <label className="field"><span>Notes</span>
            <textarea name="notes" rows={3} value={form.notes} onChange={onChange} placeholder="Referral, topics to revise, recruiter name, interview feedback..." />
          </label>
        </div>

        <footer className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving...' : editing ? 'Save changes' : 'Add application'}</button>
        </footer>
      </form>
    </div>
  );
}
