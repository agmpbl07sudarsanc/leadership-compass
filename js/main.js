document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.navbar-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  document.querySelectorAll('.topic-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.topic-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const topic = pill.dataset.topic;
      document.querySelectorAll('.post-card').forEach(card => {
        if (topic === 'all' || card.dataset.topic === topic) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Newsletter signup - submits to Mailchimp via JSONP (their endpoint
  // supports it cross-origin) and shows the result inline on the button.
  const MC_URL = 'https://gmail.us5.list-manage.com/subscribe/post-json' +
                 '?u=3046c528ba5fb7a11a37a517d&id=a29cc928f6';

  document.querySelectorAll('form[data-newsletter]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      const originalText = btn.textContent;
      const email = (input.value || '').trim();
      if (!email) return;

      btn.textContent = 'Subscribing…';
      btn.disabled = true;

      const cb = 'mcCallback' + Date.now();
      const script = document.createElement('script');
      let settled = false;

      function finish(ok, msg) {
        if (settled) return;
        settled = true;
        btn.disabled = false;
        btn.textContent = ok ? 'Subscribed!' : 'Try again';
        btn.style.background = ok ? '#16a34a' : '#dc2626';
        if (ok) form.reset();
        if (!ok && msg) console.warn('Mailchimp:', msg);
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 3000);
        delete window[cb];
        script.remove();
      }

      window[cb] = (data) => {
        // "Already subscribed" counts as success from the reader's side
        const ok = data.result === 'success' || /already subscribed/i.test(data.msg || '');
        finish(ok, data.msg);
      };
      script.onerror = () => finish(false, 'network error');
      setTimeout(() => finish(false, 'timeout'), 10000);

      script.src = MC_URL + '&EMAIL=' + encodeURIComponent(email) + '&c=' + cb;
      document.body.appendChild(script);
    });
  });
});

/* ── PWA: register the service worker for offline support & installability ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* offline features unavailable; site still works */ });
  });
}
