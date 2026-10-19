import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/landing/LandingPage";
import { landingBySlug, landings } from "@/data/landings";

// Sólo las páginas de servicio y ciudad definidas en data/landings.ts; cualquier otro slug es 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return landings.map(item => ({ landing: item.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ landing: string }> }): Promise<Metadata> {
  const { landing } = await params;
  const item = landingBySlug(landing);
  if (!item) return {};
  const path = "/" + item.slug;
  return {
    title: item.metaTitle,
    description: item.description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "es_MX", siteName: "Ingenix Hub", url: path, title: item.metaTitle, description: item.description },
    twitter: { card: "summary_large_image", title: item.metaTitle, description: item.description },
  };
}
export default async function Page({ params }: { params: Promise<{ landing: string }> }) {
  const { landing } = await params;
  const item = landingBySlug(landing);
  if (!item) notFound();
  return <LandingPage landing={item} />;
}
