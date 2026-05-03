// Bootstrap form validation
(function() {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();


// ── GLOBAL FAV HELPERS (localStorage key: wl_favs = [id, id, ...]) ──
function getFavs() {
  try { return JSON.parse(localStorage.getItem('wl_favs') || '[]'); } catch { return []; }
}
function saveFavs(arr) {
  localStorage.setItem('wl_favs', JSON.stringify(arr));
  updateWishlistBadge();
}

// Add or remove an ID. Returns true if added, false if removed.
function toggleFav(id) {
  const favs = getFavs();
  const idx  = favs.indexOf(id);
  if (idx === -1) { favs.push(id); saveFavs(favs); return true; }
  else            { favs.splice(idx, 1); saveFavs(favs); return false; }
}

// On page load — fill active state on all heart buttons
function refreshFavButtons() {
  const favs = getFavs();
  document.querySelectorAll('[data-fav-id]').forEach(btn => {
    const active = favs.includes(btn.dataset.favId);
    btn.classList.toggle('active', active);
    btn.innerHTML = active
      ? '<i class="fa-solid fa-heart" style="color:var(--primary)"></i>'
      : '<i class="fa-regular fa-heart"></i>';
  });
}

// Update the navbar badge count
function updateWishlistBadge() {
  const count = getFavs().length;
  const badge = document.getElementById('navFavCount');
  if (!badge) return;
  badge.textContent    = count;
  badge.style.display  = count > 0 ? 'inline-flex' : 'none';
}

// ─────────────────────────────────────────────────────────────
//  Core fetch — XHR to /listings, patches dynamic zones only
// ─────────────────────────────────────────────────────────────
let _fetchCtrl = null;

async function applyFilters(params, { pushHistory = true, scrollToExplore = false } = {}) {
  if (_fetchCtrl) _fetchCtrl.abort();
  _fetchCtrl = new AbortController();

  const qs  = params.toString();
  const url = qs ? `/listings?${qs}` : '/listings';

  if (pushHistory) history.pushState({}, '', url);

  const dynEl = document.getElementById('wl-dynamic-content');
  dynEl.classList.add('wl-loading');

  try {
    const res = await fetch(url, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      signal: _fetchCtrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    dynEl.innerHTML = buildListingsHTML(data);
    document.getElementById('wl-active-filters-banner').innerHTML = buildFiltersBannerHTML(data);
    syncFilterBarUI(data);

    refreshFavButtons();

    if (scrollToExplore || data.exploreOpen) {
      const sec = document.getElementById('allListingsSection');
      if (sec) setTimeout(() => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  } catch (err) {
    if (err.name !== 'AbortError') console.error('[WL] fetch error:', err);
  } finally {
    dynEl.classList.remove('wl-loading');
  }
}

// ─────────────────────────────────────────────────────────────
//  HTML builders (client-side mirror of the EJS above)
// ─────────────────────────────────────────────────────────────
function buildListingsHTML(d) {
  const { allListings, searchQuery, activeMood, activeCategory,
          exploreOpen, exploreListings, exploreTotalListings, exploreTotalPages, currentAllPage } = d;

  if (allListings.length === 0 && !exploreOpen) {
    return `<div style="margin:1.25rem 0 0.5rem;">
      <div class="wl-empty-state">
        <span style="font-size:3rem;"> <i class="fa-regular fa-compass" style="color:#e8392a"></i> </span>
        <h3>No listings found</h3>
        <p>Try a different search, mood, or category.</p>
        <button class="wl-btn-primary" onclick="clearAllFilters()" style="display:inline-flex;margin-top:0.5rem;">Clear filters</button>
      </div></div>`;
  }

  let html = '';

  if (exploreOpen) {
    const start = (currentAllPage - 1) * 12 + 1;
    const end   = Math.min(currentAllPage * 12, exploreTotalListings);
    html += `<div id="allListingsSection">
      <div class="wl-section-header">
        <h2 class="wl-section-title">All Listings</h2>
        <span style="font-size:0.82rem;color:var(--text-muted);">Showing ${start}&ndash;${end} of ${exploreTotalListings} listing${exploreTotalListings !== 1 ? 's' : ''}</span>
      </div>
      <div class="wl-stays-grid">${exploreListings.map(s => buildStayCard(s)).join('')}</div>
      ${buildPaginationHTML(exploreTotalPages, currentAllPage)}
    </div>`;
  }

  if (allListings.length > 0) {
    const title = activeMood ? `Stays for ${cap(activeMood)} Mood`
      : activeCategory      ? `${cap(activeCategory)} Stays`
      : searchQuery         ? `Results for &ldquo;${escHtml(searchQuery)}&rdquo;`
      : 'Popular Destinations';

    html += `<div id="popular-section">
      <div class="wl-section-header">
        <h2 class="wl-section-title">${title}</h2>
        <span style="font-size:0.82rem;color:var(--text-muted);">${allListings.length} listing${allListings.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="wl-cards-scroll">${allListings.slice(0, 12).map(l => buildDestCard(l)).join('')}</div>
    </div>`;

    if (allListings.length > 3 && !searchQuery && !activeMood && !activeCategory) {
      const badges      = ['best-seller','eco','guest-fav','','best-seller','eco'];
      const badgeLabels = {'best-seller':'Best Seller','eco':'Eco Stay','guest-fav':'Guest Favorite'};
      const stayTagSets = [
        ['Beachfront','Private Pool'],['Forest View','Eco-friendly'],
        ['Mountain View','Bonfire'],['City View','WiFi'],
        ['Heritage','Guided Tours'],['Lakefront','Kayaking']
      ];
      const si = Math.floor(allListings.length / 2);
      const cards = Array.from({ length: Math.min(6, allListings.length) }, (_, i) =>
        buildStayCard(allListings[si + i] || allListings[i], badges[i], badgeLabels[badges[i]], stayTagSets[i])
      ).join('');
      html += `<div id="stays-section">
        <div class="wl-section-header"><h2 class="wl-section-title">Top Stays for You</h2></div>
        <div class="wl-stays-grid">${cards}</div>
      </div>`;
    }

    if ((searchQuery || activeMood || activeCategory) && allListings.length > 12) {
      html += `<div class="wl-section-header" style="margin-top:1.5rem;">
        <h2 class="wl-section-title">More Results</h2>
      </div>
      <div class="wl-stays-grid">${allListings.slice(12).map(s => buildStayCard(s)).join('')}</div>`;
    }
  }

  return html;
}

function buildStayCard(s, badge, badgeLabel, tags) {
  const rating  = (4.3 + ((s.price % 7) * 0.08)).toFixed(1);
  const reviews = 50 + (s.price % 250);
  const fav = `data-fav-id="${s._id}" data-fav-title="${escAttr(s.title)}" data-fav-img="${escAttr(s.image.url)}" data-fav-location="${escAttr(s.location)}" data-fav-price="${s.price}"`;
  return `<div class="wl-stay-card">
    ${badge ? `<span class="wl-stay-badge ${badge}">${escHtml(badgeLabel)}</span>` : ''}
    <button class="wl-stay-card-fav" ${fav} onclick="handleFavClick(this)"><i class="fa-regular fa-heart"></i></button>
    <a href="/listings/${s._id}">
      <img src="${escAttr(s.image.url)}" alt="${escAttr(s.title)}" class="wl-stay-card-img" loading="lazy">
    </a>
    <div class="wl-stay-card-body">
      <div class="wl-stay-name">${escHtml(s.title)}</div>
      <div class="wl-stay-location"><i class="fa-solid fa-location-dot" style="font-size:0.65rem;"></i> ${escHtml(s.location)}, ${escHtml(s.country)}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.35rem;">
        <div class="wl-stay-price">&#8377;${s.price.toLocaleString('en-IN')}<small>/night</small></div>
        <div class="wl-rating" style="font-size:0.72rem;"><i class="fa-solid fa-star"></i> ${rating} <span>(${reviews})</span></div>
      </div>
      ${tags ? `<div class="wl-stay-tags">${tags.map(t => `<span class="wl-tag">${escHtml(t)}</span>`).join('')}</div>` : ''}
    </div>
  </div>`;
}

function buildDestCard(l) {
  const rating  = (4.3 + ((l.price % 7) * 0.08)).toFixed(1);
  const reviews = 150 + (l.price % 300);
  const fav = `data-fav-id="${l._id}" data-fav-title="${escAttr(l.title)}" data-fav-img="${escAttr(l.image.url)}" data-fav-location="${escAttr(l.location)}" data-fav-price="${l.price}"`;
  return `<a href="/listings/${l._id}" class="wl-dest-card">
    <button class="wl-dest-card-fav" ${fav} onclick="event.preventDefault(); handleFavClick(this)"><i class="fa-regular fa-heart"></i></button>
    <img src="${escAttr(l.image.url)}" alt="${escAttr(l.title)}" class="wl-dest-card-img">
    <div class="wl-dest-card-body">
      <div class="wl-dest-card-name">${escHtml(l.title)}</div>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.25rem;">
        <i class="fa-solid fa-location-dot" style="color:var(--primary);font-size:0.65rem;"></i>
        ${escHtml(l.location)}, ${escHtml(l.country)}
      </div>
      <div class="wl-dest-card-meta">
        <div class="wl-rating"><i class="fa-solid fa-star"></i> ${rating} <span>(${reviews})</span></div>
      </div>
      <div class="wl-dest-price">&#8377;${l.price.toLocaleString('en-IN')}/night
        <i class="tax-info" style="font-size:0.68rem;color:var(--text-muted);font-style:normal;"> +18% GST</i>
      </div>
    </div>
  </a>`;
}

function buildPaginationHTML(totalPages, current) {
  if (totalPages <= 1) return '';
  let btns = current > 1
    ? `<a href="#" class="wl-page-btn wl-page-nav" data-page="${current - 1}"><i class="fa-solid fa-chevron-left"></i></a>`
    : `<span class="wl-page-btn wl-page-nav disabled"><i class="fa-solid fa-chevron-left"></i></span>`;

  for (let p = 1; p <= totalPages; p++) {
    const show = p === 1 || p === totalPages || (p >= current - 2 && p <= current + 2);
    if (p === current - 3 && current > 4)               btns += `<span class="wl-page-dots">&hellip;</span>`;
    if (p === current + 3 && current < totalPages - 3)  btns += `<span class="wl-page-dots">&hellip;</span>`;
    if (show) btns += p === current
      ? `<span class="wl-page-btn wl-page-active">${p}</span>`
      : `<a href="#" class="wl-page-btn" data-page="${p}">${p}</a>`;
  }

  btns += current < totalPages
    ? `<a href="#" class="wl-page-btn wl-page-nav" data-page="${current + 1}"><i class="fa-solid fa-chevron-right"></i></a>`
    : `<span class="wl-page-btn wl-page-nav disabled"><i class="fa-solid fa-chevron-right"></i></span>`;

  return `<nav style="display:flex;justify-content:center;align-items:center;gap:0.4rem;margin:2rem 0 1rem;flex-wrap:wrap;">${btns}</nav>
    <p style="text-align:center;font-size:0.76rem;color:var(--text-muted);margin-bottom:1.5rem;">Page ${current} of ${totalPages}</p>`;
}

function buildFiltersBannerHTML({ searchQuery, activeMood, activeCategory, activeMinPrice, activeMaxPrice }) {
  if (!activeMood && !activeCategory && !searchQuery && !activeMinPrice && !activeMaxPrice) return '';
  let chips = '';
  if (searchQuery)                      chips += `<span class="wl-filter-chip">Search: &ldquo;${escHtml(searchQuery)}&rdquo;</span>`;
  if (activeMood)                       chips += `<span class="wl-filter-chip mood">Mood: ${escHtml(activeMood)}</span>`;
  if (activeCategory)                   chips += `<span class="wl-filter-chip">Category: ${escHtml(activeCategory)}</span>`;
  if (activeMinPrice || activeMaxPrice) chips += `<span class="wl-filter-chip">&#8377;${activeMinPrice||'0'} &ndash; &#8377;${activeMaxPrice||'&infin;'}</span>`;
  return `<div class="wl-active-filters">
    <span><i class="fa-solid fa-filter"></i> Showing filtered results:</span>
    ${chips}
    <a href="#" class="wl-filter-clear" onclick="clearAllFilters(); return false;"><i class="fa-solid fa-xmark"></i> Clear all</a>
  </div>`;
}

function syncFilterBarUI({ activeMood, activeCategory, searchQuery, exploreOpen }) {
  document.querySelectorAll('.wl-filter-link[data-filter-key="category"]').forEach(el =>
    el.classList.toggle('active', el.dataset.filterVal === activeCategory));
  document.querySelectorAll('.wl-filter-link[data-filter-key="mood"]').forEach(el =>
    el.classList.toggle('active', el.dataset.filterVal === activeMood));
  const trending = document.querySelector('.wl-filter-link[data-filter-clear]');
  if (trending) trending.classList.toggle('active', !activeCategory && !activeMood && !searchQuery);

  const btn = document.getElementById('exploreAllBtn');
  if (btn) btn.innerHTML = exploreOpen
    ? '<i class="fa-solid fa-xmark"></i> Close'
    : '<i class="fa-solid fa-grid-2"></i> Explore All';

  const navInput = document.querySelector('.wl-search-bar input[name="search"]');
  if (navInput && navInput !== document.activeElement) navInput.value = searchQuery || '';
}

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function escHtml(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(s) { return escHtml(s); }
function getParams() { return new URLSearchParams(window.location.search); }

function setFilter(key, val) {
  const p = getParams();
  p.delete('allPage');
  if (!val) { p.delete(key); }
  else if (p.get(key) === String(val)) { p.delete(key); }
  else { p.set(key, val); }
  applyFilters(p);
}

function clearAllFilters() { applyFilters(new URLSearchParams()); }

// ─────────────────────────────────────────────────────────────
//  Event wiring  (single DOMContentLoaded)
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

  // Fav buttons + badge — init once here, no separate listener needed
  refreshFavButtons();
  updateWishlistBadge();

  // Tax toggle
  document.getElementById('switchCheckDefault')?.addEventListener('change', function () {
    document.querySelectorAll('.tax-info').forEach(el => {
      el.style.display = this.checked ? 'inline' : 'none';
    });
  });

  // Category / mood / trending (delegated — works for SSR and JS-rendered cards)
  document.addEventListener('click', function (e) {
    const link = e.target.closest('.wl-filter-link');
    if (!link) return;
    e.preventDefault();
    if (link.dataset.filterClear) { clearAllFilters(); return; }
    const { filterKey: key, filterVal: val } = link.dataset;
    if (key && val) setFilter(key, val);
  });

  // Price filter
  document.getElementById('priceFilterBtn')?.addEventListener('click', () => {
    const min = document.getElementById('minPriceInput').value.trim();
    const max = document.getElementById('maxPriceInput').value.trim();
    const p   = getParams();
    p.delete('allPage');
    if (min) p.set('minPrice', min); else p.delete('minPrice');
    if (max) p.set('maxPrice', max); else p.delete('maxPrice');
    applyFilters(p);
  });
  ['minPriceInput','maxPriceInput'].forEach(id =>
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('priceFilterBtn').click();
    })
  );

  // Explore All
  document.getElementById('exploreAllBtn')?.addEventListener('click', () => {
    const p = getParams();
    if (p.has('allPage')) { p.delete('allPage'); } else { p.set('allPage', 1); }
    applyFilters(p, { scrollToExplore: true });
  });

  // Pagination (delegated on dynamic zone)
  document.getElementById('wl-dynamic-content').addEventListener('click', function (e) {
    const pg = e.target.closest('[data-page]');
    if (!pg) return;
    e.preventDefault();
    const p = getParams();
    p.set('allPage', pg.dataset.page);
    applyFilters(p, { scrollToExplore: true });
  });

  // Debounced navbar search — NO page reload
  const navbarInput = document.querySelector('.wl-search-bar input[name="search"]');
  if (navbarInput) {
    let navTimer;
    navbarInput.addEventListener('input', function () {
      clearTimeout(navTimer);
      const val = this.value.trim();
      navTimer = setTimeout(() => {
        const p = getParams();
        p.delete('allPage');
        if (val.length >= 2)       { p.set('search', val); }
        else if (val.length === 0) { p.delete('search'); }
        else                       { return; }
        applyFilters(p);
        console.log("debounced search");
      }, 400);
    });
    navbarInput.closest('form')?.addEventListener('submit', function (e) {
      e.preventDefault();
      const val = navbarInput.value.trim();
      const p   = getParams();
      p.delete('allPage');
      if (val) { p.set('search', val); } else { p.delete('search'); }
      applyFilters(p);
    });
  }

  // Browser back / forward
  window.addEventListener('popstate', () =>
    applyFilters(new URLSearchParams(window.location.search), { pushHistory: false })
  );
});

// ─────────────────────────────────────────────────────────────
//  Favourites
// ─────────────────────────────────────────────────────────────
function handleFavClick(btn) {
  const { favId, favTitle, favImg, favLocation, favPrice } = btn.dataset;
  const added = toggleFav(favId, favTitle, favImg, favLocation, favPrice);
  btn.classList.toggle('active', added);
  btn.innerHTML = added
    ? '<i class="fa-solid fa-heart" style="color:var(--primary)"></i>'
    : '<i class="fa-regular fa-heart"></i>';
}