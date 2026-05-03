document.addEventListener('keydown', e => {
    if (!document.getElementById('sp-lb').classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight' && !lbSingle) lbStep(1);
    if (e.key === 'ArrowLeft'  && !lbSingle) lbStep(-1);
  });

  document.getElementById('sp-lb').addEventListener('click', function(e) {
    if (e.target === this) closeLb();
  });

  /* ── Gallery delete confirm ───────────────── */
  let pendingDelForm = null;

  function confirmGalleryDelete(btn) {
    pendingDelForm = btn.closest('form');
    document.getElementById('delConfirmOverlay').classList.add('open');
  }

  document.getElementById('delConfirmBtn').addEventListener('click', function() {
    if (!pendingDelForm) return;
    /* Remove the guard, then submit as a normal POST so method-override fires */
    pendingDelForm.removeAttribute('onsubmit');
    pendingDelForm.submit();
  });

  function closeDelConfirm() {
    pendingDelForm = null;
    document.getElementById('delConfirmOverlay').classList.remove('open');
  }

  document.getElementById('delConfirmOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeDelConfirm();
  });

  /* ── Shared thumb builder ─────────────────── */
  function makePrevThumb(file) {
    const wrap = document.createElement('div');
    wrap.className = 'prev-thumb';
    const src = URL.createObjectURL(file);
    if (file.type.startsWith('video')) {
      const v = document.createElement('video');
      v.src = src; v.muted = true;
      v.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      const badge = document.createElement('div');
      badge.className = 'pv-badge';
      badge.innerHTML = '<i class="fa-solid fa-play"></i>';
      wrap.append(v, badge);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      wrap.appendChild(img);
    }
    return wrap;
  }

  /* ── Owner upload ─────────────────────────── */
  let ownerDroppedFiles = null;

  function ownerDrop(e) {
    e.preventDefault();
    document.getElementById('ownerDrop').classList.remove('over');
    ownerDroppedFiles = Array.from(e.dataTransfer.files).slice(0, 10);
    ownerPreview(ownerDroppedFiles);
  }

  function ownerPreview(files) {
    const preview = document.getElementById('ownerPreview');
    const btn     = document.getElementById('ownerUploadBtn');
    const count   = document.getElementById('ownerFileCount');
    preview.innerHTML = '';
    const list = Array.from(files).slice(0, 10);
    list.forEach(f => preview.appendChild(makePrevThumb(f)));
    if (list.length) {
      count.textContent = `${list.length} file${list.length !== 1 ? 's' : ''} selected`;
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    }
  }

  /* ── Review upload ────────────────────────── */
  let reviewDroppedFiles = null;

  function revDrop(e) {
    e.preventDefault();
    document.getElementById('reviewDrop').classList.remove('over');
    reviewDroppedFiles = Array.from(e.dataTransfer.files).slice(0, 5);
    reviewPreview(reviewDroppedFiles);
  }

  function reviewPreview(files) {
    const preview = document.getElementById('reviewPreview');
    preview.innerHTML = '';
    Array.from(files).slice(0, 5).forEach(f => preview.appendChild(makePrevThumb(f)));
  }

  /* ── Map ──────────────────────────────────── */
  function initMap() {
    const raw = document.getElementById('map-data');
    if (!raw) return;
    let d;
    try { d = JSON.parse(raw.textContent.trim()); } catch(err) { console.error('map-data parse error', err); return; }

    const mapEl = document.getElementById('map');
    if (!mapEl || mapEl._leaflet_id) return;

    function renderMap(lat, lng) {
      const map = L.map('map').setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      const icon = L.divIcon({
        html: '<div style="width:18px;height:18px;border-radius:50%;background:#e8392a;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.4);"></div>',
        className: '', iconSize: [18,18], iconAnchor: [9,9],
      });
      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup('<strong style="font-size:.85rem;">' + d.title + '</strong>')
        .openPopup();
    }

    const DELHI = { lat: 28.6448, lng: 77.2167 };
    const isFallback = (la, ln) => Math.abs(la - DELHI.lat) < 0.001 && Math.abs(ln - DELHI.lng) < 0.001;

    if (d.lat && d.lng && !isFallback(d.lat, d.lng)) {
      renderMap(d.lat, d.lng);
      return;
    }

    fetch(
      'https://nominatim.openstreetmap.org/search?q=' +
      encodeURIComponent(d.location + ', ' + d.country) +
      '&format=json&limit=1',
      { headers: { 'Accept-Language': 'en' } }
    )
      .then(r => r.json())
      .then(res => {
        if (res && res.length > 0) renderMap(parseFloat(res[0].lat), parseFloat(res[0].lon));
        else renderMap(d.lat, d.lng);
      })
      .catch(() => renderMap(d.lat, d.lng));
  }

  function waitForLeaflet(cb, tries) {
    tries = tries || 0;
    if (typeof L !== 'undefined') { cb(); return; }
    if (tries > 40) { console.warn('Leaflet never loaded'); return; }
    setTimeout(function() { waitForLeaflet(cb, tries + 1); }, 150);
  }

  /* ── Boot everything after DOM is ready ──── */
  document.addEventListener('DOMContentLoaded', function() {

    /* owner file input */
    const ownerInput = document.getElementById('ownerFileInput');
    if (ownerInput) {
      ownerInput.addEventListener('change', function() {
        ownerDroppedFiles = null;
        ownerPreview(this.files);
      });
    }

    /* owner form — use FormData for drag-dropped files */
    const galleryForm = document.getElementById('galleryUploadForm');
    if (galleryForm) {
      galleryForm.addEventListener('submit', function(e) {
        if (!ownerDroppedFiles || ownerDroppedFiles.length === 0) return;
        e.preventDefault();
        const fd = new FormData();
        ownerDroppedFiles.forEach(f => fd.append('gallery', f));
        fetch(this.action, { method: 'POST', body: fd })
          .then(res => { if (res.redirected) window.location.href = res.url; })
          .catch(() => alert('Upload failed. Please try again.'));
      });
    }

    /* review file input */
    const reviewInput = document.getElementById('reviewFileInput');
    if (reviewInput) {
      reviewInput.addEventListener('change', function() {
        reviewDroppedFiles = null;
        reviewPreview(this.files);
      });
    }

    /* review form — use FormData for drag-dropped files */
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
      reviewForm.addEventListener('submit', function(e) {
        if (!reviewDroppedFiles || reviewDroppedFiles.length === 0) return;
        if (!reviewForm.checkValidity()) return; /* let native validation run */
        e.preventDefault();
        const fd = new FormData(this);
        fd.delete('reviewMedia');
        reviewDroppedFiles.forEach(f => fd.append('reviewMedia', f));
        fetch(this.action, { method: 'POST', body: fd })
          .then(res => { if (res.redirected) window.location.href = res.url; })
          .catch(() => alert('Submit failed. Please try again.'));
      });
    }

    /* form validation */
    document.querySelectorAll('.needs-validation').forEach(form => {
      form.addEventListener('submit', e => {
        if (!form.checkValidity()) { e.preventDefault(); e.stopPropagation(); }
        form.classList.add('was-validated');
      });
    });

    /* map */
    waitForLeaflet(initMap);
  });
