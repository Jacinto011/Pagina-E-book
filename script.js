        // Initialize animations
        new WOW().init();
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
        // Navbar background change on scroll
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('shadow');
                navbar.style.backgroundColor = 'rgba(255,255,255,0.95)';
            } else {
                navbar.classList.remove('shadow');
                navbar.style.backgroundColor = 'rgba(255,255,255,1)';
            }
        });
        
        // Animation for price box when it comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__pulse');
                }
            });
        }, {threshold: 0.1});
        
        document.querySelectorAll('.price-box').forEach(box => {
            observer.observe(box);
        });