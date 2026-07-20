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
  creator?:
    | string
    | {
        _id: string;
        name: string;
        avatar?: string | null;
      };
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user:
    | string
    | {
        _id: string;
        name: string;
        avatar?: string | null;
      };
}

export interface ReviewListData {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
