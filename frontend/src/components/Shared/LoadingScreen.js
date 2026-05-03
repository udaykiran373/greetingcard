import React from 'react';

const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    gap: '16px'
  }}>
    <div style={{
      width: 60, height: 60,
      background: 'var(--gradient)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 28,
      animation: 'pulse 1.5s ease infinite'
    }}>🎉</div>
    <div className="spinner" />
    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading GreetMe...</p>
  </div>
);

export default LoadingScreen;
