import imgWashDay from "../assets/welcome/wash-day-hair.png";
import imgSisterLocs from "../assets/welcome/welcome-sister-locs.png";
import imgStraightHair from "../assets/welcome/welcome-straight-hair.png";
import imgBraids from "../assets/welcome/welcome-braids.png";

export type CrownBlogPost = {
  slug: string;
  id: string;
  dateISO: string;
  dateLabel: string;
  category: string;
  title: string;
  excerpt: string;
  readMins: number;
  src: string;
  alt: string;
  paragraphs: string[];
  tips?: string[];
  /**
   * When artwork has a lot of negative space above the subject, bias `object-fit: cover`
   * toward the lower frame so the tile feels full (e.g. hero collage crops).
   */
  photoFocus?: "lower";
};

export type CrownGuide = {
  slug: string;
  label: string;
  excerpt: string;
  src: string;
  alt: string;
  intro: string[];
  sections: { heading: string; body: string[] }[];
  closing: string;
};

export const CROWN_BLOG_POSTS: CrownBlogPost[] = [
  {
    slug: "locs-moisture",
    id: "locs-moisture",
    dateISO: "2025-03-12",
    dateLabel: "March 12, 2025",
    category: "Sister locs",
    title: "Moisture that actually stays in your locs",
    excerpt:
      "The difference between wet hair and hydrated locs — plus the leave-in vs. oil order that finally clicked for our editors.",
    readMins: 6,
    src: imgSisterLocs,
    alt: "Illustration of an African American woman with sisterlocks",
    paragraphs: [
      "There is a quiet difference between hair that was recently sprayed and locs that still feel supple days later. Water alone often flashes off the surface before your strands have had a real drink — especially if your environment is dry, air-conditioned, or you spend long stretches under hood dryers and office vents.",
      "Hydration, for many of us with sisterlocks or traditional locs, is less about a single miracle product and more about layering in the right order: moisture first, then something to slow evaporation where you need it. That usually means a water-based mist or light leave-in on damp hair, worked gently down the shaft, before you even think about heavier oils or butters.",
      "Oil is not a moisturizer — it can seal, shine, and protect ends that feel thirsty, but if you skip the water-based step, you may simply be coating dry hair. Try paying attention to how your locs feel on day two and day three, not just right after your routine. That delayed feedback tells you whether your scalp is happy and whether your length is holding elasticity.",
      "Buildup is the other side of the coin. If creams stack up between retwists, clarify on a schedule that matches your life — workouts, hard water, heavy products — then follow with something conditioning so hair does not feel stripped. Your parts and edges deserve the same gentleness you would offer a friend who is overwhelmed: clear, simple steps, no shame for figuring it out as you go.",
    ],
    tips: [
      "Mist with water or a water-first spray, then add a dime-size of leave-in on damp length — not a soaking wet scalp unless you know that works for you.",
      "Seal ends lightly if they feel dry; keep heavy grease away from roots if you are prone to buildup.",
      "Note how locs feel 48 hours later — adjust frequency before you change every product at once.",
    ],
  },
  {
    slug: "braid-tension",
    id: "braid-tension",
    dateISO: "2025-03-08",
    dateLabel: "March 8, 2025",
    category: "Braids",
    title: "Braid day without the tension headache",
    excerpt:
      "What to ask your braider for, how to check tension at the mirror, and when to take a style down early — guilt-free.",
    readMins: 7,
    src: imgBraids,
    alt: "Illustration of an African American woman with braided hairstyle",
    paragraphs: [
      "You are paying for a service, not for permission to be in pain. The best protective styles hold your hair without pulling your follicles into a constant wince. If the chair feels like endurance sport, it is worth slowing down long enough to ask for larger sections, knotless roots, or a different braid size — before every row is locked in.",
      "Check the first completed line at the mirror: can you make a relaxed brow raise without pain along the hairline? Are the parts straight but your skin not lifting into micro-bumps? Headaches the same night, burning along the edges, or pain when you smile are signals, not drama. Adjustments are easier early, and a good stylist would rather fix tension than lose your trust.",
      "Protective styles only protect when circulation and cleansing still make sense. Plan how you will reach your scalp — diluted shampoo, targeted applicator, or a rinse routine your braider recommends — and how long you will realistically keep the install before hair at the root needs room to move.",
      "When it is time to take braids down, schedule patience. Finger detangle, clip sections, and deep condition before you rush into the next style. That reset is what makes the next install start on healthy ground instead of on breakage you did not see coming.",
    ],
    tips: [
      "Speak up during the appointment — “Can we loosen this row?” is a complete sentence.",
      "If you need pain relievers to sleep after braid day, consider removing or redoing tension-heavy rows.",
      "Do not exceed the healthy window for your hair type — when new growth feels stressed, it is time.",
    ],
  },
  {
    slug: "silk-press-recovery",
    id: "silk-press-recovery",
    dateISO: "2025-03-05",
    dateLabel: "March 5, 2025",
    category: "Straight hair",
    title: "Silk press weeks and recovery days",
    excerpt:
      "How to enjoy sleek styles without making heat the only character in your hair story — plus humidity hacks that are not punishment.",
    readMins: 5,
    src: imgStraightHair,
    alt: "Illustration of an African American woman with sleek straight hair",
    paragraphs: [
      "A silk press can feel like armor and armor-off at the same time: smooth, swingy, and a little vulnerable to weather. Recovery is not moral — it is mechanical. Heat-damaged hair and heat-styled hair are different stories, and you get to write yours with intention rather than guilt.",
      "Heat protectant every pass is non-negotiable if you are pressing regularly. So is a reasonable temperature for your texture and the condition you are in that month. Between press appointments, braid-and-bun days, low manipulation twists, or a wash-and-go chapter are not setbacks; they are how strength cycles back in.",
      "Humidity is not a personal failure. Anti-humidity serums, light holding sprays, and realistic expectations (maybe ends fluff before roots do) can save your mood on summer walks. Sometimes the flex is choosing a texture that matches the season instead of fighting the air for two weeks straight.",
      "Listen when your ends go thin or your curl pattern stops bouncing back after water — that is data, not shame. A stylist who knows your goals can help you map press frequency, trims, and protein-moisture balance without judgment.",
    ],
    tips: [
      "Alternate heat weeks with two weeks of moisture-forward, low-manipulation styles when you can.",
      "Deep condition after major heat sessions; protein only when your hair actually likes it.",
      "Carry a silk scrunchie or loose bun plan for surprise rain — plan B beats bathroom panic.",
    ],
  },
  {
    slug: "wash-day-ritual",
    id: "wash-day-ritual",
    dateISO: "2025-02-26",
    dateLabel: "February 26, 2025",
    category: "All textures",
    title: "Wash day as a ritual, not a marathon",
    excerpt:
      "Breaking the cycle of “I’ll do it Sunday” dread — prep, timing, and tiny rewards that make cleansing feel like care.",
    readMins: 4,
    src: imgWashDay,
    alt: "Illustration of an African American woman peacefully washing her natural hair with lather and warm light",
    paragraphs: [
      "Wash day carries a reputation — hours on your feet, products everywhere, and the emotional weight of wanting your hair to cooperate. Renaming it as a ritual does not erase the labor, but it can change the soundtrack: warm water, a podcast that feels like company, or ten minutes of nothing but scalp massage because nobody is rushing you.",
      "Prep wins most battles. Detangle in sections before the shower if that is your hair’s love language. Line up towels, clips, and conditioner so you are not dripping on cold tile hunting for tools. If you have kids or caregivers in the house, trade time blocks honestly — your crown time counts as real infrastructure.",
      "You do not owe anyone a twelve-step routine you saw online. A simple cleanse, one conditioning step that works, and a style you can maintain may outperform a shelf of half-used bottles. Track what your hair does on day three, not what the bottle promised on the label.",
      "End with something small that signals “done” — tea, lotion, a text to a friend who gets it. Hair care that lands in your nervous system as care tends to get repeated.",
    ],
  },
];

