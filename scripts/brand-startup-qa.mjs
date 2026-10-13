import {chromium} from "@playwright/test";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
const origin=process.env.QA_ORIGIN||"http://127.0.0.1:4173",mode=origin.endsWith("4174")?"prod":"dev";
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]}),report={mode,checks:[],errors:[]};
function assert(v,m){if(!v)throw Error(m);}
async function check(name,fn){try{report.checks.push({name,status:"PASS",details:await fn()});console.log("PASS "+name);}catch(e){report.checks.push({name,status:"FAIL",error:e.message});console.log("FAIL "+name+": "+e.message);}}
try{
 await check("official isotopes copied without alteration",async()=>{
  for(const [source,target]of [["C:/Users/brand/Downloads/IngenixHub_isotipo_transparente.png","public/brand/ingenix-isotipo.png"],["C:/Users/brand/Downloads/IngenixHub_isotipo_transparente_square.png","public/brand/ingenix-isotipo-square.png"]]){const a=createHash("sha256").update(await readFile(source)).digest("hex"),b=createHash("sha256").update(await readFile(target)).digest("hex");assert(a===b,"modified isotope");}
  return "Both PNG files byte-identical";
 });
 for(const [w,h]of [[390,844],[430,932],[1366,768],[1440,900]])await check("cold load / hard refresh / readiness "+w+"x"+h,async()=>{
  const context=await browser.newContext({viewport:{width:w,height:h},isMobile:w<768,hasTouch:w<768}),page=await context.newPage();await page.bringToFront();page.on("pageerror",e=>report.errors.push(e.message));const cdp=await context.newCDPSession(page);await cdp.send("Network.enable");await cdp.send("Network.setCacheDisabled",{cacheDisabled:true});
  await page.addInitScript(()=>{
   window.readyFrames=[];
   new MutationObserver(()=>{const root=document.querySelector("[data-webgl=ready]"),canvas=root?.querySelector("canvas");if(canvas?.ingenixMotion&&!window.readyFrames.length)window.readyFrames.push(canvas.ingenixMotion);}).observe(document,{subtree:true,attributes:true,attributeFilter:["data-webgl","class"]});
  });
  for(let attempt=0;attempt<2;attempt++){
   if(attempt===0)await page.goto(origin,{waitUntil:"networkidle",timeout:90000});else await page.reload({waitUntil:"networkidle"});
   await page.locator("[data-webgl=ready]").waitFor({timeout:45000});await page.waitForTimeout(100);
   const first=await page.evaluate(()=>window.readyFrames[0]);assert(first&&first.settledDraws>=2&&first.frames>=2&&Number.isFinite(first.rotation)&&first.cameraAspect>0,"early readiness "+JSON.stringify(first));
   assert(await page.locator(".fallback-official-isotype img").evaluate(e=>e.complete&&e.naturalWidth>0),"empty fallback");
  }
  if(w<768){
   await page.evaluate(()=>{Object.defineProperty(document,"hidden",{configurable:true,get:()=>true});document.dispatchEvent(new Event("visibilitychange"));});await page.waitForTimeout(250);
   const before=await page.locator("canvas").evaluate(e=>e.ingenixMotion);await page.waitForTimeout(600);const after=await page.locator("canvas").evaluate(e=>e.ingenixMotion);
   assert(before.mode==="paused"&&before.elapsed===after.elapsed,"document hidden does not pause");
   await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event("visibilitychange"));});
  }
  const frames=await page.evaluate(()=>window.readyFrames);await context.close();return frames;
 });
 await check("tech intro desktop / mobile / skip / same session / new session / reduced",async()=>{
  const native=await chromium.launch({channel:"chrome",headless:true});
  try{for(const w of [390,1440]){
   const context=await native.newContext({viewport:{width:w,height:w===390?844:900}}),page=await context.newPage();await page.bringToFront();await page.goto(origin+"?webgl=off",{waitUntil:"domcontentloaded",timeout:90000});
   await page.locator(".tech-intro:not([hidden])").waitFor({timeout:10000});
   assert(await page.locator("main h1").isVisible(),"main absent");assert(await page.locator(".tech-intro").evaluate(e=>getComputedStyle(e).pointerEvents==="none"),"intro blocks pointer");
   assert(await page.evaluate(()=>getComputedStyle(document.body).overflow!=="hidden"),"intro scroll lock");
   const duration=await page.locator(".tech-intro").evaluate(e=>parseFloat(getComputedStyle(e).animationDuration));assert(duration===(w===390?1.05:1.35),"intro duration "+duration);
   await page.waitForTimeout(1550);assert(await page.locator(".tech-intro").isHidden(),"intro stuck");
   await page.reload({waitUntil:"networkidle"});assert(await page.locator(".tech-intro").isHidden(),"same session repeated");
   await context.close();
   const next=await native.newContext({viewport:{width:w,height:900}}),tab=await next.newPage();await tab.bringToFront();await tab.goto(origin+"?webgl=off",{waitUntil:"domcontentloaded"});await tab.locator(".tech-intro:not([hidden])").waitFor({timeout:10000});await tab.getByRole("button",{name:"Saltar intro"}).click({force:true});assert(await tab.locator(".tech-intro").isHidden(),"skip");await next.close();
  }
  const reduced=await native.newContext({reducedMotion:"reduce"}),page=await reduced.newPage();await page.goto(origin+"?webgl=off",{waitUntil:"networkidle"});assert(await page.locator(".tech-intro").isHidden(),"reduced intro");await reduced.close();
  }finally{await native.close();}
 });
}finally{await browser.close();await mkdir("qa-results/brand-projects",{recursive:true});await writeFile("qa-results/brand-projects/"+mode+"-startup.json",JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,fail:report.checks.filter(c=>c.status==="FAIL").length,errors:report.errors},null,2));if(report.checks.some(c=>c.status==="FAIL")||report.errors.length)process.exitCode=1;

