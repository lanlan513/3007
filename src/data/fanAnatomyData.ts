export type FanComponentType = 'ribs' | 'pivot' | 'surface' | 'pendant' | 'handle';

export interface FanComponent {
  id: FanComponentType;
  name: string;
  icon: string;
  color: string;
  description: string;
  history: string;
  materials: {
    name: string;
    durability: number;
    aesthetics: number;
    cost: number;
    desc: string;
  }[];
  craftSteps: {
    step: number;
    title: string;
    detail: string;
  }[];
  cultureNotes: string[];
  explodeOffset: { x: number; y: number };
}

export interface FanStructure {
  id: string;
  name: string;
  fanType: 'folding' | 'round' | 'feather';
  era: string;
  components: FanComponentType[];
  baseStats: {
    durability: number;
    aesthetics: number;
    cost: number;
  };
  selectedMaterials: Record<FanComponentType, string>;
}

export const FAN_COMPONENTS: Record<FanComponentType, FanComponent> = {
  ribs: {
    id: 'ribs',
    name: '扇骨',
    icon: '🦴',
    color: '#9c763d',
    description: '扇骨是扇子的骨架支撑结构，由多根细长的骨片组成，一端汇聚于扇钉，另一端支撑扇面。折扇的扇骨分为大骨（外侧两根）和小骨（内侧多根），其数量、材质和造型直接决定扇子的品质与手感。',
    history: '扇骨起源于汉代，早期以竹木制作为主。唐宋时期扇骨工艺日趋精细，明清达到巅峰，出现象牙、玳瑁、紫檀等名贵材料，雕刻技法涵盖阴刻、阳刻、透雕、留青等多种工艺。',
    materials: [
      { name: '毛竹', durability: 72, aesthetics: 55, cost: 20, desc: '最传统的扇骨材料，质地坚韧，纹理清雅，经济实惠，适合日常使用。' },
      { name: '紫檀木', durability: 88, aesthetics: 92, cost: 95, desc: '名贵硬木，密度极高，色泽深沉，纹理如缎，为历代文人雅士所推崇。' },
      { name: '乌木', durability: 85, aesthetics: 88, cost: 80, desc: '阴沉木，质地坚实细腻，色黑如漆，触之不温，素有"东方神木"之称。' },
      { name: '象牙', durability: 78, aesthetics: 95, cost: 100, desc: '古代宫廷用扇首选，质地温润细腻，适合精细微雕，现代已禁用。' },
      { name: '檀香木', durability: 70, aesthetics: 90, cost: 75, desc: '香气淡雅持久，防虫防蛀，扇动时香气四溢，为"香扇"的主要材料。' },
    ],
    craftSteps: [
      { step: 1, title: '选材开料', detail: '选取三年以上的阴干毛竹或名贵硬木，按所需长度锯截成段，劈成粗坯。' },
      { step: 2, title: '烘烤定型', detail: '将竹骨置于炭火上缓慢烘烤，同时用手扳弯塑形，使扇骨呈自然弧度，烤至微黄后浸入冷水定型。' },
      { step: 3, title: '刮磨抛光', detail: '用刀将扇骨粗细两面刮平，再以砂纸从粗到细反复打磨，直至手感温润光滑。' },
      { step: 4, title: '钻孔锉肩', detail: '在扇骨下端钻扇钉孔，上端锉出"肩"——即扇骨由宽变窄的过渡部位，讲究方中有圆。' },
      { step: 5, title: '雕刻装饰', detail: '根据设计在大骨上进行雕刻、烫花、镶嵌等装饰，阴刻山水、阳刻诗文、留青花鸟各尽其妙。' },
      { step: 6, title: '配对成品', detail: '将打磨好的扇骨按粗细、色泽逐一配对，确保一副扇子的扇骨纹理谐调、重量均衡。' },
    ],
    cultureNotes: [
      '扇骨的"档"数是折扇的重要规格，9档、11档为男扇，16档、18档为女扇，30档以上为坤扇。',
      '明代文震亨《长物志》记载："姑苏最重书画扇，其骨以白竹、棕竹、乌木、紫白檀、湘妃、眉绿等为之。"',
      '清代造办处设有"扇作"，专门制作御用折扇，扇骨常以金银丝镶嵌、雕漆描金等工艺装饰。',
    ],
    explodeOffset: { x: -60, y: -40 },
  },
  pivot: {
    id: 'pivot',
    name: '扇钉',
    icon: '🔩',
    color: '#C9A959',
    description: '扇钉是贯穿所有扇骨下端的枢轴部件，是折扇能够开合转动的关键。虽不起眼，却承担着整把扇子的力学核心，扇钉的松紧和耐用度直接影响扇子的使用寿命。',
    history: '早期折扇以绳线捆扎为枢，宋代出现金属铆钉，明清两代扇钉工艺成熟，有铜钉、银钉、牛角钉等，钉帽常做成如意头、菊花、莲蓬等造型。',
    materials: [
      { name: '铜制', durability: 65, aesthetics: 60, cost: 25, desc: '最常见的扇钉材料，以黄铜为主，色泽温润，易于加工，日久形成自然包浆。' },
      { name: '银制', durability: 70, aesthetics: 85, cost: 70, desc: '较高级的扇钉，银钉柔软不伤扇骨，钉帽常錾刻花纹，清代贵族用扇多用之。' },
      { name: '牛角', durability: 85, aesthetics: 75, cost: 45, desc: '传统扇钉中的极品，牛角钉有弹性，开合手感极佳，且不会锈蚀磨损竹骨。' },
      { name: '金制', durability: 60, aesthetics: 98, cost: 100, desc: '宫廷御用扇钉，以纯金或K金制成，极度奢华，彰显身份，存世极少。' },
      { name: '赛璐珞', durability: 75, aesthetics: 50, cost: 15, desc: '近代工业材料，色彩丰富但质感较塑料，民国以后大量使用，经济实用。' },
    ],
    craftSteps: [
      { step: 1, title: '制钉坯', detail: '将铜片、银片或牛角片裁剪成小圆片，厚度约1.5-2毫米，直径略大于扇骨孔。' },
      { step: 2, title: '錾花造型', detail: '在钉帽表面以小錾子錾刻花纹，或用模具冲压出菊花、如意、云纹等造型。' },
      { step: 3, title: '制钉脚', detail: '将细铜丝或银丝截成段，一端略粗成"丁"字形，或直接将金属片卷成筒状。' },
      { step: 4, title: '组装穿钉', detail: '将扇骨按顺序排好对齐孔洞，穿入钉脚，正背面各放一片钉帽。' },
      { step: 5, title: '铆合固定', detail: '用小锤轻轻敲打钉脚两端，使其展开成蘑菇头状，将钉帽与扇骨牢牢铆合。' },
      { step: 6, title: '调试松紧', detail: '以手开合扇子，感受松紧度，过紧则用钉铳轻轻撑开，过松则继续敲铆，直至开合自如。' },
    ],
    cultureNotes: [
      '扇钉的松紧被称为"开合度"，上品折扇要求"开则半到位，合则不透缝"，全凭扇钉工艺掌控。',
      '牛角扇钉有"活钉"与"死钉"之分，活钉可拆卸更换扇面，死钉则永久固定。',
      '旧时修扇匠人有"换钉"绝活，更换扇钉而不损伤扇骨，是鉴定修扇师傅水平的试金石。',
    ],
    explodeOffset: { x: 0, y: 0 },
  },
  surface: {
    id: 'surface',
    name: '扇面',
    icon: '📜',
    color: '#C8102E',
    description: '扇面是扇子的"脸面"，是书画艺术与实用功能的完美结合。折扇扇面分"纸面"与"绢面"，其上可书可画可诗可印，使扇子从实用品升华为艺术品。',
    history: '折扇扇面始于北宋，以素纸为主。明代中期，吴门画派兴起，文人开始在扇面上题诗作画，"一字一画"折扇成为时尚，清代更发展出泥金、洒金、发绣等各式工艺扇面。',
    materials: [
      { name: '宣纸', durability: 60, aesthetics: 80, cost: 30, desc: '传统书画扇面的首选，以安徽泾县宣纸为佳，墨韵层次丰富，保存年代久远。' },
      { name: '杭纺绢', durability: 55, aesthetics: 90, cost: 65, desc: '杭州所产的细绢，质地轻薄透明，适合工笔重彩，明清宫廷用扇常以绢为面。' },
      { name: '泥金纸', durability: 58, aesthetics: 95, cost: 85, desc: '扇面通体饰以金箔，金碧辉煌，始于唐代，明清科举金榜题名时常以泥金扇相赠。' },
      { name: '发绣面', durability: 70, aesthetics: 100, cost: 98, desc: '以少女发丝为线在绢面上绣出图案，极其精细费工，为苏绣中最高技艺之一。' },
      { name: '高丽纸', durability: 65, aesthetics: 70, cost: 40, desc: '朝鲜半岛传入的坚韧纸张，纤维较长，耐磨耐折，适合日常使用。' },
    ],
    craftSteps: [
      { step: 1, title: '裁面折裥', detail: '将宣纸或绢裁成扇形，按扇骨档数折叠出均匀的裥痕，每折宽窄误差不超过0.5毫米。' },
      { step: 2, title: '刷胶托裱', detail: '扇面通常为两层纸托裱而成，以稀糊刷平，使扇面挺括而不脆，柔软而不塌。' },
      { step: 3, title: '书画创作', detail: '书画家在素面扇上挥毫泼墨，注意因势利导，构图需考虑扇面弧形的透视效果。' },
      { step: 4, title: '钤印题跋', detail: '画毕题款，再钤盖印章，印章的位置、大小、朱白均需斟酌，与书画相得益彰。' },
      { step: 5, title: '沿边包角', detail: '在扇面上端贴上绢质"沿边"防止磨损，两角包以绫绢"包角"，增加耐用度。' },
      { step: 6, title: '穿骨裱面', detail: '将每根扇骨逐一插入扇面折裥中，以浆糊粘合扇面两侧与大骨，晾干压平。' },
    ],
    cultureNotes: [
      '"文人扇"讲究一面绘画一面题字，称"画一面，书一面"，两面皆出自名家则身价倍增。',
      '明代唐寅、文徵明，清代郑板桥、任伯年，近代张大千、齐白石都是扇面创作大家。',
      '扇面有"成扇"与"扇面册页"之分，后者是将扇面拆下装裱成册，便于收藏欣赏。',
    ],
    explodeOffset: { x: 60, y: -60 },
  },
  pendant: {
    id: 'pendant',
    name: '坠饰',
    icon: '💎',
    color: '#7D9B6A',
    description: '坠饰系于扇柄下端，既是装饰，也有实用功能——持扇时将扇坠套于指上，可防止扇子滑落。坠饰材质繁多，造型各异，是整套扇子品味的点睛之笔。',
    history: '扇坠源于唐代香囊，宋代成为固定配饰，明清时大为流行，从简单的玉牌到复杂的宫灯造型，无不精巧。《红楼梦》中就有多处关于扇坠的描写。',
    materials: [
      { name: '和田玉', durability: 90, aesthetics: 95, cost: 90, desc: '温润内敛的君子之石，玉坠题材有福瓜、白菜、玉鱼等，寓意吉祥。' },
      { name: '翡翠', durability: 85, aesthetics: 92, cost: 95, desc: '翠色欲滴，明清以来深受喜爱，老坑冰种满绿扇坠价值连城。' },
      { name: '蜜蜡琥珀', durability: 60, aesthetics: 85, cost: 60, desc: '质地轻盈，色泽温暖，手搓生香，内有昆虫或花珀者更为珍贵。' },
      { name: '琉璃料器', durability: 70, aesthetics: 78, cost: 35, desc: '老琉璃色彩斑斓，清代宫廷造办处"官料"最为精致，价格亲民。' },
      { name: '景泰蓝', durability: 75, aesthetics: 82, cost: 55, desc: '铜胎掐丝珐琅，金碧辉煌，多做成宫灯、花篮、葫芦等镂空造型。' },
    ],
    craftSteps: [
      { step: 1, title: '选料设计', detail: '根据玉、石、料的质地色泽设计造型，避开绺裂瑕疵，"量料取材，因材施艺"。' },
      { step: 2, title: '粗坯勾勒', detail: '用工具在原料上勾勒出大致轮廓，去除多余部分，做出造型的大形。' },
      { step: 3, title: '细琢精雕', detail: '用各种砣具、刻刀进行精细雕刻，琢磨出纹饰细节，讲究"图必有意，意必吉祥"。' },
      { step: 4, title: '打磨抛光', detail: '从粗砂到细砂逐级打磨，最后用竹板牛皮抛光，使坠饰表面温润有光。' },
      { step: 5, title: '钻孔穿系', detail: '在坠饰顶端钻牛鼻孔或直孔，穿入线绳，编上盘长结、吉祥结等传统结艺。' },
      { step: 6, title: '流苏配饰', detail: '在结下配以真丝流苏，颜色与扇面协调，垂顺飘逸，增添动感。' },
    ],
    cultureNotes: [
      '扇坠的结艺有严格讲究，常用的有"八吉结"（盘长）、"方胜结"、"如意结"，每一种都有吉祥寓意。',
      '《金瓶梅》中西门庆拿的扇子上挂着"金灯笼坠子"，《桃花扇》李香君的扇坠是"一方汉玉"，反映了人物身份。',
      '民国时期上海滩时髦小姐的团扇上，常挂着由银链条串起的小玉牌、小铃铛组合坠饰。',
    ],
    explodeOffset: { x: 0, y: 80 },
  },
  handle: {
    id: 'handle',
    name: '扇柄',
    icon: '🪵',
    color: '#6b5b42',
    description: '扇柄是持握的部分，团扇的扇柄较长，常伸出扇面之外；折扇的柄则是扇骨下端的聚合部分。柄的造型直接影响持扇手感，是人体工学与审美的结合。',
    history: '最早的扇子以竹木为柄，战国时期出现髹漆柄，唐代有金银平脱柄，宋代团扇柄以象牙、玳瑁为贵，明清折扇柄的造型则有燕尾、如意、葫芦等各种款式。',
    materials: [
      { name: '湘妃竹', durability: 75, aesthetics: 92, cost: 70, desc: '带有天然泪斑纹的珍贵竹种，斑纹越清晰越密为上品，有"一寸湘妃一寸金"之说。' },
      { name: '梅鹿竹', durability: 78, aesthetics: 88, cost: 65, desc: '斑纹如梅花鹿毛的竹材，较湘妃竹更大气，斑片层叠似山水，清雅脱俗。' },
      { name: '红木髹漆', durability: 90, aesthetics: 80, cost: 50, desc: '木胎外髹多层大漆，经久耐用，漆色有朱红、犀皮、螺钿、描金等各种工艺。' },
      { name: '棕竹', durability: 82, aesthetics: 72, cost: 35, desc: '细密如棕丝的竹材，色深质沉，朴实无华，是明代文人所推崇的"怀袖雅物"。' },
      { name: '缠枝珐琅', durability: 80, aesthetics: 94, cost: 88, desc: '铜胎上以珐琅彩绘制缠枝莲、西番莲等纹饰，华丽隆重，为宫廷庆典所用。' },
    ],
    craftSteps: [
      { step: 1, title: '选料取直', detail: '选取粗细均匀、无节无裂的竹段或木段，校直干燥，含水率控制在8-12%。' },
      { step: 2, title: '打坯成型', detail: '按设计造型削出柄的大形，团扇柄上端削成扁榫以插入扇框，折扇柄则修整扇骨尾部。' },
      { step: 3, title: '髹漆刻花', detail: '如需髹漆则需反复上漆打磨数十遍；如需刻花则以阴刻、阳刻、透雕等技法装饰柄身。' },
      { step: 4, title: '抛光上蜡', detail: '以麂皮蘸核桃油反复擦拭柄身，或烫上蜂蜡，使柄体温润光滑，日久生包浆。' },
      { step: 5, title: '端首装饰', detail: '柄的末端常做"首"——如意头、灵芝、寿桃等造型，也有镶嵌宝石、玉片的做法。' },
      { step: 6, title: '组装衔接', detail: '团扇柄插入扇框榫眼，以胶或木楔固定；折扇则与扇骨一体，仅尾部造型。' },
    ],
    cultureNotes: [
      '团扇柄有"通柄"（柄长贯穿上下）与"半柄"（柄短只插入一部分）之分，前者坚固后者灵秀。',
      '唐代周昉《簪花仕女图》中，贵妇手持的团扇柄就是典型的长通柄，柄尾垂着红色结饰。',
      '折扇的大骨末端造型被称为"头型"，常见的有和尚头、燕尾头、如意头、葫芦头、菊花头等数十种。',
    ],
    explodeOffset: { x: 0, y: 60 },
  },
};

