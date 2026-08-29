/**
 * Mukundprabha Bakery (मुकुंदप्रभा बेकरी)
 * Premium Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbarScroll();
  initMobileNav();
  initScrollReveal();
  initLightbox();
  initScrollSpy();
  initBackToTop();
  initProductCatalog();
  handleImageFallbacks();
});

/* ==========================================================================
   1. CINEMATIC PRELOADER
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Let the cinematic preloader run for 2 seconds, then fade out
  setTimeout(() => {
    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';
    
    // Trigger scroll reveal audit immediately to display elements visible on screen
    setTimeout(() => {
      document.body.style.overflowY = 'auto'; // Re-enable scroll
      revealOnScroll();
    }, 100);
  }, 2000);
}

/* ==========================================================================
   2. NAVBAR SCROLL INTERACTIVE EFFECTS
   ========================================================================== */
function initNavbarScroll() {
  const nav = document.querySelector('.header-nav');
  if (!nav) return;

  let lastScrollTop = 0;
  const delta = 10; // Scroll offset threshold
  const navbarHeight = nav.offsetHeight;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // A. Transparent to Glassmorphism Background Toggle
    if (scrollTop > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // B. Hide on Scroll Down, Show on Scroll Up
    if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

    if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
      // Scroll Down -> Hide navbar
      nav.classList.add('nav-hidden');
    } else {
      // Scroll Up -> Show navbar
      if (scrollTop + window.innerHeight < document.documentElement.scrollHeight) {
        nav.classList.remove('nav-hidden');
      }
    }

    lastScrollTop = scrollTop;
  });
}

/* ==========================================================================
   3. MOBILE NAVIGATION HAMBURGER MENU
   ========================================================================== */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  const links = document.querySelectorAll('.nav-link');

  if (!toggle || !menu) return;

  // Open / Close Menu
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
    
    // Toggle body scroll lock when mobile navigation is open
    if (menu.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close Menu on Link Click
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   4. SCROLL REVEAL (FADE IN UP) ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  // We run checking scroll events. Using IntersectionObserver is highly optimized.
  const revealElements = document.querySelectorAll('.reveal-item, .section-header');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // Viewport
      threshold: 0.15, // Trigger when 15% visible
      rootMargin: '0px 0px -50px 0px' // Margins
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
  }
}

function revealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal-item, .section-header');
  const triggerPoint = window.innerHeight * 0.85;

  revealElements.forEach(el => {
    const elTop = el.getBoundingClientRect().top;
    if (elTop < triggerPoint) {
      el.classList.add('revealed');
    }
  });
}

/* ==========================================================================
   5. LIGHTBOX GALLERY
   ========================================================================== */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!lightbox || galleryItems.length === 0) return;

  let currentIndex = 0;
  const imageSources = Array.from(galleryItems).map(item => item.getAttribute('data-src'));

  // Open Lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      updateLightboxImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close Lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  
  // Close when clicking overlay (outside the image container)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Next / Previous Navigation
  const showNextImage = () => {
    currentIndex = (currentIndex + 1) % imageSources.length;
    updateLightboxImage();
  };

  const showPrevImage = () => {
    currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
    updateLightboxImage();
  };

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
  });
  
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  function updateLightboxImage() {
    lightboxImg.src = imageSources[currentIndex];
    
    // Add brief fade transition to image swaps
    lightboxImg.style.opacity = '0.3';
    setTimeout(() => {
      lightboxImg.style.opacity = '1';
    }, 50);
  }
}

/* ==========================================================================
   6. SCROLL SPY (ACTIVE NAVIGATION LINKS)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150; // offset for sticky nav
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const targetId = link.getAttribute('href').substring(1);
      if (targetId === currentSectionId) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. HANDLE BROKEN IMAGES WITH CUSTOM PREMIUM CSS GRADIENT FALLBACKS
   ========================================================================== */
