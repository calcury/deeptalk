import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  BookOpen,
  Check,
  Coins,
  Gauge,
  MessagesSquare,
  Plug,
  Shield,
  Sparkles,
  Wand2,
  Zap
} from 'lucide-react';
import './about.css';

const APP_URL = import.meta.env.BASE_URL;
const LANG_KEY = 'deeptalk-about-lang';

/* ---------- section skeleton (ids and icons are language independent) ---------- */

const SECTIONS = ['features', 'models', 'pricing', 'privacy', 'start'];

const FEATURES = [
  { key: 'chat', icon: <MessagesSquare size={18} /> },
  { key: 'corrections', icon: <Wand2 size={18} /> },
  { key: 'strictness', icon: <Sparkles size={18} /> },
  { key: 'words', icon: <BookOpen size={18} /> },
  { key: 'stream', icon: <Zap size={18} /> },
  { key: 'usage', icon: <Coins size={18} /> }
];

const MODELS = [
  { key: 'deepseek', tone: 'primary', icon: <Plug size={16} /> },
  { key: 'compatible', tone: 'plain', icon: <Plug size={16} /> }
];

const NOTES = [
  { key: 'peak', icon: <Gauge size={16} /> },
  { key: 'cost', icon: <Coins size={16} /> },
  { key: 'cache', icon: <Sparkles size={16} /> }
];

const PRIVACY = ['key', 'local', 'clear'];
const STEPS = ['open', 'key', 'new'];

const PRICING_ROWS = [
  { model: 'deepseek-flash', version: 'DeepSeek-V4.1-Flash', tier: 'idle', hit: '0.02', miss: '1', out: '4' },
  { model: 'deepseek-flash', version: 'DeepSeek-V4.1-Flash', tier: 'peak', hit: '0.04', miss: '2', out: '8' },
  { model: 'deepseek-v4-pro', version: 'DeepSeek-V4-Pro-0813', tier: 'idle', hit: '0.15', miss: '4.5', out: '13.5' },
  { model: 'deepseek-v4-pro', version: 'DeepSeek-V4-Pro-0813', tier: 'peak', hit: '0.30', miss: '9.0', out: '27.0' }
];

/* ---------- copy ---------- */

