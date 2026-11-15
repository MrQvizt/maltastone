const img = k => k ? 'assets/img/' + k : '';
const eur=n=>'€'+n.toFixed(2);
const FREE_SHIP=30;

const CATS={
  crystals:{name:'Crystals & Minerals',blurb:'Raw, tumbled and polished stones, towers, clusters and trees of life — each one chosen by hand.',hero:'p354.jpg'},
  jewellery:{name:'Jewellery',blurb:'Gemstone jewellery in sterling silver, gold vermeil and stainless steel — made to be worn every day.',hero:'DSCF8402.jpg'},
  metaphysical:{name:'Metaphysical',blurb:'Singing bowls, pendulums, smudging and ritual tools for meditation and energy work.',hero:'p3077.jpg'},
  home:{name:'Home & Gifts',blurb:'Selenite lamps, suncatchers, Maltese limestone carvings and thoughtful gifts.',hero:'p4711.jpg'},
};
const INTENTS={
  calm:{name:'Calm',line:'Amethyst · Selenite',img:'p280.jpg',desc:'Soothing stones and sound for rest, meditation and a quieter mind.'},
  love:{name:'Love',line:'Rose Quartz',img:'p256.jpg',desc:'Stones of the heart — for self-love, compassion and connection.'},
  protection:{name:'Protection',line:"Tourmaline · Tiger's Eye",img:'p419.jpg',desc:'Grounding, shielding stones to carry, wear or keep by the door.'},
  clarity:{name:'Clarity',line:'Clear Quartz',img:'p353.jpg',desc:'The master healer — amplifies intention and clears the mind.'},
  grounding:{name:'Grounding',line:'Smoky Quartz · Fossils',img:'p3609.jpg',desc:'Earthy, steadying pieces that bring you back to the present.'},
  abundance:{name:'Abundance',line:'Citrine · Jade · Agate',img:'p1316.jpg',desc:'Bright, energising stones for confidence, luck and growth.'},
};
const QUOTES=[
  ['What an amazing shop in the Craft Village… This shop is well worth the visit and, to coin a pun, an absolute jewel.','Nick Bailey'],
  ['Impressive selection of stones and the place to go to find the most original gifts. Very decent prices coupled with a stellar service.','Maria Lou'],
  ['An enchanting shop with an amazingly helpful staff and a vast selection of the most beautiful and precious stones one could find.','Jeremy Grech'],
];

/* ---------- state ---------- */
let cart=[]; // {id,qty}
let filt={intent:new Set(),stone:new Set(),price:null,sub:null,sort:'feat'};
let ship='local', paytab='card';

const P=id=>PRODUCTS.find(p=>p.id==id);
const cartCount=()=>cart.reduce((a,c)=>a+c.qty,0);
const subtotal=()=>cart.reduce((a,c)=>a+P(c.id).price*c.qty,0);

/* ---------- icons ---------- */
const I={
  search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  heart:'<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  bag:'<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  truck:'<svg viewBox="0 0 24 24"><path d="M2 6h11v10H2zM13 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
  pin:'<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  gem:'<svg viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l3 18 3-18"/></svg>',
  lock:'<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  ret:'<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
  gift:'<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="4"/><path d="M5 12v9h14v-9M12 8v13M12 8S10.5 3 8 3.5 7 8 12 8zm0 0s1.5-5 4-4.5S17 8 12 8z"/></svg>',
  card:'<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
  bank:'<svg viewBox="0 0 24 24"><path d="M3 10h18L12 4zM5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/></svg>',
  split:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 4"/></svg>',
  x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
};

