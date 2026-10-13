import {chromium} from "@playwright/test";
import sharp from "sharp";
import {mkdir,writeFile} from "node:fs/promises";
const sites=[["bokakili","https://bokakili-web.vercel.app"],["theira-medical","https://theira-medical.vercel.app"],["celularex","https://ecommerce-ejemplocelularex.vercel.app"],["expande-plus","https://expande-mas.vercel.app"]];
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]}),results=[];
await mkdir("public/projects",{recursive:true});await mkdir("qa-results/new-projects",{recursive:true});
try{for(const [slug,url]of sites){
 const context=await browser.newContext({viewport:{width:1896,height:927},deviceScaleFactor:1}),page=await context.newPage();
 const response=await page.goto(url,{waitUntil:"networkidle",timeout:90000});
 if(response?.status()!==200)throw Error(slug+" HTTP "+response?.status());
 await page.waitForTimeout(2400);await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>[...document.images].filter(img=>{const r=img.getBoundingClientRect();return r.width>0&&r.top<innerHeight&&r.bottom>0;}).every(img=>img.complete&&img.naturalWidth>0),{},{timeout:20000});
 const evidence=await page.evaluate(()=>({title:document.title,headings:[...document.querySelectorAll("h1,h2,h3")].map(e=>e.textContent),text:document.body.innerText.slice(0,18000),links:[...document.querySelectorAll("a[href]")].map(a=>({text:a.textContent?.trim(),href:a.href})).filter(a=>a.text),technologies:[]}));
 if(slug==="celularex"){const heading=page.getByRole("heading",{name:/Destacados/}).first();if(await heading.count())await heading.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-40,behavior:"instant"}));await page.waitForTimeout(1000);}
 const png=await page.screenshot({animations:"disabled"});const encoded=await sharp(png).webp({quality:88,effort:5}).toFile("public/projects/"+slug+".webp");
 results.push({slug,url,status:200,width:1896,height:927,bytes:encoded.size,...evidence});console.log(slug+" / 200 / "+encoded.size+" bytes");
 await context.close();
}}finally{await browser.close();await writeFile("qa-results/new-projects/live-content.json",JSON.stringify(results,null,2));}

