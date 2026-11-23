import {
  Braces,
  Server,
  MapPin,
  History,
  Globe,
  ArrowRight,
  Download,
  Mail,
  ServerCog,
  LayoutPanelTop,
  Database,
  Cloud,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  Medal,
  Code2,
  Coffee,
  type LucideIcon,
} from "lucide-react";

// Only the icons actually used are imported, so lucide-react stays tree-shaken.
const icons = {
  braces: Braces,
  server: Server,
  "map-pin": MapPin,
  history: History,
  globe: Globe,
  "arrow-right": ArrowRight,
  download: Download,
  mail: Mail,
  "server-cog": ServerCog,
  "layout-panel-top": LayoutPanelTop,
  database: Database,
  cloud: Cloud,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  sun: Sun,
  moon: Moon,
  medal: Medal,
  "code-2": Code2,
  coffee: Coffee,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  size = 16,
  className,
  strokeWidth = 2,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = icons[name];
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} aria-hidden />;
}
