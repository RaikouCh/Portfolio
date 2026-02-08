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

  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${i * 100}ms`;
    observer.observe(el);
  });

  // Sidebar toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }
});

/* JavaScript to trigger fade-up animations */
const fadeUps = document.querySelectorAll('.fade-up');

function handleFadeUpScroll() {
    fadeUps.forEach((fadeUp) => {
        const fadeUpTop = fadeUp.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (fadeUpTop < windowHeight - 100) {
            fadeUp.classList.add('active');
        }
    });
}

window.addEventListener('scroll', handleFadeUpScroll);
handleFadeUpScroll(); // Trigger on page load

/* JavaScript for hamburger menu toggle */
const hamburgerMenu = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('navmenu');

hamburgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});



