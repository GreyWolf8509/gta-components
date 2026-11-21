// Regenerates media/glyphs.js (Archivo outlines for the 3D numerals and tag letters):
//   NODE_PATH=<dir with fontkit> node gen-glyphs.js 80 900 > glyphs.js   (wdth, wght)
// g[char] = [advance, SVG path (y-down, baseline 0, font units), inkMinX, inkMaxX, inkMinY, inkMaxY]
const fontkit = require('fontkit');
const f = fontkit.openSync(process.env.FONT || __dirname + '/../../../_shared/fonts/Archivo.ttf');
const [wdth, wght] = process.argv.slice(2).map(Number);
const v = f.getVariation({ wdth, wght });
const chars = process.env.CHARS || "0123456789×#!ATEMPSUCRI.";
const r = (x) => Math.round(x);
const g = {};
for (const ch of chars) {
  const gl = v.glyphForCodePoint(ch.codePointAt(0));
  const cmds = gl.path.commands.map((c) => {
    const a = c.args.map((n, i) => (i % 2 ? -r(n) : r(n)));
    const L = { moveTo: 'M', lineTo: 'L', quadraticCurveTo: 'Q', bezierCurveTo: 'C', closePath: 'Z' }[c.command];
    return L + a.join(' ');
  }).join('');
  const b = gl.bbox; g[ch] = [r(gl.advanceWidth), cmds, r(b.minX), r(b.maxX), r(b.minY), r(b.maxY)];
}
const cap = r(v.glyphForCodePoint(72).bbox.maxY);
process.stdout.write('/* Archivo (OFL) outlines at wdth ' + wdth + ' / wght ' + wght + ', generated with fontkit (media/gen-glyphs.js). */\nwindow.NUM_GLYPHS = ' + JSON.stringify({ upm: f.unitsPerEm, cap, g }) + ';\n');
