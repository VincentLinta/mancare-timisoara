let D=[],key="nume",asc=true;
// fiecare coloană: [cheie, titlu, cum scoatem valoarea dintr-un loc]
const COLS=[["nume","Nume",l=>l.nume],["tip","Tip",l=>l.tip],["bucatarie","Bucătărie",l=>l.bucatarie],["zona","Zonă",l=>l.zona],
 ["maps","Maps ★",l=>l.maps?.rating],["ta","Tripadvisor ★",l=>l.tripadvisor?.rating],
 ["mea","Nota mea",l=>l.parerea_mea?.nota],["vizitat","Am fost",l=>l.vizitat?1:null]];
const val=(l,k)=>COLS.find(c=>c[0]===k)[2](l);
const gol=v=>v==null||v==="";
function cell(l,k){const v=val(l,k);
 if(k==="nume")return `<a href="loc.html?id=${encodeURIComponent(l.id)}">${esc(l.nume)}</a>`;
 if(k==="vizitat")return v?"✔":"";
 return gol(v)?"–":esc(v)}
function randeaza(){
 const q=norm($("tq").value.trim());
 const rows=D.filter(l=>{const h=norm([l.nume,l.tip,l.bucatarie,l.zona].join(" "));return q.split(/\s+/).filter(Boolean).every(t=>h.includes(t))}).sort((a,b)=>{
  const x=val(a,key),y=val(b,key);
  if(gol(x))return gol(y)?0:1; if(gol(y))return -1;   // valorile lipsă la final, indiferent de direcție
  const c=typeof x==="number"?x-y:String(x).localeCompare(String(y),"ro");return asc?c:-c});
 $("th").innerHTML="<tr>"+COLS.map(([k,n])=>`<th scope="col" aria-sort="${k===key?(asc?"ascending":"descending"):"none"}"><button type="button" data-k="${k}">${n}${k===key?(asc?" ▲":" ▼"):""}</button></th>`).join("")+"</tr>";
 $("tb").innerHTML=rows.length?rows.map(l=>"<tr>"+COLS.map(([k])=>`<td>${cell(l,k)}</td>`).join("")+"</tr>").join(""):`<tr><td colspan="${COLS.length}" class="gol-td"><p class="gol-ic" aria-hidden="true">🔍</p><b>Niciun loc nu se potrivește</b><br><button type="button" id="tgol" class="icon">Șterge filtrul</button></td></tr>`;
 $("tnr").textContent=rows.length+" din "+D.length+" locuri";}
$("th").onclick=e=>{const b=e.target.closest("button");if(!b)return;if(key===b.dataset.k)asc=!asc;else{key=b.dataset.k;asc=true}randeaza()};
$("tq").addEventListener("input",randeaza);
$("tb").onclick=e=>{if(e.target.id==="tgol"){$("tq").value="";randeaza();$("tq").focus()}};
fetch("data/locuri.json").then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).then(d=>{D=d;randeaza()})
 .catch(e=>{$("tnr").textContent="Nu am putut încărca datele ("+e.message+"). Folosești Live Server?"});
