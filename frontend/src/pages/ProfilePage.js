import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiCamera, FiUser, FiStar, FiCalendar, FiShield } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [name, setName] = useState(user?.name || '');
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const avatarUrl = preview
    || (user?.profilePicture
      ? (user.profilePicture.startsWith('/') ? `http://localhost:5000${user.profilePicture}` : user.profilePicture)
      : null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error('Image must be < 5MB'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (file) formData.append('profilePicture', file);

      const { data } = await axios.put('/api/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        updateUser(data.user);
        setPreview(null);
        setFile(null);
        toast.success('Profile updated! ✨');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '20px 16px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: '50%', width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text)'
            }}
          >
            <FiArrowLeft />
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>My Profile</h1>
        </div>

        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: avatarUrl ? 'transparent' : 'var(--gradient)',
              overflow: 'hidden',
              border: '3px solid var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 36, color: 'white' }}>{user?.name?.[0]?.toUpperCase() || '👤'}</span>}
            </div>
            <button
              onClick={() => fileRef.current.click()}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                background: 'var(--gradient)', border: 'none',
                borderRadius: '50%', width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              <FiCamera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>Tap camera to change photo</p>
        </div>

        {/* Form */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 24,
          marginBottom: 16
        }}>
          <div className="input-group" style={{ marginBottom: 20 }}>
            <label>Display Name</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input-field"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                style={{ paddingLeft: 40 }}
              />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>This name appears on your greeting cards</p>
          </div>

          <div className="input-group" style={{ marginBottom: 24 }}>
            <label>Email</label>
            <input
              className="input-field"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleSave}
            disabled={saving || (!file && name === user?.name)}
          >
            {saving ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : null}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Subscription Info */}
        <div style={{
          background: 'var(--bg-card)',
          border: `1px solid ${user?.isPremium ? 'rgba(245,158,11,0.4)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: 20,
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <FiStar color={user?.isPremium ? '#f59e0b' : 'var(--text-muted)'} size={18} />
            <span style={{ fontWeight: 600 }}>Subscription</span>
          </div>

          {user?.isPremium ? (
            <div>
              <div style={{
                background: 'var(--gradient-gold)',
                color: '#1a1030',
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 8
              }}>⭐ Premium Active</div>
              {user?.subscription?.endDate && (
                <p style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiCalendar size={13} />
                  Valid until: {new Date(user.subscription.endDate).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
                You're on the Free plan. Upgrade to access all premium templates.
              </p>
              <button
                className="btn btn-gold"
                onClick={() => navigate('/')}
                style={{ fontSize: 13 }}
              >
                <FiStar size={14} /> Upgrade to Premium
              </button>
            </div>
          )}
        </div>

        {/* Account */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <FiShield color="var(--text-muted)" size={18} />
            <span style={{ fontWeight: 600 }}>Account</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Account type</span>
              <span>{user?.isGuest ? '👤 Guest' : '📧 Email'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Member since</span>
              <span>{new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => { logout(); navigate('/login'); }}
          style={{
            width: '100%', marginTop: 16,
            padding: '12px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--danger)',
            background: 'transparent',
            color: 'var(--danger)',
            cursor: 'pointer',
            fontFamily: 'Poppins', fontWeight: 500, fontSize: 14
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
