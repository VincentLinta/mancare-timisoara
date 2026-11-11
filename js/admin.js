let L = [];
const num = v => v === "" ? null : Number(v);
const txt = v => v.trim() === "" ? null : v.trim();
const slug = s => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

fetch("data/locuri.json").then(r => r.json()).then(d => { L = d; umple(); incarca(); })
  .catch(e => $("msg").textContent = "Nu pot citi locuri.json: " + e.message + " (folosești Live Server?)");

function umple(selectat) {
  $("alege").innerHTML = L.map((l, i) => `<option value="${i}">${esc(l.nume)}</option>`).join("");
  if (selectat != null) $("alege").value = selectat;
}
function incarcaExtra() {
  const l = L[$("alege").value]; if (!l) return;
  document.querySelectorAll("[data-o]").forEach(c => c.checked = (l.optiuni || []).includes(c.dataset.o));
  $("f_tel").value = l.telefon ?? ""; $("f_web").value = l.website ?? ""; $("f_prog").value = l.program ?? "";
}
function incarca() {
  incarcaExtra();
  const l = L[$("alege").value]; if (!l) return; const p = l.parerea_mea || {};
  $("f_rating").value = l.maps?.rating ?? ""; $("f_nr").value = l.maps?.nr_review ?? "";
  $("f_place").value = l.place_id === "TODO" ? "" : l.place_id || "";
  $("f_zona").value = l.zona ?? ""; $("f_adresa").value = l.adresa ?? "";
  $("f_vizitat").checked = !!l.vizitat; $("f_nota").value = p.nota ?? ""; $("f_mancat").value = p.ce_am_mancat ?? "";
  $("f_platit").value = p.pret_platit ?? ""; $("f_plus").value = p.plus ?? ""; $("f_minus").value = p.minus ?? ""; $("f_data").value = p.data ?? "";
}
$("alege").onchange = incarca;

$("aplica").onclick = () => {
  const l = L[$("alege").value];
  l.place_id = txt($("f_place").value) || "TODO";
  l.maps = { rating: num($("f_rating").value), nr_review: num($("f_nr").value) };
  l.zona = txt($("f_zona").value);
  const adr = txt($("f_adresa").value); if (adr) l.adresa = adr; else delete l.adresa;
  l.optiuni = [...document.querySelectorAll("[data-o]:checked")].map(c => c.dataset.o);
  for (const [k, id] of [["telefon", "f_tel"], ["website", "f_web"], ["program", "f_prog"]]) { const v = txt($(id).value); if (v) l[k] = v; else delete l[k]; }
  l.vizitat = $("f_vizitat").checked;
  l.parerea_mea = l.vizitat ? { nota: num($("f_nota").value), ce_am_mancat: txt($("f_mancat").value),
    pret_platit: num($("f_platit").value), plus: txt($("f_plus").value), minus: txt($("f_minus").value), data: txt($("f_data").value) } : null;
  $("msg").textContent = "Aplicat la " + l.nume + ". Nu uita să descarci fișierul când termini.";
};

$("adauga").onclick = () => {
  const nume = $("n_nume").value.trim(); if (!nume) return;
  L.push({ id: slug(nume), nume, tip: $("n_tip").value, bucatarie: null, zona: null, place_id: "TODO",
    link_maps: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(nume + " Timisoara"),
    maps: { rating: null, nr_review: null }, vizitat: false, parerea_mea: null, poze: [] });
  umple(L.length - 1); incarca(); $("n_nume").value = ""; $("msg").textContent = "Loc adăugat: completează-i datele mai sus.";
};

$("descarca").onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(L, null, 2)], { type: "application/json" }));
  a.download = "locuri.json"; a.click(); URL.revokeObjectURL(a.href);
};
