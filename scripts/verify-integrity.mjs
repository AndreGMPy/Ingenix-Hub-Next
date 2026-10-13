import { readFile,writeFile,readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
const v2=process.cwd(),root=path.dirname(v2);
if(path.basename(v2)!=="next-app"||path.basename(root)!=="Ingenix-hub")throw new Error("Unexpected workspace");
const baseline=JSON.parse(await readFile("qa-results/reference-baseline.json","utf8"));
const modifications=[];
for(const [relative,hash]of Object.entries(baseline)){
 try{const data=await readFile(path.join(root,relative.replace(/^next-app([\\/])/,"next-app-backup$1")));const current=createHash("sha256").update(data).digest("hex");if(current!==hash.toLowerCase())modifications.push(relative);}
 catch{modifications.push(relative+" (missing)");}
}
async function walk(dir,files=[],exclude=[]){for(const item of await readdir(dir,{withFileTypes:true})){if(exclude.includes(item.name))continue;const file=path.join(dir,item.name);if(item.isDirectory())await walk(file,files,exclude);else files.push(file);}return files;}
for(const folder of ["next-app-backup","legacy-site"]){
 for(const file of await walk(path.join(root,folder),[],["node_modules",".next",".git",".vercel"])){
  const relative=path.relative(root,file).replace(/^next-app-backup([\\/])/,"next-app$1");if(file.endsWith(".log"))continue;if(!Object.hasOwn(baseline,relative))modifications.push(relative+" (new)");
 }
}
const env=await readFile(".env.local","utf8");
const keyLine=env.split(/\r?\n/).find(line=>line.startsWith("GEMINI_API_KEY="));
const secret=keyLine?.slice("GEMINI_API_KEY=".length).replace(/^["']|["']$/g,"");
if(!secret)throw new Error("Server key unavailable");
const leaked=[];
for(const directory of [".next/static",".next/dev/static",".next/server/app"]){
 try{for(const file of await walk(path.join(v2,directory))){if(!/\.(js|json|html|map)$/.test(file))continue;const data=await readFile(file);if(data.includes(Buffer.from(secret)))leaked.push(path.relative(v2,file));}}
 catch(error){if(error.code!=="ENOENT")throw error;}
}
const sourceFiles=(await walk(v2,[],["node_modules",".next",".git","qa-results",".qa-v1"])).filter(f=>!f.endsWith(".tsbuildinfo"));
const manifest=sourceFiles.map(f=>path.relative(v2,f).replaceAll("\\","/")).sort();
const report={referenceFilesVerified:Object.keys(baseline).length,modifiedOutsideV2:modifications.length?modifications:"NONE",clientSecretLeaks:leaked.length?leaked:"NONE",sourceFilesCreated:manifest.length,referenceExists:true,legacyExists:true,gitPush:false,deploy:false};
await writeFile("qa-results/integrity.json",JSON.stringify(report,null,2));await writeFile("V2_FILES_CREATED.txt",manifest.join("\n")+"\n");
console.log(JSON.stringify(report,null,2));if(modifications.length||leaked.length)process.exitCode=1;

