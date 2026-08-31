const MEMBERS = ["KAIRYU","NAOYA","RAN","SEITO","RYUKI","TAKUTO","HAYATO","EIKI"];

const products = [
  {
    id:"limited", color:"red", price:3850,
    ja:{name:"初回限定盤", kicker:"LIMITED EDITION", purchase:"全国の取扱店舗・ECサイト", bonus:"ソロフォトカード8種セットA", goods:"ネームシールセット（MAZZEL ver.＋メンバー名 ver.）"},
    en:{name:"LIMITED EDITION", kicker:"初回限定盤", purchase:"Participating stores and online shops", bonus:"Solo Photo Cards – 8-card Set A", goods:"Name Sticker Set (MAZZEL ver. + Member Name ver.)"},
    badges:["CD","DVD","GOODS"],
    dvd:[
      "Get Up And Dance -Music Video-",
      "Get Up And Dance -Music Video Behind The Scenes-",
      "So Strawberry -Music Video-",
      "So Strawberry -Dance Performance Video-",
      "So Strawberry -Music Video Behind The Scenes-",
      "So Strawberry -Photo Shooting Behind The Scenes-",
      "Touch -Photo Shooting Behind The Scenes-"
    ]
  },
  {
    id:"regular", color:"orange", price:1815,
    ja:{name:"通常盤・初回プレス", kicker:"REGULAR EDITION", purchase:"全国の取扱店舗・ECサイト", bonus:"集合フォトカードA", goods:"なし"},
    en:{name:"REGULAR EDITION / FIRST PRESS", kicker:"通常盤", purchase:"Participating stores and online shops", bonus:"Group Photo Card A", goods:"None"},
    badges:["CD"]
  },
  {
    id:"universal", color:"blue", price:5390,
    ja:{name:"UNIVERSAL MUSIC STORE盤", kicker:"STORE EXCLUSIVE", purchase:"UNIVERSAL MUSIC STORE限定販売", bonus:"ソロフォトカード8種セットB", goods:"なし"},
    en:{name:"UNIVERSAL MUSIC STORE EDITION", kicker:"STORE EXCLUSIVE", purchase:"Exclusive to UNIVERSAL MUSIC STORE", bonus:"Solo Photo Cards – 8-card Set B", goods:"None"},
    badges:["CD","DVD"],
    dvd:["平安神宮御鎮座百三十年記念 MAZZEL 奉納 Special Live (2026.03.21 @平安神宮)"]
  },
  {
    id:"muzeum", color:"green", price:5390,
    ja:{name:"MUZEUM盤（FC会員限定）", kicker:"FC LIMITED", purchase:"FC内の専用リンクから購入", bonus:"ソロジャケット8種 EPサイズセット", goods:"40P Photobook＋アクリルキーホルダー（メンバー選択可）"},
    en:{name:"MUZEUM EDITION (FC MEMBERS ONLY)", kicker:"FC LIMITED", purchase:"Purchase via the dedicated link inside the FC", bonus:"8 Solo EP-size Jackets Set", goods:"40P Photobook + Acrylic Key Holder (member selectable)"},
    badges:["CD","DVD","40P Photobook","GOODS"],
    dvd:["Only You Mini Live (2026.02.10 @EX THEATER ROPPONGI)"]
  }
];

let lang = localStorage.getItem("touchCalcLang") || "ja";
const state = {qty:{limited:0,regular:0,universal:0,muzeum:0}, keyholders:[]};

function yen(n){ return "¥"+n.toLocaleString("ja-JP"); }

function productCard(p){
  const t=p[lang];
  const q=state.qty[p.id];
  const infoLabel = lang==="ja" ? {bonus:"封入特典",goods:"GOODS",purchase:"購入先"} : {bonus:"Bonus",goods:"GOODS",purchase:"Where to buy"};
  return `
    <article class="product-card" data-color="${p.color}">
      <p class="product-kicker">${t.kicker}</p>
      <h3 class="product-name">${t.name}</h3>
      <p class="product-price">${yen(p.price)}</p>
      <div class="badges">${p.badges.map(x=>`<span class="badge">${x}</span>`).join("")}</div>

      <div class="card-info">
        <div class="info-line"><span class="label">${infoLabel.bonus}</span><span class="value">${t.bonus}</span></div>
        <div class="info-line"><span class="label">${infoLabel.goods}</span><span class="value">${t.goods}</span></div>
        <div class="info-line"><span class="label">${infoLabel.purchase}</span><span class="value">${t.purchase}</span></div>
        ${p.dvd ? `<details class="dvd-details"><summary>${lang==="ja"?"DVD収録内容を見る":"View DVD contents"}</summary><ul class="dvd-list">${p.dvd.map(x=>`<li>${x}</li>`).join("")}</ul></details>` : ""}
      </div>

      <div class="qty-row">
        <span class="qty-label">${lang==="ja"?"購入枚数":"Quantity"}</span>
        <div class="stepper">
          <button type="button" class="step-btn" data-step="${p.id}" data-delta="-1" aria-label="minus">−</button>
          <span class="qty">${q}</span>
          <button type="button" class="step-btn" data-step="${p.id}" data-delta="1" aria-label="plus">＋</button>
        </div>
      </div>
      ${p.id==="muzeum" && q>0 ? renderKeyholderSelects() : ""}
    </article>`;
}

