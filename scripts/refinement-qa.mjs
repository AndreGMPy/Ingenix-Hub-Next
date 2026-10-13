import {chromium} from "@playwright/test";
import {readFile,writeFile,mkdir} from "node:fs/promises";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url),origin=process.env.QA_ORIGIN||"http://127.0.0.1:4173",mode=origin.endsWith("4174")?"prod":"dev";
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]}),report={mode,checks:[],errors:[],assets:[],warnings:[]};
const axe=await readFile(require.resolve("axe-core/axe.min.js"),"utf8");
function assert(v,m){if(!v)throw Error(m);}
const filter=process.env.REFINEMENT_QA_FILTER?new RegExp(process.env.REFINEMENT_QA_FILTER):null;
async function check(name,fn){if(filter&&!filter.test(name))return;try{const details=await fn();report.checks.push({name,status:"PASS",details});console.log("PASS "+name);}catch(e){report.checks.push({name,status:"FAIL",error:e.message});console.log("FAIL "+name+": "+e.message);}}
async function make(w=1366,h=768,options={}){const context=await browser.newContext({viewport:{width:w,height:h},isMobile:w<768,hasTouch:w<768,...options}),page=await context.newPage();await page.bringToFront();page.on("pageerror",e=>report.errors.push(e.message));page.on("console",m=>{if(m.type()==="error"&&!m.text().includes("503"))report.errors.push(m.text());if(m.type()==="warning")report.warnings.push(m.text());});page.on("response",r=>{if(r.status()>=400&&!/api\/chat|\/qa/.test(r.url()))report.assets.push(r.status()+" "+r.url());});return {context,page};}
async function go(page,path=""){await page.goto(origin+path,{waitUntil:"networkidle",timeout:90000});await page.waitForTimeout(1600);}
async function top(page,id){await page.locator(id).evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")),behavior:"instant"}));await page.waitForTimeout(250);}
async function count(page){return page.locator(".portfolio-count strong").innerText();}
async function overflow(page){return page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth);}
async function motion(page){return page.locator(".canvas-layer canvas").evaluate(e=>e.ingenixMotion);}
try{
 for(const [w,h]of [[390,844],[430,932],[1366,768],[1440,900],[1920,1080]]){
  await check(w+"x"+h+" / logo / Hero / coverflow fit / themes",async()=>{
   const {context,page}=await make(w,h);await go(page);await page.locator("[data-webgl=ready]").waitFor({timeout:45000});
   const logo=await page.locator(".brand-logo").evaluate(e=>{const r=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect(),s=getComputedStyle(e);return {loaded:e.complete&&e.naturalWidth>0,ratio:r.width/r.height,fit:s.objectFit,inside:r.left>=p.left-1&&r.right<=p.right+1&&r.top>=p.top-1&&r.bottom<=p.bottom+1};});
   assert(logo.loaded&&logo.inside&&logo.fit==="contain"&&Math.abs(logo.ratio-1254/357)<.05,JSON.stringify(logo));
   const hero=await page.evaluate(()=>({cta:document.querySelector(".hero-actions .button").getBoundingClientRect().bottom,visual:document.querySelector(".ecosystem-viewport").getBoundingClientRect().bottom}));
   if(w>=1366)assert(hero.cta<h&&hero.visual<h+12,"hero clipped "+JSON.stringify(hero));
   await top(page,"#proyectos");
   const fit=await page.locator('.coverflow-slide[data-active=true]').evaluate(e=>{const r=e.getBoundingClientRect(),img=e.querySelector(".case-screenshot").getBoundingClientRect(),caption=e.querySelector(".case-caption").getBoundingClientRect();return {top:r.top,bottom:r.bottom,imageBottom:img.bottom,captionBottom:caption.bottom,width:r.width,viewport:innerHeight};});
   if(w>=1366)assert(fit.imageBottom<h&&fit.captionBottom<h,"project cropped "+JSON.stringify(fit));
   for(let i=0;i<5;i++){await page.locator(".portfolio-pagination button").nth(i).click();await page.waitForTimeout(650);assert(await count(page)===String(i+1).padStart(2,"0"),"selection "+i);await page.waitForFunction(i=>{const image=document.querySelectorAll(".case-screenshot")[i];return image.complete&&image.naturalWidth>0;},i,{timeout:20000});}
   for(const name of ["Activar modo oscuro","Activar modo claro"]){await page.getByRole("button",{name}).click();await page.waitForTimeout(350);assert(await overflow(page)<=1,"overflow");}
   if(w===390||w===1366){await page.addScriptTag({content:axe});const violations=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});assert(!violations.length,JSON.stringify(violations));}
   await context.close();return {logo,hero,fit,overflow:0};
  });
 }
 await check("coverflow keyboard / circular loop / neighbor / drag / rapid reversal",async()=>{
  const {context,page}=await make();await go(page);await top(page,"#proyectos");const track=page.locator(".portfolio-track");await track.focus();await page.keyboard.press("End");assert(await count(page)==="05","End");await page.keyboard.press("ArrowRight");assert(await count(page)==="01","5 to 1");await page.keyboard.press("ArrowLeft");assert(await count(page)==="05","1 to 5");await page.keyboard.press("Home");
  await page.getByRole("button",{name:"Activar Gama Studio MX",exact:true}).click();await page.waitForTimeout(600);assert(await count(page)==="02","neighbor");
  await track.focus();await page.keyboard.press("Home");const r=await page.locator('.coverflow-slide[data-active=true] .case-media-link').boundingBox();
  await page.mouse.move(r.x+r.width*.6,r.y+65);await page.mouse.down();await page.mouse.move(r.x+r.width*.6-200,r.y+65,{steps:12});await page.mouse.up();await page.waitForTimeout(700);assert(await count(page)==="02","drag");
  await page.getByRole("button",{name:"Proyecto siguiente"}).click();await page.getByRole("button",{name:"Proyecto anterior"}).click();await page.waitForTimeout(600);assert(await count(page)==="02","rapid reverse");assert(await overflow(page)<=1,"drag overflow");await context.close();
 });
 for(const w of [390,430])await check("mobile "+w+" ambient / scroll / pause / reduced / touch",async()=>{
  const {context,page}=await make(w,w===390?844:932);await go(page);await page.locator("[data-webgl=ready]").waitFor({timeout:45000});
  const first=await motion(page);await page.waitForTimeout(900);const later=await motion(page);assert(later.mode==="ambient"&&later.elapsed>first.elapsed&&later.rotation!==first.rotation,"no automatic motion "+JSON.stringify({first,later}));
  const before=await motion(page);await page.evaluate(()=>scrollTo({top:200,behavior:"instant"}));await page.waitForTimeout(650);const after=await motion(page);assert(after.progress>before.progress,"no scroll response");
  assert(await page.locator(".canvas-layer canvas").evaluate(e=>getComputedStyle(e).pointerEvents==="none"),"canvas touch captures");
  await top(page,"#proyectos");await page.waitForTimeout(350);const paused=await motion(page);await page.waitForTimeout(700);const pausedAfter=await motion(page);assert(paused.mode==="paused"&&pausedAfter.elapsed===paused.elapsed,"offscreen loop");
  await page.locator(".portfolio-pagination button").first().click();await page.waitForTimeout(500);
  const box=await page.locator(".portfolio-track").boundingBox(),y=Math.min(550,Math.max(220,box.y+80)),cdp=await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:w-45,y}]});for(let i=1;i<=8;i++){await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:w-45-i*30,y}]});await page.waitForTimeout(25);}await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});await page.waitForTimeout(600);assert(await count(page)==="02","mobile swipe");
  await top(page,"#inicio");await page.emulateMedia({reducedMotion:"reduce"});await page.waitForTimeout(400);const reduced=await motion(page);await page.waitForTimeout(700);assert(reduced.mode==="reduced"&&(await motion(page)).elapsed===reduced.elapsed,"reduced loop");
  assert(await overflow(page)<=1,"mobile overflow");await context.close();return {ambient:true,scroll:true,noTouch:true,pauses:true,reduced:true};
 });
 await check("fallback / intro / portfolio route",async()=>{
  const {context,page}=await make();await go(page,"?webgl=off");assert(await page.locator(".brand-intro").isHidden(),"intro stuck");assert(await page.locator("[data-webgl=fallback]").count()===1,"fallback missing");
  await page.getByRole("link",{name:"Ver portafolio completo"}).click();await page.waitForURL("**/portafolio");assert(await page.locator(".case-study").count()===5,"projects missing");await context.close();
 });
 if(mode==="dev")await check("break-ui Empty / One / Worst / 320px / 200% text",async()=>{
  const {context,page}=await make(320,740);
  for(const fixture of ["empty","one","worst"]){await go(page,"/qa?data="+fixture);assert(await overflow(page)<=1,fixture+" overflow");if(fixture==="one"){assert(await count(page)==="01","one count");assert(await page.getByRole("button",{name:"Proyecto siguiente"}).isDisabled(),"one navigation");}
   if(fixture==="worst"){await page.evaluate(()=>document.documentElement.style.fontSize="200%");assert(await overflow(page)<=1,"200% overflow");await page.waitForTimeout(300);assert(await page.locator(".coverflow-slide[data-active=true]").evaluate(e=>e.getBoundingClientRect().bottom<=document.querySelector(".coverflow-stage").getBoundingClientRect().bottom+1),"200% content clipped");}
  }await context.close();
 });
}finally{await browser.close();await mkdir("qa-results/refinement",{recursive:true});await writeFile("qa-results/refinement/"+mode+(filter?"-targeted":"")+".json",JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,fail:report.checks.filter(c=>c.status==="FAIL").length,errors:report.errors,assets:report.assets},null,2));if(report.checks.some(c=>c.status==="FAIL")||report.errors.length||report.assets.length)process.exitCode=1;

