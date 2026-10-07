// Mijoz uchun sozlamalar: shu yerni o'zgartiring
var TG_USER = "registon_oshxona"; // Telegram username (@ belgisisiz)
var MENU = [
 {id:1,c:"Oshlar",n:"Samarqand oshi",d:"Guruch, mol go'shti, sabzi, no'xat, qazi.",p:48000},
 {id:2,c:"Oshlar",n:"Bayram oshi",d:"Kishmish, tuxum va qo'y go'shti bilan.",p:55000},
 {id:3,c:"Sho'rvalar",n:"Mastava",d:"Guruchli, sabzavotli quyuq sho'rva.",p:32000},
 {id:4,c:"Sho'rvalar",n:"Lag'mon",d:"Qo'lda cho'zilgan xamir, go'sht, sabzavot.",p:38000},
 {id:5,c:"Kabob va somsa",n:"Tandir somsa",d:"Qo'y go'shtli, yangi tandirdan.",p:14000},
 {id:6,c:"Kabob va somsa",n:"Shashlik (1 six)",d:"Ko'mirda pishirilgan mol go'shti.",p:22000},
 {id:7,c:"Kabob va somsa",n:"Jigar kabob",d:"Dumba yog'i bilan, piyoz va non bilan.",p:20000},
 {id:8,c:"Ichimlik va shirinlik",n:"Ko'k choy",d:"Choynakda, 2 kishilik.",p:12000},
 {id:9,c:"Ichimlik va shirinlik",n:"Chak-chak",d:"Asal bilan, uy usulida.",p:25000},
 {id:10,c:"Ichimlik va shirinlik",n:"Nok sharbati",d:"Uyda tayyorlangan, 0.5 l.",p:15000}
];
var cats = ["Hammasi"].concat(MENU.map(function(m){return m.c}).filter(function(v,i,a){return a.indexOf(v)===i}));
var cart = {}, cat = "Hammasi";
var KEY = "registon_oshxona_cart_v1";
try{
  var raw = JSON.parse(localStorage.getItem(KEY)||"{}")||{};
  MENU.forEach(function(m){
    var q = raw[m.id];
    if(typeof q==="number" && isFinite(q) && q>0 && q<100) cart[m.id]=Math.floor(q);
  });
}catch(e){ cart = {}; }
var $ = function(i){return document.getElementById(i)};
var fmt = function(n){return n.toLocaleString("ru-RU")};

function save(){ try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){} }
function totals(){
  var c=0,s=0;
  MENU.forEach(function(m){var q=cart[m.id]||0;c+=q;s+=q*m.p});
  return {c:c,s:s};
}
function renderTabs(){
  $("tabs").innerHTML = cats.map(function(c){
    return '<button class="tab" data-c="'+c+'" aria-pressed="'+(c===cat)+'">'+c+'</button>';
  }).join("");
}
function renderGrid(){
  $("grid").innerHTML = MENU.filter(function(m){return cat==="Hammasi"||m.c===cat}).map(function(m){
    var q = cart[m.id]||0;
    var ctl = q
      ? '<div class="qty"><button data-a="-" data-id="'+m.id+'" aria-label="Kamaytirish">−</button><strong>'+q+'</strong><button data-a="+" data-id="'+m.id+'" aria-label="Ko\'paytirish">+</button></div>'
      : '<button class="btn" data-a="+" data-id="'+m.id+'">Savatga qo\'shish</button>';
    return '<article class="item"><h3>'+m.n+'</h3><p>'+m.d+'</p><div class="row"><span class="price">'+fmt(m.p)+' so\'m</span>'+ctl+'</div></article>';
  }).join("");
}
function renderBar(){
  var t = totals();
  $("bar").hidden = t.c===0;
  $("cnt").textContent = t.c; $("sum").textContent = fmt(t.s);
}
function renderOrder(){
  var t = totals(), txt = "Yangi buyurtma:\n";
  $("lines").innerHTML = MENU.filter(function(m){return cart[m.id]}).map(function(m){
    txt += m.n+" × "+cart[m.id]+" = "+fmt(m.p*cart[m.id])+" so'm\n";
    return '<div class="line"><span>'+m.n+' × '+cart[m.id]+'</span><span>'+fmt(m.p*cart[m.id])+'</span></div>';
  }).join("");
  txt += "Jami: "+fmt(t.s)+" so'm\nIsm: "+($("name").value||"-")+"\nTelefon/manzil: "+($("addr").value||"-");
  $("tot").textContent = fmt(t.s)+" so'm";
  $("send").href = "https://t.me/share/url?url="+encodeURIComponent("https://t.me/"+TG_USER)+"&text="+encodeURIComponent(txt);
}
function refresh(){ renderGrid(); renderBar(); save(); if($("dlg").open) renderOrder(); }

$("tabs").addEventListener("click",function(e){
  var b=e.target.closest("[data-c]"); if(!b) return;
  cat=b.dataset.c; renderTabs(); renderGrid();
});
$("grid").addEventListener("click",function(e){
  var b=e.target.closest("[data-a]"); if(!b) return;
  var id=b.dataset.id, q=(cart[id]||0)+(b.dataset.a==="+"?1:-1);
  if(q<=0) delete cart[id]; else cart[id]=q;
  refresh();
});
$("open").onclick=function(){renderOrder();$("dlg").showModal()};
$("close").onclick=function(){$("dlg").close()};
$("name").oninput=renderOrder; $("addr").oninput=renderOrder;
renderTabs(); refresh();
