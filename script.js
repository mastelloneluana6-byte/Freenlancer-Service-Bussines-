document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 1.5 Mega Menu Toggle
    const megaMenuBtn = document.getElementById('megaMenuBtn');
    const megaMenu = document.getElementById('megaMenu');
    const megaCloseBtn = document.getElementById('megaCloseBtn');
    const megaLinks = document.querySelectorAll('.mega-link');

    if (megaMenuBtn && megaMenu) {
        megaMenuBtn.addEventListener('click', () => {
            const isOpen = megaMenu.classList.contains('open');
            if (!isOpen) {
                megaMenu.classList.add('open');
                megaMenuBtn.classList.add('open');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                megaMenu.classList.remove('open');
                megaMenuBtn.classList.remove('open');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });

        if (megaCloseBtn) {
            megaCloseBtn.addEventListener('click', () => {
                megaMenu.classList.remove('open');
                megaMenuBtn.classList.remove('open');
                document.body.style.overflow = '';
            });
        }

        megaLinks.forEach(link => {
            link.addEventListener('click', () => {
                megaMenu.classList.remove('open');
                megaMenuBtn.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Intersection Observer for Scroll Animations
    // This adds the 'active' class to elements as they scroll into view
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Reverse effect when scrolling out of view
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.reveal-text, .fade-in-up, .slide-in-left, .slide-in-right');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed navbar height
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Initial trigger for elements already in viewport (like Hero)
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .reveal-text, .hero-image-wrapper');
        heroElements.forEach(el => {
            el.classList.add('active');
        });
    }, 100);

    // 6. True SVG Liquid Distortion Effect (Hero Image)
    const heroImage = document.querySelector('.hero-exact-image');
    const displacementMap = document.querySelector('#displacement');
    
    if (heroImage && displacementMap) {
        heroImage.style.filter = "url('#liquid')";
        
        let currentScale = 0;
        let targetScale = 0;
        
        // Mouse enters: increase distortion
        heroImage.addEventListener('mouseenter', () => {
            targetScale = 35; // Maximum liquid warp
        });
        
        // Mouse leaves: return to perfectly flat
        heroImage.addEventListener('mouseleave', () => {
            targetScale = 0; 
        });
        
        // Smooth animation loop
        function animateLiquid() {
            currentScale += (targetScale - currentScale) * 0.1;
            
            // Only update DOM if there's a meaningful change to save performance
            if (Math.abs(targetScale - currentScale) > 0.1) {
                displacementMap.setAttribute('scale', currentScale);
            } else if (targetScale === 0 && currentScale !== 0) {
                displacementMap.setAttribute('scale', 0);
                currentScale = 0;
            }
            
            requestAnimationFrame(animateLiquid);
        }
        
        animateLiquid();
    }

    // 7. Sand Resolve Effect on Logos
    const logoGrid = document.querySelector('.logo-grid');
    const sandMap = document.getElementById('sandMap');
    const sandBlur = document.getElementById('sandBlur');

    if (logoGrid && sandMap && sandBlur) {
        logoGrid.style.filter = "url('#sand-resolve')";
        
        window.addEventListener('scroll', () => {
            const rect = logoGrid.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Resolves much faster: fully resolved when it's just 20% up from the bottom of the screen
            let percentage = 1 - (rect.top - windowHeight * 0.8) / (windowHeight * 0.3);
            percentage = Math.max(0, Math.min(1, percentage));
            
            const distortion = 1 - percentage;
            
            // Massive scale to scatter particles far away
            const maxScale = 400; 
            // Vertical blur to make them look like blowing sand
            const maxBlurY = 20;
            // Float distance to make it 'zweven' (float) upwards
            const maxTranslateY = 150;
            
            if (distortion > 0) {
                // Don't fade out entirely, let the particles be visible
                logoGrid.style.opacity = percentage + 0.3; 
                logoGrid.style.transform = `translateY(${distortion * maxTranslateY}px)`;
                sandMap.setAttribute('scale', distortion * maxScale);
                sandBlur.setAttribute('stdDeviation', `0 ${distortion * maxBlurY}`);
            } else {
                logoGrid.style.opacity = 1;
                logoGrid.style.transform = 'translateY(0)';
                sandMap.setAttribute('scale', 0);
                sandBlur.setAttribute('stdDeviation', '0 0');
            }
        });
    }

    // 7. Parallax Effects (Clay style)
    const portfolioImages = document.querySelectorAll('.portfolio-image');
    const heroImageWrapper = document.querySelector('.hero-image-wrapper');
    
    window.addEventListener('scroll', () => {
        // Hero 3D Parallax
        if (heroImageWrapper && window.scrollY < window.innerHeight) {
            const heroScroll = window.scrollY;
            heroImageWrapper.style.transform = `translateY(${heroScroll * 0.4}px)`;
        }

        // Portfolio Parallax
        portfolioImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            // If image is in viewport
            if(rect.top < window.innerHeight && rect.bottom > 0) {
                // Calculate how far through the viewport the image is
                const scrollPercentage = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                // Move from Y = -10% to Y = 10%
                const yPos = (scrollPercentage * 20) - 10;
                img.style.transform = `scale(1.15) translateY(${yPos}%)`;
            }
        });
    });

    // 8. Number Counting Animation for Stats
    const counterObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                
                // Avoid running multiple times if already animated
                if (counter.classList.contains('counted')) return;
                counter.classList.add('counted');

                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCounter();
                
                // Optional: To make it run ONLY once, unobserve it:
                // observer.unobserve(counter);
            } else {
                // Optional: Reset it when out of view if you want it to count every time you scroll past
                const counter = entry.target;
                counter.classList.remove('counted');
                counter.innerText = '0';
            }
        });
    }, counterObserverOptions);

    document.querySelectorAll('.counter').forEach(counter => {
        counterObserver.observe(counter);
    });

    // 8. Premium Chatbot Logic
    const chatFab = document.getElementById('chat-fab');
    const chatWindow = document.getElementById('chat-window');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatBody = document.getElementById('chat-body');

    if (chatFab && chatWindow) {
        chatFab.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open')) {
                chatInput.focus();
            }
        });

        chatCloseBtn.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });

        const sendMessage = () => {
            const text = chatInput.value.trim();
            if (text !== '') {
                // Add user message
                const userMsg = document.createElement('div');
                userMsg.className = 'chat-message user-message';
                userMsg.innerHTML = `<p>${text}</p>`;
                chatBody.appendChild(userMsg);
                chatInput.value = '';
                chatBody.scrollTop = chatBody.scrollHeight;

                // Simulate bot response after 1s delay
                setTimeout(() => {
                    const botMsg = document.createElement('div');
                    botMsg.className = 'chat-message bot-message';
                    botMsg.innerHTML = `<p>Thanks for reaching out! ✨ Our team will get back to you shortly about <strong>"${text}"</strong>.</p>`;
                    chatBody.appendChild(botMsg);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 1000);
            }
        };

        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // 9. Custom Hot Pink Cursor
    const customCursor = document.querySelector('.custom-cursor');
    
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    });

    // Enlarge cursor when hovering over clickable elements
    const clickables = document.querySelectorAll('a, button, .service-item, .pricing-card');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            customCursor.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            customCursor.classList.remove('hovering');
        });
    });

    // 10. Horizontal Scroll on Mobile for Portfolio
    const portfolioSection = document.querySelector('.portfolio');
    const portfolioGrid = document.querySelector('.portfolio-grid-new');

    if (portfolioSection && portfolioGrid) {
        window.addEventListener('scroll', () => {
            if (window.innerWidth <= 992) {
                const sectionTop = portfolioSection.offsetTop;
                const sectionHeight = portfolioSection.offsetHeight;
                const windowScroll = window.scrollY;
                
                // If we've scrolled past the top of the portfolio section
                if (windowScroll >= sectionTop && windowScroll <= (sectionTop + sectionHeight - window.innerHeight)) {
                    const scrollDistance = windowScroll - sectionTop;
                    const maxScroll = sectionHeight - window.innerHeight;
                    const scrollPercentage = scrollDistance / maxScroll;
                    
                    const gridWidth = portfolioGrid.offsetWidth;
                    const windowWidth = window.innerWidth;
                    // Max translate should leave the last card visible at the end
                    const maxTranslate = gridWidth - windowWidth + 40; 
                    
                    const translateValue = maxTranslate * scrollPercentage;
                    portfolioGrid.style.transform = `translateX(-${translateValue}px)`;
                } else if (windowScroll < sectionTop) {
                    portfolioGrid.style.transform = `translateX(0px)`;
                } else {
                    const gridWidth = portfolioGrid.offsetWidth;
                    const windowWidth = window.innerWidth;
                    const maxTranslate = gridWidth - windowWidth + 40;
                    portfolioGrid.style.transform = `translateX(-${maxTranslate}px)`;
                }
            } else {
                portfolioGrid.style.transform = `translateX(0px)`;
            }
        });
    }
});
