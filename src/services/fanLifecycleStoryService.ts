import type {
  Fan,
  FanLifeStory,
  LifecycleEvent,
  HistoricalFigure,
} from '@/types/fan';
import { LIFECYCLE_STAGE_INFO, PRESERVATION_GRADES } from '@/types/fan';
import { historicalFigures } from '@/data/historicalFigures';
import { mockFans as allFans } from '@/data/mockFans';

const DYNASTY_YEAR_MAP: Record<string, { start: number; end: number }> = {
  '商代': { start: -1600, end: -1046 },
  '周代': { start: -1046, end: -256 },
  '先秦': { start: -221, end: -206 },
  '汉代': { start: -206, end: 220 },
  '三国': { start: 220, end: 280 },
  '魏晋': { start: 265, end: 420 },
  '南北朝': { start: 420, end: 589 },
  '唐代': { start: 618, end: 907 },
  '宋代': { start: 960, end: 1279 },
  '元代': { start: 1271, end: 1368 },
  '明代': { start: 1368, end: 1644 },
  '清代': { start: 1636, end: 1912 },
  '民国': { start: 1912, end: 1949 },
};

function getDynastyYears(dynasty: string): { start: number; end: number } {
  return DYNASTY_YEAR_MAP[dynasty] || { start: 1000, end: 1900 };
}

