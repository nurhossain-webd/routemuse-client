export interface Experience {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  location: string;
  country: string;
  price: number;
  durationHours: number;
  ratingAverage: number;
  ratingCount: number;
  imageUrls: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  availableFrom: string;
  availableTo: string;
}

export interface ExperienceListData {
  experiences: Experience[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
