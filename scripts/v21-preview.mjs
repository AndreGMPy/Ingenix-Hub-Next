import { chromium } from "@playwright/test";
import { mkdir,writeFile } from "node:fs/promises";
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
await mkdir("qa-results/v21",{recursive:true});
const errors=[];
for(const [width,height] of [[1440,900],[390,844],[430,932]]){
 const page=await browser.newPage({viewport:{width,height},isMobile:width<768,hasTouch:width<768});
 page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
 await page.goto("http://127.0.0.1:4173",{waitUntil:"networkidle",timeout:90000});await page.waitForTimeout(2000);
 await page.screenshot({path:"qa-results/v21/after-hero-"+width+"-light.png"});
 await page.getByRole("button",{name:"Activar modo oscuro"}).click();await page.waitForTimeout(400);
 await page.screenshot({path:"qa-results/v21/after-hero-"+width+"-dark.png"});
 for(const [name,selector] of [["services","#servicios"],["architecture",".architecture-story"],["portfolio","#proyectos"],["nix","#nix"]]){
 await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(600);await page.screenshot({path:"qa-results/v21/after-"+name+"-"+width+".png"});}
 console.log(width+" overflow="+await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)+" webgl="+await page.locator(".ecosystem-viewport").getAttribute("data-webgl"));await page.close();
}await writeFile("qa-results/v21/preview-errors.json",JSON.stringify(errors));console.log(errors);await browser.close();
