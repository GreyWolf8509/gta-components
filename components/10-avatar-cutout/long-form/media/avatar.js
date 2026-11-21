/*
 * Avatar: our own illustrated presenter bust as a die-cut vinyl sticker (SVG, no images).
 * Avatar.build(colors) -> SVG markup string. Art space: x 0..600, y -20..840 (the bust runs off the bottom).
 * Groups you can animate (GSAP, svgOrigin in art space):
 *   #avHead  head + face + hair + headset (pivot 300 520)     #avHair  hair (pivot 300 240)
 *   #avBody  hoodie torso                                      #avStrL / #avStrR  drawstrings (pivot at top)
 *   #avEyesT / #avEyesS   talk / shock eyes                    #avLids  blink lids
 *   #avBrowsT / #avBrowsS talk / shock brows                   #avMC #avMA #avMO #avME #avMS  mouths
 *   #avSweat  sweat drop                                       #avShock  shock marks (.avWedge each)
 *   #avGloss  laminate light band (translate x -900 .. 900)    .avRimPart  warm rim light (opacity)
 * Look: thick ink outline; per part a base gradient + hard cel shadow + warm rim crescent; a white die-cut
 * border with a grey vinyl edge (thickness) and a soft contact shadow, all from one SVG filter on #av.
 */
