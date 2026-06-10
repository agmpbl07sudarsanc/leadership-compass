/* ════════════════════════════════════════════════════════════════
   The Leadership Compass — AI features layer
   Self-contained: injects its own UI. Pages only include this file.
   Features: smart search, article summarizer, text-to-speech,
   reading assistant chat, recommendations, social snippets.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Article index (used by search, recommendations, snippets) ── */
  // ROOT is '' on the home page, '../' inside pages/ and posts/.
  var ROOT = location.pathname.match(/\/(pages|posts)\//) ? '../' : '';

  var ARTICLES = [
    {
      url: 'posts/why-the-best-leaders-unlearn.html',
      title: 'Why the Best Leaders Are Unlearning Everything They Know',
      tag: 'Leadership',
      excerpt: 'The leadership playbook from 2015 is broken. The leaders who thrive are the ones brave enough to start over.',
      keywords: 'leadership unlearning change management AI distributed teams generations assumptions humility mental models playbook adaptability outcomes culture values',
      quote: 'What am I certain about that might be wrong?',
      linkedin: 'The leadership playbook from 2015 is broken.\n\nAI, distributed teams, five generations in one workplace - and most leaders are still running the old playbook.\n\nThe best leaders I know treat their assumptions as hypotheses, not truths.\n\nNew essay on The Leadership Compass.\n\n#Leadership #FutureOfWork #HR'
    },
    {
      url: 'posts/the-hr-tech-stack-is-a-lie.html',
      title: 'The HR Tech Stack Is a Lie (And What to Build Instead)',
      tag: 'HR Strategy',
      excerpt: 'Sixteen tools, zero integration, and a spreadsheet holding it all together. The problem is architecture, not technology.',
      keywords: 'hr technology tech stack hris ats integration data architecture systems of record ipaas middleware ai automation vendors tools consolidation roadmap people analytics',
      quote: 'Your stack doesn’t need another logo. It needs a blueprint.',
      linkedin: '16+ HR tools in the average enterprise. And the source of truth is still a spreadsheet.\n\nThe problem isn’t technology - it’s architecture.\n\nMy three-phase roadmap: Consolidate, Connect, then (and only then) Augment with AI.\n\nNew essay on The Leadership Compass.\n\n#HRTech #PeopleAnalytics #CHRO'
    },
    {
      url: 'posts/psychological-safety-is-not-about-being-nice.html',
      title: 'Psychological Safety Is Not About Being Nice',
      tag: 'Culture',
      excerpt: 'The most psychologically safe teams argue more, not less. What the research actually found.',
      keywords: 'psychological safety culture teams trust conflict debate feedback google project aristotle accountability standards learning dissent harmony niceness',
      quote: 'Psychological safety isn’t the absence of conflict. It’s the absence of fear about what conflict will cost you.',
      linkedin: 'Somewhere along the way, "psychological safety" got translated as "be nice."\n\nThat’s almost exactly backwards.\n\nThe most psychologically safe teams argue MORE in the room, not less. Silence isn’t harmony.\n\nNew essay on The Leadership Compass.\n\n#Culture #PsychologicalSafety #Leadership'
    }
  ];

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  /* ════════════════ 1. SMART SEARCH (all pages) ════════════════ */

  function initSearch() {
    // Add a search button to the navbar, before the Subscribe CTA.
    var links = document.querySelector('.navbar-links');
    if (links) {
      var li = el('<li><button class="search-trigger" aria-label="Search articles (press /)" title="Search ( / )">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="17" height="17"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '</button></li>');
      var cta = links.querySelector('.navbar-cta');
      links.insertBefore(li, cta ? cta.closest('li') : null);
      li.querySelector('button').addEventListener('click', openSearch);
    }

    // Overlay
    var overlay = el(
      '<div class="ai-search-overlay" role="dialog" aria-modal="true" aria-label="Search articles" hidden>' +
      '  <div class="ai-search-box">' +
      '    <div class="ai-search-row">' +
      '      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="20" height="20"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
      '      <input type="text" placeholder="Ask in plain language… e.g. “how do I fix our HR tools mess”" aria-label="Search query">' +
      '      <button class="ai-search-close" aria-label="Close search">ESC</button>' +
      '    </div>' +
      '    <div class="ai-search-results"></div>' +
      '  </div>' +
      '</div>');
    document.body.appendChild(overlay);

    var input = overlay.querySelector('input');
    var results = overlay.querySelector('.ai-search-results');

    function openSearch() {
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      renderResults('');
      input.focus();
    }
    function closeSearch() {
      overlay.hidden = true;
      document.body.style.overflow = '';
      input.value = '';
    }

    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
    overlay.querySelector('.ai-search-close').addEventListener('click', closeSearch);
    input.addEventListener('input', function () { renderResults(input.value); });

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !e.target.matches('input, textarea')) { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape' && !overlay.hidden) closeSearch();
    });

    // Natural-language-friendly scoring: every meaningful word in the
    // query votes across title, tag, excerpt, and a keyword bag, so
    // "how do I fix our HR tools mess" still lands on the HR tech post.
    var STOP = /^(the|a|an|and|or|of|in|on|for|to|is|are|was|were|be|how|do|does|did|i|we|our|my|me|you|your|it|its|this|that|with|about|what|why|when|who|can|should|article|articles|post|posts)$/;

    function score(article, words) {
      var hay = (article.title + ' ' + article.tag + ' ' + article.excerpt + ' ' + article.keywords).toLowerCase();
      var s = 0;
      words.forEach(function (w) {
        if (hay.indexOf(w) !== -1) s += 2;
        else if (w.length > 4 && hay.indexOf(w.slice(0, -1)) !== -1) s += 1; // crude stemming
      });
      return s;
    }

    function renderResults(q) {
      var words = q.toLowerCase().split(/\W+/).filter(function (w) { return w && !STOP.test(w); });
      var list = ARTICLES;
      if (words.length) {
        list = ARTICLES.map(function (a) { return { a: a, s: score(a, words) }; })
          .filter(function (x) { return x.s > 0; })
          .sort(function (x, y) { return y.s - x.s; })
          .map(function (x) { return x.a; });
      }
      if (!list.length) {
        results.innerHTML = '<p class="ai-search-hint">No matches. Try different words — e.g. <strong>“psychological safety”</strong> or <strong>“HR tools”</strong>.</p>';
        return;
      }
      results.innerHTML = list.map(function (a) {
        return '<a class="ai-search-item" href="' + ROOT + a.url + '">' +
          '<span class="ai-search-tag">' + esc(a.tag) + '</span>' +
          '<strong>' + esc(a.title) + '</strong>' +
          '<span class="ai-search-excerpt">' + esc(a.excerpt) + '</span></a>';
      }).join('');
    }
  }

  /* ════════════ 2–6. POST-PAGE FEATURES ════════════ */

  function currentArticle() {
    var path = location.pathname.split('/').pop();
    for (var i = 0; i < ARTICLES.length; i++) {
      if (ARTICLES[i].url.indexOf(path) !== -1) return ARTICLES[i];
    }
    return null;
  }

  function initPostFeatures() {
    var body = document.querySelector('.post-body');
    if (!body) return;
    var article = currentArticle();
    var header = document.querySelector('.post-header');

    /* ── Toolbar ── */
    var bar = el(
      '<div class="ai-toolbar" role="group" aria-label="Article tools">' +
      '  <button data-act="summary"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="15" height="15"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg> Summarize</button>' +
      '  <button data-act="listen"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="15" height="15"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Listen</button>' +
      '  <button data-act="share"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="15" height="15"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> Share snippet</button>' +
      '</div>');
    (header || body).insertAdjacentElement(header ? 'afterend' : 'beforebegin', bar);

    /* ── 2. Summarizer: extract the load-bearing sentences ── */
    var panel = el('<div class="ai-summary" hidden><h4>TL;DR</h4><ul></ul></div>');
    bar.insertAdjacentElement('afterend', panel);

    function buildSummary() {
      var bullets = [];
      // The first paragraph after each h2 usually carries the section's thesis.
      body.querySelectorAll('h2').forEach(function (h) {
        var p = h.nextElementSibling;
        while (p && p.tagName !== 'P') p = p.nextElementSibling;
        if (p) {
          var m = p.textContent.trim().match(/^.+?[.!?](?=\s|$)/);
          var sentence = m ? m[0] : p.textContent.trim();
          if (sentence && sentence.length > 40) bullets.push(sentence);
        }
      });
      // Fall back to leading paragraphs if the post has no h2 structure.
      if (bullets.length < 3) {
        body.querySelectorAll(':scope > p').forEach(function (p) {
          if (bullets.length >= 3) return;
          var s = p.textContent.trim();
          var m2 = s.match(/^.+?[.!?](?=\s|$)/);
          if (s.length > 60) bullets.push(m2 ? m2[0] : s);
        });
      }
      return bullets.slice(0, 3);
    }

    bar.querySelector('[data-act="summary"]').addEventListener('click', function () {
      if (panel.hidden) {
        if (!panel.querySelector('li')) {
          panel.querySelector('ul').innerHTML = buildSummary()
            .map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('');
        }
        panel.hidden = false;
        this.classList.add('active');
      } else {
        panel.hidden = true;
        this.classList.remove('active');
      }
    });

    /* ── 3. Text-to-speech ── */
    var listenBtn = bar.querySelector('[data-act="listen"]');
    var speaking = false;
    listenBtn.addEventListener('click', function () {
      if (!('speechSynthesis' in window)) {
        listenBtn.textContent = 'Not supported in this browser';
        return;
      }
      if (speaking) {
        speechSynthesis.cancel();
        speaking = false;
        listenBtn.classList.remove('active');
        return;
      }
      var u = new SpeechSynthesisUtterance(body.innerText);
      u.rate = 0.95;
      u.onend = function () { speaking = false; listenBtn.classList.remove('active'); };
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
      speaking = true;
      listenBtn.classList.add('active');
    });
    window.addEventListener('beforeunload', function () { speechSynthesis && speechSynthesis.cancel(); });

    /* ── 4. Social snippet modal ── */
    if (article) {
      var modal = el(
        '<div class="ai-modal" role="dialog" aria-modal="true" aria-label="Share snippet" hidden>' +
        '  <div class="ai-modal-box">' +
        '    <h3>Share this article</h3>' +
        '    <div class="ai-quote-card"><p>“' + esc(article.quote) + '”</p><span>— The Leadership Compass by Sudarshan</span></div>' +
        '    <textarea class="ai-linkedin-text" rows="7" aria-label="LinkedIn post text" readonly>' + esc(article.linkedin) + '</textarea>' +
        '    <div class="ai-modal-actions">' +
        '      <button data-copy="linkedin">Copy LinkedIn post</button>' +
        '      <button data-copy="quote">Copy pull quote</button>' +
        '      <button data-copy="close">Close</button>' +
        '    </div>' +
        '  </div>' +
        '</div>');
      document.body.appendChild(modal);

      bar.querySelector('[data-act="share"]').addEventListener('click', function () { modal.hidden = false; });
      modal.addEventListener('click', function (e) {
        if (e.target === modal || e.target.dataset.copy === 'close') { modal.hidden = true; return; }
        var what = e.target.dataset.copy;
        if (!what) return;
        var text = what === 'linkedin' ? article.linkedin : '“' + article.quote + '” — The Leadership Compass by Sudarshan';
        navigator.clipboard.writeText(text).then(function () {
          var prev = e.target.textContent;
          e.target.textContent = 'Copied ✓';
          setTimeout(function () { e.target.textContent = prev; }, 1400);
        });
      });
    }

    /* ── 5. Recommendations ── */
    if (article) {
      var others = ARTICLES.filter(function (a) { return a !== article; });
      var rec = el(
        '<section class="ai-recommend" aria-label="Recommended articles">' +
        '  <h2>Readers also read</h2>' +
        '  <div class="ai-recommend-grid">' +
        others.map(function (a) {
          return '<a class="ai-recommend-card" href="' + ROOT + a.url + '">' +
            '<span class="ai-search-tag">' + esc(a.tag) + '</span>' +
            '<strong>' + esc(a.title) + '</strong>' +
            '<span class="ai-search-excerpt">' + esc(a.excerpt) + '</span></a>';
        }).join('') +
        '  </div>' +
        '</section>');
      var newsletter = document.querySelector('.newsletter-section');
      (newsletter || document.querySelector('footer')).insertAdjacentElement('beforebegin', rec);
    }

    /* ── 6. Reading assistant chat (grounded in this article) ── */
    var paragraphs = Array.prototype.map.call(
      body.querySelectorAll('p, li, blockquote'),
      function (n) { return n.textContent.trim(); }
    ).filter(function (t) { return t.length > 50; });

    function answer(q) {
      var words = q.toLowerCase().split(/\W+/).filter(function (w) { return w.length > 3; });
      if (!words.length) return 'Could you say a bit more? Ask me about any idea in this article.';
      var best = null, bestScore = 0;
      paragraphs.forEach(function (p) {
        var lp = p.toLowerCase(), s = 0;
        words.forEach(function (w) { if (lp.indexOf(w) !== -1) s++; });
        if (s > bestScore) { bestScore = s; best = p; }
      });
      if (best && bestScore > 0) {
        return 'Here’s the most relevant passage from the article:\n\n“' + best + '”';
      }
      return 'I couldn’t find that topic in this article. It focuses on: ' +
        (article ? article.excerpt : 'the themes in the text above') + ' — try asking about one of those ideas.';
    }

    var chat = el(
      '<div class="ai-chat">' +
      '  <div class="ai-chat-panel" hidden>' +
      '    <div class="ai-chat-head"><strong>Ask about this article</strong><button class="ai-chat-x" aria-label="Close">×</button></div>' +
      '    <div class="ai-chat-log"><div class="ai-msg bot">Hi! Ask me anything about this article and I’ll point you to the relevant part.</div></div>' +
      '    <form class="ai-chat-form"><input type="text" placeholder="e.g. what should I do first?" aria-label="Your question"><button type="submit" aria-label="Send">➤</button></form>' +
      '  </div>' +
      '  <button class="ai-chat-fab" aria-label="Open reading assistant">' +
      '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="22" height="22"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
      '  </button>' +
      '</div>');
    document.body.appendChild(chat);

    var chatPanel = chat.querySelector('.ai-chat-panel');
    var log = chat.querySelector('.ai-chat-log');
    chat.querySelector('.ai-chat-fab').addEventListener('click', function () { chatPanel.hidden = !chatPanel.hidden; if (!chatPanel.hidden) chat.querySelector('input').focus(); });
    chat.querySelector('.ai-chat-x').addEventListener('click', function () { chatPanel.hidden = true; });
    chat.querySelector('.ai-chat-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var input = this.querySelector('input');
      var q = input.value.trim();
      if (!q) return;
      log.insertAdjacentHTML('beforeend', '<div class="ai-msg user">' + esc(q) + '</div>');
      input.value = '';
      setTimeout(function () {
        log.insertAdjacentHTML('beforeend', '<div class="ai-msg bot">' + esc(answer(q)).replace(/\n/g, '<br>') + '</div>');
        log.scrollTop = log.scrollHeight;
      }, 400);
      log.scrollTop = log.scrollHeight;
    });
  }

  /* ── Boot ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  function boot() {
    initSearch();
    initPostFeatures();
  }
})();
