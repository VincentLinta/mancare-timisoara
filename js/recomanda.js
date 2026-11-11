// Trimiterea: gratis, prin FormSubmit (https://formsubmit.co). Setezi adresa cu:  python tools/seteaza.py --form-email adresa@ta.ro
// La prima trimitere FormSubmit îți trimite un email de activare; după ce îl confirmi, recomandările ajung în inbox.
// Cât timp adresa nu e setată, formularul doar validează (mod demo) și nu trimite nimic.
const FORM = Object.assign({ email: "" }, window.FORM_CONFIG || {});
// același script merge pentru două pagini: recomanda.html și contact.html (<body data-form="contact">)
const MOD = document.body.dataset.form || "recomanda";
const TXT = MOD === "contact"
 ? { ok: "Mulțumesc! Mesajul tău a fost validat.", sent: "Mulțumesc! Mesajul tău a fost trimis.", err: "Nu am putut trimite mesajul. Încearcă din nou peste câteva minute.", subj: "Mesaj nou - Mâncare în Timișoara", mail: "Mesaj de pe site" }
 : { ok: "Mulțumesc! Recomandarea ta a fost validată.", sent: "Mulțumesc! Recomandarea ta a fost trimisă.", err: "Nu am putut trimite recomandarea. Încearcă din nou peste câteva minute.", subj: "Recomandare nouă - Mâncare în Timișoara", mail: "Recomandare loc de mâncat" };
// fiecare câmp are o regulă: întoarce true dacă e ok, altfel mesajul de eroare
const R={
 nume:v=>/^[A-Za-zĂÂÎȘȚăâîșțŞŢşţ\s\-]{3,}$/.test(v.trim())||"Scrie un nume de cel puțin 3 litere.",
 email:v=>/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v.trim())||"Introdu o adresă validă, ex. nume@domeniu.ro.",
 tel:v=>/^(\+40|0)7\d{8}$/.test(v.replace(/[\s.-]/g,""))||"Număr românesc valid: 07xxxxxxxx sau +407xxxxxxxx.",
 locul:v=>v.trim().length>=2||"Scrie numele localului.",
 msg:v=>v.trim().length>=10||"Spune-ne mai mult (minim 10 caractere).",
 subiect:v=>!!v||"Alege un subiect."
};
// optional-ids: locul subiect   (există doar pe recomanda.html, respectiv contact.html)
const ids=Object.keys(R).filter(id=>$(id)),f=$("cf");   // doar câmpurile care există pe pagina curentă
// un câmp cu data-optional poate rămâne gol, dar dacă e completat trebuie să fie valid
function check(id){const el=$(id),gol=el.dataset.optional!==undefined&&!el.value.trim(),r=gol||R[id](el.value),ok=r===true;
 el.classList.toggle("invalid",!ok);el.classList.toggle("valid",ok&&!gol);el.setAttribute("aria-invalid",!ok);
 $("e_"+id).textContent=ok?"":r;return ok}
ids.forEach(id=>{$(id).addEventListener("blur",()=>check(id));
 $(id).addEventListener("input",()=>{if($(id).classList.contains("invalid"))check(id)})});
const acord=()=>{const ok=$("acord").checked;$("e_acord").textContent=ok?"":"Bifează acordul pentru a trimite.";return ok};
const fin=()=>{f.reset();ids.forEach(id=>$(id).classList.remove("valid"))};
const msgOk=t=>{$("sendErr").hidden=true;$("ok").textContent=t;$("ok").hidden=false;$("ok").scrollIntoView({behavior: SMOOTH})};
const msgEr=(t,mail)=>{$("ok").hidden=true;$("sendErr").innerHTML=`<span>${esc(t)}</span>`+(mail?` <a href="mailto:${esc(mail)}?subject=${encodeURIComponent(TXT.mail)}">Scrie-mi direct pe email</a>`:"");$("sendErr").hidden=false};
f.onsubmit=async e=>{
 e.preventDefault();
 const bad=ids.filter(id=>!check(id)),a=acord();
 if(bad.length||!a){(bad.length?$(bad[0]):$("acord")).focus();return}
 if($("_honey").value){fin();return}                                   // câmp-capcană: îl completează doar boții
 if(!FORM.email){msgOk(TXT.ok);fin();return}
 let ultima=0;try{ultima=+localStorage.getItem("form-ultima")||0}catch(err){}
 if(Date.now()-ultima<30000){msgEr("Așteaptă puțin înainte să trimiți din nou.");return}
 const btn=f.querySelector("button[type=submit]");btn.disabled=true;$("stare").textContent="Se trimite…";
 const date={name:$("nume").value.trim(),email:$("email").value.trim(),phone:$("tel").value.trim()};
 if($("locul"))date.place=$("locul").value.trim();
 if($("subiect"))date.subject=$("subiect").value;
 date.message=$("msg").value.trim();
 try{
  const r=await fetch("https://formsubmit.co/ajax/"+FORM.email,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},
   body:JSON.stringify({...date,_subject:TXT.subj,_template:"table",_captcha:"false"})});
  const j=await r.json().catch(()=>({}));
  if(!r.ok||!(j.success===true||j.success==="true"))throw new Error("trimitere eșuată");
  try{localStorage.setItem("form-ultima",Date.now())}catch(err){}
  msgOk(TXT.sent);fin();
 }catch(err){msgEr(TXT.err,FORM.email.includes("@")?FORM.email:null)}
 finally{btn.disabled=false;$("stare").textContent=""}
};
