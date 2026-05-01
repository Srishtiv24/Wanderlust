var userLocation = null;
var builderDays = 3;
var activeDayIdx = 0;
var dayPlans = {};
var dragActivity = null;
var dragFromSlot = null;
var dragFromDayIdx = null;

function detectLocation() {
  var pill = document.getElementById("locationPill");
  var txt = document.getElementById("locationText");
  if (!navigator.geolocation) {
    txt.textContent = "Location unavailable";
    pill.classList.remove("detecting");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      var lat = pos.coords.latitude.toFixed(4);
      var lng = pos.coords.longitude.toFixed(4);
      fetch(
        "https://nominatim.openstreetmap.org/reverse?lat=" +
          lat +
          "&lon=" +
          lng +
          "&format=json"
      )
        .then(function (r) {
          return r.json();
        })
        .then(function (data) {
          var city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            "Your area";
          var state = data.address.state || "";
          userLocation = city + (state ? ", " + state : "");
          txt.textContent = "From: " + userLocation;
          pill.classList.remove("detecting");
        })
        .catch(function () {
          txt.textContent = "Location detected";
          pill.classList.remove("detecting");
        });
    },
    function () {
      txt.textContent = "Click to use location";
      pill.classList.remove("detecting");
    },
    { timeout: 8000 }
  );
}

function togglePill(el) {
  el.classList.toggle("sel");
}
function setSingle(el, gid) {
  document.querySelectorAll("#" + gid + " .ipill").forEach(function (p) {
    p.classList.remove("single-sel");
  });
  el.classList.add("single-sel");
}

/* ── Budget: hybrid pill + custom INR ── */
function setBudgetPill(el) {
  document.querySelectorAll("#budgetPills .ipill").forEach(function (p) {
    p.classList.remove("single-sel");
  });
  el.classList.add("single-sel");
  document.getElementById("budgetCustom").value = ""; // clear custom when pill chosen
}
function onBudgetInput(inp) {
  if (inp.value) {
    // deselect all keyword pills when user types a number
    document.querySelectorAll("#budgetPills .ipill").forEach(function (p) {
      p.classList.remove("single-sel");
    });
  }
}
function getBudgetValue() {
  var custom = document.getElementById("budgetCustom").value.trim();
  if (custom)
    return (
      "₹" + parseInt(custom).toLocaleString("en-IN") + "/day custom budget"
    );
  var pill = document.querySelector("#budgetPills .single-sel");
  return pill ? pill.dataset.val : "moderate";
}

