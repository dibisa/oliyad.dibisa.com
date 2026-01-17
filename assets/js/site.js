/* Site JS: hero media, project card selection, footer toggle */
(function(){
  const projects = window.SITE_PROJECTS || [];
  if(!projects || projects.length===0) return;

  let selectedProjectId = projects[0].id || 0;
  let selectedMediaIndex = 0;

  function findProject(id){ return projects.find(p=>String(p.id)===String(id)) || projects[0]; }

  function toEmbedUrl(src){
    if(!src) return src;
    if(src.includes('youtube.com') || src.includes('youtu.be')){
      // convert to embed form
      let m = src.match(/v=([\w-]+)/);
      if(!m) m = src.match(/youtu\.be\/([\w-]+)/);
      const vid = (m && m[1]) ? m[1] : null;
      return vid ? ('https://www.youtube.com/embed/' + vid + '?rel=0') : src;
    }
    return src;
  }

  function renderHero(){
    const project = findProject(selectedProjectId);
    const container = document.getElementById('hero-media-container');
    const caption = document.getElementById('hero-media-caption');
    const titleEl = document.getElementById('hero-media-title');
    if(!container || !titleEl) return;
    titleEl.textContent = project.title || '';

    const items = project.media || [];
    if(selectedMediaIndex >= items.length) selectedMediaIndex = 0;
    container.innerHTML = '';

    let item = items[selectedMediaIndex];
    if(!item){
      const img = document.createElement('img');
      img.src = (window.SITE_MEDIA_PLACEHOLDER || '/assets/media/placeholder.svg');
      img.alt = project.title;
      container.appendChild(img);
      caption.textContent = '';
    } else {
      caption.textContent = item.caption || '';
      if(item.type === 'video'){
        if(item.src.includes('youtube')){
          const iframe = document.createElement('iframe');
          iframe.src = toEmbedUrl(item.src);
          iframe.frameBorder = 0;
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          container.appendChild(iframe);
        } else {
          const v = document.createElement('video');
          v.src = item.src;
          v.controls = true;
          v.style.maxHeight = '520px';
          container.appendChild(v);
        }
      } else {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.caption || project.title;
        container.appendChild(img);
      }
    }

    // highlight active card
    document.querySelectorAll('[data-project-id]').forEach(el => {
      el.classList.toggle('project-active', String(el.dataset.projectId) === String(selectedProjectId));
    });
  }

  function selectProject(id){ selectedProjectId = id; selectedMediaIndex = 0; renderHero(); }

  function changeMedia(delta){
    const project = findProject(selectedProjectId);
    const len = (project.media || []).length || 1;
    selectedMediaIndex = (selectedMediaIndex + delta + len) % len;
    renderHero();
  }

  // footer toggle behavior
  function adjustBodyPadding(){
    const footer = document.querySelector('.sticky-footer');
    if(!footer) return;
    const isOpen = footer.classList.contains('site-card-open');
    const root = getComputedStyle(document.documentElement);
    const val = isOpen ? root.getPropertyValue('--footer-height-expanded') : root.getPropertyValue('--footer-height-collapsed');
    const px = parseInt(val) || (isOpen ? 180 : 64);
    const main = document.querySelector('.home'); if(main) main.style.paddingBottom = px + 'px';
  }

  function setFooterState(open){
    const footer = document.getElementById('sticky-footer');
    if(!footer) return;
    footer.classList.toggle('site-card-open', !!open);
    const toggle = footer.querySelector('.footer-toggle');
    if(toggle) toggle.setAttribute('aria-expanded', !!open);
    localStorage.setItem('footerOpen', !!open ? '1' : '0');
    adjustBodyPadding();
  }

  // initialize
  document.addEventListener('DOMContentLoaded', function(){
    // cards click
    document.body.addEventListener('click', function(e){
      const card = e.target.closest('[data-project-id]');
      if(card && !e.target.closest('a')){ // clicking anywhere on card selects
        selectProject(card.dataset.projectId);
        return;
      }

      if(e.target.id === 'hero-media-prev' || e.target.closest('.hero-watermark-left')){ changeMedia(-1); return; }
      if(e.target.id === 'hero-media-next' || e.target.closest('.hero-watermark-right')){ changeMedia(1); return; }

      if(e.target.closest('.footer-toggle')){ const f = document.getElementById('sticky-footer'); setFooterState(!f.classList.contains('site-card-open')); return; }
    });

    // initial footer state: mobile collapsed by default unless stored
    const stored = localStorage.getItem('footerOpen');
    const isMobile = window.innerWidth <= 640;
    if(stored !== null){ setFooterState(stored === '1'); }
    else { setFooterState(!isMobile); }

    renderHero();
  });
})();
