process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY="1";
import {chromium} from "@playwright/test";
import {writeFile} from "node:fs/promises";
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const context=await browser.newContext({viewport:{width:1440,height:900}});
const page=await context.newPage();await page.bringToFront();const origin=process.env.QA_ORIGIN||"http://127.0.0.1:4173";
await page.goto(origin+"?webgl=off",{waitUntil:"domcontentloaded"});await page.locator(".brand-intro:not([hidden])").waitFor();await page.getByRole("button",{name:"Saltar intro"}).click({force:true});
await page.reload({waitUntil:"networkidle"});await page.close();const tab=await context.newPage();await tab.bringToFront();await tab.goto(origin+"?webgl=off",{waitUntil:"domcontentloaded"});await tab.locator(".brand-intro:not([hidden])").waitFor();
const frames=[];for(let i=0;i<12;i++){frames.push(await tab.evaluate(()=>{const root=document.querySelector(".brand-intro"),el=document.querySelector(".intro-brand");return {time:performance.now(),pageVisible:document.visibilityState,hidden:root.hidden,visible:getComputedStyle(root).visibility,opacity:getComputedStyle(el).opacity,animation:getComputedStyle(el).animationName,animations:el.getAnimations().map(a=>({time:a.currentTime,state:a.playState})),bounds:el.getBoundingClientRect().toJSON()};}));if(i===3)await tab.screenshot({path:"qa-results/v21/intro-debug.png"});await tab.waitForTimeout(100);}
console.log(JSON.stringify(frames.map(f=>({time:f.time,visible:f.pageVisible,hidden:f.hidden,opacity:f.opacity,animations:f.animations}))));await writeFile("qa-results/v21/intro-frames.json",JSON.stringify(frames,null,2));await browser.close();
