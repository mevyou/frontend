import { Header } from "@/components/Header";
import { UserProfile } from "@/components/UserProfile";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <UserProfile />
    </div>
  );
}
