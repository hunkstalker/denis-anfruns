import React, { useState, useEffect, useRef } from 'react';
import { RocketIcon, PinIcon, BookmarkIcon, ArrowUpRightIcon } from './SearchIcons';

type SearchResult = {
  url: string;
  meta: {
    title: string;
    description: string;
  };
  excerpt: string;
  filters: {
    type?: string[];
  };
  language?: string;
};

type SearchMode = 'mobile' | 'desktop';

interface SearchResultsClientProps {
  mode: SearchMode;
  inputId?: string;
  containerId?: string;
  labels: {
    [key: string]: string;
  };
  children?: React.ReactNode;
}

export default function SearchResultsClient({
  mode,
  inputId,
  containerId, // Unused? We render our own container now.
  labels,
  children,
}: SearchResultsClientProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [pagefind, setPagefind] = useState<any>(null);
  const initialContentRef = useRef<HTMLDivElement>(null);

  // We need to sync with the existing input element if it exists outside React
  // OR we render our own input if it's mobile/desktop internal?
  // The current design uses `Nav` input (desktop) and `Search` input (mobile) which are external.
  // We attach listeners to them.

  useEffect(() => {
    // Determine language from document
    const currentLang = document.documentElement.lang || 'es';

    const loadPagefind = async () => {
      try {
        if (typeof window !== 'undefined' && !pagefind) {
          // Check if pagefind exists before trying to import (fixes dev mode issues)
          const pagefindUrl = '/pagefind/pagefind.js';
          const response = await fetch(pagefindUrl, { method: 'HEAD' });
          if (response.ok) {
            // Dynamically import pagefind using a runtime URL to bypass Vite's static analysis
            const pf = await import(/* @vite-ignore */ pagefindUrl);
            setPagefind(pf);
          } else {
            console.warn('Pagefind not available - run "pnpm build" first');
          }
        }
      } catch (e) {
        console.warn('Pagefind not loaded (expected in dev mode)', e);
      }
    };

    // Attach listeners to external input
    const inputEl = inputId ? document.getElementById(inputId) as HTMLInputElement : null;

    if (inputEl) {
      const handleInput = (e: Event) => {
        const val = (e.target as HTMLInputElement).value;
        setQuery(val);
      };

      const handleFocus = () => loadPagefind();

      inputEl.addEventListener('input', handleInput);
      inputEl.addEventListener('focus', handleFocus);

      if (mode === 'desktop') {
        // @ts-ignore
        inputEl.addEventListener('badgeCreated', (e: CustomEvent) => {
          setFilter(e.detail.filterType);
        });
        inputEl.addEventListener('badgeRemoved', () => setFilter('all'));
        // @ts-ignore
        inputEl.addEventListener('searchInput', (e: CustomEvent) => {
          const { value, activeFilter } = e.detail;
          setQuery(value);
          if (activeFilter && activeFilter !== filter) setFilter(activeFilter);
        });
      }

      // Initial value
      if (inputEl.value) setQuery(inputEl.value);

      return () => {
        inputEl.removeEventListener('input', handleInput);
        inputEl.removeEventListener('focus', handleFocus);
      };
    } else {
      // Fallback or internal input if we decided to move input here
      loadPagefind();
    }
  }, [inputId, mode]);
  // removed pagefind from dep to avoid re-run, but handles in loadPagefind check

  // Initial Content Filtering Effect
  useEffect(() => {
    if (!initialContentRef.current || query.trim()) return;

    const container = initialContentRef.current;

    // Toggle Sections
    const sections = ['project', 'til', 'blog'];
    sections.forEach(sectionType => {
      const sectionEl = container.querySelector(`[data-section="${sectionType}"]`);
      if (sectionEl) {
        const isVisible = filter === 'all' || filter === sectionType;
        if (isVisible) {
          sectionEl.classList.remove('hidden');
        } else {
          sectionEl.classList.add('hidden');
        }

        // Toggle extra items
        const extraItems = sectionEl.querySelectorAll('.extra-item');
        extraItems.forEach(item => {
          // If filter matches specific section, show extras. Else hide.
          if (filter === sectionType) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      }
    });

  }, [filter, query]);


  // Debounced Search Effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      if (pagefind) {
        const search = await pagefind.search(query);
        const data = await Promise.all(search.results.map((r: any) => r.data()));
        const currentLang = document.documentElement.lang || 'es';

        // Filter by language
        const langFiltered = data.filter((r: any) => {
          if (r.language) return r.language === currentLang;
          // URL Fallback
          if (currentLang === 'es') return !r.url.startsWith('/en/') && !r.url.startsWith('/ca/');
          return r.url.startsWith(`/${currentLang}/`);
        });

        // Dedup
        const seen = new Set();
        const deduped: SearchResult[] = [];
        for (const r of langFiltered) {
          if (!seen.has(r.url)) {
            seen.add(r.url);
            deduped.push(r as SearchResult);
          }
        }
        setResults(deduped);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, pagefind]);


  // Filtering Logic
  const filteredResults = results.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'project') return r.filters.type?.includes('project');
    if (filter === 'til') return r.filters.type?.includes('til');
    if (filter === 'blog') return !r.filters.type || r.filters.type.includes('blog');
    return true;
  });

  // Calculate Sections (for rendering)
  const projects = filteredResults.filter(r => r.filters.type?.includes('project'));
  const tils = filteredResults.filter(r => r.filters.type?.includes('til'));
  const blogs = filteredResults.filter(r => !r.filters.type || r.filters.type.includes('blog'));

  const hasResults = filteredResults.length > 0;
  const showInitialContent = !query.trim();

  // Desktop vs Mobile Render Styles
  const isDesktop = mode === 'desktop';
  const containerClass = isDesktop
    ? "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
    : "space-y-1";

  // If showing initial content, render children wrapper
  // We use `dangerouslySetInnerHTML` or just `{children}` if filtered on client?
  // Since `children` from Astro is static HTML, React renders it.
  // We manipulate it via ref.

  const renderItem = (item: SearchResult) => (
    <a
      key={item.url}
      href={item.url}
      className={isDesktop
        ? "group block h-full min-h-[140px] overflow-hidden rounded-xl bg-white/90 p-4 ring-1 ring-zinc-200/50 transition-all duration-200 ease-out hover:bg-white hover:ring-[--tangerine] hover:shadow-lg dark:bg-zinc-900/90 dark:ring-zinc-700/50 dark:hover:bg-zinc-800 dark:hover:ring-[--tangerine]"
        : "block rounded-xl bg-white/90 p-3 ring-1 ring-zinc-200/50 transition-all duration-200 ease-out hover:bg-white hover:ring-1 hover:ring-[--tangerine] hover:shadow-lg dark:bg-zinc-900/90 dark:ring-zinc-700/50 dark:hover:bg-zinc-800 dark:hover:ring-[--tangerine] group"
      }
    >
      <div className={`font-medium text-zinc-800 transition-colors group-hover:text-[--tangerine] dark:text-zinc-200 dark:group-hover:text-[--tangerine] ${isDesktop ? 'text-sm' : 'text-sm'}`}>
        {item.meta.title}
      </div>
      {/* Renderizar el extracto como HTML para admitir las etiquetas <mark> insertadas por 
          Pagefind para resaltar los términos de búsqueda. Confiamos en los resultados de Pagefind 
          (contenido depurado en el momento de la compilación). */}
      <div 
        className={`text-zinc-500 dark:text-zinc-400 ${isDesktop ? 'mt-2 text-xs line-clamp-5' : 'mt-1 text-xs line-clamp-1'}`}
        dangerouslySetInnerHTML={{ __html: item.excerpt || item.meta.description }}
      />
    </a>
  );

  const renderSection = (title: string, Icon: React.ElementType, items: SearchResult[]) => {
    if (items.length === 0) return null;
    return (
      <div className={`${!isDesktop ? 'px-2 py-2 mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-4 first:mt-0 first:border-0 first:pt-2' : ''}`}>
        <h3 className="text-xs mb-3 flex items-center gap-2 font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-400">
          <Icon className="mr-2 h-4 w-4" />
          {title}
        </h3>
        <div className={containerClass}>
          {items.map(renderItem)}
        </div>
      </div>
    );
  };

  // Chips for Mobile
  const chips = [
    { id: 'all', label: 'All' }, // TODO: localize?
    { id: 'project', label: labels['nav.projects'] },
    { id: 'til', label: labels['blog.til'] },
    { id: 'blog', label: labels['nav.blog'] }, // using nav.blog as generic term or blog.series?
  ];

  // Container classes matching the original Astro component
  const rootClass = isDesktop
    ? 'relative flex flex-col overflow-hidden h-auto max-h-[75vh]'
    : 'relative flex flex-col overflow-hidden h-full';

  const scrollContainerClass = 'relative min-h-0 flex-1 scroll-py-3 overflow-y-auto px-6 py-6';

  return (
    <div className={rootClass}>
      <div className={scrollContainerClass}>
        {/* Mobile Chips */}
        {!isDesktop && !showInitialContent && (
          <div className="flex gap-2 overflow-x-auto pb-4 pt-2 scrollbar-hide">
            {chips.map(chip => (
              <button
                key={chip.id}
                onClick={() => setFilter(chip.id)}
                className={`filter-chip whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${filter === chip.id
                    ? 'bg-[--tangerine] text-zinc-900 active'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                  }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {!showInitialContent ? (
          <>
            {!hasResults && (
              <div className="text-center py-10 text-sm text-zinc-500 dark:text-zinc-400">
                <p>{labels['nav.noResults']}</p>
              </div>
            )}
            {renderSection(labels['blog.til'], PinIcon, tils)}
            {renderSection(labels['nav.projects'], RocketIcon, projects)}
            {renderSection(labels['blog.series'], BookmarkIcon, blogs)}
          </>
        ) : (
          <div ref={initialContentRef}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
