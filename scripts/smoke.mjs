import { chromium } from "@playwright/test";
import { mkdir,writeFile } from "node:fs/promises";
await mkdir("qa-results",{recursive:true});
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];
page.on("pageerror",error=>errors.push(error.message));
page.on("console",message=>{if(message.type()==="error")errors.push(message.text());});
const response=await page.goto("http://127.0.0.1:4173",{waitUntil:"networkidle",timeout:90000});
await page.locator('[data-webgl="ready"]').waitFor({timeout:45000}).catch(()=>{});
await page.screenshot({path:"qa-results/dev-desktop.png"});
await page.screenshot({path:"qa-results/dev-full.png",fullPage:true});
console.log(JSON.stringify({status:response.status(),webgl:await page.locator("[data-webgl]").getAttribute("data-webgl"),headings:await page.locator("main h1,main h2").allTextContents(),errors},null,2));
await writeFile("qa-results/smoke.json",JSON.stringify({errors},null,2));
await browser.close();

