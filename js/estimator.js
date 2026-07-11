// Instant alteration quote — demo widget with illustrative prices.
// The live version would use the shop's confirmed price list.

(function () {
  var GARMENTS = [
    { v: 'trousers', label: 'Trousers',        m: 1.0 },
    { v: 'jeans',    label: 'Jeans',           m: 0.9 },
    { v: 'shirt',    label: 'Shirt',           m: 0.9 },
    { v: 'skirt',    label: 'Skirt',           m: 1.1 },
    { v: 'dress',    label: 'Dress',           m: 1.5 },
    { v: 'jacket',   label: 'Suit jacket / blazer', m: 1.7 },
    { v: 'coat',     label: 'Coat',            m: 1.9 },
    { v: 'bridal',   label: 'Bridal / formalwear', m: 3.2 }
  ];

  var SERVICES = [
    { v: 'hem',    label: 'Shorten / hem',           base: 15, days: '2–3 days' },
    { v: 'waist',  label: 'Take in / let out waist', base: 24, days: '3–4 days' },
    { v: 'taper',  label: 'Taper / reshape',         base: 26, days: '3–4 days' },
    { v: 'zip',    label: 'Replace zip',             base: 22, days: '2–3 days' },
    { v: 'repair', label: 'Repair (seams, tears, buttons)', base: 12, days: '1–2 days' },
    { v: 'recon',  label: 'Full reconstruction',     base: 60, days: 'quoted in shop' }
  ];

  function gbp(n) { return '£' + Math.round(n); }

  function formHTML() {
    var g = GARMENTS.map(function (o) { return '<option value="' + o.v + '">' + o.label + '</option>'; }).join('');
    var s = SERVICES.map(function (o) { return '<option value="' + o.v + '">' + o.label + '</option>'; }).join('');
    return '' +
      '<div class="est-field">' +
      '  <label for="est-garment">Your garment</label>' +
      '  <select id="est-garment">' + g + '</select>' +
      '</div>' +
      '<div class="est-field">' +
      '  <label for="est-service">What does it need?</label>' +
      '  <select id="est-service">' + s + '</select>' +
      '</div>' +
      '<button type="button" class="btn btn-cloth est-submit" data-act="run">Get my instant quote</button>' +
      '<p class="est-note">Illustrative demo prices · Exact quote when we see the garment</p>';
  }

  function loadingHTML() {
    return '' +
      '<div class="est-loading">' +
      '  <div class="scan" aria-hidden="true"></div>' +
      '  <p><b>Measuring up…</b><br>Checking typical work for this garment.</p>' +
      '</div>';
  }

  function resultHTML(state) {
    return '' +
      '<div class="est-result">' +
      '  <div class="r-label">Typical price for this work</div>' +
      '  <div class="est-figure">' + gbp(state.low) + ' – ' + gbp(state.high) + '</div>' +
      '  <div class="est-turn">Usually ready in ' + state.days + '</div>' +
      '  <div class="est-meta">' +
      '    <div><b>Walk in</b> no appointment</div>' +
      '    <div><b>Pinned &amp; fitted</b> in shop</div>' +
      '    <div><b>Expert tailors</b> on site</div>' +
      '  </div>' +
      '  <div class="est-actions">' +
      '    <a class="btn btn-brass" href="visit-us.html">Bring it in — find us</a>' +
      '    <button type="button" class="est-back" data-act="reset">Quote another garment</button>' +
      '  </div>' +
      '</div>';
  }

  function init(mount) {
    var body = mount.querySelector('.est-body');

    function show(html) { body.innerHTML = html; }

    show(formHTML());

    body.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-act]');
      if (!btn) return;
      var act = btn.getAttribute('data-act');

      if (act === 'run') {
        var garment = GARMENTS.find(function (o) { return o.v === body.querySelector('#est-garment').value; });
        var service = SERVICES.find(function (o) { return o.v === body.querySelector('#est-service').value; });
        var mid = service.base * garment.m;
        var state = {
          low: Math.max(8, mid * 0.85),
          high: mid * 1.25,
          days: service.days
        };
        // Bridal & reconstruction are always consultation-first
        if (garment.v === 'bridal' || service.v === 'recon') state.days = 'quoted in shop';
        show(loadingHTML());
        setTimeout(function () { show(resultHTML(state)); }, 1400);
      }

      if (act === 'reset') show(formHTML());
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-estimator]').forEach(init);
  });
})();
