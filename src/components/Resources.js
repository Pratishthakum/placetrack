import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationContext';
import { useToast } from '../context/ToastContext';
import { RESOURCE_SECTIONS } from '../data/resources';
import { COMPANIES, KIND_LABEL, TRACKS, TYPE_GUIDES, getCompanyPrep, inferTrack } from '../data/companyPrep';
import { Arrow, Bookmark, Book } from './FeatureIcons';
import { External, Search, Trash, Check } from './Icons';

const TABS = [
  ['company', 'Company prep kit'],
  ['type', 'Product vs Service'],
  ['hub', 'Free resource hub'],
  ['saved', 'My saved links'],
];

export default function Resources() {
  const toast = useToast();
  const { logout } = useAuth();
  const { applications, fetchApplications } = useApplications();
  const [params] = useSearchParams();

  const [tab, setTab] = useState('company');
  const [company, setCompany] = useState(params.get('company') || '');
  const [track, setTrack] = useState(() => (params.get('role') ? inferTrack(params.get('role')) : 'sde'));
  const [kind, setKind] = useState('product'); // which guide the "Product vs Service" tab shows
  const [saved, setSaved] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);

  useEffect(() => {
    fetchApplications().catch(() => {});
    // eslint-disable-next-line
  }, []);

  const guard = useCallback((err) => {
    if (err.status === 401) logout();
    return err;
  }, [logout]);

  useEffect(() => {
    api('/api/resources')
      .then(setSaved)
      .catch((err) => toast(guard(err).message, 'error'))
      .finally(() => setSavedLoading(false));
    // eslint-disable-next-line
  }, []);

  const savedUrls = useMemo(() => new Set(saved.map((s) => s.url)), [saved]);

  const saveLink = async ({ title, url, category = 'General', note = '' }) => {
    try {
      const doc = await api('/api/resources', { method: 'POST', body: { title, url, category, note } });
      setSaved((s) => [doc, ...s]);
      toast('Saved to My links');
      return true;
    } catch (err) {
      toast(guard(err).message, 'error');
      return false;
    }
  };

  const removeLink = async (id) => {
    try {
      await api(`/api/resources/${id}`, { method: 'DELETE' });
      setSaved((s) => s.filter((x) => x._id !== id));
    } catch (err) {
      toast(guard(err).message, 'error');
    }
  };

  return (
    <main className="dash resources">
      <div className="dash-head">
        <div>
          <h1>Prep resources</h1>
          <p className="muted">Free, hand-picked material so you do not have to google for it.</p>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            {label}{id === 'saved' && saved.length > 0 ? ` (${saved.length})` : ''}
          </button>
        ))}
      </div>

      {tab === 'company' && (
        <CompanyKit
          company={company}
          setCompany={setCompany}
          track={track}
          setTrack={setTrack}
          applications={applications}
          savedUrls={savedUrls}
          onSave={saveLink}
          onOpenGuide={(k) => { setKind(k); setTab('type'); }}
        />
      )}
      {tab === 'type' && (
        <TypeGuide
          kind={kind}
          setKind={setKind}
          savedUrls={savedUrls}
          onSave={saveLink}
          onOpenCompany={(c) => { setCompany(c); setTab('company'); }}
        />
      )}
      {tab === 'hub' && <Hub savedUrls={savedUrls} onSave={saveLink} />}
      {tab === 'saved' && <SavedLinks saved={saved} loading={savedLoading} onAdd={saveLink} onRemove={removeLink} />}
    </main>
  );
}

// One link row, with an optional "save" bookmark
function LinkRow({ link, savedUrls, onSave, category }) {
  const isSaved = savedUrls.has(link.url);
  return (
    <li className="link-row">
      <a href={link.url} target="_blank" rel="noreferrer">
        {link.title} <External width={13} height={13} />
      </a>
      {link.note && <small>{link.note}</small>}
      <button
        className={`icon-btn sm ${isSaved ? 'saved' : ''}`}
        disabled={isSaved}
        onClick={() => onSave({ title: link.title, url: link.url, category })}
        aria-label={isSaved ? 'Saved' : 'Save link'}
        title={isSaved ? 'Saved to My links' : 'Save to My links'}
      >
        {isSaved ? <Check width={15} height={15} /> : <Bookmark width={15} height={15} />}
      </button>
    </li>
  );
}

