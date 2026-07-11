// Workroom Assistant — scripted demo chat. A live deployment would connect
// this UI to an LLM grounded in the shop's own price list and policies.

(function () {
  var VISIT_STEER = ' No appointment needed — walk in at 93 Bramley Road, N14 4EY, or call 020 8882 8949.';

  var BRAIN = [
    {
      keys: ['hem', 'shorten', 'trouser', 'jeans', 'length', 'too long'],
      reply: 'Shortening and hemming is our bread and butter — trousers and jeans are typically £12–18 and usually ready in 2–3 days (illustrative demo prices). We pin them on you in the shop so the length is exactly right.' + VISIT_STEER
    },
    {
      keys: ['waist', 'take in', 'let out', 'taper', 'tight', 'loose', 'fit'],
      reply: 'Taking in, letting out and tapering are all everyday work for us — typically £20–30 depending on the garment, ready in 3–4 days (illustrative demo prices). Bring it in and we’ll pin the new fit on you before we touch a stitch.' + VISIT_STEER
    },
    {
      keys: ['zip', 'zipper', 'broken', 'stuck'],
      reply: 'Zip replacements are typically £18–35 depending on the garment and zip type, usually ready in 2–3 days (illustrative demo prices). We match the zip to the original as closely as possible.' + VISIT_STEER
    },
    {
      keys: ['repair', 'tear', 'rip', 'hole', 'button', 'seam', 'mend'],
      reply: 'Repairs start from around £10 (illustrative demo pricing) — seams, tears, buttons, linings. If a piece is worth saving, it’s worth repairing properly, and that’s exactly what the workroom is for.' + VISIT_STEER
    },
    {
      keys: ['reconstruct', 'redesign', 'transform', 'restyle', 'vintage', 'modernise', 'modernize'],
      reply: 'Reconstruction is where our tailors really enjoy themselves — reshaping, restyling and modernising garments completely. It’s always quoted in person because every piece is different: bring it in and talk it through with the team.' + VISIT_STEER
    },
    {
      keys: ['wedding', 'bridal', 'bride', 'gown', 'occasion', 'prom', 'formal'],
      reply: 'We alter bridal and formalwear regularly — fittings are done carefully in our private fitting room, and this work is always consultation-first so we can plan the timeline with your date in mind. Illustratively from £80, quoted properly in the shop.' + VISIT_STEER
    },
    {
      keys: ['suit', 'jacket', 'blazer', 'sleeve'],
      reply: 'Suit work — sleeves, sides, trousers, the lot — is a specialty. A jacket adjustment is typically £28–38 (illustrative demo pricing). Wear it in and we’ll pin exactly what needs to move.' + VISIT_STEER
    },
    {
      keys: ['price', 'cost', 'much', 'charge', 'fee'],
      reply: 'Illustrative demo prices: hems £12–18, waist or taper £20–30, zips £18–35, repairs from £10, suit jackets £28–38, bridal and reconstruction quoted in shop. The live site would show the shop’s confirmed price list — and the instant quote tool on the home page can give you a range now.'
    },
    {
      keys: ['long', 'take', 'turnaround', 'when', 'ready', 'quick', 'urgent', 'same day'],
      reply: 'Most everyday alterations are ready in 2–4 days, repairs often sooner. If you’re up against a deadline, tell the team when you drop off — urgent turnarounds are often possible (demo note; the live site would confirm the shop’s current lead times).' + VISIT_STEER
    },
    {
      keys: ['appointment', 'book', 'booking', 'walk'],
      reply: 'No appointment needed — that’s the whole idea. Just walk in with your garment during opening hours: Mon–Fri 9am–5pm, Sat 10am–3pm. One of the team will pin you up and give you an exact price on the spot.'
    },
    {
      keys: ['open', 'hours', 'time', 'sunday', 'saturday', 'today'],
      reply: 'Opening hours: Monday–Friday 9am–5pm, Saturday 10am–3pm, closed Sunday. We’re at 93 Bramley Road, London N14 4EY — 020 8882 8949.'
    },
    {
      keys: ['where', 'address', 'find', 'location', 'park', 'parking', 'directions'],
      reply: 'You’ll find us at 93 Bramley Road, London N14 4EY, with local parking nearby (demo note — the live site would confirm). There’s a map and directions on the Visit Us page.'
    },
    {
      keys: ['contact', 'phone', 'call', 'email', 'speak', 'human'],
      reply: 'Call the shop on 020 8882 8949 or email info@theworkroomtailors.com — or honestly, just walk in. There’s always a tailor in the workroom.'
    },
    {
      keys: ['hello', 'hi', 'hey', 'morning', 'afternoon'],
      reply: 'Hello! I’m the Workroom Assistant. Ask me what we can alter, what it costs, how long it takes — or try the instant quote tool on the home page.'
    }
  ];

  var FALLBACK = 'That one’s best answered by the tailors themselves — call 020 8882 8949, email info@theworkroomtailors.com, or just walk in at 93 Bramley Road. You could also try the instant quote tool on the home page.';

  var CHIPS = [
    'How much to hem trousers?',
    'Can you alter my wedding dress?',
    'How long do alterations take?',
    'Do I need an appointment?'
  ];

  function answer(text) {
    var q = text.toLowerCase();
    var best = null, bestScore = 0;
    BRAIN.forEach(function (item) {
      var score = 0;
      item.keys.forEach(function (k) { if (q.indexOf(k) !== -1) score++; });
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return best && bestScore > 0 ? best.reply : FALLBACK;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text; // user input is never parsed as HTML
    return node;
  }

  function build() {
    var fab = el('button', 'chat-fab');
    fab.setAttribute('aria-label', 'Open chat with the Workroom Assistant');
    fab.textContent = '💬';

    var panel = el('div', 'chat-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Workroom Assistant chat');

    var head = el('div', 'chat-head');
    head.appendChild(el('div', 'avatar', 'W'));
    var title = el('div');
    title.appendChild(el('b', null, 'Workroom Assistant'));
    title.appendChild(el('span', null, '● Online — AI demo'));
    head.appendChild(title);
    var close = el('button', 'chat-close', '✕');
    close.setAttribute('aria-label', 'Close chat');
    head.appendChild(close);

    var body = el('div', 'chat-body');

    var chips = el('div', 'chat-chips');
    CHIPS.forEach(function (c) {
      var chip = el('button', 'chip', c);
      chip.addEventListener('click', function () { send(c); });
      chips.appendChild(chip);
    });

    var inputBar = el('div', 'chat-input');
    var input = el('input');
    input.type = 'text';
    input.placeholder = 'Ask about alterations, prices, times…';
    input.setAttribute('aria-label', 'Type your question');
    var sendBtn = el('button', null, '➤');
    sendBtn.setAttribute('aria-label', 'Send message');
    inputBar.appendChild(input);
    inputBar.appendChild(sendBtn);

    panel.appendChild(head);
    panel.appendChild(body);
    panel.appendChild(chips);
    panel.appendChild(inputBar);

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    function addMsg(text, who) {
      var m = el('div', 'msg ' + who, text);
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
      return m;
    }

    function send(text) {
      var value = (text || input.value).trim();
      if (!value) return;
      input.value = '';
      addMsg(value, 'user');

      var typing = el('div', 'msg bot typing');
      typing.appendChild(el('span'));
      typing.appendChild(el('span'));
      typing.appendChild(el('span'));
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;

      setTimeout(function () {
        typing.remove();
        addMsg(answer(value), 'bot');
      }, 850 + Math.random() * 500);
    }

    var greeted = false;
    function toggle(open) {
      panel.classList.toggle('open', open);
      if (open && !greeted) {
        greeted = true;
        setTimeout(function () {
          addMsg('Hello — I’m the Workroom Assistant. Ask me anything about alterations, repairs, prices or turnaround times. And remember: no appointment needed, ever.', 'bot');
        }, 350);
      }
      if (open) input.focus();
    }

    fab.addEventListener('click', function () { toggle(!panel.classList.contains('open')); });
    close.addEventListener('click', function () { toggle(false); });
    sendBtn.addEventListener('click', function () { send(); });
    input.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') send(); });
  }

  document.addEventListener('DOMContentLoaded', build);
})();
