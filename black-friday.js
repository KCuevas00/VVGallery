/*
  ==========================================================================
  TEMPORARY CAMPAIGN: BLACK FRIDAY SALE (NOV. 23 – NOV. 28, 2026)
  Auto-expires after Nov 28, 2026 (local time) so stale promos never linger.
  Supports ?bf=off / ?bf=on query params for previewing either state.
  ==========================================================================
*/
(function () {
  var params = new URLSearchParams(window.location.search);
  var force = params.get('bf');
  // Sale runs Mon Nov 23, 2026 through Sat Nov 28, 2026 (ends Nov 29 00:00:00)
  var saleEnd = new Date(2026, 10, 29, 0, 0, 0);
  var isActive = force === 'on' || (force !== 'off' && new Date() < saleEnd);

  if (isActive) {
    return;
  }

  document.querySelectorAll('[data-bf-temp]').forEach(function (el) {
    el.remove();
  });

  document.querySelectorAll('[data-bf-fallback]').forEach(function (el) {
    el.removeAttribute('hidden');
  });

  // Re-index remaining hero dots if the temporary Black Friday hero slide was removed
  var heroDots = document.querySelectorAll('#heroCarousel .hero-dot');
  heroDots.forEach(function (dot, idx) {
    dot.setAttribute('data-slide', String(idx));
    dot.classList.toggle('active', idx === 0);
    dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
  });
})();
