let allFetched = []; // full array from API
let currentSort = "saved";

// ── STORAGE HELPERS ──────────────────────────────────────────
function getFavs() {
  try {
    return JSON.parse(localStorage.getItem("wl_favs") || "[]");
  } catch {
    return [];
  }
}
function saveFavs(arr) {
  localStorage.setItem("wl_favs", JSON.stringify(arr));
  if (window.updateWishlistBadge) window.updateWishlistBadge();
}
function removeFav(id) {
  saveFavs(getFavs().filter((f) => f !== id));
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  const ids = getFavs();
  if (ids.length === 0) {
    showEmpty();
    return;
  }
  await fetchAndRender(ids);
});

async function fetchAndRender(ids) {
  showLoading();
  try {
    const res = await fetch("/api/listings-by-ids?ids=" + ids.join(","));
    const data = await res.json();
    allFetched = data.listings || [];

    if (allFetched.length === 0) {
      showEmpty();
      return;
    }

    showGrid();
    updateStats(allFetched);
    renderCards(allFetched);
    setupToolbar();
  } catch (err) {
    console.error(err);
    document.getElementById("loadingState").innerHTML = `
      <div style="text-align:center;padding:3rem;color:var(--text-muted);">
        <div style="font-size:2.5rem;margin-bottom:1rem;">⚠️</div>
        <p>Couldn't load your saved destinations. Please refresh and try again.</p>
      </div>`;
  }
}

// ── RENDER CARDS ─────────────────────────────────────────────
function renderCards(listings) {
  const grid = document.getElementById("wishlistGrid");
  grid.innerHTML = "";

  const sorted = sortListings([...listings], currentSort);

  if (sorted.length === 0) {
    document.getElementById("noFilterResults").style.display = "flex";
    return;
  }
  document.getElementById("noFilterResults").style.display = "none";

  sorted.forEach((listing) => {
    const card = createCard(listing);
    grid.appendChild(card);
  });
}

function createCard(listing) {
  const id = listing._id;
  const reviewCount = listing.reviews ? listing.reviews.length : 0;
  const moods = listing.mood && listing.mood.length ? listing.mood : [];
  const category = listing.category || "";
  const cost = listing.estimatedCost || "";
  const season = listing.bestSeason || "";

  const card = document.createElement("div");
  card.className = "wl-wish-card";
  card.dataset.id = id;
  card.dataset.name = listing.title.toLowerCase();

  card.innerHTML = `
    <div class="wl-wish-card-img-wrap">
      <img src="${
        listing.image?.url ||
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop"
      }"
           alt="${listing.title}" class="wl-wish-card-img" loading="lazy">
      ${
        listing.isHiddenGem
          ? '<div class="wl-gem-badge">💎 Hidden Gem</div>'
          : ""
      }
      <button class="wl-wish-remove" onclick="handleRemove('${id}', this)" title="Remove from wishlist">
        <i class="fa-solid fa-heart-crack"></i>
      </button>
    </div>

    <div class="wl-wish-card-body">
      <div class="wl-wish-badges">
        ${
          category
            ? `<span class="wl-wish-badge cat">🗂 ${
                category.charAt(0).toUpperCase() + category.slice(1)
              }</span>`
            : ""
        }
        ${moods
          .slice(0, 1)
          .map(
            (m) =>
              `<span class="wl-wish-badge mood">${
                m.charAt(0).toUpperCase() + m.slice(1)
              }</span>`
          )
          .join("")}
      </div>

      <div class="wl-wish-name" title="${listing.title}">${listing.title}</div>
      <div class="wl-wish-loc">
        <i class="fa-solid fa-location-dot"></i>
        ${listing.location}, ${listing.country}
      </div>

      <div class="wl-wish-meta">
        ${cost ? `<span class="wl-wish-meta-chip">💰 ${cost}</span>` : ""}
        ${season ? `<span class="wl-wish-meta-chip">🌤 ${season}</span>` : ""}
        <span class="wl-wish-meta-chip">⭐ ${reviewCount} review${
    reviewCount !== 1 ? "s" : ""
  }</span>
      </div>

      <div class="wl-wish-actions">
        <a href="/listings/${id}" class="wl-wish-action-btn primary">
          <i class="fa-regular fa-compass" style="color:#e8392a"></i> Explore
        </a>
        <a href="/ai-assistant?prompt=${encodeURIComponent(
          "Plan a trip to " +
            listing.title +
            ", " +
            listing.location +
            ". Give a detailed itinerary with activities, local food, hidden gems and estimated costs in INR."
        )}"
           class="wl-wish-action-btn">
          <i class="fa-solid fa-route"></i> Plan Trip
        </a>
      </div>
    </div>
  `;
  return card;
}

