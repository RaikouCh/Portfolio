// ======== Dynamic Service Page Script ========

// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const burgerMenu = document.getElementById('burgerMenu');
  const navMenu = document.getElementById('navMenu');
  
  if (burgerMenu && navMenu) {
    // Toggle menu on burger click
    burgerMenu.addEventListener('click', () => {
      burgerMenu.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    // Close menu when a navigation link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('header')) {
        burgerMenu.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
});

// --- Price List ---
const PRICES = {
  debugging: 500,
  consulting: 800,
  customize_website: 2500,
  code: 400,
  personal: 1200,
  thesis: 2000,
  commission: 1500,
  project: 3000,
  business: 5000,
  system: 8000,
  app: 12000,
  game: 18000,
};

// --- Utility Functions ---
function toTitle(k) {
  return k.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function shortDesc(k) {
  const map = {
    debugging: "Fix bugs and improve stability (small to medium tasks).",
    consulting: "Get advice, architecture reviews, or code audits.",
    customize_website: "Theme/custom UI changes, content updates, integrations.",
    code: "Small coding tasks, scripts, and automation utilities.",
    personal: "Personal projects and small custom builds.",
    thesis: "Thesis and capstone implementation and mentoring.",
    commission: "Art/code commissions and bespoke digital creations.",
    project: "General project work and feature development.",
    business: "Business-grade systems with documentation and support.",
    system: "End-to-end system builds, backend & deployment.",
    app: "Mobile or web app development for any platform.",
    game: "2D/3D game design, logic, and gameplay mechanics.",
  };
  return map[k] || "";
}

// --- Build Dynamic Price Cards ---
const priceList = document.getElementById("priceList");
if (priceList) {
  Object.keys(PRICES).forEach((key) => {
    const card = document.createElement("div");
    card.className = "service-card fade-in";
    card.innerHTML = `
      <h3>${toTitle(key)}</h3>
      <p class="small">${shortDesc(key)}</p>
      <div class="price">💵 Price: <span class="amount">₱${PRICES[key].toLocaleString()}</span></div>
      <div class="card-actions">
        <a href="#" data-service="${key}" class="btn-secondary select-service">Select</a>
      </div>
    `;
    priceList.appendChild(card);
  });
}

// --- Form Elements ---
const serviceSelect = document.getElementById("serviceSelect");
const quantity = document.getElementById("quantity");
const discount = document.getElementById("discount");
const totalAmount = document.getElementById("totalAmount");
const orderBtn = document.getElementById("orderBtn");

// --- Calculate Total ---
function calcTotal() {
  const service = serviceSelect.value;
  const qty = Math.max(1, parseInt(quantity.value) || 1);
  const base = PRICES[service] || 0;
  let total = base * qty;
  const disc = discount.value;

  if (disc === "student" || disc === "barkada") total = Math.round(total * 0.5);

  totalAmount.textContent = "₱" + total.toLocaleString();
  totalAmount.classList.add("pop-anim");
  setTimeout(() => totalAmount.classList.remove("pop-anim"), 300);

  return { total, service, qty, disc };
}

// --- Update Total Live ---
[serviceSelect, quantity, discount].forEach((el) => {
  if (el) el.addEventListener("change", calcTotal);
});
if (serviceSelect && quantity && discount) calcTotal();

// --- Prefilled Form Logic ---
function openPrefilledForm(service, qty, disc, total) {
  const GOOGLE_FORM_BASE =
    "https://docs.google.com/forms/d/e/1FAIpQLSeD_OPyNbcXkJGF3fXb1ChBMFF_zLYtUxf7uK-nd9jv7gqaug/viewform";

  const ENTRY = {
    service: "entry.1999318018",
    quantity: "entry.1142116748",
    discount: "entry.1955100107",
  };

  // ✅ Exact Google Form dropdown text options
  const GOOGLE_OPTIONS = {
    service: {
      debugging: "🐞 Debugging — Fix bugs, resolve errors, and optimize small tasks.",
      consulting: "💬 Consulting — Get expert advice or project guidance.",
      customize_website: "🌐 Website Customization — Modify website layout, style, or content.",
      code: "⚙️ Code (Small Task) — Request small scripts or code snippets.",
      personal: "🎨 Personal Project — Custom work for your personal or creative ideas.",
      thesis: "🎓 Thesis & Capstone — Academic system assistance and documentation support.",
      commission: "🧾 Commission — Personalized coding or creative requests.",
      project: "💼 General Project — Medium-scale development with custom requirements.",
      business: "🏢 Business Project — Professional-grade project for business use.",
      system: "🖥️ System Build — Complete system creation with database integration.",
      app: "📱 App Development — Android, iOS, or web app creation.",
      game: "🎮 Game Development — 2D or 3D game creation with animations & logic.",
    },
    discount: {
      student: "🎓 Student (50% discount)",
      barkada: "👥 Barkada Group (50% discount)",
      none: "💼 Regular / None",
    },
  };

  const serviceText = GOOGLE_OPTIONS.service[service] || "";
  const discountText = GOOGLE_OPTIONS.discount[disc] || "💼 Regular / None";

  alert(
    `✅ You selected "${serviceText}"\n` +
      `📦 Quantity: ${qty}\n` +
      `🎓 Discount: ${discountText}\n` +
      `💰 Total: ₱${total.toLocaleString()}\n\n` +
      `Redirecting to Google Form...`
  );

  const url =
    `${GOOGLE_FORM_BASE}?usp=pp_url` +
    `&${ENTRY.service}=${encodeURIComponent(serviceText)}` +
    `&${ENTRY.quantity}=${encodeURIComponent(qty)}` +
    `&${ENTRY.discount}=${encodeURIComponent(discountText)}`;

  window.open(url, "_blank");
}

// --- Service Card Click Handler ---
document.addEventListener("click", (e) => {
  if (e.target.matches(".select-service")) {
    e.preventDefault();
    const svc = e.target.getAttribute("data-service");
    if (serviceSelect) serviceSelect.value = svc;
    const { total, service, qty, disc } = calcTotal();

    document.querySelectorAll(".service-card").forEach((c) =>
      c.classList.remove("active")
    );
    e.target.closest(".service-card").classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });

    openPrefilledForm(service, qty, disc, total);
  }
});

