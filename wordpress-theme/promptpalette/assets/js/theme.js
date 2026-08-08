/**
 * PromptPalette front-end behaviour.
 * Ports: like/copy/save/rating actions, mobile grid toggle, lightbox,
 * search panel, theme toggle, scroll reveal and route progress bar.
 */
(function () {
  'use strict';

  var cfg = window.PP || { ajax: '', nonce: '', i18n: {} };
  var t = cfg.i18n || {};

  /* ---------- toast ---------- */
  function toast(msg) {
    var host = document.getElementById('pp-toast');
    if (!host) return;
    var el = document.createElement('div');
    el.className =
      'glass-strong pointer-events-auto mb-2 rounded-full px-4 py-2.5 text-sm font-bold shadow-lg';
    el.textContent = msg;
    el.style.opacity = '0';
    el.style.transform = 'translateY(-8px)';
    el.style.transition = 'opacity .25s ease, transform .25s ease';
    host.appendChild(el);
    requestAnimationFrame(function () {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-8px)';
      setTimeout(function () {
        el.remove();
      }, 260);
    }, 2200);
  }

  function post(action, data) {
    var body = new URLSearchParams(Object.assign({ action: action, nonce: cfg.nonce }, data || {}));
    return fetch(cfg.ajax, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    }).then(function (r) {
      return r.json();
    });
  }

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) {
      /* ignore */
    }
    return null;
  }

  /* ---------- theme toggle ---------- */
  (function theme() {
    var html = document.documentElement;
    if (store('theme') === 'light') html.classList.add('light');
    syncIcons();

    function syncIcons() {
      var light = html.classList.contains('light');
      document.querySelectorAll('[data-theme-icon="dark"]').forEach(function (n) {
        n.classList.toggle('hidden', light);
      });
      document.querySelectorAll('[data-theme-icon="light"]').forEach(function (n) {
        n.classList.toggle('hidden', !light);
      });
    }

    var btn = document.getElementById('pp-theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        html.classList.toggle('light');
        store('theme', html.classList.contains('light') ? 'light' : 'dark');
        syncIcons();
      });
    }
  })();

  /* ---------- header search ---------- */
  var searchToggle = document.getElementById('pp-search-toggle');
  var searchForm = document.getElementById('pp-search-form');
  if (searchToggle && searchForm) {
    searchToggle.addEventListener('click', function () {
      var hidden = searchForm.classList.toggle('hidden');
      searchForm.classList.toggle('flex', !hidden);
      if (!hidden) {
        var input = searchForm.querySelector('input[name="s"]');
        if (input) input.focus();
      }
    });
  }

  /* ---------- mobile grid toggle (remembered) ---------- */
  (function cols() {
    var grid = document.getElementById('pp-grid');
    var buttons = document.querySelectorAll('.pp-cols');
    if (!grid || !buttons.length) return;

    function apply(n) {
      grid.classList.toggle('grid-cols-1', n === 1);
      grid.classList.toggle('grid-cols-2', n === 2);
      buttons.forEach(function (b) {
        var on = parseInt(b.getAttribute('data-cols'), 10) === n;
        b.classList.toggle('bg-primary', on);
        b.classList.toggle('text-primary-foreground', on);
        b.classList.toggle('shadow-md', on);
        b.classList.toggle('text-muted-foreground', !on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      store('pp-cols', String(n));
    }

    apply(parseInt(store('pp-cols') || '1', 10) === 2 ? 2 : 1);
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        apply(parseInt(b.getAttribute('data-cols'), 10));
      });
    });
  })();

  /* ---------- likes (cards + detail) ---------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-like]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var id = btn.getAttribute('data-like');
    var key = 'pp-liked-' + id;
    var liked = store(key) === '1';
    var dir = liked ? 'down' : 'up';
    store(key, liked ? '0' : '1');

    btn.querySelectorAll('.pp-like-icon').forEach(function (svg) {
      svg.setAttribute('fill', liked ? 'none' : 'currentColor');
    });
    var label = btn.querySelector('.pp-like-label');
    if (label) label.textContent = liked ? 'Like' : 'Liked';

    post('pp_like', { id: id, dir: dir }).then(function (res) {
      if (res && res.success) {
        document.querySelectorAll('[data-like="' + id + '"] .pp-like-count').forEach(function (n) {
          n.textContent = res.data.likes;
        });
      }
    });
  });

  /* mark already-liked buttons on load */
  document.querySelectorAll('[data-like]').forEach(function (btn) {
    if (store('pp-liked-' + btn.getAttribute('data-like')) === '1') {
      btn.querySelectorAll('.pp-like-icon').forEach(function (svg) {
        svg.setAttribute('fill', 'currentColor');
      });
      var label = btn.querySelector('.pp-like-label');
      if (label) label.textContent = 'Liked';
    }
  });

  /* ---------- copy prompt ---------- */
  document.querySelectorAll('.pp-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.glass-card');
      var p = card && card.querySelector('[data-prompt-text]');
      var text = p ? p.textContent : '';
      if (!text) return;
      navigator.clipboard
        .writeText(text)
        .then(function () {
          var label = btn.querySelector('.pp-copy-label');
          if (label) {
            label.textContent = 'Copied';
            setTimeout(function () {
              label.textContent = 'Copy';
            }, 1600);
          }
          toast(t.copied || 'Prompt copied to clipboard');
          post('pp_copy', { id: btn.getAttribute('data-id') });
        })
        .catch(function () {
          toast(t.copyErr || 'Could not copy');
        });
    });
  });

  /* ---------- copy link / UPI ---------- */
  var copyLink = document.getElementById('pp-copy-link');
  if (copyLink) {
    copyLink.addEventListener('click', function () {
      navigator.clipboard.writeText(copyLink.getAttribute('data-url') || location.href).then(function () {
        toast(t.linked || 'Link copied');
      });
    });
  }
  var copyUpi = document.getElementById('pp-copy-upi');
  if (copyUpi) {
    copyUpi.addEventListener('click', function () {
      navigator.clipboard.writeText(copyUpi.getAttribute('data-upi') || '').then(function () {
        toast(t.linked || 'Copied');
      });
    });
  }

  /* ---------- save ---------- */
  document.querySelectorAll('.pp-save').forEach(function (btn) {
    var id = btn.getAttribute('data-id');
    var key = 'pp-saved-' + id;
    function paint(saved) {
      btn.classList.toggle('border-primary/40', saved);
      btn.classList.toggle('bg-primary/10', saved);
      btn.classList.toggle('text-primary', saved);
      var label = btn.querySelector('.pp-save-label');
      if (label) label.textContent = saved ? 'Saved' : 'Save';
    }
    paint(store(key) === '1');
    btn.addEventListener('click', function () {
      var saved = store(key) === '1';
      store(key, saved ? '0' : '1');
      paint(!saved);
      toast(saved ? t.unsaved || 'Removed from saved' : t.saved || 'Saved to your collection');
      post('pp_save', { id: id, dir: saved ? 'down' : 'up' });
    });
  });

  /* ---------- gallery thumbs ---------- */
  (function gallery() {
    var main = document.getElementById('pp-main-image');
    var thumbs = document.querySelectorAll('.pp-thumb');
    if (!main || !thumbs.length) return;
    var counter = document.getElementById('pp-image-counter');
    var download = document.getElementById('pp-main-download');
    var zoom = document.querySelector('.pp-zoom');

    thumbs.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        var src = btn.getAttribute('data-src');
        main.src = src;
        if (download) download.href = src;
        if (zoom) zoom.setAttribute('data-src', src);
        if (counter) counter.textContent = i + 1 + '/' + thumbs.length;
        thumbs.forEach(function (b) {
          b.classList.remove('border-primary', 'ring-2', 'ring-primary/40');
          b.classList.add('border-white/10');
        });
        btn.classList.remove('border-white/10');
        btn.classList.add('border-primary', 'ring-2', 'ring-primary/40');
      });
    });
  })();

  /* ---------- lightbox ---------- */
  (function lightbox() {
    var box = document.getElementById('pp-lightbox');
    if (!box) return;
    var img = box.querySelector('img');
    var dl = box.querySelector('[data-lightbox-download]');

    function open(src) {
      img.src = src;
      if (dl) dl.href = src;
      box.classList.remove('hidden');
      box.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      box.classList.add('hidden');
      box.classList.remove('flex');
      document.body.style.overflow = '';
    }

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.pp-zoom');
      if (trigger) {
        e.preventDefault();
        open(trigger.getAttribute('data-src'));
      }
    });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.closest('[data-lightbox-close]')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  })();

  /* ---------- star rating ---------- */
  (function rating() {
    var box = document.getElementById('pp-rating');
    if (!box) return;
    var id = box.getAttribute('data-id');
    var average = parseFloat(box.getAttribute('data-average')) || 0;
    var stars = box.querySelectorAll('.pp-star');
    var label = document.getElementById('pp-rating-label');
    var mine = parseInt(store('pp-rating-' + id) || '0', 10);

    function paint(n) {
      stars.forEach(function (b, i) {
        var svg = b.querySelector('svg');
        if (!svg) return;
        svg.classList.toggle('text-amber-500', i < n);
        svg.classList.toggle('text-muted-foreground/40', i >= n);
      });
    }
    paint(mine || Math.round(average));
    if (mine && label) label.textContent = 'Your rating: ' + mine + '/5';

    stars.forEach(function (b) {
      var n = parseInt(b.getAttribute('data-stars'), 10);
      b.addEventListener('mouseenter', function () {
        paint(n);
      });
      b.addEventListener('mouseleave', function () {
        paint(mine || Math.round(average));
      });
      b.addEventListener('click', function () {
        mine = n;
        store('pp-rating-' + id, String(n));
        paint(n);
        post('pp_rate', { id: id, stars: n }).then(function (res) {
          if (res && res.success) {
            average = parseFloat(res.data.rating);
            var v = document.getElementById('pp-rating-value');
            if (v) v.textContent = average.toFixed(1);
            if (label) label.textContent = 'Your rating: ' + n + '/5';
            toast(t.thanks || 'Thanks for rating!');
          }
        });
      });
    });
  })();

  /* ---------- scroll reveal ---------- */
  (function reveal() {
    var items = document.querySelectorAll('.pp-reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (n) {
        n.classList.add('is-in');
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    items.forEach(function (n) {
      io.observe(n);
    });
  })();

  /* ---------- route progress bar on navigation ---------- */
  (function progress() {
    var bar = document.getElementById('pp-progress');
    if (!bar) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || href.indexOf('javascript:') === 0) return;
      if (a.hostname && a.hostname !== location.hostname) return;
      bar.classList.remove('hidden');
    });
    window.addEventListener('pageshow', function () {
      bar.classList.add('hidden');
    });
  })();
})();
