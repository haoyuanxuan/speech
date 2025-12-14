import { LucideIcon } from 'lucide-react';

export enum SlideType {
  TITLE = 'TITLE',
  BULLET_POINTS = 'BULLET_POINTS',
  TWO_COLUMN = 'TWO_COLUMN',
  IMAGE_CENTER = 'IMAGE_CENTER',
  GRID_CARDS = 'GRID_CARDS',
  CODE_BLOCK = 'CODE_BLOCK',
  SECTION_HEADER = 'SECTION_HEADER'
}

export interface SlideContent {
  id: number;
  type: SlideType;
  title: string;
  subtitle?: string;
  content?: string[]; // For bullet points
  columns?: {
    left: { title: string; items: string[] };
    right: { title: string; items: string[] };
  };
  image?: {
    src: string;
    caption: string;
  };
  cards?: {
    title: string;
    description: string;
    icon?: LucideIcon;
  }[];
  code?: string;
}
