import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {useMemo, useState} from 'react';
import styles from './index.module.css';

const INSTALL_OPTIONS = [
  {
    id: 'install',
    label: 'Install Script',
    command: 'curl -fsSL https://microclaw.ai/install.sh | bash',
    hint: 'Recommended for macOS/Linux',
  },
  {
    id: 'brew',
    label: 'Homebrew',
    command: 'brew tap everettjf/tap && brew install microclaw',
    hint: 'Best for Mac developers',
  },
  {
    id: 'cargo',
    label: 'Cargo',
    command:
      'git clone https://github.com/microclaw/microclaw.git && cd microclaw && cargo build --release',
    hint: 'Build from source',
  },
  {
    id: 'docker',
    label: 'Doctor Check',
    command: 'microclaw doctor --json',
    hint: 'Verify runtime health before production',
  },
];

const CAPABILITIES = [
  {
    title: 'Channel-Agnostic Core',
    text: 'One shared agent loop drives Telegram, Discord, Slack, Feishu, and Web adapters.',
  },
  {
    title: 'Tool-Using Agent Loop',
    text: 'The model can chain tools over multiple steps until the task reaches end_turn.',
  },
  {
    title: 'Memory With Quality Gates',
    text: 'File memory + structured SQLite memory with reflector extraction and dedupe lifecycle.',
  },
  {
    title: 'Scheduler + Background Tasks',
    text: 'Cron and one-shot tasks run through the same runtime, not a separate automation stack.',
  },
  {
    title: 'MCP + Skills Federation',
    text: 'Attach external tool servers and domain-specific skills without rewriting the core loop.',
  },
  {
    title: 'Operational Visibility',
    text: 'Usage and memory observability endpoints help teams track quality and drift over time.',
  },
];

const ARCH_STEPS = [
  {
    number: '01',
    title: 'Ingest',
    text: 'Channel adapters normalize inbound events into a single runtime format.',
  },
  {
    number: '02',
    title: 'Assemble Context',
    text: 'Session state, AGENTS.md memory, structured memory, and active skills are injected.',
  },
  {
    number: '03',
    title: 'Reason + Tool Calls',
    text: 'Provider layer streams responses and executes tool calls in a controlled loop.',
  },
  {
    number: '04',
    title: 'Persist + Reflect',
    text: 'Conversations, sessions, and memories are persisted; reflector updates durable facts.',
  },
  {
    number: '05',
    title: 'Deliver',
    text: 'Responses are split by channel limits and emitted with consistent delivery semantics.',
  },
];

