import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import './about.css';
import './legal.css';

const BASE = import.meta.env.BASE_URL;
const LANG_KEY = 'deeptalk-about-lang';
const REPO = 'https://github.com/calcury/deeptalk';

/* ---------- copy ---------- */

const COPY = {
  zh: {
    brandTag: 'English, naturally.',
    openApp: '打开应用',
    langLabel: '语言',
    nav: { about: '关于', terms: '用户协议', privacy: '隐私政策' },
    updated: '更新于',
    updatedDate: '2026 年 10 月 5 日',
    footer: 'DeepTalk · English, naturally.',
    backToAbout: '返回产品介绍',
    contact: '联系我们',
    titles: {
      terms: { doc: '用户协议', eyebrow: 'TERMS OF SERVICE', htmlTitle: '用户协议 — DeepTalk' },
      privacy: { doc: '隐私政策', eyebrow: 'PRIVACY POLICY', htmlTitle: '隐私政策 — DeepTalk' }
    },
    docs: {
      terms: {
        intro:
          'DeepTalk 是一个开源、无后端的英语练习工具。它自身不提供任何模型算力，而是把你自己申请的模型接口接到浏览器里直接使用。',
        meta: '继续使用 DeepTalk 即表示你接受以下条款。',
        sections: [
          {
            h: '1. 服务内容',
            p: [
              'DeepTalk 不收取任何费用，也没有账号系统。它只是一段运行在你浏览器里的界面代码，用来调用你自己配置的、兼容 OpenAI 格式的模型接口（默认 DeepSeek）。',
              '模型调用所产生的费用由你与你选择的模型服务商结算，与本应用无关。'
            ]
          },
          {
            h: '2. 你的责任',
            p: [
              '你需要自行准备 API Key 并妥善保管。Key 仅保存在你浏览器的 localStorage 中；因 Key 泄露、被他人使用或你的设备被他人访问而产生的费用与后果，由你自行承担。',
              '你同时需要遵守所接入模型服务商的服务条款与使用政策。'
            ]
          },
          {
            h: '3. 可接受使用',
            p: [
              '请勿使用 DeepTalk 生成或传播违反法律法规的内容，或将其用于侵害他人合法权益的用途。',
              '请勿利用本应用对模型服务商进行滥用、攻击，或尝试绕过其使用限制。'
            ]
          },
          {
            h: '4. 服务性质与免责',
            p: [
              '本应用按「现状」提供，不附带任何明示或默示的担保，也不承诺可用性、不中断或无错误。',
              'AI 生成的对话与批改内容可能不准确、不完整，或不适合你的具体语境，仅供语言练习参考，不构成任何专业建议。请自行判断后使用。'
            ]
          },
          {
            h: '5. 知识产权',
            p: [
              '你的对话内容、词库与设置归你本人所有，全部保存在你的浏览器中，我们无法访问。',
              '模型输出内容还受你所接入服务商条款的约束；DeepTalk 的界面与代码遵循项目仓库中的开源许可。'
            ]
          },
          {
            h: '6. 第三方服务',
            p: ['本应用与模型服务商（如 DeepSeek）之间不存在隶属、代理或合作关系。服务商自身的定价、可用性与数据处理规则由其自行决定并可能随时调整。']
          },
          {
            h: '7. 变更与终止',
            p: [
              '本协议可能随功能更新而调整，调整后会修改本文档顶部的日期。若你不同意变更，停止使用即可。',
              '你可以随时通过清除浏览器数据结束使用，无需通知我们。'
            ]
          }
        ]
      },
      privacy: {
        intro: '一句话总结：DeepTalk 没有后端、没有数据库、没有账号，也没有埋点。我们看不到你的任何数据——因为它们从不离开你的浏览器。',
        meta: '本政策说明 DeepTalk 会接触哪些数据、它们存放与流向何处。',
        sections: [
          {
            h: '1. 我们不收集任何数据',
            p: [
              'DeepTalk 没有服务器端，所以我们不会收集、存储或分析你的任何个人信息：没有账号、没有访问日志、没有 Cookie，也没有第三方分析或广告脚本。'
            ]
          },
          {
            h: '2. 数据存放在你的浏览器里',
            p: [
              '会话记录、词库、用量统计、界面偏好，以及你的 API Key，全部保存在你当前浏览器的 localStorage 中。',
              '更换浏览器、更换设备或清除浏览器数据后，这些内容不会随之迁移，也不会自动备份——因为它们从未离开过本机。'
            ]
          },
          {
            h: '3. 数据会被发送到哪里',
            p: [
              '当你发送消息时，对话内容与你的 API Key 由浏览器直接发送到你自行配置的模型接口（默认 https://api.deepseek.com）。',
              '请求不经过任何由我们运营的中间服务器，我们也无法读取其中的内容。'
            ]
          },
          {
            h: '4. 第三方（模型服务商）',
            p: [
              '模型服务商会依据其自身的隐私政策处理你发送的内容，以便生成回复。请查阅你所接入服务商的隐私政策（例如 DeepSeek），了解其数据处理与保留方式。',
              '如果你更换为其它端点（OpenAI、Kimi、通义、本地 Ollama 等），适用的就是那一家的规则。'
            ]
          },
          {
            h: '5. API Key 的安全',
            p: [
              'Key 仅保存在本机浏览器中。请避免在公用电脑上填写，并留意浏览器扩展以及浏览器账号同步带来的风险——同步功能有可能把 localStorage 带到你的其它设备。'
            ]
          },
          {
            h: '6. 删除你的数据',
            p: [
              '在「设置 → Data」中，你可以分别清空会话、词库与用量统计，或恢复默认设置；清除浏览器数据则会一次性移除全部内容。删除后无法恢复。'
            ]
          },
          {
            h: '7. 儿童',
            p: ['本应用不面向特定年龄段设计，也不针对儿童收集任何数据（因为我们本就不收集数据）。未成年人请在监护人指导下使用。']
          },
          {
            h: '8. 变更与联系方式',
            p: ['本政策如有调整，会同步更新本文档顶部的日期。若你对隐私有任何疑问，欢迎通过项目仓库提交 issue 与我们联系。']
          }
        ]
      }
    }
  },
  en: {
    brandTag: 'English, naturally.',
    openApp: 'Open the app',
    langLabel: 'Language',
    nav: { about: 'About', terms: 'Terms', privacy: 'Privacy' },
    updated: 'Last updated',
    updatedDate: '5 October 2026',
    footer: 'DeepTalk · English, naturally.',
    backToAbout: 'Back to the product page',
    contact: 'Contact',
    titles: {
      terms: { doc: 'Terms of Service', eyebrow: 'TERMS OF SERVICE', htmlTitle: 'Terms of Service — DeepTalk' },
      privacy: { doc: 'Privacy Policy', eyebrow: 'PRIVACY POLICY', htmlTitle: 'Privacy Policy — DeepTalk' }
    },
    docs: {
      terms: {
        intro:
          'DeepTalk is an open-source, backend-free English practice tool. It provides no model capacity of its own — it puts a model endpoint that you obtained yourself directly into your browser.',
        meta: 'By continuing to use DeepTalk you accept the terms below.',
        sections: [
          {
            h: '1. What the service is',
            p: [
              'DeepTalk charges nothing and has no accounts. It is interface code that runs in your browser and calls an OpenAI-compatible model endpoint that you configure (DeepSeek by default).',
              'Any cost of calling the model is settled between you and the provider you chose. It has nothing to do with this app.'
            ]
          },
          {
            h: '2. Your responsibilities',
            p: [
              'You provide and look after your own API key. The key is stored only in your browser’s localStorage; any cost or consequence of a leaked key, of someone else using it, or of someone else accessing your device is yours to bear.',
              'You must also comply with the terms and usage policies of the model provider you connect to.'
            ]
          },
          {
            h: '3. Acceptable use',
            p: [
              'Do not use DeepTalk to generate or spread content that breaks the law, or for any purpose that infringes the rights of others.',
              'Do not use the app to abuse, attack or attempt to bypass the limits of a model provider.'
            ]
          },
          {
            h: '4. Nature of the service and disclaimer',
            p: [
              'The app is provided “as is”, without warranty of any kind, express or implied, and with no promise of availability, uninterrupted operation or freedom from error.',
              'AI-generated conversation and corrections may be inaccurate, incomplete, or unsuitable for your particular context. They are language-practice material only and are not professional advice. Use your own judgement.'
            ]
          },
          {
            h: '5. Intellectual property',
            p: [
              'Your conversations, word bank and settings belong to you and live in your browser. We cannot access them.',
              'Model output is also subject to your provider’s terms. DeepTalk’s interface and code follow the open-source licence in the project repository.'
            ]
          },
          {
            h: '6. Third-party services',
            p: ['This app is not affiliated with, an agent of, or partnered with any model provider (such as DeepSeek). Each provider sets its own pricing, availability and data-handling rules, and may change them at any time.']
          },
          {
            h: '7. Changes and termination',
            p: [
              'These terms may change as the app evolves; when they do, the date at the top of this document changes too. If you disagree with a change, simply stop using the app.',
              'You can end your use at any time by clearing your browser data — no notice to us is required.'
            ]
          }
        ]
      },
      privacy: {
        intro:
          'In one sentence: DeepTalk has no backend, no database, no accounts and no analytics. We cannot see any of your data — because it never leaves your browser.',
        meta: 'This policy explains what data DeepTalk touches, where it lives and where it goes.',
        sections: [
          {
            h: '1. We collect nothing',
            p: [
              'DeepTalk has no server side, so we do not collect, store or analyse any personal information: no accounts, no access logs, no cookies, and no third-party analytics or advertising scripts.'
            ]
          },
          {
            h: '2. Your data lives in your browser',
            p: [
              'Conversations, the word bank, usage statistics, interface preferences and your API key are all kept in the localStorage of the browser you are using.',
              'Change browser or device, or clear your browser data, and none of it comes with you and none of it is backed up — because it never left the machine.'
            ]
          },
          {
            h: '3. Where your data is sent',
            p: [
              'When you send a message, its content and your API key go straight from your browser to the model endpoint you configured (https://api.deepseek.com by default).',
              'The request passes through no server of ours, and we cannot read what it contains.'
            ]
          },
          {
            h: '4. Third parties (model providers)',
            p: [
              'The model provider handles what you send under its own privacy policy in order to produce a reply. Read the policy of the provider you use (DeepSeek, for example) to understand how it processes and retains data.',
              'If you switch to another endpoint (OpenAI, Kimi, Qwen, a local Ollama, and so on), that provider’s rules apply instead.'
            ]
          },
          {
            h: '5. Keeping your API key safe',
            p: [
              'The key is stored only in the local browser. Avoid entering it on a shared computer, and be aware of browser extensions and browser account sync — sync can carry localStorage onto your other devices.'
            ]
          },
          {
            h: '6. Deleting your data',
            p: [
              'Under Settings → Data you can wipe conversations, the word bank or usage statistics separately, or restore the defaults; clearing browser data removes everything at once. Deletion cannot be undone.'
            ]
          },
          {
            h: '7. Children',
            p: ['The app is not designed for a particular age group and collects no data about children (because it collects no data at all). Minors should use it with a guardian’s guidance.']
          },
          {
            h: '8. Changes and contact',
            p: ['If this policy changes, the date at the top of this document changes with it. For any privacy question, open an issue in the project repository and we will get back to you.']
          }
        ]
      }
    }
  }
};

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

