/* =============================================================
   site-data.js  —  サイトの中身はすべてここに入っています

   ・文章はページ上で直接書き換えられます（Cmd + Shift + E）
   ・業績と経歴は sync.command で researchmap から取り込めます
     （そのとき自分で書いた文章には触れません）
   ============================================================= */

window.SITE = {

  /* ---------- 表示の切り替え ---------- */
  // false にすると、その節がサイトから消えます（中身は残ります）。
  //   show_research … ナビの「研究」とトップの「研究テーマ」
  //   show_media    … トップの「研究室の外へ」（メディア掲載）
  //   show_contact  … トップの「連絡先」
  //                   ※ 消しても上のリンクの並びから Email は送れます
  settings: {
    show_research: false,
    show_media: false,
    show_contact: false,

    // トップページの論文欄に何を出すか。
    //   "featured" … researchmap の「重要な業績」にチェックした論文
    //   "recent"   … 新しい順（件数は home_papers_count）
    home_papers: "featured",
    home_papers_count: 5
  },

  /* ---------- プロフィール ---------- */
  profile: {
    name_en: "Shura Suzuki",
    name_ja: "鈴木 朱羅",
    title_en: "Assistant Professor",
    title_ja: "助教",
    affiliation_en: "Research Institute of Electrical Communication, Tohoku University",
    affiliation_ja: "東北大学 電気通信研究所",
    email_user: "shura.suzuki.c6",
    email_domain: "tohoku.ac.jp",
    portrait: {
      src: "assets/img/portrait.jpg",
      aspect: "4 / 5",
      position: "50% 50%",
      width: 240
    },
    links: {
      scholar: "https://scholar.google.com/citations?user=c3urSIcAAAAJ",
      researchmap: "https://researchmap.jp/shura-suzuki",
      orcid: "https://orcid.org/0000-0002-5392-2346",
      github: ""
    }
  },

  /* ---------- 各ページの本文（HTMLタグ <b> <em> <br> が使えます） ---------- */
  pages: {
    hero_statement: {
      en: "In a dark room you find the light switch by feel, one hand along the wall. Reading what the world offers and acting on it — this is where wisdom springs from. How do we make a friend of our environment? That question runs beneath everything I work on: how animals control their bodies and how machines might do the same, how extinct animals once moved, how individuals aggregate into a functioning group, and how we make sense of what generative AI says.",
      ja: "暗い部屋で，壁の感触を頼りに電灯のスイッチを探す．このように環境からの手がかりを頼りに振る舞うことは，智慧を生み出す礎となります．私は，いかに環境を友とするか？を大きな問いとして，動物の運動制御の理解と応用，絶滅動物の運動復元，集団行動の生成則，生成AIが語る言葉の理解などのテーマに取り組んでいます．"
    },
    papers_heading: {
      en: "Recent papers",
      ja: "最近の論文"
    },
    research_intro: {
      en: "Four intertwined lines of work, all circling the same question: <b>how does coherent movement arise without anyone being in charge?</b>",
      ja: "互いに絡みあう4つのテーマは，すべて同じ問いを巡っています．<b>指揮者なしに，いかにして整合的な動きが立ち上がるのか．</b>"
    }
  },

  /* ---------- 最近の活動  ※ researchmap から自動生成（表示は直近1年） ---------- */
  news: [
    {
      date: "2026-07",
      en: "Sensory-driven neck–limb coordination mechanisms for walk-trot-gallop gait transitions appeared in <em>Scientific Reports</em>.",
      ja: "「Sensory-driven neck–limb coordination mechanisms for walk-trot-gallop gait transitions」が <em>Scientific Reports</em> に掲載されました．",
      link: "https://doi.org/10.1038/s41598-026-61565-9"
    },
    {
      date: "2026-06",
      en: "Received the 部門優秀論文表彰 from 日本機械学会.",
      ja: "日本機械学会より部門優秀論文表彰を受賞しました．",
      ja_only: true
    },
    {
      date: "2026-05",
      en: "Gave an invited talk, “イモムシ群の奇妙な移動様式に着想を得た 群ロボットの開発”, at 東北大学 タフ･サイバーフィジカル AI研究センター シンポジウム.",
      ja: "東北大学 タフ･サイバーフィジカル AI研究センター シンポジウムにて招待講演「イモムシ群の奇妙な移動様式に着想を得た 群ロボットの開発」を行いました．",
      ja_only: true
    },
    {
      date: "2026-04",
      en: "Presented “Multi-articulated Vehicle That Mimics Caterpillar Swarm Locomotion” at RoboSoft 2026.",
      ja: "RoboSoft 2026 で「Multi-articulated Vehicle That Mimics Caterpillar Swarm Locomotion」を発表しました．"
    },
    {
      date: "2026-01",
      en: "Received the 計測自動制御学会システムインテグレーション部門講演会（SI2025）優秀講演賞.",
      ja: "計測自動制御学会システムインテグレーション部門講演会（SI2025）優秀講演賞を受賞しました．",
      ja_only: true
    },
    {
      date: "2025-09",
      en: "Gave an invited talk, “Swarm makes softness: Approach for soft-hard hybrid robot”, at Workshop on Bio-inspired Robotics and Physical AI.",
      ja: "Workshop on Bio-inspired Robotics and Physical AI にて招待講演「Swarm makes softness: Approach for soft-hard hybrid robot」を行いました．"
    },
    {
      date: "2025-09",
      en: "Presented 2 papers at SICE-FES 2025.<ul class=\"news-titles\"><li>A Simple Head-Trunk-Limb Coordination Control Capable of Three Types of Quadruped Galloping</li><li>Lizard-Like Robot with Decoupled Oscillator-Based Control</li></ul>",
      ja: "SICE-FES 2025 で2件発表しました．<ul class=\"news-titles\"><li>A Simple Head-Trunk-Limb Coordination Control Capable of Three Types of Quadruped Galloping</li><li>Lizard-Like Robot with Decoupled Oscillator-Based Control</li></ul>"
    },
    {
      date: "2025-09",
      en: "Started 東北大学タフ・サイバーフィジカルAI研究センター タフ・サイバーフィジカルAI研究プロジェクト as Principal Investigator.",
      ja: "東北大学タフ・サイバーフィジカルAI研究センター タフ・サイバーフィジカルAI研究プロジェクト（研究代表者）を開始しました．"
    },
    {
      date: "2025-08",
      en: "Multisensory feedback makes swimming circuits robust against spinal transection and enables terrestrial crawling in elongate fish appeared in <em>Proceedings of the National Academy of Sciences</em>.",
      ja: "「Multisensory feedback makes swimming circuits robust against spinal transection and enables terrestrial crawling in elongate fish」が <em>Proceedings of the National Academy of Sciences</em> に掲載されました．",
      link: "https://doi.org/10.1073/pnas.2422248122"
    },
    {
      date: "2025-07",
      en: "Presented 4 papers at The 12th International Symposium on Adaptive Motion of Animals and Machines and 2nd LokoAssist Symposium.<ul class=\"news-titles\"><li>Walk-Trot-Gallop Transition with Spinal Flexion in a Quadruped Model</li><li>Decentralized Control for Morphology-Adaptive Gait Generation in Sprawling Quadruped Locomotion</li><li>Simple Cellular Automaton Model for Understanding Caterpillar Swarm Locomotion</li><li>Decentralized Intra-Limb Coordination Mechanisms Toward Whole-Body Coordinated Quadruped Locomotion</li></ul>",
      ja: "The 12th International Symposium on Adaptive Motion of Animals and Machines and 2nd LokoAssist Symposium で4件発表しました．<ul class=\"news-titles\"><li>Walk-Trot-Gallop Transition with Spinal Flexion in a Quadruped Model</li><li>Decentralized Control for Morphology-Adaptive Gait Generation in Sprawling Quadruped Locomotion</li><li>Simple Cellular Automaton Model for Understanding Caterpillar Swarm Locomotion</li><li>Decentralized Intra-Limb Coordination Mechanisms Toward Whole-Body Coordinated Quadruped Locomotion</li></ul>"
    },
    {
      date: "2025-04",
      en: "Started 科研費 若手研究 as Principal Investigator.",
      ja: "科研費 若手研究（研究代表者）を開始しました．"
    },
    {
      date: "2025-03",
      en: "Received the 東北大学電気・情報系 若手優秀研究賞 from 東北大学電気・情報系 研究教授会.",
      ja: "東北大学電気・情報系 研究教授会より東北大学電気・情報系 若手優秀研究賞を受賞しました．",
      ja_only: true
    },
    {
      date: "2025-01",
      en: "Foot trajectory as a key factor for diverse gait patterns in quadruped robot locomotion appeared in <em>Scientific Reports</em>.",
      ja: "「Foot trajectory as a key factor for diverse gait patterns in quadruped robot locomotion」が <em>Scientific Reports</em> に掲載されました．",
      link: "https://doi.org/10.1038/s41598-024-84060-5"
    },
    {
      date: "2025-01",
      en: "Bicycle-inspired simple balance control method for quadruped robots in high-speed running appeared in <em>Frontiers in Robotics and AI</em>.",
      ja: "「Bicycle-inspired simple balance control method for quadruped robots in high-speed running」が <em>Frontiers in Robotics and AI</em> に掲載されました．",
      link: "https://doi.org/10.3389/frobt.2024.1473628"
    },
    {
      date: "2024-09",
      en: "Started 東北大学タフ・サイバーフィジカルAI研究センター タフ・サイバーフィジカルAI研究プロジェクト as Principal Investigator.",
      ja: "東北大学タフ・サイバーフィジカルAI研究センター タフ・サイバーフィジカルAI研究プロジェクト（研究代表者）を開始しました．"
    }
  ],


  /* ---------- 査読付き学術論文  ※ researchmap から自動生成（featured = 重要な業績） ---------- */
  journal: [
    {
      year: 2026,
      date: "2026-07",
      title: "Sensory-driven neck–limb coordination mechanisms for walk-trot-gallop gait transitions",
      authors: [
        "Shura Suzuki",
        "Atsushi Norita",
        "Yuya Asaoka",
        "Akira Fukuhara",
        "Masato Ishikawa",
        "Ryo Kobayashi",
        "Akio Ishiguro"
      ],
      venue: "Scientific Reports",
      detail: "",
      doi: "10.1038/s41598-026-61565-9",
      featured: true
    },
    {
      year: 2025,
      date: "2025-08",
      title: "Multisensory feedback makes swimming circuits robust against spinal transection and enables terrestrial crawling in elongate fish",
      authors: [
        "Kotaro Yasui",
        "Astha Gupta",
        "Qiyuan Fu",
        "Shura Suzuki",
        "Jeffrey Hainer",
        "Laura Paez",
        "Keegan Lutek",
        "Jonathan Arreguit",
        "Takeshi Kano",
        "Emily M. Standen",
        "Auke J. Ijspeert",
        "Akio Ishiguro"
      ],
      venue: "Proceedings of the National Academy of Sciences",
      detail: "122(34), e2422248122",
      doi: "10.1073/pnas.2422248122",
      featured: true
    },
    {
      year: 2025,
      date: "2025-01",
      title: "Foot trajectory as a key factor for diverse gait patterns in quadruped robot locomotion",
      authors: ["Shura Suzuki", "Kosuke Matayoshi", "Mitsuhiro Hayashibe", "Dai Owaki"],
      venue: "Scientific Reports",
      detail: "15(1), 1861",
      doi: "10.1038/s41598-024-84060-5",
      featured: true
    },
    {
      year: 2025,
      date: "2025-01",
      title: "Bicycle-inspired simple balance control method for quadruped robots in high-speed running",
      authors: ["Shoei Hattori", "Shura Suzuki", "Akira Fukuhara", "Takeshi Kano", "Akio Ishiguro"],
      venue: "Frontiers in Robotics and AI",
      detail: "11, 1473628",
      doi: "10.3389/frobt.2024.1473628"
    },
    {
      year: 2023,
      date: "2023",
      title: "Velocity control of mobile robots using Pace Maker Light system",
      authors: ["MITANI Yusuke", "SUZUKI Shura", "MINAMI Yuki", "ISHIKAWA Masato"],
      venue: "Transactions of the JSME (in Japanese)",
      detail: "89(918), 22-00250",
      doi: "10.1299/transjsme.22-00250",
      title_ja: "ペースメーカーライトを利用した移動ロボットの速度制御",
      venue_ja: "日本機械学会論文集",
      authors_ja: ["三谷 祐介", "鈴木 朱羅", "南 裕樹", "石川 将人"]
    },
    {
      year: 2021,
      date: "2021-11",
      title: "Simple decentralized control mechanism that enables limb adjustment for adaptive quadruped running.",
      authors: [
        "Akira Fukuhara",
        "Yukihiro Koizumi",
        "Tomoyuki Baba",
        "Shura Suzuki",
        "Takeshi Kano",
        "Akio Ishiguro"
      ],
      venue: "Proceedings of the Royal Society B: Biological Sciences",
      detail: "288(1962), 20211622",
      doi: "10.1098/rspb.2021.1622"
    },
    {
      year: 2021,
      date: "2021",
      title: "Spontaneous Gait Transitions of Sprawling Quadruped Locomotion by Sensory-Driven Body-Limb Coordination Mechanisms.",
      authors: ["Shura Suzuki", "Takeshi Kano", "Auke Jan Ijspeert", "Akio Ishiguro"],
      venue: "Frontiers in Neurorobotics",
      detail: "15, 645731",
      doi: "10.3389/fnbot.2021.645731"
    },
    {
      year: 2020,
      date: "2020",
      title: "Sprawling Quadruped Robot Driven by Decentralized Control With Cross-Coupled Sensory Feedback Between Legs and Trunk.",
      authors: ["Shura Suzuki", "Takeshi Kano", "Auke Jan Ijspeert", "Akio Ishiguro"],
      venue: "Frontiers in Neurorobotics",
      detail: "14, 607455",
      doi: "10.3389/fnbot.2020.607455"
    },
    {
      year: 2020,
      date: "2020",
      title: "Decentralized control mechanism for body-limb coordination in quadruped running.",
      authors: ["Akira Fukuhara", "Yukihiro Koizumi", "Shura Suzuki", "Takeshi Kano", "Akio Ishiguro"],
      venue: "Adaptive Behavior",
      detail: "28(3), 151–164",
      doi: "10.1177/1059712319865180"
    },
    {
      year: 2019,
      date: "2019-09",
      title: "Decentralized control with cross-coupled sensory feedback between body and limbs in sprawling locomotion.",
      authors: ["Shura Suzuki", "Takeshi Kano", "Auke J Ijspeert", "Akio Ishiguro"],
      venue: "Bioinspiration & Biomimetics",
      detail: "14(6), 066010",
      doi: "10.1088/1748-3190/ab3ef6"
    }
  ],

  /* ---------- 招待講演  ※ researchmap から自動生成 ---------- */
  invited: [
    {
      year: 2026,
      date: "2026-05",
      title: "イモムシ群の奇妙な移動様式に着想を得た 群ロボットの開発",
      venue: "東北大学 タフ･サイバーフィジカル AI研究センター シンポジウム",
      ja_only: true
    },
    {
      year: 2025,
      date: "2025-09",
      title: "Swarm makes softness: Approach for soft-hard hybrid robot",
      venue: "Workshop on Bio-inspired Robotics and Physical AI"
    },
    {
      year: 2024,
      date: "2024-07",
      title: "動物の運動制御を制御理論からみるために",
      venue: "令和6年度第1回ブレインウェア工学研究会",
      ja_only: true
    },
    {
      year: 2023,
      date: "2023-08",
      title: "ロボットをつくりながら動物の運動のからくりを知る",
      venue: "第8回FRIS/DIARE Joint Workshop",
      ja_only: true
    },
    {
      year: 2022,
      date: "2022-07",
      title: "脚式動物に通底する運動制御の理解を目指して",
      venue: "Neuro-robotics seminar",
      ja_only: true
    },
    {
      year: 2018,
      date: "2018-02",
      title: "A Simple Body-Limb Coordination Rule Underlying Primitive Tetrapod Locomotion",
      venue: "The 5th International Symposium on Brainware LSI"
    }
  ],

  /* ---------- 国際会議発表  ※ researchmap から自動生成 ---------- */
  conference: [
    {
      year: 2026,
      date: "2026-04",
      title: "Multi-articulated Vehicle That Mimics Caterpillar Swarm Locomotion",
      venue: "RoboSoft 2026",
      authors: [
        "Shura Suzuki",
        "Daisuke Nakanishi",
        "Keisuke Naniwa",
        "Yasuhiro Sugimoto",
        "Tetsuya Kinugasa",
        "Masato Ishikawa",
        "Akio Ishiguro"
      ]
    },
    {
      year: 2025,
      date: "2025-09",
      title: "A Simple Head-Trunk-Limb Coordination Control Capable of Three Types of Quadruped Galloping",
      venue: "SICE-FES 2025",
      authors: [
        "Goku Sawada",
        "Seokhyun Kim",
        "Shura Suzuki",
        "Kotaro Yasui",
        "Akira Fukuhara",
        "Akio Ishiguro"
      ]
    },
    {
      year: 2025,
      date: "2025-09",
      title: "Lizard-Like Robot with Decoupled Oscillator-Based Control",
      venue: "SICE-FES 2025",
      authors: ["Shura Suzuki", "Akio Ishiguro"]
    },
    {
      year: 2025,
      date: "2025-07",
      title: "Walk-Trot-Gallop Transition with Spinal Flexion in a Quadruped Model",
      venue: "The 12th International Symposium on Adaptive Motion of Animals and Machines and 2nd LokoAssist Symposium",
      authors: ["Shura Suzuki", "Goku Sawada", "Kotaro Yasui", "Akira Fukuhara", "Akio Ishiguro"]
    },
    {
      year: 2025,
      date: "2025-07",
      title: "Decentralized Control for Morphology-Adaptive Gait Generation in Sprawling Quadruped Locomotion",
      venue: "The 12th International Symposium on Adaptive Motion of Animals and Machines and 2nd LokoAssist Symposium",
      authors: ["Shura Suzuki", "Satoshi Maeda", "Kotaro Yasui", "Akio Ishiguro"]
    },
    {
      year: 2025,
      date: "2025-07",
      title: "Simple Cellular Automaton Model for Understanding Caterpillar Swarm Locomotion",
      venue: "The 12th International Symposium on Adaptive Motion of Animals and Machines and 2nd LokoAssist Symposium",
      authors: ["Shura Suzuki", "Keisuke Naniwa", "Masato Ishikawa", "Akio Ishiguro"]
    },
    {
      year: 2025,
      date: "2025-07",
      title: "Decentralized Intra-Limb Coordination Mechanisms Toward Whole-Body Coordinated Quadruped Locomotion",
      venue: "The 12th International Symposium on Adaptive Motion of Animals and Machines and 2nd LokoAssist Symposium",
      authors: [
        "Seokhyun Kim",
        "Goku Sawada",
        "Satoshi Maeda",
        "Shoei Hattori",
        "Shura Suzuki",
        "Kotaro Yasui",
        "Akio Ishiguro"
      ]
    },
    {
      year: 2024,
      date: "2024-01",
      title: "Estimation of Vehicle Position and Speed Using Traffic Mirror Images at Intersection",
      venue: "29th International Symposium on Artificial Life and Robotics",
      authors: ["Hiroto Kawahata", "Yuki Minami", "Shura Suzuki", "Masto Ishikawa"]
    },
    {
      year: 2023,
      date: "2023-06",
      title: "Asynchronous Bilateral Body Bending Enables Fast Cheetah-like Rotary Galloping",
      venue: "The 11th International Symposium on Adaptive Motion of Animals and Machines (AMAM2023)",
      authors: ["Suzuki Shura", "Asaoka Yuya", "Maeda Satoshi", "Amaike Hayato", "Ishiguro Akio"]
    },
    {
      year: 2023,
      date: "2023",
      title: "Prototype of a Highly Decentralized and Super-Multipedal Brainless Walking Robot",
      venue: "The Proceedings of JSME annual Conference on Robotics and Mechatronics (Robomec)",
      authors: [
        "MASUDA Yoichi",
        "GOTO Takahiro",
        "NANIWA Keisuke",
        "URA Daisuke",
        "NAKANISHI Daisuke",
        "SUZUKI Shura",
        "SUGIMOTO Yasuhiro",
        "OSUKA Koichi"
      ]
    },
    {
      year: 2023,
      date: "2023",
      title: "Exploring Mechanisms Underlying Cheetah-like Rotary Gallop by a Simple Robot",
      venue: "The Proceedings of JSME annual Conference on Robotics and Mechatronics (Robomec)",
      authors: [
        "MAEDA Satoshi",
        "ASAOKA Yuya",
        "HATTORI Shoei",
        "SUZUKI Shura",
        "KOBAYASHI Ryo",
        "ISHIGURO Akio"
      ]
    },
    {
      year: 2022,
      date: "2022-09",
      title: "Decoupled Oscillator-based Control for Lizard-like walking",
      venue: "SICE Annual Conference 2022",
      authors: ["Shura Suzuki", "Takeshi Kano", "Akio Ishiguro"]
    },
    {
      year: 2022,
      date: "2022",
      title: "Decentralized Control Mechanisms for Trunk, Head, and Tail-limb Coordination in Quadruped Running.",
      venue: "Robotics in Natural Settings - CLAWAR 2022(CLAWAR)",
      authors: [
        "Shura Suzuki",
        "Yuya Asaoka",
        "Atsushi Norita",
        "Akira Fukuhara",
        "Masato Ishikawa",
        "Akio Ishiguro"
      ]
    },
    {
      year: 2022,
      date: "2022",
      title: "Tegotae-Based Control for Non-animal-like Locomotion: A Case Study with Trident Snake.",
      venue: "Robotics in Natural Settings - CLAWAR 2022(CLAWAR)",
      authors: ["Shura Suzuki", "Masato Ishikawa"]
    },
    {
      year: 2022,
      date: "2022",
      title: "Decentralized Control That Can Generate Morphology-dependent Quadrupedal Running",
      venue: "The Proceedings of JSME annual Conference on Robotics and Mechatronics (Robomec)",
      authors: ["ASAOKA Yuya", "NORITA Atsushi", "SUZUKI Shura", "FUKUHARA Akira", "ISHIGURO Akio"]
    },
    {
      year: 2021,
      date: "2021",
      title: "Development of Neck Units That Quadruped Robot Can Exploit for Efficient Nodding Walking",
      venue: "The Proceedings of JSME annual Conference on Robotics and Mechatronics (Robomec)",
      authors: [
        "FUKUHARA Akira",
        "GUNJI Megu",
        "MASUDA Yoichi",
        "TADAKUMA Kenjiro",
        "SUZUKI Shura",
        "KANO Takeshi",
        "ISHIGURO Akio"
      ]
    },
    {
      year: 2021,
      date: "2021",
      title: "Towards Realization of Legged Robot Capable of Adaptive Running",
      venue: "The Proceedings of JSME annual Conference on Robotics and Mechatronics (Robomec)",
      authors: ["BABA Tomoyuki", "SUZUKI Shura", "FUKUHARA Akira", "KANO Takeshi", "ISHIGURO Akio"]
    },
    {
      year: 2021,
      date: "2021",
      title: "Decentralized Control of a Quadruped Robot That Can Generate Speed-dependent Adaptive Neck Movements",
      venue: "The Proceedings of JSME annual Conference on Robotics and Mechatronics (Robomec)",
      authors: ["NORITA Atsushi", "SUZUKI Shura", "FUKUHARA Akira", "KANO Takeshi", "ISHIGURO Akio"]
    },
    {
      year: 2020,
      date: "2020",
      title: "Development of Quadruped Robot for Stable and Adaptive High-Speed Running",
      venue: "The Proceedings of JSME annual Conference on Robotics and Mechatronics (Robomec)",
      authors: ["BABA Tomoyuki", "SUZUKI Shura", "FUKUHARA Akira", "KANO Takeshi", "ISHIGURO Akio"]
    },
    {
      year: 2020,
      date: "2020",
      title: "Sprawling Quadruped Robot Driven by Decentralized Control That Coordinates Leg and Body Motions",
      venue: "The Proceedings of JSME annual Conference on Robotics and Mechatronics (Robomec)",
      authors: ["Suzuki Shura", "Kano Takeshi", "Ijspeert Auke J.", "Ishiguro Akio"]
    },
    {
      year: 2019,
      date: "2019-08",
      title: "A Salamander Robot Driven by Cross-coupled Sensory Feedback Control Between Legs and Trunk",
      venue: "9th International Symposium on Adaptive Motion of Animals and Machines (AMAM2019)",
      authors: ["Shura Suzuki", "Takeshi Kano", "Auke J. Ijspeer", "Akio Ishiguro"]
    },
    {
      year: 2019,
      date: "2019",
      title: "Decentralized Coordination Mechanism between Neck and Limbs for Efficient Quadrupedal Walking.",
      venue: "2019 IEEE/RSJ International Conference on Intelligent Robots and Systems(IROS)",
      authors: ["Akira Fukuhara", "Shura Suzuki", "Takeshi Kano", "Akio Ishiguro"]
    },
    {
      year: 2019,
      date: "2019",
      title: "Quadruped Robot That Exploits Body-limb Coordination for High Speed Running",
      venue: "The Proceedings of JSME annual Conference on Robotics and Mechatronics (Robomec)",
      authors: ["KOIZUMI Yukihiro", "SUZUKI Shura", "FUKUHARA Akira", "KANO Takeshi", "ISHIGURO Akio"]
    },
    {
      year: 2018,
      date: "2018",
      title: "Minimal Model for Body-Limb Coordination in Quadruped High-Speed Running.",
      venue: "From Animals to Animats 15 - 15th International Conference on Simulation of Adaptive Behavior(SAB)",
      authors: ["Akira Fukuhara", "Yukihiro Koizumi", "Shura Suzuki", "Takeshi Kano", "Akio Ishiguro"]
    },
    {
      year: 2018,
      date: "2018",
      title: "Cheetah-like High Speed Running Robot That Exploits Body-limb Coordination",
      venue: "The Proceedings of JSME annual Conference on Robotics and Mechatronics (Robomec)",
      authors: ["KOIZUMI Yukihiro", "SUZUKI Shura", "FUKUHARA Akira", "KANO Takeshi", "ISHIGURO Akio"]
    },
    {
      year: 2017,
      date: "2017-09",
      title: "A simple body-limb coordination model that mimics primitive tetrapod walking",
      venue: "2017 56th Annual Conference of the Society of Instrument and Control Engineers of Japan (SICE)",
      authors: [
        "Shura Suzuki",
        "Akira Fukuhara",
        "Dai Owaki",
        "Takeshi Kano",
        "Auke J. Ijspeert",
        "Akio Ishiguro"
      ]
    },
    {
      year: 2017,
      date: "2017-06",
      title: "A Minimal Model for Body-limb Coordination in Quadruped Locomotion",
      venue: "8th International Symposium on Adaptive Motion of Animals and Machines (AMAM2017)",
      authors: [
        "Shura Suzuki",
        "Akira Fukuhara",
        "Dai Owaki",
        "Takeshi Kano",
        "Auke J. Ijspeer",
        "Akio Ishiguro"
      ]
    },
    {
      year: 2016,
      date: "2016-07",
      title: "Quadruped Gait Transition from Walk to Pace to Rotary Gallop by Exploiting Head Movement",
      venue: "5th International Conference on Biomimetic;Biohybrid Systems;Living Machines",
      authors: ["Shura Suzuki", "Dai Owaki", "Akira Fukuhara", "Akio Ishiguro"]
    },
    {
      year: 2016,
      date: "2016",
      title: "Quadruped Gait Transition from Walk to Pace to Rotary Gallop by Exploiting Head Movement",
      venue: "The Proceedings of JSME annual Conference on Robotics and Mechatronics (Robomec)",
      authors: ["OWAKI Dai", "SUZUKI Shura", "FUKUHARA Akira", "Ishiguro Akio"]
    },
    {
      year: 2015,
      date: "2015-06",
      title: "TEGOTAE-based CPG Control for Quadruped Locomotion",
      venue: "7th International Symposium on Adaptive Motion of Animals and Machines (AMAM2015)",
      authors: ["Dai Owaki", "Shura Suzuki", "Akio Ishiguro"]
    },
    {
      year: 2015,
      date: "2015",
      title: "TEGOTAE-based CPG Control of Quadruped Robot",
      venue: "The Proceedings of JSME annual Conference on Robotics and Mechatronics (Robomec)",
      authors: ["SUZUKI Shura", "OWAKI Dai", "ISHIGURO Akio"]
    }
  ],

  /* ---------- 件数など  ※ researchmap から自動生成 ---------- */
  stats: {
    domestic_talks: 34
  },


  /* ---------- 受賞  ※ researchmap から自動生成 ---------- */
  awards: [
    {
      date: "2026-06",
      en: "部門優秀論文表彰",
      ja: "部門優秀論文表彰",
      org_en: "日本機械学会",
      org_ja: "日本機械学会",
      for_ja: "ペースメーカーライトを利用した移動ロボットの速度制御",
      ja_only: true
    },
    {
      date: "2026-01",
      en: "計測自動制御学会システムインテグレーション部門講演会（SI2025）優秀講演賞",
      ja: "計測自動制御学会システムインテグレーション部門講演会（SI2025）優秀講演賞",
      org_en: "",
      org_ja: "",
      for_ja: "イモムシ群移動の構成論的理解に向けた群ロボットの開発：第一報：多関節能動車輪機構における登坂性能の検証",
      ja_only: true
    },
    {
      date: "2025-03",
      en: "東北大学電気・情報系 若手優秀研究賞",
      ja: "東北大学電気・情報系 若手優秀研究賞",
      org_en: "東北大学電気・情報系 研究教授会",
      org_ja: "東北大学電気・情報系 研究教授会",
      for_ja: "",
      ja_only: true
    },
    {
      date: "2023-01",
      en: "計測自動制御学会関西支部支部長賞奨励賞",
      ja: "計測自動制御学会関西支部支部長賞奨励賞",
      org_en: "",
      org_ja: "",
      for_ja: "非生物ロコモーションのための手応え制御：三叉ヘビを用いたケーススタディ",
      ja_only: true
    },
    {
      date: "2022-02",
      en: "計測自動制御学会学術奨励賞・研究奨励賞",
      ja: "計測自動制御学会学術奨励賞・研究奨励賞",
      org_en: "",
      org_ja: "",
      for_ja: "原始四足動物の歩行運動制御に関する一考察",
      ja_only: true
    },
    {
      date: "2018-02",
      en: "第314回計測自動制御学会東北支部研究集会 優秀発表奨励賞",
      ja: "第314回計測自動制御学会東北支部研究集会 優秀発表奨励賞",
      org_en: "",
      org_ja: "",
      for_ja: "頭部運動を活用する四脚ロボットのCPG制御",
      ja_only: true
    },
    {
      date: "2015-09",
      en: "第21回創発システム・シンポジウム優秀講演賞",
      ja: "第21回創発システム・シンポジウム優秀講演賞",
      org_en: "計測自動制御学会",
      org_ja: "計測自動制御学会",
      for_ja: "環境を友とする四脚ロボット",
      ja_only: true
    }
  ],

  /* ---------- 外部資金  ※ researchmap から自動生成 ---------- */
  grants: [
    {
      period: "2025–2026",
      start: "2025-09",
      title_en: "イモムシ群の奇妙な移動様式に着想を得た群クローラ機構の開発",
      title_ja: "イモムシ群の奇妙な移動様式に着想を得た群クローラ機構の開発",
      scheme_en: "東北大学タフ・サイバーフィジカルAI研究センター タフ・サイバーフィジカルAI研究プロジェクト",
      scheme_ja: "東北大学タフ・サイバーフィジカルAI研究センター タフ・サイバーフィジカルAI研究プロジェクト",
      role_en: "Principal Investigator",
      role_ja: "研究代表者",
      grant_number: "",
      ja_only: true
    },
    {
      period: "2025–2028",
      start: "2025-04",
      title_en: "大地を泳ぐトカゲから切り拓く臨機応変な全身統御理論",
      title_ja: "大地を泳ぐトカゲから切り拓く臨機応変な全身統御理論",
      scheme_en: "科研費 若手研究",
      scheme_ja: "科研費 若手研究",
      role_en: "Principal Investigator",
      role_ja: "研究代表者",
      grant_number: "25K21309",
      ja_only: true
    },
    {
      period: "2024–2025",
      start: "2024-09",
      title_en: "アメーバに着想を得た大変形柔軟移動ロボットの開発",
      title_ja: "アメーバに着想を得た大変形柔軟移動ロボットの開発",
      scheme_en: "東北大学タフ・サイバーフィジカルAI研究センター タフ・サイバーフィジカルAI研究プロジェクト",
      scheme_ja: "東北大学タフ・サイバーフィジカルAI研究センター タフ・サイバーフィジカルAI研究プロジェクト",
      role_en: "Principal Investigator",
      role_ja: "研究代表者",
      grant_number: "",
      ja_only: true
    },
    {
      period: "2023–2025",
      start: "2023-03",
      title_en: "現代制御と動物規範制御のハイブリッド理論の創成：手応えに基づくアプローチ",
      title_ja: "現代制御と動物規範制御のハイブリッド理論の創成：手応えに基づくアプローチ",
      scheme_en: "科研費 特別研究員奨励費",
      scheme_ja: "科研費 特別研究員奨励費",
      role_en: "Principal Investigator",
      role_ja: "研究代表者",
      grant_number: "22KJ2098",
      ja_only: true
    },
    {
      period: "2022–2026",
      start: "2022-04",
      title_en: "古生物運動制御学：絶滅動物の運動様式の革新的復元方法の創成",
      title_ja: "古生物運動制御学：絶滅動物の運動様式の革新的復元方法の創成",
      scheme_en: "科研費 基盤研究(A)",
      scheme_ja: "科研費 基盤研究(A)",
      role_en: "Co-Investigator",
      role_ja: "研究分担者",
      grant_number: "22H00203",
      ja_only: true
    },
    {
      period: "2020–2022",
      start: "2020-04",
      title_en: "特異なロコモーション様式を発現するワニから切り拓く全身自由度の統御原理",
      title_ja: "特異なロコモーション様式を発現するワニから切り拓く全身自由度の統御原理",
      scheme_en: "科研費 特別研究員奨励費",
      scheme_ja: "科研費 特別研究員奨励費",
      role_en: "Principal Investigator",
      role_ja: "研究代表者",
      grant_number: "20J10805",
      ja_only: true
    }
  ],

  /* ---------- 職歴  ※ researchmap から自動生成 ---------- */
  career: [
    {
      period: "2024–",
      start: "2024-04",
      en: "Assistant Professor, Research Institute of Electrical Communication, Tohoku University",
      ja: "東北大学 電気通信研究所 助教"
    },
    {
      period: "2021–2024",
      start: "2021-04",
      en: "JSPS Research Fellow (PD), Japan Society for the Promotion of Science",
      ja: "独立行政法人日本学術振興会 特別研究員（PD）"
    },
    {
      period: "2021–2024",
      start: "2021-04",
      en: "Specially Appointed Researcher, Graduate School of Engineering, Osaka University",
      ja: "大阪大学 大学院工学研究科 特任研究員"
    },
    {
      period: "2020–2021",
      start: "2020-04",
      en: "JSPS Research Fellow (DC2), Japan Society for the Promotion of Science",
      ja: "独立行政法人日本学術振興会 特別研究員（DC2）"
    }
  ],

  /* ---------- 学歴  ※ researchmap から自動生成 ---------- */
  education: [
    {
      period: "2018–2021",
      en: "Doctoral Program, Department of Electrical Engineering, Graduate School of Engineering, Tohoku University",
      ja: "東北大学 大学院工学研究科 電気エネルギーシステム専攻 博士課程後期3年の課程"
    },
    {
      period: "2015–2018",
      en: "Master's Program, Department of Electrical Engineering, Graduate School of Engineering, Tohoku University",
      ja: "東北大学 大学院工学研究科 電気エネルギーシステム専攻 博士課程前期2年の課程"
    },
    {
      period: "2011–2015",
      en: "Undergraduate Program, Department of Electrical, Information and Physics Engineering, Faculty of Engineering, Tohoku University",
      ja: "東北大学 工学部 情報知能システム総合学科"
    },
    {
      period: "2008–2011",
      en: "Sakura High School, Chiba Prefecture",
      ja: "千葉県立佐倉高等学校 普通科"
    }
  ],

  /* ---------- 担当科目  ※ researchmap から自動生成 ---------- */
  teaching: [
    {
      period: "2024–",
      en: "学生実験A, 東北大学工学研究科電気情報物理工学科",
      ja: "学生実験A　東北大学工学研究科電気情報物理工学科",
      ja_only: true
    },
    {
      period: "2024",
      en: "数理モデリングPBL, 東北大学人工知能エレクトロニクス卓越大学院プログラム",
      ja: "数理モデリングPBL　東北大学人工知能エレクトロニクス卓越大学院プログラム",
      ja_only: true
    }
  ],

  /* ---------- 委員歴  ※ researchmap から自動生成 ---------- */
  service: [
    {
      period: "2026–",
      en: "会誌編集委員, 日本ロボット学会",
      ja: "日本ロボット学会 会誌編集委員",
      ja_only: true
    },
    {
      period: "2025–",
      en: "Publicity Chair, DARS 2026 The 18th International Symposium on Distributed Autonomous Robotic Systems Organizing Committee",
      ja: "DARS 2026 The 18th International Symposium on Distributed Autonomous Robotic Systems Organizing Committee Publicity Chair"
    },
    {
      period: "2025–",
      en: "WG委員, 東北大学附置研究所若手アンサンブルプロジェクト",
      ja: "東北大学附置研究所若手アンサンブルプロジェクト WG委員",
      ja_only: true
    },
    {
      period: "2024–2026",
      en: "自律分散システム部会運営委員, 公益社団法人 計測自動制御学会 システム・情報部門 自律分散システム部会",
      ja: "公益社団法人 計測自動制御学会 システム・情報部門 自律分散システム部会 自律分散システム部会運営委員",
      ja_only: true
    },
    {
      period: "2023–",
      en: "The 11th International Symposium on Adaptive Motion of Animals and Machines (AMAM2023), Organizing Committee",
      ja: "The 11th International Symposium on Adaptive Motion of Animals and Machines (AMAM2023), Organizing Committee"
    },
    {
      period: "2023–",
      en: "Frontiers in Neurorobotics Review editor",
      ja: "Frontiers in Neurorobotics Review editor"
    },
    {
      period: "2021–2022",
      en: "第34回自律分散システム・シンポジウム実行委員, 計測自動制御学会自律分散システム部会",
      ja: "計測自動制御学会自律分散システム部会 第34回自律分散システム・シンポジウム実行委員",
      ja_only: true
    }
  ],

  /* ---------- 所属学会  ※ researchmap から自動生成 ---------- */
  memberships: [
    {
      period: "2021–",
      en: "システム制御情報学会",
      ja: "システム制御情報学会",
      ja_only: true
    },
    {
      period: "2018–",
      en: "計測自動制御学会",
      ja: "計測自動制御学会",
      ja_only: true
    },
    {
      period: "2015–",
      en: "日本ロボット学会",
      ja: "日本ロボット学会",
      ja_only: true
    }
  ]

};