const USE_CASES = [
  {
    title: 'Personal Infra Agent',
    text: 'Run one assistant across your chats with memory, scheduling, and shell/file tooling.',
  },
  {
    title: 'Team Operations Bot',
    text: 'Use permission-aware tools and session history to support recurring internal workflows.',
  },
  {
    title: 'Product Prototyping Runtime',
    text: 'Ship new channels and tools quickly on a shared Rust core instead of fragmented bots.',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const [activeInstall, setActiveInstall] = useState(INSTALL_OPTIONS[0].id);
  const [copyStatus, setCopyStatus] = useState('idle');

  const activeInstallOption = useMemo(
    () => INSTALL_OPTIONS.find((item) => item.id === activeInstall) ?? INSTALL_OPTIONS[0],
    [activeInstall],
  );

  const copyInstallCommand = async () => {
    let copied = false;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(activeInstallOption.command);
        copied = true;
      } else if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = activeInstallOption.command;
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
      window.setTimeout(() => setCopyStatus('idle'), 1800);
    }
  };

  return (
    <header className={styles.hero}>
      <div className={styles.heroBackdrop} />
      <div className={styles.heroPattern} />
      <div className="container">
        <div className={styles.heroLayout}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>RUST AGENT RUNTIME</div>
            <Heading as="h1" className={styles.heroTitle}>
              Build one agent core. Deploy it to every chat surface.
            </Heading>
            <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
            <p className={styles.heroSubtext}>
              MicroClaw is optimized for teams that need tool-using automation with durable memory,
              resumable sessions, and channel adapters that do not fork business logic.
            </p>

            <div className={styles.heroActions}>
              <Link className="button button--primary button--lg" to="/docs/quickstart">
                Start in 5 Minutes
              </Link>
              <Link className={styles.darkButton} href="https://github.com/microclaw/microclaw">
                View GitHub
              </Link>
            </div>

            <div className={styles.heroMetaRow}>
              <span>Single Binary</span>
              <span>SQLite Persistence</span>
              <span>MCP + Skills</span>
            </div>
          </div>

          <div className={styles.installPanel}>
            <div className={styles.installHeader}>
              <span>Quickstart CLI</span>
              <span className={styles.pulseDot}>live</span>
            </div>
            <div className={styles.installTabs}>
              {INSTALL_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveInstall(item.id)}
                  className={`${styles.installTab} ${
                    activeInstall === item.id ? styles.installTabActive : ''
                  }`}>
                  {item.label}
                </button>
              ))}
            </div>
            <p className={styles.installHint}>{activeInstallOption.hint}</p>
            <div className={styles.installRow}>
              <code className={styles.installCommand}>{activeInstallOption.command}</code>
              <button
                className={`${styles.copyButton} ${copyStatus === 'copied' ? styles.copyButtonCopied : ''}`}
                type="button"
                onClick={copyInstallCommand}>
                {copyStatus === 'copied' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="MicroClaw is a Rust-first agent runtime for multi-channel chat automation with tools, memory, scheduler, and MCP federation.">
      <HomepageHeader />

      <main>
        <section className={styles.proofStrip}>
          <div className="container">
            <div className={styles.proofGrid}>
              <div>
                <span className={styles.proofLabel}>Architecture</span>
                <p>Channel-agnostic core with adapter-based delivery</p>
              </div>
              <div>
                <span className={styles.proofLabel}>Memory</span>
                <p>AGENTS.md + SQLite structured memory with observability</p>
              </div>
              <div>
                <span className={styles.proofLabel}>Execution</span>
                <p>Tool loop, sub-agents, scheduling, and background tasks</p>
              </div>
              <div>
                <span className={styles.proofLabel}>Extensibility</span>
                <p>Skills catalog plus MCP tool federation</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Heading as="h2">Why teams pick MicroClaw</Heading>
              <p>
                A runtime-centered stack that keeps your logic stable while channels, models, and tools
                evolve.
              </p>
            </div>
            <div className={styles.capabilityGrid}>
              {CAPABILITIES.map((item) => (
                <article key={item.title} className={styles.capabilityCard}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Heading as="h2">Runtime architecture at a glance</Heading>
              <p>
                The same engine powers every conversation, regardless of where users talk to your agent.
              </p>
            </div>
            <div className={styles.archLayout}>
              <div className={styles.archVisualCard}>
                <img
                  src="/img/blog/microclaw-runtime/01-system-architecture.svg"
                  alt="MicroClaw architecture overview"
                />
              </div>
              <div className={styles.archSteps}>
                {ARCH_STEPS.map((step) => (
                  <article key={step.number} className={styles.stepCard}>
                    <span>{step.number}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Heading as="h2">Use MicroClaw for real workloads</Heading>
              <p>From solo operators to platform teams, one core runtime can cover multiple paths.</p>
            </div>
            <div className={styles.useCaseGrid}>
              {USE_CASES.map((useCase) => (
                <article key={useCase.title} className={styles.useCaseCard}>
                  <h3>{useCase.title}</h3>
                  <p>{useCase.text}</p>
                  <Link to="/docs/overview">Read implementation details</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className="container">
            <div className={styles.ctaCard}>
              <div>
                <Heading as="h2">Ship a production-grade Rust agent stack.</Heading>
                <p>
                  Follow Quickstart for setup, then move into tools, permissions, memory, and channel
                  deployment.
                </p>
              </div>
              <div className={styles.ctaActions}>
                <Link className="button button--primary button--lg" to="/docs/quickstart">
                  Quickstart
                </Link>
                <Link className="button button--secondary button--lg" to="/docs/architecture">
                  Architecture Docs
                </Link>
                <Link className={styles.inlineLink} to="/docs/generated-tools">
                  Generated Tools Reference
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