function handleImageFallbacks() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    img.addEventListener('error', function() {
      // Get the image source filename to determine appropriate fallback styling
      const src = this.getAttribute('src') || '';
      
      this.style.display = 'none'; // hide broken image tag
      const parent = this.parentElement;
      if (!parent) return;

      // Add a stylish fallback background gradient class to parent
      if (src.includes('hero')) {
        parent.classList.add('fallback-gradient-hero');
      } else if (src.includes('bakery')) {
        parent.classList.add('fallback-gradient-bakery');
      } else if (src.includes('sweets') || src.includes('peda') || src.includes('ladoo') || src.includes('katli') || src.includes('vadi') || src.includes('halwa') || src.includes('jamun') || src.includes('barfi') || src.includes('jalebi') || src.includes('rasgulla') || src.includes('cake') || src.includes('rasmalai') || src.includes('pak') || src.includes('shahi')) {
        parent.classList.add('fallback-gradient-sweets');
      } else if (src.includes('dryfruits')) {
        parent.classList.add('fallback-gradient-dryfruits');
      } else if (src.includes('farasan') || src.includes('chivda') || src.includes('shev') || src.includes('boondi') || src.includes('bhadang') || src.includes('papdi') || src.includes('bhavnagari')) {
        parent.classList.add('fallback-gradient-farasan');
      } else if (src.includes('snacks') || src.includes('wafers') || src.includes('banana') || src.includes('doritos') || src.includes('yumm') || src.includes('cornitos') || src.includes('angles') || src.includes('kurkure') || src.includes('medhe') || src.includes('pataka') || src.includes('rings') || src.includes('takatak') || src.includes('pufficorn') || src.includes('lays') || src.includes('chipps') || src.includes('pringles') || src.includes('budhani')) {
        parent.classList.add('fallback-gradient-snacks');
      } else if (src.includes('biscuits') || src.includes('cookies') || src.includes('parleg') || src.includes('goodday') || src.includes('mariegold') || src.includes('fantasy') || src.includes('5050') || src.includes('monaco') || src.includes('bourbon') || src.includes('oreo') || src.includes('magic') || src.includes('nutrichoice') || src.includes('hideseek') || src.includes('jimjam') || src.includes('hearts') || src.includes('unibic')) {
        parent.classList.add('fallback-gradient-biscuits');
      } else if (src.includes('dairy') || src.includes('paneer') || src.includes('butter') || src.includes('cheese') || src.includes('cream') || src.includes('malai') || src.includes('curd') || src.includes('dahi') || src.includes('chaas') || src.includes('lassi') || src.includes('ghee') || src.includes('khoya') || src.includes('mawa') || src.includes('milk') || src.includes('condensed')) {
        parent.classList.add('fallback-gradient-dairy');
      } else if (src.includes('masala') || src.includes('chutney') || src.includes('joystick') || src.includes('powder') || src.includes('methi')) {
        parent.classList.add('fallback-gradient-masalas');
      } else if (src.includes('cupcake')) {
        parent.classList.add('fallback-gradient-cupcakes');
      } else if (src.includes('drinks') || src.includes('cola') || src.includes('pepsi') || src.includes('sprite') || src.includes('7up') || src.includes('fanta') || src.includes('mirinda') || src.includes('limca') || src.includes('dew') || src.includes('fizz') || src.includes('soda') || src.includes('energy') || src.includes('redbull') || src.includes('sting') || src.includes('hell') || src.includes('water') || src.includes('bisleri') || src.includes('aquafina') || src.includes('maaza') || src.includes('frooti') || src.includes('slice') || src.includes('juice') || src.includes('natural')) {
        parent.classList.add('fallback-gradient-drinks');
      } else {
        parent.style.background = 'linear-gradient(135deg, #1A1A1A 0%, #050505 100%)';
        parent.style.boxShadow = 'inset 0 0 50px rgba(0,0,0,0.8)';
      }
      
      // If there is an overlay, make sure it is styled appropriately
      parent.style.position = 'relative';
      
      // Create a nice placeholder label if none exists
      if (!parent.querySelector('.image-placeholder-label') && !parent.classList.contains('hero-bg') && !parent.classList.contains('nav-brand') && !parent.classList.contains('footer-logo')) {
        const label = document.createElement('div');
        label.className = 'image-placeholder-label';
        label.style.position = 'absolute';
        label.style.top = '50%';
        label.style.left = '50%';
        label.style.transform = 'translate(-50%, -50%)';
        label.style.color = '#F4B400';
        label.style.fontSize = '0.9rem';
        label.style.fontFamily = "'Tiro Devanagari Marathi', serif";
        label.style.opacity = '0.8';
        label.innerText = 'मुकुंदप्रभा';
        parent.appendChild(label);
      }
    });
  });
}

/* ==========================================================================
   9. PRODUCT CATALOG INTERACTIVE FILTERING & SEARCH
   ========================================================================== */
function initProductCatalog() {
  const searchInput = document.getElementById('catalog-search');
  const tabs = document.querySelectorAll('.catalog-tab');
  const products = document.querySelectorAll('.product-card');

  if (products.length === 0) return;

  let activeCategory = 'all';
  let searchQuery = '';

  // Tab Filtering
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      activeCategory = tab.getAttribute('data-filter');
      filterProducts();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterProducts();
    });
  }

  function filterProducts() {
    products.forEach(product => {
      const category = product.getAttribute('data-category');
      const title = product.querySelector('.product-title').innerText.toLowerCase();
      const tag = product.querySelector('.product-category-tag').innerText.toLowerCase();

      // Check category match
      const categoryMatch = (activeCategory === 'all' || category === activeCategory);
      
      // Check search match (supports English and Devanagari text matching)
      const searchMatch = !searchQuery || title.includes(searchQuery) || tag.includes(searchQuery);

      if (categoryMatch && searchMatch) {
        // Show with dynamic scale-up fade
        product.classList.remove('hidden');
        setTimeout(() => {
          product.style.opacity = '1';
          product.style.transform = 'scale(1)';
        }, 50);
      } else {
        // Hide
        product.style.opacity = '0';
        product.style.transform = 'scale(0.9)';
        product.classList.add('hidden');
      }
    });

    // Re-trigger scroll reveal audit so newly displayed products animate smoothly
    if (typeof revealOnScroll === 'function') {
      revealOnScroll();
    }
  }
}
