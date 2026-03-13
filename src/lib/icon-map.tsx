import {
  Mail,
  MessageSquare,
  FileText,
  ClipboardList,
  Code,
  Share2,
  Briefcase,
  BarChart3,
  Headphones,
  FileInput,
  Search,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  mail: Mail,
  'message-square': MessageSquare,
  'file-text': FileText,
  'clipboard-list': ClipboardList,
  code: Code,
  'share-2': Share2,
  briefcase: Briefcase,
  'bar-chart-3': BarChart3,
  headphones: Headphones,
  'file-input': FileInput,
  search: Search,
  sparkles: Sparkles,
};

interface AppTypeIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function AppTypeIcon({ name, size = 18, className }: AppTypeIconProps) {
  const Icon = ICON_MAP[name] || FileText;
  return <Icon size={size} className={className} />;
}

export function getIconComponent(name: string): LucideIcon {
  return ICON_MAP[name] || FileText;
}