// ── REMOVE ───────────────────────────────────────────────────
function handleRemove(id, btn) {
  removeFav(id);
  allFetched = allFetched.filter((l) => l._id !== id);

  // Animate card out
  const card = btn.closest(".wl-wish-card");
  card.style.transition = "all .3s ease";
  card.style.opacity = "0";
  card.style.transform = "scale(.9)";
  setTimeout(() => {
    card.remove();
    if (allFetched.length === 0) {
      showEmpty();
    } else {
      updateStats(allFetched);
      document.getElementById("headerCount").textContent = allFetched.length;
    }
  }, 300);
}

// ── SORT ─────────────────────────────────────────────────────
function sortListings(arr, mode) {
  if (mode === "az") return arr.sort((a, b) => a.title.localeCompare(b.title));
  if (mode === "gems")
    return arr.sort(
      (a, b) => (b.isHiddenGem ? 1 : 0) - (a.isHiddenGem ? 1 : 0)
    );
  return arr; // 'saved' = localStorage order (already ordered by API)
}

// ── FILTER (search) ───────────────────────────────────────────
function setupToolbar() {
  // Sort pills
  document.querySelectorAll(".wl-sort-pill").forEach((pill) => {
    pill.addEventListener("click", function () {
      document
        .querySelectorAll(".wl-sort-pill")
        .forEach((p) => p.classList.remove("active"));
      this.classList.add("active");
      currentSort = this.dataset.sort;
      const q = document
        .getElementById("wishlistSearch")
        .value.toLowerCase()
        .trim();
      const filtered = q
        ? allFetched.filter((l) => filterMatch(l, q))
        : allFetched;
      renderCards(filtered);
    });
  });

  // Search
  document
    .getElementById("wishlistSearch")
    .addEventListener("input", function () {
      const q = this.value.toLowerCase().trim();
      const filtered = q
        ? allFetched.filter((l) => filterMatch(l, q))
        : allFetched;
      renderCards(filtered);
    });
}

function filterMatch(l, q) {
  return (
    (l.title || "").toLowerCase().includes(q) ||
    (l.location || "").toLowerCase().includes(q) ||
    (l.country || "").toLowerCase().includes(q) ||
    (l.category || "").toLowerCase().includes(q) ||
    (l.mood || []).some((m) => m.toLowerCase().includes(q))
  );
}

// ── STATS ────────────────────────────────────────────────────
function updateStats(listings) {
  document.getElementById("headerCount").textContent = listings.length;
}

// ── CLEAR ALL ────────────────────────────────────────────────
function openClearModal() {
  document.getElementById("clearCount").textContent = getFavs().length;
  document.getElementById("clearModal").classList.add("open");
}
function closeClearModal() {
  document.getElementById("clearModal").classList.remove("open");
}
function confirmClear() {
  saveFavs([]);
  closeClearModal();
  allFetched = [];
  showEmpty();
}

// ── EXPORT ───────────────────────────────────────────────────
function exportWishlist() {
  if (!allFetched.length) return;
  const lines = allFetched.map(
    (l) =>
      `${l.title} | ${l.location}, ${l.country}${
        l.estimatedCost ? " | " + l.estimatedCost : ""
      }${l.bestSeason ? " | Best: " + l.bestSeason : ""}`
  );
  const content =
    `My Wanderlust Wishlist\n${"─".repeat(40)}\n\n` +
    lines.join("\n") +
    `\n\n— Exported from Wanderlust`;
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "wanderlust-wishlist.txt";
  a.click();
}

// ── STATE HELPERS ────────────────────────────────────────────
function showLoading() {
  document.getElementById("loadingState").style.display = "flex";
  document.getElementById("emptyState").style.display = "none";
  document.getElementById("wishlistGrid").style.display = "none";
  document.getElementById("toolbar").style.display = "none";
  document.getElementById("planBanner").style.display = "none";
  document.getElementById("clearAllBtn").style.display = "none";
}
function showEmpty() {
  document.getElementById("loadingState").style.display = "none";
  document.getElementById("emptyState").style.display = "flex";
  document.getElementById("wishlistGrid").style.display = "none";
  document.getElementById("toolbar").style.display = "none";
  document.getElementById("planBanner").style.display = "none";
  document.getElementById("clearAllBtn").style.display = "none";
  document.getElementById("headerCount").textContent = "0";
}
function showGrid() {
  document.getElementById("loadingState").style.display = "none";
  document.getElementById("emptyState").style.display = "none";
  document.getElementById("wishlistGrid").style.display = "grid";
  document.getElementById("toolbar").style.display = "flex";
  document.getElementById("planBanner").style.display = "flex";
  document.getElementById("clearAllBtn").style.display = "inline-flex";
}
