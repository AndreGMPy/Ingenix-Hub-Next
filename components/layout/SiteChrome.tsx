import { NixChat } from "@/components/chat/NixChat";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { links } from "@/data/site";

export function SiteChrome({ portfolio = false }: { portfolio?: boolean }) {
  return <>
    <NixChat floatHref={portfolio ? links.portfolioFloat : links.contact} />
    {!portfolio && <MobileBottomNav />}
  </>;
}