function renderKeyholderSelects(){
  let rows="";
  for(let i=0;i<state.qty.muzeum;i++){
    const val=state.keyholders[i] || "";
    rows += `
      <div class="key-select-row">
        <span>#${i+1}</span>
        <select data-key-index="${i}">
          <option value="">${lang==="ja"?"メンバーを選択":"Select member"}</option>
          ${MEMBERS.map(m=>`<option value="${m}" ${m===val?"selected":""}>${m}</option>`).join("")}
        </select>
      </div>`;
  }
  return `<div class="keyholder-area"><h4>${lang==="ja"?"アクリルキーホルダーを選ぶ":"Choose acrylic key holder"}</h4><p class="keyholder-help">${lang==="ja"?"MUZEUM盤1枚につき1人選択できます。":"Choose one member for each MUZEUM Edition."}</p>${rows}</div>`;
}

function renderProducts(){
  document.getElementById("productGrid").innerHTML=products.map(productCard).join("");
  document.querySelectorAll("[data-step]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const id=btn.dataset.step, delta=Number(btn.dataset.delta);
      state.qty[id]=Math.max(0,state.qty[id]+delta);
      if(id==="muzeum"){
        if(state.keyholders.length>state.qty.muzeum) state.keyholders.length=state.qty.muzeum;
        while(state.keyholders.length<state.qty.muzeum) state.keyholders.push("");
      }
      renderAll();
    });
  });
  document.querySelectorAll("[data-key-index]").forEach(sel=>{
    sel.addEventListener("change",()=>{
      state.keyholders[Number(sel.dataset.keyIndex)]=sel.value;
      renderSummary();
    });
  });
}

function getTotals(){
  let count=0,total=0;
  products.forEach(p=>{count+=state.qty[p.id]; total += state.qty[p.id]*p.price;});
  return {count,total};
}

