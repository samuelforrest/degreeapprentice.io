import {
  BriefcaseBusinessIcon,
  Building2Icon,
  CalculatorIcon,
  ClapperboardIcon,
  CogIcon,
  CpuIcon,
  GraduationCapIcon,
  HardHatIcon,
  HeartPulseIcon,
  LandmarkIcon,
  LightbulbIcon,
  type LucideIcon,
  RadioTowerIcon,
  ScaleIcon,
  ShieldIcon,
  ShoppingBagIcon,
  TrainFrontIcon,
  UmbrellaIcon,
  ZapIcon,
} from "lucide-react";

import type { Sector } from "@/lib/taxonomy";

// One icon per sector. Typed as a full Record so adding a sector without an
// icon is a type error.
const ICONS: Record<Sector, LucideIcon> = {
  "Accounting & Audit": CalculatorIcon,
  "Banking & Finance": LandmarkIcon,
  "Business & Management": BriefcaseBusinessIcon,
  "Construction & Property": HardHatIcon,
  Consulting: LightbulbIcon,
  "Consumer & Retail": ShoppingBagIcon,
  "Creative & Media": ClapperboardIcon,
  "Defence & Aerospace": ShieldIcon,
  Education: GraduationCapIcon,
  "Energy & Utilities": ZapIcon,
  Engineering: CogIcon,
  "Healthcare & Life Sciences": HeartPulseIcon,
  Insurance: UmbrellaIcon,
  Law: ScaleIcon,
  "Public Sector": Building2Icon,
  Technology: CpuIcon,
  Telecoms: RadioTowerIcon,
  "Transport & Logistics": TrainFrontIcon,
};

export function SectorIcon({ sector, className }: { sector: Sector; className?: string }) {
  const Icon = ICONS[sector];
  return <Icon className={className} aria-hidden />;
}
