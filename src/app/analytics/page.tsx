import { MainLayout } from "@/components/MainLayout";
import { GraphDashboard } from "@/components/GraphDashboard";
import { GraphQLDebug } from "@/components/GraphQLDebug";

export default function Analytics() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Real-time data from The Graph protocol</p>
        </div>

        <div className="mb-8">
          <GraphQLDebug />
        </div>

        <GraphDashboard />
      </div>
    </MainLayout>
  );
}
