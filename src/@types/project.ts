// ----------------------------------------------------------------------

import { IUser } from './user';

export type IProjectReview = {
  id: string;
  name: string;
  avatarUrl: string;
  comment: string;
  rating: number;
  postedAt: Date | string | number;
};

export type IProject = {
  id: string;
  userId: string;
  image: string | null;
  name: string;
  description: string;
  budget: number;
  status: IProjectStatus;
  startsAt: Date | string |  null;

  participants: IUser[];
  creator: IUser | null;
};

export type IProjectFilter = {
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
  rating: string;
  sortBy: string;
};

// ----------------------------------------------------------------------

export type IProjectState = {
  isLoading: boolean;
  error: Error | string | null;
  projects: IProject[];
  project: IProject | null;
};

export type IProjectStatus = 'in_progress' | 'closing' | 'closed';
