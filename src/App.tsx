import React from 'react';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Foundgarten
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem' }}>
        Foundational Kindergarten learning games
      </p>
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#f0f0f0',
        borderRadius: '12px',
        maxWidth: '500px'
      }}>
        <p style={{ marginBottom: '1rem' }}>
          Project initialized successfully!
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Games coming soon...
        </p>
      </div>
    </div>
  );
}

export default App;
