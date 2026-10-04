import React, { useState } from 'react';
import { Bot, GraduationCap, MessageCircle, Plus, Sparkles, Users } from 'lucide-react';
import Modal from './Modal.jsx';
import { roles, scenes, tones, lengths } from '../lib/config.js';

const roleIcons = { classmate: <Users size={17} />, teacher: <GraduationCap size={17} />, friend: <MessageCircle size={17} />, interviewer: <Bot size={17} /> };

export default function NewConversationModal({ initialProfile, onClose, onCreate }) {
  const [profile, setProfile] = useState(initialProfile);
  const update = (key, value) => setProfile(current => ({ ...current, [key]: value }));

  return (
    <Modal
      eyebrow="NEW CONVERSATION"
      title="Choose your roleplay."
      description="Pick who you are talking to and what you want to chat about. Each conversation keeps its own roleplay settings and history."
      onClose={onClose}
      footer={
        <button className="save-btn" onClick={() => onCreate(profile)}>
          Create conversation <Plus size={16} />
        </button>
      }
    >
      <div className="field-block">
        <div className="field-label">Who are you talking to?</div>
        <div className="option-grid">
          {Object.entries(roles).map(([key, value]) => (
            <button key={key} className={'option-card' + (profile.role === key ? ' selected' : '')} onClick={() => update('role', key)}>
              <span className="option-icon">{roleIcons[key]}</span>
              <b>{value.label}</b>
              <small>{value.hint}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="field-block">
        <div className="field-label">What do you want to talk about?</div>
        <div className="option-grid compact">
          {Object.entries(scenes).map(([key, value]) => (
            <button key={key} className={'option-card' + (profile.scene === key ? ' selected' : '')} onClick={() => update('scene', key)}>
              <b>{value.label}</b>
              <small>{value.hint}</small>
            </button>
          ))}
        </div>
        <label className="stacked">
          Topic <span className="optional">optional</span>
          <input
            value={profile.topic}
            onChange={e => update('topic', e.target.value)}
            placeholder="e.g. weekend plans, my roommate, job interview…"
          />
        </label>
      </div>

      <div className="two-col">
        <div className="field-block">
          <div className="field-label">Speaking tone</div>
          <div className="segmented wide">
            {Object.entries(tones).map(([key, value]) => (
              <button key={key} className={profile.tone === key ? 'selected' : ''} onClick={() => update('tone', key)}>
                {value.label}
              </button>
            ))}
          </div>
        </div>
        <div className="field-block">
          <div className="field-label">Reply length</div>
          <div className="segmented wide">
            {Object.entries(lengths).map(([key, value]) => (
              <button key={key} className={profile.length === key ? 'selected' : ''} onClick={() => update('length', key)}>
                {value.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="hint-line">
        <Sparkles size={13} /> Reasoning depth is a global preference — change it any time in <b>Settings</b> at the bottom left.
      </p>
    </Modal>
  );
}
