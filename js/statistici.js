const count=list=>Object.entries(list.filter(Boolean).reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{})).sort((a,b)=>b[1]-a[1]);
// un grafic cu bare: fiecare rând = etichetă + bară proporțională + valoare
function bar(id,entries,max,suffix=""){
 max=max||Math.max(...entries.map(e=>e[1]),1);
 $(id).innerHTML=entries.map(([n,v])=>`<div class="rand"><span>${esc(n)}</span><div class="track"><div class="fill" style="width:${Math.round(v/max*100)}%"></div></div><b>${v}${suffix}</b></div>`).join("")||'<p class="gol-msg">Nu sunt date.</p>';
}
fetch("data/locuri.json").then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).then(D=>{
 const n=D.length,pub=D.map(notaPublica).filter(x=>x!=null);
 const medie=pub.length?(pub.reduce((a,b)=>a+b,0)/pub.length).toFixed(2):"–";
 $("kpi").innerHTML=[[n,"locuri în ghid"],[D.filter(l=>l.vizitat).length,"unde am fost"],[medie,"nota publică medie (din 5)"],[D.filter(l=>l.parerea_mea?.nota!=null).length,"cu nota mea"]]
  .map(([v,t])=>`<div class="kpi"><b>${v}</b><span>${t}</span></div>`).join("");
 bar("c_tip",count(D.map(l=>l.tip)));
 bar("c_buc",count(D.flatMap(taguriBuc)).slice(0,8));
 // nota mea (din 10) vs nota publică (din 5, înmulțită cu 2 ca să fie pe aceeași scară)
 const both=D.filter(l=>l.parerea_mea?.nota!=null&&notaPublica(l)!=null)
  .map(l=>({l,me:l.parerea_mea.nota,pu:notaPublica(l)*2})).sort((a,b)=>Math.abs(b.me-b.pu)-Math.abs(a.me-a.pu));
 $("c_cmp").innerHTML=both.length?both.map(o=>{const d=o.me-o.pu;return `<div class="rand duo-r"><span>${esc(o.l.nume)}</span><div class="duo"><div class="track"><div class="fill" style="width:${o.me*10}%"></div></div><div class="track"><div class="fill b" style="width:${o.pu*10}%"></div></div></div><b>${o.me} vs ${o.pu.toFixed(1)} (${d>0?"+":""}${d.toFixed(1)})</b></div>`}).join("")
  :'<p class="gol-msg">Completează „nota mea" și o notă publică la câteva locuri (din admin.html) și apare comparația.</p>';
 const c=f=>D.filter(f).length;
 bar("c_comp",[["cu zonă",c(l=>l.zona)],["cu bucătărie",c(l=>l.bucatarie)],["cu notă Maps",c(l=>l.maps?.rating!=null)],
  ["cu notă Tripadvisor",c(l=>l.tripadvisor)],["cu părerea mea",c(l=>l.parerea_mea)]],n,` / ${n}`);
}).catch(e=>{$("kpi").innerHTML=`<div class="eroare">Nu am putut încărca datele (${esc(e.message)}). Folosești Live Server?</div>`});
