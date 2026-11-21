// Regenerates media/glyphs.js (Barlow Condensed Black outlines for the 3D counter numerals):
//   NODE_PATH=<dir with fontkit> node gen-glyphs.js > glyphs.js
// g[char] = [advance, SVG path (y-down, baseline 0, font units), inkMinX, inkMaxX]
const fontkit = require('fontkit');
const f = fontkit.openSync(process.env.FONT || __dirname + '/../../../_shared/fonts/BarlowCondensed-Black.ttf');
const chars = "0123456789";
const r = (x) => Math.round(x);
const g = {};
for (const ch of chars) {
  const gl = f.glyphForCodePoint(ch.codePointAt(0));
  const cmds = gl.path.commands.map((c) => {
    const a = c.args.map((n, i) => (i % 2 ? -r(n) : r(n)));
    const L = { moveTo: 'M', lineTo: 'L', quadraticCurveTo: 'Q', bezierCurveTo: 'C', closePath: 'Z' }[c.command];
    return L + a.join(' ');
  }).join('');
  const b = gl.bbox; g[ch] = [r(gl.advanceWidth), cmds, r(b.minX), r(b.maxX)];
}
const cap = r(f.glyphForCodePoint(72).bbox.maxY);
process.stdout.write('/* Barlow Condensed Black (OFL) numeral outlines, generated with fontkit (media/gen-glyphs.js). */\nwindow.NUM_GLYPHS = ' + JSON.stringify({ upm: f.unitsPerEm, cap, g }) + ';\n');
