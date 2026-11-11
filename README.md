# The Cozy Soup Club

A personal portfolio project: a responsive recipe website for winter soups.
Built with plain HTML, CSS and vanilla JavaScript. There are no frameworks, no build step and no dependencies.

## Features

- Homepage with hero, category tiles and featured recipes
- 12 recipes: 6 vegetarian and 6 non-vegetarian
- Live search across recipe names, taglines and ingredients
- Filters: Type (vegetarian or non-vegetarian) and dietary needs (vegan, gluten-free, dairy-free, high-protein)
- Sorting (featured, quickest, A to Z)
- Filter state stored in the URL, so filtered views can be shared (`recipes.html?type=vegetarian&diet=gluten-free`)
- Recipe detail pages with an ingredient checklist (remembered in `localStorage`), print styles and related soups
- Mobile-first responsive layout, keyboard-accessible, semantic HTML, `prefers-reduced-motion` respected

## Run locally

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project structure

```
index.html          Homepage
recipes.html        Browse, search and filter
recipe.html         Recipe detail (reads ?id=...)
css/styles.css      All styles
js/recipes-data.js  Recipe data (JSON assigned to window.RECIPES)
js/shared.js        Nav, footer year, card + bowl builders
js/recipes.js       Search, filters, sort, URL state
js/recipe.js        Detail page rendering
```

## Adding a recipe

Add an object to the array in `js/recipes-data.js`. Required fields: `id` (unique slug), `name`, `tagline`, `colors` (two hex values),
`type` (`vegetarian` or `non-vegetarian`), `diets` (any of `vegan`, `gluten-free`, `dairy-free`, `high-protein`), `time` (minutes),
`servings`, `difficulty`, `ingredients[]`, `steps[]` and optional `tip`.

## Deploy to GitHub Pages

1. Create a new public repo on your personal GitHub account named `cozy-soup-club`.
2. Push this folder to the `main` branch.
3. In the repo go to Settings, then Pages. Set the source to "Deploy from a branch", choose `main` and `/ (root)`, then save.
4. The site goes live at `https://<your-username>.github.io/cozy-soup-club/`.

All asset paths are relative, so the site works from a project sub-path.

## Ideas for v2

- Real photography
- Servings scaler
- Favorites saved in `localStorage`
- Shopping list generator
- Recipe JSON-LD structured data for SEO