export const CROWN_GUIDES: CrownGuide[] = [
  {
    slug: "sister-locs",
    label: "Sister locs",
    excerpt:
      "Retwist schedules, buildup, and how to keep your parts happy — without treating your crown like a chore list.",
    src: imgSisterLocs,
    alt: "Illustration of an African American woman with sisterlocks",
    intro: [
      "Sisterlocks and small traditional locs ask for steadiness more than perfection. Your pattern, density, and lifestyle will shape how often you retwist, how you sweat, and how much product your scalp actually tolerates.",
      "The goal is healthy roots, comfortable tension, and length that grows with you — not a comparison chart with someone else’s timeline on the internet.",
    ],
    sections: [
      {
        heading: "Retwists and timing",
        body: [
          "Many people land between four and eight weeks depending on new growth, activity level, and loctician guidance. If roots feel spongy or slip out of the pattern, you may be going too long; if scalp aches or parts look stressed, you may be going too tight or too often.",
          "Communicate clearly at appointments: photos of concerns, notes on products that flaked, and honest feedback about pain. A good practitioner adjusts — that is part of the service.",
        ],
      },
      {
        heading: "Moisture and buildup",
        body: [
          "Light, water-forward hydration usually serves locs better than thick creams stacked week after week. If you see residue, clarify gently and return to a simpler routine before adding more layers.",
          "Pay attention to hard water, gym schedules, and swim days — rinse well and treat chlorine or salt as part of the plan, not a surprise attack.",
        ],
      },
      {
        heading: "Lifestyle and confidence",
        body: [
          "Your locs do not need to look “done” every day to be professional, beautiful, or yours. Scarves, pins, and half-up styles are valid uniforms for boardrooms and playgrounds alike.",
          "When you are tired of the journey, community helps — not for comparison, but for reminders that slow growth still counts.",
        ],
      },
    ],
    closing:
      "Wherever you are in your loc journey, you belong in spaces that celebrate Black hair without turning it into a performance. The Inner Circle neighborhood is one place to talk it out — judgment-free, neighbor to neighbor.",
  },
  {
    slug: "straight-hair",
    label: "Straight hair",
    excerpt:
      "Silk presses, heat balance, and humidity — how to enjoy sleek styles while keeping strands strong between appointments.",
    src: imgStraightHair,
    alt: "Illustration of an African American woman with sleek straight hair",
    intro: [
      "Straightened styles — presses, blowouts, and stretched looks — are cultural, professional, and deeply personal. Strength and shine can coexist when heat is a tool, not the only tool you allow yourself.",
      "This guide centers care between appointments, not telling you whether to wear your hair straight. That choice stays yours.",
    ],
    sections: [
      {
        heading: "Heat with boundaries",
        body: [
          "Use a heat protectant formulated for your texture and follow the temperature guidance your stylist recommends when you are at home between visits.",
          "If you notice patchy breakage or ends that won’t hold curl when you wet your hair, pause pressing and book a consultation — early shifts save length.",
        ],
      },
      {
        heading: "Humidity and real life",
        body: [
          "Serums and wraps can buy you time, but weather wins sometimes. Having a backup style — low bun, braid-back, or textured week — protects your peace as much as your strands.",
          "Sweat and workouts are not failures; plan rinse days or dry-shampoo alternatives that your scalp tolerates.",
        ],
      },
      {
        heading: "Recovery as routine",
        body: [
          "Schedule recovery the way you schedule trims: intentional, recurring, and non-negotiable when your hair says so.",
          "Moisture-forward weeks, protein when needed, and protective options you actually like will keep straight chapters sustainable.",
        ],
      },
    ],
    closing:
      "You never owe strangers an explanation for how you wear your hair. When you want peer stories, swaps, or venting about humidity, the circle is here.",
  },
  {
    slug: "braids",
    label: "Braids",
    excerpt:
      "Knotless, box braids, twists — tension, edges, and wash day so protective styles stay protective.",
    src: imgBraids,
    alt: "Illustration of an African American woman with braided hairstyle",
    intro: [
      "Braids, twists, and cornrow-based styles carry history, creativity, and serious utility. The best installs feel secure without screaming at your edges every time you turn your head.",
      "Protective means protecting the follicle, the length you tuck in, and your time — not suffering for aesthetics.",
    ],
    sections: [
      {
        heading: "Tension and communication",
        body: [
          "Pain is information. Ask for knotless options, larger sections, or different braid sizes if your scalp is sensitive — before the style is finished.",
          "Take breaks during long appointments when you need them; hydration and snacks are part of hair care too.",
        ],
      },
      {
        heading: "Scalp care while installed",
        body: [
          "Light oils or sprays can soothe itch without drowning parts — your braider or dermatology resources can help if flaking persists.",
          "Cleansing with diluted shampoo or a targeted scalp routine keeps installs fresher longer without roughing up flyaways.",
        ],
      },
      {
        heading: "Take-down and what’s next",
        body: [
          "Schedule enough time to remove braids without ripping. Finger detangle, clip hair in sections, and deep condition before jumping into the next install.",
          "If you see thinning edges, extend the break between styles and see a professional you trust — early care beats hiding damage.",
        ],
      },
    ],
    closing:
      "From knotless goddess rows to quick cornrows for the gym, your braids are part of your story. Share tips and braider love in the community when you are ready.",
  },
];

export function getCrownBlogPost(slug: string | undefined): CrownBlogPost | undefined {
  if (!slug) return undefined;
  return CROWN_BLOG_POSTS.find((p) => p.slug === slug);
}

export function getCrownGuide(slug: string | undefined): CrownGuide | undefined {
  if (!slug) return undefined;
  return CROWN_GUIDES.find((g) => g.slug === slug);
}
