import { chromium } from "@playwright/test";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { projects } from "../data/projects.ts";
import { landings } from "../data/landings.ts";
const require=createRequire(import.meta.url);
const origin=process.env.QA_ORIGIN||"http://127.0.0.1:4173";
const mode=origin.endsWith(":4174")?"prod":"dev";
const filter=process.env.QA_FILTER?new RegExp(process.env.QA_FILTER):null;
const report={mode,origin,checks:[],viewports:[],axe:[],errors:[],warnings:[],failedAssets:[],realNix:null};
await mkdir("qa-results",{recursive:true});
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const axeSource=await readFile(require.resolve("axe-core/axe.min.js"),"utf8");
function assert(value,message){if(!value)throw new Error(message);}
async function check(name,fn){if(filter&&!filter.test(name))return;try{const details=await fn();report.checks.push({name,status:"PASS",details});console.log("PASS "+name);}catch(error){report.checks.push({name,status:"FAIL",error:error.message});console.log("FAIL "+name+": "+error.message);}}
async function makePage(width=1440,height=900,extra={}){
 const context=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768,colorScheme:"light",...extra});
 const page=await context.newPage();
 page.on("pageerror",e=>report.errors.push({type:"runtime",message:e.message,url:page.url()}));
 page.on("console",m=>{if(m.type()==="error"&&!m.text().includes("503"))report.errors.push({type:"console",message:m.text(),url:page.url()});if(m.type()==="warning")report.warnings.push(m.text());});
 page.on("response",res=>{if(res.status()>=400&&!res.url().includes("/api/chat")&&!res.url().includes("/qa")&&!res.url().includes("/prototypes"))report.failedAssets.push({status:res.status(),url:res.url()});});
 return {context,page};
}
async function home(page,path=""){const r=await page.goto(origin+path,{waitUntil:"networkidle",timeout:90000});assert(r?.status()===200,"Home status "+r?.status());assert(await page.locator("main h1").isVisible(),"Hero absent");await page.waitForTimeout(300);}
// El hero carga WebGL con la primera interacción (LCP = poster 2D); QA la simula antes de esperar el 3D.
// En pantallas táctiles el hero usa el celular CSS con video nativo (sin WebGL): se verifica el pin y el mockup.
async function ready3d(page){await page.mouse.move(40,40);
 if(await page.evaluate(()=>matchMedia("(pointer: coarse)").matches)){await page.locator(".hero3d[data-motion]").waitFor({timeout:45000});assert(await page.locator("[data-webgl]").getAttribute("data-webgl")==="fallback","touch should use CSS phone");assert(await page.locator(".phone2d").isVisible(),"CSS phone hidden");assert(!(await page.locator(".hero3d-canvas").count()),"touch loaded WebGL");return;}
 await page.locator("[data-webgl=ready]").waitFor({timeout:45000});}
