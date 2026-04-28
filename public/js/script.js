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
zz
// Tax toggle for index page
document.addEventListener('DOMContentLoaded', function() {
  const taxSwitch = document.getElementById("switchCheckDefault");
  if (taxSwitch) {
    taxSwitch.addEventListener("click", () => {
      const taxInfoEls = document.getElementsByClassName("tax-info");
      for (let info of taxInfoEls) {
        info.style.display = info.style.display !== "inline" ? "inline" : "none";
      }
    });
  }
});

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

document.addEventListener('DOMContentLoaded', () => {
  refreshFavButtons();
  updateWishlistBadge();
});
