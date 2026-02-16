
import { AppStep } from './types';

export const INITIAL_HALL_CONFIG = {
  sections: [
    {
      id: 'sec-1',
      name: 'Main Stalls',
      rows: 8,
      cols: 12,
      x: 150,
      y: 150,
      rotation: 0,
      curveIntensity: 0,
      seatSize: 24,
      spacing: 8,
      color: '#3b82f6',
      rowLabelPrefix: 'A',
    }
  ],
  screen: {
    visible: true,
    label: 'SCREEN / STAGE',
    width: 600,
    height: 40,
    x: 100,
    y: 50,
  }
};

export const SECTION_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#64748b', // slate
];
