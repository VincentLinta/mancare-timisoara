// Eșantioanele de culoare se citesc din CSS (variabilele din :root) și se actualizează la schimbarea temei.
const lumG=h=>{h=h.replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");const c=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(x=>x<=0.03928?x/12.92:((x+0.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const ratioG=(a,b)=>{const x=lumG(a),y=lumG(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
// [variabilă, nume, utilizare, față de ce fundal se măsoară contrastul]
const TOK=[["--bg","Fundal","Fundalul paginilor",null],["--card","Card","Carduri, panouri",null],["--text","Text","Textul principal","--bg"],["--muted","Text secundar","Note, etichete discrete","--bg"],
 ["--accent","Accent","Acțiuni, linkuri, fast-food, nota mea","--bg"],["--teal","Turcoaz","Restaurante, facilități, chat","--card"],["--amber","Chihlimbar","Bucătării, Topul meu","--card"],["--blue","Albastru","Maps, zone, cafenele, distanță","--card"],["--berry","Mov-roz","Pub și bar","--card"],["--line","Linii","Contururi, separatoare",null],["--err","Erori","Mesaje de eroare","--card"],["--on-accent","Text pe accent","Etichete pe butoane","--accent"]];
function deseneaza(){
  const cs=getComputedStyle(document.documentElement),v=n=>cs.getPropertyValue(n).trim();
  $("sw").innerHTML=TOK.map(([n,nume,uz,fata])=>{
    const c=v(n),r=fata&&c&&v(fata)?ratioG(c,v(fata)):null;
    return `<div class="sw"><div class="c" style="background:${c}"></div><div class="i"><b>${nume}</b><br><code>${n}</code> ${c}<br>${uz}${r!==null?`<br>${r.toFixed(2)}:1 ${r>=4.5?"✔ trece":"✘ sub prag"}`:""}</div></div>`}).join("");
}
deseneaza();
new MutationObserver(deseneaza).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",deseneaza);
