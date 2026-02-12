import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { UserProfile, UserNote } from '../types';

interface NoteCardGeneratorProps {
  note: UserNote & { article_title?: string };
  userProfile: UserProfile;
  onClose: () => void;
}

const CARD_W = 1080;
const CARD_H = 1920;
const DISPLAY_SCALE = 0.31;

const themes = [
  { id: 'forest',   name: 'Forest',   from: '#065f46', to: '#10b981', text: '#ffffff', accent: '#6ee7b7', overlay: 'rgba(0,0,0,0.18)' },
  { id: 'ocean',    name: 'Ocean',    from: '#0c4a6e', to: '#0ea5e9', text: '#ffffff', accent: '#7dd3fc', overlay: 'rgba(0,0,0,0.18)' },
  { id: 'sunset',   name: 'Sunset',   from: '#7c2d12', to: '#f97316', text: '#ffffff', accent: '#fed7aa', overlay: 'rgba(0,0,0,0.15)' },
  { id: 'lavender', name: 'Lavender', from: '#4c1d95', to: '#8b5cf6', text: '#ffffff', accent: '#ddd6fe', overlay: 'rgba(0,0,0,0.15)' },
  { id: 'earth',    name: 'Earth',    from: '#1c1917', to: '#78716c', text: '#ffffff', accent: '#d6d3d1', overlay: 'rgba(0,0,0,0.20)' },
  { id: 'sky',      name: 'Sky',      from: '#e0f7fa', to: '#b2ebf2', text: '#004d40', accent: '#00695c', overlay: 'rgba(255,255,255,0.20)' },
];

// Word-wrap helper for canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length >= maxLines - 1) {
        // Remaining words go in last line with ellipsis if needed
        const remaining = words.slice(words.indexOf(word)).join(' ');
        let lastLine = word;
        for (let i = words.indexOf(word) + 1; i < words.length; i++) {
          const t = `${lastLine} ${words[i]}`;
          if (ctx.measureText(t + '…').width > maxWidth) {
            lastLine += '…';
            break;
          }
          lastLine = t;
        }
        lines.push(lastLine);
        return lines;
      }
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export default function NoteCardGenerator({ note, userProfile, onClose }: NoteCardGeneratorProps) {
  const [themeIdx, setThemeIdx] = useState(0);
  const [sharing, setSharing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const theme = themes[themeIdx];
  const displayName =
    userProfile.display_name || userProfile.email?.split('@')[0] || 'Climate Writer';
  const streakCount = userProfile.streak || 0;

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CARD_W, CARD_H);

    // --- Background gradient ---
    const bg = ctx.createLinearGradient(0, 0, 0, CARD_H);
    bg.addColorStop(0, theme.from);
    bg.addColorStop(1, theme.to);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    // --- Subtle decorative circles ---
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = theme.text;
    ctx.beginPath();
    ctx.arc(CARD_W * 0.88, CARD_H * 0.10, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(CARD_W * 0.08, CARD_H * 0.90, 240, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- Top branded bar ---
    ctx.save();
    ctx.fillStyle = theme.overlay;
    ctx.fillRect(0, 0, CARD_W, 180);
    ctx.restore();

    // Branding text
    ctx.save();
    ctx.fillStyle = theme.text;
    ctx.font = 'bold 56px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('The Climate Note', CARD_W / 2, 90);
    ctx.restore();

    // Thin divider line
    ctx.save();
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(160, 178);
    ctx.lineTo(CARD_W - 160, 178);
    ctx.stroke();
    ctx.restore();

    // --- Opening quote mark ---
    ctx.save();
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.35;
    ctx.font = 'bold 320px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('\u201C', 60, 560);
    ctx.restore();

    // --- Note text (wrapped, centered) ---
    ctx.save();
    ctx.fillStyle = theme.text;
    ctx.font = 'bold 70px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const lines = wrapText(ctx, note.content, 900, 10);
    const lineHeight = 104;
    const totalTextH = lines.length * lineHeight;
    // Center text vertically in the usable area (180 top bar to 1540 bottom section)
    const usableCenter = (180 + 1540) / 2;
    const textStartY = usableCenter - totalTextH / 2 - 20;

    lines.forEach((line, i) => {
      ctx.fillText(line, CARD_W / 2, textStartY + i * lineHeight);
    });
    ctx.restore();

    // --- Closing quote mark ---
    ctx.save();
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.35;
    ctx.font = 'bold 320px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('\u201D', CARD_W - 60, textStartY + totalTextH + 220);
    ctx.restore();

    // --- Bottom section ---
    ctx.save();
    ctx.fillStyle = theme.overlay;
    ctx.fillRect(0, 1540, CARD_W, CARD_H - 1540);
    ctx.restore();

    // Author name
    ctx.save();
    ctx.fillStyle = theme.text;
    ctx.font = 'bold 68px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayName, CARD_W / 2, 1620);
    ctx.restore();

    // Streak
    if (streakCount > 0) {
      ctx.save();
      ctx.fillStyle = theme.accent;
      ctx.font = '52px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`\uD83D\uDD25 ${streakCount} day streak`, CARD_W / 2, 1710);
      ctx.restore();
    }

    // Date
    const dateStr = new Date(note.created_at).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    ctx.save();
    ctx.fillStyle = theme.text;
    ctx.globalAlpha = 0.6;
    ctx.font = '44px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dateStr, CARD_W / 2, 1800);
    ctx.restore();

    // Website watermark
    ctx.save();
    ctx.fillStyle = theme.text;
    ctx.globalAlpha = 0.35;
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('theclimatnote.com', CARD_W / 2, 1880);
    ctx.restore();
  }, [theme, note, userProfile, displayName, streakCount]);

  useEffect(() => {
    drawCard();
  }, [drawCard]);

  const getBlob = (): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) return reject(new Error('No canvas'));
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
        'image/png'
      );
    });

  const handleDownload = async () => {
    const blob = await getBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `climate-note-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const blob = await getBlob();
      const file = new File([blob], 'climate-note.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Climate Note',
          text: 'Check out my climate action note on The Climate Note!',
        });
      } else {
        // Fallback: download
        await handleDownload();
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed, downloading instead:', err);
        await handleDownload();
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xs flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Share Your Note</h3>
            <p className="text-xs text-gray-400 mt-0.5">Instagram story size (1080×1920)</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Preview — scrollable container so it doesn't overflow on small phones */}
        <div className="flex items-center justify-center bg-gray-100 py-4 px-4 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={CARD_W}
            height={CARD_H}
            style={{
              width: `${Math.round(CARD_W * DISPLAY_SCALE)}px`,
              height: `${Math.round(CARD_H * DISPLAY_SCALE)}px`,
              borderRadius: '10px',
              boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
              display: 'block',
            }}
          />
        </div>

        {/* Theme Picker */}
        <div className="px-5 pt-3 pb-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-2">Color theme</p>
          <div className="flex gap-2">
            {themes.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setThemeIdx(i)}
                title={t.name}
                className={`w-8 h-8 rounded-full border-[3px] transition-all flex-shrink-0 ${
                  themeIdx === i ? 'border-gray-800 scale-110' : 'border-transparent'
                }`}
                style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-5 py-4 flex gap-3 border-t border-gray-100">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            {sharing ? 'Sharing…' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  );
}
