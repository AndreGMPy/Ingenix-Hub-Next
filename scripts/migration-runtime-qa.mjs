import {chromium} from "@playwright/test";
import {mkdir,writeFile} from "node:fs/promises";
const origin=process.env.QA_ORIGIN||"http://127.0.0.1:4174";
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const report={origin,checks:[],errors:[],assets:[]};
function assert(value,message){if(!value)throw Error(message);}
try{
 for(const [width,height] of [[375,667],[768,1024],[1024,768],[1280,720]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768});
  const page=await context.newPage();
  page.on("pageerror",e=>report.errors.push(e.message));
  page.on("console",m=>{if(m.type()==="error")report.errors.push(m.text());});
  page.on("response",r=>{if(r.status()>=400)report.assets.push(r.status()+" "+r.url());});
  try{
   const response=await page.goto(origin,{waitUntil:"networkidle"});
   assert(response.status()===200,"Home response");
   await page.locator("[data-webgl=ready]").waitFor({timeout:45000});
   const tabs=page.getByRole("tab");
   const titles=[];
   for(let i=0;i<6;i++){
    await tabs.nth(i).click();
    assert(await tabs.nth(i).getAttribute("aria-selected")==="true","Service "+i);
    await page.waitForTimeout(350);
    titles.push(await page.locator(".capability-detail h3").innerText());
   }
   assert(new Set(titles).size===6,"Service contents did not change");
   const stages=page.locator(".architecture-stage");
   assert(await stages.count()===7,"Architecture stages");
   const scale=()=>page.locator(".architecture-track-progress").evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m22);
   await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
   await page.waitForTimeout(450);
   const before=await scale();
   await stages.last().scrollIntoViewIfNeeded();
   await page.waitForTimeout(500);
   const end=await scale();
   assert(Number.isFinite(before)&&Number.isFinite(end)&&end>before+.1,"Architecture progress "+before+" / "+end);
   await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
   await page.waitForTimeout(500);
   const reverse=await scale();
   assert(reverse<end-.1,"Architecture reverse");
   await page.emulateMedia({reducedMotion:"reduce"});
   await stages.last().scrollIntoViewIfNeeded();
   assert(await stages.last().getByRole("heading").isVisible(),"Reduced architecture content");
   for(const theme of ["oscuro","claro"]){
    await page.getByRole("button",{name:"Activar modo "+theme}).click();
    assert(await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth)<=1,"Overflow");
   }
   const result={viewport:width+"x"+height,status:"PASS",services:6,architecture:7,forward:true,reverse:true,reduced:true,overflow:0};
   report.checks.push(result);console.log("PASS "+result.viewport+" / six services / architecture forward-reverse / themes");
  }catch(e){report.checks.push({viewport:width+"x"+height,status:"FAIL",error:e.message});console.log("FAIL "+e.message);}
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 const page=await context.newPage();await page.goto(origin,{waitUntil:"networkidle"});await page.locator("[data-webgl=ready]").waitFor({timeout:45000});await page.waitForTimeout(1600);
 await mkdir("qa-results/migration",{recursive:true});
 await page.screenshot({path:"qa-results/migration/desktop.png"});
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(600);
 await page.screenshot({path:"qa-results/migration/mobile.png"});
 await context.close();
}finally{await browser.close();await mkdir("qa-results/migration",{recursive:true});await writeFile("qa-results/migration/"+(origin.endsWith("4174")?"prod":"dev")+"-supplement.json",JSON.stringify(report,null,2));}
console.log(JSON.stringify(report));
if(report.errors.length||report.assets.length||report.checks.some(c=>c.status==="FAIL"))process.exitCode=1;

