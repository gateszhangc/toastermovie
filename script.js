const buttons = Array.from(document.querySelectorAll("[data-filter-button]"));
const cards = Array.from(document.querySelectorAll("[data-category]"));
const resultsCount = document.querySelector("[data-results-count]");
const topbar = document.querySelector("[data-topbar]");

const updateResults = (activeFilter) => {
  let visibleCount = 0;

  cards.forEach((card) => {
    const matches = activeFilter === "all" || card.dataset.category === activeFilter;
    card.hidden = !matches;

    if (matches) {
      visibleCount += 1;
    }
  });

  if (resultsCount) {
    const label = visibleCount === 1 ? "item" : "items";
    resultsCount.textContent = `Showing ${visibleCount} archive ${label}`;
  }
};

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((candidate) => {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    });

    updateResults(button.dataset.filterButton);
  });
});

const syncTopbar = () => {
  if (!topbar) {
    return;
  }

  topbar.classList.toggle("is-scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", syncTopbar, { passive: true });
syncTopbar();
updateResults("all");
