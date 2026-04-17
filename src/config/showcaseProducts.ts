export interface ClientShowcase {
  productId: string;
  name: string;
  url: string;
}

export const CLIENT_SHOWCASE_IDS: ClientShowcase[] = [
  { productId: 'hugo-mentors', name: 'Hugo Mentors', url: '/showcase/hugo-mentors' },
  { productId: 'explorer-academy', name: 'Explorer Academy', url: '/showcase/explorer-academy' },
  { productId: 'rocketship', name: 'Rocketship Innovation School', url: '/showcase/rocketship' },
];
