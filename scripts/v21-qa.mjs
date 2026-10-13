process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY="1";
import { chromium } from "@playwright/test";
import { readFile,writeFile,mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url),origin=process.env.QA_ORIGIN||"http://127.0.0.1:4173",mode=origin.endsWith("4174")?"prod":"dev";
const report={mode,checks:[],errors:[],warnings:[],assets:[],axe:[]};
await mkdir("qa-results/v21",{recursive:true});
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const axe=await readFile(require.resolve("axe-core/axe.min.js"),"utf8");
function assert(ok,message){if(!ok)throw Error(message);}
const filter=process.env.V21_QA_FILTER?new RegExp(process.env.V21_QA_FILTER):null;
async function check(name,fn){if(filter&&!filter.test(name))return;try{report.checks.push({name,status:"PASS",details:await fn()});console.log("PASS "+name);}catch(e){report.checks.push({name,status:"FAIL",error:e.message});console.log("FAIL "+name+" "+e.message);}}
async function make(width=1440,height=900,options={},engine=browser){const context=await engine.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768,...options});const page=await context.newPage();await page.bringToFront();page.on("pageerror",e=>report.errors.push(e.message));page.on("console",m=>{if(m.type()==="error"&&!m.text().includes("503"))report.errors.push(m.text());if(m.type()==="warning")report.warnings.push(m.text());});page.on("response",r=>{if(r.status()>=400&&!/api\/chat|\/qa|\/prototypes/.test(r.url()))report.assets.push(r.status()+" "+r.url());});return {context,page};}
async function go(page,path=""){await page.goto(origin+path,{waitUntil:"networkidle",timeout:90000});await page.waitForTimeout(1700);}
async function top(page,selector){await page.locator(selector).evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-96,behavior:"instant"}));await page.waitForTimeout(300);}
async function select(page,index){await page.locator(".portfolio-pagination button").nth(index).click();await page.waitForTimeout(700);assert((await page.locator(".portfolio-count strong").innerText())===String(index+1).padStart(2,"0"),"counter "+index);}
async function overflow(page){return page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth);}
async function accessibility(page,label){await page.addScriptTag({content:axe});const violations=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});report.axe.push({label,violations});assert(!violations.length,JSON.stringify(violations));}
try{
 await check("intro primera carga / skip / misma sesión / nueva pestaña",async()=>{
  const introBrowser=await chromium.launch({channel:"chrome",headless:true});
  const {context,page}=await make(1440,900,{},introBrowser);
  await page.goto(origin+"?webgl=off",{waitUntil:"domcontentloaded",timeout:90000});
  await page.locator(".brand-intro:not([hidden])").waitFor({timeout:10000});assert(await page.locator("main h1").count()===1,"HTML no listo");
  assert(await page.locator(".brand-intro").evaluate(e=>getComputedStyle(e).pointerEvents==="none"),"intro bloquea pointer");
  assert(await page.evaluate(()=>getComputedStyle(document.body).overflow!=="hidden"),"scroll bloqueado");
  await page.getByRole("button",{name:"Saltar intro"}).click({force:true});
  assert(await page.locator(".brand-intro").isHidden(),"skip");
  await page.reload({waitUntil:"networkidle"});assert(await page.locator(".brand-intro").isHidden(),"refresh repite intro");
  await page.close();const tab=await context.newPage();await tab.bringToFront();await tab.goto(origin+"?webgl=off",{waitUntil:"domcontentloaded"});await tab.locator(".brand-intro:not([hidden])").waitFor({state:"visible",timeout:10000});await tab.waitForFunction(()=>{const el=document.querySelector(".intro-brand");return el&&parseFloat(getComputedStyle(el).opacity)>.5;},{},{timeout:1000});await tab.waitForTimeout(100);await tab.screenshot({path:"qa-results/v21/"+mode+"-intro.png"});await tab.waitForTimeout(1700);assert(await tab.locator(".brand-intro").isHidden(),"intro no termina");await context.close();await introBrowser.close();return "Chrome compositor nativo: HTML detrás, sin lock, skip, refresh y tab PASS";
 });
 await check("intro storage indisponible y reduced motion",async()=>{
  const {context,page}=await make();await page.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error("storage disabled");};Storage.prototype.setItem=()=>{throw Error("storage disabled");};});
  await go(page);assert(await page.locator(".brand-intro").isHidden(),"storage trap");await context.close();
  const r=await make(390,844,{reducedMotion:"reduce"});await go(r.page);assert(await r.page.locator(".brand-intro").isHidden(),"reduced intro");await top(r.page,"#proyectos");await select(r.page,4);await r.page.locator(".portfolio-track").focus();await r.page.keyboard.press("Home");assert(await r.page.locator(".portfolio-count strong").innerText()==="01","reduced carousel keyboard");await r.context.close();
 });
 for(const [width,height]of [[375,667],[390,844],[430,932],[768,1024],[1024,768],[1280,720],[1366,768],[1440,900],[1920,1080]]){
  await check("viewport "+width+"x"+height+" / servicios / portfolio / light-dark",async()=>{
   const {context,page}=await make(width,height);await go(page);await page.locator("[data-webgl=ready]").waitFor({timeout:45000});
   await page.screenshot({path:"qa-results/v21/"+mode+"-"+width+"-light.png"});
   await top(page,"#servicios");for(let i=0;i<6;i++){await page.getByRole("tab").nth(i).click();assert(await page.getByRole("tab").nth(i).getAttribute("aria-selected")==="true","service");}
   await top(page,"#proyectos");for(let i=0;i<5;i++){await select(page,i);await page.waitForFunction(index=>{const image=document.querySelectorAll(".case-screenshot")[index];return image?.complete&&image.naturalWidth>0;},i,{timeout:20000});}
   await select(page,0);await top(page,"#proyectos");assert(await page.locator(".case-study").count()===5,"five projects");
   await page.screenshot({path:"qa-results/v21/"+mode+"-"+width+"-portfolio.png"});
   assert(await overflow(page)<=1,"light overflow");
   await page.getByRole("button",{name:"Activar modo oscuro"}).click();await page.waitForTimeout(700);assert(await overflow(page)<=1,"dark overflow");
   await top(page,"#inicio");await page.screenshot({path:"qa-results/v21/"+mode+"-"+width+"-dark.png"});
   assert(await page.locator(".brand-logo").evaluate(e=>getComputedStyle(e).backgroundColor==="rgba(0, 0, 0, 0)"),"logo fondo");
   if(width===390||width===1440){await accessibility(page,width+" dark");await page.getByRole("button",{name:"Activar modo claro"}).click();await page.waitForTimeout(700);await accessibility(page,width+" light");}
   await context.close();return {webgl:"ready",projects:5,services:6,themes:2,overflow:0};
  });
 }
 const {context,page}=await make();await go(page);await top(page,"#proyectos");
 await check("portfolio teclado / límites / tap rápido / reversión",async()=>{
  const track=page.locator(".portfolio-track");await track.focus();await page.keyboard.press("End");assert(await page.locator(".portfolio-count strong").innerText()==="05","End");
  await page.keyboard.press("Home");assert(await page.locator(".portfolio-count strong").innerText()==="01","Home");await page.keyboard.press("ArrowRight");assert(await page.locator(".portfolio-count strong").innerText()==="02","Right");await page.keyboard.press("ArrowLeft");assert(await page.locator(".portfolio-count strong").innerText()==="01","Left");
  await page.getByRole("button",{name:"Proyecto siguiente"}).evaluate(async el=>{el.dispatchEvent(new MouseEvent("click",{bubbles:true,detail:1}));await new Promise(r=>setTimeout(r,50));el.dispatchEvent(new MouseEvent("click",{bubbles:true,detail:1}));});
  await page.waitForTimeout(1000);assert(await page.locator(".portfolio-count strong").innerText()==="03","rapid lost target");
  await page.getByRole("button",{name:"Proyecto anterior"}).click();await page.waitForTimeout(700);assert(await page.locator(".portfolio-count strong").innerText()==="02","reverse");
  await select(page,4);assert(await page.getByRole("button",{name:"Proyecto siguiente"}).isDisabled(),"last bound");await select(page,0);assert(await page.getByRole("button",{name:"Proyecto anterior"}).isDisabled(),"first bound");
 });
 await check("portfolio completo y links reales",async()=>{await page.getByRole("link",{name:"Ver portafolio completo"}).click();await page.waitForURL("**/portafolio");assert(await page.locator(".case-study").count()===5,"full missing");assert(await page.locator("h1").count()===1,"h1 full");assert(!(await page.locator("body").innerText()).includes("Damaris"),"excluded");await page.getByRole("link",{name:"Ingenix Hub · Inicio",exact:true}).first().click();await page.waitForURL("**/#inicio");});
 await check("header indicador / scroll ida-vuelta / Nix replay teclado",async()=>{
  for(const id of ["servicios","proyectos","nix"]){await top(page,"#"+id);await page.waitForTimeout(400);assert(await page.locator('.desktop-nav a[href="/#'+id+'"]').getAttribute("aria-current")==="location","active "+id);}
  const replay=page.getByRole("button",{name:"Repetir ejemplo de Nix"});await replay.click();await replay.focus();await page.keyboard.press("Enter");assert(await page.locator(".example-nix").evaluate(e=>getComputedStyle(e).opacity==="1"&&getComputedStyle(e).transform==="matrix(1, 0, 0, 1, 0, 0)"),"keyboard demo animated");await top(page,"#inicio");
 });
 await context.close();
 await check("mobile swipe táctil nativo y BottomNav / landscape",async()=>{
  const {context,page}=await make(390,844);await go(page);await top(page,"#proyectos");await select(page,0);
  const cdp=await context.newCDPSession(page);const box=await page.locator(".case-media-link").first().boundingBox();const y=Math.max(170,Math.min(430,box.y+70));
  await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:330,y}]});
  for(let i=1;i<=8;i++){await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:330-i*35,y}]});await page.waitForTimeout(25);}
  await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});await page.waitForTimeout(900);assert(await page.locator(".portfolio-count strong").innerText()!=="01","swipe no cambia");
  await page.getByRole("button",{name:"Hablar con Nix",exact:true}).last().click();assert(await page.getByRole("dialog").isVisible(),"bottom Nix");
  await page.setViewportSize({width:844,height:390});assert(await page.locator(".bottom-nav").isVisible(),"landscape nav");assert(await page.locator(".nix-popup").evaluate(e=>e.getBoundingClientRect().width>=innerWidth-2),"landscape sheet");await page.getByRole("button",{name:"Cerrar chat"}).click();await context.close();
 });
 await check("WebGL fallback / reduced scene / no-JS / zoom",async()=>{
  const {context,page}=await make();await go(page,"?webgl=off");assert(await page.locator("[data-webgl=fallback]").count()===1,"fallback");assert(await page.locator("main h1").isVisible(),"hero");await page.screenshot({path:"qa-results/v21/"+mode+"-fallback.png"});for(const zoom of [1.25,1.5]){await page.evaluate(z=>document.body.style.zoom=String(z),zoom);assert(await overflow(page)<=1,"zoom overflow");}await context.close();
  const no=await make(390,844,{javaScriptEnabled:false});await go(no.page);assert(await no.page.locator("h1").isVisible(),"no JS Hero");assert(await no.page.locator(".case-study").count()===5,"no JS cases");assert(await no.page.locator(".brand-intro").isHidden(),"no JS intro");await no.context.close();
 });
 if(mode==="dev")await check("break-ui Worst / Empty / One / 200% text / prototypes",async()=>{
  const {context,page}=await make(320,740);for(const name of ["worst","empty","one","demo"]){await go(page,"/qa?data="+name);assert(await overflow(page)<=1,"fixture overflow "+name);if(name==="worst"){await page.evaluate(()=>document.documentElement.style.fontSize="200%");assert(await overflow(page)<=1,"200% text");await page.screenshot({path:"qa-results/v21/worst-320-200.png",fullPage:true});}}
  await page.setViewportSize({width:1440,height:900});for(let i=1;i<=3;i++){await go(page,"/prototypes/hero?v="+i);await page.screenshot({path:"qa-results/v21/prototype-"+i+".png"});assert(await page.locator(".proto-picker-item[data-active]").count()===1,"prototype active");}await context.close();
 });
}finally{await browser.close();await writeFile("qa-results/v21/"+mode+(filter?"-targeted-runtime.json":"-runtime.json"),JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,fail:report.checks.filter(c=>c.status==="FAIL").length,errors:report.errors,assets:report.assets,axe:report.axe.filter(a=>a.violations.length)},null,2));if(report.checks.some(c=>c.status==="FAIL")||report.errors.length||report.assets.length)process.exitCode=1;

