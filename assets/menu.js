(() => {
  // const menuButton = document.querySelector(".menu .button");
  // const SMALL_MOBILE_WIDTH = 750;
  // const NORMAL_TOP = 40;

  // function syncMenuTop() {
  //   const min = window.innerWidth < SMALL_MOBILE_WIDTH ? 16 : 32
  //   menuButton.style.top = `${Math.max(min, NORMAL_TOP - window.scrollY)}px`;
  // }
  // addEventListener("scroll", syncMenuTop);
  // addEventListener("resize", syncMenuTop);
  // syncMenuTop()
})();

/**
 * GitHub star badge in the header (markup in _includes/header.html).
 * Count comes from the GitHub API, cached in localStorage for 6 hours.
 */
(() => {
  const badge = document.getElementById("gh-star-badge");
  const count = document.getElementById("gh-star-count");
  if (!badge || !count) return;

  const show = stars => {
    count.textContent =
      stars >= 1000 ? (stars / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(stars);
    badge.style.display = "inline-flex";
  };

  try {
    const cached = JSON.parse(localStorage.getItem("pm2-gh-stars") || "null");
    if (cached && Date.now() - cached.at < 6 * 3600 * 1000) return show(cached.stars);
  } catch (e) {}

  fetch("https://api.github.com/repos/Unitech/pm2")
    .then(r => (r.ok ? r.json() : Promise.reject()))
    .then(repo => {
      show(repo.stargazers_count);
      try {
        localStorage.setItem(
          "pm2-gh-stars",
          JSON.stringify({ stars: repo.stargazers_count, at: Date.now() })
        );
      } catch (e) {}
    })
    .catch(() => {});
})();
