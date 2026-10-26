// The Workroom: scripted "quick answers" chat. Replies come from the shop's own
// guide prices and policies below; anything else points people to the phone.

(function () {
  var VISIT_STEER = ' No appointment needed — walk in at 93 Bramley Road, N14 4EY, or call 020 8882 8949.';

  var ANSWERS = [
    {
      keys: ['hem', 'shorten', 'trouser', 'jeans', 'length', 'too long'],
      reply: 'Shortening and hemming is our bread and butter — trousers and jeans are typically £12–18 and usually ready in 2–3 days. We pin them on you in the shop so the length is exactly right.' + VISIT_STEER
    },
    {
      keys: ['waist', 'take in', 'let out', 'taper', 'tight', 'loose', 'fit'],
      reply: 'Taking in, letting out and tapering are all everyday work for us — typically £20–30 depending on the garment, ready in 3–4 days. Bring it in and we’ll pin the new fit on you before we touch a stitch.' + VISIT_STEER
    },
    {
      keys: ['zip', 'zipper', 'broken', 'stuck'],
      reply: 'Zip replacements are typically £18–35 depending on the garment and zip type, usually ready in 2–3 days. We match the zip to the original as closely as possible.' + VISIT_STEER
    },
    {
      keys: ['repair', 'tear', 'rip', 'hole', 'button', 'seam', 'mend'],
      reply: 'Repairs start from around £10: seams, tears, buttons, linings. If a piece is worth saving, it’s worth repairing properly, and that’s exactly what the workroom is for.' + VISIT_STEER
    },
    {
      keys: ['reconstruct', 'redesign', 'transform', 'restyle', 'vintage', 'modernise', 'modernize'],
      reply: 'Reconstruction is where our tailors really enjoy themselves — reshaping, restyling and modernising garments completely. It’s always quoted in person because every piece is different: bring it in and talk it through with the team.' + VISIT_STEER
    },
    {
      keys: ['wedding', 'bridal', 'bride', 'gown', 'occasion', 'prom', 'formal'],
      reply: 'We alter bridal and formalwear regularly — fittings are done carefully in our private fitting room, and this work is always consultation-first so we can plan the timeline with your date in mind. Prices start from around £80 and are confirmed in the shop.' + VISIT_STEER
    },
    {
      keys: ['suit', 'jacket', 'blazer', 'sleeve'],
      reply: 'Suit work — sleeves, sides, trousers, the lot — is a specialty. A jacket adjustment is typically £28–38. Wear it in and we’ll pin exactly what needs to move.' + VISIT_STEER
    },
    {
      keys: ['price', 'cost', 'much', 'charge', 'fee'],
      reply: 'Guide prices: hems £12–18, waist or taper £20–30, zips £18–35, repairs from £10, suit jackets £28–38. Bridal and reconstruction are quoted in the shop. The full list is on our Services & prices page.'
    },
    {
      keys: ['long', 'take', 'turnaround', 'when', 'ready', 'quick', 'urgent', 'same day'],
      reply: 'Most everyday alterations are ready in 2–4 days, repairs often sooner. If you’re up against a deadline, tell the team when you drop off — urgent turnarounds are often possible.' + VISIT_STEER
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
      reply: 'You’ll find us at 93 Bramley Road, London N14 4EY. There’s a map link and our opening hours on the Visit us page.'
    },
    {
      keys: ['contact', 'phone', 'call', 'email', 'speak', 'human'],
      reply: 'Call the shop on 020 8882 8949 or email info@theworkroomtailors.com. Or just walk in: there’s always a tailor in the workroom.'
    },
    {
      keys: ['hello', 'hi', 'hey', 'morning', 'afternoon'],
      reply: 'Hello. Ask us what we can alter, what it costs or how long it takes.'
    }
  ];

  var FALLBACK = 'That one’s best answered by the tailors themselves. Call 020 8882 8949, email info@theworkroomtailors.com, or just walk in at 93 Bramley Road.';

  var CHIPS = [
    'How much to hem trousers?',
    'Can you alter my wedding dress?',
    'How long do alterations take?',
    'Do I need an appointment?'
  ];

  function answer(text) {
    var q = text.toLowerCase();
    var best = null, bestScore = 0;
    ANSWERS.forEach(function (item) {
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
    var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" stroke-linejoin="round"/></svg>';
    var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    var ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var fab = el('button', 'chat-fab');
    fab.setAttribute('aria-label', 'Questions? Open quick answers');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = ICON_CHAT + '<span>Questions?</span>'; // static markup only

    var panel = el('div', 'chat-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Quick answers from The Workroom');

    var head = el('div', 'chat-head');
    head.appendChild(el('div', 'avatar', 'W'));
    var title = el('div');
    title.appendChild(el('b', null, 'The Workroom'));
    title.appendChild(el('span', null, 'Quick answers · or call 020 8882 8949'));
    head.appendChild(title);
    var close = el('button', 'chat-close');
    close.innerHTML = ICON_CLOSE;
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
    var sendBtn = el('button');
    sendBtn.innerHTML = ICON_SEND;
    sendBtn.setAttribute('aria-label', 'Send message');
    inputBar.appendChild(input);
    inputBar.appendChild(sendBtn);

    panel.appendChild(head);
    panel.appendChild(body);
    panel.appendChild(chips);
    panel.appendChild(inputBar);
    var foot = el('div', 'chat-foot');
    foot.appendChild(document.createTextNode('Something else? '));
    var callLink = el('a', null, 'Call 020 8882 8949');
    callLink.href = 'tel:02088828949';
    foot.appendChild(callLink);
    panel.appendChild(foot);

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
      chips.hidden = true; // suggestions only until the first question
      addMsg(value, 'user');

      var typing = el('div', 'msg bot typing', 'Typing…');
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
      fab.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && !greeted) {
        greeted = true;
        setTimeout(function () {
          addMsg('Hello. Ask us about alterations, repairs, prices or how long things take. And there’s no appointment needed.', 'bot');
        }, 350);
      }
      if (open) input.focus();
    }

    fab.addEventListener('click', function () { toggle(!panel.classList.contains('open')); });
    close.addEventListener('click', function () { toggle(false); fab.focus(); });
    panel.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { toggle(false); fab.focus(); } });
    sendBtn.addEventListener('click', function () { send(); });
    input.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') send(); });
  }

  document.addEventListener('DOMContentLoaded', build);
})();
