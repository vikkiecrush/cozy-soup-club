/* Browse page: search + type/diet filters + sort, with state kept in the URL
   so filtered views are shareable and survive refresh/back-button. */
(function () {
  "use strict";

  var VALID_TYPES = ["all", "vegetarian", "non-vegetarian"];
  var VALID_DIETS = ["vegan", "gluten-free", "dairy-free", "high-protein"];
  var VALID_SORTS = ["featured", "quickest", "az"];

  var recipes = window.RECIPES || [];
  var state = { q: "", type: "all", diets: [], sort: "featured" };

  var qInput = document.getElementById("q");
  var sortSelect = document.getElementById("sort");
  var results = document.getElementById("results");
  var emptyBox = document.getElementById("empty");
  var countEl = document.getElementById("count");
  var clearBtn = document.getElementById("clear");
  var typeRadios = document.querySelectorAll('input[name="type"]');
  var dietBoxes = document.querySelectorAll('input[name="diet"]');

  // Pre-built lowercase search text per recipe (name, tagline, type, diets, ingredients).
  var haystack = {};
  recipes.forEach(function (r) {
    haystack[r.id] = [r.name, r.tagline, r.type, r.diets.join(" "), r.ingredients.join(" ")]
      .join(" ")
      .toLowerCase();
  });

  function matches(r) {
    if (state.type !== "all" && r.type !== state.type) return false;
    // A vegan soup is vegetarian too, but the Type chip is explicit, so vegan only narrows via the Diet chip.
    for (var i = 0; i < state.diets.length; i++) {
      if (r.diets.indexOf(state.diets[i]) === -1) return false;
    }
    if (state.q) {
      var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var j = 0; j < words.length; j++) {
        if (haystack[r.id].indexOf(words[j]) === -1) return false;
      }
    }
    return true;
  }

  function sorted(list) {
    var copy = list.slice();
    if (state.sort === "quickest") {
      copy.sort(function (a, b) { return a.time - b.time; });
    } else if (state.sort === "az") {
      copy.sort(function (a, b) { return a.name.localeCompare(b.name); });
    }
    return copy;
  }

  function hasActiveFilters() {
    return state.q !== "" || state.type !== "all" || state.diets.length > 0;
  }

  function render() {
    var list = sorted(recipes.filter(matches));
    results.textContent = "";
    list.forEach(function (r) { results.appendChild(window.Soup.recipeCard(r)); });

    var n = list.length;
    countEl.textContent = "Showing " + n + " of " + recipes.length + " soup" + (recipes.length === 1 ? "" : "s");
    emptyBox.hidden = n !== 0;
    results.hidden = n === 0;
    clearBtn.hidden = !hasActiveFilters();
    writeUrl();
  }

  /* ----- URL <-> state ----- */
  function readUrl() {
    var p = new URLSearchParams(window.location.search);
    var type = p.get("type");
    var sort = p.get("sort");
    state.q = (p.get("q") || "").slice(0, 80);
    state.type = VALID_TYPES.indexOf(type) !== -1 ? type : "all";
    state.sort = VALID_SORTS.indexOf(sort) !== -1 ? sort : "featured";
    state.diets = p.getAll("diet").filter(function (d, i, arr) {
      return VALID_DIETS.indexOf(d) !== -1 && arr.indexOf(d) === i;
    });
  }

  function writeUrl() {
    var p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.type !== "all") p.set("type", state.type);
    state.diets.forEach(function (d) { p.append("diet", d); });
    if (state.sort !== "featured") p.set("sort", state.sort);
    var qs = p.toString();
    var url = window.location.pathname + (qs ? "?" + qs : "");
    // replaceState can throw on some file:// contexts; failing silently is fine.
    try { window.history.replaceState(null, "", url); } catch (e) { /* ignore */ }
  }

  /* ----- sync controls with state ----- */
  function syncControls() {
    qInput.value = state.q;
    sortSelect.value = state.sort;
    typeRadios.forEach(function (r) { r.checked = r.value === state.type; });
    dietBoxes.forEach(function (b) { b.checked = state.diets.indexOf(b.value) !== -1; });
  }

  function clearAll() {
    state.q = "";
    state.type = "all";
    state.diets = [];
    state.sort = "featured";
    syncControls();
    render();
    qInput.focus();
  }

  /* ----- events ----- */
  qInput.addEventListener("input", function () { state.q = qInput.value.trim(); render(); });
  sortSelect.addEventListener("change", function () { state.sort = sortSelect.value; render(); });
  typeRadios.forEach(function (r) {
    r.addEventListener("change", function () { if (r.checked) { state.type = r.value; render(); } });
  });
  dietBoxes.forEach(function (b) {
    b.addEventListener("change", function () {
      state.diets = Array.prototype.filter.call(dietBoxes, function (x) { return x.checked; })
        .map(function (x) { return x.value; });
      render();
    });
  });
  clearBtn.addEventListener("click", clearAll);
  document.getElementById("empty-clear").addEventListener("click", clearAll);

  readUrl();
  syncControls();
  render();
})();
