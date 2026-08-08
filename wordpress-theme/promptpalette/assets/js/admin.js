/**
 * PromptPalette admin: media pickers, prompt repeater, footer-link repeater,
 * settings autosave hints and the sitemap importer runner.
 */
(function ($) {
  'use strict';

  var cfg = window.PPAdmin || { ajax: '', nonce: '' };

  /* ---------- media picker (settings + prompt rows) ---------- */
  $(document).on('click', '.pp-media-pick', function (e) {
    e.preventDefault();
    var input = $(this).closest('.pp-media, .pp-prompt-row, .pp-field, p, div').find('.pp-media-input').first();
    if (!input.length) return;
    var frame = wp.media({ title: 'Select image', multiple: false, library: { type: 'image' } });
    frame.on('select', function () {
      var att = frame.state().get('selection').first().toJSON();
      input.val(att.url).trigger('change');
      var prev = input.closest('.pp-media, .pp-prompt-row, .pp-field').find('.pp-media-preview').first();
      if (prev.length) prev.attr('src', att.url).show();
    });
    frame.open();
  });

  $(document).on('click', '.pp-media-clear', function (e) {
    e.preventDefault();
    var wrap = $(this).closest('.pp-media, .pp-prompt-row, .pp-field');
    wrap.find('.pp-media-input').first().val('').trigger('change');
    wrap.find('.pp-media-preview').first().hide();
  });

  /* ---------- prompt repeater ---------- */
  $(document).on('click', '#pp-add-prompt', function (e) {
    e.preventDefault();
    var rows = $('#pp-prompt-rows');
    var n = rows.children('.pp-prompt-row').length + 1;
    rows.append(
      '<div class="pp-prompt-row" style="border:1px solid #dcdcde;border-radius:10px;padding:12px;margin-bottom:12px;background:#fff">' +
        '<strong>Prompt ' + n + '</strong>' +
        '<textarea name="pp_prompt_text[]" rows="6" style="width:100%;margin-top:6px" placeholder="Full copy-ready prompt text…"></textarea>' +
        '<div style="margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
        '<input type="text" class="pp-media-input" name="pp_prompt_image[]" value="" placeholder="Demo image URL for this prompt" style="flex:1;min-width:240px" />' +
        '<button type="button" class="button pp-media-pick">Choose image</button>' +
        '<button type="button" class="button pp-media-clear">Remove</button>' +
        '<button type="button" class="button pp-remove-prompt">Delete prompt</button>' +
        '</div></div>'
    );
  });

  $(document).on('click', '.pp-remove-prompt', function (e) {
    e.preventDefault();
    var rows = $('#pp-prompt-rows');
    if (rows.children('.pp-prompt-row').length < 2) {
      $(this).closest('.pp-prompt-row').find('textarea, input').val('');
      return;
    }
    $(this).closest('.pp-prompt-row').remove();
    rows.children('.pp-prompt-row').each(function (i) {
      $(this).children('strong').first().text('Prompt ' + (i + 1));
    });
  });

  /* ---------- footer / nav link repeater ---------- */
  $(document).on('click', '#pp-add-link', function (e) {
    e.preventDefault();
    $('#pp-links').append(
      '<div class="pp-row">' +
        '<input type="text" name="link_label[]" placeholder="Label" />' +
        '<input type="text" name="link_href[]" placeholder="/about or https://…" />' +
        '<input type="text" name="link_group[]" placeholder="Explore" />' +
        '<button type="button" class="button pp-remove-row">×</button>' +
        '</div>'
    );
  });

  $(document).on('click', '.pp-remove-row', function (e) {
    e.preventDefault();
    $(this).closest('.pp-row').remove();
  });

  /* ---------- sitemap importer ---------- */
  var stop = false;

  function log(msg) {
    var box = document.getElementById('pp-import-log');
    if (!box) return;
    if (box.dataset.started !== '1') {
      box.textContent = '';
      box.dataset.started = '1';
    }
    var line = document.createElement('div');
    line.textContent = msg;
    box.appendChild(line);
    box.scrollTop = box.scrollHeight;
  }

  function setCount(key, value) {
    var el = document.getElementById('pp-count-' + key);
    if (el) el.textContent = value;
  }

  $(document).on('click', '#pp-import-stop', function (e) {
    e.preventDefault();
    stop = true;
    log('Stopping…');
  });

  $(document).on('click', '#pp-import-start', function (e) {
    e.preventDefault();
    stop = false;
    var sitemap = $('#pp-sitemap').val();
    if (!sitemap) return;
    var counts = { total: 0, done: 0, added: 0, skipped: 0, failed: 0 };
    Object.keys(counts).forEach(function (k) {
      setCount(k, 0);
    });
    log('Fetching sitemap…');

    $.post(cfg.ajax, { action: 'pp_importer_urls', nonce: cfg.nonce, sitemap: sitemap })
      .done(function (res) {
        if (!res || !res.success) {
          log('Could not read the sitemap.');
          return;
        }
        var urls = res.data.urls || [];
        counts.total = urls.length;
        setCount('total', counts.total);
        log('Found ' + counts.total + ' URLs. Importing…');

        function next(i) {
          if (stop || i >= urls.length) {
            log('Finished — added ' + counts.added + ', skipped ' + counts.skipped + ', failed ' + counts.failed + '.');
            return;
          }
          $.post(cfg.ajax, { action: 'pp_importer_one', nonce: cfg.nonce, url: urls[i] })
            .done(function (r) {
              var status = r && r.success ? r.data.status : 'failed';
              var message = r && r.success ? r.data.message : 'request failed';
              counts[status] = (counts[status] || 0) + 1;
              counts.done += 1;
              setCount(status, counts[status]);
              setCount('done', counts.done);
              log((status === 'added' ? '✓ ' : status === 'skipped' ? '· ' : '× ') + message);
            })
            .fail(function () {
              counts.failed += 1;
              counts.done += 1;
              setCount('failed', counts.failed);
              setCount('done', counts.done);
              log('× ' + urls[i]);
            })
            .always(function () {
              next(i + 1);
            });
        }
        next(0);
      })
      .fail(function () {
        log('Sitemap request failed.');
      });
  });
})(jQuery);
