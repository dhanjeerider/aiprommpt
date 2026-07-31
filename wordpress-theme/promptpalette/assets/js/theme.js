/* global PP */
(function () {
  'use strict';

  var d = document;

  function on(sel, evt, fn) {
    d.addEventListener(evt, function (e) {
      var t = e.target.closest(sel);
      if (t) fn(e, t);
    });
  }

  /* Header toggles */
  var searchBtn = d.getElementById('pp-search-toggle');
  var searchPanel = d.getElementById('pp-search-panel');
  var menuBtn = d.getElementById('pp-menu-toggle');
  var menuPanel = d.getElementById('pp-mobile-menu');

  if (searchBtn && searchPanel) {
    searchBtn.addEventListener('click', function () {
      searchPanel.classList.toggle('open');
      var input = searchPanel.querySelector('input');
      if (searchPanel.classList.contains('open') && input) input.focus();
    });
  }
  if (menuBtn && menuPanel) {
    menuBtn.addEventListener('click', function () {
      menuPanel.classList.toggle('open');
    });
  }

  /* Route progress on navigation */
  var bar = d.getElementById('route-progress');
  on('a[href]', 'click', function (e, a) {
    if (!bar) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    if (a.getAttribute('href').charAt(0) === '#') return;
    if (a.host !== window.location.host) return;
    bar.classList.add('on');
  });
  window.addEventListener('pageshow', function () {
    if (bar) bar.classList.remove('on');
  });

  /* Like buttons */
  var LIKED_KEY = 'pp_liked';
  function likedSet() {
    try {
      return JSON.parse(localStorage.getItem(LIKED_KEY) || '{}');
    } catch (err) {
      return {};
    }
  }
  function saveLiked(map) {
    try {
      localStorage.setItem(LIKED_KEY, JSON.stringify(map));
    } catch (err) {}
  }
  var liked = likedSet();
  d.querySelectorAll('[data-like]').forEach(function (btn) {
    if (liked[btn.getAttribute('data-like')]) btn.classList.add('liked');
  });
  on('[data-like]', 'click', function (e, btn) {
    e.preventDefault();
    var id = btn.getAttribute('data-like');
    var isLiked = btn.classList.toggle('liked');
    liked = likedSet();
    if (isLiked) liked[id] = 1;
    else delete liked[id];
    saveLiked(liked);
    var body = new URLSearchParams({ action: 'pp_like', id: id, dir: isLiked ? 'up' : 'down', nonce: PP.nonce });
    fetch(PP.ajax, { method: 'POST', body: body })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        var span = btn.querySelector('span');
        if (res && res.success && span) span.textContent = res.data.likes;
      })
      .catch(function () {});
  });

  /* Copy prompt */
  on('[data-copy]', 'click', function (e, btn) {
    e.preventDefault();
    var target = d.getElementById(btn.getAttribute('data-copy'));
    if (!target) return;
    var text = target.innerText;
    var done = function () {
      var label = btn.querySelector('.label');
      var old = label ? label.textContent : '';
      if (label) label.textContent = 'Copied!';
      setTimeout(function () { if (label) label.textContent = old; }, 1600);
      var id = btn.getAttribute('data-post');
      if (id) {
        fetch(PP.ajax, { method: 'POST', body: new URLSearchParams({ action: 'pp_copy', id: id, nonce: PP.nonce }) }).catch(function () {});
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done);
    } else {
      var ta = d.createElement('textarea');
      ta.value = text;
      d.body.appendChild(ta);
      ta.select();
      d.execCommand('copy');
      d.body.removeChild(ta);
      done();
    }
  });

  /* Gallery thumbs */
  var mainImg = d.getElementById('pp-main-image');
  var counter = d.getElementById('pp-image-counter');
  var mainDl = d.getElementById('pp-main-download');
  on('[data-thumb]', 'click', function (e, btn) {
    if (!mainImg) return;
    var src = btn.getAttribute('data-thumb');
    mainImg.src = src;
    if (mainDl) mainDl.href = src;
    if (counter) counter.textContent = btn.getAttribute('data-index') + '/' + counter.getAttribute('data-total');
    d.querySelectorAll('[data-thumb]').forEach(function (t) { t.classList.remove('active'); });
    btn.classList.add('active');
  });

  /* Lightbox */
  var lb = d.getElementById('pp-lightbox');
  on('[data-lightbox]', 'click', function (e, el) {
    if (!lb) return;
    e.preventDefault();
    var src = el.getAttribute('data-lightbox') || (el.querySelector('img') && el.querySelector('img').src);
    if (el.id === 'pp-main-image' || el.querySelector('#pp-main-image')) src = mainImg ? mainImg.src : src;
    lb.querySelector('img').src = src;
    lb.querySelector('.dl').href = src;
    lb.classList.add('open');
  });
  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.closest('[data-lightbox-close]')) lb.classList.remove('open');
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') lb.classList.remove('open');
    });
  }

  /* Mobile grid toggle */
  var grid = d.getElementById('pp-grid');
  var savedCols = localStorage.getItem('pp_cols');
  if (grid && savedCols === '2') grid.classList.add('cols-2');
  d.querySelectorAll('[data-cols]').forEach(function (b) {
    if (b.getAttribute('data-cols') === (savedCols || '1')) b.classList.add('active');
  });
  on('[data-cols]', 'click', function (e, btn) {
    if (!grid) return;
    var cols = btn.getAttribute('data-cols');
    grid.classList.toggle('cols-2', cols === '2');
    localStorage.setItem('pp_cols', cols);
    d.querySelectorAll('[data-cols]').forEach(function (b) { b.classList.toggle('active', b === btn); });
  });

  /* Star rating */
  var stars = d.getElementById('pp-stars');
  if (stars) {
    var postId = stars.getAttribute('data-post');
    var storedKey = 'pp_rating_' + postId;
    var mine = localStorage.getItem(storedKey);
    var paint = function (n) {
      stars.querySelectorAll('button').forEach(function (b, i) { b.classList.toggle('on', i < n); });
    };
    if (mine) paint(parseInt(mine, 10));
    stars.querySelectorAll('button').forEach(function (b, i) {
      b.addEventListener('mouseenter', function () { paint(i + 1); });
      b.addEventListener('mouseleave', function () { paint(parseInt(localStorage.getItem(storedKey) || stars.getAttribute('data-average'), 10)); });
      b.addEventListener('click', function () {
        if (localStorage.getItem(storedKey)) return;
        localStorage.setItem(storedKey, String(i + 1));
        paint(i + 1);
        fetch(PP.ajax, { method: 'POST', body: new URLSearchParams({ action: 'pp_rate', id: postId, stars: String(i + 1), nonce: PP.nonce }) })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            var out = d.getElementById('pp-rating-out');
            if (res && res.success && out) out.textContent = 'Your rating: ' + (i + 1) + '/5 · avg ' + res.data.rating;
          })
          .catch(function () {});
      });
    });
  }
})();
