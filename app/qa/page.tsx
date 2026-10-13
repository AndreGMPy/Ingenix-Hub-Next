import { notFound } from "next/navigation";
import { QaHarness } from "./QaHarness";
import type { FixtureName } from "@/data/qa-fixtures";
export const metadata={title:"QA de V2",robots:{index:false,follow:false}};
export default async function QaPage({searchParams}: {searchParams:Promise<{data?:string}>}) {
  if(process.env.NODE_ENV!=="development")notFound();
  const data=(await searchParams).data;
  const initial:FixtureName=data==="worst"||data==="empty"||data==="one"?data:"demo";
  return <QaHarness initial={initial}/>;
}