export function Legal({ kind }) {
  const [lang, setLang] = useState(initialLang);
  const t = COPY[lang];
  const doc = t.docs[kind];
  const mine = t.titles[kind];

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = mine.htmlTitle;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* the toggle still works for this visit */
    }
  }, [lang, mine]);

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href={BASE + 'about'}>
            <span className="brand-mark" aria-hidden="true">
              D
            </span>
            <span className="brand-text">
              <b>DeepTalk</b>
              <small>{t.brandTag}</small>
            </span>
          </a>

          <nav className="topnav" aria-label={mine.doc}>
            {['about', 'terms', 'privacy'].map(id => (
              <a key={id} href={BASE + id} className={id === kind ? 'active' : ''} aria-current={id === kind ? 'page' : undefined}>
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

          <a className="open-btn" href={BASE}>
            {t.openApp} <ArrowRight size={15} />
          </a>
        </div>
      </header>

      <main className="legal-main">
        <div className="doc">
          <p className="eyebrow">{mine.eyebrow}</p>
          <h1>{mine.doc}</h1>
          <p className="doc-updated">
            {t.updated} {t.updatedDate}
          </p>
          <p className="doc-intro">{doc.intro}</p>
          <p className="doc-meta">{doc.meta}</p>

          <div className="doc-body">
            {doc.sections.map(section => (
              <section className="doc-section" key={section.h}>
                <h2>{section.h}</h2>
                {section.p.map(para => (
                  <p key={para}>{para}</p>
                ))}
              </section>
            ))}
          </div>

          <div className="doc-contact">
            <Mail size={15} />
            <span>{t.contact}</span>
            <a href={REPO} target="_blank" rel="noreferrer">
              {REPO.replace('https://', '')}
            </a>
          </div>

          <a className="doc-back" href={BASE + 'about'}>
            <ArrowLeft size={14} /> {t.backToAbout}
          </a>
        </div>
      </main>

      <footer className="footer footer-legal">
        <span>{t.footer}</span>
        <span className="footer-links">
          <a href={BASE + 'about'}>{t.nav.about}</a>
          <a href={BASE + 'terms'}>{t.nav.terms}</a>
          <a href={BASE + 'privacy'}>{t.nav.privacy}</a>
        </span>
      </footer>
    </div>
  );
}

export function mountLegal(kind) {
  createRoot(document.getElementById('root')).render(<Legal kind={kind} />);
}
