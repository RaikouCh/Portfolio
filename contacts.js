// contacts.js
// Uses EmailJS for client-side email sending. Replace placeholders with your EmailJS values.

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

  const form = document.getElementById('contact-form');
  const alertEl = document.getElementById('contact-alert');

  function showAlert(msg, isError = false) {
    alertEl.textContent = msg;
    alertEl.style.color = isError ? '#ffb4b4' : '#dff7e0';
  }

  function validate(name, email, message) {
    if (!name || !email || !message) return 'Please fill in all fields.';
    // simple email regex
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    if (!re.test(String(email).toLowerCase())) return 'Please enter a valid email address.';
    return '';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertEl.textContent = '';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const invalid = validate(name, email, message);
    if (invalid) {
      showAlert(invalid, true);
      return;
    }

    showAlert('Sending message...');

    // POST to the Vercel API endpoint
    // On production: uses /api/send-contact (relative path on Vercel)
    // On localhost: uses http://localhost:3000/send-contact for local development
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const endpoint = isProduction ? '/api/send-contact' : (window.__CONTACT_ENDPOINT__ || 'http://localhost:3000/send-contact');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();
      if (res.ok && data && data.success) {
        showAlert(data.message || 'Message sent — thank you!');
        form.reset();
      } else {
        console.error('Send error', data);
        showAlert(data.message || 'Failed to send message. Please try again later.', true);
      }
    } catch (err) {
      console.error('Network error', err);
      showAlert('Network error — unable to send message.', true);
    }
  });
});
