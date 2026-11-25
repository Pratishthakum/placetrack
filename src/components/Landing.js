import { Link, Navigate } from 'react-router-dom';
import { APP_NAME, TAGLINE } from '../config';
import { useAuth } from '../context/AuthContext';
import { Target, Layers, Bell, Chart, Check } from './Icons';

const features = [
  { icon: <Layers />, title: 'One pipeline for everything', text: 'Wishlist to offer. Move every company through Applied, Online Test and Interview without losing track.' },
  { icon: <Bell />, title: 'Never miss a deadline', text: 'Deadlines are highlighted as they get close, so the OA link you forgot never costs you a shot.' },
  { icon: <Target />, title: 'Notes for every round', text: 'Keep topics, referrals, recruiter names and interview feedback attached to the company.' },
  { icon: <Chart />, title: 'See your progress', text: 'Live stats show how many applications are active, how many interviews you got and how many offers.' },
];

const steps = [
  ['Add an application', 'Company, role, CTC, deadline and a link to the job post.'],
  ['Update as you progress', 'Change the status in one click after every test or interview.'],
  ['Stay ahead', 'Filter, search and sort to decide what to prepare next.'],
];

function PreviewCard() {
  const rows = [
    ['G', 'Google', 'SDE Intern', 'Interview', 'interview', '#4285f4'],
    ['M', 'Microsoft', 'SDE-1', 'Online Test', 'test', '#00a4ef'],
    ['A', 'Adobe', 'MTS', 'Offer', 'offer', '#e5322d'],
  ];
  return (
    <div className="preview" aria-hidden="true">
      <div className="preview-head">
        <span>This week</span>
        <b>3 active</b>
      </div>
      {rows.map(([l, c, r, s, k, color]) => (
        <div className="preview-row" key={c}>
          <span className="company-badge" style={{ background: color }}>{l}</span>
          <div className="preview-text"><b>{c}</b><small>{r}</small></div>
          <span className={`pill pill-${k}`}>{s}</span>
        </div>
      ))}
      <div className="preview-bar">
        <i style={{ width: '20%' }} className="seg-applied" />
        <i style={{ width: '30%' }} className="seg-test" />
        <i style={{ width: '30%' }} className="seg-interview" />
        <i style={{ width: '20%' }} className="seg-offer" />
      </div>
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Built for placement season</span>
          <h1>
            Track every application.<br />
            <em>Land the offer.</em>
          </h1>
          <p className="lead">
            {APP_NAME} keeps your campus drives, off-campus applications, online tests and interviews in one clean dashboard, so you spend time preparing, not searching your inbox.
          </p>
          <div className="hero-cta">
            <Link to="/signup" className="btn btn-primary btn-lg">Start tracking free</Link>
            <Link to="/login" className="btn btn-outline btn-lg">I have an account</Link>
          </div>
          <ul className="hero-points">
            <li><Check /> No spreadsheets</li>
            <li><Check /> Deadline alerts</li>
            <li><Check /> Dark mode</li>
          </ul>
        </div>
        <PreviewCard />
      </section>

      <section className="section">
        <h2 className="section-title">Everything a placement hunt needs</h2>
        <p className="section-sub">{TAGLINE}</p>
        <div className="feature-grid">
          {features.map((f) => (
            <article className="feature" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">How it works</h2>
        <div className="steps">
          {steps.map(([t, d], i) => (
            <div className="step" key={t}>
              <span className="step-num">{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <h2>Your next offer letter starts with an organised list.</h2>
        <Link to="/signup" className="btn btn-light btn-lg">Create your free account</Link>
      </section>

      <footer className="footer">
        <span>{APP_NAME} · Built with React, Node, Express and MongoDB</span>
      </footer>
    </main>
  );
}
