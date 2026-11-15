# Malta Stone — webshop

Static storefront draft for Malta Stone: home, category and intent listings, product pages, cart drawer, search and a demo checkout. No build step and no dependencies.

**Checkout is a demo.** Orders are not sent anywhere and no payment is taken.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Layout

| Path | Contents |
| --- | --- |
| `index.html` | Page shell; views are rendered into `#app` |
| `css/styles.css` | All styles |
| `js/products.js` | Product catalogue (`PRODUCTS`) |
| `js/app.js` | Categories, views, cart, hash router |
| `assets/img/` | Logo, product and lifestyle photos |

Routes are hash-based (`#/shop/crystals`, `#/intent/calm`, `#/p/280`, `#/checkout`), so the site can be hosted on any static host as-is.

To add a product, append an entry to `js/products.js` and put its image in `assets/img/`.
