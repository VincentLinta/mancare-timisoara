// Funcții folosite de toate paginile (index, loc, admin)
const $ = id => document.getElementById(id);
const norm = s => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const taguriBuc = l => (l.bucatarie || "").split(",").map(s => s.trim()).filter(Boolean);
const notaPublica = l => l.maps?.rating ?? l.tripadvisor?.rating ?? null;

// dacă avem place_id deschide exact locul, altfel face o căutare după nume
const linkMaps = l => l.place_id && l.place_id !== "TODO"
  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.nume + " Timisoara")}&query_place_id=${l.place_id}`
  : l.adresa ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent([l.nume, l.adresa, "Timișoara"].join(", "))
  : l.link_maps;

// poză reală (din img/) dacă există, altfel un placeholder colorat cu emoji
const EMOJI = [[/pizza/,"🍕"],[/burger/,"🍔"],[/pui/,"🍗"],[/sushi|japonez/,"🍣"],[/indian/,"🍛"],
  [/fructe de mare/,"🦐"],[/steak/,"🥩"],[/vegan|vegetarian/,"🥗"],[/cafenea/,"☕"],[/pub/,"🍺"],
  [/asiatic/,"🥢"],[/indonezian/,"🍜"],[/paste|italian/,"🍝"],[/romanesc|tradi/,"🥘"]];
function thumb(l) {
  if (l.poze?.length) return `<img class="thumb" src="img/${esc(l.poze[0])}" alt="${esc(l.nume)}" loading="lazy">`;
  const t = norm([l.tip, l.bucatarie].join(" "));
  const e = (EMOJI.find(([r]) => r.test(t)) || [0, "🍽️"])[1];
  let k = 0; for (const c of l.nume) k = (k * 31 + c.charCodeAt(0)) % 360;
  const BAZA = { restaurant: 175, "fast-food": 18, pub: 325, cafenea: 215, bar: 325, "înghețată": 45 };   // fiecare tip are propria familie de culori
  const h = (((BAZA[l.tip] ?? k) + (k % 40) - 20) + 360) % 360;
  return `<div class="thumb ph" style="background:linear-gradient(135deg,hsl(${h} 62% 50%),hsl(${(h + 28) % 360} 64% 36%))" role="img" aria-label="${esc(l.nume)}">${e}</div>`;
}

// notele (Maps, Tripadvisor, a mea) ca bucăți de HTML
function noteHtml(l) {
  const n = [];
  if (l.maps?.rating != null)
    n.push(`<span class="nota maps">${l.maps.rating} ★ <small>Maps${l.maps.nr_review != null ? " (" + l.maps.nr_review + ")" : ""}</small></span>`);
  if (l.tripadvisor?.rating != null)
    n.push(`<span class="nota ta">${l.tripadvisor.rating} ★ <small>Tripadvisor (${l.tripadvisor.nr_review})</small></span>`);
  if (!n.length) n.push(`<span class="nota gol">fără notă publică</span>`);
  n.push(l.parerea_mea
    ? (l.parerea_mea.nota != null
        ? `<span class="nota mea">${l.parerea_mea.nota}/10 <small>nota mea</small></span>`
        : `<span class="nota mea">am fost <small>fără notă încă</small></span>`)
    : `<span class="nota gol">încă n-am fost</span>`);
  return n.join("");
}

// ---------- favorite (localStorage), toast, distribuire ----------
function getFav(){try{return JSON.parse(localStorage.getItem("fav"))||[]}catch(e){return []}}
const isFav=id=>getFav().includes(id);
function toggleFav(id){const f=getFav(),i=f.indexOf(id);i>=0?f.splice(i,1):f.push(id);try{localStorage.setItem("fav",JSON.stringify(f))}catch(e){}return i<0}
function toast(m){const t=document.createElement("div");t.className="toast";t.textContent=m;t.setAttribute("role","status");document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
async function shareLink(url,title){
  if(navigator.share){try{await navigator.share({title,url});return}catch(e){if(e.name==="AbortError")return}}
  try{await navigator.clipboard.writeText(url);toast("Link copiat! 📋")}catch(e){prompt("Copiază linkul:",url)}
}

// ---------- facilități, derulare respectând "reduce motion", linkuri sigure ----------
const OPT={terasa:"Terasă",vegetarian:"Vegetarian",vegan:"Vegan",livrare:"Livrare",takeaway:"Takeaway",accesibil:"Accesibil"};
const areOpt=(l,o)=>(l.optiuni||[]).includes(o)||taguriBuc(l).includes(o);   // vegan/vegetarian pot fi și bucătărie
const SMOOTH=matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth";
function urlSigur(u){u=String(u||"").trim();if(!u)return null;if(!/^https?:\/\//i.test(u))u="https://"+u;
 try{const x=new URL(u);return /^https?:$/.test(x.protocol)?x.href:null}catch(e){return null}}

async function shareText(title,text){
  if(navigator.share){try{await navigator.share({title,text});return}catch(e){if(e.name==="AbortError")return}}
  try{await navigator.clipboard.writeText(text);toast("Text copiat! 📋")}catch(e){prompt("Copiază textul:",text)}
}

// ---------- clasa de culoare după tip și etichetele unui loc ----------
const TIPC = { restaurant: "r", "fast-food": "f", pub: "p", cafenea: "c", bar: "b", "înghețată": "i" };
const tipCls = tip => "t-" + (TIPC[tip] || "x");
function tagHtml(l, dist) {
  const t = [`<span class="tag tip">${esc(l.tip)}</span>`];
  if (l.bucatarie) t.push(`<span class="tag cui">${esc(l.bucatarie)}</span>`);
  if (l.zona) t.push(`<span class="tag zona">${esc(l.zona)}</span>`);
  (l.optiuni || []).forEach(o => t.push(`<span class="tag fac">${esc(OPT[o] || o)}</span>`));
  if (typeof deschisAcum === "function") { const o = deschisAcum(l.program); if (o !== null) t.push(`<span class="tag ${o ? "deschis" : "inchis"}">${o ? "Deschis acum" : "Închis acum"}</span>`); }   // doar dacă locul are program
  if (dist) t.push(`<span class="tag dist">📍 ${esc(dist)}</span>`);
  return t.join("");
}
