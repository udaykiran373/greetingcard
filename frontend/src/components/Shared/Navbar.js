import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiLogOut, FiStar, FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({ onPremiumClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const avatarUrl = user?.profilePicture
    ? (user.profilePicture.startsWith('/') ? `http://localhost:5000${user.profilePicture}` : user.profilePicture)
    : null;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(15, 10, 30, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 20px',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 64
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        >
          <span style={{ fontSize: 24 }}>🎉</span>
          <span style={{ fontWeight: 800, fontSize: 20, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            GreetMe
          </span>
        </div>

        {/* Desktop Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!user?.isPremium && (
            <button
              className="btn btn-gold"
              onClick={onPremiumClick}
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              <FiStar size={14} />
              Go Premium
            </button>
          )}
          {user?.isPremium && (
            <span style={{
              background: 'var(--gradient-gold)',
              color: '#1a1030',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700
            }}>⭐ Premium</span>
          )}
          <button
            onClick={() => navigate('/profile')}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: 40, height: 40,
              cursor: 'pointer',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {avatarUrl
              ? <img src={avatarUrl} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <FiUser size={18} color="var(--text-muted)" />}
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