/* ── Activities master list — expanded ── */
var ACTS = {
  default: [
    { icon: "🏛️", label: "Visit local museum", sub: "Cultural" },
    { icon: "🍜", label: "Try street food", sub: "Food" },
    { icon: "🌅", label: "Sunrise viewpoint", sub: "Nature" },
    { icon: "🛕", label: "Visit temple/shrine", sub: "Spiritual" },
    { icon: "🛍️", label: "Local market shopping", sub: "Shopping" },
    { icon: "🚶", label: "Walking heritage tour", sub: "Culture" },
    { icon: "🍽️", label: "Dinner at local restaurant", sub: "Food" },
    { icon: "📸", label: "Photography walk", sub: "Leisure" },
    { icon: "☕", label: "Café & chill", sub: "Relaxation" },
    { icon: "🚗", label: "Scenic drive", sub: "Transport" },
    { icon: "🎭", label: "Cultural show / folk art", sub: "Evening" },
    { icon: "🛶", label: "Boat ride", sub: "Adventure" },
    { icon: "🌿", label: "Nature walk / park visit", sub: "Nature" },
    { icon: "🎨", label: "Art gallery visit", sub: "Culture" },
    { icon: "🏞️", label: "Waterfall visit", sub: "Nature" },
    { icon: "🧘", label: "Morning yoga / meditation", sub: "Wellness" },
    { icon: "🚲", label: "Cycling tour", sub: "Active" },
    { icon: "🌃", label: "Night market stroll", sub: "Evening" },
    { icon: "🍦", label: "Local sweets & desserts", sub: "Food" },
    { icon: "🎪", label: "Local fair / festival", sub: "Culture" },
    { icon: "🏊", label: "Swimming / lake dip", sub: "Leisure" },
    { icon: "🛺", label: "Auto-rickshaw city tour", sub: "Transport" },
    { icon: "🌄", label: "Sunset viewpoint", sub: "Nature" },
    { icon: "🍳", label: "Cooking class", sub: "Experience" },
    { icon: "🎵", label: "Live music / open mic", sub: "Night" },
    { icon: "📖", label: "Visit local library / bookshop", sub: "Leisure" },
    { icon: "🏋️", label: "Gym / workout session", sub: "Wellness" },
    { icon: "🧵", label: "Handicraft workshop", sub: "Experience" },
    { icon: "🌊", label: "Riverside walk", sub: "Nature" },
    { icon: "🏟️", label: "Stadium / sports venue tour", sub: "Sport" },
    { icon: "🎡", label: "Amusement / theme park", sub: "Fun" },
    { icon: "🕌", label: "Mosque / church visit", sub: "Spiritual" },
    { icon: "🦜", label: "Wildlife / bird sanctuary", sub: "Nature" },
    { icon: "🚠", label: "Cable car / ropeway ride", sub: "Adventure" },
    { icon: "🍺", label: "Local brewery / tap room", sub: "Evening" },
    { icon: "💆", label: "Spa / ayurvedic massage", sub: "Wellness" },
    { icon: "🗺️", label: "Guided city tour", sub: "Culture" },
    { icon: "🧗", label: "Rock climbing / bouldering", sub: "Adventure" },
    { icon: "🏄", label: "Water sports", sub: "Adventure" },
    { icon: "🎲", label: "Board games café", sub: "Leisure" },
  ],
  beach: [
    { icon: "🏖️", label: "Beach walk at sunrise", sub: "Nature" },
    { icon: "🤿", label: "Snorkelling / diving", sub: "Adventure" },
    { icon: "🚤", label: "Boat cruise", sub: "Leisure" },
    { icon: "🍹", label: "Beachside sundowner", sub: "Evening" },
    { icon: "🏄", label: "Surfing lesson", sub: "Sport" },
    { icon: "🦀", label: "Seafood shack dinner", sub: "Food" },
    { icon: "🌊", label: "Stand-up paddleboarding", sub: "Adventure" },
    { icon: "🎣", label: "Fishing trip", sub: "Leisure" },
    { icon: "🏝️", label: "Island hopping", sub: "Adventure" },
    { icon: "⛱️", label: "Beach bonfire", sub: "Evening" },
  ],
  mountain: [
    { icon: "🥾", label: "Morning trek", sub: "Adventure" },
    { icon: "⛺", label: "Campfire evening", sub: "Evening" },
    { icon: "🦅", label: "Bird watching", sub: "Nature" },
    { icon: "🌿", label: "Forest walk", sub: "Nature" },
    { icon: "🏔️", label: "Summit viewpoint", sub: "Nature" },
    { icon: "🍄", label: "Foraging walk", sub: "Experience" },
    { icon: "🚵", label: "Mountain biking", sub: "Adventure" },
    { icon: "🛷", label: "Sledding / snow play", sub: "Fun" },
    { icon: "🌲", label: "Tree-top walk", sub: "Nature" },
    { icon: "🧭", label: "Orienteering / trail run", sub: "Active" },
  ],
  city: [
    { icon: "🏙️", label: "City skyline view", sub: "Sightseeing" },
    { icon: "🎨", label: "Art gallery visit", sub: "Culture" },
    { icon: "🍕", label: "Rooftop dinner", sub: "Evening" },
    { icon: "🎶", label: "Live music venue", sub: "Night" },
    { icon: "🏬", label: "Shopping mall / high street", sub: "Shopping" },
    { icon: "🎬", label: "Cinema / indie film", sub: "Evening" },
    { icon: "🍻", label: "Craft beer bar", sub: "Evening" },
    { icon: "🗼", label: "Iconic landmark visit", sub: "Sightseeing" },
    { icon: "🚇", label: "Metro / public transport ride", sub: "Transport" },
    { icon: "🌆", label: "Golden hour rooftop", sub: "Evening" },
  ],
  heritage: [
    { icon: "🏰", label: "Fort / palace tour", sub: "Heritage" },
    { icon: "🖼️", label: "Museum visit", sub: "Cultural" },
    { icon: "🧵", label: "Handicraft workshop", sub: "Experience" },
    { icon: "🐘", label: "Wildlife / nature tour", sub: "Wildlife" },
    { icon: "🏺", label: "Pottery village visit", sub: "Culture" },
    { icon: "🎪", label: "Puppet show / folk drama", sub: "Culture" },
    { icon: "📜", label: "Archaeological site walk", sub: "Heritage" },
    { icon: "🔭", label: "Observatory / stargazing", sub: "Night" },
  ],
};

