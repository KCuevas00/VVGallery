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

  // Shopping Cart "Coming Soon" Toast Feedback
  const cartBtns = document.querySelectorAll('.header-cart-btn');
  cartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const wrapper = btn.closest('.header-cart-wrapper');
      const toast = wrapper ? wrapper.querySelector('.cart-toast') : null;
      if (toast) {
        toast.classList.add('show');
        clearTimeout(btn._toastTimer);
        btn._toastTimer = setTimeout(() => {
          toast.classList.remove('show');
        }, 2200);
      }
    });
  });

  // Filter Pills (Interactive Catalog Filtering)
  const pills = document.querySelectorAll('.filter-pills .pill');
  const productItems = document.querySelectorAll('.matrix-grid .product-item');

  if (pills.length && productItems.length) {
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.getAttribute('data-filter') || 'all';

        pills.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');

        productItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.classList.remove('is-hidden');
          } else {
            item.classList.add('is-hidden');
          }
        });
      });
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
});

