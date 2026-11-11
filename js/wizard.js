// "Ce mănânc azi?": 2 întrebări → 3 locuri potrivite, cu motivele. Folosește aceleași date ca restul site-ului.
(function () {
  const dlg = document.getElementById("wizDlg"); if (!dlg) return;
  let D = null, step = 0, ans = [], off = 0;
  const Q = [
    { q: "Ce poftești?", opts: [["🍕 Pizza", { buc: ["pizza"] }], ["🍔 Burgeri", { buc: ["burgeri"] }], ["🍝 Italian", { buc: ["italian", "paste", "pizza"] }],
      ["🥢 Asiatic", { buc: ["asiatic", "japonez", "chinezesc", "indian", "indonezian", "thailandez", "vietnamez", "coreean"] }], ["🥘 Românesc", { buc: ["românesc", "tradițional", "regional"] }],
      ["🦐 Fructe de mare", { buc: ["fructe de mare"] }], ["🌱 Vegetarian / vegan", { veg: true }], ["☕ Cafea sau brunch", { tip: ["cafenea"] }], ["🎲 Orice", {}]] },
    { q: "Cum vrei să mănânci?", opts: [["🪑 La masă", { stil: "masa" }], ["🏃 Rapid", { stil: "rapid" }], ["🌿 Cu terasă", { stil: "terasa" }], ["🥡 La pachet", { stil: "pachet" }], ["🤷 Oricum", {}]] }
  ];
  // criterii "tari" exclud locul; criteriile "moi" doar măresc scorul.
  function rezultate() {
    const a = Object.assign({}, ...ans), out = [];
    for (const l of D) {
      const why = []; let s = 0; const tags = taguriBuc(l);
      if (a.buc) { if (!a.buc.some(b => tags.includes(b))) continue; s += 3; why.push("bucătărie potrivită"); }
      if (a.veg) { if (!(areOpt(l, "vegetarian") || areOpt(l, "vegan"))) continue; s += 3; why.push("bucătărie potrivită"); }
      if (a.tip) { if (!a.tip.includes(l.tip)) continue; s += 3; why.push("stil potrivit"); }
      if (a.stil === "masa") { if (!["restaurant", "pub"].includes(l.tip)) continue; s += 2; why.push("stil potrivit"); }
      if (a.stil === "rapid") { if (l.tip !== "fast-food") continue; s += 2; why.push("stil potrivit"); }
      if (a.stil === "terasa" && areOpt(l, "terasa")) { s += 3; why.push("are terasă"); }
      if (a.stil === "pachet") { if (areOpt(l, "takeaway") || l.tip === "fast-food") { s += 2; why.push("la pachet"); } else continue; }
      if (l.vizitat && l.parerea_mea) { s += 1; why.push("ai părerea mea"); }
      const np = notaPublica(l); if (np != null && np >= 4.5) { s += 1; why.push(`notă publică ${np} ★`); }
      out.push({ l, s, why: [...new Set(why)], r: Math.random() });
    }
    return out.sort((x, y) => y.s - x.s || y.r - x.r);
  }
  function arata() {
    const body = document.getElementById("wizBody"); document.getElementById("wizBack").hidden = step === 0;
    if (step < Q.length) {
      const q = Q[step];
      body.innerHTML = `<p class="sub">Pasul ${step + 1} din ${Q.length}</p><h3>${q.q}</h3><div class="wopts">${q.opts.map((o, i) => `<button type="button" class="wopt" data-i="${i}">${o[0]}</button>`).join("")}</div>`;
      return;
    }
    const all = rezultate(), top = all.length ? [0, 1, 2].map(i => all[(off + i) % all.length]).filter((x, i, ar) => ar.indexOf(x) === i) : [];
    body.innerHTML = top.length
      ? `<h3>Îți propun:</h3><ul class="wres">${top.map(({ l, why }) => `<li class="${tipCls(l.tip)}"><a href="loc.html?id=${encodeURIComponent(l.id)}"><b>${esc(l.nume)}</b></a> <span class="tag tip">${esc(l.tip)}</span><div class="taguri">${why.map(w => `<span class="tag">${esc(w)}</span>`).join("")}</div></li>`).join("")}</ul>
         <div class="butoane">${all.length > 3 ? `<button type="button" id="wizAgain">Încă o dată 🎲</button>` : ""}<button type="button" id="wizRestart" class="icon">De la capăt</button></div>`
      : `<p class="gol-msg">Nu am găsit nimic exact. Alege "🎲 Orice" la una dintre întrebări și încearcă din nou.</p><div class="butoane"><button type="button" id="wizRestart" class="icon">De la capăt</button></div>`;
  }
  document.getElementById("wizBtn").onclick = async () => {
    if (!D) { try { D = await (await fetch("data/locuri.json")).json(); } catch (e) { D = []; } }
    step = 0; ans = []; off = 0; arata(); dlg.showModal();
  };
  document.getElementById("wizBody").addEventListener("click", e => {
    const o = e.target.closest("[data-i]");
    if (o) { ans.push(Q[step].opts[+o.dataset.i][1]); step++; off = 0; arata(); return; }
    if (e.target.id === "wizAgain") { off += 3; arata(); }
    if (e.target.id === "wizRestart") { step = 0; ans = []; off = 0; arata(); }
  });
  document.getElementById("wizBack").onclick = () => { if (step > 0) { step--; ans.pop(); off = 0; arata(); } };
})();