function renderSummary(){
  const {count,total}=getTotals();
  document.getElementById("totalItems").innerHTML=`${count} <small>${lang==="ja"?"枚":"items"}</small>`;
  document.getElementById("totalPrice").textContent=yen(total);
  document.getElementById("stickyItems").innerHTML=`${count} <small>${lang==="ja"?"枚":"items"}</small>`;
  document.getElementById("stickyPrice").textContent=yen(total);
  document.getElementById("shareBtn").disabled = count===0;

  const selected = products.filter(p=>state.qty[p.id]>0);
  const list=document.getElementById("selectedList");
  if(!selected.length){
    list.className="selected-list empty";
    list.innerHTML=`<p>${lang==="ja"?"まだ商品が選択されていません。上のカードの＋を押してみてね。":"No items selected yet. Tap + on an edition card above."}</p>`;
  }else{
    list.className="selected-list";
    list.innerHTML=selected.map(p=>{
      let sub="";
      if(p.id==="muzeum"){
        const chosen=state.keyholders.filter(Boolean);
        if(chosen.length) sub=`<div class="selected-sub">${lang==="ja"?"アクキー":"Key holders"}：${chosen.join(" / ")}</div>`;
      }
      return `<div class="selected-row"><div>${p[lang].name}${sub}</div><span>× ${state.qty[p.id]}　${yen(state.qty[p.id]*p.price)}</span></div>`;
    }).join("");
  }

  const bonuses=[];
  if(count>0){
    bonuses.push([lang==="ja"?"初回プレス封入『応募抽選券』":"First-press serial lottery ticket", `${lang==="ja"?"最大 ":"Up to "}${count}${lang==="ja"?"枚 ※初回生産分":" ※first-press copies only"}`]);
    bonuses.push([lang==="ja"?"ICカードステッカー":"IC card sticker", `${lang==="ja"?"最大 ":"Up to "}${count}${lang==="ja"?"枚 ※対象店舗・在庫状況による":" ※subject to store eligibility / availability"}`]);
  }
  if(state.qty.limited){
    bonuses.push([lang==="ja"?"ソロフォトカード8種セットA":"Solo Photo Cards – Set A",`× ${state.qty.limited}`]);
    bonuses.push([lang==="ja"?"ネームシールセット（MAZZEL ver.＋メンバー名 ver.）":"Name Sticker Set (MAZZEL ver. + Member Name ver.)",`× ${state.qty.limited}`]);
  }
  if(state.qty.regular) bonuses.push([lang==="ja"?"集合フォトカードA":"Group Photo Card A",`× ${state.qty.regular}`]);
  if(state.qty.universal) bonuses.push([lang==="ja"?"ソロフォトカード8種セットB":"Solo Photo Cards – Set B",`× ${state.qty.universal}`]);
  if(state.qty.muzeum){
    bonuses.push([lang==="ja"?"ソロジャケット8種 EPサイズセット":"8 Solo EP-size Jackets Set",`× ${state.qty.muzeum}`]);
    bonuses.push(["40P Photobook",`× ${state.qty.muzeum}`]);
    const counts={};
    state.keyholders.filter(Boolean).forEach(m=>counts[m]=(counts[m]||0)+1);
    if(Object.keys(counts).length){
      bonuses.push([lang==="ja"?"アクリルキーホルダー":"Acrylic Key Holder", Object.entries(counts).map(([m,n])=>`${m} ×${n}`).join(" / ")]);
    }else{
      bonuses.push([lang==="ja"?"アクリルキーホルダー":"Acrylic Key Holder", `${state.qty.muzeum}${lang==="ja"?"個（メンバー未選択）":" (member not selected)"}`]);
    }
  }

  const bonus=document.getElementById("bonusList");
  bonus.innerHTML=bonuses.length
    ? bonuses.map(([a,b])=>`<div class="bonus-item"><span>${a}</span><strong>${b}</strong></div>`).join("")
    : `<p class="muted">${lang==="ja"?"商品を選ぶと、対象の特典がここに表示されます。":"Select editions to see all applicable bonuses here."}</p>`;

  const early=document.getElementById("earlyEstimate");
  if(count>0){
    early.textContent = lang==="ja"
      ? `対象ページから受付期間内に購入した場合、選択中の ${count}枚 ＝ 最大${count}口のプレミアムイベント抽選に自動エントリー。`
      : `If purchased through the eligible page during the entry period, your ${count} selected CD${count===1?"":"s"} = up to ${count} automatic premium-event lottery entr${count===1?"y":"ies"}.`;
  }else{
    early.textContent = lang==="ja"
      ? "対象ページから受付期間内に購入した場合、CD1枚につき1回プレミアムイベント抽選に自動エントリーされます。"
      : "If purchased from the eligible page during the entry period, each CD gives one automatic entry to the premium-event lottery.";
  }
}

function applyLang(next){
  lang=next;
  localStorage.setItem("touchCalcLang",lang);
  document.documentElement.lang=lang;
  document.querySelectorAll("[data-ja][data-en]").forEach(el=>el.textContent=el.dataset[lang]);
  document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
  renderAll();
}

function renderAll(){ renderProducts(); renderSummary(); }

document.querySelectorAll(".lang-btn").forEach(b=>b.addEventListener("click",()=>applyLang(b.dataset.lang)));

document.getElementById("shareBtn").addEventListener("click",async()=>{
  const {count,total}=getTotals();
  if(!count) return;
  const lines=products.filter(p=>state.qty[p.id]>0).map(p=>`${p[lang].name} ×${state.qty[p.id]}`);
  if(state.qty.muzeum){
    const k=state.keyholders.filter(Boolean);
    if(k.length) lines.push(`${lang==="ja"?"アクキー":"Key holders"}: ${k.join(", ")}`);
  }
  lines.push(`${lang==="ja"?"合計":"Total"}: ${count}${lang==="ja"?"枚":" items"} / ${yen(total)}`);
  const text=lines.join("\n");
  try{
    if(navigator.share) await navigator.share({title:"MAZZEL Touch Purchase Plan",text});
    else if(navigator.clipboard){ await navigator.clipboard.writeText(text); alert(lang==="ja"?"購入予定をコピーしました！":"Purchase plan copied!"); }
    else alert(text);
  }catch(e){}
});

applyLang(lang);
