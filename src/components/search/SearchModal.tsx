'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { buildSearchIndex, searchTopics, type SearchItem } from '@/lib/searchIndex';
import { COURSE_TRACKS, type CourseTrack } from '@/content/course';
import { setActiveTrack } from '@/lib/courseTrack';
import { useNav } from '@/lib/router';
import { Icon } from '@/components/ui/Icon';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLab?: (track: CourseTrack, taskIndex: number) => void;
}

const QUICK_TAGS = [
  'Pointers',
  'Classes',
  'Copy Constructor',
  'Operator Overloading',
  'Virtual Functions',
  'Linked List',
  'Stack',
  'Circular Queue',
  'Binary Search Tree',
  'Recursion',
  'Dynamic Memory',
];

export function SearchModal({ isOpen, onClose, onOpenLab }: SearchModalProps) {
  const nav = useNav();
  const [query, setQuery] = useState('');
  const [filterTrack, setFilterTrack] = useState<string>('all');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allItems = useMemo(() => buildSearchIndex(), []);

  // Filter items by track and search query
  const results = useMemo(() => {
    let pool = allItems;
    if (filterTrack !== 'all') {
      if (filterTrack === 'labs') pool = allItems.filter((it) => it.type === 'lab');
      else pool = allItems.filter((it) => it.track === filterTrack);
    }
    if (!query.trim()) {
      return pool.slice(0, 15);
    }
    return searchTopics(query, pool, 30);
  }, [allItems, filterTrack, query]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [results]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((i) => (i + 1 < results.length ? i + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((i) => (i - 1 >= 0 ? i - 1 : results.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIdx]) {
          handleSelect(results[selectedIdx]);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, results, selectedIdx, onClose]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    if (item.type === 'lab') {
      if (onOpenLab && typeof item.labTrackIndex === 'number') {
        onOpenLab(item.track, item.labTrackIndex);
      } else {
        // Fallback: set active track and trigger labs
        setActiveTrack(item.track);
        window.dispatchEvent(new CustomEvent('dryrun:open-labs', { detail: { track: item.track, index: item.labTrackIndex ?? 0 } }));
      }
    } else {
      setActiveTrack(item.track);
      nav.go({ name: 'level', id: item.targetId });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cmp-scrim search-scrim" role="dialog" aria-modal="true" aria-label="Search topics and courses" onClick={onClose}>
      <div className="search-palette" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="search-head">
          <Icon name="search" size={20} className="search-head-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search topics, questions, past papers, algorithms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
          {query && (
            <button className="icon-btn search-clear-btn" onClick={() => setQuery('')} aria-label="Clear search">
              <Icon name="x" size={16} />
            </button>
          )}
          <span className="search-kbd-hint">Esc</span>
        </div>

        {/* Filter Chips */}
        <div className="search-filters">
          <button
            type="button"
            className={`search-filter-chip${filterTrack === 'all' ? ' is-on' : ''}`}
            onClick={() => setFilterTrack('all')}
          >
            All Tracks
          </button>
          {COURSE_TRACKS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`search-filter-chip${filterTrack === t.id ? ' is-on' : ''}`}
              onClick={() => setFilterTrack(t.id)}
            >
              <Icon name={t.icon} size={13} />
              <span>{t.label}</span>
            </button>
          ))}
          <button
            type="button"
            className={`search-filter-chip${filterTrack === 'labs' ? ' is-on' : ''}`}
            onClick={() => setFilterTrack('labs')}
          >
            <Icon name="flask" size={13} />
            <span>Lab Tasks</span>
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        {!query && (
          <div className="search-quick-tags">
            <span className="eyebrow">Popular exam topics:</span>
            <div className="search-tags-list">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="search-tag-btn"
                  onClick={() => setQuery(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="search-results" role="listbox">
          {results.length === 0 ? (
            <div className="search-empty">
              <Icon name="search" size={32} />
              <p>No matching topics found for &ldquo;{query}&rdquo;</p>
              <span>Try searching for keywords like pointers, recursion, matrices, or linked list</span>
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIdx;
              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`search-result-item${isSelected ? ' is-selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIdx(idx)}
                >
                  <div className="search-item-icon">
                    <Icon
                      name={item.type === 'lab' ? 'flask' : item.type === 'checkpoint' ? 'flag' : 'book'}
                      size={18}
                    />
                  </div>
                  <div className="search-item-info">
                    <div className="search-item-title-row">
                      <span className="search-item-title">{item.title}</span>
                      <span className="search-item-badge">{item.badge}</span>
                    </div>
                    <div className="search-item-sub">{item.subtitle}</div>
                  </div>
                  <Icon name="arrow-right" size={14} className="search-item-arrow" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="search-foot">
          <span><kbd>&uarr;</kbd> <kbd>&darr;</kbd> to navigate</span>
          <span><kbd>&crarr;</kbd> to select</span>
          <span><kbd>Esc</kbd> to close</span>
          <span className="search-privacy-badge"><Icon name="shield" size={12} /> 100% Local in Your Browser</span>
        </div>
      </div>
    </div>
  );
}
