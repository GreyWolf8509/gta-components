// Regenerates media/glyphs.js: node gen-glyphs.js <wdth> <wght> > glyphs.json, then wrap as window.PRICE_GLYPHS = ...;
// Outlines of Archivo (OFL, assets/fonts/Archivo.ttf) for the price characters, y-down SVG paths in font units (baseline 0).
// g[ch] = [advance, path, inkMinX, inkMaxX, inkMinY, inkMaxY]   (fontkit: npm i fontkit)
const fontkit = require('fontkit');
const f = fontkit.openSync(process.env.FONT || '../assets/fonts/Archivo.ttf');
const [wdth, wght] = process.argv.slice(2).map(Number);
const v = f.getVariation({ wdth, wght });
const chars = "$0123456789,.";
const r = (x) => Math.round(x);
const g = {};
for (const ch of chars) {
  const gl = v.glyphForCodePoint(ch.codePointAt(0));
  const cmds = gl.path.commands.map((c) => {
    const a = c.args.map((n, i) => (i % 2 ? -r(n) : r(n)));
    const L = { moveTo: 'M', lineTo: 'L', quadraticCurveTo: 'Q', bezierCurveTo: 'C', closePath: 'Z' }[c.command];
    return L + a.join(' ');
  }).join('');
  const b = gl.bbox; g[ch] = [r(gl.advanceWidth), cmds, r(b.minX), r(b.maxX), r(-b.maxY), r(-b.minY)];
}
const bb = v.glyphForCodePoint(48).bbox;   // "0": figure height
process.stdout.write(JSON.stringify({ upm: f.unitsPerEm, wdth, wght, fig: r(bb.maxY), g }));
