import React from 'react';
import { BookOpen, ChevronDown, Coins, MessageCircle, PanelLeftClose, PanelLeftOpen, Plus, Settings2, Sparkles, Trash2, X } from 'lucide-react';
import Avatar from './Avatar.jsx';
import { shortDate } from '../lib/utils.js';

export default function Sidebar({
  tab,
  setTab,
  conversations,
  activeId,
  onSelect,
  onDelete,
  onNew,
  account,
  openSettings,
  collapsed,
  toggleCollapse,
  mobileOpen,
  closeMobile,
  counts
}) {
  const go = next => {
    setTab(next);
    closeMobile?.();
  };

  return (
    <aside className={'sidebar' + (mobileOpen ? ' open' : '')}>
      <div className="brand">
        <div className="brand-mark">
          <Sparkles size={18} />
        </div>
        <span className="brand-text collapse-hide">deeptalk</span>
        <span className="beta collapse-hide">BETA</span>
        <button className="icon-btn ghost collapse-btn" onClick={toggleCollapse} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
        <button className="icon-btn ghost mobile-close" onClick={closeMobile} aria-label="Close menu">
          <X size={17} />
        </button>
      </div>

      <button className="new-chat" onClick={onNew} title="New conversation">
        <Plus size={17} />
        <span className="new-chat-label collapse-hide">New conversation</span>
        <kbd className="collapse-hide">⌘K</kbd>
      </button>

      <div className="side-label collapse-hide">Workspace</div>
      <nav>
        <button className={tab === 'chat' ? 'active' : ''} onClick={() => go('chat')} title="Chat">
          <MessageCircle size={17} />
          <span className="collapse-hide">Chat</span>
        </button>
        <button className={tab === 'words' ? 'active' : ''} onClick={() => go('words')} title="Word bank">
          <BookOpen size={17} />
          <span className="collapse-hide">Word bank</span>
          <span className="badge pale collapse-hide">{counts.words}</span>
        </button>
        <button className={tab === 'usage' ? 'active' : ''} onClick={() => go('usage')} title="Usage & pricing">
          <Coins size={17} />
          <span className="collapse-hide">Usage &amp; pricing</span>
        </button>
      </nav>

      <div className="side-label recent collapse-hide">Conversations</div>
      <div className="conversation-list">
        {conversations.map(conversation => (
          <div key={conversation.id} className={'conversation-item' + (conversation.id === activeId ? ' selected' : '')}>
            <button className="conversation-open" onClick={() => { onSelect(conversation.id); closeMobile?.(); }} title={conversation.title}>
              <span className="dot" />
              <span className="conversation-text collapse-hide">
                <b>{conversation.title}</b>
                <small>{shortDate(conversation.createdAt)}</small>
              </span>
            </button>
            <button
              className="conversation-delete collapse-hide"
              onClick={() => onDelete(conversation.id)}
              title="Delete conversation"
              aria-label="Delete conversation"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <button className="account-row" onClick={() => openSettings('account')} title="Account settings">
          <Avatar account={account} />
          <span className="account-text collapse-hide">
            <b>{account.name || 'user'}</b>
            <small>Local account</small>
          </span>
          <ChevronDown size={15} className="collapse-hide" />
        </button>
        <button className="settings-row" onClick={() => openSettings('general')} title="Settings">
          <Settings2 size={17} />
          <span className="collapse-hide">Settings</span>
        </button>
      </div>
    </aside>
  );
}
