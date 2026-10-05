import React, { useState } from 'react';
import { Bot, Briefcase, GraduationCap, Home, MessageCircle, Plus, Shuffle, Sparkles, Stethoscope, Users, UtensilsCrossed } from 'lucide-react';
import Modal from './Modal.jsx';
import { lengths, roles, sampleTopics, scenes, tones, topicsFor } from '../lib/config.js';

const SUGGESTION_COUNT = 6;

const roleIcons = {
  classmate: <Users size={17} />,
  teacher: <GraduationCap size={17} />,
  friend: <MessageCircle size={17} />,
  roommate: <Home size={17} />,
  colleague: <Briefcase size={17} />,
  interviewer: <Bot size={17} />,
  doctor: <Stethoscope size={17} />,
  waiter: <UtensilsCrossed size={17} />
};

export default function NewConversationModal({ initialProfile, onClose, onCreate }) {
  const [profile, setProfile] = useState(initialProfile);
  // Six random situations drawn from the selected role's library; the button re-rolls them.
  const [suggestions, setSuggestions] = useState(() => sampleTopics(initialProfile.role, SUGGESTION_COUNT));
  const update = (key, value) => setProfile(current => ({ ...current, [key]: value }));

  // Switching role swaps the whole topic library, so a suggestion from the old role would be
  // out of place — drop it, but keep anything the learner typed themselves.
  const pickRole = key => {
    setProfile(current => ({
      ...current,
      role: key,
      topic: topicsFor(current.role).includes(current.topic) ? '' : current.topic
    }));
    setSuggestions(sampleTopics(key, SUGGESTION_COUNT));
  };

  // Excluding what is already on screen guarantees the click visibly changes the set.
  const shuffle = () => setSuggestions(current => sampleTopics(profile.role, SUGGESTION_COUNT, current));

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
            <button key={key} className={'option-card' + (profile.role === key ? ' selected' : '')} onClick={() => pickRole(key)}>
              <span className="option-icon">{roleIcons[key] || <Users size={17} />}</span>
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
      </div>

      <div className="field-block">
        <div className="field-label">
          Topic <span className="optional">optional</span>
        </div>
        <div className="topic-row">
          <input
            value={profile.topic}
            onChange={e => update('topic', e.target.value)}
            placeholder="e.g. weekend plans, my roommate, job interview…"
          />
          <button type="button" className="outline-btn" onClick={shuffle} title="Show six more random ideas">
            <Shuffle size={13} /> Surprise me
          </button>
        </div>
        {/* Six random situations from this role's library — tap one to use it. */}
        <div className="topic-chips">
          {suggestions.map(topic => (
            <button
              key={topic}
              type="button"
              className={'topic-chip' + (profile.topic === topic ? ' on' : '')}
              onClick={() => update('topic', topic)}
            >
              {topic}
            </button>
          ))}
        </div>
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
