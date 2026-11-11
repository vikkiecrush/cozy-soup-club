/* Recipe detail page: renders one recipe from ?id=..., with a persistent ingredient checklist. */
(function () {
  "use strict";

  var S = window.Soup;
  var el = S.el;
  var root = document.getElementById("recipe-root");
  var id = new URLSearchParams(window.location.search).get("id");
  var recipe = (window.RECIPES || []).find(function (r) { return r.id === id; });

  function notFound() {
    document.title = "Recipe not found | The Cozy Soup Club";
    var wrap = el("div", "container");
    wrap.style.padding = "4rem 0";
    wrap.appendChild(el("h1", "", "We couldn't find that soup"));
    wrap.appendChild(el("p", "", "The recipe link may be out of date."));
    var a = el("a", "btn", "Browse all soups");
    a.href = "recipes.html";
    wrap.appendChild(a);
    root.appendChild(wrap);
  }

  /* ----- checklist persistence (localStorage can be blocked, so always guard) ----- */
  var storeKey = "csc-checked-" + (recipe ? recipe.id : "");
  function loadChecked() {
    try { return JSON.parse(localStorage.getItem(storeKey)) || []; } catch (e) { return []; }
  }
  function saveChecked(list) {
    try { localStorage.setItem(storeKey, JSON.stringify(list)); } catch (e) { /* ignore */ }
  }

  function renderHero() {
    var hero = el("section", "recipe-hero");
    hero.style.background = "linear-gradient(135deg," + recipe.colors[0] + "," + recipe.colors[1] + ")";
    var c = el("div", "container");

    var crumbs = el("nav", "crumbs");
    crumbs.setAttribute("aria-label", "Breadcrumb");
    var back = el("a", "", "All soups");
    back.href = "recipes.html";
    crumbs.appendChild(back);
    crumbs.appendChild(document.createTextNode(" / " + recipe.name));
    c.appendChild(crumbs);

    var grid = el("div", "recipe-hero-grid");
    var art = el("div");
    art.innerHTML = S.bowlSvg(recipe.colors[1]);
    grid.appendChild(art);

    var text = el("div", "recipe-hero-text");
    text.appendChild(S.badges(recipe));
    text.appendChild(el("h1", "", recipe.name));
    text.appendChild(el("p", "", recipe.tagline));
    grid.appendChild(text);
    c.appendChild(grid);

    var facts = el("ul", "facts");
    [
      [recipe.time + " min", "Total time"],
      [String(recipe.servings), "Servings"],
      [recipe.difficulty, "Difficulty"],
      [recipe.type === "vegetarian" ? "Vegetarian" : "Non-vegetarian", "Type"]
    ].forEach(function (f) {
      var li = el("li");
      li.appendChild(el("strong", "", f[0]));
      li.appendChild(el("span", "", f[1]));
      facts.appendChild(li);
    });
    c.appendChild(facts);

    hero.appendChild(c);
    return hero;
  }

  function renderBody() {
    var c = el("div", "container recipe-layout");

    // Ingredients
    var ing = el("section", "panel");
    ing.setAttribute("aria-labelledby", "ing-h");
    var ih = el("h2", "", "Ingredients");
    ih.id = "ing-h";
    ing.appendChild(ih);
    var ul = el("ul", "ingredients");
    var checked = loadChecked();
    recipe.ingredients.forEach(function (text, i) {
      var li = el("li");
      var label = el("label");
      var box = el("input");
      box.type = "checkbox";
      box.checked = checked.indexOf(i) !== -1;
      box.addEventListener("change", function () {
        var now = Array.prototype.map.call(ul.querySelectorAll("input"), function (b, idx) {
          return b.checked ? idx : -1;
        }).filter(function (x) { return x !== -1; });
        saveChecked(now);
      });
      label.appendChild(box);
      label.appendChild(el("span", "", text));
      li.appendChild(label);
      ul.appendChild(li);
    });
    ing.appendChild(ul);

    var actions = el("div", "actions");
    var reset = el("button", "btn btn-outline", "Reset checklist");
    reset.type = "button";
    reset.addEventListener("click", function () {
      ul.querySelectorAll("input").forEach(function (b) { b.checked = false; });
      saveChecked([]);
    });
    var print = el("button", "btn btn-outline", "Print recipe");
    print.type = "button";
    print.addEventListener("click", function () { window.print(); });
    actions.appendChild(reset);
    actions.appendChild(print);
    ing.appendChild(actions);
    c.appendChild(ing);

    // Method
    var method = el("section", "panel");
    method.setAttribute("aria-labelledby", "method-h");
    var mh = el("h2", "", "Method");
    mh.id = "method-h";
    method.appendChild(mh);
    var ol = el("ol", "steps");
    recipe.steps.forEach(function (s) { ol.appendChild(el("li", "", s)); });
    method.appendChild(ol);
    if (recipe.tip) {
      var tip = el("div", "tip");
      var strong = el("strong", "", "Cozy tip: ");
      tip.appendChild(strong);
      tip.appendChild(document.createTextNode(recipe.tip));
      method.appendChild(tip);
    }
    method.appendChild(
      el("p", "notice", "Dietary tags reflect standard ingredients. Check labels if you have allergies or restrictions.")
    );
    c.appendChild(method);
    return c;
  }

  function renderRelated() {
    var related = window.RECIPES.filter(function (r) {
      return r.id !== recipe.id && r.type === recipe.type;
    }).slice(0, 3);
    if (!related.length) return null;
    var sec = el("section", "section related");
    var c = el("div", "container");
    c.appendChild(el("h2", "", "More " + (recipe.type === "vegetarian" ? "vegetarian" : "non-vegetarian") + " soups"));
    var grid = el("div", "grid");
    related.forEach(function (r) { grid.appendChild(S.recipeCard(r)); });
    c.appendChild(grid);
    sec.appendChild(c);
    return sec;
  }

  if (!recipe) {
    notFound();
  } else {
    document.title = recipe.name + " | The Cozy Soup Club";
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", recipe.name + ": " + recipe.tagline);
    root.appendChild(renderHero());
    root.appendChild(renderBody());
    var rel = renderRelated();
    if (rel) root.appendChild(rel);
  }
})();
