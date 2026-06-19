import { fans, categories, dynastyOptions, materialOptions, usageOptions } from '../data/fans.js';
import type { Fan, Category, FilterOption, FanFilters } from '../../shared/types.js';

export function getAllFans(filters: FanFilters = {}): Fan[] {
  const { category, keyword, dynasty, material, usage } = filters;
  let result = [...fans];

  if (category && category !== 'all') {
    result = result.filter(fan => fan.category === category);
  }

  if (dynasty) {
    result = result.filter(fan => fan.popularDynasties.includes(dynasty));
  }

  if (material) {
    result = result.filter(fan => fan.materials.includes(material));
  }

  if (usage) {
    result = result.filter(fan => fan.usages.includes(usage));
  }

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    result = result.filter(fan =>
      fan.name.toLowerCase().includes(lowerKeyword) ||
      fan.description.toLowerCase().includes(lowerKeyword) ||
      fan.categoryName.toLowerCase().includes(lowerKeyword) ||
      fan.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)) ||
      fan.origin.toLowerCase().includes(lowerKeyword)
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

export function getDynastyOptions(): FilterOption[] {
  return dynastyOptions;
}

export function getMaterialOptions(): FilterOption[] {
  return materialOptions;
}

export function getUsageOptions(): FilterOption[] {
  return usageOptions;
}

export function getFilterOptions(): { dynasties: FilterOption[]; materials: FilterOption[]; usages: FilterOption[] } {
  return {
    dynasties: dynastyOptions,
    materials: materialOptions,
    usages: usageOptions,
  };
}

export function getRelatedFans(currentFanId: string, limit: number = 3): Fan[] {
  const currentFan = fans.find(fan => fan.id === currentFanId);
  if (!currentFan) return [];

  if (currentFan.relatedFanIds && currentFan.relatedFanIds.length > 0) {
    return fans
      .filter(fan => currentFan.relatedFanIds!.includes(fan.id))
      .slice(0, limit);
  }

  return fans
    .filter(fan => fan.id !== currentFanId && fan.category === currentFan.category)
    .slice(0, limit);
}
