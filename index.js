// Smooth animations and rendering

// 1) Apply animation classes after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Hamburger Menu Toggle
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
  
  const title = document.querySelector('.home-text h1');
  const subtitle = document.querySelector('.home-text h2');
  const paragraph = document.querySelector('.home-text p');
  const btn = document.querySelector('.home-btn .btn');
  const avatar = document.querySelector('.home-img img');

  if (title) title.classList.add('animate-glow', 'reveal');
  if (subtitle) subtitle.classList.add('reveal');
  if (paragraph) paragraph.classList.add('reveal');
  if (btn) btn.classList.add('reveal');
  if (avatar) avatar.classList.add('animate-float', 'reveal');

  // Staggered reveal for smoother effect
  const revealElements = [title, subtitle, paragraph, btn, avatar].filter(Boolean);
  revealElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 120}ms`;
    // Fallback for users who opened page mid-scroll
    setTimeout(() => el.classList.add('visible'), 60);
  });

  // 2) IntersectionObserver for any future .reveal elements
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.20 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // 3) Smooth in-page scrolling for header links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});


