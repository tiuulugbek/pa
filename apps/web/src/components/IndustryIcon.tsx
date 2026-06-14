import {
  Flame,
  FlaskConical,
  Mountain,
  Zap,
  Wheat,
  Droplets,
  type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  flame: Flame,
  'flask-conical': FlaskConical,
  mountain: Mountain,
  zap: Zap,
  wheat: Wheat,
  droplets: Droplets,
};

export function IndustryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Flame;
  return <Icon className={className} />;
}
