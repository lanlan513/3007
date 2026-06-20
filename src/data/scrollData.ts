import type { ScrollSection } from '../../shared/types';

export const scrollSections: ScrollSection[] = [
  {
    id: 'pre-qin',
    dynasty: 'pre-qin',
    dynastyName: '先秦',
    era: '约公元前21世纪 - 公元前221年',
    title: '扇之起源',
    subtitle: '从礼仪之器到实用之物',
    description: '先秦时期是扇子的起源阶段。最初的扇子并非用于纳凉，而是作为帝王仪仗中的装饰之物，称为"翣"（shà），是权力与地位的象征。随着时代发展，扇子逐渐从礼仪之器演变为具有实用功能的器物。',
    visualStyle: {
      primaryColor: '#8B4513',
      secondaryColor: '#D2691E',
      bgPattern: 'bronze',
      decorativeElement: 'cloud'
    },
    fanDevelopments: [
      {
        id: 'dev-1',
        name: '五明扇',
        type: 'round',
        typeName: '团扇',
        description: '相传为舜帝所制，以五明扇广开视听，求贤人以自辅。',
        significance: '中国历史上有记载的最早的扇子类型，象征明君求贤。',
        imagePrompt: 'Ancient Chinese five-bright fan (Wu Ming Shan), bronze age style, ceremonial fan with phoenix motif, oracle bone inscriptions, Shang Dynasty aesthetic, on aged bamboo background',
        year: '舜帝时期'
      },
      {
        id: 'dev-2',
        name: '羽翣',
        type: 'feather',
        typeName: '羽扇',
        description: '以雉尾或鸟羽制成，为帝王侍从所持，用于障尘蔽日。',
        significance: '羽扇的雏形，是古代礼仪制度的重要组成部分。',
        imagePrompt: 'Ancient Chinese feather ceremonial fan (Yu Sha), made of colorful pheasant tail feathers, Zhou Dynasty bronze pattern decorations, held by royal attendant, solemn and majestic atmosphere',
        year: '周代'
      }
    ],
    stories: [
      {
        id: 'story-1',
        title: '舜制五明扇',
        summary: '相传舜帝为广开视听，求贤若渴，制作五明扇以象征求贤之心。',
        fullContent: '据《古今注》记载："五明扇，舜所作也。既受尧禅，广开视听，求贤人以自辅，故作五明扇焉。"五明扇的形制为方圆二尺，象征天圆地方，扇面分为五明，代表东、南、西、北、中五方，寓意广纳四方贤才。舜帝手持五明扇，遍访天下贤士，最终奠定了华夏文明的根基。这一传说不仅是扇子起源的最早记载，更赋予了扇子求贤、纳谏的文化内涵。',
        category: 'legend',
        categoryName: '传说典故',
        triggerPosition: 300,
        imagePrompt: 'Emperor Shun holding the Five Bright Fan, ancient Chinese legend scene, misty mountains, wise ruler seeking talents, traditional ink wash painting style'
      }
    ],
    historicalFigures: [],
    artworks: [
      {
        id: 'art-1',
        title: '商代铜翣',
        artist: '佚名',
        description: '河南安阳殷墟出土的商代青铜礼器，上有羽扇纹饰。',
        imagePrompt: 'Shang Dynasty bronze ceremonial fan ornament, ancient Chinese bronze ware with intricate carvings, archaeological artifact, museum photography',
        year: '商代'
      }
    ],
    scrollPosition: 0,
    imagePrompt: 'Ancient Chinese pre-Qin period fan culture scene, bronze age aesthetic, ceremonial fans, oracle bone script, cloud patterns, mysterious and majestic atmosphere'
  },
  {
    id: 'han',
    dynasty: 'han',
    dynastyName: '汉代',
    era: '公元前202年 - 公元220年',
    title: '纨扇初兴',
    subtitle: '团扇成为主流，形制渐趋成熟',
    description: '汉代是团扇发展的黄金时期。以素纨制成的团扇，又称"纨扇"或"合欢扇"，形制以圆形为主，象征团圆美满。汉代团扇不仅是后宫妃嫔的必备之物，也成为文人墨客抒情寄怀的载体。',
    visualStyle: {
      primaryColor: '#C8102E',
      secondaryColor: '#F5F0E8',
      bgPattern: 'silk',
      decorativeElement: 'phoenix'
    },
    fanDevelopments: [
      {
        id: 'dev-3',
        name: '素纨团扇',
        type: 'round',
        typeName: '团扇',
        description: '以洁白的素纨制成，故名素纨扇。圆形扇面，寓意团圆。',
        significance: '奠定了团扇的基本形制，成为后世团扇的典范。',
        imagePrompt: 'Han Dynasty white silk round fan (Wan Shan), pure white silk fabric, vermilion border, jade handle, elegant and minimalist, on ancient Chinese silk background',
        year: '西汉'
      },
      {
        id: 'dev-4',
        name: '合欢扇',
        type: 'round',
        typeName: '团扇',
        description: '扇面绘有合欢花纹，象征和合欢乐，多为宫廷所用。',
        significance: '将装饰艺术与实用功能完美结合，开扇面装饰之先河。',
        imagePrompt: 'Han Dynasty He Huan fan, silk round fan with hibiscus flower painting, gold thread details, palace style, romantic and elegant aesthetic',
        year: '西汉'
      }
    ],
    stories: [
      {
        id: 'story-2',
        title: '班婕妤咏团扇',
        summary: '西汉才女班婕妤以团扇自喻，作《怨歌行》抒发宫怨之情。',
        fullContent: '班婕妤是汉成帝的妃子，才貌双全，初时深受宠爱。后赵飞燕姐妹入宫，班婕妤失宠，自请退居长信宫侍奉太后。她作《怨歌行》一首："新裂齐纨素，皎洁如霜雪。裁为合欢扇，团团似明月。出入君怀袖，动摇微风发。常恐秋节至，凉飙夺炎热。弃捐箧笥中，恩情中道绝。"诗中以团扇自喻，夏日被人喜爱，秋日被弃置箱中，道尽了宫中女子的命运。这首诗也成为中国文学史上最早的咏扇名篇，确立了团扇与女性情感的文化关联。',
        category: 'literature',
        categoryName: '文学典故',
        triggerPosition: 800,
        imagePrompt: 'Ban Jieyu holding a round silk fan, Han Dynasty palace scene, elegant lady in traditional Hanfu, longing expression, ancient Chinese palace interior, poetic atmosphere'
      }
    ],
    historicalFigures: [],
    artworks: [
      {
        id: 'art-2',
        title: '马王堆汉墓出土团扇',
        artist: '佚名',
        description: '湖南长沙马王堆汉墓出土的西汉丝质团扇，是现存最早的团扇实物。',
        imagePrompt: 'Mawangdui Han Dynasty silk fan, archaeological artifact, well-preserved ancient silk fan with bamboo handle, museum display, soft lighting',
        year: '西汉'
      }
    ],
    scrollPosition: 1000,
    imagePrompt: 'Han Dynasty Chinese fan culture scene, silk fans, elegant ladies in Hanfu, palace interior, vermilion and gold color scheme, traditional Chinese painting style'
  },
  {
    id: 'tang',
    dynasty: 'tang',
    dynastyName: '唐代',
    era: '公元618年 - 公元907年',
    title: '盛世风华',
    subtitle: '团扇艺术的巅峰与域外交流',
    description: '唐代是中国古代最辉煌的朝代之一，扇文化也达到了前所未有的高度。团扇的制作工艺日益精湛，装饰艺术丰富多彩，同时通过丝绸之路传入日本、朝鲜等国，成为中外文化交流的重要载体。',
    visualStyle: {
      primaryColor: '#C9A959',
      secondaryColor: '#8B008B',
      bgPattern: 'peony',
      decorativeElement: 'dragon'
    },
    fanDevelopments: [
      {
        id: 'dev-5',
        name: '宫绢团扇',
        type: 'round',
        typeName: '团扇',
        description: '宫廷制式团扇，以名贵宫绢为面，绘有精美图案，白玉为柄。',
        significance: '代表唐代制扇工艺的最高水平，彰显大唐盛世气象。',
        imagePrompt: 'Tang Dynasty imperial silk round fan, vibrant peony flower painting on silk, jade handle, gold trim, palace luxury style, Tang Dynasty aesthetic',
        year: '唐代'
      },
      {
        id: 'dev-6',
        name: '孔雀羽扇',
        type: 'feather',
        typeName: '羽扇',
        description: '以孔雀尾羽制成，色彩斑斓，为宫廷贵族所钟爱。',
        significance: '唐代羽扇的代表作品，反映了唐人崇尚华丽的审美趣味。',
        imagePrompt: 'Tang Dynasty peacock feather fan, magnificent iridescent peacock feathers, gold filigree handle, imperial luxury, Tang Dynasty royal style',
        year: '唐代'
      }
    ],
    stories: [
      {
        id: 'story-3',
        title: '杨贵妃持扇避暑',
        summary: '唐玄宗与杨贵妃避暑华清宫，以名贵团扇驱散炎炎暑气。',
        fullContent: '唐玄宗与杨贵妃每到盛夏，便前往华清宫避暑。据《开元天宝遗事》记载，杨贵妃"每宿醉初醒，多苦肺热，常宿后花间口吸花露，或以手按于胸前，令宫女扇扇之。"玄宗特命宫中巧匠为杨贵妃制作了一把名贵的"澄水帛"团扇，以冰蚕丝织成，薄如蝉翼，轻若无物，扇动之时，清风徐来，暑气顿消。每次游宴，贵妃必手持此扇，成为华清宫中一道动人的风景。',
        category: 'legend',
        categoryName: '宫廷轶事',
        triggerPosition: 1500,
        imagePrompt: 'Yang Guifei holding an elegant silk fan in Huaqing Palace, Tang Dynasty imperial garden scene, beautiful consort in elaborate Tang costume, peonies blooming, summer atmosphere'
      },
      {
        id: 'story-4',
        title: '鉴真携扇东渡',
        summary: '鉴真和尚东渡日本，将唐代制扇工艺传入东瀛。',
        fullContent: '唐代鉴真和尚六次东渡，终于成功到达日本，不仅弘扬佛法，也将中国的文化艺术包括制扇工艺传入日本。鉴真携带的团扇，形制精巧，装饰华美，令日本皇室惊叹不已。日本工匠纷纷仿制，逐渐发展出具有日本特色的和扇。折扇后来从日本传回中国，形成了中日文化交流的一段佳话。鉴真东渡不仅是佛教传播的盛事，也是扇文化交流的重要里程碑。',
        category: 'history',
        categoryName: '文化交流',
        triggerPosition: 1800,
        imagePrompt: 'Monk Jianzhen crossing the sea to Japan, holding a ceremonial round fan, ancient Chinese ship on stormy sea, Tang Dynasty monk robes, epic journey atmosphere'
      }
    ],
    historicalFigures: [],
    artworks: [
      {
        id: 'art-3',
        title: '簪花仕女图中的团扇',
        artist: '周昉',
        description: '唐代画家周昉《簪花仕女图》中，贵妇手持团扇，尽显雍容华贵。',
        imagePrompt: 'Section of Tang Dynasty painting \"Ladies with Flowers in Their Hair\" by Zhou Fang, elegant lady holding a round silk fan, Tang Dynasty style, vibrant colors, graceful posture',
        year: '唐代'
      }
    ],
    scrollPosition: 2000,
    imagePrompt: 'Tang Dynasty Chinese fan culture grand scene, imperial palace, elegant ladies with silk fans, peony flowers, gold and silk decorations, prosperous Tang Dynasty aesthetic'
  },
  {
    id: 'song',
    dynasty: 'song',
    dynastyName: '宋代',
    era: '公元960年 - 公元1279年',
    title: '折扇东传',
    subtitle: '折扇传入与文人扇文化的兴起',
    description: '宋代是中国扇文化的重要转折期。北宋时期，折扇从日本、高丽传入中国，因其开合自如、便于携带而广受喜爱。同时，在文人画的影响下，扇面书画艺术蓬勃发展，扇子从实用品升华为艺术品。',
    visualStyle: {
      primaryColor: '#7D9B6A',
      secondaryColor: '#4A4A4A',
      bgPattern: 'bamboo',
      decorativeElement: 'plum'
    },
    fanDevelopments: [
      {
        id: 'dev-7',
        name: '高丽扇',
        type: 'folding',
        typeName: '折扇',
        description: '从高丽传入的折扇，又称"折叠扇"，以竹为骨，以纸为面。',
        significance: '折扇传入中国的开端，为中国扇文化增添了新的品类。',
        imagePrompt: 'Song Dynasty Korean folding fan (Goryeo fan), bamboo ribs, rice paper surface, delicate calligraphy, Song Dynasty scholar style, simple and elegant',
        year: '北宋'
      },
      {
        id: 'dev-8',
        name: '山水团扇',
        type: 'round',
        typeName: '团扇',
        description: '扇面绘水墨山水，意境悠远，是宋代文人画的重要载体。',
        significance: '将扇子与文人画结合，提升了扇子的艺术价值。',
        imagePrompt: 'Song Dynasty ink wash landscape round fan, misty mountains and river, scholarly aesthetic, rice paper texture, bamboo handle, Song Dynasty painting style',
        year: '南宋'
      }
    ],
    stories: [
      {
        id: 'story-5',
        title: '苏轼题扇救人',
        summary: '苏轼在杭州任职时，以扇面书画帮助一位制扇匠人还清债务。',
        fullContent: '苏轼任杭州通判时，有一位制扇匠人因拖欠赋税被带到衙门。匠人哭诉："我家以制扇为业，今年春天以来，连日阴雨，天气寒冷，做的扇子卖不出去，无法缴税。"苏轼听后，让匠人回家取来二十把素白团扇。他拿起笔，在扇面上挥洒自如，有的画山水，有的画竹石，有的题诗，不消半个时辰，二十把扇子全部完成。苏轼对匠人说："你快去街上叫卖，就说是苏东坡画的扇子。"匠人刚走出衙门，就被闻讯赶来的人们围了上来，每把扇子竟卖到一千钱，不一会儿就被抢购一空。匠人得以还清税款，对苏轼感恩戴德。',
        category: 'legend',
        categoryName: '文人轶事',
        triggerPosition: 2500,
        relatedFigureId: 'sushi',
        imagePrompt: 'Su Dongpo painting on a round fan in Hangzhou official office, Song Dynasty scholar with long beard, surrounded by curious onlookers, the fan maker kneeling in gratitude, warm and touching scene'
      },
      {
        id: 'story-6',
        title: '宋徽宗题扇',
        summary: '宋徽宗赵佶精于书画，常在折扇上题字作画，推动了扇面艺术的发展。',
        fullContent: '宋徽宗赵佶虽然在政治上昏庸无能，但在艺术上却有极高造诣，其"瘦金体"书法和院体画堪称一绝。徽宗对折扇情有独钟，常令宫中匠人制作精致的折扇，亲自在扇面上题字作画。他曾在一把折扇上画了一幅《听琴图》，人物神态逼真，意境深远，被视为稀世珍宝。上行下效，北宋朝野上下竞相收藏名家书画扇面，形成了"以扇为礼"的风气。士大夫之间交往，常以互赠名家书画扇为时尚，扇子也因此从实用物品变成了艺术收藏品。',
        category: 'art',
        categoryName: '艺术轶事',
        triggerPosition: 2800,
        imagePrompt: 'Emperor Huizong of Song painting on a folding fan, elaborate Song imperial palace, the emperor in scholar robes, slender gold calligraphy style, elegant and refined atmosphere'
      }
    ],
    historicalFigures: [],
    artworks: [
      {
        id: 'art-4',
        title: '宋人扇面画册',
        artist: '佚名',
        description: '宋代院体扇面画集，收录山水、花鸟、人物各类扇面作品。',
        imagePrompt: 'Song Dynasty fan face painting album, collection of exquisite small paintings on round fan surfaces, landscape, bird and flower, figure paintings, Song Dynasty academy style',
        year: '宋代'
      }
    ],
    scrollPosition: 3000,
    imagePrompt: 'Song Dynasty Chinese scholar fan culture scene, ink wash painting style, bamboo forest, scholars exchanging fans, misty atmosphere, elegant Song Dynasty aesthetic'
  },
  {
    id: 'ming',
    dynasty: 'ming',
    dynastyName: '明代',
    era: '公元1368年 - 公元1644年',
    title: '折扇盛行',
    subtitle: '折扇成为主流，吴门画派引领风尚',
    description: '明代是折扇艺术的鼎盛时期。折扇因其方便携带、便于书画，逐渐取代团扇成为主流。以沈周、文徵明、唐寅、仇英为代表的吴门画派，将折扇艺术推向了巅峰，"吴门四家"的扇面作品成为后世收藏的至宝。',
    visualStyle: {
      primaryColor: '#1A1A1A',
      secondaryColor: '#C8102E',
      bgPattern: 'ink',
      decorativeElement: 'orchid'
    },
    fanDevelopments: [
      {
        id: 'dev-9',
        name: '乌骨泥金折扇',
        type: 'folding',
        typeName: '折扇',
        description: '以乌木为骨，泥金为面，是明代折扇中的上品。',
        significance: '明代折扇制作工艺的代表，工艺精湛，装饰华丽。',
        imagePrompt: 'Ming Dynasty black sandalwood rib gold leaf folding fan, intricate openwork carving on black ribs, gold leaf surface with calligraphy, luxurious Ming Dynasty scholar style',
        year: '明代'
      },
      {
        id: 'dev-10',
        name: '竹骨纸面折扇',
        type: 'folding',
        typeName: '折扇',
        description: '普通文人学子常用的折扇，竹骨纸面，素净淡雅，可自由书画。',
        significance: '折扇普及的重要标志，成为文人身份的象征。',
        imagePrompt: 'Ming Dynasty bamboo rib rice paper folding fan, plain white rice paper surface, simple bamboo ribs, elegant and minimalist, scholar style, on ink stone background',
        year: '明代'
      }
    ],
    stories: [
      {
        id: 'story-7',
        title: '唐伯虎画扇',
        summary: '唐伯虎在扇面上挥洒丹青，将折扇从实用品升华为艺术品。',
        fullContent: '唐伯虎被黜后，遍游名山大川，归来后在苏州城北的桃花坞建了一座桃花庵，自号桃花庵主，以卖画为生。他曾在一把素白折扇上画了一幅《山房客至图》：远山如黛，白云出岫，山脚竹篱茅舍，柴门半掩，一人策杖而来，神态悠然。画毕，他又在扇面上题诗一首："红树黄茅野老家，日高山犬吠篱笆。合村会议无他事，定是人来借花时。"此画一画成，便被识者以重金购去。从此唐伯虎的扇画声名鹊起，四方求购者络绎不绝。时人以得唐伯虎一画扇为荣，甚至出现了"千金易得，一扇难求"的说法。',
        category: 'art',
        categoryName: '艺术名作',
        triggerPosition: 3500,
        relatedFigureId: 'tangbohu',
        imagePrompt: 'Tang Bohu painting on a folding fan in his Peach Blossom Cottage, Ming Dynasty scholar with wine cup, peach blossoms around, free spirited artist atmosphere'
      },
      {
        id: 'story-8',
        title: '文徵明四绝入扇',
        summary: '文徵明将诗书画印四绝合于一扇，树立明代扇面艺术的典范。',
        fullContent: '文徵明是明代少有的诗书画印四绝全才。他的小楷精绝，画艺超群，诗文清雅，篆刻古朴。他常在扇面上将这四绝融为一体，创造出独具特色的"文扇"。有一次，一位友人携来一把紫檀象牙折扇求画，文徵明先是以小楷在扇面右上角落款题诗，其字一笔不苟，清秀俊逸，如簪花美女，似玉树临风。然后在扇面左侧画了一幅《兰石图》：一丛幽兰生于奇石之间，兰叶以浓墨挥写，婀娜多姿；奇石以淡墨渲染，苍劲古朴。画毕，他又在扇面右下角钤盖了两方朱文印章，一曰"衡山"，一曰"徵明"。诗、书、画、印，四者相得益彰，浑然天成。友人得此扇后，赞叹不已，视为传家之宝。',
        category: 'art',
        categoryName: '艺术名作',
        triggerPosition: 3800,
        relatedFigureId: 'wen-zhengming',
        imagePrompt: 'Wen Zhengming creating a folding fan with poetry, calligraphy, painting and seal, four wonders in one, Ming Dynasty scholar studio, brush, ink stone, seal, scholarly atmosphere'
      }
    ],
    historicalFigures: ['tangbohu', 'wen-zhengming', 'shenzhou'],
    artworks: [
      {
        id: 'art-5',
        title: '吴门四家扇面集',
        artist: '沈周、文徵明、唐寅、仇英',
        description: '明代吴门四家的扇面书画作品合集，代表明代扇画最高成就。',
        imagePrompt: 'Collection of Ming Dynasty Wu School fan paintings, works by Shen Zhou, Wen Zhengming, Tang Yin, Qiu Ying, various styles of landscape, figure, flower and bird paintings on folding fans',
        year: '明代'
      }
    ],
    scrollPosition: 4000,
    imagePrompt: 'Ming Dynasty Wu School artist gathering scene, scholars exchanging folding fans, literati atmosphere, ink painting style, Suzhou garden setting, elegant and scholarly'
  },
  {
    id: 'qing',
    dynasty: 'qing',
    dynastyName: '清代',
    era: '公元1644年 - 公元1912年',
    title: '工艺臻绝',
    subtitle: '制扇工艺登峰造极，流派纷呈',
    description: '清代是中国传统制扇工艺的集大成时期。折扇的制作工艺达到了前所未有的高度，出现了各种名贵材质和精湛工艺。同时，各地形成了独具特色的制扇流派，如苏扇、杭扇、川扇等，百花齐放，争奇斗艳。',
    visualStyle: {
      primaryColor: '#4B0082',
      secondaryColor: '#FFD700',
      bgPattern: 'brocade',
      decorativeElement: 'bat'
    },
    fanDevelopments: [
      {
        id: 'dev-11',
        name: '檀香木雕折扇',
        type: 'folding',
        typeName: '折扇',
        description: '以名贵檀香木为骨，通体镂空雕刻，香气馥郁，精美绝伦。',
        significance: '清代工艺扇的巅峰之作，将雕刻艺术与实用功能完美结合。',
        imagePrompt: 'Qing Dynasty sandalwood carved folding fan, intricate openwork carving of flowers and birds on sandalwood ribs, natural wood grain, exquisite craftsmanship, museum quality',
        year: '清代'
      },
      {
        id: 'dev-12',
        name: '象牙丝编织团扇',
        type: 'round',
        typeName: '团扇',
        description: '以象牙劈成细丝，编织成扇面，工艺繁复，价值连城。',
        significance: '清代宫廷工艺的代表，是中西工艺交流的结晶。',
        imagePrompt: 'Qing Dynasty ivory thread woven round fan, delicate woven pattern from thin ivory threads, ornate frame, imperial palace quality, extremely intricate craftsmanship',
        year: '清代'
      },
      {
        id: 'dev-13',
        name: '缂丝花鸟团扇',
        type: 'round',
        typeName: '团扇',
        description: '采用缂丝工艺织就花鸟图案，通经断纬，犹如刀刻。',
        significance: '缂丝工艺在扇面制作中的应用，有"一寸缂丝一寸金"之说。',
        imagePrompt: 'Qing Dynasty Kesi silk tapestry round fan, intricate bird and flower weaving, gold thread details, luxurious texture, traditional Chinese tapestry art',
        year: '清代'
      }
    ],
    stories: [
      {
        id: 'story-9',
        title: '乾隆御题折扇',
        summary: '乾隆皇帝酷爱收藏扇子，常在历代名家扇面上题字作诗。',
        fullContent: '乾隆皇帝是中国历史上最热爱艺术的帝王之一，他的收藏品中，历代名家扇面就有数千件之多。乾隆每得一扇，必反复把玩，然后题字作诗，钤盖玉玺。他曾在一把宋代山水团扇上题了一首七言绝句："团扇题诗历代传，宣和徽庙笔如椽。江山如画无穷趣，都在炎天掌握间。"他还特命内务府造办处制作了大量精致的折扇，用以赏赐王公大臣。这些御制折扇，选材名贵，工艺精湛，扇面往往由"词臣"作画题诗，成为当时朝臣的荣耀。',
        category: 'history',
        categoryName: '宫廷轶事',
        triggerPosition: 4500,
        imagePrompt: 'Emperor Qianlong appreciating a folding fan collection, Qing Dynasty imperial study room, numerous fan boxes, the emperor in dragon robes, calligraphy brush in hand, grand and scholarly atmosphere'
      },
      {
        id: 'story-10',
        title: '曹雪芹与折扇',
        summary: '曹雪芹在《红楼梦》中以扇子为道具，写出了"晴雯撕扇"等精彩情节。',
        fullContent: '曹雪芹在《红楼梦》第三十一回"撕扇子作千金一笑 因麒麟伏白首双星"中，写了晴雯撕扇的精彩情节。端午佳节间，宝玉因金钏儿之事，心中闷闷不乐。恰值晴雯跌折了扇子，宝玉便叹了几声。晴雯生性刚烈，便与宝玉顶撞起来。后来宝玉为了哄晴雯，便拿出自己珍藏的几把名扇让她撕，晴雯果然接过来，"嗤"的一声撕了两半，接着又撕，宝玉还笑着说："响得好，再撕响些！"这一情节不仅刻画了晴雯刚烈不屈的性格，也反映了清代贵族生活的奢靡——珍贵的扇子竟被当作取乐的道具。曹雪芹本人也是制扇高手，相传他曾以卖画扇为生。',
        category: 'literature',
        categoryName: '文学典故',
        triggerPosition: 4800,
        imagePrompt: 'Qingwen tearing a folding fan in the Grand View Garden, Dream of the Red Chamber scene, Qing Dynasty nobility interior, beautiful maid in traditional costume, emotional and dramatic atmosphere'
      }
    ],
    historicalFigures: [],
    artworks: [
      {
        id: 'art-6',
        title: '宫廷折扇图谱',
        artist: '佚名',
        description: '清代内务府造办处绘制的折扇制作图谱，记录了各种制扇工艺。',
        imagePrompt: 'Qing Dynasty imperial folding fan design manual, intricate technical drawings of fan making, different types of fan ribs and surfaces, court craftsman style, detailed and precise',
        year: '清代'
      }
    ],
    scrollPosition: 5000,
    imagePrompt: 'Qing Dynasty Chinese fan culture grand scene, imperial palace craftsmen making exquisite fans, various materials like sandalwood, ivory, silk, intricate craftsmanship, luxurious Qing Dynasty aesthetic'
  },
  {
    id: 'minguo',
    dynasty: 'minguo',
    dynastyName: '民国',
    era: '公元1912年 - 公元1949年',
    title: '文人风尚',
    subtitle: '折扇成为民国文化名人的标配',
    description: '民国时期，折扇仍是文人雅士的必备之物。许多文化名人如鲁迅、胡适、齐白石、张大千等，都与扇子结下了不解之缘。他们在扇面上题字作画，以扇会友，留下了许多文坛佳话。',
    visualStyle: {
      primaryColor: '#2F4F4F',
      secondaryColor: '#CD853F',
      bgPattern: 'newspaper',
      decorativeElement: 'swastika'
    },
    fanDevelopments: [
      {
        id: 'dev-14',
        name: '名家书画折扇',
        type: 'folding',
        typeName: '折扇',
        description: '民国时期文化名人亲自创作的书画折扇，具有极高的艺术价值和历史价值。',
        significance: '扇子承载了民国时期的文化记忆，见证了一个时代的风云变幻。',
        imagePrompt: 'Republic of China period folding fan with famous artist calligraphy and painting, black bamboo ribs, rice paper surface with ink painting and calligraphy, aged appearance, historical atmosphere',
        year: '民国'
      },
      {
        id: 'dev-15',
        name: '广告折扇',
        type: 'folding',
        typeName: '折扇',
        description: '随着近代工商业的发展，出现了印有商品广告的折扇，是商业与艺术的结合。',
        significance: '扇子功能的新拓展，反映了民国时期的社会变迁。',
        imagePrompt: 'Republic of China period advertising folding fan, vintage advertisement graphics on rice paper, old Shanghai style, retro colors, historical commercial art',
        year: '民国'
      }
    ],
    stories: [
      {
        id: 'story-11',
        title: '齐白石画虾扇',
        summary: '齐白石在扇面上画虾，寥寥数笔，栩栩如生，成为画坛一绝。',
        fullContent: '齐白石是近代中国最负盛名的画家之一，他画的虾更是出神入化。齐白石画扇，最爱在小小的扇面上画虾。据说他画虾时，先蘸淡墨，在扇面上画虾的身躯，然后用浓墨点虾眼和虾头，最后用细笔画虾腿和虾须，整个过程一气呵成。他画的虾，虽然只有寥寥数笔，但每只虾都栩栩如生，晶莹剔透，仿佛在水中游动。有一次，一位友人请齐白石在扇面上画虾，齐白石欣然应允，一挥而就。友人拿到扇子，只见扇面上三只墨虾，灵动活泼，仿佛要跳出扇面。友人赞道："先生真是神笔，这扇面虽小，却有万千气象！"齐白石的虾扇，成为当时人们竞相收藏的艺术珍品。',
        category: 'art',
        categoryName: '艺术名作',
        triggerPosition: 5500,
        imagePrompt: 'Qi Baishi painting shrimp on a folding fan, old master with long white beard, simple studio, ink and brush, the shrimps seem alive on the fan surface, warm and inspiring atmosphere'
      },
      {
        id: 'story-12',
        title: '张大千画荷扇',
        summary: '张大千以画荷闻名，他的荷花扇面风姿绰约，独步天下。',
        fullContent: '张大千是二十世纪中国画坛最具传奇色彩的人物之一，他的荷花更是独步天下。张大千爱荷，不仅画荷，也种荷，他曾说："赏荷、画荷，是我一生最爱的事。"他画的荷花扇面，或工笔重彩，或写意泼墨，无不风姿绰约，气韵生动。有一次，一位记者采访张大千，问他画荷的秘诀。张大千拿起一把正在画的荷花扇，指着扇面说："画荷，首先要懂荷的性情。荷出淤泥而不染，濯清涟而不妖，这是荷的品格，也是画荷者应当具备的品格。你看这把扇面上的荷花，虽然只占了小小的一方天地，但它的风骨，它的精神，却能舒展到扇面之外。"记者听后，深有感悟。张大千的荷花扇面，也因此成为收藏家的挚爱。',
        category: 'art',
        categoryName: '艺术名作',
        triggerPosition: 5800,
        imagePrompt: 'Zhang Daqian painting lotus on a folding fan, master painter with flowing robes, lotus pond in background, splash ink style, elegant and free atmosphere'
      }
    ],
    historicalFigures: [],
    artworks: [
      {
        id: 'art-7',
        title: '海上名家扇面集',
        artist: '吴昌硕、齐白石、张大千等',
        description: '民国时期海上画派名家的扇面作品合集，展现近代中国画坛的风貌。',
        imagePrompt: 'Republic of China Shanghai School fan painting collection, works by Wu Changshuo, Qi Baishi, Zhang Daqian, various artistic styles, modern Chinese painting atmosphere',
        year: '民国'
      }
    ],
    scrollPosition: 6000,
    imagePrompt: 'Republic of China period cultural scene, scholars and artists gathering in old Shanghai, exchanging folding fans, blending of Eastern and Western cultures, nostalgic and elegant atmosphere'
  }
];

export const getSectionById = (id: string): ScrollSection | undefined => {
  return scrollSections.find(section => section.id === id);
};

export const getNextSection = (currentId: string): ScrollSection | undefined => {
  const currentIndex = scrollSections.findIndex(s => s.id === currentId);
  if (currentIndex !== -1 && currentIndex < scrollSections.length - 1) {
    return scrollSections[currentIndex + 1];
  }
  return undefined;
};

export const getPrevSection = (currentId: string): ScrollSection | undefined => {
  const currentIndex = scrollSections.findIndex(s => s.id === currentId);
  if (currentIndex > 0) {
    return scrollSections[currentIndex - 1];
  }
  return undefined;
};
