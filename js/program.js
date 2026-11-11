// „Deschis acum": citește programul în formatul OpenStreetMap (opening_hours) și spune dacă un loc e deschis în acest moment, după ora Timișoarei.
// Acoperă cazurile uzuale: "Mo-Su 10:00-22:00", "Mo-Fr 08:00-18:00; Sa 09:00-14:00; Su off", "24/7", mai multe intervale pe zi,
// intervale care trec peste miezul nopții ("Fr-Sa 18:00-03:00"). Zilele de sărbătoare (PH/SH) sunt ignorate.
// Orice altceva (sunrise/sunset, săptămâni, luni, text liber) întoarce null = „necunoscut", ca să nu afirmăm ceva fals.
const ZILE = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const _prog = new Map();

function _zile(txt) {               // "Mo-Fr,Su" -> [0,1,2,3,4,6]; null dacă nu înțelegem
  if (!txt) return [0, 1, 2, 3, 4, 5, 6];
  const out = [];
  for (const p of txt.split(",").map(x => x.trim()).filter(Boolean)) {
    if (/^(PH|SH)$/i.test(p)) continue;
    const m = p.match(/^([A-Za-z]{2})(?:\s*-\s*([A-Za-z]{2}))?$/);
    if (!m) return null;
    const a = ZILE.indexOf(m[1][0].toUpperCase() + m[1][1].toLowerCase());
    const b = m[2] ? ZILE.indexOf(m[2][0].toUpperCase() + m[2][1].toLowerCase()) : a;
    if (a < 0 || b < 0) return null;
    for (let d = a; ; d = (d + 1) % 7) { out.push(d); if (d === b) break; }   // „Sa-Mo" trece peste capătul săptămânii
  }
  return out;
}

function parseProgram(s) {          // -> listă de 7 zile, fiecare cu intervale [început, sfârșit] în minute; sau null
  if (typeof s !== "string" || !s.trim()) return null;
  s = s.trim();
  if (_prog.has(s)) return _prog.get(s);
  let rez = null;
  if (/^24\/7$/i.test(s)) rez = ZILE.map(() => [[0, 1440]]);
  else {
    const zile = ZILE.map(() => null);   // null = nicio regulă pentru ziua aceea => închis
    let bun = true, regulaFolosita = false;
    for (const regula of s.split(";").map(x => x.trim()).filter(Boolean)) {
      const i = regula.search(/\d{1,2}:\d{2}|\boff\b|\bclosed\b/i);
      if (i < 0) { bun = false; break; }
      const zileR = _zile(regula.slice(0, i).trim()), ore = regula.slice(i).trim();
      if (zileR === null) { bun = false; break; }
      let intervale;
      if (/^(off|closed)$/i.test(ore)) intervale = [];
      else if (/^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}(\s*,\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})*$/.test(ore)) {
        intervale = ore.split(",").map(x => x.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)).map(m => [+m[1] * 60 + +m[2], +m[3] * 60 + +m[4]]);
        if (intervale.some(([a, b]) => a > 1440 || b > 1440)) { bun = false; break; }
      } else { bun = false; break; }
      zileR.forEach(d => { zile[d] = intervale; regulaFolosita = true; });   // o regulă mai nouă o înlocuiește pe cea veche
    }
    if (bun && regulaFolosita) rez = zile.map(z => z || []);
  }
  _prog.set(s, rez);
  return rez;
}

function _oraTimisoarei(acum) {      // ziua săptămânii (0 = luni) și minutul zilei, în Europe/Bucharest, indiferent unde e vizitatorul
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Bucharest", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(acum).map(x => [x.type, x.value]));
  return { w: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday), m: +p.hour * 60 + +p.minute };
}

function deschisAcum(program, acum = new Date()) {   // true = deschis, false = închis, null = nu știm
  const z = parseProgram(program);
  if (!z) return null;
  const { w, m } = _oraTimisoarei(acum);
  const azi = z[w], ieri = z[(w + 6) % 7];
  for (const [a, b] of azi) if (b > a ? (m >= a && m < b) : m >= a) return true;   // b <= a: intervalul trece peste miezul nopții
  for (const [a, b] of ieri) if (b <= a && m < b) return true;                      // coada intervalului de ieri
  return false;
}
if (typeof module !== "undefined") module.exports = { deschisAcum, parseProgram };
