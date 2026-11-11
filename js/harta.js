fetch("data/locuri.json").then(r=>r.json()).then(D=>{
 const cu=D.filter(l=>l.lat!=null&&l.lon!=null),byId=Object.fromEntries(D.map(l=>[l.id,l]));
 const CENTRU=[45.7489,21.2087];
 const link=l=>l?linkMaps(l):"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent("restaurante Timisoara");
 $("hp").innerHTML='<option value="">Toate locurile</option>'+D.map(l=>`<option value="${esc(l.id)}">${esc(l.nume)}</option>`).join("");
 $("hl").href=link(null);
 if(cu.length&&window.L){
  // hartă OpenStreetMap (fără cheie API): câte un marker pentru fiecare loc cu coordonate
  $("hm").hidden=true;$("lm").hidden=false;
  const map=L.map("lm").setView(CENTRU,13),mk={};
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap contributors"}).addTo(map);
  cu.forEach(l=>{mk[l.id]=L.marker([l.lat,l.lon]).addTo(map).bindPopup(
   `<b>${esc(l.nume)}</b><br>${esc([l.tip,l.bucatarie].filter(Boolean).join(" · "))}<br><a href="loc.html?id=${encodeURIComponent(l.id)}">Detalii</a> · <a href="${esc(linkMaps(l))}" target="_blank" rel="noopener">Maps</a>`)});
  $("hmsg").textContent=cu.length+" din "+D.length+" locuri au coordonate și apar pe hartă.";
  $("hp").onchange=()=>{const l=byId[$("hp").value];$("hl").href=link(l);
   if(!l){map.setView(CENTRU,13);return}
   if(mk[l.id]){map.setView([l.lat,l.lon],17);mk[l.id].openPopup()}
   else $("hmsg").textContent="„"+l.nume+"” nu are coordonate; îl poți deschide în Google Maps."};
 }else{
  // încă n-ai rulat importul din OpenStreetMap: rămâne harta Google (embed)
  $("hmsg").textContent="Încă nu avem coordonate. Rulează tools/import_osm.py ca să apară markerele; până atunci folosim harta Google.";
  const upd=()=>{const l=byId[$("hp").value],q=l?l.nume+" Timisoara":"restaurante Timisoara";
   $("hm").src="https://www.google.com/maps?q="+encodeURIComponent(q)+"&output=embed";$("hl").href=link(l)};
  $("hp").onchange=upd;upd();
 }
}).catch(()=>{$("hp").innerHTML="<option>Nu am putut încărca locurile</option>"});
