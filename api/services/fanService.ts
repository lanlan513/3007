import { fans, categories } from '../data/fans.js';
import type { Fan, Category } from '../../shared/types.js';

export function getAllFans(category?: string, keyword?: string): Fan[] {
  let result = [...fans];

  if (category && category !== 'all') {
    result = result.filter(fan => fan.category === category);
  }

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    result = result.filter(fan =>
      fan.name.toLowerCase().includes(lowerKeyword) ||
      fan.description.toLowerCase().includes(lowerKeyword) ||
      fan.categoryName.toLowerCase().includes(lowerKeyword) ||
      fan.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  }

  return result;
}

export function getFanById(id: string): Fan | undefined {
  return fans.find(fan => fan.id === id);
}

export function getCategories(): Category[] {
  return categories;
}

export function getRelatedFans(currentFanId: string, limit: number = 3): Fan[] {
  const currentFan = fans.find(fan => fan.id === currentFanId);
  if (!currentFan) return [];

  return fans
    .filter(fan => fan.id !== currentFanId && fan.category === currentFan.category)
    .slice(0, limit);
}
