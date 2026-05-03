import React, { useRef } from 'react';

const CATEGORY_ICONS = {
  'All': '🌟',
  'Birthday': '🎂',
  'Anniversary': '💑',
  'Festival': '🎊',
  'Love': '❤️',
  'Shayari': '📝',
  'Motivational': '💪',
  'Friendship': '🤝',
  'Good Morning': '☀️',
  'Good Night': '🌙'
};

const CategoryBar = ({ categories, selected, onSelect }) => {
  const scrollRef = useRef(null);

  return (
    <div style={{ position: 'relative', marginBottom: 8 }}>
      <div
        ref={scrollRef}
        style={{
          display: 'flex', gap: 8, overflowX: 'auto',
          padding: '4px 0 12px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            style={{
              flexShrink: 0,
              padding: '8px 16px',
              borderRadius: 24,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Poppins',
              fontWeight: selected === cat ? 600 : 400,
              fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6,
              background: selected === cat ? 'var(--gradient)' : 'var(--bg-surface)',
              color: selected === cat ? 'white' : 'var(--text-muted)',
              border: selected === cat ? 'none' : '1px solid var(--border)',
              boxShadow: selected === cat ? '0 4px 15px rgba(124,58,237,0.3)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <span>{CATEGORY_ICONS[cat] || '✨'}</span>
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
