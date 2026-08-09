const KEY="ksyusha_os_v2";
const baseState={points:0,stamps:[],annoy:0,permission:0,questions:0,compliments:0};
function loadState(){try{return {...baseState,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(e){return {...baseState}}}
let state=loadState();
function save(){localStorage.setItem(KEY,JSON.stringify(state));updateProgress()}
function addStamp(id,title,desc,points=1){if(!state.stamps.includes(id)){state.stamps.push(id);state.points+=points;save();toast(title,desc)}}
function toast(title,desc){let t=document.querySelector(".toast");if(!t){t=document.createElement("div");t.className="toast";t.innerHTML="<b></b><span></span>";document.body.appendChild(t)}t.querySelector("b").textContent=title;t.querySelector("span").textContent=desc;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2800)}
function updateProgress(){document.querySelectorAll(".progress-fill").forEach(el=>el.style.width=Math.min(100,state.stamps.length/8*100)+"%");document.querySelectorAll("[data-stamp-count]").forEach(el=>el.textContent=state.stamps.length);document.querySelectorAll("[data-point-count]").forEach(el=>el.textContent=state.points)}
function rand(arr){return arr[Math.floor(Math.random()*arr.length)]}
document.addEventListener("DOMContentLoaded",()=>{updateProgress();document.querySelectorAll("[data-page-stamp]").forEach(el=>{const [id,title,desc]=el.dataset.pageStamp.split("|");setTimeout(()=>addStamp(id,title,desc,1),450)})});