const COPY = {
  zh: {
    title: 'DeepTalk — 用真实对话练英语',
    brandTag: 'English, naturally.',
    openApp: '打开应用',
    nav: { features: '主要功能', models: '模型支持', pricing: '价格', privacy: '隐私', start: '快速开始' },
    hero: {
      eyebrow: 'ENGLISH PRACTICE, IN YOUR BROWSER',
      title: ['用真实对话练英语，', '而不是做练习题。'],
      lede: 'DeepTalk 是一个中文用户的英语口语练习场：AI 陪你聊你真正想聊的事，说完一句就顺手把错处标出来，还把你不会的词攒成词库、在后面的对话里悄悄塞回来。',
      primary: '开始练习',
      ghost: '看看有什么功能',
      facts: ['无注册、无账号', '数据只存本地浏览器', '手机 / 电脑都能用'],
      demoLabel: 'Corrections & Polish'
    },
    features: {
      eyebrow: 'FEATURES',
      title: '主要功能',
      note: '从「开口说」到「记住这个词」，一条链路全都覆盖。',
      items: {
        chat: { title: '真实对话，不是填空题', text: '选好角色、场景、语气和回复长度，AI 会像同学或同事那样跟你聊下去，并自动生成开场白和会话名。聊什么都行。' },
        corrections: { title: 'Corrections & Polish', text: '你说完一句，句子里的问题会被就地标出：红色是你的原话，紧跟绿色是更自然的说法，分割线下面是英文说明。不重写整句，只改真正错的地方。' },
        strictness: { title: '四档批改强度', text: 'Relaxed 只报语法硬伤，Standard / Strict 逐级放宽到用词和搭配；不想花这份 token 就选 Off，只聊天不批改。' },
        words: { title: '生词本会自己排优先级', text: '把聊天里遇到的词加进词库，用得越少的词越容易被抽中，下一轮对话里自然地带上它；用满 10 次自动标记为已学会。' },
        stream: { title: '流式输出，随时收拾', text: '回答逐字出现，不用干等。发错的、跑题的、不想要的那一条消息，直接删掉，人和 AI 的都能删。' },
        usage: { title: '用量按官方计费口径估算', text: '读取接口返回的真实 usage：区分缓存命中与未命中的输入、输出，按北京时间峰谷时段换算成金额，并画出最近 7 天的曲线。' }
      }
    },
    models: {
      eyebrow: 'MODELS',
      title: '模型支持',
      note: '默认接 DeepSeek——它是目前适配得最完整的一家。接口只要兼容 OpenAI 格式，也都能接进来。',
      items: {
        deepseek: {
          name: 'DeepSeek',
          tag: '推荐 · 功能最完整',
          points: [
            '流式输出、批改、生词全部可用，是目前的默认接入',
            '读取真实 usage 与 prompt_cache_hit_tokens，金额按官方价换算',
            '识别北京时间峰谷时段，高峰价格自动翻倍',
            '内置示例：settings 里填 API Key 就能用'
          ]
        },
        compatible: {
          name: '任意 OpenAI 格式端点',
          tag: '可用 · 计费仅供参考',
          points: [
            '在 settings 里改 Base URL、模型名、API Key 即可',
            '适用于 OpenAI、Kimi、通义、OpenRouter、本地 Ollama / vLLM 等',
            '对话、流式与批改都正常；但缓存与峰谷价规则是 DeepSeek 的',
            '这类服务的用量页金额只是按 DeepSeek 官方价估出来的，不等于实际账单'
          ]
        }
      }
    },
    pricing: {
      eyebrow: 'PRICING',
      title: '价格',
      note: 'DeepTalk 自己不收任何费用，你只为模型 API 付钱，单价完全按 DeepSeek 官方定价。下表单位：元 / 百万 tokens。',
      columns: { model: '模型', tier: '时段', hit: '输入 · 缓存命中', miss: '输入 · 缓存未命中', out: '输出' },
      tiers: { idle: '空闲时段', peak: '高峰时段' },
      notes: {
        peak: {
          title: '峰谷时段',
          text: '高峰时段为北京时间周一至周五 9:00–12:00、14:00–18:00（不含中国法定节假日），高峰价为空闲价的 2 倍。其余时段——包括周末与法定节假日全天——都按空闲价计费。'
        },
        cost: {
          title: '一轮对话大概多少钱',
          text: '一次发送会发两次请求：对话 + 批改。以十来词的往来估算，空闲时段约 ¥0.002（不到一分钱）；高峰时段翻倍。把批改设为 Off 可以省掉其中一路。'
        },
        cache: { title: '缓存是最大的折扣', text: '每轮对话的固定提示词、人设和词库都放在提示最前面，命中缓存后只按 0.02 元 / 百万 tokens 计费，是未命中输入价的 1/50。' }
      },
      tableHint: '左右滑动查看完整价格表',
      disclaimerPrefix: '价格随 DeepSeek 官方调整而变动，本页数字更新于 2026 年 10 月，请以',
      disclaimerLink: 'DeepSeek 官方定价页',
      disclaimerSuffix: '为准。'
    },
    privacy: {
      eyebrow: 'PRIVACY',
      title: '你的数据在哪',
      note: '没有后端，没有数据库，没有账号系统。',
      items: {
        key: { title: 'API Key 不出浏览器', text: 'Key 只保存在你自己浏览器的 localStorage 里，请求由浏览器直接发往你填的接口地址，不经过任何中间服务器。' },
        local: { title: '对话记录只存本地', text: '会话、词库、用量统计都写在 localStorage。清除浏览器数据即彻底消失，也没有别的地方留有副本。' },
        clear: { title: '随手可清', text: 'Settings → Data 可以分别清空会话、词库、用量统计，或把设置恢复默认，且不影响其它数据。' }
      }
    },
    start: {
      eyebrow: 'GET STARTED',
      title: '三步开始',
      items: {
        open: { title: '打开 DeepTalk', text: '不需要注册、不需要登录。数据全部存在你自己的浏览器里。' },
        key: { title: '填一个 API Key', text: '左下角 Settings → Model & API，默认已指向 DeepSeek 官方地址，粘贴 Key 即可。' },
        new: { title: '新建对话', text: '选好角色和话题，AI 会先开口。之后就用英文聊，批改会跟着你的每句话出现。' }
      },
      ctaTitle: '准备好了？',
      ctaText: '打开应用，第一句用英文说出来就行。',
      ctaButton: '打开 DeepTalk'
    },
    footer: 'DeepTalk · English, naturally.',
    termsLabel: '用户协议',
    privacyLabel: '隐私政策',
    langLabel: '语言'
  },
  en: {
    title: 'DeepTalk — Practise English in real conversation',
    brandTag: 'English, naturally.',
    openApp: 'Open the app',
    nav: { features: 'Features', models: 'Models', pricing: 'Pricing', privacy: 'Privacy', start: 'Get started' },
    hero: {
      eyebrow: 'ENGLISH PRACTICE, IN YOUR BROWSER',
      title: ['Practise English in a real conversation,', 'not in a workbook.'],
      lede: 'DeepTalk is a speaking-practice room for Chinese learners: the AI chats about whatever you actually want to talk about, marks up your sentence the moment you send it, and quietly works the words you keep missing back into later conversations.',
      primary: 'Start practising',
      ghost: 'See what it does',
      facts: ['No sign-up, no account', 'Everything stays in your browser', 'Phone and desktop'],
      demoLabel: 'Corrections & Polish'
    },
    features: {
      eyebrow: 'FEATURES',
      title: 'What it does',
      note: 'From the first sentence you say to the word you finally remember — one loop.',
      items: {
        chat: { title: 'A real conversation, not a gap-fill', text: 'Pick a role, a scene, a tone and a reply length; the AI keeps the exchange going like a classmate or a colleague, and writes the opening line and the chat name for you.' },
        corrections: { title: 'Corrections & Polish', text: 'Send a sentence and the problems in it are marked in place: red is what you wrote, the green that follows is the natural version, and the reason sits under the divider. It never rewrites the whole sentence.' },
        strictness: { title: 'Four levels of correction', text: 'Relaxed flags hard grammar only; Standard and Strict widen the net to word choice and collocation. Not worth the tokens? Switch it to Off and just chat.' },
        words: { title: 'A word bank that sets its own agenda', text: 'Save words as you meet them. The ones you have used least are the ones most likely to be drawn next turn, so they come back naturally — ten uses retires a word as learned.' },
        stream: { title: 'Streamed answers, deletable history', text: 'Replies appear word by word instead of making you wait. Sent something wrong, off-topic or just unwanted? Delete that one message — yours or the AI’s.' },
        usage: { title: 'Costed the way the provider bills', text: 'Real usage from the API response: cached vs fresh input and output, converted at Beijing peak/off-peak rates, with a seven-day curve.' }
      }
    },
    models: {
      eyebrow: 'MODELS',
      title: 'Model support',
      note: 'DeepSeek is the default because it is the most complete integration. Anything speaking the OpenAI shape can be plugged in too.',
      items: {
        deepseek: {
          name: 'DeepSeek',
          tag: 'Recommended · most complete',
          points: [
            'Streaming, corrections and the word bank all work — this is the default',
            'Reads real usage and prompt_cache_hit_tokens; spend is converted at official rates',
            'Knows Beijing peak / off-peak windows and doubles the peak price',
            'Ships preconfigured: paste an API key in settings and go'
          ]
        },
        compatible: {
          name: 'Any OpenAI-format endpoint',
          tag: 'Works · cost is an estimate',
          points: [
            'Change Base URL, model name and API key in settings',
            'OpenAI, Kimi, Qwen, OpenRouter, local Ollama / vLLM, and so on',
            'Chat, streaming and corrections all work; cache and peak rules do not apply',
            'The spend shown is estimated at DeepSeek prices, so it is not your real bill'
          ]
        }
      }
    },
    pricing: {
      eyebrow: 'PRICING',
      title: 'Pricing',
      note: 'DeepTalk charges nothing itself — you only pay the model API, at DeepSeek’s official rates. Figures below are CNY per million tokens.',
      columns: { model: 'Model', tier: 'Window', hit: 'Input · cache hit', miss: 'Input · cache miss', out: 'Output' },
      tiers: { idle: 'Off-peak', peak: 'Peak' },
      notes: {
        peak: {
          title: 'Peak and off-peak',
          text: 'Peak hours are Beijing time Mon–Fri, 09:00–12:00 and 14:00–18:00 (Chinese public holidays excluded); peak costs exactly twice off-peak. Everything else — including the whole weekend and holidays — is billed off-peak.'
        },
        cost: {
          title: 'What one exchange costs',
          text: 'Each send makes two requests: the answer and the review. For a short back-and-forth that is roughly ¥0.002 off-peak — well under a fen. Peak doubles it, and switching corrections to Off drops the second request.'
        },
        cache: { title: 'The cache is the real discount', text: 'The fixed prompt, the persona and the word list all sit at the front of every request. A cache hit bills at ¥0.02 per million tokens — one fiftieth of the fresh-input price.' }
      },
      tableHint: 'Swipe sideways for the full table',
      disclaimerPrefix: 'Prices change with DeepSeek’s official list. Figures here were updated in October 2026 — check',
      disclaimerLink: 'DeepSeek’s pricing page',
      disclaimerSuffix: 'for the current numbers.'
    },
    privacy: {
      eyebrow: 'PRIVACY',
      title: 'Where your data lives',
      note: 'No backend, no database, no accounts.',
      items: {
        key: { title: 'Your API key never leaves the browser', text: 'It is kept in your own localStorage and sent straight from the browser to the endpoint you configured. No server of ours sits in the middle.' },
        local: { title: 'Conversations stay local', text: 'Chats, word bank and usage stats all live in localStorage. Clear your browser data and every trace is gone.' },
        clear: { title: 'Clearing is easy', text: 'Settings → Data lets you wipe conversations, the word bank or usage separately, or restore the defaults without touching the rest.' }
      }
    },
    start: {
      eyebrow: 'GET STARTED',
      title: 'Three steps',
      items: {
        open: { title: 'Open DeepTalk', text: 'No sign-up, no login. Everything lives in your own browser.' },
        key: { title: 'Add an API key', text: 'Settings → Model & API, bottom left. It already points at DeepSeek — paste your key and you are done.' },
        new: { title: 'Start a conversation', text: 'Choose a role and a topic; the AI speaks first. From there, just talk, and corrections follow every sentence you send.' }
      },
      ctaTitle: 'Ready?',
      ctaText: 'Open the app and say your first sentence in English.',
      ctaButton: 'Open DeepTalk'
    },
    footer: 'DeepTalk · English, naturally.',
    termsLabel: 'Terms of Service',
    privacyLabel: 'Privacy Policy',
    langLabel: 'Language'
  }
};

