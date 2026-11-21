// node gen.js <wdth> <wght> : Archivo outlines -> JSON {upm, cap, g:{ch:[adv, path, inkMinX, inkMaxX]}, k:{pair:kern}}
const fontkit = require('fontkit');
const f = fontkit.openSync(process.env.FONT);
const [wdth, wght] = process.argv.slice(2).map(Number);
const v = f.getVariation({ wdth, wght });
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,'!?-&:#$+";
const r = (x) => Math.round(x);
const g = {};
for (const ch of chars) {
  const gl = v.glyphForCodePoint(ch.codePointAt(0));
  const cmds = gl.path.commands.map((c) => {
    const a = c.args.map((n, i) => (i % 2 ? -r(n) : r(n)));
    const L = { moveTo: 'M', lineTo: 'L', quadraticCurveTo: 'Q', bezierCurveTo: 'C', closePath: 'Z' }[c.command];
    return L + a.join(' ');
  }).join('');
  const b = gl.bbox; g[ch] = [r(gl.advanceWidth), cmds, ch === " " ? 0 : r(b.minX), ch === " " ? 0 : r(b.maxX)];
}
const k = {};
const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
for (const a of L) for (const b of L) {
  const lay = v.layout(a + b);
  const kern = r(lay.positions[0].xAdvance - v.glyphForCodePoint(a.codePointAt(0)).advanceWidth);
  if (kern) k[a + b] = kern;
}
const bb = v.glyphForCodePoint(72).bbox;
process.stdout.write(JSON.stringify({ upm: f.unitsPerEm, cap: r(bb.maxY), g, k }));
