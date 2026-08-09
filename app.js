
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
