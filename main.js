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
      // If user clicked a direct link inside the wrap, allow default navigation
      if (e.target.closest('a')) return;

      // Find the visible active image inside the wrap (primary or secondary)
      const imgs = wrap.querySelectorAll('img');
      if (!imgs.length) return;

      let chosenImg = imgs[0];
      // If secondary image is active/visible, prefer it
      if (imgs.length > 1) {
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
});

