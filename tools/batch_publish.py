"""Batch publisher: given post dicts, creates the post page, thumbnail SVG,
blog card, feed item, and ARTICLES entry. PNG rendering happens separately
(qlmanage). Run from the repo root."""
import re

BASE = 'https://leadershipcompass.co.in'
F = 'Verdana, Geneva, sans-serif'

HEAD = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#18181B"/>
      <stop offset="1" stop-color="#26262C"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <g fill="#D97706" opacity="0.07">
    <circle cx="60" cy="60" r="3"/><circle cx="160" cy="120" r="3"/><circle cx="80" cy="220" r="3"/>
    <circle cx="200" cy="40" r="3"/><circle cx="280" cy="180" r="3"/><circle cx="120" cy="340" r="3"/>
    <circle cx="1080" cy="600" r="3"/><circle cx="1140" cy="520" r="3"/><circle cx="1020" cy="560" r="3"/>
  </g>
  <g transform="translate(64,56) scale(0.62)">
    <circle cx="50" cy="50" r="46" fill="none" stroke="#F4F4F5" stroke-width="5"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke="#D97706" stroke-width="2"/>
    <polygon points="50,50 50,10 44,54" fill="#D97706"/>
    <polygon points="50,50 50,10 56,54" fill="#F59E0B"/>
    <polygon points="50,50 50,88 44,54" fill="#F4F4F5" opacity="0.5"/>
    <polygon points="50,50 50,88 56,54" fill="#F4F4F5" opacity="0.3"/>
    <circle cx="50" cy="50" r="4" fill="#F4F4F5"/>
  </g>
  <text x="140" y="86" font-family="Georgia, serif" font-size="22" fill="#9D9DA6" letter-spacing="2">THE LEADERSHIP COMPASS</text>
