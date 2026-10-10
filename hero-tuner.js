// ==========================================================================
// HERO SLIDE 1 & 2 VISUAL ADJUSTER TOOLBAR (INTERACTIVE TUNER)
// ==========================================================================
(function() {
  const tunerHtml = `
    <div id="heroTunerWidget" class="hero-tuner-widget">
      <div class="hero-tuner-header">
        <div class="tuner-title">
          <span class="tuner-icon">🛠️</span>
          <strong>Hero Slide Adjuster</strong>
        </div>
        <div class="tuner-header-actions">
          <button id="tunerMinimizeBtn" type="button" class="tuner-btn-icon" title="Minimize/Maximize">&minus;</button>
        </div>
      </div>

      <div class="hero-tuner-body" id="tunerBody">
        <div class="tuner-tab-bar">
          <button type="button" class="tuner-tab active" data-tab="slide1">Slide 1 (Logo)</button>
          <button type="button" class="tuner-tab" data-tab="slide2">Slide 2 (Couch)</button>
        </div>

        <!-- Slide 1 Controls -->
        <div class="tuner-panel active" id="panelSlide1">
          <div class="tuner-field">
            <div class="tuner-label-row">
              <label for="s1ContainerWidth">Box Width</label>
              <span class="tuner-val" id="valS1Width">300px</span>
            </div>
            <input type="range" id="s1ContainerWidth" min="160" max="450" step="5" value="300">
          </div>

          <div class="tuner-field">
            <div class="tuner-label-row">
              <label for="s1ContainerHeight">Box Height (Y-axis)</label>
              <span class="tuner-val" id="valS1Height">300px</span>
            </div>
            <input type="range" id="s1ContainerHeight" min="160" max="450" step="5" value="300">
          </div>

          <div class="tuner-field">
            <div class="tuner-label-row">
              <label for="s1OffsetY">Move Lower / Higher (Y offset)</label>
              <span class="tuner-val" id="valS1OffsetY">0px</span>
            </div>
            <input type="range" id="s1OffsetY" min="-80" max="120" step="2" value="0">
          </div>

          <div class="tuner-field">
            <div class="tuner-label-row">
              <label for="s1LogoSize">Logo Image Size</label>
              <span class="tuner-val" id="valS1LogoSize">230px</span>
            </div>
            <input type="range" id="s1LogoSize" min="140" max="320" step="5" value="230">
          </div>

          <div class="tuner-field">
            <div class="tuner-label-row">
              <label for="s1Align">Vertical Alignment</label>
            </div>
            <select id="s1Align" class="tuner-select">
              <option value="center" selected>Center in Grid</option>
              <option value="flex-start">Top (Align to Header)</option>
              <option value="flex-end">Bottom (Align to Buttons)</option>
            </select>
          </div>
        </div>

        <!-- Slide 2 Controls -->
        <div class="tuner-panel" id="panelSlide2">
          <div class="tuner-field">
            <div class="tuner-label-row">
              <label for="s2ImgHeight">Couch Max Height</label>
              <span class="tuner-val" id="valS2ImgHeight">220px</span>
            </div>
            <input type="range" id="s2ImgHeight" min="140" max="360" step="5" value="220">
          </div>

          <div class="tuner-field">
            <div class="tuner-label-row">
              <label for="s2OffsetY">Move Lower / Higher (Y offset)</label>
              <span class="tuner-val" id="valS2OffsetY">0px</span>
            </div>
            <input type="range" id="s2OffsetY" min="-80" max="120" step="2" value="0">
          </div>

          <div class="tuner-field">
            <div class="tuner-label-row">
              <label for="s2Scale">Couch Scale</label>
              <span class="tuner-val" id="valS2Scale">100%</span>
            </div>
            <input type="range" id="s2Scale" min="70" max="140" step="2" value="100">
          </div>

          <div class="tuner-field">
            <div class="tuner-label-row">
              <label for="s2Align">Vertical Alignment</label>
            </div>
            <select id="s2Align" class="tuner-select">
              <option value="center" selected>Center in Grid</option>
              <option value="flex-start">Top (Align to Header)</option>
              <option value="flex-end">Bottom (Align to Buttons)</option>
            </select>
          </div>
        </div>

        <div class="tuner-actions">
          <button type="button" id="tunerCopyBtn" class="tuner-btn primary">📋 Copy My Dimensions</button>
          <button type="button" id="tunerResetBtn" class="tuner-btn secondary">↺ Reset</button>
        </div>

        <div class="tuner-copy-output-wrapper">
          <label>Ready to copy & paste into chat:</label>
          <textarea id="tunerOutputText" readonly class="tuner-textarea" rows="3"></textarea>
        </div>
      </div>
    </div>
  `;

  const tunerStyles = `
    .hero-tuner-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 330px;
      background: rgba(18, 18, 18, 0.96);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(197, 160, 89, 0.4);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      color: #f5f5f5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      z-index: 999999;
      box-sizing: border-box;
      transition: transform 0.25s ease, opacity 0.25s ease;
    }
    .hero-tuner-widget * {
      box-sizing: border-box;
    }
    .hero-tuner-widget.minimized .hero-tuner-body {
      display: none;
    }
    .hero-tuner-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      user-select: none;
    }
    .tuner-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #d4af37;
      font-size: 13px;
    }
    .tuner-btn-icon {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      border-radius: 4px;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
    }
    .hero-tuner-body {
      padding: 14px;
      max-height: 80vh;
      overflow-y: auto;
    }
    .tuner-tab-bar {
      display: flex;
      gap: 6px;
      margin-bottom: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 8px;
    }
    .tuner-tab {
      flex: 1;
      padding: 6px 10px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      color: #bbb;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tuner-tab.active {
      background: #c5a059;
      color: #111;
      font-weight: 700;
      border-color: #c5a059;
    }
    .tuner-panel {
      display: none;
    }
    .tuner-panel.active {
      display: block;
    }
    .tuner-field {
      margin-bottom: 12px;
    }
    .tuner-label-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 12px;
      color: #ccc;
    }
    .tuner-val {
      color: #e5c378;
      font-family: monospace;
      font-weight: 700;
    }
    .tuner-field input[type="range"] {
      width: 100%;
      accent-color: #c5a059;
      cursor: pointer;
    }
    .tuner-select {
      width: 100%;
      background: #252525;
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 6px;
      padding: 6px 8px;
      font-size: 12px;
      cursor: pointer;
    }
    .tuner-actions {
      display: flex;
      gap: 8px;
      margin-top: 14px;
      margin-bottom: 12px;
    }
    .tuner-btn {
      flex: 1;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .tuner-btn.primary {
      background: #c5a059;
      color: #111;
    }
    .tuner-btn.primary:hover {
      background: #dfbc74;
    }
    .tuner-btn.secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.18);
      flex: 0 0 65px;
    }
    .tuner-copy-output-wrapper {
      margin-top: 10px;
    }
    .tuner-copy-output-wrapper label {
      display: block;
      font-size: 11px;
      color: #888;
      margin-bottom: 4px;
    }
    .tuner-textarea {
      width: 100%;
      background: #111;
      border: 1px solid rgba(197, 160, 89, 0.3);
      color: #99e2a7;
      font-family: monospace;
      font-size: 11px;
      padding: 6px 8px;
      border-radius: 4px;
      resize: vertical;
    }
  `;

  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = tunerStyles;
  document.head.appendChild(styleEl);

  // Inject HTML
  const container = document.createElement('div');
  container.innerHTML = tunerHtml;
  document.body.appendChild(container.firstElementChild);

  // References
  const widget = document.getElementById('heroTunerWidget');
  const minimizeBtn = document.getElementById('tunerMinimizeBtn');
  const header = widget.querySelector('.hero-tuner-header');
  const tabs = widget.querySelectorAll('.tuner-tab');
  const panels = widget.querySelectorAll('.tuner-panel');

  // Slide elements
  const slide1 = document.querySelector('.hero-slide[data-slide-index="0"]');
  const slide2 = document.querySelector('.hero-slide[data-slide-index="1"]');
  const brandStage = document.querySelector('.hero-stage.brand-stage');
  const brandLogo = document.querySelector('.hero-brand-logo-large');
  const slide1Visual = slide1 ? slide1.querySelector('.hero-slide-visual') : null;

  const couchImg = document.querySelector('.hero-sectional-clean-img');
  const slide2Visual = slide2 ? slide2.querySelector('.hero-slide-visual') : null;

  // Carousel control function helper
  const goToHeroSlide = (index) => {
    const track = document.getElementById('heroTrack');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (track) {
      track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
    }
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  };

  // Slide 1 inputs
  const s1Width = document.getElementById('s1ContainerWidth');
  const s1Height = document.getElementById('s1ContainerHeight');
  const s1OffsetY = document.getElementById('s1OffsetY');
  const s1LogoSize = document.getElementById('s1LogoSize');
  const s1Align = document.getElementById('s1Align');

  const valS1Width = document.getElementById('valS1Width');
  const valS1Height = document.getElementById('valS1Height');
  const valS1OffsetY = document.getElementById('valS1OffsetY');
  const valS1LogoSize = document.getElementById('valS1LogoSize');

  // Slide 2 inputs
  const s2ImgHeight = document.getElementById('s2ImgHeight');
  const s2OffsetY = document.getElementById('s2OffsetY');
  const s2Scale = document.getElementById('s2Scale');
  const s2Align = document.getElementById('s2Align');

  const valS2ImgHeight = document.getElementById('valS2ImgHeight');
  const valS2OffsetY = document.getElementById('valS2OffsetY');
  const valS2Scale = document.getElementById('valS2Scale');

  // Output
  const copyBtn = document.getElementById('tunerCopyBtn');
  const resetBtn = document.getElementById('tunerResetBtn');
  const outputText = document.getElementById('tunerOutputText');

  // Minimize toggle
  minimizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    widget.classList.toggle('minimized');
    minimizeBtn.innerHTML = widget.classList.contains('minimized') ? '&plus;' : '&minus;';
  });

  header.addEventListener('click', () => {
    if (widget.classList.contains('minimized')) {
      widget.classList.remove('minimized');
      minimizeBtn.innerHTML = '&minus;';
    }
  });

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const targetId = tab.dataset.tab === 'slide1' ? 'panelSlide1' : 'panelSlide2';
      document.getElementById(targetId).classList.add('active');

      // Navigate carousel to the selected slide
      if (tab.dataset.tab === 'slide1') {
        goToHeroSlide(0);
      } else {
        goToHeroSlide(1);
      }
    });
  });

  // Apply Slide 1 Updates
  function updateSlide1() {
    const w = s1Width.value + 'px';
    const h = s1Height.value + 'px';
    const y = s1OffsetY.value + 'px';
    const lSize = s1LogoSize.value + 'px';
    const align = s1Align.value;

    valS1Width.textContent = w;
    valS1Height.textContent = h;
    valS1OffsetY.textContent = y;
    valS1LogoSize.textContent = lSize;

    if (brandStage) {
      brandStage.style.maxWidth = w;
      brandStage.style.width = w;
      brandStage.style.height = h;
      brandStage.style.transform = `translateY(${y})`;
    }
    if (brandLogo) {
      brandLogo.style.maxHeight = lSize;
      brandLogo.style.maxWidth = lSize;
    }
    if (slide1Visual) {
      slide1Visual.style.alignSelf = align;
    }
    updateOutputText();
  }

  // Apply Slide 2 Updates
  function updateSlide2() {
    const h = s2ImgHeight.value + 'px';
    const y = s2OffsetY.value + 'px';
    const scale = (s2Scale.value / 100);
    const align = s2Align.value;

    valS2ImgHeight.textContent = h;
    valS2OffsetY.textContent = y;
    valS2Scale.textContent = s2Scale.value + '%';

    if (couchImg) {
      couchImg.style.maxHeight = h;
      couchImg.style.transform = `translateY(${y}) scale(${scale})`;
    }
    if (slide2Visual) {
      slide2Visual.style.alignSelf = align;
    }
    updateOutputText();
  }

  function updateOutputText() {
    const text = `Slide 1: Box ${s1Width.value}x${s1Height.value}px, OffsetY: ${s1OffsetY.value}px, Logo: ${s1LogoSize.value}px, Align: ${s1Align.value} | Slide 2: Height ${s2ImgHeight.value}px, OffsetY: ${s2OffsetY.value}px, Scale: ${s2Scale.value}%, Align: ${s2Align.value}`;
    outputText.value = text;
  }

  // Attach event listeners
  [s1Width, s1Height, s1OffsetY, s1LogoSize, s1Align].forEach(el => {
    el.addEventListener('input', updateSlide1);
  });
  [s2ImgHeight, s2OffsetY, s2Scale, s2Align].forEach(el => {
    el.addEventListener('input', updateSlide2);
  });

  // Copy button
  copyBtn.addEventListener('click', () => {
    outputText.select();
    navigator.clipboard.writeText(outputText.value).then(() => {
      const origText = copyBtn.innerHTML;
      copyBtn.innerHTML = '✅ Copied to Clipboard!';
      setTimeout(() => {
        copyBtn.innerHTML = origText;
      }, 2000);
    }).catch(() => {
      copyBtn.innerHTML = '✅ Selected! (Press Ctrl+C)';
    });
  });

  // Reset button
  resetBtn.addEventListener('click', () => {
    s1Width.value = 300;
    s1Height.value = 300;
    s1OffsetY.value = 0;
    s1LogoSize.value = 230;
    s1Align.value = 'center';

    s2ImgHeight.value = 220;
    s2OffsetY.value = 0;
    s2Scale.value = 100;
    s2Align.value = 'center';

    updateSlide1();
    updateSlide2();
  });

  // Initial calculation
  updateSlide1();
  updateSlide2();
})();
