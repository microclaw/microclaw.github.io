import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {useState} from 'react';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const installCommand = 'curl -fsSL https://microclaw.ai/install.sh | bash';
  const [copyStatus, setCopyStatus] = useState('idle');

  const copyInstallCommand = async () => {
    let copied = false;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(installCommand);
        copied = true;
      } else if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = installCommand;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      copied = false;
    }
    if (copied) {
      setCopyStatus('copied');
      window.setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  return (
    <header className={styles.hero}>
      <div className={styles.heroGlow} />
      <div className={styles.heroGrid} />
      <div className="container">
        <div className={styles.heroLayout}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Rust + Agentic + Tools</div>
          <Heading as="h1" className={styles.heroTitle}>
            MicroClaw brings agentic AI to your chats.
          </Heading>
          <p className={styles.heroSubtitle}>
            {siteConfig.tagline}
            <span className={styles.noticeBadge}>
              Under active development; instability is possible.
            </span>
          </p>
          <div className={styles.heroActions}>
            <Link className="button button--primary button--lg" to="/docs/quickstart">
              Get Started
            </Link>
            <Link className={styles.githubButton} href="https://github.com/microclaw/microclaw">
              View on GitHub
            </Link>
          </div>
          <div className={styles.installBlock}>
            <span className={styles.installLabel}>One-line install</span>
            <div className={styles.installRow}>
              <code className={styles.installCommand}>{installCommand}</code>
              <button
                className={`${styles.copyButton} ${copyStatus === 'copied' ? styles.copyButtonCopied : ''}`}
                type="button"
                onClick={copyInstallCommand}>
                {copyStatus === 'copied' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
        <div className={styles.heroPanel}>
          <div className={styles.panelHeader}>
            <span>microclaw</span>
            <span className={styles.panelStatus}>online</span>
          </div>
          <div className={styles.panelBody}>
            <div className={styles.heroVisual}>
              <div className={styles.orbit} />
              <div className={styles.orbitOrbit} />
              <div className={styles.orbitCore} />
              <div className={styles.orbitShard} />
              <div className={styles.orbitShardAlt} />
            </div>
            <div className={styles.visualCaption}>
              <span>Agent loop</span>
              <span>Tool chain</span>
              <span>Memory sync</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const features = [
    {
      title: 'Agentic Tool Use',
      description:
        'Run bash commands, read and edit files, search codebases, and chain multiple tools in a single request.',
    },
    {
      title: 'Persistent Memory',
      description:
        'Global and per-chat AGENTS.md memories are injected into every system prompt.',
    },
    {
      title: 'Scheduling',
      description:
        'Cron-based recurring tasks and one-shot reminders driven by the same agent loop.',
    },
    {
      title: 'Web Search + Fetch',
      description:
        'DuckDuckGo HTML search with page fetching and HTML stripping for clean summaries.',
    },
    {
      title: 'Single Binary',
      description:
        'Rust build produces a self-contained binary with bundled SQLite.',
    },
  ];
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="MicroClaw is a Rust-first agent framework for chats with tool execution, web browsing, scheduling, and memory.">
      <HomepageHeader />
      <main>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Heading as="h2">What it can do</Heading>
              <p>Everything you expect from an agent, embedded directly in chat.</p>
            </div>
            <div className={styles.featureGrid}>
              {features.map((feature) => (
                <div key={feature.title} className={styles.featureCard}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className={styles.sectionAlt}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Heading as="h2">How the agent loop works</Heading>
              <p>One message triggers a multi-step tool chain until the job is done.</p>
            </div>
            <div className={styles.steps}>
              <div className={styles.stepCard}>
                <span>01</span>
                <h3>Load context</h3>
                <p>Chat history and memory are loaded from SQLite and AGENTS.md files.</p>
              </div>
              <div className={styles.stepCard}>
                <span>02</span>
                <h3>Call model</h3>
                <p>Tool definitions are sent with the prompt for structured tool use.</p>
              </div>
              <div className={styles.stepCard}>
                <span>03</span>
                <h3>Execute tools</h3>
                <p>Tool results feed back into the loop until stop_reason is end_turn.</p>
              </div>
              <div className={styles.stepCard}>
                <span>04</span>
                <h3>Respond</h3>
                <p>Responses are split for channel limits and sent back to chat.</p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.ctaCard}>
              <div>
                <Heading as="h2">Build your own agentic Rust bot.</Heading>
                <p>Get the Quickstart, configure your runtime, and ship in minutes.</p>
              </div>
              <div className={styles.ctaActions}>
                <Link className="button button--primary button--lg" to="/docs/quickstart">
                  Quickstart
                </Link>
                <Link className="button button--secondary button--lg" to="/docs/tools">
                  Explore Tools
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
