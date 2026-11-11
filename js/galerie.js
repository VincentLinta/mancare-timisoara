// Galerie: grilă de fișe + vizualizare mărită cu Previous/Next, săgeți de la tastatură, swipe pe telefon și bandă de miniaturi.
// Fără poze, fiecare loc e o „fișă" ilustrată (emoji + culoare + note). Dacă adaugi poze în JSON, apar ele.
let items=[],i=0,strip=null;
const lb=$("lb");
fetch("data/locuri.json").then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).then(L=>{
 L.forEach(l=>{if(l.poze?.length)l.poze.forEach(p=>items.push({l,p}));else items.push({l,p:null})});
 $("gal").innerHTML=items.map((it,k)=>`<button type="button" data-k="${k}" aria-label="Mărește: ${esc(it.l.nume)}">${it.p?`<img class="thumb" src="img/${esc(it.p)}" alt="${esc(it.l.nume)}" loading="lazy">`:thumb(it.l)}<span>${esc(it.l.nume)}</span></button>`).join("");
 $("gal").removeAttribute("aria-busy");
}).catch(e=>{$("gal").removeAttribute("aria-busy");$("gal").innerHTML=`<p class="eroare" role="alert">Nu am putut încărca galeria (${esc(e.message)}). Folosești Live Server?</p>`});
function poster(l){
 const pm=l.parerea_mea,taguri=tagHtml(l);
 return `${thumb(l)}<h2>${esc(l.nume)}</h2><div class="taguri">${taguri}</div><div class="note">${noteHtml(l)}</div>`+
  (pm&&(pm.plus||pm.minus)?`<p><b>+</b> ${esc(pm.plus||"-")} · <b>−</b> ${esc(pm.minus||"-")}</p>`:"")+
  `<p><a href="loc.html?id=${encodeURIComponent(l.id)}">Detalii →</a></p>`}
// banda de miniaturi se construiește o singură dată, la prima deschidere
function construiesteBanda(){
 if(strip)return;strip=$("lbstrip");
 strip.innerHTML=items.map((it,k)=>`<button type="button" data-k="${k}" aria-label="${esc(it.l.nume)}">${it.p?`<img src="img/${esc(it.p)}" alt="" loading="lazy">`:thumb(it.l)}</button>`).join("")}
function marcheaza(){
 if(!strip)return;
 strip.querySelectorAll("button").forEach((b,k)=>{const activ=k===i;b.classList.toggle("on",activ);
  if(activ){b.setAttribute("aria-current","true");const st=b.offsetLeft-(strip.clientWidth-b.offsetWidth)/2;
   if(strip.scrollTo)strip.scrollTo({left:st,behavior:SMOOTH});else strip.scrollLeft=st}
  else b.removeAttribute("aria-current")})}
// încarcă din timp imaginile vecine, ca Next/Previous să fie instant pe telefon
function preincarca(){[-1,1].forEach(d=>{const it=items[(i+d+items.length)%items.length];if(it&&it.p){const im=new Image();im.src="img/"+it.p}})}
function show(k){i=(k+items.length)%items.length;const it=items[i];
 $("lbimg").innerHTML=it.p?`<img src="img/${esc(it.p)}" alt="${esc(it.l.nume)}"><h2>${esc(it.l.nume)}</h2>`:poster(it.l);
 $("lbn").textContent=`${i+1} / ${items.length}`;marcheaza();preincarca()}
$("gal").onclick=e=>{const b=e.target.closest("button[data-k]");if(b){construiesteBanda();lb.showModal();show(+b.dataset.k)}};
$("prev").onclick=()=>show(i-1);$("next").onclick=()=>show(i+1);$("close").onclick=()=>lb.close();$("close2").onclick=()=>lb.close();
$("lbstrip").onclick=e=>{const b=e.target.closest("button[data-k]");if(b)show(+b.dataset.k)};
lb.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")show(i-1);if(e.key==="ArrowRight")show(i+1)});
lb.addEventListener("click",e=>{if(e.target===lb)lb.close()});
// swipe pe telefon: mișcare orizontală de peste 50px, mai mult orizontală decât verticală (ca să nu strice derularea)
let sx=0,sy=0;
lb.addEventListener("touchstart",e=>{if(e.target.closest("#lbstrip"))return;const t=e.changedTouches[0];sx=t.clientX;sy=t.clientY},{passive:true});
lb.addEventListener("touchend",e=>{if(e.target.closest("#lbstrip"))return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
 if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)show(i+(dx<0?1:-1))},{passive:true});
