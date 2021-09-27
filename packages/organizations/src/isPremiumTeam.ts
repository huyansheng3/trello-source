import { ProductFeatures } from '@trello/product-features';

export const isPremiumTeam = (team: { products?: number[] }): boolean => {
  return ProductFeatures.hasProduct(team.products?.[0]);
};
