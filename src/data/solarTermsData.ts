export type SolarTermSeason = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SolarTermPoem {
  title: string;
  author: string;
  dynasty: string;
  lines: string[];
}

export interface SolarTermArt {
  title: string;
  artist: string;
  dynasty: string;
  description: string;
}

export interface SolarTermFan {
  name: string;
  category: 'round' | 'folding' | 'feather';
  reason: string;
  imagePrompt: string;
}

export interface SolarTermData {
  id: string;
  name: string;
  alias: string;
  season: SolarTermSeason;
  month: number;
  day: number;
  description: string;
  culturalNote: string;
  color: string;
  colorLight: string;
  colorDark: string;
  gradient: string;
  bgPattern: string;
  icon: string;
  fan: SolarTermFan;
  poems: SolarTermPoem[];
  arts: SolarTermArt[];
  customs: string[];
  keywords: string[];
}

export const SEASON_INFO: Record<SolarTermSeason, { name: string; icon: string; color: string; bgColor: string; borderColor: string }> = {
  spring: { name: '春', icon: '🌸', color: 'text-pink-600', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' },
  summer: { name: '夏', icon: '☀️', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  autumn: { name: '秋', icon: '🍂', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  winter: { name: '冬', icon: '❄️', color: 'text-sky-600', bgColor: 'bg-sky-50', borderColor: 'border-sky-200' },
};

export const SOLAR_TERMS: SolarTermData[] = [
  {
    id: 'lichun',
    name: '立春',
    alias: '岁首',
    season: 'spring',
    month: 2,
    day: 4,
    description: '东风解冻，蛰虫始振，鱼陟负冰。立春为二十四节气之首，万物更生，新年之始。',
    culturalNote: '立春日，天子亲率三公九卿迎春于东郊，民间则贴春字、咬春饼、打春牛，以祈丰年。',
    color: '#E8B4B8',
    colorLight: '#FDE8EA',
    colorDark: '#A85A62',
    gradient: 'linear-gradient(135deg, #FDE8EA 0%, #E8B4B8 50%, #D4909A 100%)',
    bgPattern: 'plum',
    icon: '🌸',
    fan: {
      name: '缂丝团扇',
      category: 'round',
      reason: '团扇圆满，寓意春回大地、万象更新。缂丝扇面织春花烂漫，正合立春之意。',
      imagePrompt: 'Chinese silk round fan with spring plum blossoms, pastel pink, traditional craft',
    },
    poems: [
      { title: '立春', author: '左纬', dynasty: '宋', lines: ['东风吹散梅梢雪', '一夜挽回天下春'] },
      { title: '京中正月七日立春', author: '罗隐', dynasty: '唐', lines: ['一二三四五六七', '万木生芽是今日'] },
    ],
    arts: [
      { title: '立春图', artist: '佚名', dynasty: '宋', description: '描绘立春时节民间迎春祭祀、打春牛的盛大场面，人物生动，春意盎然。' },
      { title: '梅花团扇面', artist: '马远', dynasty: '宋', description: '以团扇为形制，绘折枝梅花，疏影横斜，暗香浮动，尽显春消息。' },
    ],
    customs: ['贴春字', '咬春饼', '打春牛', '迎春祭'],
    keywords: ['春回', '新生', '东风', '梅开'],
  },
  {
    id: 'yushui',
    name: '雨水',
    alias: '正月中',
    season: 'spring',
    month: 2,
    day: 19,
    description: '獭祭鱼，鸿雁来，草木萌动。雨水时节，春雨润物，大地复苏。',
    culturalNote: '雨水前后，杏花初绽，春雨贵如油。民间有"雨水节，回娘家"之俗，出嫁女儿归宁探亲。',
    color: '#A8D5E2',
    colorLight: '#E0F2F7',
    colorDark: '#5B96A8',
    gradient: 'linear-gradient(135deg, #E0F2F7 0%, #A8D5E2 50%, #7BBCCF 100%)',
    bgPattern: 'rain',
    icon: '🌧️',
    fan: {
      name: '烟雨折扇',
      category: 'folding',
      reason: '折扇开合如雨帘收放，水墨烟雨入扇面，与雨水节气朦胧意境相合。',
      imagePrompt: 'Chinese folding fan with misty rain landscape painting, ink wash style',
    },
    poems: [
      { title: '春夜喜雨', author: '杜甫', dynasty: '唐', lines: ['好雨知时节', '当春乃发生', '随风潜入夜', '润物细无声'] },
      { title: '初春小雨', author: '韩愈', dynasty: '唐', lines: ['天街小雨润如酥', '草色遥看近却无'] },
    ],
    arts: [
      { title: '潇湘八景·山市晴岚', artist: '牧溪', dynasty: '宋', description: '烟雨朦胧中的山峦市集，水汽氤氲，若隐若现，是雨水时节最典型的意境。' },
      { title: '杏花春雨图', artist: '佚名', dynasty: '明', description: '杏花烟雨江南，淡墨渲染春雨蒙蒙，杏花初绽，春意绵绵。' },
    ],
    customs: ['回娘家', '接寿', '撞拜寄', '拉保保'],
    keywords: ['春雨', '润泽', '杏花', '萌动'],
  },
  {
    id: 'jingzhe',
    name: '惊蛰',
    alias: '二月节',
    season: 'spring',
    month: 3,
    day: 6,
    description: '桃始华，仓庚鸣，鹰化为鸠。春雷响动，惊醒蛰伏万物，天地始开。',
    culturalNote: '惊蛰雷鸣，万物出蛰。民间有"惊蛰吃梨"之俗，取"梨"与"离"谐音，寓意与疾病分离。',
    color: '#B8D4A3',
    colorLight: '#EAF4E3',
    colorDark: '#6A9B4F',
    gradient: 'linear-gradient(135deg, #EAF4E3 0%, #B8D4A3 50%, #94BF7A 100%)',
    bgPattern: 'thunder',
    icon: '⚡',
    fan: {
      name: '桃花折扇',
      category: 'folding',
      reason: '惊蛰桃花始华，折扇绘灼灼桃花，开扇如花放，合扇似春藏。',
      imagePrompt: 'Chinese folding fan with peach blossoms painting, spring green and pink',
    },
    poems: [
      { title: '观田家', author: '韦应物', dynasty: '唐', lines: ['微雨众卉新', '一雷惊蛰始'] },
      { title: '惊蛰', author: '刘长卿', dynasty: '唐', lines: ['陌上杨柳方竞春', '塘中鲫鲤早舒郁'] },
    ],
    arts: [
      { title: '桃花春禽图', artist: '赵佶', dynasty: '宋', description: '桃枝斜出，春禽栖息，工笔重彩，极尽华美，是惊蛰桃始华的绝佳写照。' },
      { title: '雷雨图', artist: '佚名', dynasty: '明', description: '春雷滚滚，闪电划破天际，大雨倾盆而下，万物在惊雷中苏醒。' },
    ],
    customs: ['吃梨', '祭白虎', '打小人', '蒙鼓皮'],
    keywords: ['雷动', '蛰醒', '桃花', '春耕'],
  },
  {
    id: 'chunfen',
    name: '春分',
    alias: '二月中',
    season: 'spring',
    month: 3,
    day: 21,
    description: '玄鸟至，雷乃发声，始电。昼夜均分，阴阳相半，春意正浓。',
    culturalNote: '春分日昼夜等长，民间有竖蛋、放风筝、踏青之俗，"春分到，蛋儿俏"。',
    color: '#C5D99E',
    colorLight: '#F0F5E3',
    colorDark: '#8AA55A',
    gradient: 'linear-gradient(135deg, #F0F5E3 0%, #C5D99E 50%, #A8C47A 100%)',
    bgPattern: 'balance',
    icon: '⚖️',
    fan: {
      name: '燕子团扇',
      category: 'round',
      reason: '春分玄鸟至，团扇绘双燕归巢，圆形象征昼夜均分，燕子寓意春归。',
      imagePrompt: 'Chinese round silk fan with swallows and willow branches, spring green',
    },
    poems: [
      { title: '春分日', author: '徐铉', dynasty: '宋', lines: ['仲春初四日', '春色正中分'] },
      { title: '踏莎行', author: '欧阳修', dynasty: '宋', lines: ['雨霁风光', '春分天气', '千花百卉争明媚'] },
    ],
    arts: [
      { title: '春分燕归图', artist: '佚名', dynasty: '宋', description: '柳丝如烟，双燕翩飞，春水初涨，一派春分时节的和煦景象。' },
      { title: '风筝图', artist: '佚名', dynasty: '清', description: '春分日放风筝的民俗场景，孩童欢笑，纸鸢飞舞，春光无限。' },
    ],
    customs: ['竖蛋', '放风筝', '踏青', '吃春菜'],
    keywords: ['均分', '玄鸟', '踏青', '春盛'],
  },
  {
    id: 'qingming',
    name: '清明',
    alias: '三月节',
    season: 'spring',
    month: 4,
    day: 5,
    description: '桐始华，田鼠化为鴽，虹始见。天清地明，万物洁净，春和景明。',
    culturalNote: '清明既是节气又是节日，扫墓祭祖、踏青折柳、插柳戴柳，慎终追远，亦享春光。',
    color: '#8CC5A2',
    colorLight: '#E3F5EB',
    colorDark: '#4A8B62',
    gradient: 'linear-gradient(135deg, #E3F5EB 0%, #8CC5A2 50%, #5FA87A 100%)',
    bgPattern: 'willow',
    icon: '🍃',
    fan: {
      name: '青柳团扇',
      category: 'round',
      reason: '清明折柳，团扇面绘烟柳画桥，碧绿扇面映春色，一扇清明意。',
      imagePrompt: 'Chinese round fan with weeping willow and misty bridge, soft green tones',
    },
    poems: [
      { title: '清明', author: '杜牧', dynasty: '唐', lines: ['清明时节雨纷纷', '路上行人欲断魂'] },
      { title: '苏堤清明即事', author: '吴惟信', dynasty: '宋', lines: ['梨花风起正清明', '游子寻春半出城'] },
    ],
    arts: [
      { title: '清明上河图', artist: '张择端', dynasty: '宋', description: '中国传世名画，描绘清明时节汴京繁华景象，市井百态尽收画卷。' },
      { title: '柳岸送别图', artist: '佚名', dynasty: '明', description: '柳堤送别，折柳赠行，烟柳画桥间尽是离愁别绪。' },
    ],
    customs: ['扫墓', '踏青', '折柳', '吃青团'],
    keywords: ['清朗', '追远', '柳色', '春游'],
  },
  {
    id: 'guyu',
    name: '谷雨',
    alias: '三月中',
    season: 'spring',
    month: 4,
    day: 20,
    description: '萍始生，鸣鸠拂其羽，戴胜降于桑。雨生百谷，春播关键，牡丹花开。',
    culturalNote: '谷雨采茶，"谷雨茶"清香宜人。民间有"谷雨三朝看牡丹"之俗，牡丹号称"谷雨花"。',
    color: '#D4A5C9',
    colorLight: '#F5EAF2',
    colorDark: '#9B6A8F',
    gradient: 'linear-gradient(135deg, #F5EAF2 0%, #D4A5C9 50%, #BB82AE 100%)',
    bgPattern: 'peony',
    icon: '🌺',
    fan: {
      name: '牡丹团扇',
      category: 'round',
      reason: '谷雨牡丹盛开，团扇绘国色天香，富贵雍容，正应谷雨花信。',
      imagePrompt: 'Chinese round fan with peony flowers, rich pink and purple, traditional painting',
    },
    poems: [
      { title: '谷雨', author: '朱槔', dynasty: '宋', lines: ['天点纷林际', '虚檐写梦中'] },
      { title: '白牡丹', author: '王贞白', dynasty: '唐', lines: ['谷雨洗纤素', '裁为白牡丹'] },
    ],
    arts: [
      { title: '牡丹图', artist: '徐渭', dynasty: '明', description: '泼墨牡丹，酣畅淋漓，写意而非工笔，尽显牡丹的雍容华贵与不羁风骨。' },
      { title: '谷雨采茶图', artist: '佚名', dynasty: '清', description: '茶园采茶的劳动场景，谷雨新茶，芽叶鲜嫩，茶香四溢。' },
    ],
    customs: ['采谷雨茶', '赏牡丹', '食香椿', '祭仓颉'],
    keywords: ['百谷', '牡丹', '新茶', '暮春'],
  },
  {
    id: 'lixia',
    name: '立夏',
    alias: '四月节',
    season: 'summer',
    month: 5,
    day: 6,
    description: '蝼蝈鸣，蚯蚓出，王瓜生。夏之始也，万物至此皆长大，天地始交。',
    culturalNote: '立夏日民间有称体重之俗，谓"立夏称人"，以防"疰夏"。又有立夏尝新、吃蛋之俗。',
    color: '#E8C170',
    colorLight: '#FBF3E2',
    colorDark: '#B8893D',
    gradient: 'linear-gradient(135deg, #FBF3E2 0%, #E8C170 50%, #D4A84E 100%)',
    bgPattern: 'sun',
    icon: '🌞',
    fan: {
      name: '竹骨折扇',
      category: 'folding',
      reason: '初夏将至，竹骨折扇清雅宜人，竹色如夏初新绿，摇扇纳凉正其时。',
      imagePrompt: 'Chinese bamboo folding fan, light green bamboo frame, summer aesthetic',
    },
    poems: [
      { title: '立夏', author: '赵友直', dynasty: '宋', lines: ['四月清和雨歇后', '榴花照眼明似火'] },
      { title: '山亭夏日', author: '高骈', dynasty: '唐', lines: ['绿树阴浓夏日长', '楼台倒影入池塘'] },
    ],
    arts: [
      { title: '夏景山口待渡图', artist: '董源', dynasty: '五代', description: '江南初夏山水，烟岚缭绕，草木葱茏，水边待渡，意境悠远。' },
      { title: '榴花图', artist: '佚名', dynasty: '宋', description: '石榴花开如火，正是立夏时节最夺目的色彩。' },
    ],
    customs: ['称人', '尝新', '吃蛋', '挂蛋'],
    keywords: ['夏始', '新绿', '榴花', '长大'],
  },
  {
    id: 'xiaoman',
    name: '小满',
    alias: '四月中',
    season: 'summer',
    month: 5,
    day: 21,
    description: '苦菜秀，靡草死，麦秋至。麦粒渐满而未盈，小得盈满，恰到好处。',
    culturalNote: '小满者，物至于此小得盈满。民间有"小满动三车"之说，丝车、油车、水车皆动。',
    color: '#C9B84E',
    colorLight: '#F5F0D4',
    colorDark: '#8F8530',
    gradient: 'linear-gradient(135deg, #F5F0D4 0%, #C9B84E 50%, #B0A035 100%)',
    bgPattern: 'wheat',
    icon: '🌾',
    fan: {
      name: '麦浪折扇',
      category: 'folding',
      reason: '小满麦浪金黄，折扇绘风吹麦浪，扇骨如麦秆，扇面如金田。',
      imagePrompt: 'Chinese folding fan with golden wheat field painting, warm amber tones',
    },
    poems: [
      { title: '小满', author: '欧阳修', dynasty: '宋', lines: ['夜莺啼绿柳', '皓月醒长空', '最爱垄头麦', '迎风笑落红'] },
      { title: '四时田园杂兴', author: '范成大', dynasty: '宋', lines: ['梅子金黄杏子肥', '麦花雪白菜花稀'] },
    ],
    arts: [
      { title: '麦田图', artist: '佚名', dynasty: '明', description: '金黄麦田一望无际，农人劳作其间，是丰收在望的喜悦景象。' },
      { title: '蚕织图', artist: '佚名', dynasty: '宋', description: '小满蚕事正忙，绘蚕妇缫丝织绸的完整过程，细致入微。' },
    ],
    customs: ['动三车', '祭蚕神', '食苦菜', '祈蚕节'],
    keywords: ['盈满', '麦黄', '蚕桑', '恰到'],
  },
  {
    id: 'mangzhong',
    name: '芒种',
    alias: '五月节',
    season: 'summer',
    month: 6,
    day: 6,
    description: '螳螂生，鵙始鸣，反舌无声。有芒之谷可种，忙种忙收，最是农忙。',
    culturalNote: '芒种至夏至是农事最繁忙时节，"芒种忙忙种"一语道尽。又逢梅雨，江南入梅。',
    color: '#8DB86A',
    colorLight: '#E5F0D8',
    colorDark: '#5A7E3C',
    gradient: 'linear-gradient(135deg, #E5F0D8 0%, #8DB86A 50%, #6FA04A 100%)',
    bgPattern: 'rice',
    icon: '🌱',
    fan: {
      name: '秧歌团扇',
      category: 'round',
      reason: '芒种插秧忙，团扇绘田园插秧图，圆形如田亩，绿意盎然。',
      imagePrompt: 'Chinese round fan with rice paddy and farmers planting, lush green',
    },
    poems: [
      { title: '芒种后积雨骤冷', author: '范成大', dynasty: '宋', lines: ['梅霖倾泻九河翻', '百渎交流海面宽'] },
      { title: '时雨', author: '陆游', dynasty: '宋', lines: ['时雨及芒种', '四野皆插秧'] },
    ],
    arts: [
      { title: '耕织图·插秧', artist: '楼璹', dynasty: '宋', description: '芒种插秧场景，农人弯腰插秧，水田如镜，倒映天光云影。' },
      { title: '梅雨图', artist: '佚名', dynasty: '明', description: '江南梅雨时节，细雨如丝，梅子青黄，水乡朦胧。' },
    ],
    customs: ['送花神', '安苗', '煮梅', '挂艾草'],
    keywords: ['忙种', '梅雨', '插秧', '农忙'],
  },
  {
    id: 'xiazhi',
    name: '夏至',
    alias: '五月中',
    season: 'summer',
    month: 6,
    day: 21,
    description: '鹿角解，蝉始鸣，半夏生。日长之至，阳极阴生，盛夏之极。',
    culturalNote: '夏至日最长，夜最短。民间有"冬至饺子夏至面"之俗，夏至吃面，取长久之意。',
    color: '#E8973F',
    colorLight: '#FDF0E0',
    colorDark: '#B06820',
    gradient: 'linear-gradient(135deg, #FDF0E0 0%, #E8973F 50%, #D07C25 100%)',
    bgPattern: 'lotus',
    icon: '☀️',
    fan: {
      name: '荷花羽扇',
      category: 'feather',
      reason: '夏至荷开，羽扇轻摇如荷风送爽，羽毛柔似荷瓣，纳凉最为相宜。',
      imagePrompt: 'Chinese feather fan with lotus pond theme, white feathers, summer breeze',
    },
    poems: [
      { title: '夏至避暑北池', author: '韦应物', dynasty: '唐', lines: ['昼晷已云极', '宵漏自此长'] },
      { title: '竹枝词', author: '刘禹锡', dynasty: '唐', lines: ['杨柳青青江水平', '闻郎江上踏歌声'] },
    ],
    arts: [
      { title: '荷塘消夏图', artist: '佚名', dynasty: '宋', description: '荷塘畔纳凉消夏，荷叶田田，莲花亭亭，仕女执扇，怡然自得。' },
      { title: '夏至日长图', artist: '佚名', dynasty: '明', description: '日影最长之日，庭院树荫浓密，蝉鸣声声，夏日悠长。' },
    ],
    customs: ['吃面', '祭地', '消夏', '称水'],
    keywords: ['日长', '盛夏', '荷花', '蝉鸣'],
  },
  {
    id: 'xiaoshu',
    name: '小暑',
    alias: '六月节',
    season: 'summer',
    month: 7,
    day: 7,
    description: '温风至，蟋蟀居壁，鹰乃学习。暑气渐升，未至极热，伏天将至。',
    culturalNote: '小暑入伏，民间有"小暑大暑，上蒸下煮"之说。小暑食新米、晒书画、晒衣裳。',
    color: '#E07A4A',
    colorLight: '#FDE8DB',
    colorDark: '#A85528',
    gradient: 'linear-gradient(135deg, #FDE8DB 0%, #E07A4A 50%, #C56035 100%)',
    bgPattern: 'heat',
    icon: '🔥',
    fan: {
      name: '消夏折扇',
      category: 'folding',
      reason: '伏天将至，折扇最宜随身携带，开扇送清风，驱暑纳凉。',
      imagePrompt: 'Chinese folding fan with bamboo and cicada painting, warm orange tones',
    },
    poems: [
      { title: '答李澣三首其三', author: '韦应物', dynasty: '唐', lines: ['还因长夏理', '心赏对清琴'] },
      { title: '夏日对雨寄朱放拾遗', author: '武元衡', dynasty: '唐', lines: ['才非谷永传', '无意答书客'] },
    ],
    arts: [
      { title: '消夏图', artist: '刘贯道', dynasty: '元', description: '文人消夏避暑，卧榻纳凉，侍女执扇，芭蕉浓荫，清幽闲适。' },
      { title: '夏日山居图', artist: '佚名', dynasty: '明', description: '山居避暑，古木参天，清泉石上流，暑气顿消。' },
    ],
    customs: ['食新', '晒书画', '晒衣', '吃藕'],
    keywords: ['伏天', '温风', '消夏', '初热'],
  },
  {
    id: 'dashu',
    name: '大暑',
    alias: '六月中',
    season: 'summer',
    month: 7,
    day: 23,
    description: '腐草为萤，土润溽暑，大雨时行。暑气至极，天地如蒸，萤火虫出。',
    culturalNote: '大暑乃一年最热之时，民间饮伏茶、晒伏姜、烧伏香，以消暑祛湿。',
    color: '#D4533B',
    colorLight: '#FCE0DB',
    colorDark: '#9C2E1A',
    gradient: 'linear-gradient(135deg, #FCE0DB 0%, #D4533B 50%, #B33D28 100%)',
    bgPattern: 'firefly',
    icon: '🌡️',
    fan: {
      name: '萤火羽扇',
      category: 'feather',
      reason: '大暑萤火出，羽扇轻拂驱暑热，羽毛似萤光柔美，最宜酷暑之夜。',
      imagePrompt: 'Chinese feather fan with fireflies, warm red tones, night scene',
    },
    poems: [
      { title: '大暑', author: '曾几', dynasty: '宋', lines: ['赤日几时过', '清风无处寻'] },
      { title: '夏夜叹', author: '杜甫', dynasty: '唐', lines: ['昊天出华月', '茂林延疏光'] },
    ],
    arts: [
      { title: '流萤图', artist: '佚名', dynasty: '宋', description: '夏夜流萤点点，如星坠凡间，古人以为腐草所化，诗意浪漫。' },
      { title: '纳凉观瀑图', artist: '佚名', dynasty: '明', description: '酷暑中观瀑纳凉，水声轰鸣，飞珠溅玉，暑气顿消。' },
    ],
    customs: ['饮伏茶', '晒伏姜', '烧伏香', '送大暑船'],
    keywords: ['极暑', '萤火', '伏天', '溽热'],
  },
  {
    id: 'liqiu',
    name: '立秋',
    alias: '七月节',
    season: 'autumn',
    month: 8,
    day: 7,
    description: '凉风至，白露降，寒蝉鸣。秋之始也，暑去凉来，一叶知秋。',
    culturalNote: '立秋日有"贴秋膘"之俗，夏日消瘦，秋风起时进补。又有"咬秋"、戴楸叶之俗。',
    color: '#C9956B',
    colorLight: '#F5E8DA',
    colorDark: '#8B5E35',
    gradient: 'linear-gradient(135deg, #F5E8DA 0%, #C9956B 50%, #A87A4D 100%)',
    bgPattern: 'leaf',
    icon: '🍂',
    fan: {
      name: '梧桐折扇',
      category: 'folding',
      reason: '一叶梧桐知秋来，折扇绘梧桐落叶，扇骨如枯枝，扇面映秋色。',
      imagePrompt: 'Chinese folding fan with falling leaves and paulownia tree, amber tones',
    },
    poems: [
      { title: '立秋', author: '刘翰', dynasty: '宋', lines: ['乳鸦啼散玉屏空', '一枕新凉一扇风'] },
      { title: '秋词', author: '刘禹锡', dynasty: '唐', lines: ['自古逢秋悲寂寥', '我言秋日胜春朝'] },
    ],
    arts: [
      { title: '梧桐落叶图', artist: '佚名', dynasty: '宋', description: '梧桐一叶落，天下尽知秋。画面疏朗，一叶飘零，意境高远。' },
      { title: '秋风纨扇图', artist: '唐寅', dynasty: '明', description: '仕女执扇立于秋风之中，扇将弃而人不舍，寓意美人迟暮。' },
    ],
    customs: ['贴秋膘', '咬秋', '戴楸叶', '晒秋'],
    keywords: ['秋来', '凉风', '梧桐', '知秋'],
  },
  {
    id: 'chushu',
    name: '处暑',
    alias: '七月中',
    season: 'autumn',
    month: 8,
    day: 23,
    description: '鹰乃祭鸟，天地始肃，禾乃登。暑气止息，秋意渐浓，天高云淡。',
    culturalNote: '处暑即"出暑"，炎热离开之意。民间有放河灯、开渔节、煎药茶之俗。',
    color: '#B8A88A',
    colorLight: '#F0EBE0',
    colorDark: '#7A6B50',
    gradient: 'linear-gradient(135deg, #F0EBE0 0%, #B8A88A 50%, #9A8968 100%)',
    bgPattern: 'cloud',
    icon: '🌤️',
    fan: {
      name: '秋水团扇',
      category: 'round',
      reason: '处暑秋水长天，团扇绘秋水共长天一色，素雅淡然，如秋之初凉。',
      imagePrompt: 'Chinese round fan with autumn water and sky, subtle earth tones, minimalist',
    },
    poems: [
      { title: '处暑后风雨', author: '仇远', dynasty: '元', lines: ['疾风驱急雨', '残暑扫除空'] },
      { title: '长江二首', author: '苏泂', dynasty: '宋', lines: ['处暑无三日', '新凉直万金'] },
    ],
    arts: [
      { title: '秋水凫鹭图', artist: '佚名', dynasty: '宋', description: '秋水澄碧，凫鹭悠游，远处天际线朦胧，一派处暑时节的恬淡。' },
      { title: '放河灯图', artist: '佚名', dynasty: '清', description: '处暑夜放河灯，星星点点随波逐流，寄托对逝者的思念。' },
    ],
    customs: ['放河灯', '开渔节', '煎药茶', '吃鸭子'],
    keywords: ['暑止', '秋凉', '天高', '云淡'],
  },
  {
    id: 'bailu',
    name: '白露',
    alias: '八月节',
    season: 'autumn',
    month: 9,
    day: 8,
    description: '鸿雁来，玄鸟归，群鸟养羞。露凝而白，秋凉渐深，候鸟南迁。',
    culturalNote: '白露时节，民间有收清露之俗，以清晨露水擦目，谓可明目。又有饮白露茶之俗。',
    color: '#9BB8C9',
    colorLight: '#E3EEF4',
    colorDark: '#5D82A0',
    gradient: 'linear-gradient(135deg, #E3EEF4 0%, #9BB8C9 50%, #7A9FB5 100%)',
    bgPattern: 'dew',
    icon: '💧',
    fan: {
      name: '白鹭团扇',
      category: 'round',
      reason: '白露鸿雁来，团扇绘白鹭独立秋水，素白如露，清雅脱俗。',
      imagePrompt: 'Chinese round fan with white heron in autumn water, silver-blue tones',
    },
    poems: [
      { title: '月夜忆舍弟', author: '杜甫', dynasty: '唐', lines: ['露从今夜白', '月是故乡明'] },
      { title: '南湖晚秋', author: '白居易', dynasty: '唐', lines: ['八月白露降', '湖中水方老'] },
    ],
    arts: [
      { title: '芦雁图', artist: '边文进', dynasty: '明', description: '芦苇丛中大雁栖息，白露时节候鸟南迁，画面萧瑟而有诗意。' },
      { title: '秋露凝珠图', artist: '佚名', dynasty: '宋', description: '清晨秋露凝于草木之上，如珠似玉，晶莹剔透。' },
    ],
    customs: ['收清露', '饮白露茶', '吃龙眼', '祭禹王'],
    keywords: ['露白', '鸿雁', '秋凉', '候鸟'],
  },
  {
    id: 'qiufen',
    name: '秋分',
    alias: '八月中',
    season: 'autumn',
    month: 9,
    day: 23,
    description: '雷始收声，蛰虫坯户，水始涸。昼夜再均，阴阳相半，秋意正浓。',
    culturalNote: '秋分曾是传统的"祭月节"，后演变为中秋节。又有竖蛋、吃秋菜、送秋牛之俗。',
    color: '#B5945A',
    colorLight: '#F0E8D4',
    colorDark: '#7A6335',
    gradient: 'linear-gradient(135deg, #F0E8D4 0%, #B5945A 50%, #967A3F 100%)',
    bgPattern: 'moon',
    icon: '🌗',
    fan: {
      name: '明月折扇',
      category: 'folding',
      reason: '秋分曾是祭月节，折扇绘明月秋风，开扇如月圆，合扇似月牙。',
      imagePrompt: 'Chinese folding fan with autumn moon and chrysanthemum, golden tones',
    },
    poems: [
      { title: '秋词', author: '刘禹锡', dynasty: '唐', lines: ['晴空一鹤排云上', '便引诗情到碧霄'] },
      { title: '秋分后顿凄冷', author: '陆游', dynasty: '宋', lines: ['今年秋气早', '木落不待黄'] },
    ],
    arts: [
      { title: '月夜图', artist: '佚名', dynasty: '宋', description: '秋分月夜，清辉如水，桂影婆娑，是祭月赏月的经典意境。' },
      { title: '菊花团扇', artist: '恽寿平', dynasty: '清', description: '秋分菊盛，团扇绘秋菊，设色淡雅，花瓣层层，清气满乾坤。' },
    ],
    customs: ['祭月', '竖蛋', '吃秋菜', '送秋牛'],
    keywords: ['均分', '明月', '桂香', '秋浓'],
  },
  {
    id: 'hanlu',
    name: '寒露',
    alias: '九月节',
    season: 'autumn',
    month: 10,
    day: 8,
    description: '鸿雁来宾，雀入大水为蛤，菊有黄华。露气寒冷，将凝结也，深秋渐至。',
    culturalNote: '寒露时节，菊花盛开，登高赏菊是重要习俗。又有吃芝麻、饮菊花酒之俗。',
    color: '#A0866B',
    colorLight: '#EDE4D8',
    colorDark: '#6B5740',
    gradient: 'linear-gradient(135deg, #EDE4D8 0%, #A0866B 50%, #826A50 100%)',
    bgPattern: 'chrysanthemum',
    icon: '🌼',
    fan: {
      name: '菊花折扇',
      category: 'folding',
      reason: '寒露菊有黄华，折扇绘秋菊傲霜，扇骨刻菊纹，雅致高洁。',
      imagePrompt: 'Chinese folding fan with golden chrysanthemums, warm brown tones, autumn aesthetic',
    },
    poems: [
      { title: '月夜梧桐叶上见寒露', author: '戴察', dynasty: '唐', lines: ['萧疏桐叶上', '月白露初团'] },
      { title: '暮江吟', author: '白居易', dynasty: '唐', lines: ['可怜九月初三夜', '露似真珠月似弓'] },
    ],
    arts: [
      { title: '菊花图', artist: '吴昌硕', dynasty: '清', description: '大写意菊花，笔墨老辣，金石气浓，菊花傲霜之姿跃然纸上。' },
      { title: '登高图', artist: '佚名', dynasty: '明', description: '寒露登高望远，秋山层林尽染，菊花满山，一片金黄。' },
    ],
    customs: ['登高', '赏菊', '饮菊花酒', '吃芝麻'],
    keywords: ['露寒', '菊华', '深秋', '登高'],
  },
  {
    id: 'shuangjiang',
    name: '霜降',
    alias: '九月中',
    season: 'autumn',
    month: 10,
    day: 23,
    description: '豺乃祭兽，草木黄落，蛰虫咸俯。气肃而凝，露结为霜，秋之末也。',
    culturalNote: '霜降是秋季最后一个节气，民间有赏红叶、观霜、吃柿子之俗，"霜降吃柿子，不会流鼻涕"。',
    color: '#C27070',
    colorLight: '#F5E0E0',
    colorDark: '#8B3E3E',
    gradient: 'linear-gradient(135deg, #F5E0E0 0%, #C27070 50%, #A35555 100%)',
    bgPattern: 'frost',
    icon: '🍁',
    fan: {
      name: '枫叶折扇',
      category: 'folding',
      reason: '霜降枫叶红于二月花，折扇绘层林尽染，霜红如火，秋色尽收。',
      imagePrompt: 'Chinese folding fan with red maple leaves, crimson and gold, frost aesthetic',
    },
    poems: [
      { title: '山行', author: '杜牧', dynasty: '唐', lines: ['停车坐爱枫林晚', '霜叶红于二月花'] },
      { title: '枫桥夜泊', author: '张继', dynasty: '唐', lines: ['月落乌啼霜满天', '江枫渔火对愁眠'] },
    ],
    arts: [
      { title: '红叶山禽图', artist: '佚名', dynasty: '宋', description: '霜后枫叶如火，山禽栖息枝头，红叶与翠鸟相映成趣。' },
      { title: '霜降柿红图', artist: '佚名', dynasty: '明', description: '柿子挂满枝头，霜后愈红，寓意事事如意，好事成双。' },
    ],
    customs: ['赏红叶', '吃柿子', '观霜', '赏菊'],
    keywords: ['凝霜', '枫红', '秋末', '肃杀'],
  },
  {
    id: 'lidong',
    name: '立冬',
    alias: '十月节',
    season: 'winter',
    month: 11,
    day: 7,
    description: '水始冰，地始冻，雉入大水为蜃。冬之始也，万物收藏，避寒就温。',
    culturalNote: '立冬日有"迎冬"之俗，天子迎冬于北郊。民间有吃饺子、酿黄酒、补冬之俗。',
    color: '#7B8FA1',
    colorLight: '#E0E6EC',
    colorDark: '#4A5D72',
    gradient: 'linear-gradient(135deg, #E0E6EC 0%, #7B8FA1 50%, #5D7589 100%)',
    bgPattern: 'snow',
    icon: '❄️',
    fan: {
      name: '寒梅团扇',
      category: 'round',
      reason: '立冬万物藏，唯梅待放，团扇绘寒梅初绽，圆中藏春意。',
      imagePrompt: 'Chinese round fan with early plum blossoms on bare branches, cool blue-grey tones',
    },
    poems: [
      { title: '立冬', author: '李白', dynasty: '唐', lines: ['冻笔新诗懒写', '寒炉美酒时温'] },
      { title: '立冬即事二首', author: '仇远', dynasty: '元', lines: ['细雨生寒未有霜', '庭前木叶半青黄'] },
    ],
    arts: [
      { title: '寒梅图', artist: '王冕', dynasty: '元', description: '墨梅繁花满枝，千丝万蕊，虽是立冬，梅已含苞，暗香浮动。' },
      { title: '冬景图', artist: '佚名', dynasty: '宋', description: '初冬萧瑟，枯木寒鸦，水面初冰，一派立冬景象。' },
    ],
    customs: ['补冬', '吃饺子', '酿黄酒', '贺冬'],
    keywords: ['冬始', '收藏', '初冰', '寒梅'],
  },
  {
    id: 'xiaoxue',
    name: '小雪',
    alias: '十月中',
    season: 'winter',
    month: 11,
    day: 22,
    description: '虹藏不见，天气上升地气下降，闭塞而成冬。初雪将至，天地闭塞，静待雪来。',
    culturalNote: '小雪时节，民间有腌腊肉、吃糍粑、晒鱼干之俗，为过冬储备食物。',
    color: '#97A8C0',
    colorLight: '#E3E9F0',
    colorDark: '#5C7090',
    gradient: 'linear-gradient(135deg, #E3E9F0 0%, #97A8C0 50%, #7A90AD 100%)',
    bgPattern: 'snowflake',
    icon: '🌨️',
    fan: {
      name: '初雪折扇',
      category: 'folding',
      reason: '小雪初雪，折扇绘雪景山水，白扇面如雪覆，扇骨如枯枝挂雪。',
      imagePrompt: 'Chinese folding fan with light snowfall landscape, silver-white and grey tones',
    },
    poems: [
      { title: '小雪', author: '戴叔伦', dynasty: '唐', lines: ['花雪随风不厌看', '更多还肯失林峦'] },
      { title: '问刘十九', author: '白居易', dynasty: '唐', lines: ['晚来天欲雪', '能饮一杯无'] },
    ],
    arts: [
      { title: '雪景寒林图', artist: '范宽', dynasty: '宋', description: '大雪纷飞中的寒林，气势磅礴，是中国山水画中雪景的经典之作。' },
      { title: '江雪图', artist: '马远', dynasty: '宋', description: '孤舟蓑笠翁，独钓寒江雪，画面极简，意境深远。' },
    ],
    customs: ['腌腊肉', '吃糍粑', '晒鱼干', '酿小雪酒'],
    keywords: ['初雪', '闭塞', '腊味', '冬藏'],
  },
  {
    id: 'daxue',
    name: '大雪',
    alias: '十一月节',
    season: 'winter',
    month: 12,
    day: 7,
    description: '鹖鴠不鸣，虎始交，荔挺出。雪至此而盛，银装素裹，天地苍茫。',
    culturalNote: '大雪时节，民间有腌肉、进补、赏雪、滑冰之俗，"小雪腌菜，大雪腌肉"。',
    color: '#8BA4BD',
    colorLight: '#DEE8F1',
    colorDark: '#507090',
    gradient: 'linear-gradient(135deg, #DEE8F1 0%, #8BA4BD 50%, #6A8AA8 100%)',
    bgPattern: 'blizzard',
    icon: '🌨️',
    fan: {
      name: '雪梅折扇',
      category: 'folding',
      reason: '大雪梅花傲雪开，折扇绘踏雪寻梅，白扇面银装素裹，红梅点缀其间。',
      imagePrompt: 'Chinese folding fan with plum blossoms in heavy snow, white and red contrast',
    },
    poems: [
      { title: '大雪', author: '陆游', dynasty: '宋', lines: ['大雪江南见未曾', '今年方始是严凝'] },
      { title: '白雪歌送武判官归京', author: '岑参', dynasty: '唐', lines: ['忽如一夜春风来', '千树万树梨花开'] },
    ],
    arts: [
      { title: '踏雪寻梅图', artist: '佚名', dynasty: '明', description: '文士踏雪寻梅，红梅白雪相映，是冬日最富诗意的画面。' },
      { title: '雪景图', artist: '石涛', dynasty: '清', description: '大雪覆山，银装素裹，笔墨苍劲，意境空旷寂寥。' },
    ],
    customs: ['腌肉', '进补', '赏雪', '滑冰'],
    keywords: ['雪盛', '银装', '寻梅', '苍茫'],
  },
  {
    id: 'dongzhi',
    name: '冬至',
    alias: '十一月中',
    season: 'winter',
    month: 12,
    day: 22,
    description: '蚯蚓结，麋角解，水泉动。日短之至，阴极阳生，一阳初动。',
    culturalNote: '冬至大如年，是重要节日。北方吃饺子，南方吃汤圆，又有数九、画九九消寒图之俗。',
    color: '#6878A0',
    colorLight: '#D8DDE8',
    colorDark: '#3D4D72',
    gradient: 'linear-gradient(135deg, #D8DDE8 0%, #6878A0 50%, #4E5F88 100%)',
    bgPattern: 'yang',
    icon: '🌑',
    fan: {
      name: '九九消寒团扇',
      category: 'round',
      reason: '冬至数九，团扇绘九九消寒图，日染一瓣，待九九尽则春回。',
      imagePrompt: 'Chinese round fan with plum blossom counting nine diagram, indigo and white',
    },
    poems: [
      { title: '冬至', author: '杜甫', dynasty: '唐', lines: ['天时人事日相催', '冬至阳生春又来'] },
      { title: '邯郸冬至夜思家', author: '白居易', dynasty: '唐', lines: ['邯郸驿里逢冬至', '抱膝灯前影伴身'] },
    ],
    arts: [
      { title: '九九消寒图', artist: '佚名', dynasty: '清', description: '以梅花八十一瓣代表九九八十一天，日染一瓣，瓣尽春来，是冬至最具文化意趣的风俗画。' },
      { title: '冬至祭祖图', artist: '佚名', dynasty: '明', description: '冬至祭祖，家族齐聚，焚香祝祷，慎终追远，体现中华民族孝道传统。' },
    ],
    customs: ['吃饺子', '吃汤圆', '数九', '画消寒图'],
    keywords: ['阳生', '日短', '数九', '大如年'],
  },
  {
    id: 'xiaohan',
    name: '小寒',
    alias: '十二月节',
    season: 'winter',
    month: 1,
    day: 6,
    description: '雁北乡，鹊始巢，雉始雊。小寒虽小，实为最冷，冰封万里，梅花初绽。',
    culturalNote: '小寒是气温最低的节气，民间有"小寒大寒，冷成冰团"之说。又有探梅、吃腊八粥之俗。',
    color: '#6A7B9C',
    colorLight: '#D8DFE9',
    colorDark: '#3A4E70',
    gradient: 'linear-gradient(135deg, #D8DFE9 0%, #6A7B9C 50%, #4E6285 100%)',
    bgPattern: 'ice',
    icon: '🧊',
    fan: {
      name: '冰梅折扇',
      category: 'folding',
      reason: '小寒梅花开，折扇绘冰裂纹梅，扇骨如冰凌，扇面似寒江雪柳。',
      imagePrompt: 'Chinese folding fan with cracked ice pattern and plum blossoms, cool blue tones',
    },
    poems: [
      { title: '小寒', author: '元稹', dynasty: '唐', lines: ['小寒连大吕', '欢鹊垒新巢'] },
      { title: '窗前木芙蓉', author: '范成大', dynasty: '宋', lines: ['辛苦孤花破小寒', '花心应似客心酸'] },
    ],
    arts: [
      { title: '冰梅图', artist: '金农', dynasty: '清', description: '冰裂纹梅，以漆书笔法写梅枝，古拙奇逸，梅开冰上，傲骨铮铮。' },
      { title: '寒鸦图', artist: '佚名', dynasty: '宋', description: '寒冬枯枝寒鸦，羽毛蓬松御寒，画面萧瑟而不失生机。' },
    ],
    customs: ['探梅', '吃腊八粥', '画消寒图', '冰戏'],
    keywords: ['最冷', '梅绽', '冰封', '雁归'],
  },
  {
    id: 'dahan',
    name: '大寒',
    alias: '十二月中',
    season: 'winter',
    month: 1,
    day: 20,
    description: '鸡乳，征鸟厉疾，水泽腹坚。寒之至也，物极必反，大寒后即是春。',
    culturalNote: '大寒是最后一个节气，"过了大寒，又是一年"。民间有除旧布新、准备年货之俗，年味渐浓。',
    color: '#5A6B88',
    colorLight: '#D0D8E5',
    colorDark: '#2E3E58',
    gradient: 'linear-gradient(135deg, #D0D8E5 0%, #5A6B88 50%, #3E506E 100%)',
    bgPattern: 'year-end',
    icon: '🧨',
    fan: {
      name: '岁朝团扇',
      category: 'round',
      reason: '大寒岁末迎新，团扇绘岁朝清供，瓶梅佛手，辞旧迎新之象。',
      imagePrompt: 'Chinese round fan with New Year still life, plum and citrus, festive red accents',
    },
    poems: [
      { title: '大寒出江陵西门', author: '陆游', dynasty: '宋', lines: ['平明羸马出西门', '淡日寒云久吐吞'] },
      { title: '大寒', author: '陆游', dynasty: '宋', lines: ['大寒须守火', '无事不出门'] },
    ],
    arts: [
      { title: '岁朝图', artist: '赵昌', dynasty: '宋', description: '岁朝清供，瓶中插梅，盘中置佛手、香橼，寓意吉祥，年味十足。' },
      { title: '岁寒三友图', artist: '佚名', dynasty: '元', description: '松竹梅岁寒三友，大寒时节傲然独立，象征坚贞不屈的品格。' },
    ],
    customs: ['除旧布新', '准备年货', '蒸供', '置办年衣'],
    keywords: ['极寒', '岁末', '迎新', '年味'],
  },
];

export function getCurrentSolarTerm(): SolarTermData {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();

  let current = SOLAR_TERMS[SOLAR_TERMS.length - 1];

  for (let i = 0; i < SOLAR_TERMS.length; i++) {
    const term = SOLAR_TERMS[i];
    const termMonth = term.month;
    const termDay = term.day;

    if (month > termMonth || (month === termMonth && day >= termDay)) {
      current = term;
    } else {
      break;
    }
  }

  if (month === 1 && day < 6) {
    current = SOLAR_TERMS[SOLAR_TERMS.length - 1];
  }

  return current;
}

export function getNextSolarTerm(): SolarTermData {
  const current = getCurrentSolarTerm();
  const currentIndex = SOLAR_TERMS.findIndex(t => t.id === current.id);
  return SOLAR_TERMS[(currentIndex + 1) % SOLAR_TERMS.length];
}

export function getSolarTermsBySeason(season: SolarTermSeason): SolarTermData[] {
  return SOLAR_TERMS.filter(t => t.season === season);
}

export function getDaysUntilNextTerm(): number {
  const now = new Date();
  const next = getNextSolarTerm();
  const year = now.getFullYear();
  const nextDate = new Date(year, next.month - 1, next.day);
  if (nextDate < now) {
    nextDate.setFullYear(year + 1);
  }
  const diff = nextDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
