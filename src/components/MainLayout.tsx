import { useStore } from "@/lib/context/store-context";
import { CategorySidebar } from "@/components/CategorySidebar";
import { StoreView } from "@/components/StoreView";

// interface MainLayoutProps {
//   searchQuery: string;
// }

export const MainLayout = () => { // Removed prop
  const { selectedStore } = useStore();

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Desktop Sidebar: Only render if a store is selected */}
      {selectedStore && (
        <aside className="hidden lg:block w-64 border-r bg-background/50 overflow-y-auto shrink-0">
          <CategorySidebar />
        </aside>
      )}
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <StoreView />
      </main>
    </div>
  );
};