import { MarketingNav } from '@/components/marketing/MarketingNav';
import { HeroPaperGen } from '@/components/marketing/HeroPaperGen';
import { FeatureGrid3Col } from '@/components/marketing/FeatureGrid3Col';
import { GlassPricingTable } from '@/components/marketing/GlassPricingTable';
import { TestimonialsCarousel } from '@/components/marketing/TestimonialsCarousel';
import { ResponsiveFooter } from '@/components/marketing/ResponsiveFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 text-text-primary">
      <MarketingNav />
      <main className="flex-1">
        <HeroPaperGen />
        <FeatureGrid3Col />
        <GlassPricingTable />
        <TestimonialsCarousel />
      </main>
      <ResponsiveFooter />
    </div>
  );
}
