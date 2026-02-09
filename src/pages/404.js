import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function NotFound() {
  return (
    <Layout title="Page Not Found">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        minHeight: '60vh'
      }}>
        <h1 style={{ 
          fontSize: '6rem', 
          margin: 0,
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          404
        </h1>
        <h2 style={{ marginTop: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--ifm-color-emphasis-600)', marginTop: '0.5rem', maxWidth: '400px' }}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Link
            className="button button--primary"
            to="/"
            style={{ borderRadius: '8px' }}
          >
            🏠 Go Home
          </Link>
          <Link
            className="button button--outline button--primary"
            to="/docs/intro"
            style={{ borderRadius: '8px' }}
          }
          >
            📚 Read Docs
          </Link>
        </div>
      </div>
    </Layout>
  );
}