// --- "Order & Fill Form" Button ---
if (orderBtn) {
  orderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const { total, service, qty, disc } = calcTotal();
    openPrefilledForm(service, qty, disc, total);
  });
}

// --- Fade-in Animation ---
const faders = document.querySelectorAll(".fade-in");
const appearOptions = { threshold: 0.2 };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("appear");
    observer.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach((fader) => appearOnScroll.observe(fader));

// --- Auto Footer Inject ---
const footerHTML = `
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section about">
        <h3>Nathaniel Lasquety</h3>
        <p>Aspiring Full-Stack Developer • Passionate about Games, Websites & Interactive Apps</p>
        <p>Building innovative, seamless, and engaging digital experiences.</p>
      </div>

      <div class="footer-section links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="index.html">🏠 Home</a></li>
          <li><a href="service.html">🛠️ Services</a></li>
          <li><a href="contact.html">📞 Contact</a></li>
          <li><a href="projects.html">📁 Portfolio</a></li>
        </ul>
      </div>

      <div class="footer-section social">
        <h4>Connect with Me</h4>
        <div class="social-links">
          <a href="https://www.facebook.com/shsjsjsjsksjsidmdks/" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
          <a href="https://github.com/RaikouCh" aria-label="GitHub"><i class="fab fa-github"></i></a>
          <a href="https://www.linkedin.com/in/nathaniel-lasquety-b31b21364/" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
          <a href="https://mail.google.com/mail/?view=cm&to=nathaniellasquety2024@gmail.com" target="_blank" aria-label="Email"><i class="fas fa-envelope"></i></a>
          <a href="https://ph.jobstreet.com/profile/nathaniel-lasquety-H1Mx1HNMBb" aria-label="JobStreet (JobSeeker)">
            <img src="image/Seek.svg" alt="Seek" class="social-icon-img">
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© <span id="year"></span> Nathaniel Lasquety — All Rights Reserved.</p>
    </div>
  </footer>
`;

document.body.insertAdjacentHTML("beforeend", footerHTML);
document.getElementById("year").textContent = new Date().getFullYear();