/* ---------- shared chrome ---------- */
function header(){
  const sub=c=>[...new Set(PRODUCTS.filter(p=>p.cat==c).map(p=>p.sub))];
  const mega=(c,feat)=>`<div class="mega">
    <div><h4>Shop by type</h4>${sub(c).slice(0,7).map(s=>`<a href="#/shop/${c}/${encodeURIComponent(s)}">${s}</a>`).join('')}<a href="#/shop/${c}" style="color:var(--accent);margin-top:6px">View all →</a></div>
    <div><h4>Shop by intention</h4>${Object.entries(INTENTS).map(([k,v])=>`<a href="#/intent/${k}">${v.name}</a>`).join('')}</div>
    <a class="feat" href="#/shop/${c}"><img src="${img(feat)}" alt=""><span>${CATS[c].name}</span></a></div>`;
  return `
  <div class="announce"><div class="wrap">
    <span>Free delivery in Malta & Gozo on orders over €30</span><span class="dot">✦</span>
    <span>Click & collect from Ta' Qali Crafts Village</span><span class="dot">✦</span>
    <span>Secure checkout · Apple Pay · Google Pay · Cards</span>
  </div></div>
  <header class="site">
    <div class="wrap hdr">
      <div class="hdr-left"><div class="search-field" onclick="openSearch()">${I.search}<span>Search stones, jewellery…</span></div></div>
      <a class="logo" href="#/"><img src="${img('logo.png')}" alt="Malta Stone"></a>
      <div class="hdr-right">
        <button class="icon-btn" title="Account">${I.user}</button>
        <button class="icon-btn" title="Wishlist">${I.heart}</button>
        <button class="icon-btn" title="Bag" onclick="openCart()">${I.bag}${cartCount()?`<span class="badge">${cartCount()}</span>`:''}</button>
      </div>
    </div>
    <nav class="main"><ul class="wrap">
      <li><a class="top" href="#/shop/all">Shop all</a></li>
      <li><a class="top" href="#/shop/crystals">Crystals & Minerals</a>${mega('crystals','DSCF8277.jpg')}</li>
      <li><a class="top" href="#/shop/jewellery">Jewellery</a>${mega('jewellery','DSCF8380.jpg')}</li>
      <li><a class="top" href="#/shop/metaphysical">Metaphysical</a>${mega('metaphysical','p3077.jpg')}</li>
      <li><a class="top" href="#/shop/home">Home & Gifts</a>${mega('home','p4711.jpg')}</li>
      <li><a class="top" href="#/intent/calm">Shop by intention</a></li>
      <li><a class="top" href="#/" onclick="setTimeout(()=>document.getElementById('story')?.scrollIntoView(),60)">Visit us</a></li>
    </ul></nav>
  </header>`;
}
function footer(){
  return `<footer><div class="wrap">
    <div class="cols">
      <div><div class="logo-f"><img src="${img('logo.png')}" alt=""></div>
        <p style="max-width:300px;opacity:.85">Crystals, gemstone jewellery and mindful gifts — chosen by hand at our studio in Ta' Qali Crafts Village, Malta.</p>
        <p style="margin-top:18px;opacity:.85">Ta' Qali Crafts Village, TQL026 Rabat<br>+356 7930 6090</p></div>
      <div><h5>Shop</h5>${Object.entries(CATS).map(([k,v])=>`<a href="#/shop/${k}">${v.name}</a>`).join('')}<a href="#/shop/all">Gifts under €20</a></div>
      <div><h5>Help</h5><a>Delivery & click-and-collect</a><a>Returns & exchanges</a><a>Ring size guide</a><a>Caring for your crystals</a><a>Contact us</a></div>
      <div><h5>Follow</h5><a>Instagram · @maltastone</a><a>Facebook</a><h5 style="margin-top:22px">We accept</h5><div class="pay-icons"><span>VISA</span><span>Mastercard</span><span>Amex</span><span> Pay</span><span>G Pay</span></div></div>
    </div>
    <div class="bottom"><span>© 2026 Malta Stone by Strata Designs Ltd · C1346</span><span>Terms · Privacy · Cookies</span><span>Part-funded by the EU e-commerce scheme</span></div>
  </div></footer>`;
}
function cardHTML(p){
  const tag=p.new?'<span class="tag new">New</span>':p.best?'<span class="tag">Bestseller</span>':'';
  return `<div class="card" onclick="go('#/p/${p.id}')">
    <div class="ph"><img src="${img(p.img)}" alt="${p.name}">${tag}
      <button class="quick" onclick="event.stopPropagation();add(${p.id})">Add to bag — ${eur(p.price)}</button></div>
    <div class="info"><div class="stone">${p.stone}</div><div class="nm">${p.name}</div><div class="pr">${eur(p.price)}</div></div></div>`;
}