async function scrollAll(page){
 await page.mouse.wheel(0,1);
 const height=await page.evaluate(()=>document.documentElement.scrollHeight);
 for(let y=0;y<height;y+=650){await page.evaluate(y=>window.scrollTo({top:y,behavior:"instant"}),y);await page.waitForTimeout(70);}
 if(await page.locator("footer").count())await page.locator("footer").first().scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.width>0&&r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight;}).every(i=>i.complete&&i.naturalWidth>0),{},{timeout:20000});
 await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));await page.waitForTimeout(400);
}
async function overflow(page){return page.evaluate(()=>({extra:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth,offenders:[...document.querySelectorAll("main *,header *,footer *,nav *")].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+2||r.left< -2)&&getComputedStyle(e).position!=="fixed";}).slice(0,15).map(e=>({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width}))}));}
async function axe(page,label){
 await page.addScriptTag({content:axeSource});
 const results=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}});return r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})).slice(0,12)}));});
 report.axe.push({label,violations:results});assert(!results.length,"Axe "+results.map(v=>v.id).join(", "));
}
const sizes=[[375,667],[390,844],[430,932],[768,1024],[1024,768],[1280,720],[1366,768],[1440,900],[1920,1080]];
try{
 for(const [width,height]of filter?[]:sizes){
  const {context,page}=await makePage(width,height);
  await check("viewport "+width+"x"+height,async()=>{
   await home(page);await ready3d(page);
   await scrollAll(page); for (let project=0;project<projects.length;project++) { await page.locator(".portfolio-pagination button").nth(project).click(); await page.waitForTimeout(400); } await page.locator(".portfolio-pagination button").first().click();
   const result=await overflow(page);assert(result.extra<=1,JSON.stringify(result));
   assert(await page.locator(".case-study").count()===projects.length,"portfolio count");
   assert(await page.locator(".case-screenshot").evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)),"Screenshots failed");
   const tabs=page.getByRole("tab");
   for(let i=0;i<6;i++){await tabs.nth(i).click();assert(await tabs.nth(i).getAttribute("aria-selected")==="true","service not selected");assert(await page.locator(".capability-detail h3").textContent(),"missing detail");}
   await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));await page.waitForTimeout(300);
   await page.screenshot({path:"qa-results/"+mode+"-"+width+"-light.png"});
   report.viewports.push({width,height,theme:"light",status:"PASS",webgl:await page.locator("[data-webgl]").getAttribute("data-webgl"),overflow:result.extra});
   await page.getByRole("button",{name:"Activar modo oscuro"}).click();
   assert(await page.locator("html").getAttribute("data-theme")==="dark","theme dark");
   await page.waitForTimeout(1000);assert((await overflow(page)).extra<=1,"dark overflow");
   await page.screenshot({path:"qa-results/"+mode+"-"+width+"-dark.png"});
   report.viewports.push({width,height,theme:"dark",status:"PASS",overflow:0});
   if(width===375||width===1440)await axe(page,width+" dark");
   await page.getByRole("button",{name:"Activar modo claro"}).click();await page.waitForTimeout(1000);
   if(width===375||width===1440)await axe(page,width+" light");
   return {webgl:"ready",images:projects.length,services:6,themes:2,overflow:result.extra};
  });await context.close();
 }
 const {context,page}=await makePage();
 await check("desktop full page / content / SEO",async()=>{
  await home(page);await scrollAll(page);
  await page.screenshot({path:"qa-results/"+mode+"-full-ready.png",fullPage:true});
  assert(await page.locator("main h1").count()===1,"heading hierarchy");
  assert(await page.locator('link[rel=canonical]').getAttribute("href")==="https://www.ingenixhub.com","canonical");
  assert(!(await page.locator("body").innerText()).includes("Damaris"),"excluded project");
  assert(!(await page.locator('a[href*=linkedin]').count()),"forbidden social");
  assert(await page.locator('a[href="tel:+524932636339"]').count()>0,"correct phone");
  for(const path of ["/robots.txt","/sitemap.xml","/opengraph-image"]){const r=await page.request.get(origin+path);assert(r.ok(),path+" "+r.status());}
  return {headings:await page.locator("main h1,main h2").allTextContents()};
 });
 await check("keyboard service boundaries and focus",async()=>{
  const tabs=page.getByRole("tab");await tabs.first().focus();await page.keyboard.press("End");assert(await tabs.last().evaluate(e=>e===document.activeElement),"End not last");assert(await tabs.last().getAttribute("aria-selected")==="true","last not selected");
  await page.keyboard.press("ArrowRight");assert(await tabs.first().evaluate(e=>e===document.activeElement),"wrap not first");await page.keyboard.press("Home");assert(await tabs.first().getAttribute("aria-selected")==="true","Home");
  const visible=await tabs.first().evaluate(e=>getComputedStyle(e).outlineStyle!=="none");assert(visible,"focus absent");
 });
 await check("motion plans / keyboard chat / rapid selection",async()=>{
  await home(page);const tabs=page.getByRole("tab");
  await page.evaluate(async()=>{const tabs=document.querySelectorAll('[role="tab"]');tabs[0].dispatchEvent(new MouseEvent("click",{bubbles:true,detail:1}));await new Promise(r=>setTimeout(r,60));tabs[5].dispatchEvent(new MouseEvent("click",{bubbles:true,detail:1}));});await page.waitForTimeout(30);
  assert(await tabs.last().getAttribute("data-instant")!==null,"rapid preview restarted");
  await page.getByRole("button",{name:"Abrir chat con Nix"}).click();await page.waitForTimeout(300);
  await page.getByRole("button",{name:"Cerrar chat",exact:true}).focus();await page.keyboard.press("Enter");
  assert(await page.evaluate(()=>{const popup=document.querySelector(".nix-popup");return !popup||popup.hasAttribute("data-instant")&&getComputedStyle(popup).transitionDuration==="0s";}),"keyboard close still animates");
  await page.getByRole("dialog").waitFor({state:"hidden"});
  const mobile=await makePage(390,844);await home(mobile.page);
  await mobile.page.locator(".bottom-nav button").focus();await mobile.page.keyboard.press("Enter");await mobile.page.getByRole("dialog").waitFor();
  assert(await mobile.page.locator(".nix-backdrop").evaluate(e=>getComputedStyle(e).transitionDuration==="0s"),"keyboard backdrop animation");
  await mobile.page.keyboard.press("Escape");await mobile.page.getByRole("dialog").waitFor({state:"hidden"});await mobile.context.close();
 });
 await check("3D and fallbacks",async()=>{
  await home(page);
  await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));await ready3d(page);
  
  await home(page,"?webgl=off");assert(await page.locator("[data-webgl]").getAttribute("data-webgl")==="fallback","explicit fallback absent");
  assert(await page.getByRole("link",{name:"Hablemos de tu proyecto"}).isVisible(),"CTA blocked");
  const noGpu=await makePage(1440,900);await noGpu.page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==="webgl2"?null:original.call(this,type,...args);};});
  await home(noGpu.page);await noGpu.page.mouse.move(40,40);await noGpu.page.waitForTimeout(1500);assert(await noGpu.page.locator("[data-webgl]").getAttribute("data-webgl")==="fallback","unavailable WebGL fallback");await noGpu.context.close();
 });
 await check("natural scroll / bottom navigation / touch and keyboard",async()=>{
  await home(page);await page.mouse.wheel(0,850);await page.waitForTimeout(300);const down=await page.evaluate(()=>scrollY);assert(down>100,"wheel blocked");await page.mouse.wheel(0,-900);await page.waitForTimeout(300);assert(await page.evaluate(()=>scrollY)<down,"reverse wheel blocked");
  const mobile=await makePage(375,667);await home(mobile.page);
  assert(await mobile.page.locator('.bottom-nav>a,.bottom-nav>button').evaluateAll(items=>items.every(e=>{const r=e.getBoundingClientRect();return r.width>=44&&r.height>=44;})),"touch targets below44");
  for(const target of ["servicios","proyectos","contacto","inicio"]){await mobile.page.locator('.bottom-nav a[href="/#'+target+'"]').click();await mobile.page.waitForFunction(id=>{const r=document.getElementById(id).getBoundingClientRect();return r.top<180&&r.bottom>80;},target,{timeout:4000});}
  await mobile.page.locator('.bottom-nav button').click();await mobile.page.getByRole('dialog').waitFor();
  await mobile.page.waitForTimeout(300);
  for(let i=0;i<12;i++){await mobile.page.keyboard.press('Tab');await mobile.page.waitForFunction(()=>document.querySelector('.nix-popup')?.contains(document.activeElement),{},{timeout:1000});}
  await mobile.page.getByRole('button',{name:'Cerrar chat',exact:true}).click();await mobile.page.getByRole('dialog').waitFor({state:'hidden'});assert(await mobile.page.locator('.bottom-nav button').evaluate(e=>e===document.activeElement),"mobile focus not returned");await mobile.context.close();
  const staticPage=await makePage(1440,900,{javaScriptEnabled:false});await home(staticPage.page);assert(await staticPage.page.locator('.phone2d-shot').first().isVisible(),"no-JS fallback missing");assert(await staticPage.page.locator('.hero3d-project').count()===5,"no-JS projects list");await scrollAll(staticPage.page);assert(await staticPage.page.locator('.case-study').count()===projects.length,"no-JS portfolio missing");await staticPage.context.close();
 });
 await check("reduced motion / functional content",async()=>{
  await page.emulateMedia({reducedMotion:"reduce"});await home(page);await scrollAll(page);assert(!(await page.locator(".pin-spacer").count()),"Reduced motion pin");
  const tab=page.getByRole("tab",{name:/E-commerce/});await tab.click();assert(await tab.getAttribute("aria-selected")==="true","reduced service");
  assert(await page.locator(".preview-transition").evaluate(e=>getComputedStyle(e).transform==="none"||getComputedStyle(e).transform==="matrix(1, 0, 0, 1, 0, 0)"),"Reduced transform");
  assert(await page.locator(".case-study").count()===projects.length,"lost content");await page.emulateMedia({reducedMotion:"no-preference"});
 });
 for(const zoom of [1.25,1.5]){
  await check("reflow zoom "+zoom,async()=>{await home(page);await page.evaluate(zoom=>{document.documentElement.style.zoom=zoom;window.dispatchEvent(new Event("resize"));},zoom);await page.waitForTimeout(600);await scrollAll(page);assert((await overflow(page)).extra<=1,"zoom overflow");await page.screenshot({path:"qa-results/"+mode+"-zoom-"+zoom+".png"});await page.evaluate(()=>document.documentElement.style.removeProperty("zoom"));return "CSS zoom reflow equivalent";});
 }
 await check("SEO: servicios, ciudades, casos, JSON-LD, sitemap",async()=>{
  const {context,page}=await makePage(390,844);const sitemap=await (await page.request.get(origin+"/sitemap.xml")).text();
  const paths=[...landings.map(l=>"/"+l.slug),"/portafolio",...projects.map(p=>"/portafolio/"+p.slug)];const titles=new Set();
  for(const path of paths){
   const r=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:90000});assert(r?.status()===200,path+" "+r?.status());
   assert(await page.locator("h1").count()===1,path+" h1");const title=await page.title();assert(!titles.has(title),"title duplicado "+title);titles.add(title);
   assert((await page.locator('meta[name=description]').getAttribute("content"))?.length>50,path+" description");
   assert(await page.locator('link[rel=canonical]').getAttribute("href")===("https://www.ingenixhub.com"+path),path+" canonical");
   const ld=await page.locator('script[type="application/ld+json"]').allTextContents();assert(ld.length>=2,path+" json-ld");ld.forEach(t=>JSON.parse(t));
   assert(sitemap.includes("https://www.ingenixhub.com"+path+"</loc>"),path+" sitemap");
   assert(await page.locator("img").evaluateAll(images=>images.every(i=>i.hasAttribute("alt"))),path+" alt");
  }
  for(const l of landings){const og=await page.request.get(origin+"/"+l.slug+"/opengraph-image");assert(og.ok()&&og.headers()["content-type"].includes("image/png"),"og "+l.slug);}
  for(const path of ["/paginas-web","/moroleon"]){await page.goto(origin+path,{waitUntil:"networkidle"});assert((await overflow(page)).extra<=1,path+" overflow");await axe(page,path+" mobile");}
  await page.goto(origin+"/",{waitUntil:"domcontentloaded"});const ld=JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent());
  assert(ld["@graph"].some(n=>n["@type"]==="ProfessionalService"&&n.address.addressLocality==="Moroleón"),"LocalBusiness");
  assert(await page.locator('footer a[href="/moroleon"]').count()===1,"footer cities");assert((await page.request.get(origin+"/no-existe")).status()===404,"unknown slug");
  await context.close();return {pages:paths.length};
 });
 await check("Nix real Gemini request / session / multiline",async()=>{
  await home(page);await page.getByRole("button",{name:"Abrir chat con Nix"}).click();await page.getByRole("dialog").waitFor();
  const input=page.getByRole("textbox",{name:"Cuéntale tu proyecto a Nix"});
  await input.fill("Hola Nix. Quiero una tienda en línea de ropa infantil.\n¿Qué información necesitas para orientar mi proyecto?");
  assert((await input.inputValue()).includes("\n"),"multiline absent");
  await page.getByRole("button",{name:"Enviar mensaje",exact:true}).click();await page.locator(".chat-typing").waitFor();
  const api=await page.waitForResponse(r=>r.url().endsWith("/api/chat")&&r.request().method()==="POST",{timeout:60000});
  const payload=await api.json();assert(api.status()===200,"Real Nix status "+api.status()+" "+(payload.error||""));assert(typeof payload.reply==="string"&&payload.reply.length>30,"Empty real reply");
  await page.locator(".chat-message.model").filter({hasText:payload.reply.slice(0,50)}).waitFor();
  report.realNix={status:api.status(),replyCharacters:payload.reply.length,serverModel:true};
  await page.getByRole("button",{name:"Minimizar chat"}).click();await page.getByRole("dialog").waitFor({state:"hidden"});
  await page.getByRole("button",{name:"Abrir chat con Nix"}).click();assert(await page.locator(".chat-message.user").count()===1,"history lost close");
  await page.getByRole("button",{name:"Cerrar chat",exact:true}).click();await page.reload({waitUntil:"networkidle"});await page.getByRole("button",{name:"Abrir chat con Nix"}).click();assert(await page.locator(".chat-message.user").count()===1,"history lost reload");await page.keyboard.press("Escape");await page.getByRole("dialog").waitFor({state:"hidden"});
 });
 await context.close();
 await check("Nix mobile error / retry / long answer / quick prompt / keyboard viewport",async()=>{
  const {context,page}=await makePage(390,844);let count=0;const longReply=("Primero definimos tu catálogo, variantes y formas de pago. Después revisamos pedidos, administración y atención.\n\n").repeat(35);
  await page.route("**/api/chat",async route=>{count++;await new Promise(r=>setTimeout(r,150));await route.fulfill({status:count===1?503:200,contentType:"application/json",body:JSON.stringify(count===1?{error:"No pude responder ahora. Puedes reintentar."}:{reply:longReply})});});
  await home(page);await page.locator(".bottom-nav button").click();await page.getByRole("dialog").waitFor();
  assert(await page.getByRole("dialog").evaluate(e=>Math.abs(e.getBoundingClientRect().height-innerHeight)<3),"mobile sheet not viewport");
  await page.getByRole("button",{name:"Una tienda en línea",exact:true}).click();await page.getByRole("button",{name:"Reintentar",exact:true}).waitFor();await page.getByRole("button",{name:"Reintentar",exact:true}).click();
  await page.waitForFunction(()=>document.querySelector(".chat-message.model:not(.message-error) p")?.textContent.length>3000);
  assert(await page.locator(".chat-message.model p").last().textContent()===longReply,"long reply truncated");
  const scrolling=await page.locator(".nix-messages-scroll").evaluate(e=>e.scrollHeight>e.clientHeight&&e.scrollTop>0);assert(scrolling,"internal chat scroll");
  await page.locator(".nix-messages-scroll").evaluate(e=>e.scrollTop=0);assert(await page.locator(".chat-message.user").first().isVisible(),"chat beginning missing");
  const input=page.getByRole("textbox");await input.fill("Catálogo");await input.press("Shift+Enter");await input.press("a");assert((await input.inputValue()).includes("\n"),"Shift Enter");
  await page.setViewportSize({width:390,height:420});await page.waitForTimeout(150);assert(await page.getByRole("button",{name:"Enviar mensaje",exact:true}).isVisible(),"keyboard hides send");
  const bounds=await page.getByRole("button",{name:"Enviar mensaje",exact:true}).boundingBox();assert(bounds.y+bounds.height<=420,"send below keyboard");assert(await input.evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16),"iOS zoom font");
  await page.setViewportSize({width:844,height:390});await page.waitForTimeout(150);assert((await overflow(page)).extra<=1,"landscape overflow");assert(await page.getByRole("dialog").evaluate(e=>Math.abs(e.getBoundingClientRect().height-innerHeight)<3),"phone landscape lost sheet");assert(await page.locator(".bottom-nav").evaluate(e=>getComputedStyle(e).display!=="none"),"landscape lost navigation");
  await page.getByRole("button",{name:"Cerrar chat",exact:true}).click();await page.getByRole("dialog").waitFor({state:"hidden"});
  await page.setViewportSize({width:390,height:844});await page.locator(".bottom-nav button").click();assert(await page.locator(".chat-message.user").count()===1,"reopen lost history");
  await page.waitForTimeout(350);await page.screenshot({path:"qa-results/"+mode+"-mobile-chat-long.png"});await axe(page,"mobile chat");await context.close();
  return {longReplyCharacters:longReply.length,retries:count,viewportSimulation:true};
 });
 await check("API validation rejects invalid / oversized / cross-origin",async()=>{
  const requests=await browser.newContext();const api=origin+"/api/chat";
  for(const [body,status]of [[{messages:[]},400],[{messages:[{role:"user",text:"X".repeat(1201)}]},400],[{messages:[{role:"model",text:"bad"}]},400]]){
   const response=await requests.request.post(api,{data:body});assert(response.status()===status,"validation "+response.status());
  }
  const huge=await requests.request.post(api,{data:{padding:"x".repeat(33000)}});assert(huge.status()===413,"body bytes");
  const cross=await requests.request.post(api,{headers:{origin:"https://untrusted.example"},data:{messages:[{role:"user",text:"Hola"}]}});assert(cross.status()===403,"origin");
  await requests.close();
 });
 if(mode==="dev"){
  await check("prototype variants working / replay / URL",async()=>{
   const {context,page}=await makePage();await page.goto(origin+"/prototypes/hero",{waitUntil:"networkidle",timeout:90000});
   for(let i=0;i<3;i++){await page.keyboard.press(String(i+1));await page.waitForTimeout(200);assert(await page.locator("h1").isVisible(),"prototype absent");await page.screenshot({path:"qa-results/prototype-"+(i+1)+".png"});assert(new URL(page.url()).searchParams.get("v")===String(i+1),"URL prototype");}
   const blueprintButtons=page.locator(".blueprint-controls button");await blueprintButtons.last().click();assert(await blueprintButtons.last().getAttribute("aria-pressed")==="true","blueprint not functional");await page.keyboard.press("r");await page.waitForTimeout(200);assert(await page.locator("h1").isVisible(),"replay absent");
   const heroTitle=await page.locator("h1").textContent();await page.getByRole("tab").first().focus();await page.keyboard.press("ArrowRight");assert(await page.locator("h1").textContent()===heroTitle,"service arrows changed prototype");
   await page.setViewportSize({width:390,height:844});assert((await overflow(page)).extra<=1,"prototype mobile overflow");await context.close();
  });
  await check("break-ui fixtures / 320px / 200% text / empty / one",async()=>{
   const {context,page}=await makePage(320,740);await page.goto(origin+"/qa",{waitUntil:"networkidle",timeout:90000});
   for(const label of ["Worst case","Empty","One","Demo data"]){
    await page.getByRole("button",{name:label,exact:true}).click();await scrollAll(page);const result=await overflow(page);assert(result.extra<=1,label+" overflow "+JSON.stringify(result));
    if(label==="Worst case"){await page.screenshot({path:"qa-results/break-ui-worst-320.png",fullPage:true});await page.evaluate(()=>document.documentElement.style.fontSize="200%");const large=await overflow(page);assert(large.extra<=1,"200% text overflow "+JSON.stringify(large));await page.evaluate(()=>document.documentElement.style.removeProperty("font-size"));}
    if(label==="Empty"){assert(await page.locator(".case-study").count()===0,"empty projects");assert(await page.locator(".empty-state").count()===2,"empty recovery");}
    if(label==="One")assert(await page.locator(".case-study").count()===1,"one project");
   }await context.close();
  });
 }else{
  await check("dev-only harnesses excluded in production",async()=>{const context=await browser.newContext();for(const path of ["/qa","/prototypes/hero"]){const r=await context.request.get(origin+path);assert(r.status()===404,"dev harness shipped "+path);}await context.close();});
 }
}finally{
 await browser.close();
 report.summary={pass:report.checks.filter(c=>c.status==="PASS").length,fail:report.checks.filter(c=>c.status==="FAIL").length,runtimeErrors:report.errors.length,failedAssets:report.failedAssets.length,axeViolations:report.axe.reduce((n,r)=>n+r.violations.length,0)};
 await writeFile("qa-results/"+mode+(filter?"-targeted":"")+"-runtime.json",JSON.stringify(report,null,2));
 console.log(JSON.stringify(report.summary));
 if(report.summary.fail||report.errors.length||report.failedAssets.length)process.exitCode=1;
}

