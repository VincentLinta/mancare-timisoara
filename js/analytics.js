// Google Analytics se încarcă DOAR după acordul din bannerul de cookie-uri (GDPR).
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
function pornesteAnalytics(){
 if(window.__gaPornit)return;
 const id=document.querySelector('meta[name="ga-id"]')?.content;
 if(!id||/X{6,}/.test(id))return;            // ID-ul încă nu e completat (vezi tools/seteaza.py)
 window.__gaPornit=true;
 gtag('consent','update',{analytics_storage:'granted'});
 const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.appendChild(s);
 gtag('js',new Date());gtag('config',id);
}
try{if(localStorage.getItem('cookie-analytics')==='da')pornesteAnalytics()}catch(e){}
