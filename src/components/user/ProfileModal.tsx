'use client';

import { useState } from 'react';
import { dismissProfilePrompt, saveUserProfile, useUserProfile } from '@/lib/userProfile';
import { Icon } from '@/components/ui/Icon';
import { useProgress } from '@/lib/progress';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInitialPrompt?: boolean;
}

export function ProfileModal({ isOpen, onClose, isInitialPrompt = false }: ProfileModalProps) {
  const currentProfile = useUserProfile();
  const p = useProgress();

  const [name, setName] = useState(currentProfile?.name || '');
  const [institute, setInstitute] = useState(currentProfile?.institute || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    const saved = saveUserProfile(name, institute);

    // Sync to backend immediately
    try {
      const doneCount = Object.values(p.levels).filter((l) => l.done).length;
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: saved.id,
          name: saved.name,
          institute: saved.institute,
          xp: p.xp,
          streakDays: p.streak.days || 1,
          levelsDone: doneCount,
        }),
      }).catch(() => {});
    } catch {
      /* ignore */
    }

    onClose();
  };

  const handleSkip = () => {
    dismissProfilePrompt();
    onClose();
  };

  const initials = (name.trim() || 'You')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join('');

  return (
    <div className="cmp-scrim profile-modal-scrim" role="dialog" aria-modal="true" aria-labelledby="profile-title">
      <div className="cmp profile-modal-box">
        <div className="cmp-head">
          <div className="cmp-title">
            <span className="profile-head-icon">
              <Icon name="user" size={20} />
            </span>
            <strong id="profile-title">{isInitialPrompt ? 'Welcome to DryRun!' : 'Edit Your Learner Profile'}</strong>
          </div>
          {!isInitialPrompt && (
            <button className="icon-btn" onClick={onClose} aria-label="Close modal">
              <Icon name="x" />
            </button>
          )}
        </div>

        <div className="profile-modal-body">
          <p className="profile-modal-desc">
            {isInitialPrompt
              ? 'Enter your name to track your daily streak, earn XP points for every solved question, and appear on the live community leaderboard.'
              : 'Update your name and university/institute details. Your progress and points will be saved automatically in this browser.'}
          </p>

          {/* Live Preview Card */}
          <div className="profile-preview-card">
            <div className="profile-preview-avatar">{initials || 'U'}</div>
            <div className="profile-preview-info">
              <div className="profile-preview-name">{name.trim() || 'Your Name'}</div>
              <div className="profile-preview-inst">{institute.trim() || 'University / Institute'}</div>
            </div>
            <div className="profile-preview-stats">
              <span className="profile-stat-badge" title="XP Points">
                <Icon name="bolt" size={13} /> {p.xp} XP
              </span>
              <span className="profile-stat-badge streak" title="Streak">
                <Icon name="flame" size={13} /> {p.streak.days || 1}d
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-field">
              <label htmlFor="usr-name">
                Your Name <span className="req">*</span>
              </label>
              <input
                id="usr-name"
                type="text"
                autoFocus
                placeholder="e.g. Hamid Ali, Ayesha..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                maxLength={40}
                className="profile-input"
              />
              {error && <span className="profile-field-err">{error}</span>}
            </div>

            <div className="profile-field">
              <label htmlFor="usr-inst">
                University / Institute <span className="opt">(Optional)</span>
              </label>
              <input
                id="usr-inst"
                type="text"
                placeholder="e.g. FAST NUCES Islamabad, NUST, etc."
                value={institute}
                onChange={(e) => setInstitute(e.target.value)}
                maxLength={60}
                className="profile-input"
              />
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn btn-primary btn-lg profile-submit-btn">
                <Icon name="check" /> {isInitialPrompt ? 'Start Learning' : 'Save Changes'}
              </button>
              {isInitialPrompt && (
                <button type="button" onClick={handleSkip} className="btn btn-ghost profile-skip-btn">
                  Skip for now
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