/* ---------- views ---------- */
function vHome(){
  const best=PRODUCTS.filter(p=>p.best).slice(0,8);
  return header()+`
  <section class="hero"><div class="wrap grid">
    <div>
      <div class="eyebrow">Ta' Qali Crafts Village · Malta</div>
      <h1 style="margin-top:18px">Stones with a story, <em>chosen by hand.</em></h1>
      <p class="lead">Crystals, gemstone jewellery and mindful gifts from our little studio in Malta — each piece picked for its beauty and its energy.</p>
      <div class="ctas"><a class="btn btn-dark" href="#/shop/all">Shop the collection ${I.arrow}</a><a class="btn btn-light" href="#/intent/calm">Find your stone</a></div>
      <div class="meta"><div><b>1,200+</b>stones & pieces</div><div><b>Same day</b>click &amp; collect</div><div><b>1–2 days</b>Malta delivery</div></div>
    </div>
    <div class="hero-media">
      <div class="main"><img src="${img('DSCF8346.jpg')}" alt=""></div>
      <div class="side"><img src="${img('DSCF8191.jpg')}" alt=""></div>
      <div class="note"><b>Raise your vibration</b>New in: Smoky Quartz & Amethyst Trees of Life</div>
    </div>
  </div></section>

  <div class="trust"><div class="wrap">
    <div>${I.truck}<span><b>Free Malta & Gozo delivery</b>On orders over €30</span></div>
    <div>${I.pin}<span><b>Click & collect</b>Ready same day at Ta' Qali</span></div>
    <div>${I.gem}<span><b>Genuine stones</b>Hand-selected & ethically sourced</span></div>
    <div>${I.lock}<span><b>Secure checkout</b>Powered by Stripe</span></div>
  </div></div>

  <section class="block"><div class="wrap">
    <div class="sec-head"><div><div class="eyebrow">Shop by intention</div><h2 style="margin-top:10px">What are you calling in?</h2><p>Not sure which stone you need? Start with how you want to feel.</p></div><a class="link" href="#/intent/calm">Explore all intentions</a></div>
    <div class="intents">${Object.entries(INTENTS).map(([k,v])=>`<div class="intent" onclick="go('#/intent/${k}')"><div class="ring"><img src="${img(v.img)}" alt=""></div><h3>${v.name}</h3><p>${v.line}</p></div>`).join('')}</div>
  </div></section>

  <section class="block" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><div><div class="eyebrow">Collections</div><h2 style="margin-top:10px">Explore the shop</h2></div></div>
    <div class="cats">
      ${[['crystals','DSCF8277.jpg','432 pieces'],['jewellery','DSCF8380.jpg','767 pieces'],['metaphysical','p3077.jpg','173 pieces'],['home','p4711.jpg','459 pieces'],['home','p6157.jpg','Maltese limestone','Malta Stone']].slice(0,5).map(([k,im,n,lbl])=>`
      <div class="cat" onclick="go('#/shop/${k}')"><img src="${img(im)}" alt=""><div class="lbl"><div><small>${n}</small><h3>${lbl||CATS[k].name}</h3></div><span class="arrow">${I.arrow}</span></div></div>`).join('')}
    </div>
  </div></section>

  <section class="block" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><div><div class="eyebrow">Loved by our customers</div><h2 style="margin-top:10px">Bestsellers</h2></div><a class="link" href="#/shop/all">Shop all</a></div>
    <div class="grid-p">${best.map(cardHTML).join('')}</div>
  </div></section>

  <section class="block story" id="story"><div class="wrap grid">
    <div class="imgs"><img src="${img('DSCF8179.jpg')}" alt=""><img src="${img('DSCF8473.jpg')}" alt=""></div>
    <div>
      <div class="eyebrow">Our philosophy</div>
      <h2 style="margin-top:12px">Discover the wonders of nature, one stone at a time.</h2>
      <p>Malta Stone began as a small workshop in the old airfield buildings of Ta' Qali. Today we bring together crystals and minerals from around the world with handcrafted gemstone jewellery — and we still hand-pick every piece.</p>
      <p>Come and hold them before you choose. Or shop online and we'll wrap it with the same care.</p>
      <div class="visit"><div><b>Visit</b>Ta' Qali Crafts Village<br>TQL026, Rabat, Malta</div><div><b>Opening hours</b>Mon–Sat · 10:00–17:00<br><span style="color:var(--muted)">[confirm with client]</span></div></div>
      <a class="btn btn-dark">Get directions ${I.arrow}</a>
    </div>
  </div></section>

  <section class="block"><div class="wrap">
    <div class="sec-head"><div><div class="eyebrow">@maltastone</div><h2 style="margin-top:10px">Worn with intention</h2></div><a class="link">Follow on Instagram</a></div>
    <div class="look">
      <figure><img src="${img('DSCF8236.jpg')}" alt=""><figcaption>Turquoise & silver</figcaption></figure>
      <figure><img src="${img('DSCF8402.jpg')}" alt=""><figcaption>Statement rings</figcaption></figure>
      <figure><img src="${img('DSCF8244.jpg')}" alt=""><figcaption>Layered pendants</figcaption></figure>
      <figure><img src="${img('DSCF8304.jpg')}" alt=""><figcaption>Fossils & shells</figcaption></figure>
    </div>
  </div></section>

  <section class="block" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><div><div class="eyebrow">Kind words</div><h2 style="margin-top:10px">“An absolute jewel”</h2></div></div>
    <div class="quotes">${QUOTES.map(q=>`<div class="quote"><div class="stars">★★★★★</div><p>${q[0]}</p><small>— ${q[1]}, Google review</small></div>`).join('')}</div>
  </div></section>

  <div class="wrap"><div class="news">
    <div><div class="eyebrow" style="color:#E3CFA6">Join the circle</div><h2 style="margin-top:10px">New moon drops & 10% off your first order</h2><p>Monthly notes on new arrivals, stone meanings and studio events. No spam, ever.</p></div>
    <form onsubmit="event.preventDefault();toast('Thanks — you\\'re on the list ✦')"><input placeholder="Your email address"><button class="btn btn-dark">Subscribe</button></form>
  </div></div>
  `+footer();
}

