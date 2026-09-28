'use client';

import { useEffect, useMemo, useState } from 'react';
import { useProgress } from '@/lib/progress';
import { getUserProfile, useUserProfile } from '@/lib/userProfile';
import { Icon } from '@/components/ui/Icon';
import { ProfileModal } from './ProfileModal';
import { Link } from '@/lib/router';

interface UserItem {
  id: string;
  name: string;
  institute?: string;
  xp: number;
  streakDays: number;
  levelsDone: number;
  lastActiveAt: number;
  firstSeenAt: number;
  isOnline: boolean;
  isRegular: boolean;
}

interface CommunityStats {
  totalVisited: number;
  onlineCount: number;
  regularCount: number;
  users: UserItem[];
}

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 45) return 'Just now';
  if (diffSec < 180) return 'Online now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function UsersScreen() {
  const p = useProgress();
  const profile = useUserProfile();
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'online' | 'regular' | 'top'>('all');
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 15000);
    return () => clearInterval(interval);
  }, []);

  // Filter and sort learners
  const filteredUsers = useMemo(() => {
    if (!stats) return [];
    let list = [...stats.users];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          (u.institute && u.institute.toLowerCase().includes(q)),
      );
    }

    // Tab filter
    if (filter === 'online') {
      list = list.filter((u) => u.isOnline);
    } else if (filter === 'regular') {
      list = list.filter((u) => u.isRegular);
      list.sort((a, b) => b.streakDays - a.streakDays || b.xp - a.xp);
    } else if (filter === 'top') {
      list.sort((a, b) => b.xp - a.xp || b.streakDays - a.streakDays);
    }

    return list;
  }, [stats, filter, search]);

  const currentUserId = profile?.id;
  const myUserRecord = stats?.users.find((u) => u.id === currentUserId);
  const myDoneCount = Object.values(p.levels).filter((l) => l.done).length;

  return (
    <div className="users-page">
      {/* Hero & Top Live Counters */}
      <section className="users-hero">
        <div className="users-hero-text">
          <div className="eyebrow">
            <span className="live-dot" /> Live Learner Community
          </div>
          <h1 className="display">Active Learners & Leaderboard</h1>
          <p className="lede">
            Students and developers practicing C++, Object-Oriented Programming, and Data Structures.
            Track who is currently online, who is maintaining regular streaks, and rank on the board.
          </p>
        </div>

        {/* Global Live Stat Counters */}
        <div className="users-stats-grid">
          <div className="stat-card">
            <div className="stat-card-icon tone-users">
              <Icon name="users" size={24} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-val tnum">{stats?.totalVisited ?? '—'}</span>
              <span className="stat-card-lbl">Total Learners Visited</span>
            </div>
          </div>

          <div className="stat-card is-online">
            <div className="stat-card-icon tone-online">
              <span className="pulse-dot" />
              <Icon name="bolt" size={24} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-val tnum">{stats?.onlineCount ?? '—'}</span>
              <span className="stat-card-lbl">Currently Online Now</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon tone-streak">
              <Icon name="flame" size={24} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-val tnum">{stats?.regularCount ?? '—'}</span>
              <span className="stat-card-lbl">Working Regularly (Streak)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Current User's Profile Card */}
      <section className="my-profile-banner">
        <div className="my-profile-head">
          <div className="my-profile-avatar">
            {(profile?.name || 'You')
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((s) => s[0].toUpperCase())
              .join('') || 'U'}
          </div>
          <div className="my-profile-details">
            <div className="my-profile-name-row">
              <h3>{profile?.name || 'Guest Learner'}</h3>
              <span className="my-profile-you-badge">Your Browser Profile</span>
              <span className="my-profile-status-badge online">
                <span className="mini-dot" /> Online Now
              </span>
            </div>
            <div className="my-profile-sub">
              {profile?.institute ? (
                <span className="my-profile-inst">{profile.institute}</span>
              ) : (
                <span className="my-profile-inst muted">No institute added</span>
              )}
              <span className="dot-sep">·</span>
              <span>Saved locally in your browser</span>
            </div>
          </div>
        </div>

        <div className="my-profile-metrics">
          <div className="my-metric">
            <span className="my-metric-val tnum">
              <Icon name="bolt" size={16} /> {p.xp}
            </span>
            <span className="my-metric-lbl">Total XP</span>
          </div>
          <div className="my-metric">
            <span className="my-metric-val tnum">
              <Icon name="flame" size={16} /> {p.streak.days || 1}d
            </span>
            <span className="my-metric-lbl">Day Streak</span>
          </div>
          <div className="my-metric">
            <span className="my-metric-val tnum">
              <Icon name="check-circle" size={16} /> {myDoneCount}
            </span>
            <span className="my-metric-lbl">Levels Cleared</span>
          </div>
          <button className="btn btn-ghost my-edit-btn" onClick={() => setEditModal(true)}>
            <Icon name="pencil" size={15} /> Edit Profile
          </button>
        </div>
      </section>

      {/* Community Learner List & Tabs */}
      <section className="users-list-section">
        <div className="users-controls">
          <div className="users-tabs" role="tablist">
            <button
              className={`users-tab${filter === 'all' ? ' is-on' : ''}`}
              onClick={() => setFilter('all')}
              role="tab"
              aria-selected={filter === 'all'}
            >
              <Icon name="users" size={16} />
              <span>All Learners</span>
              <span className="tab-badge">{stats?.users.length ?? 0}</span>
            </button>
            <button
              className={`users-tab${filter === 'online' ? ' is-on' : ''}`}
              onClick={() => setFilter('online')}
              role="tab"
              aria-selected={filter === 'online'}
            >
              <span className="tab-green-dot" />
              <span>Online Now</span>
              <span className="tab-badge">{stats?.onlineCount ?? 0}</span>
            </button>
            <button
              className={`users-tab${filter === 'regular' ? ' is-on' : ''}`}
              onClick={() => setFilter('regular')}
              role="tab"
              aria-selected={filter === 'regular'}
            >
              <Icon name="flame" size={16} />
              <span>Regular Streaks</span>
              <span className="tab-badge">{stats?.regularCount ?? 0}</span>
            </button>
            <button
              className={`users-tab${filter === 'top' ? ' is-on' : ''}`}
              onClick={() => setFilter('top')}
              role="tab"
              aria-selected={filter === 'top'}
            >
              <Icon name="trophy" size={16} />
              <span>XP Leaderboard</span>
            </button>
          </div>

          <div className="users-search-box">
            <Icon name="search" size={15} />
            <input
              type="text"
              placeholder="Search by student or university..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="users-search-input"
            />
            {search && (
              <button className="search-clear-btn" onClick={() => setSearch('')}>
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Learner Directory Table */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th style={{ width: '48px' }}>Rank</th>
                <th>Learner</th>
                <th>Institute / University</th>
                <th>Status</th>
                <th>XP Points</th>
                <th>Daily Streak</th>
                <th>Mastery</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {loading && !stats && (
                <tr>
                  <td colSpan={8} className="users-empty">
                    <div className="users-spinner" /> Loading active community learners...
                  </td>
                </tr>
              )}

              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="users-empty">
                    No learners match the current filter.
                  </td>
                </tr>
              )}

              {filteredUsers.map((user, idx) => {
                const isMe = user.id === currentUserId;
                const initials = (user.name || 'Learner')
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((s) => s[0].toUpperCase())
                  .join('');

                return (
                  <tr key={user.id} className={`user-row${isMe ? ' is-me' : ''}${user.isOnline ? ' is-online' : ''}`}>
                    <td className="user-rank tnum">
                      {idx === 0 && filter === 'top' ? (
                        <span className="rank-badge gold">🥇</span>
                      ) : idx === 1 && filter === 'top' ? (
                        <span className="rank-badge silver">🥈</span>
                      ) : idx === 2 && filter === 'top' ? (
                        <span className="rank-badge bronze">🥉</span>
                      ) : (
                        <span>#{idx + 1}</span>
                      )}
                    </td>

                    <td className="user-info-col">
                      <div className="user-avatar-group">
                        <div className={`user-table-avatar${isMe ? ' is-me-avatar' : ''}`}>
                          {initials || 'U'}
                        </div>
                        <div className="user-name-details">
                          <span className="user-table-name">
                            {user.name}
                            {isMe && <span className="you-pill">You</span>}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="user-inst-col">
                      {user.institute ? (
                        <span className="inst-badge">{user.institute}</span>
                      ) : (
                        <span className="muted small">—</span>
                      )}
                    </td>

                    <td className="user-status-col">
                      {user.isOnline ? (
                        <span className="status-pill online">
                          <span className="status-live-dot" /> Online
                        </span>
                      ) : (
                        <span className="status-pill offline">
                          <span className="status-offline-dot" /> Inactive
                        </span>
                      )}
                    </td>

                    <td className="user-xp-col">
                      <span className="xp-pill tnum">
                        <Icon name="bolt" size={14} /> {user.xp}
                      </span>
                    </td>

                    <td className="user-streak-col">
                      <span className={`streak-pill tnum${user.streakDays >= 3 ? ' hot' : ''}`}>
                        <Icon name="flame" size={14} /> {user.streakDays}d
                      </span>
                    </td>

                    <td className="user-mastery-col">
                      <span className="mastery-pill tnum">
                        <Icon name="check" size={13} /> {user.levelsDone} levels
                      </span>
                    </td>

                    <td className="user-time-col">
                      <span className="time-text small muted">
                        {formatRelativeTime(user.lastActiveAt)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {editModal && <ProfileModal isOpen={editModal} onClose={() => { setEditModal(false); fetchUsers(); }} />}
    </div>
  );
}
