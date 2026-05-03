import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { FiX, FiStar, FiCheck, FiZap } from 'react-icons/fi';

const PremiumModal = ({ isOpen, onClose }) => {
  const { updateUser, user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      axios.get('/api/subscriptions/plans')
        .then(r => setPlans(r.data.plans))
        .catch(() => {});
    }
  }, [isOpen]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/subscriptions/activate', { plan: selectedPlan });
      if (data.success) {
        updateUser(data.user);
        toast.success('🎉 Premium activated! Enjoy all templates!');
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-in"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 32,
          maxWidth: 480,
          width: '100%',
          position: 'relative'
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'var(--bg-surface)', border: 'none',
            borderRadius: '50%', width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)'
          }}
        >
          <FiX />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⭐</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
            Unlock <span className="gradient-text">Premium</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Access all premium templates and exclusive features
          </p>
        </div>

        {/* Features */}
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24
        }}>
          {[
            '✨ All premium templates unlocked',
            '📥 HD downloads without watermarks',
            '🚀 New templates every week',
            '💬 Priority customer support',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
              <FiCheck color="#10b981" size={16} />
              <span style={{ fontSize: 14, color: 'var(--text)' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {plans.map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              style={{
                flex: 1,
                border: `2px solid ${selectedPlan === plan.id ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 12,
                padding: '16px 12px',
                cursor: 'pointer',
                background: selectedPlan === plan.id ? 'rgba(124,58,237,0.1)' : 'var(--bg-surface)',
                transition: 'all 0.2s',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--gradient-gold)',
                  color: '#1a1030',
                  padding: '2px 10px',
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}>BEST VALUE</div>
              )}
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-light)' }}>
                ₹{plan.price}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{plan.duration}</div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={handleSubscribe}
          disabled={loading}
        >
          {loading
            ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            : <FiZap />}
          {loading ? 'Activating...' : `Subscribe - ₹${plans.find(p => p.id === selectedPlan)?.price || '...'}`}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
          🔒 Secure payment • Cancel anytime
        </p>
      </div>
    </div>
  );
};

export default PremiumModal;
