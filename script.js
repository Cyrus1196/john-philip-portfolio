(function () {
  const data = typeof PORTFOLIO !== "undefined" ? PORTFOLIO : null;
  if (!data) return;

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  document.title = `${data.fullName} | Portfolio`;

  document.querySelectorAll("[data-field]").forEach((el) => {
    const key = el.dataset.field;
    const value = data[key];
    if (!value) return;

    if (el.dataset.src !== undefined) {
      el.src = value;
      el.alt = `Portrait of ${data.fullName}`;
    } else if (el.dataset.link !== undefined) {
      el.href = value;
      if (value === "#") el.setAttribute("aria-disabled", "true");
    } else if (el.dataset.mailto !== undefined) {
      el.href = `mailto:${data.email}`;
      el.textContent = data.email;
    } else {
      el.textContent = value;
    }
  });

  const socialList = document.getElementById("social-links");
  data.social.forEach(({ label, url }) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = url;
    a.textContent = label;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    li.appendChild(a);
    socialList.appendChild(li);
  });

  const detailsList = document.getElementById("about-details");
  data.details
    .filter((item) => item.value)
    .forEach(({ label, value }) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      detailsList.appendChild(row);
    });

  const skillsList = document.getElementById("skills-list");
  data.skills.forEach(({ category, items }) => {
    const row = document.createElement("div");
    row.className = "skill-row";
    row.innerHTML = `
      <h3>${escapeHtml(category)}</h3>
      <ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    `;
    skillsList.appendChild(row);
  });

  const projectsList = document.getElementById("projects-list");
  data.projects.forEach((project, index) => {
    const article = document.createElement("article");
    article.className = "project";

    const links = [];
    if (project.links?.live && project.links.live !== "#") {
      links.push(`<a href="${escapeHtml(project.links.live)}" target="_blank" rel="noopener noreferrer">Live</a>`);
    }
    if (project.links?.repo && project.links.repo !== "#") {
      links.push(`<a href="${escapeHtml(project.links.repo)}" target="_blank" rel="noopener noreferrer">Code</a>`);
    }

    const media = project.image
      ? `<img class="project-media" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} preview" loading="lazy">`
      : `<div class="project-panel">Add a screenshot</div>`;

    article.innerHTML = `
      <div class="project-index">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <div class="project-top">
          <h3>${escapeHtml(project.title)}</h3>
          <span class="project-role">${escapeHtml(project.role)}</span>
        </div>
        <div class="project-copy">
          <p>${escapeHtml(project.objective)}</p>
          <p class="project-outcome">${escapeHtml(project.outcome)}</p>
        </div>
        <ul class="tools">${project.tools.map((tool) => `<li>${escapeHtml(tool)}</li>`).join("")}</ul>
        ${links.length ? `<div class="project-links">${links.join("")}</div>` : ""}
      </div>
      ${media}
    `;
    projectsList.appendChild(article);
  });

  const educationList = document.getElementById("education-list");
  data.education.forEach((entry) => {
    const article = document.createElement("article");
    article.className = "edu-item";
    article.innerHTML = `
      <time>${escapeHtml(entry.period)}</time>
      <div>
        <h3>${escapeHtml(entry.degree)}</h3>
        <p class="school">${escapeHtml(entry.school)}</p>
        <ul>${entry.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}</ul>
      </div>
    `;
    educationList.appendChild(article);
  });

  const certList = document.getElementById("certificates-list");
  data.certificates.forEach((cert) => {
    const article = document.createElement("article");
    article.className = "cert";
    const link =
      cert.url && cert.url !== "#"
        ? `<a href="${escapeHtml(cert.url)}" target="_blank" rel="noopener noreferrer">Verify</a>`
        : "";
    article.innerHTML = `
      <time>${escapeHtml(cert.date)}</time>
      <div>
        <h3>${escapeHtml(cert.name)}</h3>
        <p>${escapeHtml(cert.issuer)}</p>
      </div>
      ${link}
    `;
    certList.appendChild(article);
  });

  const contactList = document.getElementById("contact-list");
  data.social.forEach(({ label, url }) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = url;
    a.textContent = label;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    li.appendChild(a);
    contactList.appendChild(li);
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  const root = document.documentElement;
  document.querySelector(".theme-toggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("friend-portfolio-theme", next);
  });

  const rail = document.getElementById("rail");
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.getElementById("site-nav");

  const setMenu = (open) => {
    rail.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.querySelector(".menu-btn-label").textContent = open ? "Close" : "Menu";
  };

  menuBtn.addEventListener("click", () => {
    setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...nav.querySelectorAll("a[href^='#']")];

  const setActiveNav = () => {
    let current = sections[0]?.id;
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 140) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href").slice(1) === current);
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  const revealEls = document.querySelectorAll(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  }
})();