function getSuggestions(dest) {
  var d = dest.toLowerCase();
  var base = ACTS.default.slice();
  if (/beach|goa|puri|kovalam|andaman|bali|cancun|malibu/.test(d))
    base = base.concat(ACTS.beach);
  if (
    /mountain|hill|manali|shimla|darjeeling|ooty|munnar|coorg|banff|aspen/.test(
      d
    )
  )
    base = base.concat(ACTS.mountain);
  if (/city|mumbai|delhi|bangalore|tokyo|dubai|new york|london/.test(d))
    base = base.concat(ACTS.city);
  if (/jaipur|rajasthan|agra|varanasi|hampi|fort|palace/.test(d))
    base = base.concat(ACTS.heritage);
  var seen = new Set();
  return base.filter(function (a) {
    if (seen.has(a.label)) return false;
    seen.add(a.label);
    return true;
  });
}

function renderSuggestions(dest) {
  var acts = getSuggestions(dest);
  window._acts = acts;
  document.getElementById("destNameTag").textContent = dest;
  document.getElementById("suggestionChips").innerHTML = acts
    .map(function (a, i) {
      return (
        '<div class="itin-chip" draggable="true" ondragstart="chipDragStart(event,' +
        i +
        ')" onclick="chipClick(' +
        i +
        ')">' +
        a.icon +
        " " +
        a.label +
        "</div>"
      );
    })
    .join("");
}

function scrollChipsLeft() {
  document
    .getElementById("suggestionChips")
    .scrollBy({ left: -260, behavior: "smooth" });
}
function scrollChipsRight() {
  document
    .getElementById("suggestionChips")
    .scrollBy({ left: 260, behavior: "smooth" });
}

