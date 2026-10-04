import React, { useRef, useState } from 'react';
import { Brain, Cpu, Database, ExternalLink, ImagePlus, Info, Pencil, RotateCcw, ShieldCheck, SlidersHorizontal, Trash2, Upload, UserRound } from 'lucide-react';
import Modal from './Modal.jsx';
import Avatar from './Avatar.jsx';
import { correctionsEnabled, currencies, lengths, reasoning, roles, scenes, settingsDefaults, strictness, tones } from '../lib/config.js';
import { fileToAvatar } from '../lib/utils.js';

// The static pages live beside the app under the same base path.
const BASE = import.meta.env.BASE_URL;
const PAGES = { about: `${BASE}about`, terms: `${BASE}terms`, privacy: `${BASE}privacy` };

const sections = [
  { id: 'general', label: 'General', icon: <SlidersHorizontal size={15} /> },
  { id: 'model', label: 'Model & API', icon: <Cpu size={15} /> },
  { id: 'reasoning', label: 'Reasoning', icon: <Brain size={15} /> },
  { id: 'persona', label: 'Persona', icon: <UserRound size={15} /> },
  { id: 'account', label: 'Account', icon: <Pencil size={15} /> },
  { id: 'data', label: 'Data', icon: <Database size={15} /> },
  { id: 'about', label: 'About & legal', icon: <Info size={15} /> }
];

