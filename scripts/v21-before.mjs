import { chromium } from "@playwright/test";
import sharp from "sharp";
import { readdir,mkdir,writeFile } from "node:fs/promises";
await mkdir("qa-results/v21",{recursive:true});
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const audit=[];
for(const root of ["../next-app/public/images","public/brand","../next-app/public/mascota-ingenix","public/nix"]){
 for(const name of await readdir(root)){if(!/logo|mascota|nix/i.test(name)||! /\.(png|webp)$/i.test(name))continue;
 const path=root+"/"+name;const m=await sharp(path).metadata();const {data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let transparent=0,opaqueWhite=0;for(let i=0;i<data.length;i+=4){if(data[i+3]<250)transparent++;if(data[i]>245&&data[i+1]>245&&data[i+2]>245&&data[i+3]>250)opaqueWhite++;}
 audit.push({path,width:m.width,height:m.height,alpha:m.hasAlpha,transparentRatio:transparent/(info.width*info.height),whiteRatio:opaqueWhite/(info.width*info.height)});
 await sharp(path).resize({width:600,height:350,fit:"inside"}).flatten({background:"#10233f"}).png().toFile("qa-results/v21/"+name.replace(/\.(png|webp)$/i,"")+"-navy.png");
 }}
await writeFile("qa-results/v21/assets.json",JSON.stringify(audit,null,2));console.log(JSON.stringify(audit));
for(const [version,port] of [["v1",4180],["v2",4173]])for(const [width,height] of [[1440,900],[390,844],[430,932]]){
 const page=await browser.newPage({viewport:{width,height},colorScheme:"dark"});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("http://127.0.0.1:"+port,{waitUntil:"networkidle",timeout:120000});await page.waitForTimeout(6000);
 await page.screenshot({path:"qa-results/v21/"+version+"-before-"+width+".png"});
 await page.mouse.wheel(0,1);for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=800){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(100);}
 await page.screenshot({path:"qa-results/v21/"+version+"-before-full-"+width+".png",fullPage:true});
 console.log(version+" "+width+" errors="+JSON.stringify(errors));await page.close();
}await browser.close();
