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

  // Sticky Header elevation on scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });
});

