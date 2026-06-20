import type { Fan, Category, FanDetailResponse, ApiResponse, FilterOptionsResponse, FanFilters, FilterOption } from '@/types/fan';
import { mockFans } from '@/data/mockFans';

const API_BASE = '/api/fans';

const CATEGORIES: Category[] = [
  { value: 'all', label: '全部', description: '欣赏所有类型的扇子之美' },
  { value: 'round', label: '团扇', description: '形如满月，典雅端庄' },
  { value: 'folding', label: '折扇', description: '开合自如，风雅别致' },
  { value: 'feather', label: '羽扇', description: '羽扇纶巾，飘逸出尘' },
];

const DYNASTY_OPTIONS: FilterOption[] = [
  { value: 'shang', label: '商代' },
  { value: 'zhou', label: '周代' },
  { value: 'han', label: '汉代' },
  { value: 'sanguo', label: '三国' },
  { value: 'jin', label: '魏晋' },
  { value: 'tang', label: '唐代' },
  { value: 'song', label: '宋代' },
  { value: 'ming', label: '明代' },
  { value: 'qing', label: '清代' },
  { value: 'minguo', label: '民国' },
];

const MATERIAL_OPTIONS: FilterOption[] = [
  { value: 'silk', label: '丝绸' },
  { value: 'paper', label: '宣纸' },
  { value: 'bamboo', label: '竹' },
  { value: 'jade', label: '玉石' },
  { value: 'sandalwood', label: '檀香木' },
  { value: 'ivory', label: '象牙' },
  { value: 'kesi', label: '缂丝' },
  { value: 'gold', label: '金箔' },
  { value: 'feather', label: '羽毛' },
  { value: 'lacquer', label: '漆器' },
  { value: 'embroidery', label: '刺绣' },
];

const USAGE_OPTIONS: FilterOption[] = [
  { value: 'cooling', label: '纳凉消暑' },
  { value: 'ceremony', label: '礼仪仪仗' },
  { value: 'art', label: '书画艺术' },
  { value: 'collection', label: '收藏鉴赏' },
  { value: 'performance', label: '戏曲表演' },
  { value: 'dance', label: '舞蹈道具' },
  { value: 'gift', label: '馈赠佳品' },
  { value: 'wedding', label: '婚礼配饰' },
  { value: 'military', label: '军事谋略' },
  { value: 'religion', label: '宗教祭祀' },
];

function filterMockFans(filters: FanFilters = {}): Fan[] {
  const { category, keyword, dynasty, material, usage } = filters;
  let result = [...mockFans];

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

export async function fetchFans(filters: FanFilters = {}): Promise<Fan[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filterMockFans(filters));
    }, 300);
  });
}

export async function fetchFanDetail(id: string): Promise<FanDetailResponse> {
  const response = await fetch(`${API_BASE}/${id}`);
  const data: ApiResponse<FanDetailResponse> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch fan detail');
  }

  return data.data;
}

export async function fetchCategories(): Promise<Category[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(CATEGORIES);
    }, 200);
  });
}

export async function fetchFilterOptions(): Promise<FilterOptionsResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        dynasties: DYNASTY_OPTIONS,
        materials: MATERIAL_OPTIONS,
        usages: USAGE_OPTIONS,
      });
    }, 200);
  });
}
