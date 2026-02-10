// Maps iconName strings from role-definitions to Lucide components.
// Keeps role-definitions as pure serializable data.

import {
  Compass, Palette, Shield, Settings, TrendingUp,
  FileText, Crown, Lightbulb, Megaphone, PenTool, Paintbrush, Handshake,
  ShieldCheck, Scale, Globe, Lock, Cog, BarChart3, Users,
  Rocket, SearchCheck, Blocks,
  type LucideIcon,
} from 'lucide-react';

export const ROLE_ICON_MAP: Record<string, LucideIcon> = {
  Compass, Palette, Shield, Settings, TrendingUp,
  FileText, Crown, Lightbulb, Megaphone, PenTool, Paintbrush, Handshake,
  ShieldCheck, Scale, Globe, Lock, Cog, BarChart3, Users,
  Rocket, SearchCheck, Blocks,
};
