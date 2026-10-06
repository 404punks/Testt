import { HomePage } from "@/components/home-page";
import { isDemoMode } from "@/lib/runtime";

export default function Page() {
  return <HomePage demoMode={isDemoMode()} />;
}
