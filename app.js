const STORE="ksyusha_os_v3";
const defaultState={ach:[],permits:[],complaints:0,questions:0,favs:[],secret:0};
function loadState(){try{return {...defaultState,...JSON.parse(localStorage.getItem(STORE)||"{}")}}catch(e){return {...defaultState}}}
let state=loadState();
function save(){localStorage.setItem(STORE,JSON.stringify(state))}
function rand(a){return a[Math.floor(Math.random()*a.length)]}
function unlockAchievement(id,title,desc){
  if(state.ach.includes(id)) return;
  state.ach.push(id); save();
  const box=document.getElementById("achievement")||document.querySelector(".achievement");
  if(!box) return;
  box.querySelector(".title").textContent="Достижение: "+title;
  box.querySelector(".desc").textContent=desc;
  box.classList.add("show");
  clearTimeout(window.__ach);
  window.__ach=setTimeout(()=>box.classList.remove("show"),2800);
}
function scrollToId(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"})}

function installMobileExperience(){
  if(document.getElementById("ksyusha-mobile-style")) return;
  const style=document.createElement("style");
  style.id="ksyusha-mobile-style";
  style.textContent=`
.mobile-dock{display:none}
@media (hover:none) and (pointer:coarse){.btn:hover,.nav a:hover,.extra-link:hover{transform:none;box-shadow:4px 4px 0 rgba(31,30,26,.18)}}
@media(max-width:900px){
 html{scroll-padding-top:72px} body{padding-bottom:calc(82px + env(safe-area-inset-bottom));-webkit-text-size-adjust:100%}
 .topbar{padding-top:env(safe-area-inset-top)} .topbar-in{min-height:58px}.brand{font-size:18px}.status{font-size:11px;white-space:nowrap}.status-dot{width:8px;height:8px}
 .mobile-dock{position:fixed;left:10px;right:10px;bottom:calc(8px + env(safe-area-inset-bottom));z-index:75;display:grid;grid-template-columns:repeat(5,1fr);gap:5px;padding:6px;border:2px solid var(--line);border-radius:19px;background:rgba(255,250,241,.96);backdrop-filter:blur(14px);box-shadow:5px 5px 0 rgba(31,30,26,.16)}
 .mobile-dock a{min-width:0;min-height:52px;padding:5px 2px;border-radius:12px;text-decoration:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:9px;font-weight:900;line-height:1.05;text-align:center;color:var(--ink);touch-action:manipulation;-webkit-tap-highlight-color:transparent}
 .mobile-dock a.active,.mobile-dock a:active{background:var(--yellow)} .mobile-dock .dock-icon{font-family:Georgia,serif;font-size:20px;line-height:1}
 .card,.card.third{grid-column:span 12}.grid{gap:14px;padding-bottom:48px}.card{border-radius:18px;box-shadow:4px 4px 0 rgba(31,30,26,.13)}
 .extra-nav{grid-template-columns:1fr 1fr;gap:12px;padding-bottom:36px}.stats{grid-template-columns:1fr 1fr}.nav{display:none}.achievement{bottom:calc(78px + env(safe-area-inset-bottom))}
}
@media(max-width:600px){
 .shell{width:calc(100% - 18px)}.hero{padding:38px 0 30px}.hero h1{font-size:clamp(42px,14.5vw,62px);line-height:.92;letter-spacing:-.055em;overflow-wrap:anywhere}.hero p{font-size:17px;line-height:1.5;margin-top:20px}.eyebrow,.kicker{font-size:11px;line-height:1.35}
 .hero-actions{display:grid;grid-template-columns:1fr;gap:9px}.hero-actions .btn{width:100%;min-height:48px}
 .micro-belt{margin:2px 0 34px;grid-template-columns:1fr auto;gap:9px 10px;padding:13px;border-radius:16px;box-shadow:4px 4px 0 rgba(31,30,26,.12)}.micro-belt strong{font-size:11px}.belt-line{grid-column:1/-1}.belt-msg{font-size:12px;line-height:1.4}.micro-belt .btn{min-height:42px}
 .card{padding:17px}.card h2{font-size:clamp(29px,10vw,40px);margin-top:7px}.card p{font-size:15px;line-height:1.5}
 .permission-options,.choice-grid,.two-col{grid-template-columns:1fr}.permission-options .btn,.choice-grid .btn,.form-stack .btn{min-height:48px;width:100%}.stack{gap:8px}.stack .btn{min-height:44px}
 .output{padding:13px;min-height:54px;font-size:14px}.counter{font-size:clamp(64px,22vw,92px)}.rage{min-height:205px}#dontPress{min-width:148px;min-height:48px}
 .quote-card{min-height:190px;padding:16px}.quote-card .quote{font-size:clamp(25px,8.5vw,36px)}.dossier-item,.normal-item,.paper-note,.history-item{font-size:14px;line-height:1.45;padding:13px}
 select,textarea,input[type=text]{font-size:16px;min-height:48px}textarea{min-height:108px}input[type=range]{min-height:38px}
 .stats{gap:8px}.stat{padding:12px;min-width:0}.stat b{font-size:28px}.stat span{font-size:11px;line-height:1.25;display:block}.big-readout{font-size:62px}.compliment{font-size:clamp(28px,9vw,40px)}
 .extra-nav{grid-template-columns:1fr}.extra-link{min-height:125px;padding:15px;border-radius:16px;box-shadow:4px 4px 0 rgba(31,30,26,.12)}.extra-link b{font-size:25px}
 .page-hero{padding:38px 0 22px}.page-hero h1{font-size:clamp(42px,14vw,60px);line-height:.92;overflow-wrap:anywhere}.page-hero p{font-size:16px;line-height:1.5}
 .modal{padding:12px}.modal-box{padding:19px;border-radius:18px}.modal-box h3{font-size:38px}.modal-actions{display:grid;grid-template-columns:1fr}.modal-actions .btn{width:100%;min-height:48px}
 .achievement{left:9px;right:9px;width:auto;padding:13px;border-radius:14px}.footer{padding:18px 0 24px;font-size:10px;line-height:1.45}
}
@media(max-width:380px){.brand{font-size:16px}.status{font-size:10px}.hero h1,.page-hero h1{font-size:41px}.stat b{font-size:25px}.mobile-dock a{font-size:8px}.mobile-dock .dock-icon{font-size:18px}}
`;
  document.head.appendChild(style);
  if(!document.querySelector(".mobile-dock")){
    const dock=document.createElement("nav");
    dock.className="mobile-dock";
    dock.setAttribute("aria-label","Мобильная навигация");
    dock.innerHTML='<a href="index.html" data-page="index.html"><span class="dock-icon">⌂</span><span>Главная</span></a><a href="permissions.html" data-page="permissions.html"><span class="dock-icon">✓</span><span>Разрешения</span></a><a href="questions.html" data-page="questions.html"><span class="dock-icon">?</span><span>Вопросы</span></a><a href="dossier.html" data-page="dossier.html"><span class="dock-icon">◎</span><span>Досье</span></a><a href="compliments.html" data-page="compliments.html"><span class="dock-icon">✦</span><span>Тёплое</span></a>';
    const current=location.pathname.split("/").pop()||"index.html";
    dock.querySelectorAll("a").forEach(a=>{if(a.dataset.page===current)a.classList.add("active")});
    document.body.appendChild(dock);
  }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",installMobileExperience);else installMobileExperience();
