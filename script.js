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
  document.getElementById("copyBtn").disabled = count===0;
  document.getElementById("imageShareBtn").disabled = count===0;

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

  const cdSummary=document.getElementById("cdSummary");
  const dvdSummary=document.getElementById("dvdSummary");

  if(count>0){
    cdSummary.innerHTML=`
      <ol class="cd-track-list">
        <li>Touch</li>
        <li>So Strawberry</li>
        <li>Round 12</li>
      </ol>`;

    const dvdProducts=selected.filter(p=>Array.isArray(p.dvd) && p.dvd.length);
    if(dvdProducts.length){
      dvdSummary.innerHTML=dvdProducts.map(p=>`
        <div class="dvd-summary-edition">
          <div class="dvd-summary-edition-head">
            <strong>${p[lang].name}</strong>
            <span>× ${state.qty[p.id]}</span>
          </div>
          <ul class="dvd-summary-list">
            ${p.dvd.map(item=>`<li>${item}</li>`).join("")}
          </ul>
        </div>
      `).join("");
    }else{
      dvdSummary.innerHTML=`<p class="muted">${lang==="ja"?"選択した商品にDVDは含まれていません。":"No DVD is included with your selected edition(s)."}</p>`;
    }
  }else{
    cdSummary.innerHTML=`<p class="muted">${lang==="ja"?"商品を選ぶと表示されます。":"Select an edition to view the CD contents."}</p>`;
    dvdSummary.innerHTML=`<p class="muted">${lang==="ja"?"DVD付きの商品を選ぶと表示されます。":"Select an edition with a DVD to view its contents."}</p>`;
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


function buildPlanData(){
  const {count,total}=getTotals();
  const selected=products.filter(p=>state.qty[p.id]>0).map(p=>({
    name:p[lang].name,
    qty:state.qty[p.id],
    subtotal:state.qty[p.id]*p.price,
    id:p.id,
    dvd:p.dvd ? [...p.dvd] : []
  }));

  const bonusLines=[];
  if(count>0){
    bonusLines.push({
      name:lang==="ja"?"初回プレス封入「応募抽選券」":"First-press serial lottery ticket",
      value:(lang==="ja"?"最大 ":"Up to ")+count+(lang==="ja"?"枚":"")
    });
    bonusLines.push({
      name:lang==="ja"?"ICカードステッカー":"IC card sticker",
      value:(lang==="ja"?"最大 ":"Up to ")+count+(lang==="ja"?"枚":"")
    });
  }
  if(state.qty.limited){
    bonusLines.push({name:lang==="ja"?"ソロフォトカード8種セットA":"Solo Photo Cards – Set A",value:"× "+state.qty.limited});
    bonusLines.push({name:lang==="ja"?"ネームシールセット":"Name Sticker Set",value:"× "+state.qty.limited});
  }
  if(state.qty.regular) bonusLines.push({name:lang==="ja"?"集合フォトカードA":"Group Photo Card A",value:"× "+state.qty.regular});
  if(state.qty.universal) bonusLines.push({name:lang==="ja"?"ソロフォトカード8種セットB":"Solo Photo Cards – Set B",value:"× "+state.qty.universal});
  if(state.qty.muzeum){
    bonusLines.push({name:lang==="ja"?"ソロジャケット8種 EPサイズセット":"8 Solo EP-size Jackets Set",value:"× "+state.qty.muzeum});
    bonusLines.push({name:"40P Photobook",value:"× "+state.qty.muzeum});
    const chosen=state.keyholders.filter(Boolean);
    bonusLines.push({
      name:lang==="ja"?"アクリルキーホルダー":"Acrylic Key Holder",
      value:chosen.length ? chosen.join(" / ") : (lang==="ja"?"メンバー未選択":"Member not selected")
    });
  }
  return {count,total,selected,bonusLines};
}

function buildShareText(){
  const d=buildPlanData();
  const lines=[lang==="ja"?"MAZZEL “Touch” 購入予定":"MAZZEL “Touch” Purchase Plan",""];
  d.selected.forEach(x=>lines.push(`${x.name} ×${x.qty}　${yen(x.subtotal)}`));
  lines.push("",`${lang==="ja"?"合計":"Total"}：${d.count}${lang==="ja"?"枚":" items"} / ${yen(d.total)}`);

  lines.push("",lang==="ja"?"▼ CD収録内容":"▼ CD Contents");
  ["Touch","So Strawberry","Round 12"].forEach((track,i)=>lines.push(`${i+1}. ${track}`));

  const dvdSelected=d.selected.filter(x=>x.dvd && x.dvd.length);
  if(dvdSelected.length){
    lines.push("",lang==="ja"?"▼ DVD収録内容":"▼ DVD Contents");
    dvdSelected.forEach(item=>{
      lines.push(`[${item.name} ×${item.qty}]`);
      item.dvd.forEach(x=>lines.push(`・${x}`));
    });
  }

  if(d.bonusLines.length){
    lines.push("",lang==="ja"?"▼ 付いてくる特典":"▼ Bonuses");
    d.bonusLines.forEach(x=>lines.push(`・${x.name} ${x.value}`));
  }
  lines.push("",location.href);
  return lines.join("\n");
}

function toast(message){
  const el=document.getElementById("toast");
  el.textContent=message;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t=setTimeout(()=>el.classList.remove("show"),1800);
}

function wrapCanvasText(ctx,text,maxWidth){
  const words = lang==="ja" ? [...text] : String(text).split(" ");
  const lines=[];
  let line="";
  for(const w of words){
    const trial=lang==="ja" ? line+w : (line ? line+" "+w : w);
    if(ctx.measureText(trial).width>maxWidth && line){
      lines.push(line);
      line=w;
    }else line=trial;
  }
  if(line) lines.push(line);
  return lines;
}

function roundRect(ctx,x,y,w,h,r,fill){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
  ctx.fillStyle=fill;
  ctx.fill();
}

async function createPlanImageFile(){
  const d=buildPlanData();
  const W=1080;
  const PAD=58;
  const INNER=W-PAD*2;

  // A temporary canvas is used only to measure wrapped text.
  const measureCanvas=document.createElement("canvas");
  const mctx=measureCanvas.getContext("2d");

  const fontStack='-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Yu Gothic", sans-serif';

  function setFont(ctx,weight,size){
    ctx.font=`${weight} ${size}px ${fontStack}`;
  }

  function wrapWith(ctx,text,maxWidth){
    const source=String(text);
    const tokens = lang==="ja" ? [...source] : source.split(/\s+/);
    const lines=[];
    let line="";
    for(const token of tokens){
      const trial = lang==="ja"
        ? line+token
        : (line ? `${line} ${token}` : token);
      if(line && ctx.measureText(trial).width > maxWidth){
        lines.push(line);
        line=token;
      }else{
        line=trial;
      }
    }
    if(line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function textHeight(ctx,text,maxWidth,lineHeight){
    return wrapWith(ctx,text,maxWidth).length * lineHeight;
  }

  // ---------- measure total height ----------
  let H=0;
  H += 185; // header
  H += 36;  // gap
  H += 176; // total card
  H += 48;

  // Selected products
  setFont(mctx,800,25);
  let selectedBody=0;
  d.selected.forEach(item=>{
    selectedBody += Math.max(
      textHeight(mctx,item.name,590,34),
      34
    ) + 22;
  });
  H += 50 + selectedBody + 38;

  // CD section
  H += 50 + 3*36 + 38;

  // DVD sections only for selected editions that include DVD
  const dvdSelected=d.selected.filter(x=>x.dvd && x.dvd.length);
  if(dvdSelected.length){
    H += 50;
    for(const item of dvdSelected){
      setFont(mctx,850,25);
      H += textHeight(mctx,item.name,INNER-64,34) + 14;
      setFont(mctx,600,22);
      for(const line of item.dvd){
        H += textHeight(mctx,"• "+line,INNER-88,30) + 8;
      }
      H += 22;
    }
    H += 18;
  }

  // Bonuses
  H += 58;
  setFont(mctx,650,22);
  for(const b of d.bonusLines){
    const leftH=textHeight(mctx,"• "+b.name,620,30);
    const rightH=textHeight(mctx,b.value,240,30);
    H += Math.max(leftH,rightH)+14;
  }
  H += 72;

  H=Math.max(1350,Math.ceil(H));

  const canvas=document.createElement("canvas");
  canvas.width=W;
  canvas.height=H;
  const ctx=canvas.getContext("2d");

  function drawWrapped(text,x,y,maxWidth,lineHeight,opts={}){
    const {
      size=24, weight=600, color="#111522", align="left"
    }=opts;
    setFont(ctx,weight,size);
    ctx.fillStyle=color;
    ctx.textAlign=align;
    const lines=wrapWith(ctx,text,maxWidth);
    lines.forEach((line,i)=>ctx.fillText(line,x,y+i*lineHeight));
    ctx.textAlign="left";
    return lines.length*lineHeight;
  }

  function sectionTitle(label,y,color="#111522"){
    setFont(ctx,900,29);
    ctx.fillStyle=color;
    ctx.fillText(label,PAD,y);
    return y+44;
  }

  function divider(y){
    ctx.fillStyle="#e2e4e8";
    ctx.fillRect(PAD,y,INNER,2);
  }

  // Background
  ctx.fillStyle="#f4f4f2";
  ctx.fillRect(0,0,W,H);

  // Header
  ctx.fillStyle="#0d1730";
  ctx.fillRect(0,0,W,185);
  ctx.fillStyle="#ffffff";
  setFont(ctx,700,32);
  ctx.fillText("MAZZEL 5th Single",PAD,64);
  setFont(ctx,900,70);
  ctx.fillText("Touch",PAD,142);

  let y=221;

  // Total card
  roundRect(ctx,PAD,y,INNER,176,26,"#ffffff");
  ctx.fillStyle="#6a7080";
  setFont(ctx,750,22);
  ctx.fillText(lang==="ja"?"購入合計":"PURCHASE TOTAL",PAD+32,y+46);

  ctx.fillStyle="#111522";
  setFont(ctx,900,62);
  ctx.fillText(yen(d.total),PAD+32,y+116);

  ctx.textAlign="right";
  setFont(ctx,800,29);
  ctx.fillText(`${d.count}${lang==="ja"?"枚":" items"}`,W-PAD-30,y+110);
  ctx.textAlign="left";
  y += 224;

  // Selected products
  y=sectionTitle(lang==="ja"?"選んだ商品":"SELECTED EDITIONS",y);
  setFont(ctx,700,25);
  for(const item of d.selected){
    const top=y;
    const nameH=drawWrapped(item.name,PAD+18,y,590,34,{size:25,weight:750});
    ctx.textAlign="right";
    ctx.fillStyle="#111522";
    setFont(ctx,800,24);
    ctx.fillText(`×${item.qty}   ${yen(item.subtotal)}`,W-PAD-18,top);
    ctx.textAlign="left";
    y += Math.max(nameH,34)+20;
  }
  divider(y);
  y += 38;

  // CD contents
  y=sectionTitle(lang==="ja"?"CD収録内容（全形態共通）":"CD CONTENTS — ALL VERSIONS",y);
  setFont(ctx,650,24);
  ["Touch","So Strawberry","Round 12"].forEach((track,i)=>{
    ctx.fillStyle="#111522";
    ctx.fillText(`${i+1}. ${track}`,PAD+20,y);
    y += 36;
  });
  divider(y);
  y += 38;

  // DVD contents
  if(dvdSelected.length){
    y=sectionTitle(lang==="ja"?"購入したDVDの収録内容":"DVD CONTENTS INCLUDED IN YOUR SELECTION",y);

    for(const item of dvdSelected){
      roundRect(ctx,PAD,y-26,INNER,1,0,"#e2e4e8");
      y += 8;

      const nameH=drawWrapped(
        item.name,
        PAD+14,y,INNER-28,34,
        {size:25,weight:850,color:"#111522"}
      );
      y += nameH + 7;

      for(const dvd of item.dvd){
        const h=drawWrapped(
          "• "+dvd,
          PAD+28,y,INNER-56,30,
          {size:22,weight:600,color:"#343947"}
        );
        y += h + 8;
      }
      y += 18;
    }

    divider(y);
    y += 38;
  }

  // Bonus panel
  const bonusStart=y;
  let bonusInnerHeight=68;
  setFont(mctx,650,22);
  for(const b of d.bonusLines){
    const lh=textHeight(mctx,"• "+b.name,620,30);
    const rh=textHeight(mctx,b.value,240,30);
    bonusInnerHeight += Math.max(lh,rh)+14;
  }
  bonusInnerHeight += 30;

  roundRect(ctx,PAD,bonusStart,INNER,bonusInnerHeight,26,"#0d1730");
  ctx.fillStyle="#ffffff";
  setFont(ctx,900,29);
  ctx.fillText(lang==="ja"?"あなたに付いてくる特典":"YOUR BONUSES",PAD+30,bonusStart+50);

  let by=bonusStart+98;
  for(const b of d.bonusLines){
    const leftH=drawWrapped(
      "• "+b.name,
      PAD+38,by,620,30,
      {size:22,weight:650,color:"#ffffff"}
    );

    const valueLines=wrapWith(ctx,b.value,240);
    ctx.textAlign="right";
    ctx.fillStyle="#cfd8eb";
    setFont(ctx,700,22);
    valueLines.forEach((line,i)=>ctx.fillText(line,W-PAD-32,by+i*30));
    ctx.textAlign="left";

    by += Math.max(leftH,valueLines.length*30)+14;
  }

  return await new Promise((resolve,reject)=>{
    canvas.toBlob(blob=>{
      if(!blob) return reject(new Error("PNG creation failed"));
      resolve(new File([blob],"MAZZEL_Touch_purchase_plan.png",{type:"image/png"}));
    },"image/png");
  });
}

document.getElementById("copyBtn").addEventListener("click",async()=>{
  const text=buildShareText();
  try{
    await navigator.clipboard.writeText(text);
    toast(lang==="ja"?"文字をコピーしました！":"Text copied!");
  }catch(e){
    const ta=document.createElement("textarea");
    ta.value=text; ta.style.position="fixed"; ta.style.opacity="0";
    document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove();
    toast(lang==="ja"?"文字をコピーしました！":"Text copied!");
  }
});


document.getElementById("imageShareBtn").addEventListener("click",async()=>{
  try{
    const file=await createPlanImageFile();
    if(navigator.share && navigator.canShare && navigator.canShare({files:[file]})){
      await navigator.share({
        title:"MAZZEL Touch Purchase Plan",
        files:[file]
      });
    }else{
      const url=URL.createObjectURL(file);
      const a=document.createElement("a");
      a.href=url;
      a.download=file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),3000);
      toast(lang==="ja"?"PNGを作成しました":"PNG created");
    }
  }catch(e){
    if(e && e.name==="AbortError") return;
    toast(lang==="ja"?"画像を作成できませんでした":"Could not create image");
  }
});

applyLang(lang);