function filtered(base){
  let l=base.filter(p=>
    (!filt.intent.size||filt.intent.has(p.intent))&&
    (!filt.stone.size||filt.stone.has(p.stone))&&
    (!filt.sub||p.sub==filt.sub)&&
    (!filt.price||(filt.price=='u20'?p.price<20:filt.price=='20-50'?p.price>=20&&p.price<=50:p.price>50)));
  if(filt.sort=='low')l=[...l].sort((a,b)=>a.price-b.price);
  if(filt.sort=='high')l=[...l].sort((a,b)=>b.price-a.price);
  if(filt.sort=='new')l=[...l].sort((a,b)=>b.new-a.new);
  return l;
}
function vShop(cat,sub,intent){
  const base=intent?PRODUCTS.filter(p=>p.intent==intent):cat&&cat!='all'?PRODUCTS.filter(p=>p.cat==cat):PRODUCTS;
  const meta=intent?{name:INTENTS[intent].name,blurb:INTENTS[intent].desc}:CATS[cat]||{name:'Shop all',blurb:'Every crystal, gemstone and gift in our studio — 1,264 pieces and counting. (Draft shows a curated selection.)'};
  const list=filtered(base);
  const subs=[...new Set(base.map(p=>p.sub))];
  const stones=[...new Set(base.map(p=>p.stone))].sort();
  const cnt=(k,v)=>base.filter(p=>p[k]==v).length;
  return header()+`<div class="wrap">
    <div class="page-head">
      <div class="crumbs"><a href="#/">Home</a> / ${intent?'<a href="#/intent/calm">Shop by intention</a> / ':''}${meta.name}</div>
      ${intent?'<div class="eyebrow">Shop by intention</div>':''}
      <h1 style="font-size:56px;margin-top:6px">${meta.name}</h1>
      <p style="color:var(--muted);max-width:560px;margin-top:10px">${meta.blurb}</p>
      ${intent?`<div class="chips">${Object.entries(INTENTS).map(([k,v])=>`<button class="chip ${k==intent?'on':''}" onclick="go('#/intent/${k}')">${v.name}</button>`).join('')}</div>`
      :`<div class="chips"><button class="chip ${!filt.sub?'on':''}" onclick="setSub(null)">All</button>${subs.map(s=>`<button class="chip ${filt.sub==s?'on':''}" onclick="setSub('${s.replace(/'/g,"\\'")}')">${s}</button>`).join('')}</div>`}
    </div>
    <div class="shop">
      <aside class="filters">
        ${intent?'':`<div class="fgroup"><h6>Intention</h6>${Object.entries(INTENTS).map(([k,v])=>`<label><input type="checkbox" ${filt.intent.has(k)?'checked':''} onchange="tog('intent','${k}')">${v.name}<span class="count">${cnt('intent',k)}</span></label>`).join('')}</div>`}
        <div class="fgroup"><h6>Stone</h6>${stones.slice(0,10).map(s=>`<label><input type="checkbox" ${filt.stone.has(s)?'checked':''} onchange="tog('stone','${s.replace(/'/g,"\\'")}')">${s}<span class="count">${cnt('stone',s)}</span></label>`).join('')}</div>
        <div class="fgroup"><h6>Price</h6>${[['u20','Under €20'],['20-50','€20 – €50'],['o50','Over €50']].map(([k,l])=>`<label><input type="checkbox" ${filt.price==k?'checked':''} onchange="setPrice('${k}')">${l}</label>`).join('')}</div>
        <div class="fgroup"><h6>Material</h6><label><input type="checkbox">Sterling silver 925</label><label><input type="checkbox">Gold plated</label><label><input type="checkbox">Stainless steel</label></div>
      </aside>
      <div>
        <div class="toolbar"><span>${list.length} pieces</span>
          <select onchange="filt.sort=this.value;render()"><option value="feat" ${filt.sort=='feat'?'selected':''}>Featured</option><option value="new" ${filt.sort=='new'?'selected':''}>Newest</option><option value="low" ${filt.sort=='low'?'selected':''}>Price: low to high</option><option value="high" ${filt.sort=='high'?'selected':''}>Price: high to low</option></select></div>
        ${list.length?`<div class="grid-p three">${list.map(cardHTML).join('')}</div>`:`<div class="empty">No pieces match these filters. <a class="link" onclick="resetF();render()">Clear filters</a></div>`}
      </div>
    </div></div>`+footer();
}
let pq=1;
function vProduct(id){
  const p=P(id); if(!p) return vHome();
  const rel=PRODUCTS.filter(x=>x.id!=p.id&&(x.intent==p.intent||x.stone==p.stone)).slice(0,4);
  const it=INTENTS[p.intent];
  const extra=[p.img, CATS[p.cat].hero.startsWith('DSCF')?CATS[p.cat].hero:'DSCF8191.jpg', 'DSCF8277.jpg'];
  return header()+`<div class="wrap">
    <div class="crumbs" style="padding-top:28px"><a href="#/">Home</a> / <a href="#/shop/${p.cat}">${CATS[p.cat].name}</a> / ${p.sub}</div>
    <div class="pdp">
      <div class="gallery">
        <div class="thumbs">${extra.map((e,i)=>`<button class="${i==0?'on':''}" onclick="document.getElementById('bigimg').src='${img(e)}';[...this.parentNode.children].forEach(b=>b.classList.remove('on'));this.classList.add('on')"><img src="${img(e)}" alt=""></button>`).join('')}</div>
        <div class="big"><img id="bigimg" src="${img(p.img)}" alt="${p.name}"></div>
      </div>
      <div class="pinfo">
        <div class="eyebrow">${p.stone} · ${p.sub}</div>
        <h1>${p.name}</h1>
        <div class="price">${eur(p.price)}</div>
        <div class="stock"><i></i>In stock · ships in 1–2 working days · or collect today</div>
        <p class="desc">${p.desc}</p>
        <div class="energy"><span>✦ ${it.name}</span><span>${p.stone}</span>${p.price<20?'<span>Gift under €20</span>':''}</div>
        <div class="buy">
          <div class="qty"><button onclick="pq=Math.max(1,pq-1);this.nextElementSibling.textContent=pq">−</button><span>${pq}</span><button onclick="pq++;this.previousElementSibling.textContent=pq">+</button></div>
          <button class="btn btn-dark" style="flex:1;height:50px" onclick="add(${p.id},pq)">Add to bag</button>
        </div>
        <button class="express" onclick="add(${p.id},pq,true)"><span style="font-size:18px"></span> Buy with Apple Pay</button>
        <div class="perks">
          <div>${I.truck}Free Malta & Gozo delivery over €30</div>
          <div>${I.gift}Complimentary gift wrapping</div>
          <div>${I.ret}14-day easy returns</div>
        </div>
        <details open><summary>About ${p.stone}</summary><p>${it.desc} Cleanse under moonlight or with a selenite charging plate, and keep away from prolonged direct sun.</p></details>
        <details><summary>Delivery & collection</summary><p>Malta & Gozo: €3.50, free over €30 · 1–2 working days. International: tracked DHL from €12. Click & collect from Ta' Qali Crafts Village, usually ready the same day.</p></details>
        <details><summary>Every stone is unique</summary><p>Natural stones vary in colour, pattern and size. The piece you receive will be similar to, but not exactly like, the one pictured — that's part of its character.</p></details>
      </div>
    </div>
    <div class="sec-head"><div><div class="eyebrow">Pairs well with</div><h2 style="margin-top:10px">You may also love</h2></div></div>
    <div class="grid-p">${rel.map(cardHTML).join('')}</div>
  </div>`+footer();
}
/* last-minute suggestions at checkout: related to what's in the bag first, then bestsellers */
function upsellList(n){
  const inCart=new Set(cart.map(c=>c.id)), mine=cart.map(c=>P(c.id));
  const score=p=>(mine.some(m=>m.intent==p.intent||m.stone==p.stone)?2:0)+(p.best?1:0);
  return PRODUCTS.filter(p=>!inCart.has(p.id)&&p.price<=30)
    .map((p,i)=>({p,i,s:score(p)})).sort((a,b)=>b.s-a.s||a.i-b.i).slice(0,n).map(x=>x.p);
}
function upsellHTML(){
  const list=upsellList(4); if(!list.length) return '';
  const left=ship=='local'?Math.max(0,FREE_SHIP-subtotal()):0;
  return `<div class="co-up">
    <div class="eyebrow">Before you go</div>
    <h3>You may also like</h3>
    ${left>0?`<p class="up-ship">Add <b>${eur(left)}</b> more for free Malta & Gozo delivery.</p>`:''}
    ${list.map(p=>`<div class="up-item"><a href="#/p/${p.id}"><img src="${img(p.img)}" alt=""></a>
      <div><a class="nm" href="#/p/${p.id}">${p.name}</a><small>${p.stone}</small><div class="pr">${eur(p.price)}</div></div>
      <button onclick="addCo(${p.id})" aria-label="Add ${p.name} to order">+ Add</button></div>`).join('')}
  </div>`;
}
function shipCost(){const s=subtotal();return ship=='collect'?0:ship=='intl'?12:(s>=FREE_SHIP?0:3.5)}
function vCheckout(){
  if(!cart.length) return header()+`<div class="wrap"><div class="success"><h2>Your bag is empty</h2><p style="color:var(--muted);margin:12px 0 26px">Add a few pieces to see the checkout.</p><a class="btn btn-dark" href="#/shop/all">Browse the shop</a></div></div>`+footer();
  const s=subtotal(), sh=shipCost(), tot=s+sh;
  const opt=(k,t,sub,p)=>`<div class="opt ${ship==k?'on':''}" onclick="ship='${k}';render()"><span class="rad"></span><span class="t">${t}<small>${sub}</small></span><span class="p">${p}</span></div>`;
  const tab=(k,ic,l)=>`<button class="ptab ${paytab==k?'on':''}" onclick="paytab='${k}';render()">${ic}${l}</button>`;
  return `<div class="co-head"><div class="wrap"><a href="#/"><img src="${img('logo.png')}" alt=""></a>
    <div class="steps"><a href="#/" style="color:var(--muted)">Bag</a> › <b>Details & payment</b> › Confirmation</div>
    <div class="secure" style="margin:0">${I.lock} Secure checkout</div></div></div>
  <div class="co">
    <div class="co-main">${upsellHTML()}<div class="co-inner">
      <div class="demo-note">⚠︎ <span><b>Prototype.</b> This checkout is visual only — nothing you type is sent or stored, and no payment is taken.</span></div>
      <div style="font-size:13px;color:var(--muted);text-align:center;margin-bottom:12px">Express checkout</div>
      <div class="exp-row"><button class="ap" onclick="place()"> Pay</button><button class="gp" onclick="place()">G Pay</button><button class="lk" onclick="place()">link</button></div>
      <div class="or">or pay another way</div>

      <h2>Contact</h2>
      <div class="field"><label>Email</label><input autocomplete="off" placeholder="you@example.com"></div>
      <label style="display:flex;gap:8px;font-size:14px;color:var(--ink-2);margin:6px 0 4px"><input type="checkbox" checked> Email me about new arrivals & offers</label>

      <h2>Delivery</h2>
      <div style="margin-bottom:22px">
        ${opt('local','Delivery — Malta & Gozo','1–2 working days',s>=FREE_SHIP?'Free':'€3.50')}
        ${opt('collect',"Click & collect — Ta' Qali Crafts Village",'Usually ready today · we\'ll email you','Free')}
        ${opt('intl','International — DHL tracked','3–6 working days, insured','€12.00')}
      </div>
      ${ship!='collect'?`
      <div class="two"><div class="field"><label>First name</label><input autocomplete="off"></div><div class="field"><label>Last name</label><input autocomplete="off"></div></div>
      <div class="field"><label>Address</label><input autocomplete="off" placeholder="Start typing your address"></div>
      <div class="three"><div class="field"><label>Town / locality</label><input autocomplete="off"></div><div class="field"><label>Postcode</label><input autocomplete="off"></div><div class="field"><label>Country</label><select><option>${ship=='intl'?'United Kingdom':'Malta'}</option><option>Malta</option><option>Italy</option><option>Germany</option><option>Australia</option></select></div></div>
      <div class="field"><label>Phone (for the courier)</label><input autocomplete="off" placeholder="+356"></div>`
      :`<div class="two"><div class="field"><label>Full name</label><input autocomplete="off"></div><div class="field"><label>Phone</label><input autocomplete="off" placeholder="+356"></div></div>`}

      <h2>Payment</h2>
      <div class="stripe-box">
        <div class="ptabs">${tab('card',I.card,'Card')}${tab('klarna',I.split,'Klarna')}${tab('revolut',I.bank,'Revolut Pay')}${tab('paypal',I.bank,'PayPal')}</div>
        ${paytab=='card'?`
        <div class="sf"><label>Card number</label><div class="inp"><input autocomplete="off" placeholder="1234 1234 1234 1234"><span class="cards-mini"><span>VISA</span><span>MC</span><span>AMEX</span></span></div></div>
        <div class="two"><div class="sf"><label>Expiry</label><div class="inp"><input autocomplete="off" placeholder="MM / YY"></div></div><div class="sf"><label>CVC</label><div class="inp"><input autocomplete="off" placeholder="CVC"></div></div></div>
        <label style="display:flex;gap:8px;font-size:13.5px;color:#30313D"><input type="checkbox" checked> Billing address same as delivery</label>`
        :`<div class="alt-pay">${paytab=='klarna'?'Pay in 3 interest-free instalments of <b>'+eur(tot/3)+'</b>. You\'ll be redirected to Klarna to complete your purchase.':paytab=='revolut'?'Pay instantly in the Revolut app — you\'ll be redirected to confirm.':'You\'ll be redirected to PayPal to complete your purchase securely.'}</div>`}
        <div class="stripe-foot" style="margin-top:16px"><span>${I.lock.replace('<svg','<svg style="width:12px;height:12px;vertical-align:-1px;stroke:currentColor;fill:none;stroke-width:2"')} Encrypted & processed securely</span><span>Powered by <b>stripe</b></span></div>
      </div>
      <button class="btn btn-accent btn-block pay-btn" onclick="place()">${I.lock.replace('<svg','<svg style="width:17px;height:17px;stroke:#fff;fill:none;stroke-width:1.8"')} Pay ${eur(tot)}</button>
      <p class="fine">By placing your order you agree to our Terms and Privacy Policy. Your card details are handled by Stripe and never touch our servers.</p>
    </div></div>
    <aside class="co-side">
      <h3 style="font-size:26px;margin-bottom:14px">Order summary</h3>
      ${cart.map(c=>{const p=P(c.id);return `<div class="sum-item"><div class="th"><img src="${img(p.img)}" alt=""><span class="q">${c.qty}</span></div><div><div class="nm">${p.name}</div><small>${p.stone}</small></div><div>${eur(p.price*c.qty)}</div></div>`}).join('')}
      ${upsellHTML()}
      <div class="disc"><input placeholder="Gift card or discount code"><button onclick="toast('Code applied (demo)')">Apply</button></div>
      <div class="row"><span>Subtotal</span><span>${eur(s)}</span></div>
      <div class="row"><span>Delivery</span><span>${sh?eur(sh):'Free'}</span></div>
      <div class="row total"><span>Total</span><span>EUR ${eur(tot)}</span></div>
      <div style="font-size:12.5px;color:var(--muted)">Including ${eur(tot-tot/1.18)} VAT</div>
      <div class="guar">
        <div>${I.lock}<span><b>Secure payments</b><br>PCI-compliant checkout by Stripe. 3-D Secure supported.</span></div>
        <div>${I.ret}<span><b>14-day returns</b><br>Changed your mind? Return or exchange, no fuss.</span></div>
        <div>${I.pin}<span><b>Real shop, real people</b><br>Questions? Call +356 7930 6090 or visit us at Ta' Qali.</span></div>
      </div>
    </aside>
  </div>`;
}
let lastOrder=null;
function vSuccess(){
  const o=lastOrder; if(!o) return vHome();
  return header()+`<div class="wrap"><div class="success">
    <div class="tick"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
    <div class="eyebrow">Order MS-${o.no}</div>
    <h1 style="font-size:52px;margin-top:10px">Thank you — it's on its way to you.</h1>
    <p style="color:var(--muted);margin-top:14px">A confirmation and receipt have been emailed to you. ${o.ship=='collect'?"We'll let you know as soon as your order is ready to collect at Ta' Qali.":"You'll get tracking details as soon as it ships."}</p>
    <div class="box">${o.items.map(c=>{const p=P(c.id);return `<div class="sum-item"><div class="th"><img src="${img(p.img)}" alt=""><span class="q">${c.qty}</span></div><div><div class="nm">${p.name}</div><small>${p.stone}</small></div><div>${eur(p.price*c.qty)}</div></div>`}).join('')}
      <div class="row total" style="border-top:1px solid var(--line);margin-top:10px"><span>Paid</span><span>${eur(o.total)}</span></div></div>
    <a class="btn btn-dark" href="#/">Continue browsing</a>
  </div></div>`+footer();
}

/* ---------- cart drawer ---------- */
function drawerHTML(){
  const s=subtotal(), left=Math.max(0,FREE_SHIP-s);
  return `<div class="dr-head"><h3>Your bag <span style="font-family:var(--sans);font-size:15px;color:var(--muted)">(${cartCount()})</span></h3><button class="icon-btn" onclick="closeCart()">${I.x}</button></div>
  <div class="ship-bar">${left>0?`You're <b>${eur(left)}</b> away from free Malta & Gozo delivery`:'✦ You\'ve unlocked <b>free delivery</b> in Malta & Gozo'}<div class="bar"><i style="width:${Math.min(100,s/FREE_SHIP*100)}%"></i></div></div>
  <div class="dr-items">${cart.length?cart.map(c=>{const p=P(c.id);return `<div class="line-item"><img src="${img(p.img)}" alt=""><div><div class="nm">${p.name}</div><small>${p.stone}</small><br><span class="mini-qty"><button onclick="qty(${p.id},-1)">−</button><span>${c.qty}</span><button onclick="qty(${p.id},1)">+</button></span><a class="rm" onclick="qty(${p.id},-999)">Remove</a></div><div style="font-weight:500">${eur(p.price*c.qty)}</div></div>`}).join(''):`<div style="text-align:center;padding:60px 0;color:var(--muted)">Your bag is empty.<br><br><a class="btn btn-light" onclick="closeCart();go('#/shop/all')">Start shopping</a></div>`}
  ${cart.length?`<label style="display:flex;gap:10px;align-items:center;font-size:14px;padding:18px 0;color:var(--ink-2)"><input type="checkbox"> Add complimentary gift wrapping</label>`:''}</div>
  ${cart.length?`<div class="dr-foot"><div class="row"><span>Subtotal</span><span>${eur(s)}</span></div><div class="row" style="color:var(--muted);font-size:13.5px"><span>Delivery</span><span>${left>0?'Calculated at checkout':'Free'}</span></div>
  <button class="btn btn-dark btn-block" style="margin-top:14px" onclick="closeCart();go('#/checkout')">Checkout · ${eur(s)}</button>
  <div class="exp-row" style="grid-template-columns:1fr 1fr;margin-top:10px"><button class="ap" onclick="closeCart();go('#/checkout')"> Pay</button><button class="gp" onclick="closeCart();go('#/checkout')">G Pay</button></div>
  <div class="secure">${I.lock} Secure checkout powered by Stripe</div></div>`:''}`;
}
function openCart(){document.getElementById('drawer').innerHTML=drawerHTML();drawer.classList.add('on');scrim.classList.add('on')}
function closeCart(){drawer.classList.remove('on');scrim.classList.remove('on')}
scrim.onclick=()=>{closeCart()};

/* ---------- search ---------- */
function openSearch(){
  const ov=document.getElementById('searchOv');ov.classList.add('on');
  ov.innerHTML=`<div class="wrap"><div style="display:flex;justify-content:space-between;align-items:center"><div class="eyebrow">Search</div><button class="icon-btn" onclick="searchOv.classList.remove('on')">${I.x}</button></div>
  <input id="q" placeholder="Amethyst, rings, singing bowl…" oninput="doSearch(this.value)">
  <div class="sugg">${['Amethyst','Rose Quartz','Selenite','Earrings','Singing bowl','Tree of Life'].map(s=>`<button class="chip" onclick="q.value='${s}';doSearch('${s}')">${s}</button>`).join('')}</div>
  <div id="sres" class="grid-p"></div></div>`;
  setTimeout(()=>q.focus(),30);
}
function doSearch(v){v=v.toLowerCase().trim();const r=v?PRODUCTS.filter(p=>(p.name+p.stone+p.sub).toLowerCase().includes(v)).slice(0,8):[];
  sres.innerHTML=r.map(cardHTML).join('').replaceAll("onclick=\"go(","onclick=\"searchOv.classList.remove('on');go(")||(v?'<p style="color:var(--muted)">No matches yet.</p>':'');}

/* ---------- actions ---------- */
function add(id,n=1,express){const c=cart.find(c=>c.id==id);c?c.qty+=n:cart.push({id,qty:n});pq=1;
  if(express){go('#/checkout');return}
  refreshBadge();openCart();}
function addCo(id){
  // re-rendering rebuilds the form, so carry over what the customer has typed
  const sel='.co-inner input,.co-inner select';
  const keep=[...document.querySelectorAll(sel)].map(e=>e.type=='checkbox'?e.checked:e.value);
  const c=cart.find(c=>c.id==id);c?c.qty++:cart.push({id,qty:1});
  render();
  document.querySelectorAll(sel).forEach((e,i)=>{if(i in keep){e.type=='checkbox'?e.checked=keep[i]:e.value=keep[i]}});
  toast('Added to your order ✦');
}
function qty(id,d){const c=cart.find(c=>c.id==id);c.qty+=d;if(c.qty<1)cart=cart.filter(x=>x!==c);document.getElementById('drawer').innerHTML=drawerHTML();refreshBadge()}
function refreshBadge(){const b=document.querySelector('.hdr-right .icon-btn:last-child');if(b)b.innerHTML=I.bag+(cartCount()?`<span class="badge">${cartCount()}</span>`:'')}
function place(){lastOrder={no:Math.floor(10000+Math.random()*89999),items:cart.map(c=>({...c})),total:subtotal()+shipCost(),ship};cart=[];go('#/success')}
function tog(k,v){filt[k].has(v)?filt[k].delete(v):filt[k].add(v);render()}
function setPrice(k){filt.price=filt.price==k?null:k;render()}
function setSub(s){filt.sub=s;render()}
function resetF(){filt.intent.clear();filt.stone.clear();filt.price=null;filt.sub=null}
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),2200)}
function go(h){location.hash=h}

/* ---------- router ---------- */
let lastRoute='';
function render(){
  const h=location.hash.slice(2)||'';const [a,b,c]=h.split('/');
  const route=a+'/'+b;
  if(route!==lastRoute&&a!=='shop'&&a!=='intent'){}
  let html;
  if(a=='shop'){if(lastRoute!==route){resetF();filt.sub=c?decodeURIComponent(c):null}html=vShop(b||'all')}
  else if(a=='intent'){if(lastRoute!==route)resetF();html=vShop(null,null,b)}
  else if(a=='p'){if(lastRoute!==route)pq=1;html=vProduct(+b)}
  else if(a=='checkout')html=vCheckout();
  else if(a=='success')html=vSuccess();
  else html=vHome();
  const changed=lastRoute!==route;lastRoute=route;
  document.getElementById('app').innerHTML=html;
  if(changed)window.scrollTo(0,0);
}
window.addEventListener('hashchange',render);
render();
