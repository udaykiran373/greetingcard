import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Shared/Navbar';
import CategoryBar from '../components/Home/CategoryBar';
import TemplateCard from '../components/Card/TemplateCard';
import PremiumModal from '../components/Premium/PremiumModal';
import ShareModal from '../components/Card/ShareModal';
import { FiSearch, FiTrendingUp } from 'react-icons/fi';

const HomePage = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showPremium, setShowPremium] = useState(false);
  const [shareData, setShareData] = useState({ show: false, template: null, canvas: null });

  // Fetch categories
  useEffect(() => {
    axios.get('/api/templates/categories')
      .then(r => setCategories(r.data.categories))
      .catch(() => {});
    // Seed templates on first load
    axios.post('/api/templates/seed').catch(() => {});
  }, []);

  // Fetch templates
  const fetchTemplates = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const params = { category: selectedCategory, page: reset ? 1 : page, limit: 12 };
      if (search) params.search = search;
      const { data } = await axios.get('/api/templates', { params });
      if (reset) {
        setTemplates(data.templates);
        setPage(1);
      } else {
        setTemplates(prev => [...prev, ...data.templates]);
      }
      setHasMore(data.pagination.page < data.pagination.pages);
    } catch (err) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search, page]);

  // Reset & refetch on category/search change
  useEffect(() => {
    fetchTemplates(true);
    // eslint-disable-next-line
  }, [selectedCategory]);

  // Search with debounce
  useEffect(() => {
    const t = setTimeout(() => fetchTemplates(true), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleShareClick = (template, canvas) => {
    setShareData({ show: true, template, canvas });
  };

  const handlePremiumClose = () => {
    setShowPremium(false);
    if (user?.isPremium) fetchTemplates(true);
  };

  const avatarGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️ Good Morning';
    if (hour < 17) return '🌤 Good Afternoon';
    return '🌙 Good Evening';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar onPremiumClick={() => setShowPremium(true)} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
        {/* Hero greeting */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-glow) 0%, var(--secondary-glow) 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: 24,
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 4 }}>{avatarGreeting()}</p>
            <h1 className="greeting-title" style={{ fontSize: 28, fontWeight: 700 }}>
              Hello, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Friend'}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
              Choose a template — your photo & name are auto-added!
            </p>
          </div>
          {user?.profilePicture ? (
            <img
              src={user.profilePicture.startsWith('/') ? `http://localhost:5000${user.profilePicture}` : user.profilePicture}
              alt="profile"
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
            />
          ) : (
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26
            }}>
              {user?.name?.[0]?.toUpperCase() || '👤'}
            </div>
          )}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <FiSearch style={{
            position: 'absolute', left: 16, top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)'
          }} />
          <input
            className="input-field"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search templates..."
            style={{ paddingLeft: 44, borderRadius: 40 }}
          />
        </div>

        {/* Category bar */}
        <CategoryBar
          categories={categories || ['All']}
          selected={selectedCategory}
          onSelect={handleCategorySelect}
        />

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          {search ? <FiSearch size={16} color="var(--primary-light)" /> : <FiTrendingUp size={16} color="var(--primary-light)" />}
          <span style={{ fontWeight: 600, fontSize: 16 }}>
            {search ? `Results for "${search}"` : `${selectedCategory === 'All' ? 'All Templates' : selectedCategory}`}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>({templates.length} cards)</span>
        </div>

        {/* Templates Grid */}
        {loading && templates.length === 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius)' }} />
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 16, fontWeight: 500 }}>No templates found</p>
            <p style={{ fontSize: 13 }}>Try a different category or search term</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {templates.map(t => (
                <TemplateCard
                  key={t._id}
                  template={t}
                  onPremiumClick={() => setShowPremium(true)}
                  onShare={handleShareClick}
                />
              ))}
            </div>
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setPage(p => p + 1); fetchTemplates(); }}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <PremiumModal isOpen={showPremium} onClose={handlePremiumClose} />
      <ShareModal
        isOpen={shareData.show}
        onClose={() => setShareData({ show: false, template: null, canvas: null })}
        template={shareData.template}
        canvas={shareData.canvas}
      />
    </div>
  );
};

export default HomePage;
