// Navbar fix, footer, butoane Sus/Jos/Help/Chat, temă, mărime text. Încărcat pe toate paginile publice.
const PAGES=[['index.html','Locuri'],['tabel.html','Tabel'],['harta.html','Hartă'],['galerie.html','Galerie'],['recomanda.html','Recomandă'],['statistici.html','Statistici'],['despre.html','Despre'],['contact.html','Contact']];
// Linkurile rețelelor tale: pune adresele aici sau rulează  python tools/seteaza.py --github URL --instagram URL --facebook URL --discord URL
// (cât timp valoarea e "#", iconița apare dar nu e clicabilă; poți adăuga și snapchat:"URL")
const SOCIAL={github:"https://github.com/VincentLinta",instagram:"#",youtube:"#",tiktok:"#"};
// iconițele sunt SVG în pagină (din Bootstrap Icons, licență MIT): fără font sau CSS de pe CDN, deci pagina se încarcă mai repede
const bi=p=>`<svg class="bi" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">${p}</svg>`;
const SOC_ICO={youtube:["YouTube","<path d=\"M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z\"/>"],tiktok:["TikTok","<path d=\"M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z\"/>"],github:["GitHub","<path d=\"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8\"/>"],instagram:["Instagram","<path d=\"M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334\"/>"],facebook:["Facebook","<path d=\"M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951\"/>"],discord:["Discord","<path d=\"M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612\"/>"],snapchat:["Snapchat","<path d=\"M15.943 11.526c-.111-.303-.323-.465-.564-.599a1 1 0 0 0-.123-.064l-.219-.111c-.752-.399-1.339-.902-1.746-1.498a3.4 3.4 0 0 1-.3-.531c-.034-.1-.032-.156-.008-.207a.3.3 0 0 1 .097-.1c.129-.086.262-.173.352-.231.162-.104.289-.187.371-.245.309-.216.525-.446.66-.702a1.4 1.4 0 0 0 .069-1.16c-.205-.538-.713-.872-1.329-.872a1.8 1.8 0 0 0-.487.065c.006-.368-.002-.757-.035-1.139-.116-1.344-.587-2.048-1.077-2.61a4.3 4.3 0 0 0-1.095-.881C9.764.216 8.92 0 7.999 0s-1.76.216-2.505.641c-.412.232-.782.53-1.097.883-.49.562-.96 1.267-1.077 2.61-.033.382-.04.772-.036 1.138a1.8 1.8 0 0 0-.487-.065c-.615 0-1.124.335-1.328.873a1.4 1.4 0 0 0 .067 1.161c.136.256.352.486.66.701.082.058.21.14.371.246l.339.221a.4.4 0 0 1 .109.11c.026.053.027.11-.012.217a3.4 3.4 0 0 1-.295.52c-.398.583-.968 1.077-1.696 1.472-.385.204-.786.34-.955.8-.128.348-.044.743.28 1.075q.18.189.409.31a4.4 4.4 0 0 0 1 .4.7.7 0 0 1 .202.09c.118.104.102.26.259.488q.12.178.296.3c.33.229.701.243 1.095.258.355.014.758.03 1.217.18.19.064.389.186.618.328.55.338 1.305.802 2.566.802 1.262 0 2.02-.466 2.576-.806.227-.14.424-.26.609-.321.46-.152.863-.168 1.218-.181.393-.015.764-.03 1.095-.258a1.14 1.14 0 0 0 .336-.368c.114-.192.11-.327.217-.42a.6.6 0 0 1 .19-.087 4.5 4.5 0 0 0 1.014-.404c.16-.087.306-.2.429-.336l.004-.005c.304-.325.38-.709.256-1.047m-1.121.602c-.684.378-1.139.337-1.493.565-.3.193-.122.61-.34.76-.269.186-1.061-.012-2.085.326-.845.279-1.384 1.082-2.903 1.082s-2.045-.801-2.904-1.084c-1.022-.338-1.816-.14-2.084-.325-.218-.15-.041-.568-.341-.761-.354-.228-.809-.187-1.492-.563-.436-.24-.189-.39-.044-.46 2.478-1.199 2.873-3.05 2.89-3.188.022-.166.045-.297-.138-.466-.177-.164-.962-.65-1.18-.802-.36-.252-.52-.503-.402-.812.082-.214.281-.295.49-.295a1 1 0 0 1 .197.022c.396.086.78.285 1.002.338q.04.01.082.011c.118 0 .16-.06.152-.195-.026-.433-.087-1.277-.019-2.066.094-1.084.444-1.622.859-2.097.2-.229 1.137-1.22 2.93-1.22 1.792 0 2.732.987 2.931 1.215.416.475.766 1.013.859 2.098.068.788.009 1.632-.019 2.065-.01.142.034.195.152.195a.4.4 0 0 0 .082-.01c.222-.054.607-.253 1.002-.338a1 1 0 0 1 .197-.023c.21 0 .409.082.49.295.117.309-.04.56-.401.812-.218.152-1.003.638-1.18.802-.184.169-.16.3-.139.466.018.14.413 1.991 2.89 3.189.147.073.394.222-.041.464\"/>"]};
const socialHtml=()=>Object.entries(SOCIAL).filter(([k])=>SOC_ICO[k]).map(([k,u])=>{const [n,i]=SOC_ICO[k];
 return u&&u!=="#"?`<a href="${u}" target="_blank" rel="noopener noreferrer" aria-label="${n}" title="${n}">${bi(i)}</a>`
  :`<span class="soc-off" role="img" aria-label="${n}" title="${n}">${bi(i)}</span>`}).join("");