(function (root) {
  'use strict';
  var INK = '#15110E';
  function P(id, d) { return '<path id="p-' + id + '" d="' + d + '"/>'; }
  function mid(id, dx, dy) { return 'm-' + id + '-' + dx + '_' + dy; }
  // crescent mask: the shape minus itself shifted, i.e. a shaded or lit rim of constant width
  function crescent(id, dx, dy) {
    return '<mask id="' + mid(id, dx, dy) + '" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1000" height="1300">' +
      '<use href="#p-' + id + '" fill="#fff"/><use href="#p-' + id + '" fill="#000" transform="translate(' + dx + ' ' + dy + ')"/></mask>';
  }
  function part(id, base, shadow, sd, rim, rd, sw, hot) {
    var s = '<use href="#p-' + id + '" fill="' + base + '"/>';
    if (shadow) s += '<g mask="url(#' + mid(id, sd[0], sd[1]) + ')"><use href="#p-' + id + '" fill="' + shadow + '"/></g>';
    if (rim) s += '<g class="avRimPart" mask="url(#' + mid(id, rd[0], rd[1]) + ')"><use href="#p-' + id + '" fill="' + rim + '"/></g>';
    if (hot) s += '<g class="avHot" opacity="0" mask="url(#' + mid(id, -24, 4) + ')"><use href="#p-' + id + '" fill="' + hot + '"/></g>';
    if (sw !== 0) s += '<use href="#p-' + id + '" fill="none" stroke="' + INK + '" stroke-width="' + (sw || 9) + '" stroke-linejoin="round"/>';
    return s;
  }
  function stroke(d, w, col, extra) {
    return '<path d="' + d + '" fill="none" stroke="' + (col || INK) + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '/>';
  }

  function build(C) {
    C = C || {};
    var hood = C.hoodie || ['#FFE58A', '#FFC93A', '#E0901A'];      // light, base, cel shadow
    var skin = C.skin || ['#FFDCC2', '#F4BC94', '#D98B68'];
    var hair = C.hair || ['#6A432C', '#3C2518', '#22140C'];
    var gear = C.gear || ['#565F72', '#2B303B', '#171A21'];
    var acc = C.accent || '#33D6FF';
    var rim = C.rim || '#FFC27E';
    var iris = C.iris || ['#9A6236', '#40240F'];

    var paths =
      P('head', 'M300 114 C400 114 474 186 476 298 C478 384 452 452 402 492 C366 520 234 520 198 492 C148 452 122 384 124 298 C126 186 200 114 300 114 Z') +
      P('neck', 'M240 470 L360 470 L360 548 C348 584 324 614 300 634 C276 614 252 584 240 548 Z') +
      P('body', 'M14 1000 C14 840 32 700 70 650 C92 620 116 602 144 588 C192 568 236 556 300 556 C364 556 408 568 456 588 C484 602 508 620 530 650 C568 700 586 840 586 1000 Z') +
      P('hood', 'M140 596 C150 546 210 518 300 518 C390 518 450 546 460 596 C446 628 384 652 300 682 C216 652 154 628 140 596 Z') +
      P('hair', 'M128 300 C110 240 112 170 140 128 C130 110 130 92 136 78 C152 86 164 88 176 84 C178 50 196 22 224 8 C228 26 236 34 246 38 C262 6 298 -14 334 -12 C326 6 326 18 332 28 C358 8 398 4 426 18 C416 32 414 44 418 56 C452 70 478 108 484 160 C494 172 500 182 502 196 C490 198 484 200 480 202 C482 236 476 270 466 304 C460 262 448 232 432 212 C416 222 396 226 372 220 C378 212 380 202 378 192 C350 208 306 214 270 206 C276 200 278 190 276 180 C244 198 210 210 182 226 C160 244 140 272 128 300 Z') +
      P('armL', 'M-44 1000 L-30 860 C-26 770 -2 690 26 620 L122 620 C104 690 92 770 90 860 L96 1000 Z') +
      P('armR', 'M644 1000 L630 860 C626 770 602 690 574 620 L478 620 C496 690 508 770 510 860 L504 1000 Z') +
      P('armP', 'M440 1000 L452 860 C470 770 512 700 566 646 L640 704 C600 750 570 806 560 860 L552 1000 Z') +
      P('handO', 'M-30 0 C-34 -20 -42 -42 -44 -60 C-58 -62 -74 -72 -78 -88 C-80 -100 -68 -106 -58 -98 C-50 -92 -44 -84 -38 -80 L-40 -120 C-40 -136 -18 -136 -18 -120 L-17 -86 L-14 -132 C-14 -148 8 -148 8 -132 L7 -86 L12 -124 C12 -140 34 -140 34 -124 L30 -82 L38 -106 C40 -120 58 -118 56 -104 L48 -58 C44 -34 38 -16 30 0 Z') +
      P('handP', 'M0 -34 C14 -44 44 -46 60 -38 L112 -40 C128 -40 130 -18 114 -16 L68 -14 C74 -6 74 6 66 12 C72 18 72 30 62 34 C58 44 46 46 36 44 C20 44 6 38 0 30 Z') +
      P('cupL', 'M94 270 C94 250 106 238 126 238 L146 238 C164 238 174 250 174 270 L174 350 C174 370 164 382 146 382 L126 382 C106 382 94 370 94 350 Z') +
      P('cupR', 'M426 270 C426 250 436 238 454 238 L474 238 C494 238 506 250 506 270 L506 350 C506 370 494 382 474 382 L454 382 C436 382 426 370 426 350 Z');

    var masks = crescent('head', -34, -26) + crescent('head', -12, 0) + crescent('neck', 0, -30) + crescent('body', -40, -46) + crescent('body', -13, 0) +
      crescent('hood', 0, -24) + crescent('hood', -11, 0) + crescent('hair', -24, -30) + crescent('hair', -10, 0) + crescent('cupL', -12, -12) + crescent('cupR', -12, -12) + crescent('cupR', -9, 0) +
      crescent('head', -24, 4) + crescent('hood', -24, 4) + crescent('body', -24, 4) + crescent('cupR', -24, 4) + crescent('hair', -24, 4) +
      crescent('armL', -26, -10) + crescent('armR', -26, -10) + crescent('armR', -12, 0) + crescent('armP', -12, 0) + crescent('armP', -24, -24) + crescent('armR', -24, 4) + crescent('armP', -24, 4) +
      crescent('handO', -18, -14) + crescent('handP', -14, -16);

    var MA = 'M254 432 C276 440 324 440 346 432 C344 476 318 494 300 494 C282 494 256 476 254 432 Z';
    var ME = 'M244 426 C280 438 320 438 356 426 C350 460 326 476 300 476 C274 476 250 460 244 426 Z';
    var MS = 'M240 414 C274 404 326 404 360 414 C372 470 342 510 300 510 C258 510 228 470 240 414 Z';

    var defs = '<defs>' + paths + masks +
      '<radialGradient id="g-skin" cx="0.36" cy="0.34" r="0.78"><stop offset="0" stop-color="' + skin[0] + '"/><stop offset="0.62" stop-color="' + skin[1] + '"/></radialGradient>' +
      '<radialGradient id="g-hood" cx="0.32" cy="0.12" r="0.95"><stop offset="0" stop-color="' + hood[0] + '"/><stop offset="0.55" stop-color="' + hood[1] + '"/></radialGradient>' +
      '<linearGradient id="g-hair" x1="0.1" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="' + hair[0] + '"/><stop offset="0.55" stop-color="' + hair[1] + '"/></linearGradient>' +
      '<linearGradient id="g-gear" x1="0" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="' + gear[0] + '"/><stop offset="0.65" stop-color="' + gear[1] + '"/></linearGradient>' +
      '<radialGradient id="g-iris" cx="0.4" cy="0.32" r="0.72"><stop offset="0" stop-color="' + iris[0] + '"/><stop offset="1" stop-color="' + iris[1] + '"/></radialGradient>' +
      '<radialGradient id="g-eyew" cx="0.42" cy="0.36" r="0.72"><stop offset="0.6" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCE2EE"/></radialGradient>' +
      '<linearGradient id="g-gloss" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.38" stop-color="#fff" stop-opacity="0.08"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.46"/><stop offset="0.62" stop-color="#fff" stop-opacity="0.08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<clipPath id="c-mouthA"><path d="' + MA + '"/></clipPath>' +
      '<clipPath id="c-mouthE"><path d="' + ME + '"/></clipPath>' +
      '<clipPath id="c-mouthS"><path d="' + MS + '"/></clipPath>' +
      '<clipPath id="c-mouthL"><path d="M236 418 C278 432 322 432 364 418 C362 478 330 510 300 510 C270 510 238 478 236 418 Z"/></clipPath>' +
      '<clipPath id="c-head"><use href="#p-head"/></clipPath>' +
      '<clipPath id="c-neck"><use href="#p-neck"/></clipPath>' +
      '<clipPath id="c-body"><use href="#p-body"/></clipPath>' +
      '<clipPath id="c-sil"><use href="#p-head"/><use href="#p-body"/><use href="#p-hair"/><use href="#p-cupL"/><use href="#p-cupR"/><use href="#p-hood"/></clipPath>' +
      // the sticker: white die-cut border (dilate + blur + threshold = a round contour), grey vinyl edge below it, soft contact shadow
      '<filter id="f-sticker" x="-14%" y="-14%" width="128%" height="128%" color-interpolation-filters="sRGB">' +
        '<feMorphology in="SourceAlpha" operator="dilate" radius="12" result="d"/>' +
        '<feGaussianBlur in="d" stdDeviation="4" result="db"/>' +
        '<feComponentTransfer in="db" result="cut"><feFuncA type="linear" slope="5" intercept="-1.6"/></feComponentTransfer>' +
        '<feOffset in="cut" dx="3" dy="9" result="cutO"/>' +
        '<feGaussianBlur in="cutO" stdDeviation="16" result="shb"/>' +
        '<feOffset in="shb" dx="10" dy="18" result="sho"/>' +
        '<feComponentTransfer in="sho" result="sh"><feFuncA type="linear" slope="0.6"/></feComponentTransfer>' +
        '<feFlood flood-color="#05070C" result="blk"/><feComposite in="blk" in2="sh" operator="in" result="shadow"/>' +
        '<feFlood flood-color="#7E869A" result="eg"/><feComposite in="eg" in2="cutO" operator="in" result="edge"/>' +
        '<feFlood flood-color="#FFFFFF" result="wh"/><feComposite in="wh" in2="cut" operator="in" result="white"/>' +
        '<feMerge><feMergeNode in="shadow"/><feMergeNode in="edge"/><feMergeNode in="white"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>' +
      '</defs>';

    var g = '';
    // ---------- body ----------
    g += '<g id="avBody">';
    g += part('body', 'url(#g-hood)', hood[2], [-40, -46], rim, [-13, 0], 0, '#FFF3C4');
    // hood casts a soft fold shadow onto the chest
    g += '<g clip-path="url(#c-body)"><use href="#p-hood" fill="' + hood[2] + '" opacity="0.7" transform="translate(6 22)"/></g>';
    // sleeve seams
    g += stroke('M112 652 C126 720 132 820 134 1000', 7, INK, ' opacity="0.5"') + stroke('M488 652 C474 720 468 820 466 1000', 7, INK, ' opacity="0.5"');
    g += '<use href="#p-body" fill="none" stroke="' + INK + '" stroke-width="9" stroke-linejoin="round"/>';
    g += part('hood', 'url(#g-hood)', hood[2], [0, -24], rim, [-11, 0], 9, '#FFF3C4');
    g += part('neck', skin[2], '#C47A59', [0, -30], null, null);
    // chin cast shadow on the neck
    g += '<g clip-path="url(#c-neck)"><use href="#p-head" fill="#A9603F" opacity="0.55" transform="translate(0 28)"/></g>';
    g += '<use href="#p-neck" fill="none" stroke="' + INK + '" stroke-width="9" stroke-linejoin="round"/>';
    // drawstrings with aglets
    ['L', 'R'].forEach(function (s) {
      var x0 = s === 'L' ? 284 : 316, x1 = s === 'L' ? 274 : 326, y1 = 700, d = 'M' + x0 + ' 624 C' + (x0 + (s === 'L' ? -6 : 6)) + ' 656 ' + x1 + ' 676 ' + x1 + ' ' + y1;
      g += '<g id="avStr' + s + '">' + stroke(d, 16) + stroke(d, 6, '#F7F4EC');
      g += '<rect x="' + (x1 - 10) + '" y="' + (y1 - 6) + '" width="20" height="32" rx="8" fill="' + acc + '" stroke="' + INK + '" stroke-width="6"/>';
      g += '<rect x="' + (x1 - 5) + '" y="' + (y1 - 1) + '" width="5" height="18" rx="2.5" fill="#fff" opacity="0.8"/></g>';
    });
    g += '</g>';

    // ---------- head ----------
    g += '<g id="avHead"><g id="avBob">';
    g += part('head', 'url(#g-skin)', skin[2], [-34, -26], rim, [-12, 0], 0, '#FFE8CC');
    // hair casts a shadow on the forehead
    g += '<g clip-path="url(#c-head)"><use href="#p-hair" fill="#C57B58" opacity="0.62" transform="translate(8 22)"/></g>';
    g += '<use href="#p-head" fill="none" stroke="' + INK + '" stroke-width="9" stroke-linejoin="round"/>';
    // cheeks
    g += '<ellipse cx="196" cy="408" rx="30" ry="15" fill="#FF6F7D" opacity="0.4"/><ellipse cx="404" cy="408" rx="30" ry="15" fill="#FF6F7D" opacity="0.4"/>';
    // nose
    g += '<path d="M296 388 C290 400 296 410 312 406" fill="none" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>';
    g += stroke('M304 352 C298 368 294 380 294 390', 7, INK, ' opacity="0.0"');

    // eyes: talk
    g += '<g id="avEyesT">';
    [[236, 330], [364, 330]].forEach(function (e) {
      var x = e[0], y = e[1];
      g += '<ellipse cx="' + x + '" cy="' + y + '" rx="44" ry="51" fill="url(#g-eyew)" stroke="' + INK + '" stroke-width="8"/>';
      g += '<g class="avIris"><circle cx="' + (x + 10) + '" cy="' + (y + 6) + '" r="26" fill="url(#g-iris)"/>' +
        '<circle cx="' + (x + 10) + '" cy="' + (y + 6) + '" r="13" fill="#120A06"/>' +
        '<circle cx="' + (x + 1) + '" cy="' + (y - 5) + '" r="8.5" fill="#fff"/><circle cx="' + (x + 20) + '" cy="' + (y + 16) + '" r="3.6" fill="#fff"/></g>';
      g += stroke('M' + (x - 45) + ' ' + (y - 2) + ' C' + (x - 42) + ' ' + (y - 58) + ' ' + (x + 42) + ' ' + (y - 58) + ' ' + (x + 45) + ' ' + (y - 2), 13);
    });
    g += '</g>';
    // blink lids
    g += '<g id="avLids">';
    [[236, 330], [364, 330]].forEach(function (e) {
      var x = e[0], y = e[1];
      g += '<path d="M' + (x - 49) + ' ' + y + ' C' + (x - 46) + ' ' + (y - 62) + ' ' + (x + 46) + ' ' + (y - 62) + ' ' + (x + 49) + ' ' + y + ' C' + (x + 42) + ' ' + (y + 56) + ' ' + (x - 42) + ' ' + (y + 56) + ' ' + (x - 49) + ' ' + y + ' Z" fill="' + skin[1] + '"/>';
      g += stroke('M' + (x - 42) + ' ' + (y + 6) + ' C' + (x - 20) + ' ' + (y + 22) + ' ' + (x + 20) + ' ' + (y + 22) + ' ' + (x + 42) + ' ' + (y + 6), 11);
    });
    g += '</g>';
    // eyes: shock (huge whites, pin pupils)
    g += '<g id="avEyesS">';
    [[232, 318], [368, 318]].forEach(function (e) {
      var x = e[0], y = e[1];
      g += '<ellipse cx="' + x + '" cy="' + y + '" rx="54" ry="66" fill="url(#g-eyew)" stroke="' + INK + '" stroke-width="10"/>';
      g += '<circle cx="' + (x + 4) + '" cy="' + (y + 6) + '" r="15" fill="url(#g-iris)"/><circle cx="' + (x + 4) + '" cy="' + (y + 6) + '" r="9" fill="#120A06"/><circle cx="' + (x) + '" cy="' + y + '" r="4" fill="#fff"/>';
    });
    g += '</g>';

    // eyes: laugh (squeezed shut, happy tears)
    g += '<g id="avEyesL">';
    [[236, 334, 1], [364, 334, -1]].forEach(function (e) {
      var x = e[0], y = e[1], sgn = e[2];
      g += stroke('M' + (x - 40) + ' ' + (y + 8) + ' C' + (x - 24) + ' ' + (y - 30) + ' ' + (x + 24) + ' ' + (y - 30) + ' ' + (x + 40) + ' ' + (y + 8), 14);
      var tx = x - sgn * 46;
      g += '<path d="M' + tx + ' ' + (y + 6) + ' C' + (tx - sgn * 10) + ' ' + (y + 22) + ' ' + (tx - sgn * 16) + ' ' + (y + 34) + ' ' + (tx - sgn * 14) + ' ' + (y + 44) + ' C' + (tx - sgn * 12) + ' ' + (y + 54) + ' ' + (tx + sgn * 2) + ' ' + (y + 54) + ' ' + (tx + sgn * 4) + ' ' + (y + 44) + ' C' + (tx + sgn * 6) + ' ' + (y + 32) + ' ' + (tx + sgn * 2) + ' ' + (y + 20) + ' ' + tx + ' ' + (y + 6) + ' Z" fill="#BFEFFF" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>';
    });
    g += '</g>';
    // mouths
    g += '<g id="avMC">' + stroke('M254 438 C278 462 322 462 346 436', 10) + stroke('M248 430 C253 434 255 440 255 446', 7) + stroke('M352 428 C347 432 345 438 345 444', 7) + '</g>';
    g += '<g id="avMA"><path d="' + MA + '" fill="#5A1418"/><g clip-path="url(#c-mouthA)"><rect x="240" y="420" width="120" height="24" fill="#fff"/><ellipse cx="300" cy="498" rx="36" ry="24" fill="#E8606A"/></g>' +
      '<path d="' + MA + '" fill="none" stroke="' + INK + '" stroke-width="9" stroke-linejoin="round"/></g>';
    g += '<g id="avMO"><ellipse cx="300" cy="450" rx="22" ry="27" fill="#5A1418"/><ellipse cx="300" cy="471" rx="15" ry="9" fill="#E8606A"/>' +
      '<ellipse cx="300" cy="450" rx="22" ry="27" fill="none" stroke="' + INK + '" stroke-width="9"/></g>';
    g += '<g id="avME"><path d="' + ME + '" fill="#5A1418"/><g clip-path="url(#c-mouthE)"><rect x="236" y="414" width="128" height="28" fill="#fff"/><ellipse cx="300" cy="480" rx="32" ry="17" fill="#E8606A"/></g>' +
      '<path d="' + ME + '" fill="none" stroke="' + INK + '" stroke-width="9" stroke-linejoin="round"/></g>';
    g += '<g id="avML"><path d="M236 418 C278 432 322 432 364 418 C362 478 330 510 300 510 C270 510 238 478 236 418 Z" fill="#4A0F14"/><g clip-path="url(#c-mouthL)"><rect x="226" y="408" width="148" height="30" fill="#fff"/><ellipse cx="300" cy="514" rx="46" ry="30" fill="#E8606A"/></g>' +
      '<path d="M236 418 C278 432 322 432 364 418 C362 478 330 510 300 510 C270 510 238 478 236 418 Z" fill="none" stroke="' + INK + '" stroke-width="10" stroke-linejoin="round"/></g>';
    g += '<g id="avMS"><path d="' + MS + '" fill="#4A0F14"/><g clip-path="url(#c-mouthS)"><rect x="226" y="398" width="148" height="30" fill="#fff"/><ellipse cx="300" cy="516" rx="48" ry="30" fill="#E8606A"/></g>' +
      '<path d="' + MS + '" fill="none" stroke="' + INK + '" stroke-width="10" stroke-linejoin="round"/></g>';

    // hair (with its own spring group)
    g += '<g id="avHair">' + part('hair', 'url(#g-hair)', hair[2], [-24, -30], '#8E5C3C', [-10, 0], 9, '#F0974A');
    g += stroke('M300 140 C318 170 330 190 340 206', 6, hair[2], ' opacity="0.9"') + stroke('M226 150 C236 174 248 190 262 200', 6, hair[2], ' opacity="0.9"') + stroke('M398 150 C412 172 422 192 428 208', 6, hair[2], ' opacity="0.9"');
    g += stroke('M196 104 C226 70 280 52 328 60', 11, '#9A6B4C', ' opacity="0.9"') + stroke('M352 64 C384 64 418 80 436 102', 9, '#9A6B4C', ' opacity="0.85"');
    g += '</g>';
    // brows sit on top of the fringe
    g += '<g id="avBrowsT" fill="none" stroke="#24150C" stroke-width="18" stroke-linecap="round">' +
      '<path d="M190 262 C208 246 248 244 272 256"/><path d="M328 256 C352 244 392 246 410 262"/></g>';
    g += '<g id="avBrowsL" fill="none" stroke="#24150C" stroke-width="18" stroke-linecap="round">' +
      '<path d="M192 252 C210 230 248 228 272 242"/><path d="M328 242 C352 228 390 230 408 252"/></g>';
    g += '<g id="avBrowsS" fill="none" stroke="#24150C" stroke-width="18" stroke-linecap="round">' +
      '<path d="M184 240 C200 212 244 206 270 222"/><path d="M330 222 C356 206 400 212 416 240"/></g>';

    // headset: band over the hair, cups, boom mic
    g += '<g id="avSet">';
    var band = 'M134 266 C122 118 204 40 300 38 C396 40 478 118 466 266';
    g += stroke(band, 40) + stroke(band, 22, gear[1]) + stroke('M148 168 C172 100 232 58 300 56', 6, gear[0]);
    var boom = 'M124 362 C136 428 178 462 230 462';
    g += '<g id="avMic">' + stroke(boom, 19) + stroke(boom, 8, gear[1]);
    g += '<rect x="216" y="446" width="42" height="32" rx="16" fill="' + gear[2] + '" stroke="' + INK + '" stroke-width="8"/><rect x="224" y="452" width="17" height="7" rx="3.5" fill="' + gear[0] + '"/></g>';
    g += part('cupL', 'url(#g-gear)', gear[2], [-12, -12], null, null);
    g += part('cupR', 'url(#g-gear)', gear[2], [-12, -12], rim, [-9, 0], 9, '#C9803E');
    // accent rings + a soft specular on each cup
    g += '<rect x="108" y="256" width="18" height="108" rx="9" fill="' + acc + '" stroke="' + INK + '" stroke-width="5"/>';
    g += '<rect x="474" y="256" width="18" height="108" rx="9" fill="' + acc + '" stroke="' + INK + '" stroke-width="5"/>';
    g += stroke('M142 254 C154 254 160 262 160 274', 6, '#9AA6BE', ' opacity="0.8"') + stroke('M440 254 C452 254 458 262 458 274', 6, '#9AA6BE', ' opacity="0.8"');
    g += '</g>';
    // sweat drop
    g += '<g id="avSweat"><path d="M420 190 C408 208 400 222 400 234 C400 248 410 256 420 256 C430 256 440 248 440 234 C440 222 432 208 420 190 Z" fill="#CFF4FF" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
      stroke('M412 230 C412 224 415 218 418 214', 5, '#fff') + '</g>';
    g += '</g></g>'; // bob, head

    // arms: SHOCK pose (both hands up beside the face) and LAUGH pose (pointing at the gameplay)
    function hand(kind, tx, ty, rot, flip) {
      var id = kind === 'O' ? 'handO' : 'handP';
      var h = '<g transform="translate(' + tx + ' ' + ty + ') rotate(' + rot + ')' + (flip ? ' scale(-1 1)' : '') + ' scale(1.36)">';
      h += part(id, 'url(#g-skin)', skin[2], kind === 'O' ? [-18, -14] : [-14, -16], null, null, 8);
      if (kind === 'O') h += stroke('M-22 -46 C-10 -36 10 -36 24 -48', 5, INK, ' opacity="0.55"') + stroke('M-34 -70 C-30 -66 -26 -62 -24 -56', 5, INK, ' opacity="0.5"');
      else h += stroke('M44 -16 C52 -14 58 -12 66 -8', 5, INK, ' opacity="0.6"') + stroke('M42 14 C50 16 56 16 62 14', 5, INK, ' opacity="0.6"') + stroke('M14 -30 C30 -24 44 -20 58 -22', 6, INK, ' opacity="0.7"');
      return h + '</g>';
    }
    function cuff(x0, y0, x1, y1) {
      return '<path d="M' + x0 + ' ' + y0 + ' L' + x1 + ' ' + y1 + '" stroke="' + INK + '" stroke-width="40" stroke-linecap="round"/>' +
        '<path d="M' + x0 + ' ' + y0 + ' L' + x1 + ' ' + y1 + '" stroke="' + hood[2] + '" stroke-width="24" stroke-linecap="round"/>';
    }
    g += '<g id="avArmsS">';
    g += '<g clip-path="url(#c-body)"><use href="#p-armL" fill="' + hood[2] + '" opacity="0.55" transform="translate(16 10)"/><use href="#p-armR" fill="' + hood[2] + '" opacity="0.55" transform="translate(16 10)"/></g>';
    g += '<g id="avArmSL">' + part('armL', 'url(#g-hood)', hood[2], [-26, -10], null, null) + cuff(34, 622, 114, 622) + hand('O', 74, 610, -16, true) + '</g>';
    g += '<g id="avArmSR">' + part('armR', 'url(#g-hood)', hood[2], [-26, -10], rim, [-12, 0], 9, '#FFF3C4') + cuff(486, 622, 566, 622) + hand('O', 526, 610, 16, false) + '</g>';
    g += '</g>';
    g += '<g id="avArmP"><g clip-path="url(#c-body)"><use href="#p-armP" fill="' + hood[2] + '" opacity="0.55" transform="translate(-18 14)"/></g>' + part('armP', 'url(#g-hood)', hood[2], [-24, -24], rim, [-12, 0], 9, '#FFF3C4') + cuff(572, 656, 630, 698) + hand('P', 604, 672, -34, false) + '</g>';

    // shock marks: short tapered ink strokes off the head (comic emanata)
    g += '<g id="avShock">';
    [[22, 58], [43, 68], [64, 50], [-22, 58], [-43, 68], [-64, 50]].forEach(function (w) {
      var r0 = 272, len = w[1] + 6;
      g += '<g transform="translate(300 320) rotate(' + w[0] + ')"><g class="avWedge">' +
        '<path d="M-8 -' + r0 + ' L8 -' + r0 + ' L15 -' + (r0 + len) + ' C8 -' + (r0 + len + 9) + ' -8 -' + (r0 + len + 9) + ' -15 -' + (r0 + len) + ' Z" fill="' + (C.shock || '#FFD23C') + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/></g></g>';
    });
    g += '</g>';

    // laminate gloss band, clipped to the art
    g += '<g clip-path="url(#c-sil)"><g id="avGloss"><rect x="-140" y="-240" width="280" height="1300" fill="url(#g-gloss)" transform="rotate(22 0 420)"/></g></g>';

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-70 -70 740 1080" width="740" height="1080" style="overflow:visible">' + defs +
      '<g id="av" filter="url(#f-sticker)">' + g + '</g></svg>';
  }
  // Name bar: a slanted cyan blade slab (face gradient, lit top lip, darker underside, ink edge, chevrons)
  function bar(o) {
    o = o || {}; var W = o.w || 660, H = o.h || 78, k = o.slant || 24, D = o.depth || 13, acc = o.colors || ['#B4F4FF', '#4CDDFF', '#16B0E4', '#0B8FC2'];
    var face = 'M' + k + ' 0 L' + W + ' 0 L' + (W - k) + ' ' + H + ' L0 ' + H + ' Z';
    var side = 'M0 ' + H + ' L' + (W - k) + ' ' + H + ' L' + (W - k - 3) + ' ' + (H + D) + ' L-3 ' + (H + D) + ' Z';
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 ' + (W + 80) + ' ' + (H + D + 80) + '" width="' + (W + 80) + '" height="' + (H + D + 80) + '" style="overflow:visible;position:absolute;left:-40px;top:-40px">' +
      '<defs><linearGradient id="g-bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + acc[0] + '"/><stop offset="0.3" stop-color="' + acc[1] + '"/><stop offset="0.78" stop-color="' + acc[2] + '"/><stop offset="1" stop-color="' + acc[3] + '"/></linearGradient>' +
      '<linearGradient id="g-barSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#075F82"/><stop offset="1" stop-color="#04445E"/></linearGradient>' +
      '<clipPath id="c-bar"><path d="' + face + '"/></clipPath></defs>' +
      '<g filter="url(#f-sticker)">' +
      '<path d="' + side + '" fill="url(#g-barSide)" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
      '<path d="' + face + '" fill="url(#g-bar)"/>' +
      '<g clip-path="url(#c-bar)">' +
        '<path d="M' + (k - 6) + ' 6 L' + (W + 6) + ' 6" stroke="#fff" stroke-opacity="0.85" stroke-width="5"/>' +
        '<path d="M-6 ' + (H - 5) + ' L' + W + ' ' + (H - 5) + '" stroke="#05506E" stroke-opacity="0.55" stroke-width="8"/>' +
        // chevrons, both ends
        '<path d="M' + (W - 78) + ' 22 L' + (W - 60) + ' 39 L' + (W - 78) + ' 56 L' + (W - 92) + ' 56 L' + (W - 74) + ' 39 L' + (W - 92) + ' 22 Z" fill="' + INK + '"/>' +
        '<path d="M' + (W - 52) + ' 22 L' + (W - 34) + ' 39 L' + (W - 52) + ' 56 L' + (W - 66) + ' 56 L' + (W - 48) + ' 39 L' + (W - 66) + ' 22 Z" fill="' + INK + '" opacity="0.55"/>' +
        '<g id="' + (o.glossId || 'barGloss') + '"><rect x="-60" y="-60" width="120" height="' + (H + 120) + '" fill="url(#g-gloss)" transform="rotate(24 0 ' + (H / 2) + ')"/></g>' +
      '</g>' +
      '<path d="' + face + '" fill="none" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
      '</g></svg>';
    return s;
  }
  // Comic speech balloon: rounded slab + tail, white-to-cool face, a yellow shout fill layer (#' + 'bubShout, scale from the tail)
  function bubble(o) {
    o = o || {}; var W = o.w || 800, H = o.h || 290, r = o.r || 120, t0 = o.tail ? o.tail[0] : 240, t1 = o.tail ? o.tail[1] : 340, tx = o.tail ? o.tail[2] : 200, ty = o.tail ? o.tail[3] : H + 100;
    var q = r * 0.45;
    var d = 'M' + r + ' 0 L' + (W - r) + ' 0 C' + (W - q) + ' 0 ' + W + ' ' + q + ' ' + W + ' ' + r + ' L' + W + ' ' + (H - r) + ' C' + W + ' ' + (H - q) + ' ' + (W - q) + ' ' + H + ' ' + (W - r) + ' ' + H +
      ' L' + t1 + ' ' + H + ' C' + (t1 - 30) + ' ' + (H + 40) + ' ' + (tx + 20) + ' ' + (ty - 20) + ' ' + tx + ' ' + ty + ' C' + (tx + 30) + ' ' + (ty - 50) + ' ' + (t0 + 10) + ' ' + (H + 30) + ' ' + t0 + ' ' + H +
      ' L' + r + ' ' + H + ' C' + q + ' ' + H + ' 0 ' + (H - q) + ' 0 ' + (H - r) + ' L0 ' + r + ' C0 ' + q + ' ' + q + ' 0 ' + r + ' 0 Z';
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 ' + (W + 80) + ' ' + (ty + 80) + '" width="' + (W + 80) + '" height="' + (ty + 80) + '" style="overflow:visible;position:absolute;left:-40px;top:-40px">' +
      '<defs><linearGradient id="g-bub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.7" stop-color="#F6F8FB"/><stop offset="1" stop-color="#E2E7EF"/></linearGradient>' +
      '<linearGradient id="g-shout" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE98A"/><stop offset="0.45" stop-color="#FFD23C"/><stop offset="1" stop-color="#F2A81E"/></linearGradient>' +
      '<clipPath id="c-bub"><path d="' + d + '"/></clipPath></defs>' +
      '<g filter="url(#f-sticker)">' +
      '<path d="' + d + '" fill="url(#g-bub)"/>' +
      '<g clip-path="url(#c-bub)">' +
        '<g id="bubShout"><circle cx="' + ((t0 + t1) / 2) + '" cy="' + H + '" r="' + (W * 1.05) + '" fill="url(#g-shout)"/></g>' +
        '<path d="M' + (r * 0.7) + ' 12 L' + (W - r * 0.7) + ' 12" stroke="#fff" stroke-opacity="0.9" stroke-width="6" stroke-linecap="round"/>' +
        '<g id="bubGloss"><rect x="-90" y="-80" width="180" height="' + (H + 260) + '" fill="url(#g-gloss)" transform="rotate(24 0 ' + (H / 2) + ')"/></g>' +
      '</g>' +
      '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="10" stroke-linejoin="round"/>' +
      '</g></svg>';
    return s;
  }
  root.Avatar = { build: build, bar: bar, bubble: bubble };
})(window);
