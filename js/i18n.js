// RO / EN: traduce textul vizibil (și atributele placeholder, aria-label, title, alt) pe baza unui dicționar.
// Funcționează și pentru textul creat de JavaScript (carduri, chat, mesaje), prin MutationObserver.
// Textele care lipsesc din dicționar rămân în română; părerile și numele locurilor nu se traduc.
(function () {
  const D = [
    // ---- navigare, unelte, subsol ----
    [`Locuri`, `Places`], [`Tabel`, `Table`], [`Hartă`, `Map`], [`Galerie`, `Gallery`], [`Recomandă`, `Recommend`], [`Statistici`, `Statistics`], [`Despre`, `About`], [`Ghid de stil`, `Style guide`],
    [`🍽️ Mâncare TM`, `🍽️ Food TM`], [`Mâncare în Timișoara`, `Food in Timișoara`],
    [`Meniu`, `Menu`], [`Principal`, `Main`], [`Caută un loc`, `Search a place`], [`Caută un loc…`, `Search a place…`], [`Caută`, `Search`], [`Mărime text`, `Text size`],
    [`Text mai mic`, `Smaller text`], [`Text mai mare`, `Larger text`], [`A- Text mai mic`, `A- Smaller text`], [`A+ Text mai mare`, `A+ Larger text`], [`Schimbă tema luminos/întunecat`, `Switch light/dark theme`], [`Sari la conținut`, `Skip to content`],
    [`Sus`, `Top`], [`Jos`, `Bottom`], [`Ajutor`, `Help`], [`Deschide chatul`, `Open chat`], [`Mesaj`, `Message`], [`Asistent`, `Assistant`], [`Cookie-uri`, `Cookies`], [`Căutare și filtre`, `Search and filters`],
    [`Asistent mâncare`, `Food assistant`], [`ex: pizza în centru…`, `e.g. pizza downtown…`], [`Trimite`, `Send`], [`Închide`, `Close`],
    [`© 2026-2027 Mâncare în Timișoara · Proiect PIUG, UPT`, `© 2026-2027 Food in Timișoara · PIUG project, UPT`], [`Date despre locuri: surse publice și ©`, `Place data: public sources and ©`],
    [`Setări cookie-uri`, `Cookie settings`], [`Refuz`, `Decline`],
    [`Folosesc Google Analytics doar dacă ești de acord, ca să văd ce pagini sunt vizitate. Poți refuza, site-ul merge la fel.`, `I only use Google Analytics if you agree, to see which pages are visited. You can decline; the site works the same.`],
    // ---- ghidul de utilizare (butonul ?) ----
    [`Cum folosești site-ul`, `How to use the site`], [`Locuri:`, `Places:`],
    [`caută, filtrează după tip/zonă/bucătărie și sortează. "⭐ Topul meu" arată doar locurile la care am fost.`, `search, filter by type/area/cuisine and sort. "⭐ My top" shows only the places I have been to.`],
    [`Căutarea de sus`, `The top search`], [`te duce direct la lista filtrată.`, `takes you straight to the filtered list.`],
    [`alege un loc la întâmplare dintre cele filtrate;`, `picks a random place among the filtered ones;`], [`salvează un favorit;`, `saves a favorite;`],
    [`pune până la 3 locuri față în față;`, `puts up to 3 places side by side;`], [`copiază linkul.`, `copies the link.`], [`Tabel:`, `Table:`],
    [`apasă pe titlul unei coloane ca să sortezi.`, `click a column title to sort.`], [`Galerie:`, `Gallery:`],
    [`apasă pe un loc ca să-l vezi mărit; navighezi cu Previous/Next sau cu săgețile de la tastatură.`, `click a place to enlarge it; navigate with Previous/Next or the keyboard arrows.`],
    [`schimbă mărimea textului,`, `changes the text size,`], [`trece între luminos și întunecat.`, `switches between light and dark.`],
    [`sar la începutul sau sfârșitul paginii,`, `jump to the top or bottom of the page,`], [`e asistentul care știe locurile din listă.`, `is the assistant that knows the places in the list.`],
    // ---- pagina Locuri ----
    [`Notele publice și părerea mea sinceră.`, `Public scores and my honest opinion.`], [`Caută: nume, bucătărie, zonă…`, `Search: name, cuisine, area…`],
    [`Filtre`, `Filters`], [`Tip`, `Type`], [`Zonă`, `Area`], [`Bucătărie`, `Cuisine`], [`Sortare`, `Sort`],
    [`Toate tipurile`, `All types`], [`Toate zonele`, `All areas`], [`Alte zone`, `Other areas`], [`Altele`, `Other`], [`Toate bucătăriile`, `All cuisines`], 
    
    [`Nume A-Z`, `Name A-Z`], [`Nota mea`, `My score`], [`Nota publică`, `Public score`], 
    [`Doar unde am fost`, `Only where I've been`], [`Doar favoritele ♥`, `Favorites only ♥`], [`Facilități`, `Amenities`],
    [`Terasă`, `Terrace`], [`Livrare`, `Delivery`], [`Accesibil`, `Accessible`],
    [`⭐ Topul meu`, `⭐ My top`], [`🎲 Surprinde-mă`, `🎲 Surprise me`], [`🔗 Distribuie`, `🔗 Share`], [`Resetează`, `Reset`],
    [`Detalii →`, `Details →`], [`Detalii`, `Details`], [`Compară`, `Compare`], [`Comparație`, `Comparison`], [`Golește selecția`, `Clear selection`],
    [`Plusuri`, `Pros`], [`Minusuri`, `Cons`], [`Poți compara maxim 3 locuri.`, `You can compare at most 3 places.`], [`Link copiat! 📋`, `Link copied! 📋`],
    [`Încă unul 🎲`, `One more 🎲`], [`🎲 Ce zici de…`, `🎲 How about…`],
    [`N-am din ce alege cu filtrele astea. Apasă "Resetează".`, `Nothing to pick from with these filters. Press "Reset".`],
    [`Nimic găsit. Încearcă alt cuvânt sau apasă "Resetează".`, `Nothing found. Try another word or press "Reset".`],
    [`am fost`, `been there`], [`fără notă încă`, `no score yet`], [`fără notă publică`, `no public score`], [`nota mea`, `my score`], [`încă n-am fost`, `haven't been yet`],
    // ---- tipuri, bucătării, zone (date) ----
    [`fast-food`, `fast food`], [`cafenea`, `café`], [`înghețată`, `ice cream`],
    [`românesc`, `romanian`], [`asiatic`, `asian`], [`mediteranean`, `mediterranean`], [`fructe de mare`, `seafood`], [`burgeri`, `burgers`], [`pui`, `chicken`],
    [`turcesc`, `turkish`], [`shaorma`, `shawarma`], [`paste`, `pasta`], [`japonez`, `japanese`], [`indonezian`, `indonesian`], [`tradițional`, `traditional`],
    [`internațional`, `international`], [`cafea`, `coffee`], [`cocktailuri`, `cocktails`], [`chinezesc`, `chinese`], [`ungurești`, `hungarian`], [`sârbesc`, `serbian`],
    [`Centru`, `Center`], [`Complex Studențesc`, `Student Campus`], [`Parcul Justiției`, `Justice Park`],
    // ---- tabel ----
    [`Tabel comparativ`, `Comparison table`], [`Toate locurile într-un singur loc. Apasă pe titlul unei coloane ca să sortezi.`, `All the places in one spot. Click a column title to sort.`],
    [`Filtrează tabelul`, `Filter the table`], [`nume, tip, bucătărie, zonă…`, `name, type, cuisine, area…`], [`Nume`, `Name`], [`Am fost`, `Been there`],
    [`Tabel comparativ al locurilor: tip, zonă și note (Maps, Tripadvisor, a mea)`, `Comparison table of places: type, area and scores (Maps, Tripadvisor, mine)`],
    // ---- hartă ----
    [`Toate locurile cu coordonate, pe OpenStreetMap. Apasă pe un marker pentru detalii.`, `All places with coordinates, on OpenStreetMap. Click a marker for details.`],
    [`Caută pe hartă`, `Find on the map`], [`Toate locurile`, `All places`], [`Deschide în Google Maps ↗`, `Open in Google Maps ↗`], [`Hartă Google Maps`, `Google Maps map`],
    [`Încă nu avem coordonate. Rulează tools/import_osm.py ca să apară markerele; până atunci folosim harta Google.`, `No coordinates yet. Run tools/import_osm.py to show the markers; until then we use the Google map.`],
    // ---- galerie ----
    [`Apasă pe un loc ca să-l vezi mărit. Previous/Next sau săgețile de la tastatură.`, `Click a place to enlarge it. Previous/Next or the keyboard arrows.`], [`Imagine mărită`, `Enlarged image`],
    // ---- recomandă ----
    [`Recomandă un loc`, `Recommend a place`], [`Știi un loc care ar trebui să apară în ghid? Spune-mi. Câmpurile cu * sunt obligatorii.`, `Know a place that should be in the guide? Tell me. Fields marked * are required.`],
    [`Nume *`, `Name *`], [`Telefon *`, `Phone *`], [`Locul recomandat *`, `Recommended place *`], [`De ce ar trebui să-l încerc? *`, `Why should I try it? *`],
    [`Sunt de acord cu prelucrarea datelor *`, `I agree to the processing of my data *`], [`Trimite recomandarea`, `Send recommendation`],
    [`Mulțumesc! Recomandarea ta a fost validată și trimisă.`, `Thank you! Your recommendation was validated and sent.`],
    [`Bifează acordul pentru a trimite.`, `Tick the consent box to send.`], [`Introdu o adresă validă, ex. nume@domeniu.ro.`, `Enter a valid address, e.g. name@domain.com.`],
    [`Scrie numele localului.`, `Enter the name of the place.`], [`Scrie un nume de cel puțin 3 litere.`, `Enter a name of at least 3 letters.`],
    [`Spune-ne mai mult (minim 10 caractere).`, `Tell us more (at least 10 characters).`], [`Număr românesc valid: 07xxxxxxxx sau +407xxxxxxxx.`, `Valid Romanian number: 07xxxxxxxx or +407xxxxxxxx.`],
    // ---- statistici ----
    [`Cifre despre ghid și despre cât de completat e.`, `Figures about the guide and how complete it is.`], [`Cifre cheie`, `Key figures`], [`Locuri pe tip`, `Places by type`],
    [`Bucătării (top 8)`, `Cuisines (top 8)`], [`Nota mea vs nota publică`, `My score vs public score`],
    [`Portocaliu = nota mea (din 10), albastru = nota publică înmulțită cu 2. Primele rânduri sunt locurile unde părerea mea diferă cel mai mult.`, `Orange = my score (out of 10), blue = public score multiplied by 2. The first rows are the places where my opinion differs the most.`],
    [`Cât de completat e ghidul`, `How complete the guide is`], [`locuri în ghid`, `places in the guide`], [`unde am fost`, `where I've been`], [`nota publică medie (din 5)`, `average public score (out of 5)`],
    [`cu nota mea`, `with my score`], [`necompletat`, `not filled in`], [`cu zonă`, `with area`], [`cu bucătărie`, `with cuisine`], [`cu notă Maps`, `with Maps score`],
    [`cu notă Tripadvisor`, `with Tripadvisor score`], [`cu părerea mea`, `with my opinion`], [`Nu sunt date.`, `No data.`],
    [`Completează "nota mea" și o notă publică la câteva locuri (din admin.html) și apare comparația.`, `Fill in "my score" and a public score for a few places (from admin.html) and the comparison appears.`],
    // ---- pagina unui loc ----
    [`← Toate locurile`, `← All places`], [`Loc negăsit`, `Place not found`], [`Înapoi la listă`, `Back to the list`], [`Părerea mea`, `My opinion`], [`Contact și facilități`, `Contact and amenities`],
    [`Telefon:`, `Phone:`], [`Site:`, `Website:`], [`Program:`, `Hours:`], [`Facilități:`, `Amenities:`], [`Am mâncat:`, `Ate:`], [`Am plătit:`, `Paid:`], [`Plusuri:`, `Pros:`], [`Minusuri:`, `Cons:`], [`Când:`, `When:`],
    [`Locuri asemănătoare`, `Similar places`], [`Poze`, `Photos`], [`Încă n-am fost aici.`, `I haven't been here yet.`], [`Încă nu sunt poze.`, `No photos yet.`],
    [`♡ Adaugă la favorite`, `♡ Add to favorites`], [`♥ În favorite`, `♥ In favorites`],
    // ---- despre + 404 ----
    [`Despre proiect`, `About the project`], [`Un ghid personal de mâncare din Timișoara.`, `A personal food guide to Timișoara.`], [`Ce e site-ul ăsta`, `What this site is`],
    [`Un ghid de locuri de mâncat din Timișoara, cu nota publică (Google Maps și Tripadvisor) alături de părerea mea pentru locurile la care am fost. Nu e un top copiat: nota mea e separată și marcată clar.`, `A guide to places to eat in Timișoara, with the public score (Google Maps and Tripadvisor) next to my opinion for the places I have been to. It's not a copied top list: my score is separate and clearly marked.`],
    [`Video`, `Video`], [`🎬 Videoul va fi adăugat în curând.`, `🎬 The video will be added soon.`], [`Video în curând`, `Video coming soon`], [`Surse și transparență`, `Sources and transparency`],
    [`Lista locurilor se bazează pe surse publice și include, acolo unde au fost importate, date © OpenStreetMap contributors (licență ODbL). Notele publice vin din Google Maps și Tripadvisor și se pot schimba. Locurile la care nu am fost apar marcate "încă n-am fost". Dacă un loc va fi sponsorizat, va fi marcat clar.`, `The list of places is based on public sources and includes, where imported, data © OpenStreetMap contributors (ODbL license). Public scores come from Google Maps and Tripadvisor and may change. Places I haven't been to are marked "haven't been yet". If a place is ever sponsored, it will be clearly marked.`],
    [`Confidențialitate`, `Privacy`], [`Google Analytics pornește doar dacă accepți bannerul de cookie-uri; poți schimba alegerea oricând din subsol. Favoritele, tema și mărimea textului se salvează doar în browserul tău. Formularul de recomandare nu trimite date nicăieri.`, `Google Analytics only starts if you accept the cookie banner; you can change your choice any time from the footer. Favorites, theme and text size are saved only in your browser. The recommendation form doesn't send data anywhere.`],
    [`Tehnologii`, `Technologies`], [`HTML5, CSS3 (variabile CSS, grid, flexbox, mobil întâi)`, `HTML5, CSS3 (CSS variables, grid, flexbox, mobile first)`],
    [`JavaScript fără biblioteci (fetch, DOM, elementul <dialog>)`, `JavaScript without libraries (fetch, DOM, the <dialog> element)`], [`Date într-un fișier JSON, citit de pagini`, `Data in a JSON file, read by the pages`],
    [`Bootstrap Icons (doar pentru iconițele sociale)`, `Bootstrap Icons (only for the social icons)`], [`Vezi și`, `See also`], [`ghidul de stil`, `the style guide`], [`al site-ului.`, `of the site.`],
    [`Pagină negăsită`, `Page not found`], [`Locul ăsta nu e pe listă 🍽️`, `This place isn't on the list 🍽️`], [`← Înapoi la listă`, `← Back to the list`], [`Favoritele mele ♥`, `My favorites ♥`],
    [`Adresa pe care ai încercat-o nu există sau a fost mutată. Poate ți-e doar foame și ai greșit un click.`, `The address you tried doesn't exist or has moved. Maybe you're just hungry and mis-clicked.`],
    [`Sau scrie un loc în căutarea de sus.`, `Or type a place in the search above.`], [`Loc`, `Place`],
    // ---- chat ----
    [`Salut! Te ajut să alegi un loc din Timișoara. Ce cauți?`, `Hi! I'll help you pick a place in Timișoara. What are you looking for?`],
    [`Salut! Întreabă-mă de genul "ceva italian", "pizza în centru" sau "unde s-a mâncat bine".`, `Hi! Ask me things like "something Italian", "pizza downtown" or "where was the food good".`],
    [`Cu plăcere! 🍽️`, `You're welcome! 🍽️`], [`Ți-aș propune:`, `I'd suggest:`], [`listă`, `list`],
    [`N-am găsit nimic cu criteriile astea. Încearcă altceva.`, `I found nothing with those criteria. Try something else.`],
    [`Nu am înțeles. Încearcă: "ceva italian", "pizza în centru", "fast-food", "unde am fost" sau "cel mai bun".`, `I didn't get that. Try: "something Italian", "pizza downtown", "fast food", "where I've been" or "the best".`],
    [`Nu am prețuri în date, așa că am ignorat „ieftin/scump”.`, `I don't have prices in the data, so I ignored “cheap/expensive”.`], [`Nu am prețurile locurilor, deci nu pot filtra după preț. Încearcă după bucătărie, zonă sau „cel mai bun”.`, `I don't have the places' prices, so I can't filter by price. Try cuisine, area or “the best”.`],
    [`Facilitățile sunt completate doar la locurile importate din OpenStreetMap.`, `Amenities are only filled in for places imported from OpenStreetMap.`],
    // ---- runda 3: chat, wizard, lângă mine, top, formular ----
    [`Ok, o luăm de la capăt. Ce cauți?`, `Ok, let's start over. What are you looking for?`],
    [`🍔 Burgeri`, `🍔 Burgers`], [`⭐ Cel mai bun`, `⭐ The best`], [`📍 Unde am fost`, `📍 Where I've been`], [`Doar vegan`, `Only vegan`], [`Cu terasă`, `With a terrace`], [`Altceva`, `Something else`],
    [`cel mai bun`, `the best`], [`lângă mine`, `near me`], [`Nu am putut afla poziția ta (permisiunea e blocată sau browserul nu o oferă), așa că n-am sortat după distanță.`, `I couldn't get your location (permission blocked or not offered by the browser), so I didn't sort by distance.`],
    [`🍽️ Ce mănânc azi?`, `🍽️ What should I eat today?`], [`Ce mănânc azi?`, `What should I eat today?`], [`Ce poftești?`, `What are you craving?`], [`Cum vrei să mănânci?`, `How do you want to eat?`],
    [`🥢 Asiatic`, `🥢 Asian`], [`🥘 Românesc`, `🥘 Romanian`], [`🦐 Fructe de mare`, `🦐 Seafood`], [`☕ Cafea sau brunch`, `☕ Coffee or brunch`], [`🎲 Orice`, `🎲 Anything`],
    [`🪑 La masă`, `🪑 Sit-down`], [`🏃 Rapid`, `🏃 Quick`], [`🌿 Cu terasă`, `🌿 With a terrace`], [`🥡 La pachet`, `🥡 Takeaway`], [`🤷 Oricum`, `🤷 Either way`],
    [`← Înapoi`, `← Back`], [`Îți propun:`, `I suggest:`], [`Încă o dată 🎲`, `Again 🎲`], [`De la capăt`, `Start over`],
    [`Nu am găsit nimic exact. Alege "🎲 Orice" la una dintre întrebări și încearcă din nou.`, `I found nothing exact. Pick "🎲 Anything" on one of the questions and try again.`],
    
    [`bucătărie potrivită`, `matching cuisine`], [`stil potrivit`, `matching style`], 
    [`are terasă`, `has a terrace`], [`la pachet`, `takeaway`], [`ai părerea mea`, `you can read my opinion`],
    [`📍 Lângă mine`, `📍 Near me`], [`Cele mai apropiate`, `Nearest`], [`Locurile încă nu au coordonate. Rulează tools/import_osm.py.`, `The places don't have coordinates yet. Run tools/import_osm.py.`],
    [`Browserul nu poate afla poziția.`, `The browser can't get your location.`], [`Nu am putut afla poziția (ai refuzat sau nu e disponibilă).`, `Couldn't get your location (you declined or it's unavailable).`], [`Sortat după distanță 📍`, `Sorted by distance 📍`],
    [`Topul meu`, `My top`], [`🔗 Distribuie topul`, `🔗 Share my top`], [`Text copiat! 📋`, `Text copied! 📋`],
    [`Mulțumesc! Recomandarea ta a fost validată.`, `Thank you! Your recommendation was validated.`], [`Mulțumesc! Recomandarea ta a fost trimisă.`, `Thank you! Your recommendation was sent.`], [`Se trimite…`, `Sending…`],
    [`Așteaptă puțin înainte să trimiți din nou.`, `Please wait a moment before sending again.`], [`Nu am putut trimite recomandarea. Încearcă din nou peste câteva minute.`, `We couldn't send the recommendation. Try again in a few minutes.`], [`Scrie-mi direct pe email`, `Email me directly`],
    [`Google Analytics pornește doar dacă accepți bannerul de cookie-uri; poți schimba alegerea oricând din subsol. Favoritele, tema și mărimea textului se salvează doar în browserul tău. Poziția ta (butonul "Lângă mine") rămâne în browser și nu e trimisă nicăieri.`, `Google Analytics only starts if you accept the cookie banner; you can change your choice any time from the footer. Favorites, theme and text size are saved only in your browser. Your location (the "Near me" button) stays in your browser and isn't sent anywhere.`],
    // ---- contact, stări goale, galerie pe telefon ----
    [`Nu caut încă după repere (stadion, gară, mall…), ci după zonă sau cartier.`, `I can't search by landmarks yet (stadium, station, mall…), only by area or neighborhood.`],
    [`Poate te referi la:`, `Did you mean:`],
    [`Browserul tău nu poate reda videoul.`, `Your browser can't play the video.`], [`Video demonstrativ`, `Demo video`],
    [`Salut! Sunt asistentul de mâncare din Timișoara. Întreabă-mă de genul "ceva italian", "pizza în centru" sau "unde s-a mâncat bine". Poftă bună! 🍽️`, `Hi! I'm the food assistant for Timișoara. Ask me things like "something Italian", "pizza downtown" or "where was the food good". Enjoy your meal! 🍽️`], [`Cu plăcere! Poftă bună! 🍽️`, `You're welcome! Enjoy your meal! 🍽️`], [`Poftă bună și pe curând! 👋`, `Enjoy your meal, and see you soon! 👋`], [`Sunt asistentul ghidului „Mâncare în Timișoara”: te ajut să alegi unde să mănânci. Poftă bună! 🍽️`, `I'm the assistant of the “Food in Timișoara” guide: I help you choose where to eat. Enjoy your meal! 🍽️`], [`Ți-aș propune, la întâmplare:`, `How about one of these, picked at random:`], [`Poftă bună! 🍽️`, `Enjoy your meal! 🍽️`], [`Am găsit:`, `Found:`], [`Am găsit mai multe locuri cu acest nume:`, `I found several places with that name:`], [`Încă nu are note în ghid.`, `It has no scores in the guide yet.`], [`Mă pricep doar la mâncare și la locurile de mâncat din Timișoara 🍽️ La alte subiecte nu te pot ajuta, dar dacă ți-e foame, întreabă-mă de exemplu "pizza în centru", "ceva vegan" sau "unde se mănâncă bine".`, `I only know about food and places to eat in Timișoara 🍽️ I can't help with other topics, but if you're hungry, ask me something like "pizza downtown", "something vegan" or "where is the food good".`],
    [`Te pot ajuta să alegi un loc: spune-mi bucătăria (italian, pizza, burgeri…), tipul (restaurant, cafenea, fast-food), zona (Piața Unirii, Cetate = centrul…), facilitățile (vegan, terasă, livrare) sau „cel mai bun”, „unde am fost”, „deschis acum”. Poți scrie și cu greșeli mici de scriere, încerc să înțeleg.`, `I can help you choose a place: tell me the cuisine (Italian, pizza, burgers…), the type (restaurant, café, fast food), the area (Piața Unirii, Cetate = the center…), the facilities (vegan, terrace, delivery) or “the best”, “where I've been”, “open now”. Small typos are fine, I'll try to understand.`], [`Programul locurilor nu e completat încă, deci n-am putut filtra după „deschis acum”.`, `The places' opening hours aren't filled in yet, so I couldn't filter by “open now”.`], [`deschis acum`, `open now`],
    [`Deschis acum`, `Open now`], [`Închis acum`, `Closed now`],
    [`Scurtături de tastatură: F2 caută · F4 temă · F8 ajutor · F9 asistent`, `Keyboard shortcuts: F2 search · F4 theme · F8 help · F9 assistant`], [`Scurtături:`, `Shortcuts:`], [`F2 = caută, F4 = schimbă tema, F8 = ajutor, F9 = asistent. Sunt doar taste F, ca să nu se apese din greșeală când scrii; pe unele laptopuri trebuie să ții apăsat și Fn.`, `F2 = search, F4 = switch theme, F8 = help, F9 = assistant. Only F keys, so they can't be pressed by accident while typing; on some laptops you also need to hold Fn.`],
    [`Contact:`, `Contact:`], [`scrie-mi o întrebare sau o sugestie; telefonul e opțional, dar dacă îl scrii trebuie să fie valid.`, `write me a question or a suggestion; the phone is optional, but if you enter it, it must be valid.`], [`Ai o întrebare, o sugestie sau ai găsit o greșeală? Scrie-mi. Câmpurile cu * sunt obligatorii.`, `Have a question, a suggestion, or found a mistake? Write to me. Fields marked * are required.`], [`Telefon (opțional)`, `Phone (optional)`], [`Subiect *`, `Subject *`], [`Mesaj *`, `Message *`], [`Alege un subiect…`, `Choose a subject…`], [`Întrebare despre un loc`, `Question about a place`], [`Greșeală în date`, `Mistake in the data`], [`Sugestie pentru site`, `Suggestion for the site`], [`Altceva`, `Something else`], [`Trimite mesajul`, `Send message`], [`Vrei să propui un loc nou în ghid? Folosește pagina`, `Want to suggest a new place for the guide? Use the page`], [`Alege un subiect.`, `Choose a subject.`], [`Mulțumesc! Mesajul tău a fost validat.`, `Thank you! Your message was validated.`], [`Mulțumesc! Mesajul tău a fost trimis.`, `Thank you! Your message was sent.`], [`Nu am putut trimite mesajul. Încearcă din nou peste câteva minute.`, `We couldn't send the message. Try again in a few minutes.`], [`Se încarcă locurile…`, `Loading places…`], [`Se încarcă galeria…`, `Loading the gallery…`], [`Se încarcă…`, `Loading…`], [`Niciun loc nu se potrivește`, `No place matches`], [`Filtre active:`, `Active filters:`], [`Încearcă mai puține cuvinte, scrie fără diacritice sau scoate un filtru.`, `Try fewer words, type without diacritics, or remove a filter.`], [`Resetează filtrele`, `Reset filters`], [`💬 Întreabă asistentul`, `💬 Ask the assistant`], [`Nu ai niciun favorit încă`, `You have no favorites yet`], [`Apasă ♡ pe un card ca să-l salvezi aici.`, `Press ♡ on a card to save it here.`], [`Arată toate locurile`, `Show all places`], [`Șterge filtrul`, `Clear the filter`], [`Nu am putut încărca galeria`, `Couldn't load the gallery`], [`Miniaturi`, `Thumbnails`], [`Glisează stânga sau dreapta ca să schimbi imaginea.`, `Swipe left or right to change the image.`],
    [`Formularele de contact și de recomandare nu trimit date nicăieri.`, `The contact and recommendation forms don't send data anywhere.`],
    [`Datele din formularele de contact și de recomandare (nume, email, telefon, subiect sau loc, mesaj) sunt trimise prin serviciul FormSubmit către autorul site-ului și nu sunt păstrate pe acest site.`, `The data from the contact and recommendation forms (name, email, phone, subject or place, message) is sent through the FormSubmit service to the site's author and isn't stored on this site.`],
    // ---- cookie + ghid de stil ----
    [`Culorile, tipografia și componentele site-ului, într-un singur loc.`, `The site's colors, typography and components, in one place.`], [`Culori`, `Colors`],
    [`Valorile se citesc din CSS și se actualizează când schimbi tema (🌓). Raportul de contrast e calculat față de fundalul potrivit; minimul WCAG pentru text este 4.5:1.`, `Values are read from the CSS and update when you switch the theme (🌓). The contrast ratio is calculated against the matching background; the WCAG minimum for text is 4.5:1.`],
    [`Fundal`, `Background`], [`Text secundar`, `Secondary text`], [`Linii`, `Lines`], [`Erori`, `Errors`], [`Text pe accent`, `Text on accent`],
    [`Fundalul paginilor`, `Page background`], [`Carduri, panouri`, `Cards, panels`], [`Textul principal`, `Main text`], [`Note, etichete discrete`, `Notes, subtle labels`],
    [`Acțiuni, linkuri, fast-food, nota mea`, `Actions, links, fast food, my score`], [`Turcoaz`, `Teal`], [`Chihlimbar`, `Amber`], [`Albastru`, `Blue`], [`Mov-roz`, `Berry`],
    [`Restaurante, facilități, chat`, `Restaurants, amenities, chat`], [`Bucătării, Topul meu`, `Cuisines, My top`], [`Maps, zone, cafenele, distanță`, `Maps, areas, cafés, distance`], [`Pub și bar`, `Pubs and bars`],
    [`Culori cu rol: accentul (teracotă) e pentru acțiuni și fast-food, turcoazul pentru restaurante și facilități, albastrul pentru Maps, zone și cafenele, chihlimbarul pentru bucătării și Topul meu, mov-rozul pentru pub și bar. Culoarea nu e singura informație: fiecare etichetă are și text.`, `Colors with a role: the accent (terracotta) is for actions and fast food, teal for restaurants and amenities, blue for Maps, areas and cafés, amber for cuisines and My top, berry for pubs and bars. Color is never the only information: every tag also has text.`], [`Contururi, separatoare`, `Outlines, separators`], [`Mesaje de eroare`, `Error messages`], [`Etichete pe butoane`, `Labels on buttons`],
    [`Tipografie`, `Typography`], [`Font de sistem (system-ui), linie de 1.65, text de bază 16 px (reglabil cu A-/A+).`, `System font (system-ui), line height 1.65, base text 16 px (adjustable with A-/A+).`],
    [`Titlu de pagină (h1)`, `Page title (h1)`], [`Titlu de secțiune (h2)`, `Section title (h2)`], [`Text de bază: ghid personal de locuri de mâncat din Timișoara.`, `Body text: a personal guide to places to eat in Timișoara.`],
    [`Text mic și secundar, pentru detalii.`, `Small secondary text, for details.`], [`Butoane`, `Buttons`], [`Buton principal`, `Primary button`], [`Buton cu contur`, `Outline button`], [`Buton-icon`, `Icon button`], [`Link-buton`, `Button link`],
    [`Hover întunecă ușor butonul; focusul de tastatură are un inel dublu, vizibil pe ambele teme.`, `Hover slightly darkens the button; keyboard focus has a double ring, visible on both themes.`],
    [`Etichete și note`, `Tags and scores`], [`Card`, `Card`],
    [`Imaginea e un placeholder ilustrat (emoji și culoare derivate din nume), deoarece site-ul nu folosește poze.`, `The image is an illustrated placeholder (emoji and color derived from the name), because the site uses no photos.`],
    [`Formular`, `Form`], [`Câmp de text`, `Text field`], [`Câmp cu eroare`, `Field with error`], [`Câmp valid`, `Valid field`], [`Bifă`, `Checkbox`],
    [`Mesajul de eroare apare sub câmp și e anunțat de cititoarele de ecran.`, `The error message appears under the field and is announced by screen readers.`],
    [`Spațiere și grilă`, `Spacing and grid`], [`Scara de spațiere folosește multipli de 0.25 rem. Cardurile sunt pe 1 coloană (telefon), 2 (de la 700 px) și 3 (de la 1000 px); meniul întreg apare de la 1100 px.`, `The spacing scale uses multiples of 0.25 rem. Cards are in 1 column (phone), 2 (from 700 px) and 3 (from 1000 px); the full menu appears from 1100 px.`],
    [`Reguli de accesibilitate`, `Accessibility rules`], [`Contrast minim 4.5:1 pentru text, verificat pe ambele teme.`, `Minimum contrast 4.5:1 for text, checked on both themes.`],
    [`Ținte tactile de cel puțin 44 px la butoanele plutitoare.`, `Touch targets of at least 44 px for the floating buttons.`],
    [`Informația nu depinde doar de culoare (simboluri și text lângă culori).`, `Information doesn't rely on color alone (symbols and text next to colors).`],
    [`Navigare completă de la tastatură, cu "Sari la conținut" și focus vizibil.`, `Full keyboard navigation, with "Skip to content" and visible focus.`],
    [`Respectă "reduce motion" și setarea de temă a sistemului.`, `Respects "reduce motion" and the system theme setting.`],
  ];
  const EN = Object.fromEntries(D.map(([k, v]) => [k.replace(/[„”“]/g, '"'), v]));   // cheile cu ghilimele „ ” se potrivesc cu textul normalizat de nq()
  const PAT = [
    [/^(\d+) din (\d+) locuri$/, m => `${m[1]} of ${m[2]} places`],
    [/^Filtre \((\d+)\)$/, m => `Filters (${m[1]})`],
    [/^Arată încă (\d+) din (\d+) rămase$/, m => `Show ${m[1]} more of ${m[2]} remaining`],
    [/^Compară \((\d+)\) ⚖️$/, m => `Compare (${m[1]}) ⚖️`],
    [/^Am (\d+) locuri în listă\.$/, m => `I have ${m[1]} places in the list.`],
    [/^(\d+) din (\d+) locuri au coordonate și apar pe hartă\.$/, m => `${m[1]} of ${m[2]} places have coordinates and appear on the map.`],
    [/^…și încă (\d+) în$/, m => `…and ${m[1]} more in`],
    [/^Nu am putut încărca locurile\. Rulezi site-ul printr-un server \(Live Server\)\? \((.*)\)$/, m => `Could not load the places. Are you running the site through a server (Live Server)? (${m[1]})`],
    [/^Nu am putut încărca galeria \((.*)\)\. Folosești Live Server\?$/, m => `Could not load the gallery (${m[1]}). Are you using Live Server?`],
    [/^Nu am putut încărca datele \((.*)\)\. Folosești Live Server\?$/, m => `Could not load the data (${m[1]}). Are you using Live Server?`],
    [/^Nu există niciun loc cu id-ul "(.*)"\.$/, m => `There is no place with the id "${m[1]}".`],
    [/^"(.*)" nu are coordonate; îl poți deschide în Google Maps\.$/, m => `"${m[1]}" has no coordinates; you can open it in Google Maps.`],
    [/^([\d.]+:1) ✔ trece$/, m => `${m[1]} ✔ passes`], [/^([\d.]+:1) ✘ sub prag$/, m => `${m[1]} ✘ below threshold`],
    [/^Favorit: (.*)$/, m => `Favorite: ${m[1]}`], [/^Mărește: (.*)$/, m => `Enlarge: ${m[1]}`],
    [/^Nota publică: (.*)$/, m => `Public score: ${m[1]}`], [/^Nota mea: (.*)$/, m => `My score: ${m[1]}`],
    [/^Zone pe care le știu: (.*)$/, m => `Areas I know: ${m[1]}`], [/^Am găsit (\d+) locuri (.+):$/, m => `I found ${m[1]} ${m[2]} places:`],
    [/^N-am găsit (.+) în (.+)\. Dar iată unde îl găsești:$/, m => `I didn't find ${m[1]} in ${m[2]}. But here's where you can find it:`],
    [/^Am corectat: (.*)$/, m => `Corrected: ${m[1]}`],
    [/^Criterii: (.*)$/, m => `Criteria: ${m[1].split(/,\s*/).map(p => EN[p] ?? p).join(", ")}`],
    [/^Pasul (\d) din (\d)$/, m => `Step ${m[1]} of ${m[2]}`],
    [/^notă publică (.*) ★$/, m => `public score ${m[1]} ★`],
    [/^(.*) \| Mâncare în Timișoara$/, m => `${tr(m[1]) ?? m[1]} | Food in Timișoara`],
  ];
  const ATTR = ["placeholder", "aria-label", "title", "alt"];
  const SKIP = "[data-no-i18n],.card h2,#titlu,#lbimg h2,#tb a,#cmpBody th a,script,style,textarea,code,pre";
  const nq = s => s.replace(/[„”“]/g, '"');
  let lang = "ro"; try { lang = localStorage.getItem("lang") || "ro"; } catch (e) {}
  const origT = new WeakMap(), doneT = new WeakMap(), origA = new WeakMap();

  function tr(s) {
    const full = nq(s).replace(/\s+/g, " ").trim(); if (!full) return null;
    if (EN[full] !== undefined) return EN[full];
    for (const [re, fn] of PAT) { const m = full.match(re); if (m) return fn(m); }
    const m = full.match(/^([^\p{L}]*)(.*?)([^\p{L}]*)$/u);          // ignoră simbolurile de la capete: "(italian)", "• ", "Nume ▲"
    if (m && m[2]) {
      const c = m[2]; let r = EN[c];
      if (r === undefined && c.includes(",")) { const parts = c.split(/,\s*/), t = parts.map(p => EN[p] ?? null); if (t.some(Boolean)) r = parts.map((p, i) => t[i] ?? p).join(", "); }
      if (r !== undefined) return m[1] + r + m[3];
    }
    return null;
  }
  function doText(n) {
    const p = n.parentElement; if (!p || p.closest(SKIP)) return;
    const cur = n.nodeValue;
    if (doneT.get(n) === cur) { if (lang === "ro") { n.nodeValue = origT.get(n); doneT.delete(n); } return; }
    origT.set(n, cur);
    if (lang === "en") { const t = tr(cur); if (t != null) { const out = cur.match(/^\s*/)[0] + t + cur.match(/\s*$/)[0]; n.nodeValue = out; doneT.set(n, out); } }
  }
  function doEl(el) {
    if (!el.hasAttribute || el.closest(SKIP)) return;
    for (const a of ATTR) {
      if (!el.hasAttribute(a)) continue;
      const cur = el.getAttribute(a), rec = (origA.get(el) || {})[a];
      if (rec && rec.done === cur) { if (lang === "ro") { el.setAttribute(a, rec.orig); delete origA.get(el)[a]; } continue; }
      const o = origA.get(el) || {}; o[a] = { orig: cur, done: null }; origA.set(el, o);
      if (lang === "en") { const t = tr(cur); if (t != null) { el.setAttribute(a, t); o[a].done = t; } }
    }
  }
  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1) return;
    doEl(root); root.querySelectorAll && root.querySelectorAll(ATTR.map(a => `[${a}]`).join(",")).forEach(doEl);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) doText(n);
  }
  function all() { walk(document.documentElement); }
  function setLang(l) {
    lang = l; try { localStorage.setItem("lang", l); } catch (e) {}
    document.documentElement.lang = l; all();
    const b = document.getElementById("langBtn"); if (b) { b.textContent = l === "en" ? "RO" : "EN"; b.setAttribute("aria-label", b.textContent + " Language / Limba"); }
  }
  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.lang = lang;
    const b = document.getElementById("langBtn");
    if (b) { b.textContent = lang === "en" ? "RO" : "EN"; b.setAttribute("aria-label", b.textContent + " Language / Limba"); b.onclick = () => setLang(lang === "en" ? "ro" : "en"); }
    all();
    new MutationObserver(ms => {
      for (const m of ms) {
        if (m.type === "childList") m.addedNodes.forEach(walk);
        else if (m.type === "characterData") doText(m.target);
        else if (m.type === "attributes") doEl(m.target);
      }
    }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
  });
  window.setLang = setLang;
})();
