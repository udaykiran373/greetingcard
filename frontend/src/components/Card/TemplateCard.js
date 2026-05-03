import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiStar, FiShare2, FiDownload } from 'react-icons/fi';

const TemplateCard = ({ template, onPremiumClick, onShare }) => {
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const [rendered, setRendered] = useState(false);

  const isPremiumLocked = template.isPremium && !user?.isPremium;

  const parseGradientColors = (gradientString) => {
    if (!gradientString) return ['#e11d48', '#fbbf24'];

    const linearMatch = gradientString.match(/linear-gradient\(([^)]+)\)/i);
    if (linearMatch) {
      const parts = linearMatch[1].split(/,(?![^()]*\))/).map(p => p.trim());
      const colors = parts.filter(part => !/^\s*(?:to |[0-9.]+deg|[0-9.]+rad|[0-9.]+grad|[0-9.]+turn)/i.test(part));
      if (colors.length >= 2) {
        return [colors[0], colors[colors.length - 1]];
      }
      if (colors.length === 1) {
        return [colors[0], colors[0]];
      }
    }

    const colors = gradientString.match(/#([0-9a-f]{3,6})|rgba?\([^\)]+\)/gi);
    if (colors && colors.length >= 2) {
      return [colors[0], colors[1]];
    }

    const commaColors = gradientString.split(/,(?![^()]*\))/).map(p => p.trim()).filter(Boolean);
    if (commaColors.length >= 2) {
      return [commaColors[0], commaColors[commaColors.length - 1]];
    }

    return ['#e11d48', '#fbbf24'];
  };

  const createCanvasGradient = (ctx, width, height, gradientString) => {
    const [startColor, endColor] = parseGradientColors(gradientString);
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, startColor);
    grad.addColorStop(1, endColor);
    return grad;
  };

  const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    words.forEach((word, index) => {
      const testLine = `${line}${word} `;
      const { width: testWidth } = ctx.measureText(testLine);
      if (testWidth > maxWidth && line) {
        ctx.fillText(line.trim(), x, currentY);
        line = `${word} `;
        currentY += lineHeight;
      } else {
        line = testLine;
      }

      if (index === words.length - 1) {
        ctx.fillText(line.trim(), x, currentY);
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !user) return;

    const ctx = canvas.getContext('2d');
    const cw = 360;
    const ch = 480;
    canvas.width = cw;
    canvas.height = ch;
    setRendered(false);

    // Background gradient
    ctx.fillStyle = createCanvasGradient(ctx, cw, ch, template.gradient);
    ctx.fillRect(0, 0, cw, ch);

    // Decorative glows
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cw * 0.23, ch * 0.18, cw * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cw * 0.78, ch * 0.25, cw * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Emoji
    if (template.emoji) {
      ctx.font = '72px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(template.emoji, cw / 2, ch * 0.2);
    }

    // Title label
    ctx.font = '700 32px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(template.title || 'Greeting', cw / 2, ch * 0.35);

    const ov = template.profileOverlay || { x: 50, y: 55, size: 28 };
    const size = (ov.size / 100) * cw;
    const px = (cw - size) / 2;
    const py = (ch * 0.48);

    const drawProfile = () => {
      const radius = size / 2;
      const centerX = px + radius;
      const centerY = py + radius;

      const drawClippedImage = (img) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(px, py, size, size);

        if (img) {
          ctx.drawImage(img, px, py, size, size);
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 42px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const initial = user.name?.[0]?.toUpperCase() || 'A';
          ctx.fillText(initial, px + size / 2, py + size / 2);
        }

        ctx.restore();
        drawProfileBorder();
        drawNameAndWish();
      };

      if (user.profilePicture) {
        const profImg = new Image();
        profImg.crossOrigin = 'anonymous';
        const profUrl = user.profilePicture.startsWith('/')
          ? `http://localhost:5000${user.profilePicture}`
          : user.profilePicture;

        profImg.onload = () => drawClippedImage(profImg);
        profImg.onerror = () => drawClippedImage(null);
        profImg.src = profUrl;
      } else {
        drawClippedImage(null);
      }
    };



    const drawProfileBorder = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(px + size / 2, py + size / 2, size / 2 + 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    };

    const drawNameAndWish = () => {
      const nameY = py + size + 28;
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(cw * 0.14, nameY - 16, cw * 0.72, 46);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 18px Poppins, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(user.name || 'Your Name', cw / 2, nameY - 12);

      if (template.wish) {
        ctx.font = '500 14px Poppins, Arial, sans-serif';
        drawWrappedText(ctx, template.wish, cw / 2, nameY + 18, cw * 0.72, 18);
      }

      if (isPremiumLocked) {
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(0, 0, cw, ch);
      }

      setRendered(true);
    };

    drawProfile();
  }, [template, user, isPremiumLocked]);

  const handleClick = () => {
    if (isPremiumLocked) {
      onPremiumClick();
    } else {
      onShare && onShare(template, canvasRef.current);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        aspectRatio: '3/4',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Canvas preview */}
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* Loading skeleton */}
      {!rendered && (
        <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
      )}

      {/* Premium badge */}
      {template.isPremium && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'var(--gradient-gold)',
          color: '#1a1030',
          padding: '4px 10px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          <FiStar size={10} /> Premium
        </div>
      )}

      {/* Premium locked overlay */}
      {isPremiumLocked && rendered && (
        <div
          onClick={handleClick}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 8
          }}
        >
          <div style={{ fontSize: 36 }}>🔒</div>
          <div style={{
            background: 'var(--gradient)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600
          }}>Unlock Premium</div>
        </div>
      )}

      {/* Share/Download overlay (free templates) */}
      {!isPremiumLocked && rendered && (
        <div
          onClick={handleClick}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            padding: 12,
            opacity: 0,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0'}
        >
          <div style={{
            display: 'flex', gap: 8,
            background: 'rgba(0,0,0,0.7)',
            padding: '8px 12px',
            borderRadius: 20,
          }}>
            <span style={{ color: 'white', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiShare2 size={14} /> Share
            </span>
            <span style={{ color: 'white', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiDownload size={14} /> Save
            </span>
          </div>
        </div>
      )}

      {/* Category label */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        padding: '20px 10px 8px',
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)'
      }}>
        {template.category}
      </div>
    </div>
  );
};

export default TemplateCard;
