export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  beforeUrl: string;
  afterUrl: string;
}

export const BEFORE_AFTER_GALLERY: GalleryItem[] = [
  {
    id: '1',
    title: 'Porsche 911 GT3 - Paint Correction & Ceramic',
    description:
      'Eliminated heavy swirl marks and restored deep metallic depth before applying 9H Ceramic Coating.',
    category: 'Ceramic Coating',
    beforeUrl:
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    afterUrl:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Range Rover Sport - Interior Steam Extraction',
    description:
      'Restored tan leather upholstery, removed coffee stains from carpet, and sanitized cabin vents.',
    category: 'Interior Deep Clean',
    beforeUrl:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    afterUrl:
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'BMW M4 - Engine Bay & Polish',
    description: 'Deep steam cleaning removed years of accumulated road grime and oil residue.',
    category: 'Executive Full Detail',
    beforeUrl:
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    afterUrl:
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
  },
];
