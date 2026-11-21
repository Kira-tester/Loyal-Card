const collections = [
  {
    name: "Resin creations",
    category: "resin",
    description: "Handmade keepsakes, jewellery and thoughtful little treasures.",
    items: ["Keychain", "Jewellery", "Frames", "Varmala preservation", "Blood milk preservation", "Decor items", "Phone covers", "Baby things preservation", "Stationery"],
  },
  {
    name: "Kundan accessories",
    category: "kundan",
    description: "Traditional details and occasion pieces, made to feel like you.",
    items: ["Earrings", "Rings", "Bracelet", "Invisible chain", "Chain", "Anklet", "Necklace sets", "Hip belts", "Alligator clip", "Centre clip", "Saree pins", "U-pins", "Hair band", "Baby shower", "Marriage", "Name brooches"],
    groups: [
      { name: "Jewellery", items: ["Earrings", "Rings", "Bracelet", "Invisible chain", "Chain", "Anklet", "Necklace sets", "Hip belts"] },
      { name: "Brooches", items: ["Alligator clip", "Centre clip", "Saree pins", "U-pins", "Hair band", "Baby shower", "Marriage", "Name brooches"] },
    ],
  },
];

const page = document.body.dataset.page;
const menuButton = document.querySelector(".menu-button");
const menuPanel = document.querySelector(".menu-panel");
const backdrop = document.querySelector(".menu-backdrop");

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menuPanel.classList.toggle("is-open", open);
  backdrop.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
document.querySelector(".menu-close").addEventListener("click", () => setMenu(false));
backdrop.addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
menuPanel.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

const currentNav = document.querySelector(`[data-nav="${page}"]`);
if (currentNav) currentNav.setAttribute("aria-current", "page");

const categoryGrid = document.querySelector("#category-list");
if (categoryGrid) {
  const chips = document.querySelectorAll("[data-filter]");
  const renderCollections = (filter) => {
    const visible = filter === "all" ? collections : collections.filter((collection) => collection.category === filter);
    categoryGrid.replaceChildren();
    visible.forEach((collection) => {
      const card = document.createElement("article");
      card.className = "category-card fade-in";
      const title = document.createElement("h2");
      title.textContent = collection.name;
      const description = document.createElement("p");
      description.textContent = collection.description;
      const groups = collection.groups || [{ items: collection.items }];
      const categoryContent = document.createDocumentFragment();
      groups.forEach((group) => {
        if (group.name) {
          const groupHeading = document.createElement("h3");
          groupHeading.className = "subcategory-heading";
          groupHeading.textContent = group.name;
          categoryContent.append(groupHeading);
        }
        const items = document.createElement("div");
        items.className = "subcategories";
        group.items.forEach((item) => {
          const link = document.createElement("a");
          link.href = `search.html?q=${encodeURIComponent(item)}`;
          link.textContent = item;
          items.append(link);
        });
        categoryContent.append(items);
      });
      card.append(title, description, categoryContent);
      categoryGrid.append(card);
    });
  };
  const requestedFilter = new URLSearchParams(location.search).get("category");
  const initialFilter = ["resin", "kundan"].includes(requestedFilter) ? requestedFilter : "all";
  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((button) => button.setAttribute("aria-pressed", String(button === chip)));
    renderCollections(chip.dataset.filter);
  }));
  chips.forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.filter === initialFilter)));
  renderCollections(initialFilter);
}

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
if (searchForm && searchInput && searchResults) {
  const params = new URLSearchParams(location.search);
  searchInput.value = params.get("q") || "";
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    history.replaceState(null, "", query ? `?q=${encodeURIComponent(query)}` : location.pathname);
    renderSearch(query);
  });
  function renderSearch(query) {
    const normalized = query.toLocaleLowerCase();
    const matches = collections.flatMap((collection) => {
      const items = collection.items.filter((item) => item.toLocaleLowerCase().includes(normalized));
      const nameMatches = collection.name.toLocaleLowerCase().includes(normalized);
      return (nameMatches || items.length) && query
        ? [{ name: collection.name, items: nameMatches ? collection.items : items }]
        : [];
    });
    searchResults.replaceChildren();
    const heading = document.querySelector("#results-heading");
    heading.textContent = query ? `Collection matches for “${query}”` : "Explore our collections";
    if (!query) {
      const note = document.createElement("p");
      note.className = "availability-note";
      note.textContent = "Browse the collection categories below. Product listings will be added when the catalogue is ready.";
      searchResults.append(note);
      return;
    }
    if (!matches.length) {
      const note = document.createElement("p");
      note.className = "availability-note";
      note.textContent = "No matching collection category yet. Try “resin”, “earrings” or “frames”.";
      searchResults.append(note);
      return;
    }
    matches.forEach((match) => {
      const result = document.createElement("a");
      result.className = "search-result fade-in";
      result.href = "products.html";
      const title = document.createElement("strong");
      title.textContent = match.name;
      const detail = document.createElement("span");
      detail.textContent = `${match.items.slice(0, 5).join(" · ")}${match.items.length > 5 ? " · and more" : ""}`;
      result.append(title, detail);
      searchResults.append(result);
    });
  }
  renderSearch(searchInput.value.trim());
}

const stamps = document.querySelector("#stamp-grid");
if (stamps) {
  for (let index = 0; index < 10; index += 1) {
    const slot = document.createElement("span");
    slot.className = "stamp-slot";
    slot.setAttribute("aria-hidden", "true");
    slot.textContent = "✧";
    stamps.append(slot);
  }
}
