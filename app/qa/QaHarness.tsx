"use client";
import { useState } from "react";
import { Capabilities } from "@/components/home/Capabilities";
import { SelectedWork } from "@/components/portfolio/SelectedWork";
import { NixMessages } from "@/components/nix/NixMessages";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { chatFixtures,fixtureCapabilities,fixtureProjects,type FixtureName } from "@/data/qa-fixtures";
const options=[["demo","Demo data"],["worst","Worst case"],["empty","Empty"],["one","One"]] as const;
export function QaHarness({initial}: {initial:FixtureName}) {
  const [mode,setMode]=useState(initial);
  return <><header className="container qa-heading"><div><p className="eyebrow">DEV ONLY / BREAK-UI</p><h1>Datos que ponen a prueba la interfaz.</h1><p>Fixtures de prueba; no son clientes ni afirmaciones comerciales.</p></div><ThemeToggle/></header><main><Capabilities items={fixtureCapabilities(mode)}/><SelectedWork items={fixtureProjects(mode)}/><section className="container qa-chat-section"><h2>Conversación completa</h2><div className="qa-chat-frame"><NixMessages messages={chatFixtures[mode]}/></div></section></main><nav className="qa-toggle" aria-label="Datos de prueba">{options.map(([value,label])=><button key={value} type="button" aria-pressed={mode===value} onClick={()=>{setMode(value);const url=new URL(location.href);url.searchParams.set("data",value);history.replaceState(null,"",url);}}>{label}</button>)}</nav><style>{`.qa-heading{display:flex;align-items:center;gap:1rem;padding-block:2rem}.qa-heading h1{font-size:1.5rem}.qa-heading p:last-child{font-size:.8125rem;color:var(--muted)}.qa-chat-section{padding-bottom:8rem}.qa-chat-section h2{font-size:1.5rem}.qa-chat-frame{max-width:410px;border:1px solid var(--line);border-radius:20px;padding:1rem;height:540px;overflow:auto;margin:2rem auto}.qa-toggle{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:100;display:flex;padding:4px;background:#d5d7da;border-radius:99px;gap:2px;box-shadow:0 4px 16px #0002;white-space:nowrap;font-family:system-ui,sans-serif}.qa-toggle button{min-height:32px;padding:0 10px;background:transparent;border-radius:99px;color:#242629;font-size:11px}.qa-toggle button[aria-pressed=true]{background:white}.qa-toggle button:active{transform:none}`}</style></>;
}

