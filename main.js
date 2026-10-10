/*
  ==========================================================================
  CONCEPT 1: "THE GALLERY" (DWR-Inspired Editorial Minimalism)
  Design Intent: Subtle, smooth interactions for mobile drawer, catalog filter
  pills, and interactive hotspot preview.
  ==========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Drawer Toggle
  const navToggle = document.getElementById('navToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (navToggle && mobileDrawer && drawerClose) {
    const openDrawer = () => {
      navToggle.setAttribute('aria-expanded', 'true');
      mobileDrawer.classList.add('active');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('drawer-open');
    };

    const closeDrawer = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('active');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('drawer-open');
    };

    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    drawerClose.addEventListener('click', closeDrawer);

    // Close on backdrop click
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        closeDrawer();
      }
    });

    // Close on link click inside drawer
    const drawerLinks = mobileDrawer.querySelectorAll('.drawer-nav a');
    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        closeDrawer();
      }
    });
  }



  // Transparent-to-Solid Sticky Header on scroll (Northern Illinois Cleaning style)
  const header = document.getElementById('header') || document.querySelector('.site-header');
  let ticking = false;

  function updateNavbarScroll() {
    if (!header) return;
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPos > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbarScroll);
      ticking = true;
    }
  }

  if (header) {
    updateNavbarScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('pageshow', updateNavbarScroll);
  }

  // ==========================================================================
  // UNIVERSAL IMAGE LIGHTBOX ZOOM
  // Supports data-lightbox-src, product-media-wrap photos, and story photos
  // ==========================================================================
  let lightbox = document.getElementById('storyLightbox') || document.getElementById('imageLightbox');
  let lightboxImg = document.getElementById('lightboxImg');
  let lightboxCaption = document.getElementById('lightboxCaption');
  let lightboxClose = document.getElementById('lightboxClose');

  // Auto-inject lightbox modal if not already present in the DOM
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'imageLightbox';
    lightbox.className = 'image-lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-label', 'Image zoom preview');
    lightbox.innerHTML = `
      <div class="image-lightbox-inner">
        <button class="image-lightbox-close" id="lightboxClose" aria-label="Close image zoom">&times;</button>
        <img src="" alt="Enlarged furniture preview" class="image-lightbox-img" id="lightboxImg">
        <p class="image-lightbox-caption" id="lightboxCaption"></p>
      </div>
    `;
    document.body.appendChild(lightbox);
    lightboxImg = lightbox.querySelector('#lightboxImg');
    lightboxCaption = lightbox.querySelector('#lightboxCaption');
    lightboxClose = lightbox.querySelector('#lightboxClose');
  }

  const openLightbox = (src, title) => {
    if (!src || !lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.textContent = title || '';
    }
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('image-lightbox-inner') || e.target.classList.contains('story-lightbox-inner')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 1. Explicit data-lightbox-src elements
  document.querySelectorAll('[data-lightbox-src]').forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = item.getAttribute('data-lightbox-src');
      const title = item.getAttribute('data-lightbox-title') || item.getAttribute('alt') || '';
      if (src) openLightbox(src, title);
    });
  });

  // 2. Click-to-zoom on all product card media containers (.product-media-wrap)
  document.querySelectorAll('.product-media-wrap').forEach(wrap => {
    wrap.addEventListener('click', (e) => {
      // If user clicked a direct link, swatch dot, or side toggle arrow, don't trigger lightbox zoom
      if (e.target.closest('a') || e.target.closest('.color-swatch-dots') || e.target.closest('.side-toggle-arrow')) return;

      // Find the visible active image inside the wrap (primary or secondary)
      const imgs = wrap.querySelectorAll('img');
      if (!imgs.length) return;

      let chosenImg = imgs[0];
      const activeView = wrap.getAttribute('data-active-view');
      if (activeView === '1' && imgs.length > 1) {
        chosenImg = imgs[1];
      } else if (imgs.length > 1) {
        const secondary = wrap.querySelector('.product-img.secondary');
        if (secondary && window.getComputedStyle(secondary).opacity === '1') {
          chosenImg = secondary;
        }
      }

      const src = chosenImg.currentSrc || chosenImg.src;
      // Get title from parent product card or image alt
      const productCard = wrap.closest('.product-item');
      const productName = productCard ? productCard.querySelector('.product-name') : null;
      const title = productName ? productName.textContent.trim() : (chosenImg.alt || 'VV Gallery Furniture');

      if (src) {
        e.preventDefault();
        openLightbox(src, title);
      }
    });
  });

  // 3. Color Swatch Dot Switching (e.g. Bean Bag Sac Gray vs Cream)
  document.querySelectorAll('.color-swatch-dots').forEach(swatchContainer => {
    const dots = swatchContainer.querySelectorAll('.swatch-dot');
    const productCard = swatchContainer.closest('.product-item');
    const wrap = productCard ? productCard.querySelector('.product-media-wrap') : swatchContainer.closest('.product-media-wrap');
    if (!wrap) return;

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const index = dot.getAttribute('data-color-index') || '0';
        wrap.setAttribute('data-active-view', index);

        // Update active class on dots
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      });
    });
  });

  // 4. Right Side Toggle Arrow (e.g. Fridge View on Two-Tone Bedroom Set)
  document.querySelectorAll('.side-toggle-arrow').forEach(arrow => {
    const wrap = arrow.closest('.product-media-wrap');
    if (!wrap) return;

    const toggleView = () => {
      const current = wrap.getAttribute('data-active-view') || '0';
      const nextView = current === '1' ? '0' : '1';
      wrap.setAttribute('data-active-view', nextView);
      // Flip arrow direction when viewing fridge detail
      arrow.innerHTML = nextView === '1' ? '&#10094;' : '&#10095;';
      arrow.setAttribute('title', nextView === '1' ? 'Back to Full Set' : 'View Mini Fridge Detail');
      arrow.setAttribute('aria-label', nextView === '1' ? 'Back to Full Set' : 'View Mini Fridge Detail');
    };

    arrow.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleView();
    });

    // Touch Swipe Support on mobile
    let touchStartX = 0;
    let touchEndX = 0;

    wrap.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrap.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        toggleView();
      }
    }, { passive: true });
  });

  // ==========================================================================
  // HERO SPECIALS 4-SLIDE AUTO-CAROUSEL
  // ==========================================================================
  const heroCarousel = document.getElementById('heroCarousel');
  if (heroCarousel) {
    const slides = heroCarousel.querySelectorAll('.hero-slide');
    const dots = heroCarousel.querySelectorAll('.hero-dot');
    let currentIndex = 0;
    let autoInterval = null;
    const slideDuration = 5500; // 5.5 seconds per slide

    const goToSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
        dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
      });
    };

    const nextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      autoInterval = setInterval(nextSlide, slideDuration);
    };

    const stopAutoPlay = () => {
      if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
      }
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(index);
        startAutoPlay();
      });
    });

    // Pause on hover or focus
    heroCarousel.addEventListener('mouseenter', stopAutoPlay);
    heroCarousel.addEventListener('mouseleave', startAutoPlay);
    heroCarousel.addEventListener('focusin', stopAutoPlay);
    heroCarousel.addEventListener('focusout', startAutoPlay);

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    heroCarousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    heroCarousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
      startAutoPlay();
    }, { passive: true });

    startAutoPlay();
  }
});


