import type { Artwork, Comment, ArtCategory } from '../../shared/types.js';

export const artCategoryMap: Record<ArtCategory, string> = {
  calligraphy: '书法扇面',
  landscape: '山水扇面',
  'flower-bird': '花鸟扇面',
  figure: '人物扇面',
  abstract: '写意扇面',
  other: '其他扇面',
};

let nextId = 7;
let nextCommentId = 10;

export const artworks: Artwork[] = [
  {
    id: 'art-1',
    title: '兰亭序行书扇面',
    author: '墨韵山人',
    category: 'calligraphy',
    categoryName: '书法扇面',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20calligraphy%20fan%20painting%2C%20elegant%20running%20script%20Lanting%20Xu%20on%20round%20silk%20fan%2C%20black%20ink%20on%20cream%20silk%2C%20traditional%20oriental%20art%2C%20museum%20quality%2C%20soft%20warm%20lighting&image_size=square_hd',
    description: '以行书书写王羲之兰亭序节选，笔势飘逸，气韵生动，尽显书圣风骨。',
    likes: 128,
    commentCount: 2,
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'art-2',
    title: '烟雨江南山水扇',
    author: '云水间',
    category: 'landscape',
    categoryName: '山水扇面',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20ink%20wash%20landscape%20fan%20painting%2C%20misty%20Jiangnan%20water%20town%2C%20willow%20trees%20and%20bridges%2C%20on%20folding%20fan%20surface%2C%20traditional%20oriental%20painting%2C%20ethereal%20atmosphere%2C%20soft%20lighting&image_size=square_hd',
    description: '水墨晕染江南烟雨，小桥流水人家，意境悠远，如入画中。',
    likes: 256,
    commentCount: 3,
    createdAt: '2025-02-10T14:30:00Z',
  },
  {
    id: 'art-3',
    title: '富贵牡丹团扇',
    author: '花间集',
    category: 'flower-bird',
    categoryName: '花鸟扇面',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20gongbi%20flower%20bird%20fan%20painting%2C%20rich%20pink%20peony%20with%20butterflies%20on%20round%20silk%20fan%2C%20intricate%20detail%2C%20traditional%20oriental%20art%2C%20vibrant%20colors%2C%20museum%20quality%2C%20soft%20lighting&image_size=square_hd',
    description: '工笔重彩绘牡丹，花瓣层层叠叠，蝴蝶翩翩起舞，富贵吉祥之意扑面而来。',
    likes: 189,
    commentCount: 2,
    createdAt: '2025-03-05T09:15:00Z',
  },
  {
    id: 'art-4',
    title: '禅意写意荷扇',
    author: '一叶知秋',
    category: 'abstract',
    categoryName: '写意扇面',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20freehand%20ink%20painting%20lotus%20fan%2C%20minimalist%20Zen%20style%2C%20sparse%20ink%20strokes%20of%20lotus%20leaf%20and%20flower%2C%20large%20white%20space%2C%20contemplative%20oriental%20aesthetic%2C%20rice%20paper%20texture&image_size=square_hd',
    description: '大写意画荷，寥寥数笔，留白深远，禅意悠然，意在笔先。',
    likes: 342,
    commentCount: 3,
    createdAt: '2025-04-20T16:45:00Z',
  },
  {
    id: 'art-5',
    title: '仕女图折扇',
    author: '丹青客',
    category: 'figure',
    categoryName: '人物扇面',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20figure%20painting%20fan%2C%20elegant%20Tang%20dynasty%20court%20lady%20holding%20round%20fan%2C%20gongbi%20style%2C%20flowing%20silk%20dress%2C%20on%20folding%20fan%20surface%2C%20oriental%20classical%20beauty%2C%20soft%20warm%20lighting&image_size=square_hd',
    description: '工笔仕女图，唐代宫廷贵妇执扇纳凉，衣袂飘飘，雍容华贵。',
    likes: 175,
    commentCount: 0,
    createdAt: '2025-05-08T11:20:00Z',
  },
  {
    id: 'art-6',
    title: '梅兰竹菊四条屏扇',
    author: '清风雅集',
    category: 'flower-bird',
    categoryName: '花鸟扇面',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20four%20gentlemen%20fan%20painting%2C%20plum%20orchid%20bamboo%20chrysanthemum%20ink%20painting%20on%20four%20folding%20fans%20display%2C%20scholarly%20literati%20style%2C%20elegant%20oriental%20art%2C%20soft%20natural%20lighting&image_size=square_hd',
    description: '四把折扇分绘梅兰竹菊，笔墨清雅，各具风骨，合为四君子，文人气质尽显。',
    likes: 210,
    commentCount: 0,
    createdAt: '2025-06-01T08:00:00Z',
  },
];

export const comments: Comment[] = [
  { id: 'c-1', artworkId: 'art-1', author: '书法爱好者', content: '行书笔力遒劲，颇有右军遗风！', createdAt: '2025-02-01T12:00:00Z' },
  { id: 'c-2', artworkId: 'art-1', author: '墨客', content: '扇面行书最难，此作气韵连贯，难得佳作。', createdAt: '2025-02-05T14:30:00Z' },
  { id: 'c-3', artworkId: 'art-2', author: '山水画迷', content: '烟雨朦胧之感表现得淋漓尽致！', createdAt: '2025-03-10T09:00:00Z' },
  { id: 'c-4', artworkId: 'art-2', author: '画中有诗', content: '留白恰到好处，意境深远。', createdAt: '2025-03-12T16:20:00Z' },
  { id: 'c-5', artworkId: 'art-2', author: '江南客', content: '让人想起"小楼一夜听春雨"的意境。', createdAt: '2025-03-15T11:00:00Z' },
  { id: 'c-6', artworkId: 'art-3', author: '工笔画粉', content: '工笔精细入微，色彩富丽堂皇！', createdAt: '2025-04-01T10:00:00Z' },
  { id: 'c-7', artworkId: 'art-3', author: '花卉爱好者', content: '牡丹画得雍容华贵，蝴蝶栩栩如生。', createdAt: '2025-04-05T15:30:00Z' },
  { id: 'c-8', artworkId: 'art-4', author: '禅修者', content: '大写意的最高境界——看似无意，实则匠心独运。', createdAt: '2025-05-10T13:00:00Z' },
  { id: 'c-9', artworkId: 'art-4', author: '水墨玩家', content: '留白太妙了，让人心旷神怡。', createdAt: '2025-05-12T09:45:00Z' },
  { id: 'c-10', artworkId: 'art-4', author: '国画学生', content: '寥寥数笔，意境全出，学习了！', createdAt: '2025-05-15T17:20:00Z' },
];

export function getNextId(): string {
  return `art-${nextId++}`;
}

export function getNextCommentId(): string {
  return `c-${nextCommentId++}`;
}