function CompanyKit({ company, setCompany, track, setTrack, applications, savedUrls, onSave, onOpenGuide }) {
  const name = company.trim();
  const [kindPick, setKindPick] = useState(''); // product/service picked by the user for companies we do not know
  const myCompanies = useMemo(() => [...new Set(applications.map((a) => a.company))], [applications]);
  const prep = name ? getCompanyPrep(name, '', track, kindPick || undefined) : null;

  const pick = (c) => {
    setCompany(c);
    const app = applications.find((a) => a.company === c);
    if (app) setTrack(inferTrack(app.role));
  };

  return (
    <div className="kit">
      <div className="kit-search">
        <label className="search">
          <Search />
          <input list="company-names" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Type a company, e.g. Amazon, TCS, Zomato" />
          <datalist id="company-names">{COMPANIES.map((c) => <option key={c.name} value={c.name} />)}</datalist>
        </label>
        <select value={track} onChange={(e) => setTrack(e.target.value)} aria-label="Role track" className="sort">
          {Object.entries(TRACKS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {myCompanies.length > 0 && (
        <div className="chips">
          {myCompanies.map((c) => (
            <button key={c} className={`chip ${name.toLowerCase() === c.toLowerCase() ? 'active' : ''}`} onClick={() => pick(c)}>{c}</button>
          ))}
        </div>
      )}

      {!prep ? (
        <div className="empty">
          <div className="empty-art">🎯</div>
          <h3>Pick a company to get its prep kit</h3>
          <p className="muted">Choose one of your applications above, or type any company. Not in our list? You still get the most commonly asked topics and free links.</p>
        </div>
      ) : (
        <>
          <section className="panel">
            <h2>
              {prep.entry ? prep.entry.name : name}
              {prep.entry && <span className={`kind-badge kind-${prep.kind}`}>{KIND_LABEL[prep.kind]}</span>}
            </h2>
            {!prep.entry && (
              <div className="kind-pick">
                <span className="muted">Campus company type:</span>
                {['product', 'service'].map((k) => (
                  <button key={k} className={`chip ${kindPick === k ? 'active' : ''}`} onClick={() => setKindPick(kindPick === k ? '' : k)}>{KIND_LABEL[k]}</button>
                ))}
              </div>
            )}
            {prep.entry ? (
              <>
                <p className="muted">{prep.entry.blurb}</p>
                <div className="two-col">
                  <div>
                    <h3>Typical process</h3>
                    <ul className="bullets">{prep.entry.rounds.map((r) => <li key={r}>{r}</li>)}</ul>
                  </div>
                  <div>
                    <h3>What to focus on</h3>
                    <ul className="bullets">{prep.entry.focus.map((r) => <li key={r}>{r}</li>)}</ul>
                  </div>
                </div>
                <p className="muted fine">Based on public interview experiences. Rounds change by year, role and campus, so trust the recruiter's email first.</p>
              </>
            ) : (
              <p className="muted">
                We do not have curated notes for {name} yet. Below are the topics asked most often across companies for this track, plus links to real {name} interview experiences.
              </p>
            )}
          </section>

          <section className="panel">
            <h2>Real questions & experiences for {prep.entry ? prep.entry.name : name}</h2>
            <ul className="linklist rows">
              {prep.links.direct.map((l) => <LinkRow key={l.url} link={l} savedUrls={savedUrls} onSave={onSave} category={`${name} prep`} />)}
              {prep.links.search.map((l) => <LinkRow key={l.url} link={l} savedUrls={savedUrls} onSave={onSave} category={`${name} prep`} />)}
            </ul>
            <p className="muted fine">"Pre-filtered search" opens a search already limited to that site, so it is one click instead of digging.</p>
          </section>

          {prep.mocks.length > 0 && (
            <section className="panel">
              <h2>Mock tests & previous papers</h2>
              <p className="muted">Practise in the same format as the real test.{prep.kind && ' These are the best free options for ' + KIND_LABEL[prep.kind].toLowerCase() + ' companies.'}</p>
              <ul className="linklist rows">
                {prep.mocks.map((l) => <LinkRow key={l.url + l.title} link={l} savedUrls={savedUrls} onSave={onSave} category={`${name} prep`} />)}
              </ul>
              {prep.kind && (
                <button className="btn btn-ghost btn-sm" onClick={() => onOpenGuide(prep.kind)}>
                  What do {KIND_LABEL[prep.kind].toLowerCase()} companies ask? <Arrow width={14} height={14} />
                </button>
              )}
            </section>
          )}

          <h2 className="kit-title"><Book width={18} height={18} /> Most commonly asked ({TRACKS[track]})</h2>
          <div className="topic-grid">
            {prep.topics.map((t) => (
              <section className="panel topic" key={t.id}>
                <h3>{t.title}</h3>
                <ul className="bullets">{t.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <ul className="linklist rows">
                  {t.links.map((l) => <LinkRow key={l.url} link={l} savedUrls={savedUrls} onSave={onSave} category={t.title.split(':')[0]} />)}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TypeGuide({ kind, setKind, savedUrls, onSave, onOpenCompany }) {
  const g = TYPE_GUIDES[kind];
  const examples = COMPANIES.filter((c) => c.kind === kind);

  return (
    <div className="type-guide">
      <div className="view-toggle big" role="group" aria-label="Company type">
        {['product', 'service'].map((k) => (
          <button key={k} className={kind === k ? 'active' : ''} aria-pressed={kind === k} onClick={() => setKind(k)}>{KIND_LABEL[k]}</button>
        ))}
      </div>

      <section className="panel">
        <h2>{g.title}</h2>
        <p className="muted">{g.examples}</p>
        <p>{g.blurb}</p>
        <div className="chips guide-companies">
          {examples.map((c) => <button key={c.name} className="chip" onClick={() => onOpenCompany(c.name)}>{c.name} prep kit</button>)}
        </div>
      </section>

      <h2 className="kit-title">What is most commonly asked</h2>
      <div className="topic-grid">
        {g.asked.map((a) => (
          <section className="panel topic" key={a.stage}>
            <h3>{a.stage}</h3>
            <ul className="bullets">{a.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </section>
        ))}
      </div>

      <h2 className="kit-title"><Book width={18} height={18} /> Free websites, skill by skill</h2>
      <div className="topic-grid">
        {g.prep.map((p) => (
          <section className="panel topic" key={p.title}>
            <h3>{p.title}</h3>
            <p className="muted">{p.desc}</p>
            <ul className="linklist rows">
              {p.links.map((l) => <LinkRow key={l.url} link={l} savedUrls={savedUrls} onSave={onSave} category={p.title} />)}
            </ul>
          </section>
        ))}
      </div>

      <section className="panel">
        <h2>Mock tests & real questions</h2>
        <p className="muted">Attempt these under a timer. They are the closest free match to the real tests and interviews.</p>
        <ul className="linklist rows">
          {g.mocks.map((l) => <LinkRow key={l.url} link={l} savedUrls={savedUrls} onSave={onSave} category="Mock tests" />)}
        </ul>
      </section>
    </div>
  );
}

function Hub({ savedUrls, onSave }) {
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('All');
  const tags = ['All', 'Hindi', 'Notes', 'Sheet', 'Videos', 'Practice'];

  const sections = RESOURCE_SECTIONS.map((s) => ({
    ...s,
    items: s.items.filter((i) => (tag === 'All' || i.tags.includes(tag)) && (!q.trim() || `${i.title} ${i.by} ${i.desc}`.toLowerCase().includes(q.trim().toLowerCase()))),
  })).filter((s) => s.items.length);

  return (
    <div>
      <div className="kit-search">
        <label className="search">
          <Search />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search resources, e.g. DBMS, Striver, SQL" />
        </label>
      </div>
      <div className="chips">
        {tags.map((t) => <button key={t} className={`chip ${tag === t ? 'active' : ''}`} onClick={() => setTag(t)}>{t}</button>)}
      </div>
      {sections.length === 0 && <div className="empty"><h3>No resources match</h3><p className="muted">Try a different search or tag.</p></div>}
      {sections.map((s) => (
        <section key={s.id} className="hub-section">
          <h2>{s.title}</h2>
          <p className="muted">{s.blurb}</p>
          <div className="res-grid">
            {s.items.map((i) => {
              const isSaved = savedUrls.has(i.url);
              return (
                <article className="res-card" key={i.url}>
                  <div className="res-top">
                    <a href={i.url} target="_blank" rel="noreferrer"><h3>{i.title}</h3></a>
                    <button className={`icon-btn sm ${isSaved ? 'saved' : ''}`} disabled={isSaved} onClick={() => onSave({ title: i.title, url: i.url, category: s.title.split(':')[0] })} aria-label={isSaved ? 'Saved' : 'Save link'} title={isSaved ? 'Saved to My links' : 'Save to My links'}>
                      {isSaved ? <Check width={15} height={15} /> : <Bookmark width={15} height={15} />}
                    </button>
                  </div>
                  <small className="muted">{i.by}</small>
                  <p>{i.desc}</p>
                  <div className="res-tags">{i.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function SavedLinks({ saved, loading, onAdd, onRemove }) {
  const [form, setForm] = useState({ title: '', url: '', category: '', note: '' });
  const [busy, setBusy] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const ok = await onAdd({ ...form, category: form.category.trim() || 'General' });
    setBusy(false);
    if (ok) setForm({ title: '', url: '', category: '', note: '' });
  };

  const groups = saved.reduce((acc, s) => {
    (acc[s.category || 'General'] = acc[s.category || 'General'] || []).push(s);
    return acc;
  }, {});

  return (
    <div>
      <form className="panel save-form" onSubmit={submit}>
        <h2>Save a link</h2>
        <div className="grid-2">
          <label className="field"><span>Title *</span><input name="title" value={form.title} onChange={onChange} placeholder="Amazon SDE-1 experience (Rahul)" required maxLength={120} /></label>
          <label className="field"><span>Link *</span><input name="url" type="url" value={form.url} onChange={onChange} placeholder="https://..." required /></label>
          <label className="field"><span>Category</span><input name="category" value={form.category} onChange={onChange} placeholder="DSA, Amazon, HR..." maxLength={40} /></label>
          <label className="field"><span>Note</span><input name="note" value={form.note} onChange={onChange} placeholder="Why it is useful" maxLength={300} /></label>
        </div>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save link'}</button>
      </form>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : saved.length === 0 ? (
        <div className="empty">
          <div className="empty-art">🔖</div>
          <h3>No saved links yet</h3>
          <p className="muted">Paste any useful link above, or tap the bookmark on any resource in the hub or a company kit.</p>
        </div>
      ) : (
        Object.entries(groups).map(([cat, list]) => (
          <section key={cat} className="hub-section">
            <h2>{cat}</h2>
            <ul className="saved-list">
              {list.map((s) => (
                <li key={s._id}>
                  <div>
                    <a href={s.url} target="_blank" rel="noreferrer">{s.title} <External width={13} height={13} /></a>
                    {s.note && <p className="muted">{s.note}</p>}
                  </div>
                  <button className="icon-btn sm danger" onClick={() => onRemove(s._id)} aria-label={`Remove ${s.title}`}><Trash width={15} height={15} /></button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
