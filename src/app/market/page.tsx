import { MainLayout } from "@/components/MainLayout";
import { MarketPage } from "@/components/MarketPage";
import { MarketPageMobile } from "@/components/MarketPageMobile";

export default function Marketspage() {
  return (
    <MainLayout>
      {/* Desktop view */}
      <div className="hidden lg:block">
        <MarketPage />
      </div>
      
      {/* Mobile view */}
      <div className="block lg:hidden">
        <MarketPageMobile />
      </div>
    </MainLayout>
  );
}