function initBuilder() {
  var dest = document.getElementById("setupDest").value.trim();
  if (!dest) {
    var el = document.getElementById("setupDest");
    el.focus();
    el.style.borderColor = "#fe424d";
    el.placeholder = "Enter a destination first!";
    return;
  }
  builderDays = parseInt(document.getElementById("setupDays").value) || 3;
  activeDayIdx = 0;
  dayPlans = {};
  for (var i = 0; i < builderDays; i++)
    dayPlans[i] = { morning: [], afternoon: [], evening: [] };
  renderDayTabs();
  renderActiveDay();
  renderSuggestions(dest);
  document.getElementById("builderDestLabel").textContent = "— " + dest;
  var builder = document.getElementById("itinBuilder");
  builder.classList.add("visible");
  setTimeout(function () {
    builder.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
  loadStays(dest);
  updateGenBar();
}

function resetBuilder() {
  document.getElementById("itinBuilder").classList.remove("visible");
  dayPlans = {};
}

function renderDayTabs() {
  var nav = document.getElementById("dayTabs");
  var html = '<button class="itin-adj-btn" onclick="adjDays(-1)">−</button>';
  for (var i = 0; i < builderDays; i++) {
    var total = dayPlans[i]
      ? dayPlans[i].morning.length +
        dayPlans[i].afternoon.length +
        dayPlans[i].evening.length
      : 0;
    html +=
      '<button class="itin-day-tab' +
      (i === activeDayIdx ? " active" : "") +
      '" onclick="switchDay(' +
      i +
      ')">Day ' +
      (i + 1) +
      (total > 0
        ? ' <span style="opacity:.7;font-size:.65rem;">(' + total + ")</span>"
        : "") +
      " </button>";
  }
  html += '<button class="itin-adj-btn" onclick="adjDays(1)">+</button>';
  nav.innerHTML = html;
}

function switchDay(idx) {
  activeDayIdx = idx;
  renderDayTabs();
  renderActiveDay();
}

function adjDays(d) {
  var next = builderDays + d;
  if (next < 1 || next > 14) return;
  builderDays = next;
  if (activeDayIdx >= builderDays) activeDayIdx = builderDays - 1;
  if (!dayPlans[builderDays - 1])
    dayPlans[builderDays - 1] = { morning: [], afternoon: [], evening: [] };
  renderDayTabs();
  renderActiveDay();
}

function renderActiveDay() {
  var dest = document.getElementById("setupDest").value.trim();
  var dp = dayPlans[activeDayIdx] || {
    morning: [],
    afternoon: [],
    evening: [],
  };
  var date = document.getElementById("setupDate").value;
  var dateLabel = "";
  if (date) {
    var d = new Date(date);
    d.setDate(d.getDate() + activeDayIdx);
    dateLabel = d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }
  var slots = [
    {
      key: "morning",
      label: "Morning",
      time: "6 AM–12 PM",
      cls: "morning",
      icon: "fa-solid fa-sun",
    },
    {
      key: "afternoon",
      label: "Afternoon",
      time: "12 PM–6 PM",
      cls: "afternoon",
      icon: "fa-solid fa-cloud-sun",
    },
    {
      key: "evening",
      label: "Evening",
      time: "6 PM–10 PM",
      cls: "evening",
      icon: "fa-solid fa-moon",
    },
  ];
  var slotsHtml = slots
    .map(function (s) {
      var acts = dp[s.key] || [];
      var cards = acts
        .map(function (a, ai) {
          return (
            '<div class="itin-activity" draggable="true" ondragstart="actDragStart(event,' +
            ai +
            ",'" +
            s.key +
            "')\">" +
            '<span class="itin-activity-icon">' +
            a.icon +
            "</span>" +
            '<div class="itin-activity-text">' +
            a.label +
            (a.sub
              ? '<div class="itin-activity-sub">' + a.sub + "</div>"
              : "") +
            "</div>" +
            '<button class="itin-activity-del" onclick="removeAct(' +
            activeDayIdx +
            ",'" +
            s.key +
            "'," +
            ai +
            ')"><i class="fa-solid fa-xmark"></i></button>' +
            "</div>"
          );
        })
        .join("");
      return (
        '<div class="itin-slot-col">' +
        '<div class="itin-slot-head"><div class="itin-slot-icon ' +
        s.cls +
        '"><i class="' +
        s.icon +
        '"></i></div><span class="itin-slot-title">' +
        s.label +
        '</span><span class="itin-slot-time">' +
        s.time +
        "</span></div>" +
        '<div class="itin-activities">' +
        cards +
        "</div>" +
        '<div class="itin-drop-zone" ondragover="dzOver(event)" ondragleave="dzLeave(event)" ondrop="dzDrop(event,' +
        activeDayIdx +
        ",'" +
        s.key +
        "')\">+ Drop here</div>" +
        '<div class="itin-add-activity"><input class="itin-add-input" id="ai-' +
        s.key +
        '" placeholder="Type &amp; press Enter…" onkeydown="addEnter(event,' +
        activeDayIdx +
        ",'" +
        s.key +
        '\')"><button class="itin-add-btn" onclick="addManual(' +
        activeDayIdx +
        ",'" +
        s.key +
        '\')"><i class="fa-solid fa-plus"></i></button></div>' +
        "</div>"
      );
    })
    .join("");
  document.getElementById("dayCanvases").innerHTML =
    '<div class="itin-day-canvas">' +
    '<div class="itin-canvas-head">' +
    '<div class="itin-canvas-day-label">' +
    '<div class="itin-canvas-day-num">' +
    (activeDayIdx + 1) +
    "</div>" +
    '<div class="itin-canvas-day-info"><strong>Day ' +
    (activeDayIdx + 1) +
    (dest ? " — " + dest : "") +
    "</strong><span>" +
    (dateLabel || "Drag activities · type below · click chips above") +
    "</span></div>" +
    "</div>" +
    '<div class="itin-canvas-head-actions"><button class="itin-canvas-btn" onclick="clearDay(' +
    activeDayIdx +
    ')"><i class="fa-solid fa-trash"></i> Clear</button></div>' +
    "</div>" +
    '<div class="itin-slots-grid">' +
    slotsHtml +
    "</div>" +
    "</div>";
  updateGenBar();
}

function removeAct(di, slot, ai) {
  dayPlans[di][slot].splice(ai, 1);
  renderDayTabs();
  renderActiveDay();
}
function clearDay(di) {
  dayPlans[di] = { morning: [], afternoon: [], evening: [] };
  renderDayTabs();
  renderActiveDay();
}

function addManual(di, slot) {
  var inp = document.getElementById("ai-" + slot);
  var val = inp.value.trim();
  if (!val) return;
  if (!dayPlans[di]) dayPlans[di] = { morning: [], afternoon: [], evening: [] };
  dayPlans[di][slot].push({ icon: "📌", label: val, sub: "Custom" });
  inp.value = "";
  renderDayTabs();
  renderActiveDay();
}
function addEnter(e, di, slot) {
  if (e.key === "Enter") addManual(di, slot);
}

function chipClick(idx) {
  var a = window._acts[idx];
  var dp = dayPlans[activeDayIdx];
  var order = ["morning", "afternoon", "evening"];
  for (var i = 0; i < order.length; i++) {
    if (dp[order[i]].length < 4) {
      dp[order[i]].push({ icon: a.icon, label: a.label, sub: a.sub });
      renderDayTabs();
      renderActiveDay();
      return;
    }
  }
  dp.evening.push({ icon: a.icon, label: a.label, sub: a.sub });
  renderDayTabs();
  renderActiveDay();
}

function chipDragStart(e, idx) {
  dragActivity = window._acts[idx];
  dragFromSlot = null;
  dragFromDayIdx = null;
  e.dataTransfer.effectAllowed = "copy";
}
function actDragStart(e, ai, slot) {
  dragActivity = dayPlans[activeDayIdx][slot][ai];
  dragFromSlot = slot;
  dragFromDayIdx = activeDayIdx;
  e.dataTransfer.effectAllowed = "move";
}
function stayDragStart(e, title, loc, country, price) {
  dragActivity = {
    icon: "🏨",
    label: title,
    sub: loc + ", " + country + " — ₹" + price + "/night",
  };
  dragFromSlot = null;
  dragFromDayIdx = null;
  e.dataTransfer.effectAllowed = "copy";
}
function dzOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add("drag-over");
}
function dzLeave(e) {
  e.currentTarget.classList.remove("drag-over");
}
function dzDrop(e, di, slot) {
  e.preventDefault();
  e.currentTarget.classList.remove("drag-over");
  if (!dragActivity) return;
  if (dragFromSlot !== null) {
    var src = dayPlans[dragFromDayIdx][dragFromSlot];
    var si = src.indexOf(dragActivity);
    if (si > -1) src.splice(si, 1);
  }
  if (!dayPlans[di]) dayPlans[di] = { morning: [], afternoon: [], evening: [] };
  dayPlans[di][slot].push(dragActivity);
  dragActivity = null;
  dragFromSlot = null;
  dragFromDayIdx = null;
  renderDayTabs();
  renderActiveDay();
}

function updateGenBar() {
  var total = 0;
  for (var i = 0; i < builderDays; i++)
    if (dayPlans[i])
      total +=
        dayPlans[i].morning.length +
        dayPlans[i].afternoon.length +
        dayPlans[i].evening.length;
  var dest = document.getElementById("setupDest").value.trim();
  document.getElementById("genBarTitle").textContent =
    total === 0
      ? "Ready to generate?"
      : total +
        " activit" +
        (total === 1 ? "y" : "ies") +
        " across " +
        builderDays +
        " day" +
        (builderDays === 1 ? "" : "s");
  document.getElementById("genBarSub").textContent =
    total === 0
      ? "Add some activities then let AI complete your itinerary."
      : "AI will add restaurants, tips, costs and hidden gems around " +
        (dest || "your destination") +
        ".";
}

async function loadStays(dest) {
  var section = document.getElementById("staysSection"),
    grid = document.getElementById("staysGrid");
  document.getElementById("staysDestLabel").textContent = dest;
  try {
    var res = await fetch("/api/tb-listings");
    var data = await res.json();
    var all = data.listings || [];
    var dLow = dest.toLowerCase();
    var matches = all.filter(function (l) {
      return (
        l.location.toLowerCase().includes(dLow) ||
        l.country.toLowerCase().includes(dLow) ||
        l.title.toLowerCase().includes(dLow)
      );
    });
    if (!matches.length) matches = all.slice(0, 4);
    matches = matches.slice(0, 6);
    if (!matches.length) {
      section.style.display = "none";
      return;
    }
    grid.innerHTML = matches
      .map(function (l) {
        return (
          '<div class="itin-stay-card" draggable="true" ondragstart="stayDragStart(event,\'' +
          l.title.replace(/'/g, "") +
          "','" +
          l.location +
          "','" +
          l.country +
          "'," +
          (l.price || 0) +
          ')" title="Drag to add as stay">' +
          (l.image && l.image.url
            ? '<img src="' +
              l.image.url +
              '" alt="" onerror="this.style.display=\'none\'">'
            : "") +
          '<div class="itin-stay-card-body"><div class="itin-stay-card-name">' +
          l.title +
          '</div><div class="itin-stay-card-loc"><i class="fa-solid fa-location-dot" style="color:#fe424d;font-size:.58rem;margin-right:2px;"></i>' +
          l.location +
          ", " +
          l.country +
          '</div><div class="itin-stay-card-price">₹' +
          (l.price || 0).toLocaleString("en-IN") +
          "/night</div></div>" +
          "</div>"
        );
      })
      .join("");
    section.style.display = "block";
  } catch (e) {
    section.style.display = "none";
  }
}

function generateFromBuilder() {
  var dest = document.getElementById("setupDest").value.trim();
  var budget = getBudgetValue();
  var styles = [].slice
    .call(document.querySelectorAll("#stylePills .sel"))
    .map(function (el) {
      return el.dataset.val;
    });
  var group = document.getElementById("setupGroup").value;
  var date = document.getElementById("setupDate").value;
  var origin = userLocation ? " (travelling from " + userLocation + ")" : "";
  var lines = [];
  for (var i = 0; i < builderDays; i++) {
    var dp = dayPlans[i] || { morning: [], afternoon: [], evening: [] };
    var fmt = function (s) {
      return (
        s
          .map(function (a) {
            return a.label;
          })
          .join(", ") || "flexible"
      );
    };
    lines.push(
      "Day " +
        (i + 1) +
        ":\n  Morning: " +
        fmt(dp.morning) +
        "\n  Afternoon: " +
        fmt(dp.afternoon) +
        "\n  Evening: " +
        fmt(dp.evening)
    );
  }
  var prompt = "Plan a " + builderDays + "-day trip to " + dest + origin;
  if (date) prompt += " starting " + date;
  prompt += " for a " + group + " with a " + budget + " budget";
  if (styles.length) prompt += " (" + styles.join(", ") + " style)";
  prompt += ".\n\nHere is my planned outline:\n\n" + lines.join("\n\n");
  prompt +=
    "\n\nFor each day and time slot:\n- Keep my activities and build around them\n- Suggest specific restaurants, cafés or local eateries nearby\n- Add 1 hidden gem or offbeat tip per day\n- Estimate costs in INR\n- Add practical travel tips (transport, timing, what to carry)\n- Suggest the best Wanderlust stay if relevant";
  window.location.href =
    "/ai-assistant?prompt=" +
    encodeURIComponent(prompt) +
    "&destination=" +
    encodeURIComponent(dest);
}

function quickGenerate() {
  var dest = document.getElementById("qDest").value.trim();
  if (!dest) {
    var el = document.getElementById("qDest");
    el.focus();
    el.style.borderColor = "#fe424d";
    el.placeholder = "Enter a destination!";
    return;
  }
  var days = document.getElementById("qDays").value;
  var date = document.getElementById("qDate").value;
  var group = document.getElementById("qGroup").value;
  var budget = document.getElementById("qBudget").value;
  var transport = document.getElementById("qTransport").value;
  var size = document.getElementById("qSize").value;
  var interests = document.getElementById("qInterests").value.trim();
  var food = document.getElementById("qFood").value.trim();
  var mustSee = document.getElementById("qMustSee").value.trim();
  var origin = userLocation ? " from " + userLocation : "";
  var prompt = "Plan a " + days + "-day trip to " + dest + origin;
  if (date) prompt += " starting " + date;
  prompt +=
    " for " + group + " (" + size + " people) on a " + budget + " budget.";
  if (transport !== "any") prompt += " Transport: " + transport + ".";
  if (interests) prompt += " Interests: " + interests + ".";
  if (food) prompt += " Food: " + food + ".";
  if (mustSee) prompt += " Must-see: " + mustSee + ".";
  prompt +=
    " Give a detailed day-by-day itinerary with morning, afternoon and evening activities, restaurant recommendations, hidden gems, estimated costs in INR, and practical travel tips.";
  var btn = document.getElementById("qGenBtn");
  btn.disabled = true;
  btn.innerHTML =
    '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending to AI…';
  window.location.href =
    "/ai-assistant?prompt=" +
    encodeURIComponent(prompt) +
    "&destination=" +
    encodeURIComponent(dest);
}

document.addEventListener("DOMContentLoaded", function () {
  var today = new Date().toISOString().split("T")[0];
  document.getElementById("setupDate").value = today;
  document.getElementById("qDate").value = today;
  var dest = new URLSearchParams(window.location.search).get("destination");
  if (dest) {
    document.getElementById("setupDest").value = dest;
    document.getElementById("qDest").value = dest;
  }
  detectLocation();
});
