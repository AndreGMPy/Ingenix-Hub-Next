import {chromium} from "@playwright/test";
import {writeFile} from "node:fs/promises";
const origin="http://127.0.0.1:4174";
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const reports=[];
try{
 for(const [width,height]of [[1440,900],[390,844]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768});
  const page=await context.newPage();const cdp=await context.newCDPSession(page);
  await cdp.send("Network.enable");await cdp.send("Network.setCacheDisabled",{cacheDisabled:true});
  await cdp.send("Network.emulateNetworkConditions",{offline:false,latency:40,downloadThroughput:20*1024*1024/8,uploadThroughput:5*1024*1024/8});
  await cdp.send("Emulation.setCPUThrottlingRate",{rate:4});
  await page.addInitScript(()=>{
   window.__v2Metrics={lcp:0,cls:0,eventDurations:[]};
   new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__v2Metrics.lcp=entry.startTime;}).observe({type:"largest-contentful-paint",buffered:true});
   new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__v2Metrics.cls+=entry.value;}).observe({type:"layout-shift",buffered:true});
   new PerformanceObserver(list=>{for(const entry of list.getEntries())if(entry.interactionId)window.__v2Metrics.eventDurations.push(entry.duration);}).observe({type:"event",buffered:true,durationThreshold:16});
  });
  await page.bringToFront();await page.goto(origin,{waitUntil:"networkidle",timeout:90000});
  await page.waitForFunction(()=>window.__v2Metrics.lcp>0,{},{timeout:10000}).catch(()=>{});
  await page.locator('[data-webgl="ready"]').waitFor({timeout:45000});await page.waitForTimeout(600);
  await page.getByRole("button",{name:"Activar modo oscuro"}).click();await page.waitForTimeout(300);
  const report=await page.evaluate(()=>({lcpMs:window.__v2Metrics.lcp?Math.round(window.__v2Metrics.lcp):null,firstContentfulPaintMs:performance.getEntriesByName("first-contentful-paint")[0]?.startTime??null,visibility:document.visibilityState,cls:window.__v2Metrics.cls,maxRecordedInteractionMs:Math.max(0,...window.__v2Metrics.eventDurations),resourceTransferBytes:performance.getEntriesByType("resource").reduce((n,r)=>n+r.transferSize,0),jsResources:performance.getEntriesByType("resource").filter(r=>r.name.endsWith(".js")).map(r=>({path:new URL(r.name).pathname,transferBytes:r.transferSize})).sort((a,b)=>b.transferBytes-a.transferBytes)}));
  reports.push({viewport:width+"x"+height,cpuThrottle:4,network:"20 Mbps / 40ms; cache disabled",webgl:await page.locator("[data-webgl]").getAttribute("data-webgl"),...report});await context.close();
 }
 const context=await browser.newContext();const page=await context.newPage();await page.goto(origin+"?webgl=off",{waitUntil:"networkidle"});const fallbackJs=await page.evaluate(()=>performance.getEntriesByType("resource").filter(r=>r.name.endsWith(".js")).map(r=>new URL(r.name).pathname));
 reports.push({case:"no WebGL",fallbackScriptCount:fallbackJs.length,jsResources:fallbackJs});await context.close();
}finally{await browser.close();}
await writeFile("qa-results/performance.json",JSON.stringify(reports,null,2));
console.log(JSON.stringify(reports.map(report=>({...report,jsResources:undefined})),null,2));

