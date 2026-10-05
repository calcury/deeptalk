import React from 'react';
import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react';

// First-run screen. It replaces the whole workspace until there is at least one conversation,
// so a brand-new visitor is never dropped into an empty chat. Deleting every conversation
// brings it back — the gate is simply `conversations.length === 0`.
export default function Onboarding({ settings, setSettings, onPick, onOpenSettings }) {
  const ready = !!(settings.key || '').trim();

  return (
    <div className="onboarding">
      <div className="onboarding-card">
        <div className="onboarding-brand">
          <span className="brand-mark" aria-hidden="true">
            D
          </span>
          <b>DeepTalk</b>
        </div>

        <h1>Let’s get you talking.</h1>
        <p className="onboarding-lede">
          Two steps and you are in. Your key and your conversations stay in this browser — there is no account and no server.
        </p>

        <div className={'ob-step' + (ready ? ' done' : '')}>
          <span className="ob-step-num">{ready ? <Check size={12} /> : '1'}</span>
          <div className="ob-step-body">
            <b>Add your API key</b>
            <small>The endpoint already points at DeepSeek — paste the key and you are done.</small>
            <div className="ob-input-wrap">
              <input
                type="password"
                value={settings.key}
                onChange={e => setSettings(s => ({ ...s, key: e.target.value }))}
                placeholder="sk-…"
                aria-label="API key"
              />
              <span className={'ob-check' + (ready ? ' ok' : '')} title={ready ? 'Key ready' : 'No key yet'}>
                <Check size={14} />
              </span>
            </div>
          </div>
        </div>

        <div className="ob-step">
          <span className="ob-step-num">2</span>
          <div className="ob-step-body">
            <b>Pick a role and start</b>
            <small>Choose who you are talking to and what about — classmate, teacher, doctor and more. Both can be changed at any time.</small>
            <button className="ob-primary" onClick={onPick}>
              Start talking <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {ready ? (
          <p className="ob-note">
            <ShieldCheck size={14} />
            <span>The key is stored in this browser only. Clearing browser data removes it.</span>
          </p>
        ) : (
          <p className="ob-note">
            <Sparkles size={14} />
            <span>You can set everything up now, but the assistant needs a key before it can reply — without one you will get an error instead of an answer.</span>
          </p>
        )}

        <p className="ob-settings">
          <button onClick={onOpenSettings}>Model &amp; API settings</button>
        </p>
      </div>
    </div>
  );
}
