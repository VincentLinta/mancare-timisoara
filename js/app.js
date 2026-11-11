document.addEventListener("DOMContentLoaded", () => {
let locuri = [], ultimele = [], surpL = null, limita = 48, poz = null;
const re = () => { limita = 48; randeaza(); };   // la schimbarea filtrelor revenim la primele 48
const comp = new Set();   // locurile bifate pentru comparare (maxim 3)

fetch("data/locuri.json")
  .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
  .then(data => { locuri = data; umpleFiltre(); initDeschis(); citesteUrl(); re(); randeazaTop(); })
  .catch(e => {
    $("lista").innerHTML = ""; $("lista").removeAttribute("aria-busy"); $("numar").textContent = "";
    $("eroare").hidden = false;
    $("eroare").textContent = "Nu am putut încărca locurile. Rulezi site-ul printr-un server (Live Server)? (" + e.message + ")";
  });

const FARA = "__fara";   // valoarea opțiunilor „Altele” / „Alte zone”
function umpleFiltre() {
  const adauga = (selectId, valori) => {
    [...new Set(valori.filter(Boolean))].sort((a, b) => a.localeCompare(b, "ro"))
      .forEach(v => $(selectId).insertAdjacentHTML("beforeend", `<option value="${esc(v)}">${esc(v)}</option>`));
  };
  adauga("tip", locuri.map(l => l.tip));
  adauga("zona", locuri.map(l => l.zona));
  adauga("bucatarie", locuri.flatMap(taguriBuc));
  // locurile fără zonă sau bucătărie (multe, din import) rămân găsibile: opțiuni „Alte zone” / „Altele”
  if (locuri.some(l => !l.zona)) $("zona").insertAdjacentHTML("beforeend", `<option value="${FARA}">Alte zone</option>`);
  if (locuri.some(l => !taguriBuc(l).length)) $("bucatarie").insertAdjacentHTML("beforeend", `<option value="${FARA}">Altele</option>`);
}

// filtrele trăiesc și în URL (?tip=pub&pret=2), ca să poți trimite linkul
const PARAMS = { cauta: "q", tip: "tip", zona: "zona", bucatarie: "buc", sortare: "sort" };
// filtrul "Deschis acum" apare doar dacă măcar un loc are program pe care îl putem citi (vine din importul OpenStreetMap)
const doarDeschis = () => $("deschis").checked && !$("deschisL").hidden;
function initDeschis() { $("deschisL").hidden = !locuri.some(l => deschisAcum(l.program) !== null); }
function citesteUrl() {
  const p = new URLSearchParams(location.search);
  for (const [id, k] of Object.entries(PARAMS)) if (p.has(k)) $(id).value = p.get(k);
  $("vizitat").checked = p.get("v") === "1";
  $("deschis").checked = p.get("acum") === "1";
  $("fav").checked = p.get("fav") === "1";
  (p.get("opt") || "").split(",").forEach(o => { const c = [...document.querySelectorAll("[data-opt]")].find(x => x.dataset.opt === o); if (c) c.checked = true; });
}
function scrieUrl() {
  const p = new URLSearchParams();
  for (const [id, k] of Object.entries(PARAMS)) {
    const v = $(id).value;
    if (v && !(id === "sortare" && (v === "nume" || v === "distanta"))) p.set(k, v);
  }
  if ($("vizitat").checked) p.set("v", "1");
  if (doarDeschis()) p.set("acum", "1");
  if ($("fav").checked) p.set("fav", "1");
  const o = [...document.querySelectorAll("[data-opt]:checked")].map(c => c.dataset.opt); if (o.length) p.set("opt", o.join(","));
  history.replaceState(null, "", p.toString() ? "?" + p : location.pathname);
}

const cmpNum = (a, b, desc) =>
  a == null && b == null ? 0 : a == null ? 1 : b == null ? -1 : desc ? b - a : a - b;
// distanța (în metri) de la poziția utilizatorului, doar pentru locurile cu coordonate
function dist(l) {
  if (!poz || l.lat == null) return null;
  const R = 6371000, r = Math.PI / 180, dLa = (l.lat - poz[0]) * r, dLo = (l.lon - poz[1]) * r;
  const x = Math.sin(dLa / 2) ** 2 + Math.cos(poz[0] * r) * Math.cos(l.lat * r) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
const fmtDist = m => m < 1000 ? Math.round(m / 10) * 10 + " m" : (m / 1000).toFixed(1) + " km";
const sortari = {
  "nume":     (a, b) => a.nume.localeCompare(b.nume, "ro"),
  "nota-mea": (a, b) => cmpNum(a.parerea_mea?.nota, b.parerea_mea?.nota, true),
  "publica":  (a, b) => cmpNum(notaPublica(a), notaPublica(b), true),
  "distanta": (a, b) => cmpNum(dist(a), dist(b), false)
};

function card(l) {
  const href = "loc.html?id=" + encodeURIComponent(l.id);
  const taguri = tagHtml(l, dist(l) != null ? fmtDist(dist(l)) : null);
  const pm = l.parerea_mea;
  const detalii = pm && (pm.plus || pm.minus)
    ? `<p class="detalii"><b>+</b> ${esc(pm.plus || "-")} · <b>−</b> ${esc(pm.minus || "-")}</p>` : "";
  const f = isFav(l.id);
  return `
    <article class="card ${tipCls(l.tip)}">
      <a href="${href}" aria-hidden="true" tabindex="-1">${thumb(l)}</a>
      <button type="button" class="fav" data-fav="${esc(l.id)}" aria-pressed="${f}" aria-label="Favorit: ${esc(l.nume)}">${f ? "♥" : "♡"}</button>
      <div class="body">
        <h2><a href="${href}">${esc(l.nume)}</a></h2>
        <div class="taguri">${taguri}</div>
        ${l.adresa ? `<p class="adresa">${esc(l.adresa)}</p>` : ""}
        <div class="note">${noteHtml(l)}</div>
        ${detalii}
        <p class="linkuri"><a href="${href}">Detalii →</a> <a href="${esc(linkMaps(l))}" target="_blank" rel="noopener">Maps ↗</a></p>
        <label class="cmp"><input type="checkbox" data-cmp="${esc(l.id)}" ${comp.has(l.id) ? "checked" : ""}> Compară</label>
      </div>
    </article>`;
}

// stare goală utilă: spune ce filtre sunt active și oferă ieșiri (resetare, asistentul)
function stareGoala(doarFav) {
  if (doarFav && !getFav().length)
    return `<div class="gol-stare"><p class="gol-ic" aria-hidden="true">♡</p><h2>Nu ai niciun favorit încă</h2><p>Apasă ♡ pe un card ca să-l salvezi aici.</p><div class="butoane"><button type="button" id="golReset">Arată toate locurile</button></div></div>`;
  const chip = (eticheta, valoare) => `<span class="chip-f" data-no-i18n>${esc(eticheta)}${valoare ? ": " + esc(valoare) : ""}</span>`;   // etichetele vin din pagină, deja în limba aleasă
  const c = [];
  if ($("cauta").value.trim()) c.push(chip($("cauta").getAttribute("aria-label"), "„" + $("cauta").value.trim() + "”"));
  ["tip", "zona", "bucatarie"].forEach(id => { if ($(id).value) c.push(chip($(id).getAttribute("aria-label"), $(id).selectedOptions[0].textContent)); });
  ["deschis", "vizitat", "fav"].forEach(id => { if ($(id).checked && !$(id).closest("[hidden]")) c.push(chip($(id).parentElement.textContent.trim())); });
  document.querySelectorAll("[data-opt]:checked").forEach(o => c.push(chip(o.parentElement.textContent.trim())));
  return `<div class="gol-stare"><p class="gol-ic" aria-hidden="true">🔍</p><h2>Niciun loc nu se potrivește</h2>${c.length ? `<p><b>Filtre active:</b></p><div class="chips-f">${c.join("")}</div>` : ""}<p>Încearcă mai puține cuvinte, scrie fără diacritice sau scoate un filtru.</p><div class="butoane"><button type="button" id="golReset">Resetează filtrele</button><button type="button" id="golChat">💬 Întreabă asistentul</button></div></div>`;
}

function randeaza() {
  const q = norm($("cauta").value.trim());
  const tip = $("tip").value, zona = $("zona").value, buc = $("bucatarie").value;
  const doarVizitate = $("vizitat").checked, doarFav = $("fav").checked;
  const opt = [...document.querySelectorAll("[data-opt]:checked")].map(c => c.dataset.opt);

  const rezultate = locuri
    .filter(l => !tip || l.tip === tip)
    .filter(l => !zona || (zona === FARA ? !l.zona : l.zona === zona))
    .filter(l => !buc || (buc === FARA ? !taguriBuc(l).length : taguriBuc(l).includes(buc)))
    .filter(l => !doarVizitate || l.vizitat)
    .filter(l => !doarDeschis() || deschisAcum(l.program) === true)
    .filter(l => !doarFav || isFav(l.id))
    .filter(l => opt.every(o => areOpt(l, o)))
    .filter(l => { const h = norm([l.nume, l.tip, l.bucatarie, l.zona, l.adresa].join(" ")); return q.split(/\s+/).filter(Boolean).every(t => h.includes(t)); })
    .sort(sortari[$("sortare").value]);
  ultimele = rezultate;

  const active = [q, tip, zona, buc].filter(Boolean).length + (doarVizitate ? 1 : 0) + (doarFav ? 1 : 0) + opt.length;
  $("sumar").textContent = "Filtre" + (active ? ` (${active})` : "");
  $("numar").textContent = rezultate.length + " din " + locuri.length + " locuri";
  $("lista").innerHTML = rezultate.length
    ? rezultate.slice(0, limita).map(card).join("") + (rezultate.length > limita ? `<p class="mai"><button type="button" id="mai">Arată încă ${Math.min(48, rezultate.length - limita)} din ${rezultate.length - limita} rămase</button></p>` : "")
    : stareGoala(doarFav);
  $("lista").removeAttribute("aria-busy");
  scrieUrl();
}

// ---------- 🎲 Surprinde-mă: alege la întâmplare dintre locurile filtrate ----------
function arataSurp(l, scroll = true) {
  surpL = l; const s = $("surprinde"); s.hidden = false;
  s.innerHTML = `<div class="surp"><h2>🎲 Ce zici de…</h2>${card(l)}
    <div class="butoane"><button type="button" id="alt">Încă unul 🎲</button><button type="button" id="inchide">Închide</button></div></div>`;
  if (scroll) s.scrollIntoView({ behavior: SMOOTH, block: "center" });
}
function surprinde() {
  if (!ultimele.length) { $("surprinde").hidden = false; $("surprinde").innerHTML = `<p class="gol-msg">N-am din ce alege cu filtrele astea. Apasă „Resetează".</p>`; return; }
  arataSurp(ultimele[Math.floor(Math.random() * ultimele.length)]);
}

// ---------- ⚖️ Compară până la 3 locuri ----------
function actualizeazaCmp() {
  $("cmpBar").hidden = !comp.size;
  $("cmpBar").textContent = `Compară (${comp.size}) ⚖️`;
}
$("cmpBar").onclick = () => {
  const L = [...comp].map(id => locuri.find(l => l.id === id)).filter(Boolean);
  const rows = [["Tip", l => l.tip], ["Bucătărie", l => l.bucatarie], ["Zonă", l => l.zona],
    ["Maps ★", l => l.maps?.rating],
    ["Tripadvisor ★", l => l.tripadvisor?.rating], ["Nota mea", l => l.parerea_mea?.nota],
    ["Plusuri", l => l.parerea_mea?.plus], ["Minusuri", l => l.parerea_mea?.minus]];
  $("cmpBody").innerHTML = `<div class="tabel-wrap"><table class="cmpt"><thead><tr><th></th>${
    L.map(l => `<th scope="col"><a href="loc.html?id=${encodeURIComponent(l.id)}">${esc(l.nume)}</a></th>`).join("")}</tr></thead><tbody>${
    rows.map(([n, f]) => `<tr><th scope="row">${n}</th>${L.map(l => { const v = f(l); return `<td>${v == null || v === "" ? "–" : esc(v)}</td>`; }).join("")}</tr>`).join("")
  }</tbody></table></div>`;
  $("cmpDlg").showModal();
};
$("cmpClear").onclick = () => { comp.clear(); $("cmpDlg").close(); randeaza(); actualizeazaCmp(); };

// ---------- evenimente (delegare: merg și pentru cardurile din panoul „Surprinde-mă") ----------
document.addEventListener("click", e => {
  const f = e.target.closest("[data-fav]");
  if (f) { toggleFav(f.dataset.fav); randeaza(); if (surpL && !$("surprinde").hidden) arataSurp(surpL, false); return; }
  if (e.target.id === "shareTop") {
    const ro = document.documentElement.lang !== "en", v = topLista();
    shareText(ro ? "Topul meu din Timișoara" : "My Timișoara food top", (ro ? "Topul meu din Timișoara:\n" : "My Timișoara food top:\n") + v.map((l, i) => `${i + 1}. ${l.nume}${l.parerea_mea.nota != null ? " – " + l.parerea_mea.nota + "/10" : ""}`).join("\n") + "\n" + location.href.split("?")[0]);
  }
  if (e.target.id === "mai") { limita += 48; randeaza(); }
  if (e.target.id === "golReset") $("reset").click();
  if (e.target.id === "golChat") $("chatBtn").click();
  if (e.target.id === "alt") surprinde();
  if (e.target.id === "inchide") $("surprinde").hidden = true;
});
document.addEventListener("change", e => {
  const c = e.target.closest("[data-cmp]"); if (!c) return;
  if (c.checked) { if (comp.size >= 3) { c.checked = false; toast("Poți compara maxim 3 locuri."); return; } comp.add(c.dataset.cmp); }
  else comp.delete(c.dataset.cmp);
  actualizeazaCmp();
});
["cauta", "tip", "zona", "bucatarie", "sortare", "vizitat", "fav", "deschis"].forEach(id =>
  $(id).addEventListener(id === "cauta" ? "input" : "change", re));
document.querySelectorAll("[data-opt]").forEach(c => c.addEventListener("change", re));
$("reset").onclick = () => {
  ["cauta", "tip", "zona", "bucatarie"].forEach(id => $(id).value = "");
  $("sortare").value = "nume"; $("vizitat").checked = false; $("fav").checked = false; $("deschis").checked = false;
  document.querySelectorAll("[data-opt]").forEach(c => c.checked = false); re();
};
$("top").onclick = () => { $("sortare").value = "nota-mea"; $("vizitat").checked = true; re(); };
$("surp").onclick = surprinde;
// ---------- 📍 Lângă mine (poziția rămâne în browser) ----------
$("near").onclick = () => {
  if (!locuri.some(l => l.lat != null)) { toast("Locurile încă nu au coordonate. Rulează tools/import_osm.py."); return; }
  if (!navigator.geolocation) { toast("Browserul nu poate afla poziția."); return; }
  navigator.geolocation.getCurrentPosition(p => { poz = [p.coords.latitude, p.coords.longitude]; $("sortare").value = "distanta"; re(); toast("Sortat după distanță 📍"); },
    () => toast("Nu am putut afla poziția (ai refuzat sau nu e disponibilă)."), { timeout: 10000, maximumAge: 60000 });
};
// ---------- ⭐ Topul meu: primele 10 locuri la care am fost ----------
function topLista() {
  return locuri.filter(l => l.vizitat && l.parerea_mea)
    .sort((a, b) => cmpNum(a.parerea_mea.nota, b.parerea_mea.nota, true) || a.nume.localeCompare(b.nume, "ro")).slice(0, 10);
}
function randeazaTop() {
  const v = topLista();
  if (!v.length) { $("topSec").hidden = true; return; }
  $("topSec").hidden = false;
  $("topSec").innerHTML = `<h2>⭐ Topul meu</h2><ol>${v.map(l => `<li><a href="loc.html?id=${encodeURIComponent(l.id)}">${esc(l.nume)}</a> ${l.parerea_mea.nota != null ? `<b>${l.parerea_mea.nota}/10</b>` : `<small>fără notă încă</small>`}</li>`).join("")}</ol><button type="button" id="shareTop">🔗 Distribuie topul</button>`;
}
$("share").onclick = () => shareLink(location.href, "Mâncare în Timișoara");
if (matchMedia("(min-width:700px)").matches) $("filtre").open = true;
});
