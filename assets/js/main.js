/**
 * The Celebration 132 - Interactive JavaScript
 * Premium UI/UX Interactions, Gold Particles & Inquiry Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavigation();
  initServiceFilters();
  initModals();
  initFaqAccordion();
  initGalleryLightbox();
  initBookingForms();
});

/* ==========================================================================
   1. Floating Gold Dust Particle Canvas
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(init = false) {
      this.x = Math.random() * width;
      this.y = init ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.5 + 0.8;
      this.speedY = Math.random() * 0.45 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.fadeSpeed = Math.random() * 0.005 + 0.002;
      this.color = Math.random() > 0.3 ? '#d4af37' : '#f5e298';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.alpha += this.fadeSpeed;
      if (this.alpha > 0.8 || this.alpha < 0.2) {
        this.fadeSpeed = -this.fadeSpeed;
      }
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#d4af37';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. Sticky Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const drawerClose = document.getElementById('drawerCloseBtn');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active state highlighting
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });

  // Mobile menu toggle
  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileBtn) mobileBtn.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer.classList.contains('open')) closeDrawer();
    });
  });
}

/* ==========================================================================
   3. Service Filtering Logic
   ========================================================================== */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Modals & Quick Action Triggers
   ========================================================================== */
function initModals() {
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const openBtns = document.querySelectorAll('.open-booking-modal');
  const modalServiceSelect = document.getElementById('modalServiceSelect');
  const modalVenueSelect = document.getElementById('modalVenueSelect');

  function openModal(serviceName = '', venueName = '') {
    if (serviceName && modalServiceSelect) {
      for (let i = 0; i < modalServiceSelect.options.length; i++) {
        if (modalServiceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
          modalServiceSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (venueName && modalVenueSelect) {
      for (let i = 0; i < modalVenueSelect.options.length; i++) {
        if (modalVenueSelect.options[i].text.toLowerCase().includes(venueName.toLowerCase())) {
          modalVenueSelect.selectedIndex = i;
          break;
        }
      }
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      const venue = btn.getAttribute('data-venue') || '';
      openModal(service, venue);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Quick Hero Bar Trigger
  const quickBarSubmit = document.getElementById('heroQuickSubmit');
  if (quickBarSubmit) {
    quickBarSubmit.addEventListener('click', () => {
      const service = document.getElementById('heroServiceSelect').value;
      const venue = document.getElementById('heroVenueSelect').value;
      openModal(service, venue);
    });
  }
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   7. Gallery Lightbox
   ========================================================================== */
function initGalleryLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const closeBtn = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.currentSrc || img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
}

/* ==========================================================================
   8. Booking & Contact Forms Handling
   ========================================================================== */
function initBookingForms() {
  const modalForm = document.getElementById('modalBookingForm');
  const contactForm = document.getElementById('mainContactForm');

  function showToast(message) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#d4af37;"></i> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('mName').value;
      const phone = document.getElementById('mPhone').value;
      const service = document.getElementById('modalServiceSelect').value;
      const venue = document.getElementById('modalVenueSelect').value;
      const date = document.getElementById('mDate').value;
      const guests = document.getElementById('mGuests').value;
      const note = document.getElementById('mNote').value;

      const whatsappText = `*Inquiry: The Celebration 132*
Name: ${name}
Phone: ${phone}
Service: ${service}
Preferred Venue: ${venue}
Date: ${date}
Guests: ${guests}
Notes: ${note}`;

      const whatsappUrl = `https://wa.me/918860229232?text=${encodeURIComponent(whatsappText)}`;

      showToast(`Thank you ${name}! Opening WhatsApp to connect directly with our event concierge.`);
      
      const modal = document.getElementById('bookingModal');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 900);
      modalForm.reset();
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cName').value;
      const phone = document.getElementById('cPhone').value;
      const email = document.getElementById('cEmail').value;
      const service = document.getElementById('cService').value;
      const message = document.getElementById('cMessage').value;

      const whatsappText = `*Contact Request: The Celebration 132*
Name: ${name}
Phone: ${phone}
Email: ${email}
Interested In: ${service}
Message: ${message}`;

      const whatsappUrl = `https://wa.me/918860229232?text=${encodeURIComponent(whatsappText)}`;

      showToast(`Thank you ${name}! We have received your inquiry. Opening WhatsApp concierge.`);
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 900);
      contactForm.reset();
    });
  }
}
