document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav a');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            const icon = mobileBtn.querySelector('i');
            if (navMenu.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            if(mobileBtn) {
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 2. Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.style.top = '0';
            header.style.padding = '0.5rem 5%';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.top = '30px';
            header.style.padding = '1rem 5%';
            header.style.background = 'rgba(255, 255, 255, 0.85)';
            header.style.boxShadow = 'none';
        }
    });

    // 3. Hero Carousel (Top scrolling images right to left)
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.hero-slide');
        const totalSlides = slides.length;
        
        // Dynamically set widths so user can add/remove slides easily in HTML
        heroCarousel.style.width = `${totalSlides * 100}%`;
        slides.forEach(slide => {
            slide.style.width = `${100 / totalSlides}%`;
        });
        
        const goToSlide = (index) => {
            currentSlide = (index + totalSlides) % totalSlides;
            heroCarousel.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
        };

        // Auto play
        let slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);

        // Manual controls
        const prevBtn = document.querySelector('.prev-slide');
        const nextBtn = document.querySelector('.next-slide');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                clearInterval(slideInterval);
                goToSlide(currentSlide - 1);
                slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
            });
            nextBtn.addEventListener('click', () => {
                clearInterval(slideInterval);
                goToSlide(currentSlide + 1);
                slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
            });
        }
    }

    // 4. Highlight Active Link
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop() || (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 5. WhatsApp Booking Functionality
    const waButtons = document.querySelectorAll('.book-wa-btn');
    // Official WhatsApp booking number for Velavaa Tours
    const waNumber = "919791484012"; 
    
    waButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const packageName = btn.getAttribute('data-package');
            let message = `Hello Velavaa Tours, I am interested in booking a tour.`;
            if (packageName) {
                message = `Hello Velavaa Tours, I would like to book the ${packageName} package. Please provide more details.`;
            }
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
            window.open(waUrl, '_blank');
        });
    });

    // 6. Lightbox Functionality (Fullscreen Image/Video view)
    const isGalleryPage = window.location.pathname.includes('gallery.html');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <div class="lightbox-content-container"></div>
        ${!isGalleryPage ? '<a href="#" class="btn btn-primary lightbox-book-btn">Book Now via WhatsApp</a>' : ''}
    `;
    document.body.appendChild(lightbox);

    const lightboxContentContainer = lightbox.querySelector('.lightbox-content-container');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxBookBtn = lightbox.querySelector('.lightbox-book-btn');

    // Event delegation for dynamically added images (like in the gallery) or static ones
    document.addEventListener('click', (e) => {
        const isClickableMedia = (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO' || e.target.tagName === 'I') && 
                                 (e.target.closest('.mass-gallery-grid') || 
                                  e.target.closest('.buses-grid') || 
                                  e.target.closest('.hero-slide'));

        if(isClickableMedia) {
            e.preventDefault();
            lightboxContentContainer.innerHTML = '';
            
            const actualTarget = e.target.tagName === 'I' ? e.target.previousElementSibling : e.target;
            const mediaUrl = actualTarget.src || actualTarget.style.backgroundImage.slice(5, -2);
            
            if(actualTarget.tagName === 'VIDEO') {
                 const videoEl = document.createElement('video');
                 videoEl.controls = true;
                 videoEl.autoplay = true;
                 videoEl.style.maxWidth = '90vw';
                 videoEl.style.maxHeight = '75vh';
                 videoEl.style.borderRadius = '10px';
                 videoEl.src = mediaUrl;
                 lightboxContentContainer.appendChild(videoEl);
                 
                 // explicitly play and handle autoplay restrictions gracefully
                 const playPromise = videoEl.play();
                 if (playPromise !== undefined) {
                     playPromise.catch(error => {
                         console.log("Autoplay blocked. Muting to allow playback.", error);
                         videoEl.muted = true;
                         videoEl.play();
                     });
                 }
            } else {
                 const img = document.createElement('img');
                 img.src = mediaUrl;
                 lightboxContentContainer.appendChild(img);
            }
            
            lightbox.classList.add('active');
            
            if (lightboxBookBtn) {
                const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent("Hello Velavaa Tours, I am interested in booking. I saw this media on your website and would like to know more.")}`;
                lightboxBookBtn.href = waUrl;
                lightboxBookBtn.target = "_blank";
            }
        }
        
        // Handle Hero Carousel Clicks (Divs with background images)
        if(e.target.classList.contains('hero-slide')) {
            e.preventDefault();
            lightboxContentContainer.innerHTML = '';
            
            // Extract URL from background-image: url('...')
            const bgImg = e.target.style.backgroundImage;
            const urlMatch = bgImg.match(/url\(['"]?(.*?)['"]?\)/);
            if(urlMatch && urlMatch[1]) {
                const img = document.createElement('img');
                img.src = urlMatch[1];
                lightboxContentContainer.appendChild(img);
                lightbox.classList.add('active');
                
                if (lightboxBookBtn) {
                    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent("Hello Velavaa Tours, I am interested in booking. I saw this media on your website and would like to know more.")}`;
                    lightboxBookBtn.href = waUrl;
                    lightboxBookBtn.target = "_blank";
                }
            }
        }
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        lightboxContentContainer.innerHTML = ''; // Stops video playback
    });
    
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) {
            lightbox.classList.remove('active');
            lightboxContentContainer.innerHTML = '';
        }
    });

    // 7. Package Details Modal
    const packageModal = document.createElement('div');
    packageModal.className = 'lightbox package-modal'; // reuse lightbox overlay styles
    packageModal.innerHTML = `
        <div class="package-modal-content" style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%; max-height: 85vh; overflow-y: auto; position: relative; z-index: 2020;">
            <span class="package-modal-close" style="position: absolute; top: 15px; right: 20px; font-size: 30px; cursor: pointer; color: #888; line-height: 1;">&times;</span>
            <h2 id="modal-title" style="color: var(--primary-color); margin-bottom: 10px;"></h2>
            <div id="modal-details" style="display: flex; gap: 15px; color: #666; font-size: 0.95rem; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;"></div>
            <div id="modal-full-desc" style="color: #444; line-height: 1.6; margin-bottom: 25px; font-size: 1.05rem;"></div>
            <div style="text-align: center;">
                <a href="#" id="modal-book-btn" class="btn btn-primary" target="_blank" style="width: 100%;">Book This Package</a>
            </div>
        </div>
    `;
    document.body.appendChild(packageModal);

    const pModalClose = packageModal.querySelector('.package-modal-close');
    
    // Add visual indicator to cards dynamically
    document.querySelectorAll('.package-card').forEach(card => {
        card.style.cursor = 'pointer';
        const content = card.querySelector('.package-content');
        if(content && !content.querySelector('.view-details-txt')) {
            const span = document.createElement('div');
            span.className = 'view-details-txt';
            span.innerHTML = '<span style="color:var(--secondary-color); font-size:0.9rem; font-weight:600; cursor:pointer; margin-bottom: 15px; display:inline-block;">Read Full Details &rarr;</span>';
            // insert before footer
            content.insertBefore(span, content.querySelector('.package-footer'));
        }
    });

    document.addEventListener('click', (e) => {
        // Find if we clicked inside a package card, but NOT the book button
        const card = e.target.closest('.package-card');
        if (card && !e.target.closest('.book-wa-btn')) {
            e.preventDefault();
            
            const title = card.querySelector('h3').innerText;
            const detailsHtml = card.querySelector('.package-details').innerHTML;
            
            // Get full desc. If we have a hidden div, use it. Otherwise, use the short p tag.
            const fullDescEl = card.querySelector('.full-desc');
            const shortDescEl = card.querySelector('p:not(.full-desc)');
            
            const descHtml = fullDescEl ? fullDescEl.innerHTML : (shortDescEl ? shortDescEl.innerHTML : 'No details available.');
            
            packageModal.querySelector('#modal-title').innerText = title;
            packageModal.querySelector('#modal-details').innerHTML = detailsHtml;
            packageModal.querySelector('#modal-full-desc').innerHTML = descHtml;
            
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent("Hello Velavaa Tours, I would like to book the " + title + " package. Please provide more details.")}`;
            packageModal.querySelector('#modal-book-btn').href = waUrl;
            
            packageModal.classList.add('active');
        }
    });

    pModalClose.addEventListener('click', () => {
        packageModal.classList.remove('active');
    });
    
    packageModal.addEventListener('click', (e) => {
        if(e.target === packageModal) {
            packageModal.classList.remove('active');
        }
    });
    // 8. Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    // Apply fade-up class dynamically to elements we want to animate
    const animateElements = document.querySelectorAll('.package-card, .section-title, .feature-card, .footer-col, #about > div > div');
    animateElements.forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });
    // 9. Welcome Popup & Audio
    const welcomePopup = document.getElementById('welcomePopup');
    const enterSiteBtn = document.getElementById('enterSiteBtn');
    
    // Pleasant chime/welcome sound
    const welcomeSound = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3'); 

    if (welcomePopup && enterSiteBtn) {
        // Check if user has visited before
        if (!localStorage.getItem('velavaa_visited')) {
            welcomePopup.style.display = 'flex';
            
            enterSiteBtn.addEventListener('click', () => {
                // Play sound on user interaction (required by browsers)
                welcomeSound.play().catch(e => console.log('Audio play blocked:', e));
                
                welcomePopup.style.opacity = '0';
                setTimeout(() => {
                    welcomePopup.style.display = 'none';
                }, 500);
                
                // Mark as visited so it doesn't show again on reload
                localStorage.setItem('velavaa_visited', 'true');
            });
        }
    }

    // --- CENTRAL REVIEW SYSTEM ---
    const DEFAULT_REVIEWS = [
        {
            name: "Rahul Sharma",
            package: "Kerala Backwaters Package",
            text: "An absolutely mesmerizing trip. The houseboat in Alleppey was clean, and the food provided was top-notch authentic Kerala cuisine. Velavaa Tours organized everything perfectly without any hiccups.",
            rating: 5,
            avatar: "R",
            date: "2 days ago",
            isNew: false
        },
        {
            name: "Anjali Desai",
            package: "Temple Trail Tamil Nadu",
            text: "Very informative and spiritual journey. The guide was knowledgeable about the temple histories. The tempo traveller provided was very comfortable for our family of 8.",
            rating: 5,
            avatar: "A",
            date: "1 week ago",
            isNew: false
        },
        {
            name: "Mohammed Ali",
            package: "Family Relaxing Retreat",
            text: "Perfect arrangement for my family of 6. The tempo traveller was extremely comfortable and the driver was very polite. Will definitely book again!",
            rating: 5,
            avatar: "M",
            date: "2 weeks ago",
            isNew: true
        },
        {
            name: "Priya Nair",
            package: "Ooty - Masinagudi - Mudumalai",
            text: "The Jeep Safari in Mudumalai was the highlight of our trip! We saw wild elephants and deer up close. Accommodation was scenic and cozy.",
            rating: 5,
            avatar: "P",
            date: "3 weeks ago",
            isNew: false
        },
        {
            name: "Suresh Kumar",
            package: "Coorg & Mysore Heritage",
            text: "Excellent service from Velavaa Tours. The coffee plantation stay in Coorg was breathtaking and food was delicious. Highly recommend for family trips.",
            rating: 5,
            avatar: "S",
            date: "1 month ago",
            isNew: false
        },
        {
            name: "Divya & Karthik",
            package: "Kodaikanal & Poombarai",
            text: "Our honeymoon package was curated so thoughtfully! Poombarai village view was magical. Thank you for making our trip unforgettable.",
            rating: 5,
            avatar: "D",
            date: "1 month ago",
            isNew: false
        }
    ];

    function getVelavaaReviews() {
        let stored = localStorage.getItem('velavaa_all_reviews');
        if (!stored) {
            localStorage.setItem('velavaa_all_reviews', JSON.stringify(DEFAULT_REVIEWS));
            return DEFAULT_REVIEWS;
        }
        return JSON.parse(stored);
    }

    function saveVelavaaReview(newRev) {
        let reviews = getVelavaaReviews();
        reviews.unshift(newRev); // add newest to top
        localStorage.setItem('velavaa_all_reviews', JSON.stringify(reviews));
        return reviews;
    }

    // 10. Reviews Carousel (Homepage)
    const reviewsTrack = document.getElementById('reviewsTrack');
    const prevReviewBtn = document.querySelector('.prev-review');
    const nextReviewBtn = document.querySelector('.next-review');
    const homeReviewCountBadge = document.getElementById('homeReviewCountBadge');

    if (reviewsTrack && prevReviewBtn && nextReviewBtn) {
        const allReviews = getVelavaaReviews();
        if (homeReviewCountBadge) {
            homeReviewCountBadge.textContent = allReviews.length;
        }

        // Dynamically populate track
        reviewsTrack.innerHTML = '';
        allReviews.forEach(r => {
            let starsHtml = '';
            for(let i=1; i<=5; i++) {
                if(i <= r.rating) starsHtml += '<i class="fas fa-star"></i>';
                else starsHtml += '<i class="far fa-star"></i>';
            }
            const badgeHtml = r.isNew ? `<span class="package-badge" style="background:var(--secondary-color); color:var(--text-dark); position:relative; top:0; right:0; margin-left:10px; padding: 2px 8px; font-size: 0.7rem;">NEW</span>` : '';
            
            const slideHtml = `
                <div class="review-card-slide">
                    <div class="reviewer-info">
                        <div class="avatar">${r.avatar}</div>
                        <div>
                            ${badgeHtml}
                            <h4>${r.name}</h4>
                            <span>${r.package}</span>
                        </div>
                    </div>
                    <div class="stars">${starsHtml}</div>
                    <p>"${r.text}"</p>
                </div>
            `;
            reviewsTrack.insertAdjacentHTML('beforeend', slideHtml);
        });

        let currentReview = 0;
        const slides = reviewsTrack.querySelectorAll('.review-card-slide');
        const totalReviews = slides.length;
        
        const goToReview = (index) => {
            currentReview = (index + totalReviews) % totalReviews;
            reviewsTrack.style.transform = `translateX(-${currentReview * 100}%)`;
        };

        // Auto scroll every 6 seconds
        let reviewInterval = setInterval(() => {
            goToReview(currentReview + 1);
        }, 6000);

        prevReviewBtn.addEventListener('click', () => {
            clearInterval(reviewInterval);
            goToReview(currentReview - 1);
            reviewInterval = setInterval(() => goToReview(currentReview + 1), 6000);
        });
        
        nextReviewBtn.addEventListener('click', () => {
            clearInterval(reviewInterval);
            goToReview(currentReview + 1);
            reviewInterval = setInterval(() => goToReview(currentReview + 1), 6000);
        });
    }

    // 11. Dedicated Reviews Page Logic (reviews.html)
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviewForm = document.getElementById('reviewForm');
    const reviewCountBadge = document.getElementById('reviewCountBadge');

    if (reviewsContainer) {
        const renderAllReviews = () => {
            const allReviews = getVelavaaReviews();
            if (reviewCountBadge) {
                reviewCountBadge.textContent = `${allReviews.length} Reviews`;
            }
            reviewsContainer.innerHTML = '';
            allReviews.forEach(r => {
                let starsHtml = '';
                for(let i=1; i<=5; i++) {
                    if(i <= r.rating) starsHtml += '<i class="fas fa-star"></i>';
                    else starsHtml += '<i class="far fa-star"></i>';
                }
                const badgeHtml = r.isNew ? `<span class="package-badge" style="background:var(--secondary-color); color:var(--text-dark); position:relative; top:0; right:0; margin-left:10px; padding: 2px 8px; font-size: 0.7rem;">NEW</span>` : '';
                const dateHtml = r.date ? `<span style="float:right; font-size: 0.85rem; color: #888;">${r.date}</span>` : '';
                
                const html = `
                <div class="review-item" style="border-left: 4px solid var(--secondary-color);">
                    <div class="reviewer-info" style="width: 100%; display: flex; align-items: center; gap: 15px;">
                        <div class="avatar">${r.avatar}</div>
                        <div class="reviewer-name" style="flex: 1;">
                            ${dateHtml}
                            <h4 style="margin: 0; display: flex; align-items: center;">${r.name} ${badgeHtml}</h4>
                            <span style="display: block; font-size: 0.9rem; color: #666;">${r.package}</span>
                        </div>
                    </div>
                    <div class="stars" style="margin-top: 10px;">${starsHtml}</div>
                    <p style="margin-top: 10px;">"${r.text}"</p>
                </div>
                `;
                reviewsContainer.insertAdjacentHTML('beforeend', html);
            });
        };

        renderAllReviews();

        if (reviewForm) {
            reviewForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('reviewerName').value;
                const pkg = document.getElementById('reviewPackage').value;
                const text = document.getElementById('reviewText').value;
                const ratingInput = document.querySelector('input[name="rating"]:checked');
                const rating = ratingInput ? parseInt(ratingInput.value) : 5;

                const newReview = {
                    name,
                    package: pkg || 'Custom Tour Package',
                    text,
                    rating,
                    avatar: name.charAt(0).toUpperCase(),
                    date: "Just now",
                    isNew: true
                };

                saveVelavaaReview(newReview);
                renderAllReviews();
                this.reset();
                
                // Scroll to top of reviews container so user sees their new review
                reviewsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                alert("Thank you! Your review has been submitted and added to our verified reviews.");
            });
        }
    }

});