export const PRESET_FANS: FanStructure[] = [
  {
    id: 'classic-folding',
    name: '文竹折扇',
    fanType: 'folding',
    era: '明代文人风格',
    components: ['ribs', 'pivot', 'surface', 'pendant'],
    baseStats: { durability: 68, aesthetics: 75, cost: 55 },
    selectedMaterials: {
      ribs: '毛竹',
      pivot: '牛角',
      surface: '宣纸',
      pendant: '蜜蜡琥珀',
      handle: '棕竹',
    },
  },
  {
    id: 'court-round',
    name: '宫制团扇',
    fanType: 'round',
    era: '清代宫廷制式',
    components: ['handle', 'surface', 'pendant'],
    baseStats: { durability: 62, aesthetics: 90, cost: 82 },
    selectedMaterials: {
      ribs: '紫檀木',
      pivot: '银制',
      surface: '杭纺绢',
      pendant: '和田玉',
      handle: '湘妃竹',
    },
  },
  {
    id: 'luxury-folding',
    name: '紫檀雕骨折扇',
    fanType: 'folding',
    era: '乾隆朝风格',
    components: ['ribs', 'pivot', 'surface', 'pendant', 'handle'],
    baseStats: { durability: 82, aesthetics: 96, cost: 95 },
    selectedMaterials: {
      ribs: '紫檀木',
      pivot: '金制',
      surface: '发绣面',
      pendant: '翡翠',
      handle: '红木髹漆',
    },
  },
];

export function calculateStats(
  structure: FanStructure,
  components: Record<FanComponentType, FanComponent>
): { durability: number; aesthetics: number; cost: number } {
  let d = 0, a = 0, c = 0, count = 0;
  
  structure.components.forEach(compId => {
    const comp = components[compId];
    const matName = structure.selectedMaterials[compId];
    const mat = comp.materials.find(m => m.name === matName);
    if (mat) {
      const weight = compId === 'ribs' ? 1.3 : compId === 'surface' ? 1.2 : 1;
      d += mat.durability * weight;
      a += mat.aesthetics * weight;
      c += mat.cost * weight;
      count += weight;
    }
  });

  if (count === 0) return structure.baseStats;
  
  return {
    durability: Math.min(100, Math.round((d / count) * 0.7 + structure.baseStats.durability * 0.3)),
    aesthetics: Math.min(100, Math.round((a / count) * 0.7 + structure.baseStats.aesthetics * 0.3)),
    cost: Math.min(100, Math.round((c / count) * 0.7 + structure.baseStats.cost * 0.3)),
  };
}
