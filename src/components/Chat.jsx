import React, { Fragment, useEffect, useRef } from 'react';
import { Bot, ChevronRight, Copy, Flame, Send, Sparkles, Trash2, UserRound, X, Zap } from 'lucide-react';

const WORD_TOKEN = /([A-Za-z0-9]+(?:['’’-][A-Za-z0-9]+)*)/;
const isWord = part => /^[A-Za-z0-9]/.test(part);

export default function Chat({
  messages,
  input,
  setInput,
  send,
  loading,
  starting,
  selected,
  setSelected,
  addWord,
  words,
  personaName,
  subtitle,
  enterToSend,
  streamingText = '',
  openCorrections,
  toggleCorrection,
  onDeleteMessage
}) {
  const endRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, loading, starting, openCorrections.length]);

  // Follow the stream only while the reader is already at the bottom, so scrolling up
  // to re-read something is never yanked back down.
  useEffect(() => {
    if (!streamingText) return;
    const box = scrollRef.current;
    if (!box) return;
    const distance = box.scrollHeight - box.scrollTop - box.clientHeight;
    if (distance < 160) endRef.current?.scrollIntoView({ block: 'end' });
  }, [streamingText]);

  return (
    <div className="chat-layout">
      <div className="chat-head">
        <div className="persona">
          <div className="persona-icon">
            <Bot size={20} />
          </div>
          <div>
            <b>
              {personaName} <span className="online" />
            </b>
            <small>{subtitle}</small>
          </div>
        </div>
        <div className="session-meta">
          <span>
            <Flame size={14} /> 4 day streak
          </span>
          <span className="token-pill">
            <Zap size={13} /> {words.length} words in bank
          </span>
        </div>
      </div>

      <div className="chat-body">
        <div className="chat-pane">
          <div className="messages" ref={scrollRef}>
            {messages.length === 0 && starting && (
              <div className="message assistant">
                <div className="msg-avatar">
                  <Bot size={16} />
                </div>
                <div className="bubble typing">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <Message
                key={i}
                index={i}
                m={m}
                selected={selected}
                onWord={word => setSelected({ word, i })}
                open={openCorrections.includes(i)}
                onToggleCorrection={toggleCorrection}
                onDelete={onDeleteMessage}
                locked={loading}
              />
            ))}
            {streamingText && (
              <div className="message assistant">
                <div className="msg-avatar">
                  <Bot size={16} />
                </div>
                <div className="msg-content">
                  <div className="bubble">
                    {streamingText}
                    <span className="caret" />
                  </div>
                </div>
              </div>
            )}
            {loading && !streamingText && (
              <div className="message assistant">
                <div className="msg-avatar">
                  <Bot size={16} />
                </div>
                <div className="bubble typing">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {selected && (
            <div className="word-action">
              <Sparkles size={13} />
              <b>“{selected.word}”</b>
              <button
                onClick={() => {
                  addWord(selected.word);
                  setSelected(null);
                }}
              >
                Add to word bank
              </button>
              <button className="icon-btn ghost tiny" onClick={() => setSelected(null)} aria-label="Dismiss">
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="composer-wrap">
        <div className="hint-row">
          <span>
            <Sparkles size={13} /> AI is ready
          </span>
          <span>{enterToSend ? 'Enter to send · Shift + Enter for new line' : 'Shift + Enter or button to send'}</span>
        </div>
        <div className="composer">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (enterToSend ? !e.shiftKey : e.shiftKey)) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Say something in English..."
            rows={1}
          />
          <button className="send" onClick={send} disabled={!input.trim() || loading} aria-label="Send">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Message({ m, index, selected, onWord, open, onToggleCorrection, onDelete, locked }) {
  return (
    <div className={'message ' + m.role}>
      <div className="msg-avatar">{m.role === 'assistant' ? <Bot size={16} /> : <UserRound size={15} />}</div>
      <div className="msg-content">
        <div className={'bubble' + (m.error ? ' error' : '')}>
          {m.text.split(WORD_TOKEN).map((part, i) =>
            isWord(part) ? (
              // Only the exact clicked token is marked — never the whole message.
              <span key={i} className={'word' + (selected?.i === index && selected?.word === part ? ' active' : '')} onClick={() => onWord(part)}>
                {part}
              </span>
            ) : (
              part
            )
          )}
        </div>

        {m.correction && <Correction correction={m.correction} open={open} onToggle={() => onToggleCorrection(index)} />}

        {/* Hidden while a reply is in flight — deleting mid-stream would be undone by the final patch. */}
        {!locked && (
          <div className="message-tools">
            {m.role === 'assistant' && !m.error && (
              <button onClick={() => navigator.clipboard?.writeText(m.text)}>
                <Copy size={13} /> Copy
              </button>
            )}
            <button className="danger" onClick={() => onDelete(index)} aria-label="Delete message">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
        <small className="time">{m.time}</small>
      </div>
    </div>
  );
}

/* ---------- inline correction, right under the sentence it reviews ---------- */

function Correction({ correction, open, onToggle }) {
  const count = correction.segments.filter(s => s.replace).length;

  if (!open) {
    return (
      <button className="correction-chip" onClick={onToggle} aria-expanded={false}>
        <ChevronRight size={14} />
        <span>Corrections &amp; Polish</span>
        {count ? <em>{count}</em> : null}
      </button>
    );
  }

  return (
    <div className="correction-inline">
      <button className="correction-head" onClick={onToggle} aria-expanded="true">
        <ChevronRight size={14} className="rotated" />
        <span>Corrections &amp; Polish</span>
      </button>
      <p className="correction-sentence">
        {correction.segments.map((segment, i) =>
          segment.replace ? (
            <Fragment key={i}>
              <span className="hl-bad">{segment.text}</span>
              <span className="hl-good">{segment.replace}</span>
            </Fragment>
          ) : (
            <span key={i}>{segment.text}</span>
          )
        )}
      </p>
      {!!correction.reasons?.length && (
        <div className="correction-reasons">
          <div className="correction-divider">
            <span>Why</span>
          </div>
          <ul>
            {correction.reasons.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