const root=document.documentElement;
if(localStorage.getItem('theme'))root.dataset.theme=localStorage.getItem('theme');
root.style.fontSize=(localStorage.getItem('fs')||16)+'px';

document.addEventListener('DOMContentLoaded',()=>{
 let cur=location.pathname.split('/').pop()||'index.html'; if(cur==='loc.html')cur='index.html';
 const links=PAGES.map(([h,n])=>`<li><a href="${h}" class="${h===cur?'active':''}" ${h===cur?'aria-current="page"':''}>${n}</a></li>`).join('');
 document.body.insertAdjacentHTML('afterbegin',`
 <a class="skip" href="#continut">Sari la conținut</a>
 <nav class="nav" aria-label="Principal"><div class="wrap nav-in">
  <a class="brand" href="index.html">🍽️ Mâncare TM</a>
  <button id="burger" class="icon" aria-label="Meniu" aria-expanded="false" aria-controls="menu">☰</button>
  <div class="menu" id="menu"><ul>${links}</ul>
   <form id="navForm" role="search"><input id="navq" aria-keyshortcuts="F2" type="search" placeholder="Caută un loc…" aria-label="Caută un loc"><button class="icon" aria-label="Caută">🔍</button></form>
   <div class="tools"><button id="fsDown" class="icon" aria-label="A- Text mai mic">A-</button><button id="fsUp" class="icon" aria-label="A+ Text mai mare">A+</button><button id="themeBtn" aria-keyshortcuts="F4" class="icon" aria-label="Schimbă tema luminos/întunecat">🌓</button><button id="langBtn" class="icon" data-no-i18n aria-label="EN Language / Limba" title="Language / Limba">EN</button></div>
  </div></div></nav>`);
 document.body.insertAdjacentHTML('beforeend',`
 <footer><div class="wrap"><div class="social">${socialHtml()}</div>
  <p>© 2026-2027 Mâncare în Timișoara · Proiect PIUG, UPT<br>Date despre locuri: surse publice și © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a><br><a href="ghid-stil.html">Ghid de stil</a> · <button id="ckSet" class="linkb" type="button">Setări cookie-uri</button></p>
  <p class="kbd-hint">Scurtături de tastatură: F2 caută · F4 temă · F8 ajutor · F9 asistent</p></div></footer>
 <div id="cookie" class="cookie" role="region" aria-label="Cookie-uri" hidden>
  <p>Folosesc Google Analytics doar dacă ești de acord, ca să văd ce pagini sunt vizitate. Poți refuza, site-ul merge la fel.</p>
  <div class="butoane"><button id="ckOk" type="button">Accept</button><button id="ckNu" type="button">Refuz</button></div></div>
 <button class="fab" id="upBtn" style="bottom:8.2rem" aria-label="Sus">↑</button>
 <button class="fab" id="downBtn" style="bottom:4.6rem" aria-label="Jos">↓</button>
 <button class="fab" id="helpBtn" aria-keyshortcuts="F8" style="bottom:1rem" aria-label="Ajutor">?</button>
 <button class="fab" id="chatBtn" aria-keyshortcuts="F9" aria-label="Deschide chatul">💬</button>
 <div id="chatBox" role="dialog" aria-label="Asistent"><div class="chat-h">Asistent mâncare</div><div id="chatLog" aria-live="polite"></div><div id="chips" class="chips"></div>
  <form id="chatForm"><input id="chatIn" placeholder="ex: pizza în centru…" aria-label="Mesaj"><button>Trimite</button></form></div>
 <dialog id="helpDlg"><h2>Cum folosești site-ul</h2><ul>
  <li><b>Locuri:</b> caută, filtrează după tip/zonă/bucătărie și sortează. „⭐ Topul meu" arată doar locurile la care am fost.</li>
  <li><b>Căutarea de sus</b> te duce direct la lista filtrată.</li>
  <li><b>🎲 Surprinde-mă</b> alege un loc la întâmplare dintre cele filtrate; <b>♡</b> salvează un favorit; <b>Compară</b> pune până la 3 locuri față în față; <b>🔗</b> copiază linkul.</li>
  <li><b>Scurtături:</b> F2 = caută, F4 = schimbă tema, F8 = ajutor, F9 = asistent. Sunt doar taste F, ca să nu se apese din greșeală când scrii; pe unele laptopuri trebuie să ții apăsat și Fn.</li>
  <li><b>Contact:</b> scrie-mi o întrebare sau o sugestie; telefonul e opțional, dar dacă îl scrii trebuie să fie valid.</li>
  <li><b>Tabel:</b> apasă pe titlul unei coloane ca să sortezi.</li>
  <li><b>Galerie:</b> apasă pe un loc ca să-l vezi mărit; navighezi cu Previous/Next sau cu săgețile de la tastatură.</li>
  <li><b>A- / A+</b> schimbă mărimea textului, <b>🌓</b> trece între luminos și întunecat.</li>
  <li><b>↑ ↓</b> sar la începutul sau sfârșitul paginii, <b>💬</b> e asistentul care știe locurile din listă.</li></ul>
  <form method="dialog"><button>Închide</button></form></dialog>`);

 const mainEl=document.querySelector('main');if(mainEl){mainEl.setAttribute('tabindex','-1');if(!mainEl.id)mainEl.id='continut';document.querySelector('.skip').setAttribute('href','#'+mainEl.id)}
 document.querySelector('.skip').onclick=e=>{e.preventDefault();if(mainEl){mainEl.focus();mainEl.scrollIntoView()}};
 document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;$('menu').classList.remove('open');$('burger').setAttribute('aria-expanded','false');
  if($('chatBox').classList.contains('open')){$('chatBox').classList.remove('open');$('chatBtn').focus()}});
 const ck=$('cookie');let stare=null;try{stare=localStorage.getItem('cookie-analytics')}catch(e){}
 const alege=v=>{try{localStorage.setItem('cookie-analytics',v)}catch(e){}ck.hidden=true;if(v==='da')pornesteAnalytics();else gtag('consent','update',{analytics_storage:'denied'})};
 if(!stare)ck.hidden=false;
 $('ckOk').onclick=()=>alege('da');$('ckNu').onclick=()=>alege('nu');$('ckSet').onclick=()=>{ck.hidden=false;$('ckOk').focus()};
 $('burger').onclick=()=>{const o=$('menu').classList.toggle('open');$('burger').setAttribute('aria-expanded',o)};
 $('themeBtn').onclick=()=>{const cur=root.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');const t=cur==='dark'?'light':'dark';root.dataset.theme=t;localStorage.setItem('theme',t)};
 const setFs=d=>{const f=Math.min(22,Math.max(13,parseInt(localStorage.getItem('fs')||16)+d));localStorage.setItem('fs',f);root.style.fontSize=f+'px'};
 $('fsUp').onclick=()=>setFs(1);$('fsDown').onclick=()=>setFs(-1);
 $('upBtn').onclick=()=>scrollTo({top:0,behavior: SMOOTH});
 $('downBtn').onclick=()=>scrollTo({top:document.body.scrollHeight,behavior: SMOOTH});
 $('helpBtn').onclick=()=>$('helpDlg').showModal();

 // ---------- scurtături de tastatură: doar taste F (nu se pot apăsa din greșeală când scrii) ----------
 // F1, F3, F5, F6, F7, F11, F12 rămân ale browserului. Cu Ctrl/Alt/Shift/Cmd apăsate nu facem nimic (Alt+F4 închide fereastra).
 const SCURT={
  F2:()=>{const el=document.getElementById('cauta')||document.getElementById('tq')||$('navq');
   if(el===$('navq')&&getComputedStyle($('menu')).display==='none')$('burger').click();   // pe telefon deschide meniul ca să existe unde scrie
   el.focus();if(el.select)el.select()},
  F4:()=>$('themeBtn').click(),
  F8:()=>{const d=$('helpDlg');d.hasAttribute('open')?d.close():d.showModal()},
  F9:()=>{const b=$('chatBox');if(b.classList.contains('open')){b.classList.remove('open');$('chatBtn').focus()}else $('chatBtn').click()}};
 document.addEventListener('keydown',e=>{
  const act=SCURT[e.key];
  if(!act||e.ctrlKey||e.altKey||e.metaKey||e.shiftKey||e.repeat)return;
  const dlg=document.querySelector('dialog[open]');
  if(dlg&&!(e.key==='F8'&&dlg.id==='helpDlg'))return;      // cu o fereastră deschisă doar F8 o poate închide pe cea de Help
  e.preventDefault();act()});

 // căutarea din navbar: pe pagina listei filtrează direct, pe alte pagini te duce la listă
 $('navForm').onsubmit=e=>{e.preventDefault();const v=$('navq').value.trim(),c=document.getElementById('cauta');
  if(c){c.value=v;c.dispatchEvent(new Event('input'));scrollTo({top:0,behavior: SMOOTH});$('menu').classList.remove('open')}
  else location.href='index.html'+(v?'?q='+encodeURIComponent(v):'')};

 // ---------- chatbot: răspunde din locuri.json, cu răspunsuri rapide și memoria ultimei întrebări ----------
 let D=null,ctx=null;const log=$('chatLog'),chipsEl=$('chips');
 const MEM='chat-mem',hist=[];let chipMode='I',pendBrand=null;
 const row=(h,c)=>`<div class="msg ${c}"${c==='me'?' data-no-i18n':''}>${h}</div>`;
 // memoria conversației între pagini: se păstrează în sessionStorage (dispare când închizi fila), cu ultimele 30 de mesaje
 const save=()=>{try{sessionStorage.setItem(MEM,JSON.stringify({o:$('chatBox').classList.contains('open'),h:hist,m:chipMode,c:ctx?{...ctx,brand:ctx.brand?ctx.brand.k:null}:null}))}catch(e){}};
 const say=(h,c)=>{hist.push([c,h]);if(hist.length>30)hist.shift();log.insertAdjacentHTML('beforeend',row(h,c));log.scrollTop=log.scrollHeight;save()};
 const lista=l=>`<a href="loc.html?id=${encodeURIComponent(l.id)}">${esc(l.nume)}</a>${[l.bucatarie,l.zona].filter(Boolean).length?' ('+esc([l.bucatarie,l.zona].filter(Boolean).join(', '))+')':''}`;
 const INIT=[['🍕 Pizza','pizza'],['🍔 Burgeri','burgeri'],['🍝 Italian','italian'],['🌱 Vegan','vegan'],['⭐ Cel mai bun','cel mai bun'],['📍 Unde am fost','unde am fost'],['📍 Lângă mine','langa mine']];
 const FOLLOW=[['Deschis acum','deschis acum'],['Doar vegan','si vegan'],['Cu terasă','si terasa'],['Altceva','altceva']];
 const chips=l=>{chipMode=l===FOLLOW?'F':'I';chipsEl.innerHTML=l.map(([t,q])=>`<button type="button" class="chip" data-q="${esc(q)}">${t}</button>`).join('')};
 // la încărcarea paginii: reia conversația salvată (dacă există)
 try{const m=JSON.parse(sessionStorage.getItem(MEM)||'null');
  if(m&&Array.isArray(m.h)&&m.h.length){hist.push(...m.h);log.innerHTML=hist.map(([c,h])=>row(h,c)).join('');log.scrollTop=log.scrollHeight;chips(m.m==='F'?FOLLOW:INIT);
   ctx=m.c?{...m.c,brand:null}:null;pendBrand=m.c&&m.c.brand||null;if(m.o)$('chatBox').classList.add('open')}}catch(e){}
 new MutationObserver(save).observe($('chatBox'),{attributes:true,attributeFilter:['class']});
 const OPTQ={terasa:/teras|terrace|outdoor|gradin|garden/,vegetarian:/vegetarian/,vegan:/vegan/,livrare:/livrare|livrari|livreaza|delivery|comand\w* acasa/,takeaway:/takeaway|take away|la pachet|de luat/,accesibil:/accesibil|accessible|wheelchair|scaun rulant/};
 const qn=t=>norm(t).replace('fast food','fast-food').replace(/\bcafe\b|\bcoffee\b/g,'cafenea').replace(/romanian/g,'romanesc').replace(/burgers?/g,'burgeri')
   .replace(/chicken/g,'pui').replace(/seafood/g,'fructe de mare').replace(/turkish/g,'turcesc').replace(/chinese/g,'chinezesc').replace(/japanese|sushi/g,'japonez').replace(/\bpasta\b/g,'paste').replace(/downtown|city center/g,'centru');
 // sinonime și formulări uzuale -> cuvintele din date (fără diacritice, ca după norm())
 const SIN=[[/fastfood|mancare rapida|junk food/g,'fast-food'],[/\bcafenele\b/g,'cafenea'],[/\bberarie\b|\bberarii\b|\bbere\b|\bbeer\b/g,'pub'],
  [/pizzerie|pizzeria/g,'pizza'],[/\bcentrul?\b|centrul istoric/g,'cetate'],[/shawarma|sauarma|saorma|doner/g,'shaorma'],[/kebap/g,'kebab'],[/\basia\b|asian/g,'asiatic'],[/greek|grecesc|gyros/g,'mediteranean'],
  [/fara carne|plant.based/g,'vegetarian'],[/(?<!piata )\bunirii\b/g,'piata unirii'],[/studentesc|campus|facultate|camin/g,'complex studentesc'],
  [/(?<!calea )\bsagului\b/g,'calea sagului'],[/(?<!calea )\baradului\b/g,'calea aradului'],[/(?<!parcul )\bjustitiei\b/g,'parcul justitiei'],
  // feluri de mâncare și băuturi -> eticheta de bucătărie/tip din date (ca să găsească „sarmale” chiar dacă locul scrie „românesc”)
  [/carbonara|lasagn[ae]|risotto|tiramisu|spaghet\w*|gnocchi|ravioli|bruschet\w*|focaccia/g,'italian'],[/calzone/g,'pizza'],
  [/sarmale|\bmici\b|mititei|ciorb[ae]|papanasi|tochitura|mamaliga|jumari|cozonac|bulz/g,'romanesc'],
  [/iskender|durum|lahmacun|\bpide\b|falafel/g,'turcesc'],[/ramen|\bmaki\b|nigiri|tempura|sashimi|wasabi/g,'japonez'],
  [/\bwok\b|dim sum|noodles/g,'asiatic'],[/curry|tikka|masala|\bnaan\b/g,'indian'],
  [/espresso|cappuccino|\blatte\b|ibric/g,'cafenea'],[/prajitur\w*|cheesecake|\btort\b|gogosi|clatite/g,'cafenea'],
  [/mojito|aperol|spritz|cocktail\w*|coctail\w*/g,'cocktailuri'],[/oua benedict|omleta|pancakes|mic dejun|breakfast/g,'brunch'],
  [/creveti|calamar\w*|midii|stridii|scoici|somon/g,'fructe de mare'],[/friptur\w*|steak|gratar|cotlet|costite|\bribs\b/g,'grill'],
  [/aripioare|nuggets|\bwings\b/g,'pui'],[/gelato|sorbet/g,'inghetata']];
 const qs=t=>SIN.reduce((x,[re,to])=>x.replace(re,to),qn(t).replace(/[?!.,;:()]/g,' '));
 // ---------- toleranță la greșeli de scriere ----------
 // un cuvânt necunoscut se corectează doar dacă are o singură potrivire apropiată (1 literă greșită la cuvinte de 4-7 litere, 2 la cele de 8+),
 // începe cu aceeași literă și nu e un cuvânt comun; ce am corectat se arată în răspuns, ca utilizatorul să vadă ce s-a înțeles
 const STOP=new Set(('ceva doar mai care unde vreau caut cauta locuri locul bine bun buna bune foarte pentru cand cum sunt fost fosta fosti acum aici asta este esti avem vrei cele cate multe toate nimic '+
  'unele alta alte altul cineva niste despre fara dupa intre ajutor salut buna hello something only more where want find place places good great very that this with from have what which some other '+
  'anything near about without when after between food eat best cheap nice langa mine apropiere nearby nearest closest').split(' '));
 const CUV='recomand vizitat testat deschis mancat vegan vegetarian terasa livrare takeaway accesibil restaurant cafenea pizza burgeri italian cetate'.split(' ');
 let VOC=null;
 const vocabular=()=>{if(VOC)return VOC;const w=new Set(CUV),add=x=>norm(x).split(/[^a-z0-9]+/).filter(y=>y.length>=4).forEach(y=>w.add(y));
  D.forEach(l=>{taguriBuc(l).forEach(add);add(l.tip);add(l.zona||'')});STOP.forEach(x=>w.delete(x));return VOC=w};
 function dist(a,b){const m=a.length,n=b.length,d=[];for(let i=0;i<=m;i++){d[i]=[i];for(let j=1;j<=n;j++)d[i][j]=i?0:j}
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
   if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1)}   // literele inversate (ex: „pzzia”) contează ca o singură greșeală
  return d[m][n]}
 function corecteaza(q){
  const V=vocabular(),sch=[];
  const out=q.split(/(\s+)/).map(tok=>{
   if(!/^[a-z]{4,}$/.test(tok)||STOP.has(tok)||V.has(tok))return tok;
   const max=tok.length>=8?2:1;let best=null,bd=99,tie=false;
   for(const v of V){if(v[0]!==tok[0]||Math.abs(v.length-tok.length)>max)continue;const k=dist(tok,v);
    if(k<=max){if(k<bd){bd=k;best=v;tie=false}else if(k===bd&&v!==best)tie=true}}
   if(best&&!tie){sch.push(tok+' → '+best);return best}
   return tok}).join('');
  return {q:out,sch}}
 const uniq=a=>[...new Set(a)];
 const distM=(p,l)=>{const R=6371000,k=Math.PI/180,a=(l.lat-p[0])*k,b=(l.lon-p[1])*k,x=Math.sin(a/2)**2+Math.cos(p[0]*k)*Math.cos(l.lat*k)*Math.sin(b/2)**2;return 2*R*Math.asin(Math.sqrt(x))};
 const fmtM=m=>m<1000?Math.max(10,Math.round(m/10)*10)+' m':(m/1000).toFixed(1).replace('.',',')+' km';
 function parse(q){
  const c={buc:uniq(D.flatMap(taguriBuc)).filter(b=>q.includes(norm(b))),tip:uniq(D.map(l=>l.tip)).filter(x=>q.includes(norm(x))),zone:uniq(D.map(l=>l.zona).filter(Boolean)).filter(z=>q.includes(norm(z))),
   opts:Object.keys(OPTQ).filter(k=>OPTQ[k].test(q)),vizitat:/am fost|ai fost|vizitat|testat|ai mancat|s-a mancat|visited|been to|tried/.test(q),
   pret:/ieftin|scump|buget|cheap|expensive|budget|economic|afordabil|affordable|\bpret\w*|price|premium|elegant|fancy|fine dining|\blux\b|upscale/.test(q),best:/cel mai bun|cele mai bune|cel mai bine|top|nota mare|recomand|favorit|best|recommend/.test(q),
   deschis:/\bdeschis\w*|open now|merge acum/.test(q),
    near:/langa mine|aproape de mine|cel mai aproape|in apropierea mea|near me|nearby|nearest|closest|close to me/.test(q)};
  c.n=c.buc.length+c.tip.length+c.zone.length+c.opts.length+(c.vizitat?1:0)+(c.best?1:0)+(c.deschis?1:0)+(c.near?1:0);return c};
 // la o întrebare scurtă se păstrează criteriile de până acum, dar o bucătărie sau un tip nou îl înlocuiește pe cel vechi („sarmale” apoi „pizza” = pizza, nu românesc + pizza)
 const merge=(a,b)=>({buc:b.buc.length?b.buc:a.buc,tip:b.tip.length?b.tip:a.tip,zone:uniq([...a.zone,...b.zone]),opts:uniq([...a.opts,...b.opts]),vizitat:a.vizitat||b.vizitat,pret:b.pret||a.pret,best:a.best||b.best,deschis:a.deschis||b.deschis,near:a.near||b.near});
 // ---------- ce știe asistentul: doar mâncare. Orice altceva primește un răspuns politicos ----------
 const FOOD=/mananc|mancar|manca|restaurant|local|locuri|foame|flamand|cina\b|pranz|dejun|brunch|cafea|cafenea|bautur|bere|vin\b|cocktail|desert|prajitur|inghetat|pizza|burger|paste|sushi|vegan|vegetarian|meniu|\bmasa\b|comand|livr|teras|\bpub\b|\bbar\b|gust|delicios|\beat\b|food|hungry|lunch|dinner|breakfast|drink|coffee|cheap|ieftin|scump|pret\b|italian|kebab|shaorma|grill|fast|romanesc|japonez|asiatic|indian|brunch|cocktail|fructe|\bpui\b|turcesc/;
 const tokn=x=>norm(x).replace(/[^a-z0-9]+/g,' ').trim();
 const cmp=x=>tokn(x).replace(/ /g,'');                                  // fără spații și semne: „mc donalds” = „mcdonalds”
 const baza=n=>n.replace(/\s*(\(.*\)|#\d+)\s*$/,'').trim();                // „McDonald's (Strada A 1)” -> „McDonald's”
 // lanț = același nume la cel puțin 2 locuri (McDonald's, KFC, Burger King...); nu intră cuvintele de bucătărie, tip sau zonă
 let BR=null;
 const branduri=()=>{if(BR)return BR;const m={},gen=new Set([...vocabular(),...CUV].map(cmp));
  D.forEach(l=>{const k=cmp(baza(l.nume));if(k.length>=3&&!gen.has(k))(m[k]=m[k]||[]).push(l)});
  return BR=Object.entries(m).filter(([,v])=>v.length>=2).map(([k,v])=>({k,v,nume:baza(v[0].nume)}))};
 const dupaBrand=q=>{let cq=cmp(q);if(/(^| )(mc|mac)( |$)/.test(tokn(q)))cq+='mcdonalds';const h=branduri().filter(b=>cq.includes(b.k)&&(b.k.length>=4||b.k==='kfc'));return h.sort((a,b)=>b.k.length-a.k.length)[0]||null};
 const LANDM=/\b(stadion\w*|gara|gari|aeroport\w*|mall|iulius|shopping city|universitate\w*|spital\w*|catedral\w*|biseric\w*|hotel\w*|cinema\w*|primari\w*)\b/;
 // nume complet (de cel puțin 2 cuvinte sau 7 litere) conținut în întrebare; sau, fără alte criterii, cuvinte din întrebare regăsite într-un singur nume
 function dupaNume(q,complet){
  const qq=' '+tokn(q)+' ';
  const cq=cmp(q);
  const full=D.filter(l=>{const n=tokn(l.nume.replace(/\(.*\)/,''));return (n.length>=4&&(n.includes(' ')||n.length>=7)&&qq.includes(' '+n+' '))||(cmp(l.nume.replace(/\(.*\)/,'')).length>=7&&cq.includes(cmp(l.nume.replace(/\(.*\)/,''))))});
  if(full.length||complet)return full;
  const w=tokn(q).split(' ').filter(x=>x.length>=4&&!STOP.has(x)&&!FOOD.test(x));
  if(!w.length)return [];
  const m=D.filter(l=>{const n=' '+tokn(l.nume)+' ';return w.every(x=>n.includes(x))});
  return m.length&&m.length<=3?m:[]}
 // greșeli de scriere în numele unui loc: fiecare cuvânt din întrebare trebuie să fie (aproape) un cuvânt din numele locului
 function dupaNumeAprox(q){
  const w=tokn(q).split(' ').filter(x=>x.length>=5&&!STOP.has(x)&&!FOOD.test(x));
  if(!w.length||w.length>3)return [];
  const m=D.filter(l=>{const nt=tokn(l.nume).split(' ').filter(x=>x.length>=4);
   return w.every(x=>nt.some(n=>n===x||(n[0]===x[0]&&Math.abs(n.length-x.length)<=1&&dist(x,n)<=(x.length>=9?2:1))))});
  return m.length&&m.length<=3?m:[]}
 const infoLoc=l=>{const np=notaPublica(l),nm=l.parerea_mea?.nota;
  return [np!=null?`<br><small>Nota publică: ${esc(String(np))} ★</small>`:'',nm!=null?`<br><small>Nota mea: ${esc(String(nm))}/10</small>`:'',np==null&&nm==null?'<br><small>Încă nu are note în ghid.</small>':''].join('')};
 const POFTA='<br>Poftă bună! 🍽️';
 function raspunde(t){
  const q0=qs(t),cor=corecteaza(q0),q=cor.q,raw=qn(t).replace(/[?!.,;:()]/g,' ');   // q0 = ce a scris utilizatorul (pentru nume de locuri), q = cu greșelile corectate
  const corNota=cor.sch.length?`<br><small>Am corectat: ${esc(cor.sch.join(', '))}</small>`:'';
  if(/^(ajutor|help)\b|^(ce poti( sa faci)?|ce stii sa faci|ce faci|cum functionezi|cum te folosesc)\s*$/.test(q)){chips(INIT);return 'Te pot ajuta să alegi un loc: spune-mi bucătăria (italian, pizza, burgeri…), tipul (restaurant, cafenea, fast-food), zona (Piața Unirii, Cetate = centrul…), facilitățile (vegan, terasă, livrare) sau „cel mai bun”, „unde am fost”, „deschis acum”. Poți scrie și cu greșeli mici de scriere, încerc să înțeleg.'}
  if(/^(salut|buna|hei|hello|hey|hi\b|servus|salutare|ceau)/.test(q)){chips(INIT);return 'Salut! Sunt asistentul de mâncare din Timișoara. Întreabă-mă de genul "ceva italian", "pizza în centru" sau "unde s-a mâncat bine". Poftă bună! 🍽️'}
  if(/multumesc|mersi|merci|thanks|thank you/.test(q))return 'Cu plăcere! Poftă bună! 🍽️';
  if(/^(pa\b|la revedere|bye|goodbye|cu bine|o zi buna|noapte buna|see you)/.test(q))return 'Poftă bună și pe curând! 👋';
  if(/cine esti|cum te cheama|ce esti|who are you|esti (un )?(robot|om|bot)/.test(q))return 'Sunt asistentul ghidului „Mâncare în Timișoara”: te ajut să alegi unde să mănânci. Poftă bună! 🍽️';
  if(/(ce|ce sa) (sa )?(mananc|mancam)|mi.?e foame|sunt flamand|nu stiu ce|surprinde|sugereaza|hungry|surprise me|starving|what should i eat/.test(q)){
   let pool=D.slice();if(typeof deschisAcum==='function'&&D.some(l=>deschisAcum(l.program)!==null)){const o=pool.filter(l=>deschisAcum(l.program)===true);if(o.length)pool=o}
   const alese=[];while(alese.length<3&&pool.length){alese.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0])}
   chips(INIT);return `Ți-aș propune, la întâmplare:<br>• ${alese.map(lista).join('<br>• ')}${POFTA}`}
  { let br=dupaBrand(raw),inCtx=false;   // un lanț (McDonald's, KFC...): toate filialele, filtrate pe zonă dacă a cerut-o
     if(!br&&ctx&&ctx.brand&&(/^(si|and|dar|iar|plus|doar|only|mai|also|with|in|la)\b/.test(q)||q.split(/\s+/).length<=3)&&parse(q).zone.length){br=ctx.brand;inCtx=true}   // „și în centru?” după „mc”
     if(br){const cz=parse(q);let lst=br.v,pre='';ctx={buc:[],tip:[],zone:[],opts:[],vizitat:false,pret:false,best:false,deschis:false,brand:br};
      if(cz.zone.length){const zz=cz.zone.map(norm),f=lst.filter(l=>zz.includes(norm(l.zona||'')));if(f.length)lst=f;else pre=`N-am găsit ${br.nume} în ${cz.zone.join(', ')}. Dar iată unde îl găsești:`}
      chips(INIT);const arata=lst.slice(0,6),rest=lst.length-arata.length;
      return `${pre||`Am găsit ${lst.length} locuri ${br.nume}:`}<br>• ${arata.map(lista).join('<br>• ')}${rest>0?`<br><small>…și încă ${rest} în <a href="index.html?q=${encodeURIComponent(br.nume)}">listă</a>.</small>`:''}${POFTA}`} }
  { const gasit=dupaNume(raw,true);   // întrebare cu numele complet al unui loc
    if(gasit.length){chips(INIT);return gasit.length===1?`Am găsit: ${lista(gasit[0])}${infoLoc(gasit[0])}${POFTA}`:`Am găsit mai multe locuri cu acest nume:<br>• ${gasit.slice(0,3).map(lista).join('<br>• ')}${POFTA}`} }
  if(/cate (locuri|restaurante)|how many/.test(q))return `Am ${D.length} locuri în listă.`;
  if(/^(altceva|something else|reset|de la capat|start over|nou)\b/.test(q)){ctx=null;chips(INIT);return 'Ok, o luăm de la capăt. Ce cauți?'}
  const c=parse(q);
  if(!c.n&&c.pret){chips(INIT);return 'Nu am prețurile locurilor, deci nu pot filtra după preț. Încearcă după bucătărie, zonă sau „cel mai bun”.'}
  if(!c.n){chips(INIT);
   const gasit=dupaNume(q0,false);
   if(gasit.length)return gasit.length===1?`Am găsit: ${lista(gasit[0])}${infoLoc(gasit[0])}${POFTA}`:`Am găsit mai multe locuri cu acest nume:<br>• ${gasit.map(lista).join('<br>• ')}${POFTA}`;
   if(LANDM.test(q0)){const z=Object.entries(D.reduce((m,l)=>{if(l.zona)m[l.zona]=(m[l.zona]||0)+1;return m},{})).sort((a,b)=>b[1]-a[1]).slice(0,6).map(x=>x[0]);
    return 'Nu caut încă după repere (stadion, gară, mall…), ci după zonă sau cartier.'+(z.length?`<br>Zone pe care le știu: ${esc(z.join(', '))}`:'')}
   { const ap=dupaNumeAprox(q0); if(ap.length)return `Poate te referi la:<br>• ${ap.map(lista).join('<br>• ')}${ap.length===1?infoLoc(ap[0]):''}` }
   if(!FOOD.test(q)&&!FOOD.test(q0))return 'Mă pricep doar la mâncare și la locurile de mâncat din Timișoara 🍽️ La alte subiecte nu te pot ajuta, dar dacă ți-e foame, întreabă-mă de exemplu "pizza în centru", "ceva vegan" sau "unde se mănâncă bine".';
   return 'Nu am înțeles. Încearcă: "ceva italian", "pizza în centru", "fast-food", "unde am fost" sau "cel mai bun".'+corNota}
  // dacă mesajul e scurt sau începe cu „și/și doar/mai…”, completează întrebarea precedentă
  const rafinare=ctx&&(/^(si|and|dar|iar|plus|doar|only|mai|also|with)\b/.test(q)||q.split(/\s+/).length<=3);
  const f=rafinare?merge(ctx,c):c;
  let r=D.slice(),nota='';
  if(f.buc.length)r=r.filter(l=>f.buc.some(b=>taguriBuc(l).includes(b)));
  if(f.tip.length)r=r.filter(l=>f.tip.includes(l.tip));
  if(f.zone.length)r=r.filter(l=>f.zone.includes(l.zona));
  if(f.opts.length){r=r.filter(l=>f.opts.every(o=>areOpt(l,o)));nota+='<br><small>Facilitățile sunt completate doar la locurile importate din OpenStreetMap.</small>'}
  if(f.vizitat)r=r.filter(l=>l.vizitat);
  if(f.deschis){if(typeof deschisAcum==='function'&&D.some(l=>deschisAcum(l.program)!==null))r=r.filter(l=>deschisAcum(l.program)===true);else nota+='<br><small>Programul locurilor nu e completat încă, deci n-am putut filtra după „deschis acum”.</small>'}
  if(f.pret)nota+='<br><small>Nu am prețuri în date, așa că am ignorat „ieftin/scump”.</small>'
  if(f.best)r.sort((a,b)=>(b.parerea_mea?.nota??notaPublica(b)??0)-(a.parerea_mea?.nota??notaPublica(a)??0));
  ctx=f;
  const crit=[...f.buc,...f.tip,...f.zone,...f.opts.map(o=>OPT[o]),f.vizitat?'unde am fost':null,f.best?'cel mai bun':null,f.deschis?'deschis acum':null,f.near?'lângă mine':null].filter(Boolean);
   const cl=`<br><small>Criterii: ${esc(crit.join(', '))}</small>`+corNota;
   // „lângă mine”: cere poziția abia acum (nu la încărcarea paginii), sortează după distanță și arată distanța la fiecare loc
   const fin=poz=>{let rs=r,nt=nota,et=lista;
    if(f.near){
     if(poz){const dm=l=>distM(poz,l);rs=r.filter(l=>l.lat!=null).sort((a,b)=>dm(a)-dm(b));et=l=>lista(l)+` <small>· ${fmtM(dm(l))}</small>`}
     else nt+='<br><small>Nu am putut afla poziția ta (permisiunea e blocată sau browserul nu o oferă), așa că n-am sortat după distanță.</small>'}
    chips(rs.length?FOLLOW:INIT);
    if(!rs.length)return 'N-am găsit nimic cu criteriile astea. Încearcă altceva.'+nt+cl;
    return `Ți-aș propune:<br>• ${rs.slice(0,3).map(et).join('<br>• ')}${rs.length>3?`<br><small>…și încă ${rs.length-3} în <a href="index.html">listă</a>.</small>`:''}${nt}${cl}${POFTA}`};
   if(!f.near||!navigator.geolocation)return fin(null);
   return new Promise(res=>navigator.geolocation.getCurrentPosition(p=>res(fin([p.coords.latitude,p.coords.longitude])),()=>res(fin(null)),{timeout:8000,maximumAge:300000}));
 }
 async function incarca(){if(!D){try{D=await (await fetch('data/locuri.json')).json()}catch(e){D=[]}}if(pendBrand){if(ctx)ctx.brand=branduri().find(b=>b.k===pendBrand)||null;pendBrand=null}}
 async function ask(label,q){await incarca();say(esc(label),'me');setTimeout(async()=>say(await raspunde(q),'bot'),350)}
 chipsEl.onclick=e=>{const b=e.target.closest('[data-q]');if(b)ask(b.textContent,b.dataset.q)};
 $('chatBtn').onclick=async()=>{const b=$('chatBox');b.classList.toggle('open');if(b.classList.contains('open'))$('chatIn').focus();
  if(b.classList.contains('open')&&!log.children.length){say('Salut! Te ajut să alegi un loc din Timișoara. Ce cauți?','bot');chips(INIT)}
  await incarca()};
 $('chatForm').onsubmit=e=>{e.preventDefault();const t=$('chatIn').value.trim();if(!t)return;$('chatIn').value='';ask(t,t)};
});
