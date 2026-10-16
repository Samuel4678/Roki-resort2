const C=CONFIG,$=s=>document.querySelector(s);
const MAP="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(C.plusCode);
/* Where enquiries go: WhatsApp if set, else email, else the Facebook page */
function reach(text){if(C.whatsapp)return`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;
 if(C.email)return`mailto:${C.email}?subject=${encodeURIComponent("Enquiry: "+C.name)}&body=${encodeURIComponent(text)}`;return C.facebook}
$("#tDir").href=MAP;$("#fb").href=C.facebook;$("#aboutTxt").textContent=C.about;$("#yr").textContent=new Date().getFullYear();
if(C.phone)$("#tPhone").innerHTML=`<a href="tel:${C.phone.replace(/\s/g,"")}">📞 ${C.phone}</a>`;
$("#feat").innerHTML=C.features.map(f=>`<li>${f}</li>`).join("");
$("#bR").innerHTML=`<option>Any room</option>`+C.rooms.map(r=>`<option>${r.name}</option>`).join("");
const pics=["building","cottages","fountain"]; /* photo shown on each room card; swap names or add your own room photos */
$("#roomGrid").innerHTML=C.rooms.map((r,i)=>`<article class="room rv"><div class="pic ph ${pics[i%3]}" role="img" aria-label="${r.name}"></div><div class="b"><h3>${r.name}</h3><p>${r.desc}</p><div class="tags"><i>Sleeps ${r.sleeps}</i></div><div class="row"><span class="price">Rates on request</span><button class="link" onclick="Agent.ask('Book ${r.name}')">Enquire →</button></div></div></article>`).join("");
$("#dineList").innerHTML=C.dining.map(d=>`<div class="dine"><h3>${d.name}</h3><p>${d.desc}</p></div>`).join("");
$("#evGrid").innerHTML=C.events.map((e,i)=>`<div class="ev rv"><span>${["💍","🏛️","🌿"][i%3]}</span><h3>${e.name}</h3><p>${e.desc}</p></div>`).join("");
$("#leisure").innerHTML=C.leisure.map(l=>`<span>${l}</span>`).join("");
const L=(t,h)=>`<a href="${h}" target="_blank" rel="noopener">${t}</a>`;
$("#cInfo").innerHTML=`<p>📍 ${C.location}</p><p>🧭 Plus code: <b>${C.plusCode}</b> · ${L("Get directions",MAP)}</p>`+
 (C.phone?`<p>📞 ${L(C.phone,"tel:"+C.phone.replace(/\s/g,""))}</p>`:"")+(C.whatsapp?`<p>💬 ${L("Chat on WhatsApp",reach("Hello "+C.name))}</p>`:"")+(C.email?`<p>✉ ${L(C.email,"mailto:"+C.email)}</p>`:"")+`<p>👍 ${L("Follow us on Facebook",C.facebook)}</p>`;
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add("in"),io.unobserve(e.target))),{threshold:.12});
document.querySelectorAll(".rv").forEach(e=>io.observe(e));
const today=new Date().toISOString().slice(0,10);$("#bIn").min=$("#bOut").min=today;
function bookNow(e){e.preventDefault();const i=$("#bIn").value,o=$("#bOut").value;if(o<=i){alert("Check-out must be after check-in.");return false}log("booking_request",$("#bR").value+" · "+$("#bG").value+" guests · "+i+" to "+o);
 open(reach(`Hello ${C.name}, I'd like to book.\nCheck-in: ${i}\nCheck-out: ${o}\nGuests: ${$("#bG").value}\nRoom: ${$("#bR").value}`),"_blank");return false}
function sendEnq(e){e.preventDefault();log("enquiry_sent");open(reach(`Enquiry from ${$("#eN").value} (${$("#eP").value}):\n${$("#eM").value}`),"_blank");return false}

/* ===== Roki Concierge: in-browser assistant (intent matching + guided booking) ===== */
const Agent=(()=>{let opened=false,flow=null,data={};const box=$("#agentBox"),msgs=$("#msgs");
 const INT=[["greet",["hi","hello","hey","habari","jambo","good morning","good evening","mambo"]],
  ["book",["book","reserve","reservation","availability","available","stay","room for"]],
  ["rooms",["room","suite","accommodation","sleep","bed","deluxe","standard"]],
  ["price",["price","rate","cost","how much","charge","bei","tariff","cheap","budget","discount"]],
  ["dining",["food","eat","restaurant","menu","dining","breakfast","lunch","dinner","bar","drink","chakula"]],
  ["events",["event","wedding","conference","meeting","team","retreat","party","venue","birthday","corporate","graduation"]],
  ["leisure",["do","activity","activities","fun","fountain","walk","see","masinga","garden"]],
  ["where",["where","location","direction","map","address","far","reach","drive","nairobi","road","get there","plus code"]],
  ["contact",["contact","phone","call","whatsapp","email","number","speak","human","agent","manager","reception"]],
  ["thanks",["thanks","thank you","asante","great"]]];
 const say=(h,who="b")=>{const d=document.createElement("div");d.className="m "+who;d.innerHTML=h;msgs.append(d);msgs.scrollTop=1e9;return d};
 const chips=a=>{$("#chips").innerHTML=a.map(c=>`<button onclick="Agent.ask(this.textContent)">${c}</button>`).join("")};
 const MENU=["Book a room","Rooms","Dining","Events","Things to do","Location","Contact us"];
 const reply=(h,c)=>{const d=say("<i>…</i>");setTimeout(()=>{d.innerHTML=h;msgs.scrollTop=1e9;chips(c||MENU)},450+Math.min(h.length*4,700))};
 const norm=s=>" "+s.toLowerCase().replace(/[^a-z0-9\s-]/g," ").replace(/\s+/g," ")+" ";
 function intent(q){const n=norm(q);for(const f of C.faqs)for(const k of f.k)if(n.includes(" "+k))return{faq:f};
  let best=null,sc=0;for(const[i,ks]of INT){let s=0;for(const k of ks)if(n.includes(" "+k))s+=k.includes(" ")?2:1;if(s>sc){sc=s;best=i}}return{i:best}}
 const contact=()=>`${C.phone?`📞 ${C.phone}\n`:""}${C.email?`✉ ${C.email}\n`:""}${L("Message us"+(C.whatsapp?" on WhatsApp":""),reach("Hello "+C.name))}`;
 function answer(i){switch(i){
  case"greet":return[`Karibu to ${C.name}! 👋 I'm Roki, your virtual concierge. I can help with rooms, dining, events and bookings.`];
  case"rooms":return[`<b>Our rooms</b>\n`+C.rooms.map(r=>`• ${r.name} (sleeps ${r.sleeps}): ${r.desc}`).join("\n"),["Rates","Book a room"]];
  case"price":return[`Rates vary by room and season. ${L("Message us",reach("Hello, could I get your current room rates?"))} for today's best offer.`,["Book a room"]];
  case"dining":return[`<b>Dining</b>\n`+C.dining.map(d=>`• ${d.name}: ${d.desc}`).join("\n")];
  case"events":return[`<b>Events &amp; groups</b>\n`+C.events.map(e=>`• ${e.name}: ${e.desc}`).join("\n")+`\n\nShare your date and guest count and we'll prepare a quote.`,["Plan an event"]];
  case"leisure":return[`While you're here: ${C.leisure.join(", ")}.`];
  case"where":return[`📍 ${C.location}\nPlus code: ${C.plusCode}\n${L("Open in Google Maps",MAP)}`,["Contact us"]];
  case"contact":return[contact()];
  case"thanks":return["You're most welcome! Anything else I can help with? 😊"]}}
 const steps=[["in","When would you like to check in? (e.g. 12 Dec)"],["out","And check out?"],["guests","How many guests?"],["room",()=>`Which room? ${C.rooms.map(r=>r.name).join(", ")}, or say "any".`],["name","Lastly, your name?"]];
 let s=0;
 function next(v){if(v!=null){data[steps[s][0]]=v;s++}
  if(s<steps.length){const q=steps[s][1];return reply(typeof q=="function"?q():q,[])}
  const msg=`Hello ${C.name}, I'm ${data.name}. I'd like to book.\nCheck-in: ${data.in}\nCheck-out: ${data.out}\nGuests: ${data.guests}\nRoom: ${data.room}`;
  flow=null;data={};s=0;reply(`Thank you! 🎉 Tap below to send these details to our reservations team to confirm availability and rates.\n\n${L("Send booking request →",reach(msg))}`)}
 function handle(q){log("chat_question",q);if(/^\s*(cancel|stop|menu|restart)\s*$/i.test(q)){flow=null;data={};s=0;return reply("No problem. What would you like to know?")}
  if(flow)return next(q);const r=intent(q);
  if(r.faq)return reply(r.faq.a);
  if(r.i=="book"||/plan an event/i.test(q)){flow=1;data={};s=0;if(/event/i.test(q))say("Great, let's start with the basics.");return next()}
  const a=answer(r.i);if(a)return reply(a[0],a[1]);
  reply(`I'd like to get this right, so let me connect you with our team: ${L("Send us a message",reach(q))}.`)}
 return{toggle(){box.hidden=!box.hidden;if(!box.hidden)log("chat_open");if(!box.hidden&&!opened){opened=true;say(`Karibu to <b>${C.name}</b> 🌿 I'm Roki. Ask me anything or choose below.`);chips(MENU)}if(!box.hidden)$("#ain").focus()},
  send(e){e.preventDefault();const v=$("#ain").value.trim();if(v){$("#ain").value="";say(v.replace(/</g,"&lt;"),"u");handle(v)}return false},
  ask(q){if(box.hidden)this.toggle();say(q.replace(/</g,"&lt;"),"u");handle(q)}}})();

/* Light / dark switch (dark is the default; choice is remembered) */
(function(){const r=document.documentElement,b=$("#theme"),m=document.querySelector('meta[name="theme-color"]');
 const paint=()=>{const d=r.dataset.theme!=="light";b.textContent=d?"☀️":"🌙";b.setAttribute("aria-label",d?"Switch to light mode":"Switch to dark mode");if(m)m.content=d?"#0b1616":"#faf6ef"};
 b.onclick=()=>{r.dataset.theme=r.dataset.theme==="light"?"dark":"light";try{localStorage.setItem("roki-theme",r.dataset.theme)}catch(e){}log("theme_toggle",r.dataset.theme);paint()};paint()})();


/* ===== Backend (Supabase): admin events, swappable photos, activity log =====
   Works only when supabaseUrl and supabaseKey are set in config.js; otherwise the site simply runs as a normal static site. */
const SB=C.supabaseUrl&&C.supabaseKey;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sb=(p,o={})=>fetch(C.supabaseUrl+p,{...o,headers:{apikey:C.supabaseKey,Authorization:"Bearer "+C.supabaseKey,"Content-Type":"application/json",...(o.headers||{})}});
const sid=(()=>{try{let s=sessionStorage.getItem("roki-sid");if(!s){s=Math.random().toString(36).slice(2,10)+Date.now().toString(36);sessionStorage.setItem("roki-sid",s)}return s}catch(e){return"anon"}})();
function log(type,detail){if(!SB)return;try{sb("/rest/v1/activity",{method:"POST",keepalive:true,headers:{Prefer:"return=minimal"},body:JSON.stringify({session_id:sid,type,detail:String(detail||"").slice(0,150),page:location.pathname,device:/Mobi|Android/i.test(navigator.userAgent)?"mobile":"desktop"})}).catch(()=>{})}catch(e){}}
if(SB){
 /* photos the admin has swapped */
 sb("/rest/v1/site_images?select=key,url").then(r=>r.json()).then(rows=>(rows||[]).forEach(r=>{if(!/^[a-z]+$/.test(r.key))return;document.documentElement.style.setProperty("--u-"+r.key,`url("${encodeURI(r.url)}")`);document.querySelectorAll(".ph."+r.key).forEach(e=>e.classList.add("has-photo"))})).catch(()=>{});
 /* events the admin has added */
 sb("/rest/v1/events?select=*&event_date=gte."+today+"&order=event_date.asc&limit=12").then(r=>r.json()).then(rows=>{if(!Array.isArray(rows))return;const b=$("#upEvents");b.hidden=false;
  b.innerHTML="<h3>Upcoming events</h3>"+(rows.length?rows.map(e=>{const d=new Date(e.event_date+"T00:00");return`<div class="ue"><div class="d"><b>${d.getDate()}</b><span>${d.toLocaleDateString("en-KE",{month:"short"})}</span></div>${e.image_url?`<img src="${encodeURI(e.image_url)}" alt="">`:""}<div><h4>${esc(e.title)}</h4><p>${esc([e.event_time,e.description].filter(Boolean).join(" · "))}</p></div></div>`}).join(""):"<p class='c' style='opacity:.8'>New events will be announced here. Follow us on Facebook for updates.</p>")}).catch(()=>{});
 /* anonymous activity */
 let ref="direct";try{if(document.referrer)ref=new URL(document.referrer).hostname}catch(e){}log("page_view",ref);
 const seen=new Set(),so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!seen.has(e.target.id)){seen.add(e.target.id);log("section_view",e.target.id)}}),{threshold:.4});
 document.querySelectorAll("section[id]").forEach(e=>so.observe(e));
 document.addEventListener("click",e=>{const x=e.target.closest("a");if(!x)return;const h=x.href||"";if(h.includes("wa.me"))log("whatsapp_click");else if(h.startsWith("tel:"))log("call_click");else if(h.includes("tiktok.com"))log("tiktok_click");else if(x.id==="tDir"||h.includes("google.com/maps"))log("directions_click")});
 const v=$("#vid");if(v)v.addEventListener("play",()=>log("video_play"),{once:true});
}
