import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiX, FiDownload, FiShare2, FiMessageCircle, FiMail } from 'react-icons/fi';

const ShareModal = ({ isOpen, onClose, template, canvas }) => {
  const { user } = useAuth();
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    if (isOpen && canvas) {
      setDataUrl(canvas.toDataURL('image/png'));
      // Increment download count
      if (template?._id) {
        axios.post(`/api/templates/${template._id}/download`).catch(() => {});
      }
    }
  }, [isOpen, canvas, template]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `greetme_${template?.title?.replace(/\s/g,'_') || 'card'}.png`;
    a.click();
    toast.success('Image saved! 📥');
  };

  const handleNativeShare = async () => {
    if (!dataUrl) return;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'greetme_card.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `${user?.name} - ${template?.title}`,
          text: `Check out this greeting made with GreetMe! 🎉`,
          files: [file]
        });
      } else {
        // Fallback
        handleDownload();
        toast('Share manually after downloading! 📤');
      }
    } catch (err) {
      if (err.name !== 'AbortError') toast.error('Share failed, try downloading');
    }
  };

  const handleWhatsApp = async () => {
    if (dataUrl) {
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          const blob = await (await fetch(dataUrl)).blob();
          await navigator.clipboard.write([
            new window.ClipboardItem({
              [blob.type]: blob
            })
          ]);
          toast.success('Image copied! Just paste it in your WhatsApp chat 📋', { duration: 5000 });
        } else {
          throw new Error('Clipboard not supported');
        }
      } catch (err) {
        handleDownload();
        toast('Image saved! Please attach it manually in WhatsApp 📤', { duration: 5000 });
      }
    }
    
    setTimeout(() => {
      window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this greeting I made with GreetMe! 🎉`)}`, '_blank');
    }, 1000);
  };

  const handleEmail = () => {
    handleDownload();
    window.open(`mailto:?subject=Greeting from ${user?.name}&body=Check out this greeting I made! Download the attached image.`);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.8)',
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
          padding: 24,
          maxWidth: 420,
          width: '100%',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14,
            background: 'var(--bg-surface)', border: 'none',
            borderRadius: '50%', width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)'
          }}
        >
          <FiX size={14} />
        </button>

        <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 18 }}>Share Your Greeting 🎉</h3>

        {/* Preview */}
        {dataUrl && (
          <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 20, border: '1px solid var(--border)' }}>
            <img src={dataUrl} alt="preview" style={{ width: '100%', display: 'block' }} />
          </div>
        )}

        {/* Share options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <button className="btn btn-primary" onClick={handleNativeShare} style={{ justifyContent: 'center' }}>
            <FiShare2 /> Share
          </button>
          <button className="btn btn-secondary" onClick={handleDownload} style={{ justifyContent: 'center' }}>
            <FiDownload /> Download
          </button>
          <button
            onClick={handleWhatsApp}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: '#25D366', color: 'white', fontFamily: 'Poppins', fontWeight: 500, fontSize: 14
            }}
          >
            <FiMessageCircle /> WhatsApp
          </button>
          <button
            onClick={handleEmail}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer',
              background: 'var(--bg-surface)', color: 'var(--text)', fontFamily: 'Poppins', fontWeight: 500, fontSize: 14
            }}
          >
            <FiMail /> Email
          </button>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
          💡 Tip: Download first, then share on Instagram or other apps
        </p>
      </div>
    </div>
  );
};

export default ShareModal;
