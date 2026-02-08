// Filtering logic for project cards
document.addEventListener('DOMContentLoaded', function() {
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

    const filterButtons = document.querySelectorAll('.filters button');
    const cards = document.querySelectorAll('.card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const genre = this.textContent.toLowerCase();
            cards.forEach(card => {
                const cardGenre = card.getAttribute('data-genre');
                if (genre === 'all' || cardGenre === genre) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