'''

# Rotating illustration motifs so cards vary within a category
MOTIFS = [
 # rising bars
 '''<g stroke-linecap="round"><line x1="830" y1="560" x2="830" y2="500" stroke="#3F3F46" stroke-width="16"/><line x1="890" y1="560" x2="890" y2="470" stroke="#3F3F46" stroke-width="16"/><line x1="950" y1="560" x2="950" y2="430" stroke="#9D9DA6" stroke-width="16"/><line x1="1010" y1="560" x2="1010" y2="390" stroke="#D97706" stroke-width="16"/><circle cx="1010" cy="370" r="10" fill="#F59E0B"/></g>''',
 # target
 '''<circle cx="960" cy="480" r="100" fill="none" stroke="#3F3F46" stroke-width="6"/><circle cx="960" cy="480" r="64" fill="none" stroke="#9D9DA6" stroke-width="6"/><circle cx="960" cy="480" r="28" fill="none" stroke="#D97706" stroke-width="7"/><circle cx="960" cy="480" r="9" fill="#F59E0B"/>''',
 # branching path
 '''<g fill="none" stroke-linecap="round"><path d="M 810 560 C 880 540, 900 480, 960 460" stroke="#3F3F46" stroke-width="8"/><path d="M 960 460 C 1010 445, 1040 400, 1100 380" stroke="#D97706" stroke-width="8"/><path d="M 960 460 C 1020 470, 1060 510, 1110 540" stroke="#3F3F46" stroke-width="8" stroke-dasharray="2 22"/></g><circle cx="960" cy="460" r="11" fill="#F59E0B"/><circle cx="1100" cy="380" r="9" fill="#D97706"/>''',
 # balance
 '''<g stroke-linecap="round"><line x1="960" y1="400" x2="960" y2="560" stroke="#9D9DA6" stroke-width="7"/><line x1="850" y1="430" x2="1070" y2="410" stroke="#D97706" stroke-width="8"/><circle cx="850" cy="460" r="26" fill="none" stroke="#3F3F46" stroke-width="6"/><circle cx="1070" cy="440" r="26" fill="none" stroke="#F59E0B" stroke-width="7"/></g>''',
 # layered cards
 '''<rect x="850" y="500" width="240" height="36" rx="8" fill="none" stroke="#3F3F46" stroke-width="5"/><rect x="835" y="450" width="270" height="36" rx="8" fill="none" stroke="#3F3F46" stroke-width="5"/><rect x="820" y="382" width="300" height="54" rx="10" fill="#26262C" stroke="#D97706" stroke-width="7"/><line x1="845" y1="409" x2="1000" y2="409" stroke="#F59E0B" stroke-width="7" stroke-linecap="round"/>''',
 # network nodes
 '''<g stroke="#3F3F46" stroke-width="5"><line x1="850" y1="430" x2="970" y2="500"/><line x1="1090" y1="420" x2="970" y2="500"/><line x1="900" y1="580" x2="970" y2="500"/><line x1="1080" y1="560" x2="970" y2="500"/></g><circle cx="850" cy="430" r="16" fill="#3F3F46"/><circle cx="1090" cy="420" r="16" fill="#3F3F46"/><circle cx="900" cy="580" r="16" fill="#3F3F46"/><circle cx="1080" cy="560" r="16" fill="#3F3F46"/><circle cx="970" cy="500" r="22" fill="#D97706"/>''',
 # clock
 '''<circle cx="960" cy="480" r="95" fill="none" stroke="#3F3F46" stroke-width="7"/><line x1="960" y1="480" x2="960" y2="412" stroke="#D97706" stroke-width="8" stroke-linecap="round"/><line x1="960" y1="480" x2="1015" y2="505" stroke="#F59E0B" stroke-width="8" stroke-linecap="round"/><circle cx="960" cy="480" r="8" fill="#F4F4F5"/>''',
 # open book / document
 '''<path d="M 840 420 C 890 400, 940 400, 960 415 C 980 400, 1030 400, 1080 420 L 1080 560 C 1030 540, 980 540, 960 555 C 940 540, 890 540, 840 560 Z" fill="none" stroke="#9D9DA6" stroke-width="6"/><line x1="960" y1="415" x2="960" y2="555" stroke="#3F3F46" stroke-width="5"/><line x1="870" y1="455" x2="935" y2="448" stroke="#D97706" stroke-width="6" stroke-linecap="round"/><line x1="985" y1="448" x2="1050" y2="455" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>''',
]

HERO_OLD = '''      <div class="post-hero-image">
        <div class="image-placeholder">
          <div class="pattern"></div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
        </div>
      </div>'''


def thumb_svg(slug, w1, grey, amber, sub):
    t = f'  <text x="80" y="240" font-family="{F}" font-size="56" font-weight="bold" fill="#F4F4F5">{w1}</text>\n'
    if grey:
        t += f'  <text x="80" y="320" font-family="{F}" font-size="40" fill="#9D9DA6">{grey}<tspan font-size="56" font-weight="bold" fill="#D97706">{amber}</tspan></text>\n'
    else:
        t += f'  <text x="80" y="320" font-family="{F}" font-size="56" font-weight="bold" fill="#D97706">{amber}</text>\n'
    t += f'  <text x="80" y="385" font-family="{F}" font-size="24" fill="#C5C5CC">{sub}</text>\n'
    art = MOTIFS[hash(slug) % len(MOTIFS)]
    return HEAD + t + '  ' + art + '\n</svg>\n'


def publish(posts):
    tpl = open('posts/why-the-best-leaders-unlearn.html').read()
    # the template now has a real hero image; restore a placeholder marker
    tpl_hero = re.search(r'      <div class="post-hero-image">.*?</div>', tpl, re.S).group(0)

    blog = open('pages/blog.html').read()
    feed = open('feed.xml').read()
    js = open('js/features.js').read()

    cards, items, entries = '', '', ''
    for p in posts:
        slug = p['slug']
        # --- post page ---
        s = tpl
        s = re.sub(r'<title>.*?</title>', f"<title>{p['title']} - The Leadership Compass</title>", s, count=1)
        s = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{p["desc"]}">', s, count=1)
        s = re.sub(r'<span class="post-tag">[^<]*</span>', f'<span class="post-tag">{p["tag"]}</span>', s, count=1)
        s = re.sub(r'<h1>.*?</h1>', f"<h1>{p['title']}</h1>", s, count=1, flags=re.S)
        s = re.sub(r'<span>June 5, 2026</span>', f"<span>{p['date']}</span>", s, count=1)
        s = re.sub(r'<span>8 min read</span>', f"<span>{p['readtime']}</span>", s, count=1)
        s = s.replace(tpl_hero, f'''      <div class="post-hero-image">
        <img src="../images/posts/{slug}-thumb.png" alt="" width="1200" height="675" style="border-radius:16px">
      </div>''')
        # strip template og meta, then add this post's
        s = re.sub(r'  <meta property="og:[^"]*" content="[^"]*">\n', '', s)
        s = re.sub(r'  <meta name="twitter:card" content="[^"]*">\n', '', s)
        s = s.replace('</head>', f'''  <meta property="og:title" content="{p['title'].replace('"', '&quot;')}">
  <meta property="og:image" content="{BASE}/images/posts/{slug}-thumb.png">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