function formatYear(year: number): string {
  if (year < 0) {
    return `公元前${Math.abs(year)}年`;
  }
  return `公元${year}年`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const CREATION_LOCATIONS: Record<string, string[]> = {
  '江苏苏州': ['苏州阊门外制扇坊', '苏州桃花坞工坊', '苏州平江路古扇铺'],
  '浙江杭州': ['杭州王星记扇庄', '杭州西湖畔扇坊', '杭州清河坊老铺'],
  '安徽泾县': ['泾县宣纸作坊', '皖南竹编工坊'],
  '北京': ['清宫造办处', '北京琉璃厂扇斋', '内务府造扇处'],
  '湖北襄阳': ['襄阳古隆中铁匠铺', '荆州古城扇肆'],
  '云南': ['滇南孔雀翎工坊', '大理白族扇艺社'],
  '湖南九嶷山': ['九嶷山竹海人家', '湘妃祠旁制扇处'],
  '湖南湘潭': ['湘潭古城油纸扇铺', '湘江之滨扇坊'],
  '四川成都': ['蜀锦坊侧竹编铺', '成都锦里古扇坊'],
  '广东广州': ['广州十三行外销扇坊', '岭南火画扇工艺社'],
};

function getCreationLocation(origin: string): string {
  const locations = CREATION_LOCATIONS[origin] || [
    `${origin}古扇作坊`,
    `${origin}制扇人家`,
    `${origin}老字号扇铺`,
  ];
  return randomPick(locations);
}

const ARTISAN_NAMES = [
  '张阿公', '李墨匠', '王丝娘', '赵竹翁', '陈缂丝',
  '刘扇痴', '周玉工', '吴漆匠', '郑笔生', '孙织娘',
  '老匠人陈福', '扇艺大师柳生', '制扇名家苏台', '玉工何阿婆',
];

function generateCreationEvent(fan: Fan, creationYear: number): LifecycleEvent {
  const years = getDynastyYears(fan.dynasty);
  const actualYear = creationYear || randomInt(years.start, years.end);
  const location = getCreationLocation(fan.origin);
  const artisan = randomPick(ARTISAN_NAMES);

  let creationProcess = '';
  if (fan.category === 'round') {
    creationProcess = `${artisan}精选${fan.materials.join('与')}，取${fan.origin}的上好材料，历时三月方成。`;
  } else if (fan.category === 'folding') {
    creationProcess = `${artisan}选${fan.materials.join('、')}为骨，配${fan.origin}上好纸绢为面，经劈、削、磨、装等十八道工序精制而成。`;
  } else {
    creationProcess = `${artisan}亲选${fan.materials.join('与')}，以${fan.categoryName}之古法，精心编排、一丝不苟，方成此扇。`;
  }

  return {
    id: `${fan.id}-creation`,
    stage: 'creation',
    stageName: LIFECYCLE_STAGE_INFO.creation.name,
    period: fan.dynasty,
    year: formatYear(actualYear),
    yearNumeric: actualYear,
    title: `${fan.name}诞生`,
    description: `${fan.dynasty}年间，${location}中，${creationProcess}扇面绘${fan.tags.join('、')}，寓意吉祥。刚制成时便引得邻里赞叹，皆称此扇日后必成大器。`,
    location,
    protagonist: artisan,
    emotionalTone: 'joyful',
    historicalSignificance: `${fan.name}的诞生，凝聚了${fan.dynasty}时期${fan.origin}制扇工艺的最高水准，为日后的传奇经历埋下伏笔。`,
    tags: ['诞生', '制扇', fan.categoryName, fan.dynasty],
    icon: '🎨',
    color: 'vermilion',
  };
}

function findRelatedFigures(fan: Fan): HistoricalFigure[] {
  return historicalFigures.filter((fig) => {
    const figFanTypes = fig.signatureFanType ? [fig.signatureFanType] : [];
    const matchesFanCategory = figFanTypes.includes(fan.category);
    const matchesDynasty = fig.dynasty === fan.dynasty || fan.popularDynasties?.some((d) => d.includes(fig.dynasty.slice(0, 1)));
    const hasRelatedStory = fig.fanStories.some((s) => s.fanType === fan.category || s.relatedFanId === fan.id);
    return matchesFanCategory || matchesDynasty || hasRelatedStory;
  });
}

function generateFamousEncounter(fan: Fan, figures: HistoricalFigure[], baseYear: number): LifecycleEvent | null {
  if (figures.length === 0) return null;

  const figure = randomPick(figures);
  const encounterYear = baseYear + randomInt(5, 50);
  const encounterPeriod = figure.dynasty;

  const encounterDescriptions = [
    `${figure.name}偶游${fan.origin}，于市集之上见此扇，惊为天物，当即以重金购得。此后${figure.courtesyName || figure.name}每每持此扇会客，常谓：\"吾有此扇，胜得千金。\"`,
    `${figure.name}途经${fan.origin}，夜宿古寺，得梦仙人授扇。翌日天明，恰见此扇于市井之中，遂如梦中所言，将其请入府中，珍藏于书房。`,
    `${fan.origin}地方官将${fan.name}作为贡品献入宫中。${figure.name}一见此扇，爱不释手，遂命左右：\"此扇当与吾相伴终生，须臾不可离也。\"`,
  ];

  const significanceDescriptions = [
    `${figure.name}与此扇的相遇，成为一段文坛佳话。${figure.courtesyName || figure.name}在此扇上留下的翰墨，更使其身价倍增。`,
    `${figure.name}的持扇形象深入人心，\"${figure.name}持扇\"从此成为经典意象，屡屡出现在后世的绘画、戏曲之中。`,
    `自此之后，${fan.name}便与${figure.name}的名字紧紧联系在一起。人因扇雅，扇因人贵，成就了一段物与人的传奇。`,
  ];

  return {
    id: `${fan.id}-encounter-${figure.id}`,
    stage: 'famous_encounter',
    stageName: LIFECYCLE_STAGE_INFO.famous_encounter.name,
    period: encounterPeriod,
    year: formatYear(encounterYear),
    yearNumeric: encounterYear,
    title: `遇${figure.name}`,
    description: randomPick(encounterDescriptions),
    location: fan.origin,
    protagonist: figure.name,
    protagonistId: figure.id,
    relatedFigureName: figure.name,
    emotionalTone: 'serene',
    historicalSignificance: randomPick(significanceDescriptions),
    tags: ['名士', figure.name, fan.dynasty, '相遇'],
    icon: '🤝',
    color: 'bamboo',
  };
}

function generateFirstOwner(fan: Fan, creationYear: number): LifecycleEvent {
  const owner = randomPick([
    `${fan.dynasty}皇室宗亲`,
    `当朝显贵大臣`,
    `${fan.origin}地方名门望族`,
    `江南富商大贾`,
    `翰林院大学士`,
  ]);
  const firstOwnerYear = creationYear + randomInt(1, 5);

  return {
    id: `${fan.id}-first-owner`,
    stage: 'first_owner',
    stageName: LIFECYCLE_STAGE_INFO.first_owner.name,
    period: fan.dynasty,
    year: formatYear(firstOwnerYear),
    yearNumeric: firstOwnerYear,
    title: `初归${owner}`,
    description: `${fan.name}制成之后，被${owner}以重金购得。主人珍爱异常，夏日必持以纳凉，冬月则以锦匣珍藏，每遇贵客必出示赏玩。此扇在主人府中度过了最初的岁月，渐渐养出温润之气。`,
    location: fan.origin,
    protagonist: owner,
    emotionalTone: 'joyful',
    historicalSignificance: `${fan.name}的第一位主人奠定了此扇\"重器\"的地位。经名家收藏，${fan.categoryName}的价值从此不仅仅在于工艺，更在于其所承载的文化品味。`,
    tags: ['收藏', owner, fan.dynasty],
    icon: '👑',
    color: 'gold',
  };
}

function generateHistoricalEvent(fan: Fan, baseYear: number): LifecycleEvent {
  const year = baseYear + randomInt(60, 200);

  const historicalScenarios = [
    {
      period: '朝代更迭',
      title: '离乱飘零',
      description: '朝代更迭之际，战乱频仍，山河变色。此扇在乱世中辗转流离，数易其主，一度流落民间。然于颠沛之中，竟奇迹般保存完好，似有神灵护佑。',
      tone: 'dramatic' as const,
      significance: '乱世的磨砺使此扇沾染了人间烟火之气，每一道细微的磨损都在诉说着历史的沧桑。它不仅是一件艺术品，更是时代动荡的见证者。',
      icon: '⚔️',
    },
    {
      period: '科举盛典',
      title: '金榜题名时',
      description: '某年科举大比，此扇主人之子携扇入京赴考。放榜之日，高中进士。归乡之后，大宴宾客，特将此扇悬于中堂，谓之日：\"吾家此扇，真乃祥瑞之物也！\"',
      tone: 'joyful' as const,
      significance: `科举制度下，${fan.name}成为家族荣耀的象征。其上凝聚的不仅是书香之气，更是寒门子弟对改变命运的美好期许。`,
      icon: '🎊',
    },
    {
      period: '宫廷大典',
      title: '入宫觐见',
      description: '某年皇帝万寿，此扇被选作贡品进献宫中。帝后见之，龙颜大悦，特命将其藏于内府珍宝阁，与传世名瓷、古书画并列。',
      tone: 'heroic' as const,
      significance: '入宫觐见是此扇身份的象征。从民间作坊到帝王内府，${fan.name}完成了从日用器物到国之珍宝的飞跃。',
      icon: '🏛️',
    },
    {
      period: '国运维艰',
      title: '南迁之路',
      description: '北方战乱，王室南迁。此扇随主人跋山涉水，历经艰险。途中曾遗失于途，后被好心人拾得，辗转送还。自此主人更加珍惜，随身携带，片刻不离。',
      tone: 'melancholic' as const,
      significance: '南迁之路是此扇生命中一段重要的旅程。山河破碎，物是人非，唯有此扇依旧，承载着故园之思与家国之情。',
      icon: '🌊',
    },
    {
      period: '商贾贸易',
      title: '漂洋过海',
      description: '海禁开放，商路畅通。此扇被一位来华经商的外国商人看中，以重金购得。它随商船漂洋过海，在遥远的国度成为东方文明的使者，引得外国贵族惊叹不已。',
      tone: 'mysterious' as const,
      significance: `${fan.name}的海外之旅见证了海上丝绸之路的繁荣。一把小小的扇子，成为中外文化交流的纽带，向世界展示了中华文明的精美绝伦。`,
      icon: '⛵',
    },
  ];

  const scenario = randomPick(historicalScenarios);

  return {
    id: `${fan.id}-historical-${year}`,
    stage: 'historical_event',
    stageName: LIFECYCLE_STAGE_INFO.historical_event.name,
    period: scenario.period,
    year: formatYear(year),
    yearNumeric: year,
    title: scenario.title,
    description: scenario.description,
    location: randomPick([`${fan.origin}古城`, '京城大内', '江南水乡', '海外异域', '南迁途中']),
    emotionalTone: scenario.tone,
    historicalSignificance: scenario.significance,
    tags: ['历史', scenario.period, '见证'],
    icon: scenario.icon,
    color: 'ink',
  };
}

function generateScholarlyAffair(fan: Fan, figures: HistoricalFigure[], baseYear: number): LifecycleEvent | null {
  const literaryFigures = figures.filter((f) => f.tags.some((t) => ['画家', '书法家', '诗人', '文人'].includes(t)));
  if (literaryFigures.length === 0) {
    literaryFigures.push(...historicalFigures.filter((f) => ['唐寅', '文徵明', '沈周'].includes(f.name)));
  }
  if (literaryFigures.length === 0) return null;

  const fig = randomPick(literaryFigures);
  const year = baseYear + randomInt(30, 100);

  const affairs = [
    {
      title: `${fig.name}画扇`,
      description: `${fig.courtesyName || fig.name}雅集之上，友人出示此扇，请其作画。${fig.name}欣然应允，索笔研墨，须臾之间，于扇面挥就${fan.tags[0] || '山水'}一幅。但见笔墨淋漓，意境深远，一座皆叹。`,
      significance: `文人画与${fan.categoryName}的完美结合。${fig.name}在扇面上留下的翰墨，使此扇从一件工艺品升华为艺术品，价值倍增。`,
    },
    {
      title: `${fig.name}题扇`,
      description: `${fig.courtesyName || fig.name}于友人斋中见此扇，把玩良久，欣然在扇面空白处题诗一首：\"${fan.origin}山秀气钟，${fan.categoryName}摇动晚风生。裁得冰纨月样圆，招凉不用水晶宫。\"书毕，一座称妙。`,
      significance: `名家题字是${fan.categoryName}文化价值的重要来源。一首好诗、一笔好字，往往能使一把扇子脱胎换骨，流传千古。`,
    },
    {
      title: `雅集传扇`,
      description: `${fig.dynasty}某年春，${fig.name}与友人于${fan.origin}某园林雅集。座中文人墨客轮流赏玩此扇，各抒己见，或赋诗，或题字，或品评。一日之间，扇面添满了文人的笔迹，成为一次盛会的永恒纪念。`,
      significance: `雅集是古代文人的重要社交方式，而${fan.categoryName}在其中扮演了重要角色。它既是审美对象，又是情感的载体，见证了文人之间深厚的情谊。`,
    },
  ];

  const affair = randomPick(affairs);

  return {
    id: `${fan.id}-scholarly-${fig.id}`,
    stage: 'scholarly_affair',
    stageName: LIFECYCLE_STAGE_INFO.scholarly_affair.name,
    period: fig.dynasty,
    year: formatYear(year),
    yearNumeric: year,
    title: affair.title,
    description: affair.description,
    location: `${fan.origin}${randomPick(['园林', '雅集', '书斋', '文士会馆'])}`,
    protagonist: fig.name,
    protagonistId: fig.id,
    relatedFigureName: fig.name,
    emotionalTone: 'serene',
    historicalSignificance: affair.significance,
    tags: ['雅集', fig.name, fan.dynasty, '书画'],
    icon: '📚',
    color: 'bamboo',
  };
}

function generateInheritance(fan: Fan, baseYear: number): LifecycleEvent {
  const year = baseYear + randomInt(150, 350);

  const inheritances = [
    {
      title: '传家之宝',
      description: '此扇在一个家族中代代相传，历经数世而不失。每一代传人都在扇盒之上留下印记，或钤印，或题字。每一个印记背后，都有一段家族故事。至清末传至第十代，家道中落，此扇方从家中流出。',
      tone: 'serene' as const,
      significance: `世守之物，必含深情。${fan.name}在一个家族中传承数百年，其所承载的已不仅是艺术价值，更是一个家族的历史记忆与血脉传承。`,
    },
    {
      title: '嫁女之奁',
      description: '某富贵人家嫁女，以此扇作为嫁妆的一部分。新娘子从小便听母亲讲述此扇的故事，临嫁之时，母亲亲手将扇盒交给她，嘱咐她要像珍惜自己的幸福一样珍惜此扇。此扇遂伴随新娘开始了新的人生。',
      tone: 'joyful' as const,
      significance: `在传统社会中，${fan.categoryName}常作为嫁妆出现，寓意\"散（扇）子散孙\"、开枝散叶。一把扇子，寄托着长辈对晚辈的美好祝愿。`,
    },
    {
      title: '师徒相授',
      description: '一位制扇老匠人，临终前将此扇传给最得意的弟子。他说：\"此扇乃我毕生所见最佳，你日后制扇，当以此扇为师。\"弟子含泪接过，日后果然成为一代宗师，其所制之扇皆有${fan.name}的神韵。',
      tone: 'serene' as const,
      significance: `师徒相授是传统手工艺传承的重要方式。${fan.name}在这一过程中，成为工艺精神的载体，连接着过去与未来。`,
    },
  ];

  const inheritance = randomPick(inheritances);

  return {
    id: `${fan.id}-inheritance-${year}`,
    stage: 'inheritance',
    stageName: LIFECYCLE_STAGE_INFO.inheritance.name,
    period: '世代传承',
    year: formatYear(year),
    yearNumeric: year,
    title: inheritance.title,
    description: inheritance.description,
    location: `${fan.origin}${randomPick(['世家大族', '书香门第', '匠人之家'])}`,
    emotionalTone: inheritance.tone,
    historicalSignificance: inheritance.significance,
    tags: ['传承', '家族', fan.dynasty, '岁月'],
    icon: '🏮',
    color: 'vermilion',
  };
}

function generateLossRediscovery(fan: Fan, baseYear: number): LifecycleEvent {
  const year = baseYear + randomInt(400, 700);

  const rediscoveries = [
    {
      title: '故宅重光',
      description: '某年，某地翻修一座百年老宅，工人在夹墙之中发现一个尘封的锦匣。打开一看，正是此扇！虽然锦匣已经朽坏，但扇子因密封得法，保存完好，色泽如新。消息传出，轰动一时。',
      tone: 'mysterious' as const,
      significance: '所谓\"文物有灵\"，正是如此。一把扇子，在黑暗中沉睡百年，一朝重见天日，仿佛是穿越时光而来，向今人诉说着往昔的故事。',
    },
    {
      title: '海外归来',
      description: '此扇于清末乱世流失海外，几经辗转，被外国收藏家购得。直至近年，一位爱国华商在海外拍卖会上见到此扇，以高价拍回，捐献给国家博物馆。离家百年，终于叶落归根。',
      tone: 'heroic' as const,
      significance: `近代以来，大量文物流失海外。${fan.name}的回归，不仅是一件文物的归来，更是民族文化自信的体现。它告诉人们：属于我们的，终将归来。`,
    },
    {
      title: '旧物市场奇遇',
      description: '一位文物爱好者，在旧货市场的角落里发现此扇。摊主不识货，只当普通旧物贱卖。此人慧眼识珠，当即购下，经专家鉴定，竟是失传已久的${fan.name}！消息传开，藏界震动。',
      tone: 'mysterious' as const,
      significance: `文物的发现往往充满戏剧性。${fan.name}的故事告诉我们：珍宝可能就在你身边，只要有一双发现美的眼睛，有一份对文化的热爱，就能与美好不期而遇。`,
    },
  ];

  const rediscovery = randomPick(rediscoveries);

  return {
    id: `${fan.id}-rediscovery-${year}`,
    stage: 'loss_rediscovery',
    stageName: LIFECYCLE_STAGE_INFO.loss_rediscovery.name,
    period: '近世',
    year: formatYear(year),
    yearNumeric: year,
    title: rediscovery.title,
    description: rediscovery.description,
    location: randomPick(['江南旧宅', '海外拍卖会', '京城旧货市场', '古城拆迁工地']),
    emotionalTone: rediscovery.tone,
    historicalSignificance: rediscovery.significance,
    tags: ['遗失', '重现', '传奇'],
    icon: '🔮',
    color: 'gold',
  };
}

function generateModernCollection(fan: Fan): LifecycleEvent {
  const modernYear = 1950 + randomInt(0, 50);

  return {
    id: `${fan.id}-modern-collection`,
    stage: 'modern_collection',
    stageName: LIFECYCLE_STAGE_INFO.modern_collection.name,
    period: '现代',
    year: formatYear(modernYear),
    yearNumeric: modernYear,
    title: '入藏博物馆',
    description: `新中国成立后，${fan.name}被${randomPick(['故宫博物院', '国家博物馆', fan.origin + '博物馆', '上海博物馆', '苏州博物馆'])}正式入藏。文物专家对其进行了全面的检测和修复，建立了详细的档案。恒温恒湿的库房中，此扇终于结束了千年漂泊，找到了永久的归宿。`,
    location: randomPick(['北京故宫', '上海博物馆', '南京博物院', '苏州博物馆']),
    emotionalTone: 'serene',
    historicalSignificance: `入藏博物馆是${fan.name}生命中的重要里程碑。从私人珍藏到公共财富，它的价值从此属于全体人民。每一次展出，都在向观众讲述着中华文明的博大精深。`,
    tags: ['博物馆', '收藏', '保护'],
    icon: '🏛️',
    color: 'ink',
  };
}

function generateCulturalHeritage(fan: Fan): LifecycleEvent {
  const currentYear = 2020 + randomInt(0, 6);

  const heritages = [
    {
      title: '非遗传承',
      description: `随着${fan.category}制作技艺被列入国家级非物质文化遗产名录，${fan.name}作为该技艺的典范之作，成为传承人们学习的对象。新一代制扇匠人，以${fan.name}为范本，潜心钻研古老的工艺，力图再现千年风华。`,
      significance: `非物质文化遗产保护是对传统工艺的最好致敬。${fan.name}作为范本，将激励一代代匠人坚守初心，让古老的制扇技艺薪火相传、生生不息。`,
    },
    {
      title: '数字永生',
      description: `某年，启动\"数字文物\"计划，${fan.name}被高精度3D扫描，建立了完整的数字档案。每一道纹理、每一处瑕疵都被精确记录。从此，即使原件深藏库房，世人也能通过虚拟技术一睹它的风采。`,
      significance: `科技为文物保护带来了新的可能。数字技术不仅能永久保存${fan.name}的信息，更能让它走出博物馆，走进千家万户，与每一个热爱文化的人相遇。`,
    },
    {
      title: '文化使者',
      description: `某年，${fan.name}作为\"中华文明特展\"的重要展品，前往${randomPick(['法国卢浮宫', '美国大都会', '日本东京国立博物馆', '英国大英博物馆'])}展出。异国观众驻足于此扇前，无不为中华文明的精美而赞叹，纷纷拍照留念。`,
      significance: `文化因交流而多彩，因互鉴而丰富。${fan.name}作为中华文化的使者，跨越山海，向世界展示了中华民族独特的审美追求与精神气质。`,
    },
  ];

  const heritage = randomPick(heritages);

  return {
    id: `${fan.id}-heritage`,
    stage: 'cultural_heritage',
    stageName: LIFECYCLE_STAGE_INFO.cultural_heritage.name,
    period: '当代',
    year: formatYear(currentYear),
    yearNumeric: currentYear,
    title: heritage.title,
    description: heritage.description,
    location: randomPick(['全球各地', '数字世界', '国际舞台', '非遗工坊']),
    emotionalTone: 'heroic',
    historicalSignificance: heritage.significance,
    tags: ['非遗', '文化', '永恒'],
    icon: '✨',
    color: 'gold',
  };
}

function generateSummary(fan: Fan, events: LifecycleEvent[]): string {
  return `${fan.name}，${fan.dynasty}${fan.origin}名匠所制之${fan.categoryName}。自诞生以来，${events.length}余年间，${events.length >= 5 ? '阅尽人间沧桑，见证朝代更迭' : '几经辗转，留下诸多佳话'}。从${events[0]?.location || '作坊'}到博物馆，从${events[0]?.protagonist || '无名匠人'}到${events[events.length - 1]?.title || '文化遗产'}，这把小小的${fan.categoryName}承载的不仅是${fan.tags.slice(0, 2).join('与')}的精美，更是千年中华文化的缩影。`;
}

const PROLOGUES = [
  (fan: Fan) => `一把${fan.categoryName}，千载中华魂。`,
  (fan: Fan) => `${fan.category}之韵，在于方寸之间，藏万里山河。`,
  (fan: Fan) => `万物有灵，${fan.name}亦然。自诞生之日，便注定不凡。`,
  (fan: Fan) => `清风徐来，${fan.category}轻摇。一扇在手，如对古人。`,
  (fan: Fan) => `时光流转，物是人非。唯有${fan.name}，依旧如昨。`,
];

const EPILOGUES = [
  (fan: Fan) => `千年一瞬，扇面如故。愿后来者，睹物思人，不忘初心。`,
  (fan: Fan) => `一扇一世界，一物一乾坤。${fan.name}的故事，将永远流传。`,
  (fan: Fan) => `愿此${fan.category}，长伴清风，永载文明。`,
  (fan: Fan) => `器以载道，物以传神。${fan.name}虽小，道在其中矣。`,
  (fan: Fan) => `岁月不居，时节如流。唯有文化之光，穿越时空，永不磨灭。`,
];

function getPreservationGrade(fan: Fan): { grade: FanLifeStory['preservationGrade']; name: string } {
  const materials = fan.materials || [];
  const hasPrecious = materials.some((m) => ['jade', 'ivory', 'gold', 'kesi', 'sandalwood', 'embroidery', 'lacquer'].includes(m));
  const isRoyal = fan.tags.some((t) => ['宫廷', '皇家', '御用', '贡品'].includes(t));

  if (isRoyal && hasPrecious) {
    return { grade: 'national_treasure', name: PRESERVATION_GRADES.national_treasure.name };
  }
  if (hasPrecious) {
    return { grade: 'rare', name: PRESERVATION_GRADES.rare.name };
  }
  if (fan.tags.some((t) => ['非遗', '收藏级', '名家'].includes(t))) {
    return { grade: 'fine', name: PRESERVATION_GRADES.fine.name };
  }
  return { grade: 'ordinary', name: PRESERVATION_GRADES.ordinary.name };
}

export function generateFanLifeStory(fan: Fan): FanLifeStory {
  const years = getDynastyYears(fan.dynasty);
  const creationYear = randomInt(years.start + 20, years.end - 20);
  const relatedFigures = findRelatedFigures(fan);

  const events: LifecycleEvent[] = [];

  events.push(generateCreationEvent(fan, creationYear));

  let currentYear = creationYear;
  events.push(generateFirstOwner(fan, currentYear));
  currentYear += randomInt(10, 40);

  const famousEncounter = generateFamousEncounter(fan, relatedFigures, currentYear);
  if (famousEncounter) {
    events.push(famousEncounter);
    currentYear = famousEncounter.yearNumeric + randomInt(20, 50);
  }

  const scholarlyAffair = generateScholarlyAffair(fan, relatedFigures, currentYear);
  if (scholarlyAffair) {
    events.push(scholarlyAffair);
    currentYear = scholarlyAffair.yearNumeric + randomInt(30, 60);
  }

  events.push(generateHistoricalEvent(fan, currentYear));
  currentYear = events[events.length - 1].yearNumeric + randomInt(50, 100);

  events.push(generateInheritance(fan, currentYear));
  currentYear = events[events.length - 1].yearNumeric + randomInt(50, 150);

  events.push(generateLossRediscovery(fan, currentYear));
  events.push(generateModernCollection(fan));
  events.push(generateCulturalHeritage(fan));

  const sortedEvents = events.sort((a, b) => a.yearNumeric - b.yearNumeric);

  const uniqueFigures = Array.from(
    new Map(
      relatedFigures.map((f) => [
        f.id,
        {
          id: f.id,
          name: f.name,
          role: f.title,
          dynasty: f.dynasty,
          avatar: f.avatar,
        },
      ]),
    ).values(),
  ).slice(0, 4);

  const firstYear = sortedEvents[0]?.yearNumeric || creationYear;
  const lastYear = sortedEvents[sortedEvents.length - 1]?.yearNumeric || 2024;
  const duration = lastYear - firstYear;
  const durationStr = duration > 1000 ? `逾${Math.floor(duration / 100) * 100}年` : `${duration}余年`;

  const creationAgeName = firstYear < 0 ? `约公元前${Math.abs(firstYear)}年` : `约公元${firstYear}年`;

  const gradeInfo = getPreservationGrade(fan);

  const allTags: string[] = [];
  sortedEvents.forEach((e) => allTags.push(...e.tags));
  const keyThemes = Array.from(new Set(allTags)).slice(0, 6);

  return {
    fanId: fan.id,
    fanName: fan.name,
    fanCategory: fan.category,
    fanCategoryName: fan.categoryName,
    fanImage: fan.image,
    origin: fan.origin,
    dynasty: fan.dynasty,
    summary: generateSummary(fan, sortedEvents),
    poeticPrologue: randomPick(PROLOGUES)(fan),
    poeticEpilogue: randomPick(EPILOGUES)(fan),
    keyThemes,
    lifecycleEvents: sortedEvents,
    relatedFigures: uniqueFigures,
    timelineDuration: `自${creationAgeName}至今，跨越${durationStr}`,
    estimatedAges: {
      creation: creationAgeName,
      modern: `距今约${2026 - (firstYear > 0 ? firstYear : firstYear + 1)}年`,
    },
    preservationGrade: gradeInfo.grade,
    preservationGradeName: gradeInfo.name,
  };
}

export function getAllFansForJourney(): Fan[] {
  return allFans;
}
