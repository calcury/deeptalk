import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Menu, Plus } from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import Chat from './components/Chat.jsx';
import NewConversationModal from './components/NewConversationModal.jsx';
import Onboarding from './components/Onboarding.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import { Usage, Words } from './components/Pages.jsx';
import { accountDefaults, correctionsEnabled, costOf, profileDefaults, settingsDefaults, usageDefaults } from './lib/config.js';
import { KEYS, loadObject, loadRaw, save } from './lib/storage.js';
import { dayKey, makeConversation, newProfile, normaliseConversations, now, peakMultiplier, pickFocusWords, pruneHistory, usesWord } from './lib/utils.js';
import { ask, generateStart } from './lib/api.js';

export default function App() {
  const [tab, setTab] = useState('chat');
  const [settings, setSettings] = useState(() => loadObject(KEYS.settings, settingsDefaults));
  const [account, setAccount] = useState(() => loadObject(KEYS.account, accountDefaults));
  // No stored conversations means a first run — stay empty. An empty list is exactly what
  // shows the onboarding screen, and starting or deleting a conversation flips it.
  const [conversations, setConversations] = useState(() => {
    const stored = loadRaw(KEYS.conversations, null);
    return Array.isArray(stored) && stored.length ? normaliseConversations(stored) : [];
  });
  const [currentId, setCurrentId] = useState(() => loadRaw(KEYS.current, null));
  const [usage, setUsage] = useState(() => ({ ...usageDefaults, ...(loadRaw(KEYS.usage, null) || {}) }));
  const [words, setWords] = useState(() => loadRaw(KEYS.words, []) || []);
  const [lastProfile, setLastProfile] = useState(() => ({ ...profileDefaults, ...(loadRaw(KEYS.lastProfile, null) || {}) }));

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [settingsSection, setSettingsSection] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [startingId, setStartingId] = useState(null);
  // Text of the answer currently being streamed. Kept out of `conversations` so a token never
  // triggers a localStorage write — it is committed once the stream finishes.
  const [streaming, setStreaming] = useState('');
  // Message indices whose correction block is unfolded. Empty on load, so a second
  // visit shows the folded "Corrections & Polish" chip while the data stays cached.
  const [openCorrections, setOpenCorrections] = useState([]);

  const requestId = useRef(0);
  const toastTimer = useRef(null);

  // Fall back to a real conversation when the stored pointer is stale (cleared storage, other tab, migration).
  const activeId = currentId && conversations.some(c => c.id === currentId) ? currentId : conversations[0]?.id;
  const active = useMemo(() => conversations.find(c => c.id === activeId) || conversations[0], [conversations, activeId]);
  const messages = active?.messages || [];
  const profile = active?.profile || profileDefaults;
  // "Off" means no correction pass at all: shorter prompt, no JSON mode, fewer tokens.
  const corrections = correctionsEnabled(settings);

  useEffect(() => save(KEYS.settings, settings), [settings]);
  useEffect(() => save(KEYS.account, account), [account]);
  useEffect(() => save(KEYS.conversations, conversations), [conversations]);
  useEffect(() => save(KEYS.current, activeId), [activeId]);
  useEffect(() => save(KEYS.usage, usage), [usage]);
  useEffect(() => save(KEYS.words, words), [words]);
  useEffect(() => save(KEYS.lastProfile, lastProfile), [lastProfile]);

  const notify = useCallback(message => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1800);
  }, []);

  const resetSession = useCallback(() => {
    requestId.current += 1;
    setLoading(false);
    setInput('');
    setSelected(null);
    setOpenCorrections([]);
    setStreaming('');
  }, []);

  const deleteMessage = useCallback(
    index => {
      setConversations(all =>
        all.map(c => (c.id === activeId ? { ...c, messages: c.messages.filter((_, i) => i !== index) } : c))
      );
      // Indices above the removed message shift down by one.
      setOpenCorrections(current => current.filter(i => i !== index).map(i => (i > index ? i - 1 : i)));
    },
    [activeId]
  );

  const toggleCorrection = useCallback(index => {
    setOpenCorrections(current => (current.includes(index) ? current.filter(i => i !== index) : [...current, index]));
  }, []);

  const patchConversation = useCallback((id, patch) => {
    setConversations(all => all.map(c => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const startConversation = async nextProfile => {
    resetSession();
    // The opening line and the chat name come from the model, so the conversation starts empty.
    const conversation = { ...makeConversation(nextProfile, settings.personaName, conversations.length + 1), messages: [], title: 'New conversation' };
    setLastProfile(nextProfile);
    setConversations(all => [conversation, ...all]);
    setCurrentId(conversation.id);
    setTab('chat');
    setShowNew(false);
    setMobileOpen(false);
    setStartingId(conversation.id);
    try {
      const { title, opener } = await generateStart({ profile: nextProfile, settings });
      patchConversation(conversation.id, { title: title || 'New conversation', messages: [{ role: 'assistant', text: opener, time: now() }] });
    } catch (e) {
      // No canned stand-in: report what actually went wrong, in the chat, where it is seen.
      patchConversation(conversation.id, {
        messages: [{ role: 'assistant', text: e.message || 'Request failed — check your API settings and try again.', time: now(), error: true }]
      });
    } finally {
      setStartingId(current => (current === conversation.id ? null : current));
    }
  };

  const openConversation = id => {
    resetSession();
    setCurrentId(id);
    setTab('chat');
  };

  const deleteConversation = id => {
    requestId.current += 1;
    setLoading(false);
    setOpenCorrections([]);
    const rest = conversations.filter(c => c.id !== id);
    // Deliberately no auto-replacement: emptying the list is what brings the onboarding back.
    setConversations(rest);
    if (id === activeId) setCurrentId(rest[0]?.id ?? null);
    notify('Conversation deleted');
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const request = ++requestId.current;
    const userIndex = messages.length;
    const userMessage = { role: 'user', text, time: now() };
    patchConversation(activeId, { messages: [...messages, userMessage] });
    setLoading(true);
    setStreaming('');
    // Freshly drawn each turn: words used less often come up more often.
    const focusWords = pickFocusWords(words);
    try {
      const { text: reply, correction } = await ask(text, {
        settings,
        profile,
        messages,
        words: focusWords,
        corrections,
        onUsage: u => recordUsage(u),
        onDelta: partial => {
          if (request === requestId.current) setStreaming(partial);
        },
        // The review often lands before the answer finishes typing — show it right away.
        onCorrection: found => {
          if (request !== requestId.current || !found) return;
          patchConversation(activeId, { messages: [...messages, { ...userMessage, correction: found }] });
          setOpenCorrections(current => (current.includes(userIndex) ? current : [...current, userIndex]));
        }
      });
      if (request !== requestId.current) return;
      // The review belongs to the learner's sentence, so it hangs under that bubble.
      const turn = [
        ...messages,
        { ...userMessage, correction: correction || undefined },
        { role: 'assistant', text: reply, time: now() }
      ];
      patchConversation(activeId, { messages: turn });
      if (correction) setOpenCorrections(current => (current.includes(userIndex) ? current : [...current, userIndex]));
      const used = focusWords.filter(w => usesWord(reply, w.word));
      if (used.length) {
        setWords(list => list.map(item => (used.some(u => u.word === item.word) ? { ...item, count: Math.min(10, (item.count || 0) + 1) } : item)));
      }
    } catch (e) {
      if (request !== requestId.current) return;
      patchConversation(activeId, {
        messages: [
          ...messages,
          userMessage,
          { role: 'assistant', text: e.message || 'Request failed — check your API settings and try again.', time: now(), error: true }
        ]
      });
    } finally {
      if (request === requestId.current) {
        setLoading(false);
        setStreaming('');
      }
    }
  };

  const recordUsage = useCallback(u => {
    const multiplier = u.multiplier || peakMultiplier();
    const cost = costOf({ input: u.input, output: u.output, cacheHit: u.cacheHit }, multiplier);
    setUsage(prev => {
      const key = dayKey();
      const day = prev.history?.[key] || { input: 0, output: 0, cacheHit: 0, cost: 0, requests: 0 };
      return {
        input: (prev.input || 0) + u.input,
        output: (prev.output || 0) + u.output,
        cacheHit: (prev.cacheHit || 0) + u.cacheHit,
        requests: (prev.requests || 0) + 1,
        cost: (prev.cost || 0) + cost,
        history: pruneHistory({
          ...(prev.history || {}),
          [key]: {
            input: day.input + u.input,
            output: day.output + u.output,
            cacheHit: day.cacheHit + u.cacheHit,
            cost: day.cost + cost,
            requests: day.requests + 1
          }
        })
      };
    });
  }, []);

  const addWord = (word, context) => {
    if (!word) return;
    const trimmed = word.trim();
    if (!trimmed) return;
    let added = false;
    setWords(current => {
      if (current.some(w => w.word.toLowerCase() === trimmed.toLowerCase())) return current;
      added = true;
      return [{ word: trimmed, context: context?.trim() || messages.at(-1)?.text || '', count: 0, added: new Date().toISOString() }, ...current];
    });
    notify(added ? 'Added to word bank' : 'Already in your bank');
  };

  const removeWord = word => setWords(current => current.filter(w => w.word !== word));

  const runDataAction = action => {
    if (action === 'conversations') {
      requestId.current += 1;
      setLoading(false);
      setOpenCorrections([]);
      // Clearing everything is the same as deleting every conversation — onboarding comes back.
      setConversations([]);
      setCurrentId(null);
      notify('Conversations cleared');
    }
    if (action === 'words') {
      setWords([]);
      notify('Word bank cleared');
    }
    if (action === 'usage') {
      setUsage({ ...usageDefaults, history: {} });
      notify('Usage reset');
    }
  };

  useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowNew(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // First run — or every conversation deleted: the whole workspace gives way to the two-step
  // setup screen. Starting a conversation creates one, so it stays away from then on.
  if (conversations.length === 0) {
    return (
      <>
        <Onboarding
          settings={settings}
          setSettings={setSettings}
          onPick={() => setShowNew(true)}
          onOpenSettings={() => setSettingsSection('model')}
        />

        {showNew && (
          <NewConversationModal initialProfile={newProfile(settings)} onClose={() => setShowNew(false)} onCreate={startConversation} />
        )}

        {settingsSection && (
          <SettingsModal
            settings={settings}
            setSettings={setSettings}
            account={account}
            setAccount={setAccount}
            initialSection={settingsSection}
            onClose={() => setSettingsSection(null)}
            onDataAction={runDataAction}
            notify={notify}
          />
        )}

        {toast && (
          <div className="toast">
            <Check size={15} />
            {toast}
          </div>
        )}
      </>
    );
  }

  return (
    <div className={'app' + (settings.sidebarCollapsed ? ' collapsed' : '') + (mobileOpen ? ' mobile-open' : '')}>
      <Sidebar
        tab={tab}
        setTab={setTab}
        conversations={conversations}
        activeId={activeId}
        onSelect={openConversation}
        onDelete={deleteConversation}
        onNew={() => setShowNew(true)}
        account={account}
        openSettings={section => setSettingsSection(section)}
        collapsed={settings.sidebarCollapsed}
        toggleCollapse={() => setSettings(s => ({ ...s, sidebarCollapsed: !s.sidebarCollapsed }))}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
        counts={{ words: words.length || 0 }}
      />

      {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)} />}

      <main className="main">
        <header>
          <button className="icon-btn menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
          {/* Only the chat view owns the top title — workspace pages carry their own heading. */}
          {tab === 'chat' && (
            <div className="header-title">
              <p className="eyebrow">CONVERSATION</p>
              <h1>{active?.title || 'Conversation'}</h1>
            </div>
          )}
          {/* Starting a conversation only makes sense from the chat view. */}
          {tab === 'chat' && (
            <div className="header-actions">
              <button className="icon-btn accent" onClick={() => setShowNew(true)} title="New conversation" aria-label="New conversation">
                <Plus size={18} />
              </button>
            </div>
          )}
        </header>

        {tab === 'chat' && (
          <Chat
            key={activeId}
            messages={messages}
            input={input}
            setInput={setInput}
            send={send}
            loading={loading}
            selected={selected}
            setSelected={setSelected}
            addWord={addWord}
            words={words}
            personaName={settings.personaName || 'Alex'}
            subtitle={profile.topic || `${profile.role} · ${profile.scene}`}
            enterToSend={settings.enterToSend}
            starting={startingId === activeId}
            streamingText={streaming}
            openCorrections={openCorrections}
            toggleCorrection={toggleCorrection}
            onDeleteMessage={deleteMessage}
          />
        )}
        {tab === 'words' && <Words words={words} addWord={addWord} removeWord={removeWord} setWords={setWords} />}
        {tab === 'usage' && (
          <Usage
            usage={usage}
            setUsage={setUsage}
            currency={settings.currency}
            setCurrency={code => setSettings(s => ({ ...s, currency: code }))}
          />
        )}
      </main>

      {showNew && (
        <NewConversationModal initialProfile={lastProfile ? { ...lastProfile, topic: '' } : newProfile(settings)} onClose={() => setShowNew(false)} onCreate={startConversation} />
      )}

      {settingsSection && (
        <SettingsModal
          settings={settings}
          setSettings={setSettings}
          account={account}
          setAccount={setAccount}
          initialSection={settingsSection}
          onClose={() => setSettingsSection(null)}
          onDataAction={runDataAction}
          notify={notify}
        />
      )}

      {toast && (
        <div className="toast">
          <Check size={15} />
          {toast}
        </div>
      )}
    </div>
  );
}