export default function SettingsModal({ settings, setSettings, account, setAccount, initialSection = 'general', onClose, onDataAction, notify }) {
  const [section, setSection] = useState(initialSection);
  const fileRef = useRef(null);
  const update = (key, value) => setSettings(s => ({ ...s, [key]: value }));
  // Old builds stored a separate `corrections` switch; treat that as "Off" too.
  const currentStrictness = correctionsEnabled(settings) ? settings.correctionStrictness || 'relaxed' : 'off';
  const setStrictness = key => setSettings(s => ({ ...s, correctionStrictness: key, corrections: key !== 'off' }));

  const pickAvatar = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await fileToAvatar(file);
      setAccount(a => ({ ...a, avatar: dataUrl }));
      notify('Avatar updated');
    } catch {
      notify('Could not read that image');
    }
  };

  const resetDefaults = () => {
    setSettings({ ...settingsDefaults });
    notify('Settings restored to defaults');
  };

  return (
    <Modal
      size="wide"
      fill
      eyebrow="SETTINGS"
      title="Make it yours."
      description="Everything here is a lasting preference — it applies to every conversation and is stored only in this browser."
      onClose={onClose}
      footer={
        <button className="save-btn" onClick={onClose}>
          Done
        </button>
      }
    >
      <div className="settings-layout">
        <nav className="settings-nav">
          {sections.map(item => (
            <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="settings-panel">
          {section === 'general' && (
            <Section title="General" note="Interface preferences.">
              <div className="setting-row">
                <div>
                  <b>Pricing currency</b>
                  <small>Used on the Usage &amp; pricing page</small>
                </div>
                <div className="segmented">
                  {Object.entries(currencies).map(([code, value]) => (
                    <button key={code} className={settings.currency === code ? 'selected' : ''} onClick={() => update('currency', code)}>
                      {value.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="setting-row">
                <div>
                  <b>Enter to send</b>
                  <small>Turn off to insert a line break instead</small>
                </div>
                <Toggle on={settings.enterToSend} onChange={value => update('enterToSend', value)} />
              </div>
              <div className="field-block">
                <div className="field-label">Corrections</div>
                <div className="segmented wide">
                  {Object.entries(strictness).map(([key, value]) => (
                    <button
                      key={key}
                      className={currentStrictness === key ? 'selected' : ''}
                      onClick={() => setStrictness(key)}
                    >
                      {value.label}
                    </button>
                  ))}
                </div>
                <p className="hint-line">{strictness[currentStrictness].hint}</p>
              </div>
              <div className="setting-row">
                <div>
                  <b>Collapse sidebar</b>
                  <small>Keep more room for the conversation</small>
                </div>
                <Toggle on={settings.sidebarCollapsed} onChange={value => update('sidebarCollapsed', value)} />
              </div>
            </Section>
          )}

          {section === 'model' && (
            <Section title="Model & API" note="Your key never leaves this browser.">
              <label className="stacked">
                API endpoint
                <input value={settings.endpoint} onChange={e => update('endpoint', e.target.value)} placeholder="https://api.deepseek.com" />
              </label>
              <div className="two-col">
                <label className="stacked">
                  Model
                  <input value={settings.model} onChange={e => update('model', e.target.value)} placeholder="deepseek-chat" />
                </label>
                <label className="stacked">
                  Temperature
                  <input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.temperature}
                    onChange={e => update('temperature', Number(e.target.value))}
                  />
                </label>
              </div>
              <label className="stacked">
                API key
                <input type="password" placeholder="sk-…" value={settings.key} onChange={e => update('key', e.target.value)} />
              </label>
              <p className="hint-line">Without a key the app runs in demo mode with canned replies.</p>
            </Section>
          )}

          {section === 'reasoning' && (
            <Section title="Reasoning" note="How hard the model thinks before answering. Hidden from the conversation.">
              <div className="field-block">
                <div className="field-label">Reasoning depth</div>
                <div className="segmented wide">
                  {Object.entries(reasoning).map(([key, value]) => (
                    <button key={key} className={settings.reasoning === key ? 'selected' : ''} onClick={() => update('reasoning', key)}>
                      {value.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="two-col">
                <label className="stacked">
                  Default tone
                  <select value={settings.defaultTone} onChange={e => update('defaultTone', e.target.value)}>
                    {Object.entries(tones).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="stacked">
                  Default reply length
                  <select value={settings.defaultLength} onChange={e => update('defaultLength', e.target.value)}>
                    {Object.entries(lengths).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </Section>
          )}

          {section === 'persona' && (
            <Section title="Persona" note="Defaults applied when you start a new conversation.">
              <label className="stacked">
                Partner name
                <input value={settings.personaName} onChange={e => update('personaName', e.target.value)} placeholder="Alex" />
              </label>
              <div className="two-col">
                <label className="stacked">
                  Default role
                  <select value={settings.defaultRole} onChange={e => update('defaultRole', e.target.value)}>
                    {Object.entries(roles).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="stacked">
                  Default scene
                  <select value={settings.defaultScene} onChange={e => update('defaultScene', e.target.value)}>
                    {Object.entries(scenes).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </Section>
          )}

          {section === 'account' && (
            <Section title="Account" note="Local only — no sign-in, no server.">
              <div className="account-editor">
                <div className="avatar-stack">
                  <Avatar account={account} size={64} />
                  <button className="outline-btn tiny" onClick={() => fileRef.current?.click()}>
                    <Upload size={13} /> Upload
                  </button>
                  {account.avatar && (
                    <button className="link-btn" onClick={() => setAccount(a => ({ ...a, avatar: '' }))}>
                      Remove
                    </button>
                  )}
                </div>
                <div className="account-fields">
                  <label className="stacked">
                    Display name
                    <input
                      value={account.name}
                      maxLength={24}
                      onChange={e => setAccount(a => ({ ...a, name: e.target.value }))}
                      placeholder="user"
                    />
                  </label>
                  <p className="hint-line">
                    <ImagePlus size={13} /> With no picture, your avatar shows the first character of your name.
                  </p>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickAvatar} />
            </Section>
          )}

          {section === 'data' && (
            <Section title="Data" note="Everything is stored in this browser. Clearing cannot be undone.">
              <div className="setting-row">
                <div>
                  <b>Delete all conversations</b>
                  <small>Start from a clean slate</small>
                </div>
                <button className="outline-btn danger" onClick={() => onDataAction('conversations')}>
                  <Trash2 size={14} /> Clear
                </button>
              </div>
              <div className="setting-row">
                <div>
                  <b>Clear word bank</b>
                  <small>Remove saved words and progress</small>
                </div>
                <button className="outline-btn danger" onClick={() => onDataAction('words')}>
                  <Trash2 size={14} /> Clear
                </button>
              </div>
              <div className="setting-row">
                <div>
                  <b>Reset usage statistics</b>
                  <small>Token counters and estimated spend</small>
                </div>
                <button className="outline-btn" onClick={() => onDataAction('usage')}>
                  <RotateCcw size={14} /> Reset
                </button>
              </div>
              <div className="setting-row">
                <div>
                  <b>Restore default settings</b>
                  <small>Keeps your conversations</small>
                </div>
                <button className="outline-btn" onClick={resetDefaults}>
                  <RotateCcw size={14} /> Restore
                </button>
              </div>
            </Section>
          )}

          {section === 'about' && (
            <Section title="About & legal" note="Opens in a new tab.">
              <div className="setting-row">
                <div>
                  <b>What is DeepTalk?</b>
                  <small>Features, model support and pricing</small>
                </div>
                <a className="outline-btn" href={PAGES.about} target="_blank" rel="noreferrer">
                  Open <ExternalLink size={14} />
                </a>
              </div>
              <div className="setting-row">
                <div>
                  <b>Terms of Service</b>
                  <small>How the app may be used</small>
                </div>
                <a className="outline-btn" href={PAGES.terms} target="_blank" rel="noreferrer">
                  View <ExternalLink size={14} />
                </a>
              </div>
              <div className="setting-row">
                <div>
                  <b>Privacy Policy</b>
                  <small>What data is touched, and where it goes</small>
                </div>
                <a className="outline-btn" href={PAGES.privacy} target="_blank" rel="noreferrer">
                  View <ExternalLink size={14} />
                </a>
              </div>
              <p className="hint-line">
                <ShieldCheck size={13} /> DeepTalk has no backend — nothing you type is stored on a server. The full details are in the privacy policy.
              </p>
            </Section>
          )}
        </div>
      </div>
    </Modal>
  );
}

function Section({ title, note, children }) {
  return (
    <div className="settings-section">
      <div className="section-head">
        <b>{title}</b>
        <small>{note}</small>
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button className={'toggle' + (on ? ' on' : '')} onClick={() => onChange(!on)} aria-pressed={on}>
      <i />
    </button>
  );
}
