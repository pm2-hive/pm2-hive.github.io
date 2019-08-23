(() => {
  function h(tag, props, ...children) {
    const el = document.createElement(tag);
    if (props) {
      for (const key in props) {
        if (props[key]) {
          if (key.startsWith("on")) {
            el[key] = props[key];
          } else {
            el.setAttribute(key, props[key]);
          }
        }
      }
    }
    for (const child of children) {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    }
    return el;
  }

  const SMALL_MOBILE_WIDTH = 750;
  const root = document.querySelector(".doc-nav-and-content nav");
  if (!root) return;
  const navToplevel = root.querySelector("ul");
  const activeSection = navToplevel.querySelector(".nav-section-entry.active");
  if (!activeSection) return;

  const activeSectionTitle = h(
    "div",
    {
      class: "nav-mobile-title",
      onclick: toggleNav
    },
    h("div", {}, activeSection.textContent),
    h("i", { class: "fa fa-chevron-up" })
  );

  navToplevel.addEventListener("transitionend", transitionEnd);
  root.insertBefore(activeSectionTitle, navToplevel);

  let transitionEndTimeout;
  function scheduleTransitionEnd() {
    transitionEndTimeout = setTimeout(transitionEnd, 500);
  }

  function transitionEnd() {
    clearTimeout(transitionEndTimeout);

    if (!isCollapsed()) {
      navToplevel.style.height = "";
      navToplevel.style.overflow = "visible";
    }
  }

  function isCollapsed() {
    return root.classList.contains("collapsed");
  }

  function collapse(transition) {
    if (isCollapsed()) return;
    const scrollHeight = navToplevel.scrollHeight;
    root.classList.add("collapsed");
    navToplevel.style.overflow = "hidden";
    if (transition === false) {
      navToplevel.style.height = "0px";
    } else {
      navToplevel.style.height = scrollHeight + "px";
      setTimeout(() => {
        navToplevel.style.height = "0px";
      });
    }
    scheduleTransitionEnd()
  }

  function uncollapse() {
    if (!isCollapsed()) return;
    const scrollHeight = navToplevel.scrollHeight;
    root.classList.remove("collapsed");
    navToplevel.style.height = scrollHeight + "px";
    scheduleTransitionEnd()
  }

  function adaptNav(transition) {
    if (window.innerWidth < SMALL_MOBILE_WIDTH) {
      collapse(transition);
    } else {
      uncollapse(transition);
    }
  }

  function toggleNav(transition) {
    if (isCollapsed()) {
      uncollapse(transition);
    } else {
      collapse(transition);
    }
  }

  addEventListener("resize", adaptNav);
  adaptNav(false);
})();
