"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { NewsTicker } from "./NewsTicker";
import { MobileNavigation } from "./MobileNavigation";
import { CreateBetModal } from "./CreateBetModal";
import { SearchProvider } from "@/contexts/SearchContext";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateBetModalOpen, setIsCreateBetModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleCreateBetClick = () => {
    setIsCreateBetModalOpen(true);
  };

  const handleCloseCreateBetModal = () => {
    setIsCreateBetModalOpen(false);
  };

  return (
    <SearchProvider>
      <div className="h-screen flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:relative lg:translate-x-0 transition-transform duration-300 z-50 h-full",
          isMobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleAction={toggleSidebar}
          onCreateBetClick={handleCreateBetClick}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-main-layout">
        {/* Top Header */}
        <TopHeader 
          onMenuToggle={toggleMobileSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          onSidebarToggle={toggleSidebar}
          onCreateBetClick={handleCreateBetClick}
        />

        {/* News Ticker - Desktop only */}
        <div className="hidden lg:block">
          <NewsTicker />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 lg:pb-0">
          {children}
        </main>

        {/* News Ticker - Mobile only (above navigation) */}
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30">
          <NewsTicker />
        </div>
      </div>

        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>

      {/* Create Bet Modal */}
      <CreateBetModal 
        isOpen={isCreateBetModalOpen}
        onClose={handleCloseCreateBetModal}
      />
    </SearchProvider>
  );
}
