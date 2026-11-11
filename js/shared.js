/* Shared helpers: mobile nav, footer year, recipe card + bowl icon builders. */
(function () {
  "use strict";

  // Static, trusted markup only (no user data is ever interpolated into it).
  function bowlSvg(accent) {
    return (
      '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
      '<path d="M22 24c-4 6 4 9 0 15M50 20c-4 6 4 9 0 15M78 24c-4 6 4 9 0 15" ' +
      'fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M8 52h84c0 22-17 36-42 36S8 74 8 52z" fill="#fff"/>' +
      '<ellipse cx="50" cy="52" rx="42" ry="9" fill="' + accent + '"/>' +
      '<ellipse cx="50" cy="52" rx="42" ry="9" fill="none" stroke="#fff" stroke-width="4"/>' +
      '<circle cx="35" cy="52" r="2.5" fill="#fff" fill-opacity=".65"/>' +
      '<circle cx="55" cy="50" r="2" fill="#fff" fill-opacity=".65"/>' +
      '<circle cx="68" cy="53" r="2.5" fill="#fff" fill-opacity=".65"/>' +
      "</svg>"
    );
  }

  var DIET_LABELS = {
    "vegan": "Vegan",
    "gluten-free": "Gluten-free",
    "dairy-free": "Dairy-free",
    "high-protein": "High-protein"
  };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function badges(recipe) {
    var wrap = el("div", "badges");
    wrap.appendChild(
      el(
        "span",
        "badge " + (recipe.type === "vegetarian" ? "veg" : "nonveg"),
        recipe.type === "vegetarian" ? "Vegetarian" : "Non-vegetarian"
      )
    );
    recipe.diets.forEach(function (d) {
      wrap.appendChild(el("span", "badge", DIET_LABELS[d] || d));
    });
    return wrap;
  }

  function recipeCard(recipe) {
    var card = el("article", "card");

    var art = el("div", "card-art");
    art.style.background = "linear-gradient(135deg," + recipe.colors[0] + "," + recipe.colors[1] + ")";
    art.innerHTML = bowlSvg(recipe.colors[1]);
    card.appendChild(art);

    var body = el("div", "card-body");
    body.appendChild(badges(recipe));

    var h3 = el("h3");
    var link = el("a", "", recipe.name);
    link.href = "recipe.html?id=" + encodeURIComponent(recipe.id);
    h3.appendChild(link);
    body.appendChild(h3);

    body.appendChild(el("p", "", recipe.tagline));

    var meta = el("div", "meta");
    meta.appendChild(el("span", "", recipe.time + " min"));
    meta.appendChild(el("span", "", "Serves " + recipe.servings));
    meta.appendChild(el("span", "", recipe.difficulty));
    body.appendChild(meta);

    card.appendChild(body);
    return card;
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  function initFooterYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initFooterYear();
  });

  window.Soup = { bowlSvg: bowlSvg, recipeCard: recipeCard, badges: badges, el: el, DIET_LABELS: DIET_LABELS };
})();