</head>''')
        start = s.index('<div class="post-body">') + len('<div class="post-body">')
        end = s.index('<div class="author-box">')
        s = s[:start] + '\n' + p['body'] + '\n\n        ' + s[end:]
        open(f'posts/{slug}.html', 'w').write(s)

        # --- thumbnail svg ---
        open(f'images/posts/{slug}-thumb.svg', 'w').write(
            thumb_svg(slug, p['w1'], p['grey'], p['amber'], p['sub']))

        # --- blog card ---
        cards += f'''      <article class="post-card" data-topic="{p['topic']}">
        <div class="post-card-image" aria-hidden="true"><img src="../images/posts/{slug}-thumb.png" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>
        <div class="post-card-body">
          <span class="post-card-tag">{p['tag']}</span>
          <h3><a href="../posts/{slug}.html">{p['title']}</a></h3>
          <p>{p['card']}</p>
          <div class="post-meta">
            <span>{p['date']}</span>
            <span class="divider" aria-hidden="true"></span>
            <span>{p['readtime']}</span>
          </div>
        </div>
      </article>

'''
        # --- feed item ---
        t = p['title'].replace("'", '&apos;').replace('&', '&amp;') if '&' in p['title'] and '&amp;' not in p['title'] else p['title'].replace("'", '&apos;')
        items += f'''
    <item>
      <title>{t}</title>
      <link>{BASE}/posts/{slug}.html</link>
      <guid>{BASE}/posts/{slug}.html</guid>
      <pubDate>{p['rssdate']}</pubDate>
      <description>{p['desc']}</description>
    </item>
'''
        # --- ARTICLES entry ---
        def j(x):
            return x.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')
        entries += f'''    {{
      url: 'posts/{slug}.html',
      title: '{j(p['title'])}',
      tag: '{p['tag']}',
      excerpt: '{j(p['card'])}',
      keywords: '{j(p['keywords'])}',
      quote: '{j(p['quote'])}',
      linkedin: '{j(p['linkedin'])}'
    }},
'''

    # append cards at end of blog grid
    idx = blog.rindex('</article>', 0, blog.index('</main>')) + len('</article>')
    blog = blog[:idx] + '\n\n' + cards.rstrip() + blog[idx:]
    open('pages/blog.html', 'w').write(blog)

    feed = feed.replace('  </channel>', items + '\n  </channel>')
    open('feed.xml', 'w').write(feed)

    js = js.replace('  var ARTICLES = [\n', '  var ARTICLES = [\n' + entries, 1)
    open('js/features.js', 'w').write(js)
    print(f'published {len(posts)} posts')
