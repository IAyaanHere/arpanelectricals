/**
 * Arpan Electricals & Enterprises - Quanta Theme Interactive Scripts
 * Responsive Features, Theme Toggle, WhatsApp Integration & Interactive UI
 */

// Global Theme Switcher accessible everywhere
function setThemeMode(theme) {
  const targetTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', targetTheme);
  try {
    localStorage.setItem('arpan_theme', targetTheme);
  } catch (e) {
    // localStorage may be disabled in some sandboxes
  }
}

function toggleThemeMode() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const nextTheme = current === 'dark' ? 'light' : 'dark';
  setThemeMode(nextTheme);
  return nextTheme;
}

// Make globally accessible
window.toggleTheme = toggleThemeMode;
window.setTheme = setThemeMode;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme from storage (default: light)
  try {
    const saved = localStorage.getItem('arpan_theme') || 'light';
    setThemeMode(saved);
  } catch (e) {
    setThemeMode('light');
  }

  // 1. Theme Toggle Event Listeners (both desktop navbar & mobile drawer)
  const themeBtns = document.querySelectorAll('.theme-toggle-btn, #themeToggleBtn, #drawerThemeToggleBtn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleThemeMode();
    });
  });

  // 2. Sticky Navbar Locked on Scroll
  const navbar = document.querySelector('.navbar');
  function handleScroll() {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. Mobile Drawer Navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const drawerClose = document.querySelector('.drawer-close');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-nav a');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // 4. Hero Video Autoplay Assurance
  const heroVideo = document.querySelector('.hero-video-element');
  if (heroVideo) {
    heroVideo.muted = true;
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        document.addEventListener('click', () => {
          heroVideo.play().catch(() => {});
        }, { once: true });
      });
    }
  }

  // 5. KPI Number Count-Up Animation
  const counters = document.querySelectorAll('.counter-number');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOutProgress * target);
            el.textContent = currentVal;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = target;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // 6. Client Tabs Filter & Top 6 Toggle Handler
  const clientTabs = document.querySelectorAll('.client-filter-tabs .tab-btn');
  const clientCards = document.querySelectorAll('.client-card');
  const clientsGrid = document.querySelector('.clients-grid');
  const toggleClientsBtn = document.getElementById('toggleClientsBtn');

  if (toggleClientsBtn && clientsGrid) {
    toggleClientsBtn.addEventListener('click', () => {
      const isExpanded = clientsGrid.classList.toggle('is-expanded');
      toggleClientsBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      const btnText = toggleClientsBtn.querySelector('.btn-text');
      const icon = toggleClientsBtn.querySelector('.toggle-icon');
      
      if (isExpanded) {
        if (btnText) btnText.textContent = 'Show Top 6 Clients';
        if (icon) icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
      } else {
        if (btnText) btnText.textContent = 'View All Clients (20+)';
        if (icon) icon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
        const clientsSection = document.getElementById('clients');
        if (clientsSection) {
          clientsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  clientTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      clientTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter') || 'all';

      if (filter !== 'all') {
        if (clientsGrid) clientsGrid.classList.add('is-expanded');
        if (toggleClientsBtn) {
          const btnText = toggleClientsBtn.querySelector('.btn-text');
          const icon = toggleClientsBtn.querySelector('.toggle-icon');
          if (btnText) btnText.textContent = 'Show Top 6 Clients';
          if (icon) icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
        }
        clientCards.forEach(card => {
          const cat = card.getAttribute('data-category') || '';
          if (cat.includes(filter)) {
            card.style.display = 'flex';
            setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 30);
          } else {
            card.style.display = 'none';
          }
        });
      } else {
        clientCards.forEach(card => {
          card.style.display = '';
          card.style.opacity = '1';
        });
      }
    });
  });

  // 7. Project Filter Tabs & Top 5 Toggle Handler
  const projectTabs = document.querySelectorAll('.project-filter-tabs .tab-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectsGrid = document.querySelector('.projects-grid');
  const toggleProjectsBtn = document.getElementById('toggleProjectsBtn');

  if (toggleProjectsBtn && projectsGrid) {
    toggleProjectsBtn.addEventListener('click', () => {
      const isExpanded = projectsGrid.classList.toggle('is-expanded');
      toggleProjectsBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      const btnText = toggleProjectsBtn.querySelector('.btn-text');
      const icon = toggleProjectsBtn.querySelector('.toggle-icon');
      
      if (isExpanded) {
        if (btnText) btnText.textContent = 'Show Top 5 Projects';
        if (icon) icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
      } else {
        if (btnText) btnText.textContent = 'View All Projects (12+)';
        if (icon) icon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // Filter tabs logic with auto-expand
  projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      projectTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter') || 'all';

      if (filter !== 'all') {
        if (projectsGrid) projectsGrid.classList.add('is-expanded');
        if (toggleProjectsBtn) {
          const btnText = toggleProjectsBtn.querySelector('.btn-text');
          const icon = toggleProjectsBtn.querySelector('.toggle-icon');
          if (btnText) btnText.textContent = 'Show Top 5 Projects';
          if (icon) icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
        }
        projectCards.forEach(card => {
          const cat = card.getAttribute('data-category') || '';
          if (cat.includes(filter)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      } else {
        projectCards.forEach(card => {
          card.style.display = '';
        });
      }
    });
  });

  // 8. Project Lightbox Modal
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxDesc = document.querySelector('.lightbox-desc');
  const lightboxClose = document.querySelector('.lightbox-close');

  function openLightbox(src, title, desc) {
    if (lightboxImg) lightboxImg.src = src;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;
    lightboxModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.project-title')?.textContent || '';
      const desc = card.querySelector('.project-desc')?.textContent || '';
      if (img) {
        openLightbox(img.src, title, desc);
      }
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeLightbox();
    }
  });

  // 9. Contact Form Handling -> Direct WhatsApp pre-typed integration
  const contactForms = document.querySelectorAll('#contact-form, form');
  
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll('input, select, textarea');
      let name = '';
      let company = '';
      let phone = '';
      let req = '';
      let msg = '';

      inputs.forEach(input => {
        const val = input.value.trim();
        const placeholder = (input.placeholder || '').toLowerCase();
        const label = input.closest('.form-group')?.querySelector('label')?.textContent.toLowerCase() || '';

        if (label.includes('name') || placeholder.includes('name')) name = val;
        else if (label.includes('company') || label.includes('utility') || placeholder.includes('organization') || placeholder.includes('msedcl')) company = val;
        else if (label.includes('phone') || placeholder.includes('phone') || input.type === 'tel') phone = val;
        else if (input.tagName === 'SELECT') req = input.options[input.selectedIndex]?.text || val;
        else if (input.tagName === 'TEXTAREA' || label.includes('message') || label.includes('details') || label.includes('scope')) msg = val;
      });

      let waText = "Hello Arpan Electricals & Enterprises, I would like to request an enquiry / quote:";
      if (name) waText += `\nName: ${name}`;
      if (company) waText += `\nCompany: ${company}`;
      if (phone) waText += `\nPhone: ${phone}`;
      if (req) waText += `\nRequirement / Service: ${req}`;
      if (msg) waText += `\nScope / Details: ${msg}`;

      const waUrl = `https://wa.me/918047657578?text=${encodeURIComponent(waText)}`;


      window.open(waUrl, '_blank');
      form.reset();
    });
  });

  // 10. Back to Top Button
  const backToTopBtns = document.querySelectorAll('.back-to-top');
  backToTopBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