/* ---------- scroll spy ---------- */

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const targets = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!targets.length) return undefined;
    // The last section can never reach the top of the viewport, so the end of the page wins.
    const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const observer = new IntersectionObserver(
      entries => {
        if (atBottom()) return;
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-88px 0px -62% 0px', threshold: 0 }
    );
    const onScroll = () => {
      if (atBottom()) setActive(ids[ids.length - 1]);
    };
    targets.forEach(t => observer.observe(t));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [ids]);
  return active;
}

const initialLang = () => {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'zh' || saved === 'en') return saved;
  } catch {
    /* storage unavailable — fall through to the default */
  }
  return 'zh'; // Chinese first; the toggle still lets readers switch to English
};

/* ---------- page ---------- */

function App() {
  const [lang, setLang] = useState(initialLang);
  const t = COPY[lang];
  const active = useScrollSpy(SECTIONS);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t.title;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* storage unavailable — the toggle still works for this visit */
    }
  }, [lang, t]);

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true">
              D
            </span>
            <span className="brand-text">
              <b>DeepTalk</b>
              <small>{t.brandTag}</small>
            </span>
          </a>

          <nav className="topnav" aria-label={t.nav.features}>
            {SECTIONS.map(id => (
              <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'true' : undefined}>
                {t.nav[id]}
              </a>
            ))}
          </nav>

          <div className="lang-toggle" role="group" aria-label={t.langLabel}>
            {['zh', 'en'].map(code => (
              <button key={code} type="button" className={lang === code ? 'on' : ''} onClick={() => setLang(code)} aria-pressed={lang === code}>
                {code === 'zh' ? '中文' : 'EN'}
              </button>
            ))}
          </div>

          <a className="open-btn" href={APP_URL}>
            {t.openApp} <ArrowRight size={15} />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>
            {t.hero.title[0]}
            <br />
            {t.hero.title[1]}
          </h1>
          <p className="lede">{t.hero.lede}</p>

          <div className="hero-actions">
            <a className="primary-btn" href={APP_URL}>
              {t.hero.primary} <ArrowRight size={16} />
            </a>
            <a className="ghost-btn" href="#features">
              {t.hero.ghost}
            </a>
          </div>

          <ul className="hero-facts">
            {t.hero.facts.map(fact => (
              <li key={fact}>
                <Check size={14} /> {fact}
              </li>
            ))}
          </ul>

          <div className="demo-card" aria-label={t.hero.demoLabel}>
            <div className="demo-head">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <em>{t.hero.demoLabel}</em>
            </div>
            <div className="demo-body">
              <div className="demo-msg user">
                im afraid if he will <span className="hl-bad">got</span>
                <span className="hl-good">get</span> angry?
              </div>
              <div className="demo-divider">
                <span>Why</span>
              </div>
              <p className="demo-why">Use the base form of the verb after will.</p>
              <div className="demo-msg ai">That’s a fair worry — most people take it better than you expect when you stay calm.</div>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="section-head">
            <p className="eyebrow">{t.features.eyebrow}</p>
            <h2>{t.features.title}</h2>
            <p className="section-note">{t.features.note}</p>
          </div>
          <div className="grid">
            {FEATURES.map(item => (
              <article className="card" key={item.key}>
                <div className="card-icon">{item.icon}</div>
                <h3>{t.features.items[item.key].title}</h3>
                <p>{t.features.items[item.key].text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="models" className="section">
          <div className="section-head">
            <p className="eyebrow">{t.models.eyebrow}</p>
            <h2>{t.models.title}</h2>
            <p className="section-note">{t.models.note}</p>
          </div>
          <div className="model-grid">
            {MODELS.map(item => {
              const copy = t.models.items[item.key];
              return (
                <article className={'model-card ' + item.tone} key={item.key}>
                  <header>
                    <h3>
                      {item.icon} {copy.name}
                    </h3>
                    <span className={'model-tag ' + item.tone}>{copy.tag}</span>
                  </header>
                  <ul>
                    {copy.points.map(point => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section id="pricing" className="section">
          <div className="section-head">
            <p className="eyebrow">{t.pricing.eyebrow}</p>
            <h2>{t.pricing.title}</h2>
            <p className="section-note">{t.pricing.note}</p>
          </div>

          <div className="table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>{t.pricing.columns.model}</th>
                  <th>{t.pricing.columns.tier}</th>
                  <th className="num">{t.pricing.columns.hit}</th>
                  <th className="num">{t.pricing.columns.miss}</th>
                  <th className="num">{t.pricing.columns.out}</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_ROWS.map(row => (
                  <tr key={row.model + row.tier}>
                    <td className="model-cell">
                      <b>{row.model}</b>
                      <small>{row.version}</small>
                    </td>
                    <td>
                      <span className={'tier ' + row.tier}>{t.pricing.tiers[row.tier]}</span>
                    </td>
                    <td className="num">{row.hit}</td>
                    <td className="num">{row.miss}</td>
                    <td className="num">{row.out}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-hint">{t.pricing.tableHint}</p>

          <div className="price-notes">
            {NOTES.map(item => (
              <div className="note-card" key={item.key}>
                {item.icon}
                <div>
                  <b>{t.pricing.notes[item.key].title}</b>
                  <p>{t.pricing.notes[item.key].text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="disclaimer">
            {t.pricing.disclaimerPrefix}
            <a href="https://api-docs.deepseek.com/zh-cn/quick_start/pricing" target="_blank" rel="noreferrer">
              {t.pricing.disclaimerLink}
            </a>
            {t.pricing.disclaimerSuffix}
          </p>
        </section>

        <section id="privacy" className="section">
          <div className="section-head">
            <p className="eyebrow">{t.privacy.eyebrow}</p>
            <h2>{t.privacy.title}</h2>
            <p className="section-note">{t.privacy.note}</p>
          </div>
          <div className="privacy">
            {PRIVACY.map(key => (
              <div className="privacy-card" key={key}>
                <Shield size={18} />
                <h3>{t.privacy.items[key].title}</h3>
                <p>{t.privacy.items[key].text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="start" className="section">
          <div className="section-head">
            <p className="eyebrow">{t.start.eyebrow}</p>
            <h2>{t.start.title}</h2>
          </div>
          <ol className="steps">
            {STEPS.map((key, i) => (
              <li key={key}>
                <span className="step-num">{i + 1}</span>
                <div>
                  <b>{t.start.items[key].title}</b>
                  <p>{t.start.items[key].text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="cta">
            <div>
              <b>{t.start.ctaTitle}</b>
              <p>{t.start.ctaText}</p>
            </div>
            <a className="primary-btn" href={APP_URL}>
              {t.start.ctaButton} <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer footer-legal">
        <span>{t.footer}</span>
        <span className="footer-links">
          <a href={APP_URL + 'terms'}>{t.termsLabel}</a>
          <a href={APP_URL + 'privacy'}>{t.privacyLabel}</a>
        </span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
