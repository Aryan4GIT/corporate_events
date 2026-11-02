/* Soumya Events and Entertainment — content, live event themes, motion, interactions. No dependencies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var all = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer:fine)').matches;
  var root = document.documentElement;
  var IMG = window.IMG;
  var ico = function (n) { return '<svg class="i" aria-hidden="true"><use href="#ic-' + n + '"/></svg>'; };
  var plain = function (t) { return t.replace(/&amp;/g, 'and'); };

  if (fine && !reduced) root.classList.add('fine');

  /* ---------------- images ---------------- */
  function srcset(f) {
    return IMG[f].w.map(function (w) { return 'assets/img/' + f + '-' + w + '.webp ' + w + 'w'; }).join(', ');
  }
  function pic(f, alt, sizes, eager) {
    var m = IMG[f];
    return '<picture><source type="image/webp" srcset="' + srcset(f) + '" sizes="' + sizes + '">' +
      '<img src="assets/img/' + f + '.jpg" width="' + m.w[m.w.length - 1] + '" height="' + m.h + '" alt="' + alt + '"' +
      ' decoding="async"' + (eager ? '' : ' loading="lazy"') + ' style="background:' + m.c + '"></picture>';
  }
  /* new image fades in over the old, which is then removed */
  function setFrame(el, f, sizes, lazy) {
    el.insertAdjacentHTML('beforeend', '<span class="fx">' + pic(f, '', sizes, !lazy) + '</span>');
    var kids = el.children;
    while (kids.length > 2) el.removeChild(kids[0]);
    if (kids.length === 2) setTimeout(function () { if (kids.length > 1) el.removeChild(kids[0]); }, 950);
  }

  /* ---------------- content ---------------- */
  /* Each theme recasts the hero for that kind of event as well as recolouring the site. */
  var THEMES = [
    { k: 'corporate',  n: 'Corporate',  c: '#f0702a', word: 'Show floors.',   arch: 'i4', disc: 'g3', chip: 't3', inl: 'g2', fill: 'g6' },
    { k: 'exhibition', n: 'Exhibition', c: '#12b07f', word: 'Expo halls.',    arch: 'g3', disc: 'g6', chip: 't2', inl: 'g4', fill: 'g4' },
    { k: 'summit',     n: 'Summit',     c: '#2340e8', word: 'Summit halls.',  arch: 'g5', disc: 'i2', chip: 't4', inl: 'g2', fill: 'g2' },
    { k: 'launch',     n: 'Launch',     c: '#6a24e0', word: 'Launch stages.', arch: 'g1', disc: 'i7', chip: 't1', inl: 'g7', fill: 'g1' },
    { k: 'gala',       n: 'Gala',       c: '#c70f58', word: 'Award nights.',  arch: 'g8', disc: 'i5', chip: 't3', inl: 'i6', fill: 'i5' }
  ];

  var CAPS = [
    { t: 'Exhibitions &amp; trade shows', s: 'Exhibitions', f: 'g3',
      p: 'Stall design through to strike: octanorm or custom fabrication, branding, lighting, hostesses and daily stand management. Trade fairs and retail trade shows are organised on the same sheet.',
      tags: ['Exhibition booths', 'Fabrication', 'Expo branding', 'Stand management'],
      incl: ['Stall design and 3D visual', 'Octanorm or custom build', 'Graphics, fascia and branding', 'Lighting and power', 'Furniture, plinths and display', 'Screens at the stand', 'Daily stand management', 'Dismantling at strike'] },
    { t: 'Conferences &amp; seminars', s: 'Conferences', f: 'g2',
      p: 'Conferences, seminars, dealer meets, AGMs and training programmes, with registration, delegate management, stage and AV handled on one run sheet.',
      tags: ['Conferences', 'Dealer meets', 'AGMs', 'Registration'],
      incl: ['Venue selection', 'Registration desk', 'Delegate kits and collateral', 'Stage and backdrop', 'LED wall or projection', 'Audio and microphones', 'Camera and live stream', 'Show calling'] },
    { t: 'Launches &amp; activations', s: 'Launches', f: 'g4',
      p: 'Product launches, brand activations, roadshows and press events, built to photograph well and to last a full day of footfall.',
      tags: ['Product launches', 'Brand activations', 'Roadshows', 'Event marketing'],
      incl: ['Concept and staging', 'Reveal set', 'Brand activation zones', 'Press layout', 'Roadshow logistics', 'Invitations and print', 'Corporate gifts', 'Photo and video'] },
    { t: 'Fabrication &amp; branding', s: 'Fabrication', f: 'g6',
      p: 'Stage sets, backdrops, kiosks, signage and print, made to fit the space and checked before doors open.',
      tags: ['Stage &amp; set', 'Signage', 'Print', 'Corporate gifts'],
      incl: ['Stage sets', 'Printed backdrops', 'Kiosks and counters', 'Signage and standees', 'Decorative elements', 'Printing', 'Installation on site', 'Removal after the show'] },
    { t: 'Production &amp; AV', s: 'Production &amp; AV', f: 'g1',
      p: 'LED walls, audio, lighting, rigging, live streaming and video conferencing, with still photography and video recording alongside. Virtual corporate events run from the same desk.',
      tags: ['LED wall', 'Audio', 'Lighting', 'Virtual events', 'Video'],
      incl: ['LED walls', 'Audio systems', 'Lighting and truss', 'Rigging', 'Live streaming', 'Video conferencing', 'Still photography', 'Video recording'] },
    { t: 'Social, cultural &amp; celebrity', s: 'Social &amp; cultural', f: 'i5',
      p: 'Award functions, cultural programmes, entertainment shows and celebrity management, plus school events and social functions.',
      tags: ['Award functions', 'Celebrity management', 'Cultural shows', 'Theme parties'],
      incl: ['Award functions', 'Cultural programmes', 'Entertainment shows', 'Celebrity management', 'Theme parties', 'Anniversaries and birthdays', 'School events', 'Catering, tenting and décor'] }
  ];

  /* The event types named across the Google and IndiaMART listings. Weddings are left out on purpose. */
  var TYPES = [
    { t: 'Corporate events', f: 'g8', p: 'Company functions and leadership meets, planned and run end to end.' },
    { t: 'Exhibitions', f: 'g3', p: 'Stalls, pavilions and stand management, from octanorm to custom builds.' },
    { t: 'Trade fairs', f: 'g4', p: 'Trade fairs and retail trade shows, including branding and floor management.' },
    { t: 'Conferences', f: 'g2', p: 'Delegate halls, registration, stage, LED and AV on one run sheet.' },
    { t: 'Seminars', f: 'i1', p: 'One-day and multi-session seminars, set up and conducted start to finish.' },
    { t: 'Product launches', f: 'g7', p: 'Reveal staging and press layout, built around the product.' },
    { t: 'Networking events', f: 'i2', p: 'Rounds, collateral, stage and camera for networking evenings.' },
    { t: 'Meetings', f: 'i4', p: 'Boardroom sets, table dressing and AV for smaller, senior rooms.' },
    { t: 'Dealer meets &amp; AGMs', f: 'g5', p: 'Registration, sessions and the evening function.' },
    { t: 'Training programmes', f: 'i1', p: 'Management training and development programmes, venue to materials.' },
    { t: 'Virtual events', f: 'g2', p: 'Virtual corporate events, live streaming and video conferencing.' },
    { t: 'Award functions', f: 'i5', p: 'Award stages, LED walls, floral dressing and show calling.' },
    { t: 'Cultural programmes', f: 'i6', p: 'Cultural and entertainment shows, with artist and celebrity management.' }
  ];

  /* Dates and venues as they appear on the photographs and the Instagram log; nothing here is inferred. */
  var LOG = [
    { d: 'Aug 2026', e: 'Maharashtra Urja Expo', v: 'Auto Cluster Exhibition Centre, Pune', k: 'Exhibition' },
    { d: 'Feb 2026', e: 'Boardroom conference set', v: 'Shangri-La\'s Eros, Connaught Place, New Delhi', k: 'Corporate' },
    { d: '2026', e: 'Deakin South Asia Partner Retreat', v: 'Reception backdrop and décor', k: 'Branding' },
    { d: 'Aug 2025', e: 'Cyber Resilience &amp; AI Safety seminar', v: 'DELNET, New Delhi', k: 'Seminar' },
    { d: 'Dec 2024', e: 'CyberPeace Dialogue 2024', v: 'New Delhi', k: 'Conference' },
    { d: '2021', e: 'Security Leadership Summit', v: 'Stage and floral dressing', k: 'Conference' },
    { d: 'On the log', e: 'Corporate conference', v: 'Sheraton Saket, New Delhi', k: 'Conference' },
    { d: 'On the log', e: 'Phychem &amp; RR Plast stalls', v: 'Leela Ambience, Shahdara, Delhi', k: 'Exhibition' }
  ];

  /* Names legible in the company's own photographs. */
  var NAMES_A = ['MAPL', 'Shilpa Medicare', 'Hanwha Vision', 'Gallagher Security', 'Nokia', 'Deakin University', 'Rajasthan Royals'];
  var NAMES_B = ['CyberPeace', 'DELNET', 'Phychem Technologies', 'RR Plast Extrusions', 'HID', 'DETEL', 'arqivo'];

  var FAQ = [
    { q: 'What does A to Z actually cover?', a: 'Audio visual, stage, decoration, catering and tenting, plus fabrication, branding, venue selection, invitations, corporate gifts, still photography and video recording. The full list of 38 services is on the capabilities page, with a search box.' },
    { q: 'Where do you work?', a: 'The office is in Chhatarpur Extension, New Delhi. Work runs across Delhi NCR and all metro cities, and PAN India where the project calls for it. Recent builds include Pune.' },
    { q: 'How long has the company been running?', a: 'Soumya Events and Entertainment was established in 2017 as a proprietorship and is led by Soumendra K. Dhal, ex-Indian Air Force.' },
    { q: 'Do you build exhibition stalls?', a: 'Yes, both octanorm shell-scheme stalls and custom-fabricated pavilions. The capabilities page explains the difference with photographs of each.' },
    { q: 'Can I hire just one part, such as an LED wall or AV?', a: 'LED walls and audio visual services are listed as services in their own right, so ask for only what you need.' },
    { q: 'Do you run virtual and hybrid events?', a: 'Virtual corporate event management, live streaming and video conferencing are all on the service list.' },
    { q: 'Do you handle social functions too?', a: 'Yes. Anniversaries, birthdays, retirement parties, school events and religious events are all listed alongside the corporate work.' },
    { q: 'How do I get a quote?', a: 'Send the brief form, which opens a ready-to-send WhatsApp message, or call 099719 70165. The office is open 24 hours, seven days.' }
  ];

  var LAYOUTS = [
    { t: 'Theatre', f: 'g5', p: 'Rows of chairs facing the stage. It fits the most people in a hall and suits keynotes and launches.' },
    { t: 'Classroom', f: 'g2', p: 'Desks in rows with room for laptops and notes. It suits seminars and training programmes.' },
    { t: 'Rounds', f: 'i2', p: 'Round tables, usually with dressed chairs. It suits networking, awards and any session with a meal.' },
    { t: 'Boardroom', f: 'i4', p: 'One long table or a U-shape, with everyone facing each other. It suits senior meetings and small working groups.' }
  ];

  var KIT = [
    { t: 'Stage &amp; set', l: ['Stage and risers', 'Printed backdrops', 'Podiums and kiosks', 'Truss and rigging', 'Floral and décor'] },
    { t: 'Sound &amp; picture', l: ['LED walls', 'Projection and screens', 'Audio systems', 'Microphones', 'Video conferencing'] },
    { t: 'Light', l: ['Stage wash', 'Profile spots', 'Uplighters', 'Stall spotlights', 'LED linework'] },
    { t: 'Branding', l: ['Fascia and signage', 'Standees', 'Delegate kits', 'Invitation printing', 'Corporate gifts'] },
    { t: 'Capture', l: ['Still photography', 'Video recording', 'Live streaming', 'Virtual event setup'] },
    { t: 'Hospitality', l: ['Venue selection', 'Catering', 'Tenting', 'Cleaning services', 'Entertainment shows'] }
  ];

  /* What each frame shows, written from the photographs. */
  var CASES = [
    { f: 'g3', k: 'Exhibition', t: 'MAPL, solar expo', p: 'An open-front pavilion under one sweeping white fascia with an orange trim line. Product plinths sit at the aisle, a staffed counter anchors the corner, and the brand repeats on every face so it reads from both directions.',
      l: ['Custom fabrication', 'Fascia and graphics', 'Spot lighting', 'Counters and plinths'] },
    { f: 'g6', k: 'Exhibition', t: 'Shilpa Medicare pavilion', p: 'Illuminated lettering over amber LED linework that runs from the fascia down to the floor edge. Inside are a meeting lounge, backlit display panels and a screen. The frame also catches the crew planting the last greenery before doors.',
      l: ['Lit linework', 'Meeting lounge', 'Backlit panels', 'Landscaping'] },
    { f: 'g2', k: 'Conference', t: 'CyberPeace Dialogue 2024', p: 'A full delegate hall facing a wide LED wall with branded side panels, a lounge-seat panel on stage and a branded lectern for the speakers. Rows of desks and a press position sit in front.',
      l: ['LED wall', 'Stage and lounge seating', 'Branded lectern', 'Delegate desks'] }
  ];

  var PREP = [
    { t: 'Date and city', p: 'Even a rough window helps. Hall and crew availability is the first thing to check.' },
    { t: 'Venue, if booked', p: 'The hall name tells us the ceiling height, power and load-in rules. If there is no venue yet, selection is part of the service.' },
    { t: 'Footfall', p: 'Expected delegates or visitors decide the room layout, the screen size and the audio.' },
    { t: 'Size and format', p: 'For a stall, the area and open sides. For a hall, theatre, classroom, rounds or boardroom.' },
    { t: 'Brand files', p: 'Logo, colours and any artwork already approved, so print and fabrication can start clean.' },
    { t: 'Budget band', p: 'A range is enough. It lets the first plan be one you can actually sign off.' }
  ];

  var SCOPE = ['Event planning &amp; management', 'Corporate event management', 'Conference planning and coordination',
    'Event integration activity planning', 'Marketing event planning', 'Event marketing',
    'Corporate &amp; conference', 'Corporate events', 'Conference &amp; seminars', 'Exhibition', 'Exhibition booths',
    'Fabrication &amp; branding', 'Production design', 'Audio visual equipment', 'Video conferencing',
    'Virtual events', 'Still photography', 'Video recording', 'Celebrity management', 'Entertainment shows',
    'Cultural events', 'Cultural programme', 'Venue selection', 'Event venue', 'Catering', 'Cleaning services',
    'Corporate gifts', 'Decorations', 'Invitation printing', 'Theme party',
    'Anniversary party planning', 'Birthday party planning', "Children's party planning",
    'Retirement party planning', 'Religious event', 'School event', 'Social events', 'Social functions'];

  var FLOW = [
    { t: 'Brief', p: 'Date, city, venue, footfall and budget band. Enough to tell whether the plan as described fits that space and that time.' },
    { t: 'Plan', f: 'g7', p: 'A costed scope with floor plan, production list and run sheet, and a 3D visual of the stand or stage before anything is cut.' },
    { t: 'Build', f: 'g6', p: 'Fabrication, branding, rigging and AV go in to schedule, then get tested and rehearsed before doors.' },
    { t: 'Run &amp; strike', f: 'g2', p: 'A show caller on comms and a crew on the floor, so you can host instead of coordinate. Then the strike, and the venue handed back clean.' }
  ];

  var QUOTES = [
    { q: 'Their professionalism, dedication and <em>discipline</em> is of high standard.', f: 'g6' },
    { q: 'We have always appreciated his commitment to a <em>customer-first</em> approach.', f: 'g5' },
    { q: 'They are disciplined, <em>punctual</em> and very much dedicated to their work.', f: 'g4' }
  ];

  var WORDS = [
    { w: 'Disciplined', p: 'Led from an Air Force background. Run sheets, load-ins and cue times are treated as commitments.' },
    { w: 'Punctual', p: 'Load-in windows, soundcheck slots, doors open. The times on the sheet are the times on the day.' },
    { w: 'Dedicated', p: 'Open 24 hours, because event problems do not keep office hours.' }
  ];

  var NUMBERS = [
    { to: 4.6, dec: 1, l: 'Google rating' },
    { to: 27, l: 'Google reviews' },
    { to: 38, l: 'Services in scope' },
    { to: 295, l: 'Posts on Instagram' },
    { to: 24, suf: 'h', l: 'Open, seven days' }
  ];

  /* c and r are the bento spans. Captions describe what is in frame. */
  var WORK = [
    { f: 'g3', k: 'Exhibition', t: 'MAPL, solar expo', s: 'Custom stall, branding and lighting', c: 7, r: 2 },
    { f: 'g6', k: 'Exhibition', t: 'Shilpa Medicare pavilion', s: 'Lit linework, meeting lounge and display walls', c: 5, r: 2 },
    { f: 'i5', k: 'Awards', t: 'Krishi Samman Awards', s: 'Awards stage, LED wall and floral dressing', c: 4, r: 1 },
    { f: 'i1', k: 'Conference', t: 'Cyber Resilience &amp; AI Safety', s: 'CyberPeace × DELNET backdrop and head table', c: 4, r: 1 },
    { f: 'i7', k: 'Branding', t: 'Deakin South Asia Partner Retreat', s: 'Reception backdrop, print and uplighting', c: 4, r: 1 },
    { f: 'g2', k: 'Conference', t: 'CyberPeace Dialogue 2024', s: 'Delegate hall, LED screen and stage AV, New Delhi', c: 5, r: 2 },
    { f: 'i4', k: 'Corporate', t: 'Shangri-La\'s Eros, Connaught Place', s: 'Boardroom set and table dressing, Feb 2026', c: 3, r: 2 },
    { f: 'g1', k: 'Stage', t: 'Rajasthan Royals × Deakin University', s: 'Student seminar stage and printed backdrop', c: 4, r: 2 },
    { f: 'g4', k: 'Exhibition', t: 'Hanwha Vision &amp; Gallagher', s: 'Airport-security showcase booth', c: 6, r: 2 },
    { f: 'i6', k: 'Celebration', t: 'Deakin, Stronger Together', s: 'Décor build, mirror spheres and light sculpture', c: 3, r: 1 },
    { f: 'i3', k: 'Exhibition', t: 'Phychem &amp; RR Plast stalls', s: 'Octanorm stalls and branding, Leela Ambience, Delhi', c: 3, r: 1 },
    { f: 'i2', k: 'Conference', t: 'CIO summit, ballroom staging', s: 'LED backdrop, rounds and delegate collateral', c: 6, r: 1 },
    { f: 'g8', k: 'Corporate', t: 'Ballroom conference set', s: 'Rounds, stage, registration and camera position', c: 8, r: 2 },
    { f: 'g5', k: 'Conference', t: 'Summit series, theatre hall', s: 'Dual projection, audio and classroom seating', c: 4, r: 2 },
    { f: 'g7', k: 'Branding', t: 'Nokia stand, design visual', s: '3D visual of the stand', c: 7, r: 2 }
  ];
  var workOf = function (f) { return WORK.map(function (w) { return w.f; }).indexOf(f); };

  /* Only small copies of these exist, so they stay small. */
  var ARCHIVE = [
    { f: 't1', t: 'HID stand' }, { f: 't2', t: 'DETEL stall' },
    { f: 't3', t: 'Delegate session, round tables' }, { f: 't4', t: 'Security Leadership Summit 2021' }
  ];

  var REEL = [
    { f: 'g3', sw: '46vw', sh: '56vh' }, { f: 'g2', sw: '36vw', sh: '44vh' }, { f: 'g6', sw: '27vw', sh: '60vh', arch: 1 },
    { f: 'g1', sw: '38vw', sh: '50vh' }, { f: 'i5', sw: '34vw', sh: '36vh' }, { f: 'g4', sw: '40vw', sh: '52vh' },
    { f: 'i4', sw: '24vw', sh: '60vh', arch: 1 }, { f: 'g8', sw: '46vw', sh: '54vh' }
  ];

  var TAPE_A = ['Exhibitions', 'Trade shows', 'Conferences', 'Dealer meets', 'Product launches', 'Award functions', 'Seminars', 'Roadshows', 'LED walls', 'Cultural programmes'];
  var TAPE_B = ['All access', 'Load-in', 'Fabrication', 'Rigging', 'Soundcheck', 'Doors open', 'Show call', 'Strike', 'PAN India', 'Open 24 hours'];

  /* ---------------- generated drawings ---------------- */
  function hallPlan() {
    var out = '', n = 0, rows = 'ABCD';
    function box(x, y, w, h) {
      out += '<path class="d" pathLength="1" style="--n:' + (n++) + '" d="M' + x + ' ' + y + 'h' + w + 'v' + h + 'h' + (-w) + 'z"/>';
    }
    box(20, 20, 1160, 760);
    for (var a = 0; a < 4; a++) {
      for (var b = 0; b < 6; b++) {
        var x = 62 + b * 186, y = 62 + a * 176;
        box(x, y, 70, 58); box(x + 74, y, 70, 58); box(x, y + 62, 144, 58);
        out += '<text x="' + (x + 6) + '" y="' + (y + 18) + '">' + rows[a] + '-' + (b + 1) + '</text>';
      }
    }
    return '<svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + out + '</svg>';
  }

  function mirrorBall() {
    var s = '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="bc"><circle cx="50" cy="50" r="48"/></clipPath>' +
      '<radialGradient id="bg" cx=".34" cy=".3" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient></defs>' +
      '<g clip-path="url(#bc)"><circle cx="50" cy="50" r="48" fill="#3a3632"/>';
    for (var la = -80; la < 90; la += 10) {
      var r = Math.cos(la * Math.PI / 180), y1 = 50 + 48 * Math.sin(la * Math.PI / 180), y2 = 50 + 48 * Math.sin((la + 9) * Math.PI / 180);
      for (var lo = -85; lo < 90; lo += 10) {
        var x1 = 50 + 48 * r * Math.sin(lo * Math.PI / 180), x2 = 50 + 48 * r * Math.sin((lo + 9) * Math.PI / 180);
        var light = 40 + Math.random() * 44, tw = Math.random() < .14;
        s += '<rect' + (tw ? ' class="tw" style="--t:' + (Math.random() * 2.6).toFixed(2) + 's"' : '') + ' x="' + x1.toFixed(1) + '" y="' + y1.toFixed(1) +
          '" width="' + (x2 - x1).toFixed(1) + '" height="' + (y2 - y1).toFixed(1) + '" fill="hsl(30 6% ' + light.toFixed(0) + '%)"/>';
      }
    }
    return s + '<circle cx="50" cy="50" r="48" fill="url(#bg)"/></g></svg>';
  }
  $('#ball').innerHTML = mirrorBall();
  /* a hundred-odd paths per drawing is too much for a phone, so touch screens keep only the hero's */
  all('[data-plan]').forEach(function (el) {
    if (!fine && !el.closest('.hero')) { el.remove(); return; }
    el.innerHTML = hallPlan();
  });

  /* ---------------- render ---------------- */
  all('[data-pic]').forEach(function (el) { el.innerHTML = pic(el.dataset.pic, '', el.dataset.sizes); });

  function tapeList(a) {
    var doubled = a.concat(a, a, a);
    return doubled.map(function (t) { return '<li>' + t + '</li>'; }).join('');
  }
  $('#tape-a').innerHTML = tapeList(TAPE_A);
  $('#tape-b').innerHTML = tapeList(TAPE_B);

  /* reel */
  $('#reel-track').innerHTML = REEL.map(function (r, n) {
    var i = workOf(r.f), w = WORK[i];
    return '<button class="slide' + (r.arch ? ' arch' : '') + '" data-work="' + i + '" data-cur="view" style="--sw:' + r.sw + ';--sh:' + r.sh + '" aria-label="Open ' + plain(w.t) + '">' +
      '<span class="shot">' + pic(r.f, plain(w.t) + ', ' + w.s, '(max-width:1000px) 82vw, 46vw') + '<span class="num" aria-hidden="true">' + ('0' + (n + 1)).slice(-2) + '</span></span>' +
      '<span class="cap"><span class="kk">' + w.k + '</span><span><b>' + w.t + '</b><small>' + w.s + '</small></span></span></button>';
  }).join('') + '<a class="slide-end" href="#/work">Every project</a>';

  /* passes */
  $('#pass-row').innerHTML = NUMBERS.map(function (n, i) {
    return '<div class="pass"><span class="pass-card" style="--t:' + (i * 1.3).toFixed(1) + 's">' +
      '<span class="pass-top"><span>All access</span><span>0' + (i + 1) + '</span></span>' +
      '<span class="pass-num" data-to="' + n.to + '" data-dec="' + (n.dec || 0) + '" data-suf="' + (n.suf || '') + '">0</span>' +
      '<span class="pass-lab">' + n.l + '</span><span class="pass-bar"></span></span></div>';
  }).join('');

  /* cue sheet */
  $('#cue-list').innerHTML = FLOW.map(function (f, i) {
    return '<article class="cue"><span class="cue-dot" aria-hidden="true"></span>' +
      '<div class="cue-pic reveal">' + (f.f ? pic(f.f, '', '(max-width:620px) 90vw, 46vw') : '<div class="plan">' + hallPlan() + '</div>') + '</div>' +
      '<div class="cue-copy rv"><span class="cue-n" aria-hidden="true">0' + (i + 1) + '</span><h3>' + f.t + '</h3><p>' + f.p + '</p></div></article>';
  }).join('');

  /* quote carousel */
  $('#q-stage').innerHTML = QUOTES.map(function (q, i) {
    return '<figure class="q' + (i ? '' : ' on') + '"><blockquote>' + q.q + '</blockquote><figcaption>Google review</figcaption></figure>';
  }).join('');
  var qi = 0, qt = 0;
  function showQuote(n) {
    var qs = all('.q');
    qi = (n + qs.length) % qs.length;
    qs.forEach(function (q, i) { q.classList.toggle('on', i === qi); });
  }
  function qAuto() { clearTimeout(qt); if (!reduced) qt = setTimeout(function () { showQuote(qi + 1); qAuto(); }, 7000); }
  $('#q-prev').addEventListener('click', function () { showQuote(qi - 1); qAuto(); });
  $('#q-next').addEventListener('click', function () { showQuote(qi + 1); qAuto(); });
  qAuto();

  /* floor-plan showcase */
  /* long enough to read the card, and only while the section is on screen */
  var showI = 0, showT = 0, showTouched = false, showSeen = false, SHOW_MS = 9000;
  $('#stalls').innerHTML = CAPS.map(function (c, i) {
    return '<button class="stall" data-i="' + i + '" aria-pressed="false"><small>' + 'ABCDEF'[i] + '-0' + (i + 1) + '</small><b>' + c.s + '</b><i></i></button>';
  }).join('');
  $('#show-card').innerHTML = '<div class="sc-pic" id="sc-pic"></div><div id="sc-text"></div>';
  function pickStall(i, timed) {
    showI = i;
    var c = CAPS[i];
    all('.stall').forEach(function (s, n) {
      s.setAttribute('aria-pressed', String(n === i));
      s.classList.toggle('timed', n === i && !!timed);
    });
    setFrame($('#sc-pic'), c.f, '(max-width:1000px) 92vw, 46vw', true);
    $('#sc-text').innerHTML = '<div class="sc-body"><h3>' + c.t + '</h3><p>' + c.p + '</p><div class="sub">' +
      c.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div></div>';
  }
  function showAuto() {
    clearTimeout(showT);
    if (reduced || showTouched || !showSeen) return;
    all('.stall[aria-pressed="true"]').forEach(function (s) { s.classList.add('timed'); });
    showT = setTimeout(function () { pickStall((showI + 1) % CAPS.length, true); showAuto(); }, SHOW_MS);
  }
  $('#stalls').addEventListener('click', function (e) {
    var b = e.target.closest('.stall'); if (!b) return;
    showTouched = true; clearTimeout(showT);
    pickStall(+b.dataset.i, false);
    /* on a phone the card sits below the plan, so bring it into view */
    var top = $('#show-card').getBoundingClientRect().top;
    if (top > innerHeight * .6) scrollBy({ top: top - innerHeight * .3, behavior: reduced ? 'auto' : 'smooth' });
  });
  $('#show-card').addEventListener('touchstart', function () { showTouched = true; clearTimeout(showT); all('.stall').forEach(function (s) { s.classList.remove('timed'); }); }, { passive: true });
  pickStall(0, false);

  /* event types: the hovered row's photo follows the pointer; touch screens show it inline */
  $('#type-list').innerHTML = TYPES.map(function (t, i) {
    return '<li class="type rv" data-i="' + i + '"><span class="type-n">' + ('0' + (i + 1)).slice(-2) + '</span>' +
      '<span class="type-t">' + t.t + '</span><span class="type-p">' + t.p + '</span>' +
      '<span class="type-m" aria-hidden="true">' + pic(t.f, '', '72px') + '</span></li>';
  }).join('');
  $('#type-float').innerHTML = TYPES.map(function (t) { return '<span>' + pic(t.f, '', '30vw') + '</span>'; }).join('');

  $('#types-more').textContent = 'See all ' + TYPES.length;
  $('#types-more').addEventListener('click', function () { $('#type-list').classList.remove('short'); this.remove(); });

  /* show log, on Home and Work */
  all('[data-log]').forEach(function (el) {
    el.innerHTML = '<table><thead><tr><th scope="col">When</th><th scope="col">Show</th><th scope="col">Where / what</th><th scope="col">Type</th></tr></thead><tbody>' +
      LOG.map(function (r) {
        return '<tr><td class="log-d">' + r.d + '</td><td class="log-e">' + r.e + '</td><td class="log-v">' + r.v + '</td><td class="log-k"><span>' + r.k + '</span></td></tr>';
      }).join('') + '</tbody></table>';
  });

  function nameRow(a) {
    return a.concat(a, a, a).map(function (n) { return '<li>' + n + '</li>'; }).join('');
  }
  $('#names-a').innerHTML = nameRow(NAMES_A);
  $('#names-b').innerHTML = nameRow(NAMES_B);

  $('#faq-list').innerHTML = FAQ.map(function (f, i) {
    return '<details class="qa"' + (i ? '' : ' open') + '><summary><span>' + f.q + '</span><i aria-hidden="true"></i></summary><p>' + f.a + '</p></details>';
  }).join('');

  /* capabilities page */
  $('#chap-pin').innerHTML = CAPS.map(function (c, i) {
    return '<span class="' + (i ? '' : 'on') + '">' + pic(c.f, '', '46vw') + '</span>';
  }).join('');
  $('#chap-list').innerHTML = CAPS.map(function (c, i) {
    return '<article class="chap" id="cap-' + i + '" data-i="' + i + '"><div class="chap-m">' + pic(c.f, plain(c.t), '92vw') + '</div>' +
      '<span class="chap-n" aria-hidden="true">0' + (i + 1) + '</span><h2>' + c.t + '</h2><p>' + c.p + '</p><ul class="ticks">' +
      c.incl.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></article>';
  }).join('');
  /* jump chips scroll without touching the hash, which belongs to the router */
  $('#jump').innerHTML = CAPS.map(function (c, i) { return '<button data-to="cap-' + i + '">' + c.s + '</button>'; }).join('') +
    '<button data-to="stall-guide">Stall guide</button><button data-to="room-guide">Room guide</button><button data-to="kit-list">Kit list</button><button data-to="scope">Search all</button>';
  $('#jump').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    $('#' + b.dataset.to).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });

  $('#layout-grid').innerHTML = LAYOUTS.map(function (l, i) {
    return '<article class="layout rv" style="transition-delay:' + (i * 80) + 'ms"><div class="layout-pic">' + pic(l.f, plain(l.t) + ' room layout', '(max-width:620px) 92vw, 25vw') + '</div>' +
      '<h3>' + l.t + '</h3><p>' + l.p + '</p></article>';
  }).join('');
  $('#kit-grid').innerHTML = KIT.map(function (k) {
    return '<div class="kit-col rv"><h3>' + k.t + '</h3><ul>' + k.l.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
  }).join('');
  $('#case-list').innerHTML = CASES.map(function (c) {
    var i = workOf(c.f);
    return '<article class="case"><button class="case-pic reveal" data-work="' + i + '" data-cur="view" aria-label="Open ' + plain(c.t) + '">' + pic(c.f, plain(c.t), '(max-width:820px) 92vw, 62vw') + '</button>' +
      '<div class="case-card glass rv"><span class="label">' + c.k + '</span><h3>' + c.t + '</h3><p>' + c.p + '</p><ul class="ticks">' +
      c.l.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div></article>';
  }).join('');
  $('#prep-list').innerHTML = PREP.map(function (p, i) {
    return '<li class="prep-i rv" style="transition-delay:' + (i * 60) + 'ms"><span>0' + (i + 1) + '</span><h3>' + p.t + '</h3><p>' + p.p + '</p></li>';
  }).join('');

  /* scope search */
  $('#all-tags').innerHTML = SCOPE.map(function (t) { return '<span>' + t + '</span>'; }).join('');
  function filterScope() {
    var q = $('#scope-q').value.trim().toLowerCase(), hits = 0;
    if (q) showAllTags();
    all('#all-tags span').forEach(function (s) {
      var on = s.textContent.toLowerCase().indexOf(q) >= 0;
      s.hidden = !on;
      if (on) hits++;
    });
    $('#scope-n').textContent = hits + ' of ' + SCOPE.length;
    $('#scope-none').hidden = hits > 0;
  }
  function showAllTags() {
    $('#all-tags').classList.remove('short');
    var b = $('#tags-more'); if (b) b.remove();
  }
  $('#tags-more').textContent = 'See all ' + SCOPE.length + ' services';
  $('#tags-more').addEventListener('click', showAllTags);
  $('#scope-q').addEventListener('input', filterScope);
  filterScope();

  /* work page */
  function filmRow(list) {
    return list.concat(list).map(function (f) { return '<span>' + pic(f, '', '(max-width:620px) 60vw, 28vw') + '</span>'; }).join('');
  }
  $('#film-a').innerHTML = filmRow(['g3', 'g2', 'g6', 'g1', 'g4', 'g8']);
  $('#film-b').innerHTML = filmRow(['i5', 'g5', 'i6', 'g7', 'i2', 'i3']);

  $('#work-full').innerHTML = WORK.map(function (w, i) {
    return '<button class="tile' + (w.c >= 5 ? ' wide' : '') + '" data-work="' + i + '" data-k="' + w.k + '" data-cur="view" style="--c:' + w.c + ';--r:' + w.r + '" aria-label="Open ' + plain(w.t) + '">' +
      pic(w.f, plain(w.t) + ', ' + w.s, '(max-width:620px) ' + (w.c >= 5 ? '100vw' : '50vw') + ', ' + Math.round(w.c / 12 * 100) + 'vw') +
      '<span class="tile-cap"><span class="kk">' + w.k + '</span><b>' + w.t + '</b></span></button>';
  }).join('') +
    '<a class="tile tile-cta wide" id="tile-cta" style="--c:5;--r:2" href="https://www.instagram.com/soumya_events_n_entertainment/" target="_blank" rel="noopener"><small>295 posts</small>More on Instagram</a>';

  var CATS = ['All'].concat(WORK.map(function (w) { return w.k; }).filter(function (k, i, a) { return a.indexOf(k) === i; }));
  $('#filters').innerHTML = CATS.map(function (c, i) {
    return '<button class="fbtn" data-c="' + c + '" aria-pressed="' + (i === 0) + '">' + c + '</button>';
  }).join('');
  $('#filters').addEventListener('click', function (e) {
    var b = e.target.closest('.fbtn'); if (!b) return;
    all('.fbtn').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    var c = b.dataset.c, on = c === 'All';
    all('#work-full .tile[data-k]').forEach(function (t) { t.hidden = !(on || t.dataset.k === c); });
    $('#tile-cta').hidden = !on;
    $('#work-full').classList.toggle('filtered', !on);
  });
  $('#archive').innerHTML = ARCHIVE.map(function (a) {
    return '<div class="arc"><span>' + pic(a.f, '', '88px') + '</span>' + a.t + '</div>';
  }).join('');

  /* reviews page */
  $('#press').innerHTML = QUOTES.map(function (q) {
    return '<figure class="pr"><div class="pr-pic reveal" aria-hidden="true">' + pic(q.f, '', '(max-width:620px) 90vw, 44vw') + '</div>' +
      '<div class="rv"><blockquote>' + q.q + '</blockquote><figcaption>Google review</figcaption></div></figure>';
  }).join('');
  $('#word-list').innerHTML = WORDS.map(function (w) {
    return '<div class="word-row rv"><b>' + w.w + '</b><p>' + w.p + '</p></div>';
  }).join('');

  /* ---------------- word splitting ---------------- */
  function split(el, cls) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          if (!n.nodeValue.trim()) return;
          var frag = document.createDocumentFragment();
          n.nodeValue.split(/(\s+)/).forEach(function (w) {
            if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
            var s = document.createElement('span');
            s.className = cls;
            s.style.setProperty('--i', i++);
            s.textContent = w;
            frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    })(el);
  }
  if (!reduced) all('[data-split]').forEach(function (h) { split(h, 'w'); });
  split($('#fill'), 'fw');
  var fillWords = all('.fw'), fillOn = 0;
  if (reduced) fillWords.forEach(function (w) { w.classList.add('on'); });

  /* ---------------- reveal: one observer for the whole document, page or not ---------------- */
  var targets = all('.rv, .reveal, .plan, [data-split], .cue');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .01 });
    targets.forEach(function (t) { io.observe(t); });

    /* clipped strips never intersect the viewport until a tile slides in, so lazy loading would
       pop images in on screen. Start their fetch as the strip approaches instead. */
    var warm = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        all('img', e.target).forEach(function (im) { im.loading = 'eager'; });
        warm.unobserve(e.target);
      });
    }, { rootMargin: '120% 0px' });
    all('[data-warm]').forEach(function (t) { warm.observe(t); });

    var chap = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        e.target.classList.toggle('on', e.isIntersecting);
        if (e.isIntersecting) all('#chap-pin span').forEach(function (s, i) { s.classList.toggle('on', i === +e.target.dataset.i); });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    all('.chap').forEach(function (c) { chap.observe(c); });

    new IntersectionObserver(function (es) {
      showSeen = es[es.length - 1].isIntersecting;
      if (showSeen) showAuto(); else { clearTimeout(showT); all('.stall').forEach(function (s) { s.classList.remove('timed'); }); }
    }, { threshold: .25 }).observe($('#showcase'));

    var count = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        all('[data-to]', e.target).forEach(runCounter);
        count.unobserve(e.target);
      });
    }, { threshold: .15 });
    count.observe($('#pass-row'));
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
    all('[data-to]').forEach(runCounter);
  }
  function runCounter(n) {
    var to = parseFloat(n.dataset.to), dec = +n.dataset.dec, suf = n.dataset.suf;
    if (reduced) { n.textContent = to.toFixed(dec) + suf; return; }
    var t0 = performance.now();
    (function step(t) {
      var k = Math.min(1, (t - t0) / 1500);
      n.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------------- pinned reel ---------------- */
  var reel = $('#reel'), track = $('#reel-track'), reelWord = $('#reel-word'), reelDist = 0;
  function layoutReel() {
    var pin = innerWidth > 1000 && fine && !reduced && $('#home').classList.contains('on');
    reel.classList.toggle('pinned', pin);
    track.style.transform = '';
    reel.style.height = '';
    reelDist = 0;
    if (!pin) return;
    reelDist = Math.max(0, track.scrollWidth - innerWidth);
    reel.style.height = (reelDist + innerHeight) + 'px';
  }
  /* a tabbed-to slide must be scrolled into the pinned frame by hand */
  track.addEventListener('focusin', function (e) {
    if (!reelDist) return;
    var s = e.target.closest('.slide, .slide-end'); if (!s) return;
    var p = Math.min(1, Math.max(0, (s.offsetLeft - innerWidth * .2) / reelDist));
    scrollTo({ top: reel.offsetTop + p * reelDist, behavior: 'auto' });
  });

  /* ---------------- scroll frame ---------------- */
  var nav = $('.nav'), tick = 0, lastY = 0, speedEls = [];
  function frame() {
    tick = 0;
    var y = scrollY, vh = innerHeight, max = root.scrollHeight - vh;
    root.style.setProperty('--prog', max > 0 ? (y / max).toFixed(4) : 0);
    nav.classList.toggle('hide', y > lastY && y > 500 && !$('#drawer').classList.contains('open'));
    lastY = y;

    if (reelDist) {
      var rr = reel.getBoundingClientRect();
      if (rr.bottom > 0 && rr.top < vh) {
        var p = Math.min(1, Math.max(0, -rr.top / reelDist));
        track.style.transform = 'translate3d(' + (-p * reelDist).toFixed(1) + 'px,0,0)';
        reelWord.style.translate = (p * -38).toFixed(2) + '% -50%';
        reel.style.setProperty('--reel', p.toFixed(4));
      }
    }

    if ($('#home').classList.contains('on')) {
      if (fillWords.length && !reduced) {
        var fr = $('#fill').getBoundingClientRect();
        var k = (vh * .85 - fr.top) / (fr.height + vh * .4);
        var want = Math.round(Math.min(1, Math.max(0, k)) * fillWords.length);
        if (want !== fillOn) {
          fillWords.forEach(function (w, i) { w.classList.toggle('on', i < want); });
          fillOn = want;
        }
      }
      var cl = $('#cue-list').getBoundingClientRect();
      $('#cue-list').style.setProperty('--fill', (Math.min(1, Math.max(0, (vh * .6 - cl.top) / cl.height)) * 100).toFixed(1) + '%');
    }

    if (fine && !reduced) {
      speedEls.forEach(function (el) {
        var r = el.getBoundingClientRect(), base = r.top - (el._py || 0);
        if (base > vh * 1.3 || base + r.height < -vh * .3) return;
        var py = (base + r.height / 2 - vh / 2) * +el.dataset.speed;
        el._py = py;
        el.style.translate = '0 ' + py.toFixed(1) + 'px';
      });
    }
  }
  addEventListener('scroll', function () { if (!tick) tick = requestAnimationFrame(frame); }, { passive: true });
  var rs = 0;
  addEventListener('resize', function () { clearTimeout(rs); rs = setTimeout(function () { layoutReel(); frame(); }, 150); });

  /* ---------------- pointer: cursor, hero depth, magnets, tilt ---------------- */
  if (fine && !reduced) {
    var cur = $('.cursor'), curT = $('#cursor-t'), cx = -100, cy = -100, tx = -100, ty = -100, curRun = false;
    (function moveCursor() {
      curRun = Math.abs(tx - cx) + Math.abs(ty - cy) > .2;
      cx += (tx - cx) * .22; cy += (ty - cy) * .22;
      cur.style.translate = cx.toFixed(1) + 'px ' + cy.toFixed(1) + 'px';
      if (curRun) requestAnimationFrame(moveCursor); else moveCursor.idle = true;
      window.__se_cur = moveCursor;
    })();
    addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!curRun && window.__se_cur) { curRun = true; requestAnimationFrame(window.__se_cur); }
      var v = e.target.closest ? e.target.closest('[data-cur]') : null;
      var l = e.target.closest ? e.target.closest('a,button,input,select,textarea') : null;
      cur.classList.toggle('view', !!v);
      cur.classList.toggle('link', !v && !!l);
      curT.textContent = v ? 'View' : '';
    }, { passive: true });

    var heroEl = $('.hero'), depths = all('[data-depth]', heroEl);
    heroEl.addEventListener('pointermove', function (e) {
      var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      depths.forEach(function (d) {
        var k = +d.dataset.depth;
        d.style.translate = (-x * k).toFixed(1) + 'px ' + (-y * k).toFixed(1) + 'px';
      });
    }, { passive: true });

    all('[data-mag]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) / r.width * 12).toFixed(1) + 'px ' +
          ((e.clientY - r.top - r.height / 2) / r.height * 10).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', function () { b.style.translate = ''; });
    });

    $('#work-full').addEventListener('pointermove', function (e) {
      var t = e.target.closest('.tile'); if (!t) return;
      var r = t.getBoundingClientRect();
      t.style.setProperty('--rx', ((.5 - (e.clientY - r.top) / r.height) * 7).toFixed(2) + 'deg');
      t.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 7).toFixed(2) + 'deg');
    });
    $('#work-full').addEventListener('pointerout', function (e) {
      var t = e.target.closest('.tile');
      if (t && !t.contains(e.relatedTarget)) { t.style.removeProperty('--rx'); t.style.removeProperty('--ry'); }
    });

    var typeFloat = $('#type-float'), typeLast = -1;
    $('#type-list').addEventListener('pointermove', function (e) {
      var row = e.target.closest('.type'); if (!row) return;
      var i = +row.dataset.i;
      typeFloat.style.translate = (e.clientX + 24) + 'px ' + (e.clientY - 110) + 'px';
      typeFloat.classList.add('on');
      if (i !== typeLast) {
        all('span', typeFloat).forEach(function (s, n) { s.classList.toggle('on', n === i); });
        typeLast = i;
      }
    }, { passive: true });
    $('#type-list').addEventListener('pointerleave', function () { typeFloat.classList.remove('on'); typeLast = -1; });

    var stalls = $('#stalls');
    stalls.addEventListener('pointerenter', function () { clearTimeout(showT); all('.stall').forEach(function (s) { s.classList.remove('timed'); }); });
    stalls.addEventListener('pointerleave', showAuto);
  }

  /* ---------------- lightbox ---------------- */
  var lb = $('#lb'), lbI = 0, swipeX = null;
  function lbList() {
    return all('#work-full .tile[data-work]').filter(function (t) { return !t.hidden; }).map(function (t) { return +t.dataset.work; });
  }
  function lbShow(i) {
    lbI = i;
    var w = WORK[i];
    $('#lb-frame').innerHTML = pic(w.f, plain(w.t) + ', ' + w.s, '100vw', true);
    $('#lb-cap').innerHTML = '<b>' + w.t + '</b> / ' + w.s;
  }
  function lbStep(d) {
    var list = lbList(), at = list.indexOf(lbI);
    if (at < 0) at = 0;
    lbShow(list[(at + d + list.length) % list.length]);
  }
  document.addEventListener('click', function (e) {
    var c = e.target.closest ? e.target.closest('[data-work]') : null;
    if (!c) return;
    lbShow(+c.dataset.work);
    lb.showModal();
    root.style.overflow = 'hidden';
  });
  lb.addEventListener('close', function () { root.style.overflow = ''; $('#lb-frame').innerHTML = ''; });
  $('#lb-x').addEventListener('click', function () { lb.close(); });
  $('#lb-prev').addEventListener('click', function () { lbStep(-1); });
  $('#lb-next').addEventListener('click', function () { lbStep(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') lbStep(-1);
    if (e.key === 'ArrowRight') lbStep(1);
  });
  lb.addEventListener('touchstart', function (e) { swipeX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (swipeX === null) return;
    var dx = e.changedTouches[0].clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ---------------- drawer ---------------- */
  var burger = $('#burger'), drawer = $('#drawer');
  function setDrawer(open) {
    drawer.classList.toggle('open', open);
    drawer.inert = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    root.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setDrawer(!drawer.classList.contains('open')); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('open')) { setDrawer(false); burger.focus(); } });
  all('.drawer nav a').forEach(function (a, i) { a.style.setProperty('--i', i); });

  /* ---------------- router ---------------- */
  var PAGES = ['home', 'capabilities', 'work', 'reviews', 'contact'], current = null;
  function pageFromHash() {
    var id = location.hash.replace('#/', '');
    return PAGES.indexOf(id) < 0 ? 'home' : id;
  }
  function show(id, focus) {
    current = id;
    PAGES.forEach(function (p) { $('#' + p).classList.toggle('on', p === id); });
    all('a[href^="#/"]').forEach(function (a) {
      if (a.getAttribute('href') === '#/' + id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    document.title = $('#' + id).dataset.title.replace('&amp;', '&') + ' | Soumya Events and Entertainment';
    setDrawer(false);
    scrollTo({ top: 0, behavior: 'auto' });
    lastY = 0;
    nav.classList.remove('hide');
    speedEls = all('.page.on [data-speed]');
    layoutReel();
    frame();
    if (focus) $('#main').focus({ preventScroll: true });
  }
  var wipe = $('.wipe');
  addEventListener('hashchange', function () {
    /* the skip link's #main is not a route */
    if (location.hash.indexOf('#/') !== 0) return;
    var id = pageFromHash();
    if (id === current) return;
    if (reduced) { show(id, true); return; }
    $('#wipe-t').textContent = id === 'home' ? 'Soumya Events' : id;
    wipe.classList.remove('run'); void wipe.offsetWidth; wipe.classList.add('run');
    setTimeout(function () { show(id, true); }, 340);
  });
  /* a link to the page already open has no hashchange, so give it a job */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#/"]') : null;
    if (a && a.getAttribute('href') === '#/' + current) { setDrawer(false); scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }
  });
  $('#totop').addEventListener('click', function () { scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });

  /* ---------------- live event themes ---------------- */
  var dots = $('#dots');
  dots.innerHTML = THEMES.map(function (t) {
    return '<button role="radio" aria-checked="false" data-k="' + t.k + '" title="' + t.n + ' theme" aria-label="' + t.n + ' theme" style="background:' + t.c + ';color:' + t.c + '"></button>';
  }).join('');
  function fillUrl(f) {
    /* the word is a texture behind an accent wash, so a phone can take the small file */
    var w = IMG[f].w, pick = innerWidth <= 620 ? w[0] : (w.indexOf(960) >= 0 ? 960 : w[w.length - 1]);
    return 'url("assets/img/' + f + '-' + pick + '.webp")';
  }
  function paint(k) {
    var t = THEMES.filter(function (x) { return x.k === k; })[0] || THEMES[0];
    root.dataset.ev = t.k;
    all('button', dots).forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.k === t.k)); });
    var word = $('#hero-word');
    word.textContent = t.word;
    word.style.setProperty('--n', t.word.length);
    word.style.setProperty('--fill', fillUrl(t.fill));
    setFrame($('#hf-arch'), t.arch, '(max-width:1000px) 66vw, 44vw');
    setFrame($('#hf-disc'), t.disc, '(max-width:1000px) 40vw, 18vw');
    setFrame($('#hf-chip'), t.chip, '120px');
    setFrame($('#hf-inl'), t.inl, '(max-width:1000px) 50vw, 28vw');
    try { localStorage.setItem('se-ev', t.k); } catch (e) { }
  }
  dots.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    paint(b.dataset.k);
    if (reduced) return;
    var r = b.getBoundingClientRect(), w = document.createElement('div');
    w.className = 'ripple';
    w.style.left = (r.left + r.width / 2) + 'px';
    w.style.top = (r.top + r.height / 2) + 'px';
    document.body.appendChild(w);
    setTimeout(function () { w.remove(); }, 950);
  });
  var saved; try { saved = localStorage.getItem('se-ev'); } catch (e) { }
  paint(saved || 'corporate');

  /* ---------------- brief -> WhatsApp ---------------- */
  $('#brief').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, err = $('#err');
    var nm = f.nm.value.trim(), ph = f.ph.value.trim();
    if (!nm) { err.textContent = 'Please add your name.'; f.nm.focus(); return; }
    if (ph.replace(/\D/g, '').length < 7) { err.textContent = 'Please add a phone number we can reach you on.'; f.ph.focus(); return; }
    err.textContent = '';
    var L = ['Hello Soumya Events, I would like a proposal.', '', 'Name: ' + nm];
    if (f.co.value.trim()) L.push('Company: ' + f.co.value.trim());
    L.push('Phone: ' + ph);
    if (f.em.value.trim()) L.push('Email: ' + f.em.value.trim());
    L.push('Event: ' + f.ty.value);
    if (f.dt.value) L.push('Date: ' + f.dt.value);
    if (f.ct.value.trim()) L.push('City/venue: ' + f.ct.value.trim());
    if (f.ms.value.trim()) L.push('', f.ms.value.trim());
    open('https://wa.me/919971970165?text=' + encodeURIComponent(L.join('\n')), '_blank', 'noopener');
  });

  $('#yr').textContent = new Date().getFullYear();
  show(pageFromHash(), false);

  /* self-check */
  (function () {
    PAGES.forEach(function (p) { if (!$('#' + p)) console.error('[soumya] missing page:', p); });
    if (all('.page.on').length !== 1) console.error('[soumya] router opened', all('.page.on').length, 'pages');
    WORK.concat(ARCHIVE, REEL, CAPS, TYPES, LAYOUTS, CASES).forEach(function (w) { if (!IMG[w.f]) console.error('[soumya] photo not in manifest:', w.f); });
    if (all('#work-full .tile[data-work]').length !== WORK.length) console.error('[soumya] work tile count mismatch');
    all('use').forEach(function (u) {
      var id = (u.getAttribute('href') || '').slice(1);
      if (id && !document.getElementById(id)) console.error('[soumya] missing icon symbol:', id);
    });
    document.addEventListener('error', function (e) {
      if (e.target.tagName === 'IMG') console.error('[soumya] image failed:', e.target.currentSrc || e.target.src);
    }, true);
  })();
})();
