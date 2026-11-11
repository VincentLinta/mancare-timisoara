// citim ?id=... din adresa paginii (ex. loc.html?id=casa-bunicii)
const id = new URLSearchParams(location.search).get("id");

fetch("data/locuri.json")
  .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
  .then(locuri => {
    const l = locuri.find(x => x.id === id);
    if (!l) { $("titlu").textContent = "Loc negăsit"; $("loc").innerHTML = `<p class="gol-msg">Nu există niciun loc cu id-ul „${esc(id || "")}". <a href="index.html">Înapoi la listă</a></p>`; return; }
    document.title = l.nume + " | Mâncare în Timișoara";
    $("titlu").textContent = l.nume;

    const pm = l.parerea_mea;
    const taguri = tagHtml(l);
    const linie = (eticheta, v) => v ? `<li><b>${eticheta}:</b> ${esc(v)}</li>` : "";
    const parere = pm ? `
      <h2>Părerea mea</h2>
      <ul class="lista">
        ${linie("Am mâncat", pm.ce_am_mancat)}${linie("Am plătit", pm.pret_platit != null ? pm.pret_platit + " RON" : null)}
        ${linie("Plusuri", pm.plus)}${linie("Minusuri", pm.minus)}${linie("Când", pm.data)}
      </ul>` : `<h2>Părerea mea</h2><p class="gol-msg">Încă n-am fost aici.</p>`;
    const poze = l.poze?.length
      ? `<div class="galerie">${l.poze.map(p => `<img src="img/${esc(p)}" alt="${esc(l.nume)}" loading="lazy">`).join("")}</div>`
      : `<p class="gol-msg">Încă nu sunt poze.</p>`;

    const web = urlSigur(l.website);
    const contact = (l.telefon || web || l.program || l.optiuni?.length) ? `<h2>Contact și facilități</h2><ul class="lista">
      ${l.telefon ? `<li><b>Telefon:</b> <a href="tel:${esc(l.telefon.replace(/[^+\d]/g, ""))}">${esc(l.telefon)}</a></li>` : ""}
      ${web ? `<li><b>Site:</b> <a href="${esc(web)}" target="_blank" rel="noopener">${esc(web.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</a></li>` : ""}
      ${l.program ? `<li><b>Program:</b> ${esc(l.program)}${typeof deschisAcum === "function" && deschisAcum(l.program) !== null ? ` · <span class="tag ${deschisAcum(l.program) ? "deschis" : "inchis"}">${deschisAcum(l.program) ? "Deschis acum" : "Închis acum"}</span>` : ""}</li>` : ""}
      ${l.optiuni?.length ? `<li><b>Facilități:</b> ${l.optiuni.map(o => esc(OPT[o] || o)).join(", ")}</li>` : ""}</ul>` : "";
    // locuri asemănătoare: aceeași bucătărie, altfel același tip; cele mai bine notate primele
    const tg = taguriBuc(l);
    const asem = locuri.filter(x => x.id !== l.id)
      .map(x => ({ x, s: taguriBuc(x).filter(t => tg.includes(t)).length * 2 + (x.tip === l.tip ? 1 : 0) }))
      .filter(o => o.s > 0)
      .sort((a, b) => b.s - a.s || (notaPublica(b.x) ?? 0) - (notaPublica(a.x) ?? 0))
      .slice(0, 3).map(o => o.x);

    $("loc").innerHTML = `
      ${thumb(l)}
      <div class="taguri">${taguri}</div>
      ${l.adresa ? `<p class="adresa">${esc(l.adresa)}</p>` : ""}
      <div class="note">${noteHtml(l)}</div>
      <p><a class="btn" href="${esc(linkMaps(l))}" target="_blank" rel="noopener">Deschide în Google Maps ↗</a></p>
      <p class="butoane"><button id="favB" type="button"></button><button id="shareB" type="button">🔗 Distribuie</button></p>
      ${contact}
      ${parere}
      ${l.poze?.length ? `<h2>Poze</h2>${poze}` : ""}
      ${asem.length ? `<h2>Locuri asemănătoare</h2><div class="grid">${asem.map(x =>
        `<article class="card ${tipCls(x.tip)}"><div class="body"><h2><a href="loc.html?id=${encodeURIComponent(x.id)}">${esc(x.nume)}</a></h2>
        <div class="note">${noteHtml(x)}</div></div></article>`).join("")}</div>` : ""}`;
    $("loc").classList.add(tipCls(l.tip));
    const fb = $("favB"), setF = () => { fb.textContent = isFav(l.id) ? "♥ În favorite" : "♡ Adaugă la favorite"; fb.setAttribute("aria-pressed", isFav(l.id)); };
    setF(); fb.onclick = () => { toggleFav(l.id); setF(); };
    $("shareB").onclick = () => shareLink(location.href, l.nume);
  })
  .catch(e => { $("loc").innerHTML = `<div class="eroare">Nu am putut încărca datele (${esc(e.message)}). Rulezi cu Live Server?</div>`; });
