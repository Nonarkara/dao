/* =============================================================
   EXTENDED LAYERS — added per chapter
   - direct:     a literal English translation (faithfully strange)
   - direct_th:  same in Thai
   - reading:    "What this might mean — X because Y, research Z"
   - reading_th: same in Thai
   - code:       TypeScript-as-philosophical-commentary
   - image:      a key into the IMG_MAP for contemporary photos (optional)
   - sources:    1-3 citations supporting the reading (optional)
   Chapters not in this object simply render with the v1 fields.
   ============================================================ */
window.EXTENDED = {
  1: {
    direct: "The way that can be way-ed is not the constant way.\nThe name that can be named is not the constant name.\nNo-name: the start of heaven and earth.\nHaving-name: the mother of the ten thousand things.\nSo: always without desire, observe its subtlety;\nalways with desire, observe its boundary.\nThese two come out together, named differently;\ntogether we call them dark.\nDark and dark again — the gate of all subtleties.",
    direct_th: "ทางที่ทางได้ ไม่ใช่ทางคงที่\nชื่อที่ตั้งชื่อได้ ไม่ใช่ชื่อคงที่\nไร้ชื่อ คือจุดเริ่มของฟ้าและดิน\nมีชื่อ คือมารดาของหมื่นสิ่ง\nไม่อยาก เห็นความละเอียดของมัน\nอยาก เห็นเพียงขอบของมัน\nสองสิ่งนี้ออกมาด้วยกัน ชื่อต่างกัน\nรวมกัน เรียกว่ามืด\nมืดและมืดอีก คือประตูของสรรพสิ่ง",
    reading: "What if the chapter is simply describing how categories work?\nThe moment you assign a word to a thing, the thing becomes smaller than it was. Cognitive scientist Lera Boroditsky has demonstrated, across thirty-plus studies, that a language's available words measurably narrow what its speakers see — Russian-speakers track shades of blue more finely than English-speakers; Yucatec-Maya speakers track 'made-of' rather than 'looks-like' when sorting objects. The word is not neutral. The word is a frame. Lao Tzu noticed this twenty-three centuries before psycholinguistics had a name.\nThe instruction that follows — 'without desire, observe; with desire, observe' — is a clinical recommendation. Drop the frame, and you see pattern. Hold the frame, and you see only what fits. Both views are real. Both are partial. The chapter's last word is 'gate' — meaning the frames themselves are the entry point, not the truth.",
    reading_th: "ถ้าบทแรกแค่กำลังอธิบายว่าหมวดหมู่ทำงานอย่างไร\nเวลาคุณตั้งชื่อสิ่งหนึ่ง สิ่งนั้นจะเล็กลงทันที นักวิทยาศาสตร์การรู้คิด Lera Boroditsky ทำการศึกษากว่าสามสิบชิ้น ที่แสดงว่าคำในภาษาหนึ่งทำให้ผู้พูดเห็นโลกแคบลงในแบบที่วัดได้ — คนรัสเซียจำเฉดสีฟ้าได้ละเอียดกว่าคนพูดอังกฤษ คนพูดยูคาเทค-มายาจัดของตามวัสดุ ไม่ใช่รูปทรง คำไม่เป็นกลาง คำคือกรอบ เหล่าจื๊อสังเกตเรื่องนี้สองพันสามร้อยปีก่อนจิตวิทยาภาษาจะมีชื่อ\nคำสั่งที่ตามมา — 'ไม่อยาก ก็เห็น อยาก ก็เห็น' — คือคำแนะนำทางคลินิก ทิ้งกรอบ คุณเห็นแบบแผน ถือกรอบ คุณเห็นแค่สิ่งที่เข้ากรอบ มองทั้งสองอย่างเป็นจริง ทั้งสองไม่ครบ คำสุดท้ายของบทคือ 'ประตู' — แปลว่ากรอบเป็นทางเข้า ไม่ใช่ความจริง",
    code: "type Way = unknown;          // by construction\ntype Name = string;          // a finite token\n\nconst describe = <T>(w: T): Name => JSON.stringify(w);\n\n// Theorem: parse(describe(w)) ⊑ w\n//   information lost in stringification\n//   cannot be recovered from the string alone.\n//\n// Corollary: every chapter is another attempt at describe(w).\n// The book is the residue.",
    sources: [
      "Lera Boroditsky, 'How Language Shapes Thought,' Scientific American (2011).",
      "George Lakoff & Mark Johnson, Metaphors We Live By (1980).",
      "Wittgenstein, Tractatus 5.6: 'The limits of my language are the limits of my world.'"
    ],
    image: "blank-page"
  },

  2: {
    direct: "Under heaven, all know beauty as beauty —\nthen ugly already is.\nAll know good as good — then not-good already is.\nSo: have and not-have produce each other.\nDifficult and easy complete each other.\nLong and short shape each other.\nHigh and low rest on each other.\nVoice and tone harmonise.\nFront and back follow.\nSo the sage acts without acting,\nteaches without speaking.\nThe ten thousand things arise and he does not refuse them.\nProduces and does not own.\nWorks and does not lean.\nFinishes and does not stay.\nBecause he does not stay, he does not leave.",
    direct_th: "ทั่วฟ้า ทุกคนรู้จักความงามเป็นความงาม — ความน่าเกลียดก็มีแล้ว\nทุกคนรู้จักความดีเป็นความดี — ความไม่ดีก็มีแล้ว\nมีและไม่มีสร้างกัน\nยากและง่ายเสริมกัน\nยาวและสั้นกำหนดกัน\nสูงและต่ำพิงกัน\nเสียงและน้ำเสียงประสานกัน\nหน้าและหลังตามกัน\nคนฉลาดทำโดยไม่ทำ\nสอนโดยไม่พูด\nหมื่นสิ่งเกิดขึ้น เขาไม่ปฏิเสธ\nสร้างและไม่ครอง\nทำงานและไม่พิง\nเสร็จและไม่อยู่\nเพราะไม่อยู่ จึงไม่ไป",
    reading: "What if the chapter is reporting a basic fact about contrast?\nThe visual cortex doesn't see 'blue' — it sees blue against not-blue. Lateral inhibition (Hartline, 1956 onwards; the foundation of computational vision) is the mechanism: every neuron that fires for X actively suppresses its neighbours from also firing for X. Categories cannot exist alone. The moment you have 'beautiful' you have its opposite, on the same neural substrate, free.\nMonopolar moralising — calling something good and meaning only good — is a cognitive failure mode. The wise person's response is not to stop seeing categories (you can't) but to stop pretending they exist without their opposite. Hence the long list of pairs. Have/have-not. Long/short. High/low. They are made of the same wiring. The instruction is to hold both ends of the wire.",
    reading_th: "ถ้าบทนี้แค่รายงานข้อเท็จจริงพื้นฐานเรื่องความต่าง\nสมองส่วนการมองไม่ได้เห็น 'น้ำเงิน' — มันเห็นน้ำเงินตัดกับไม่ใช่น้ำเงิน Lateral inhibition (Hartline 1956 และต่อมา รากฐานของวิทยาการคอมพิวเตอร์ทางการมอง) คือกลไก เซลล์ประสาททุกเซลล์ที่ยิงเพื่อ X ก็กดเซลล์ข้างเคียงไม่ให้ยิงเพื่อ X พร้อมกัน หมวดหมู่อยู่ลำพังไม่ได้ พอคุณมี 'งาม' คุณก็มี 'ไม่งาม' บนวงจรเดียวกัน ฟรี\nการสอนศีลธรรมขั้วเดียว — เรียกสิ่งหนึ่งว่าดี และตั้งใจแปลว่าดีอย่างเดียว — คือโหมดล้มเหลวทางการรู้คิด คนฉลาดไม่ใช่หยุดเห็นหมวดหมู่ (หยุดไม่ได้) แต่หยุดทำเป็นว่าหมวดหมู่อยู่ลำพังได้ จึงเป็นรายการคู่ ๆ ยาว มี/ไม่มี ยาว/สั้น สูง/ต่ำ ทำจากวงจรเดียวกัน คำสั่งคือถือสายไฟทั้งสองด้าน",
    code: "type Polar<T> = { value: T; opposite: T };\n\n// You cannot construct a Polar with only one field.\nconst beauty: Polar<'beautiful'> = {\n  value: 'beautiful',\n  opposite: 'ugly',           // free, by definition\n};\n\n// Pretending the second field doesn't exist\n// is the move the chapter is warning against.",
    sources: [
      "H. K. Hartline, 'Inhibition in the Eye of Limulus' (1956); foundational lateral-inhibition study.",
      "Daniel Kahneman, Thinking, Fast and Slow (2011), on framing effects.",
      "Niels Bohr's complementarity principle — opposites as constitutive, not exclusive."
    ]
  },

  3: {
    direct: "Do not exalt the worthy — and the people will not contend.\nDo not value rare goods — and the people will not steal.\nDo not display the desirable — and people's hearts will not be confused.\nSo the sage's rule:\nempty their hearts; fill their bellies.\nWeaken their wills; strengthen their bones.\nKeep them ever without knowledge, without desire;\nso the clever ones do not dare to act.\nDo not-doing — and nothing is left ungoverned.",
    reading: "What if the chapter is a critique of advertising, three thousand years early?\nManipulation works by manufacturing desire that didn't previously exist. The behavioural research is now well-established — Walter Mischel's marshmallow studies, replicated and refined; recent fMRI work by Brian Knutson on the nucleus accumbens lighting up at the cue, not the reward; Robert Cialdini on social proof. The moment a society makes scarcity visible, it manufactures the theft response. The chapter is not asking the people to be ignorant. It is asking the state to stop selling them the desire.\nThis is not authoritarian — it is the opposite. The authoritarian state amplifies cravings (then punishes them). The Daoist state removes the amplifier. The market under Daoism would be a quiet market.",
    code: "type Society = {\n  signals: Set<'wealth' | 'rank' | 'rarity'>;\n  crime:   number;\n};\n\n// Empirical observation:\n//   crime ≈ f(amplification of signals)\n//   not f(human nature)\nconst lessSignal = (s: Society): Society => ({\n  signals: new Set(),\n  crime: s.crime / 3,\n});",
    sources: [
      "Robert Cialdini, Influence (1984; revised 2021), on social proof and scarcity heuristics.",
      "Brian Knutson et al., 'Neural predictors of purchases,' Neuron 53 (2007): nucleus accumbens activation precedes spending."
    ]
  },

  4: {
    direct: "The way is empty — yet using it, perhaps, never fills.\nDeep, like the ancestor of the ten thousand things.\nIt blunts its sharpness, unties its knots,\nharmonises its glare, settles into its dust.\nClear — as if it might be there.\nI do not know whose son it is.\nIt seems before the deity.",
    reading: "What if 'empty' here is the same kind of empty as 'unstructured'?\nIn information theory (Shannon, 1948 and after), capacity is precisely the absence of pre-existing pattern. A signal can carry meaning only because the channel is empty before the signal. Filled channels carry nothing new. The chapter's image of the inexhaustible vessel is the image of an unfilled channel — usable forever exactly because it doesn't presume.\nMost rooms in your life are full. Most calendars. Most relationships. The Daoist question is which of them you are still using because they are empty enough to receive what's coming, and which are merely arrangements you have stopped noticing.",
    code: "interface Channel<T> {\n  capacity: number;            // entropy left to be used\n  contents: ReadonlyArray<T>;  // already-resolved bits\n}\n\nconst availability = <T>(c: Channel<T>) =>\n  c.capacity - c.contents.length;\n\n// The full channel and the broken channel\n// behave identically: nothing more enters.",
    sources: [
      "Claude Shannon, 'A Mathematical Theory of Communication' (1948).",
      "Christopher Alexander, Notes on the Synthesis of Form (1964), on under-specified design as resilience."
    ]
  },

  5: {
    direct: "Heaven and earth are not benevolent —\nthey treat the ten thousand things as straw dogs.\nThe sage is not benevolent —\nhe treats the hundred families as straw dogs.\nBetween heaven and earth — like a bellows.\nEmpty, yet not exhausted.\nThe more it moves, the more comes out.\nMany words exhaust quickly.\nNot like keeping the centre.",
    reading: "What if the chapter is doing emotional regulation with extreme honesty?\nThe research is clear — Pennebaker's expressive-writing studies, Kross on self-distancing, the broader insight that recasting a personal trouble as 'just what universes do' reduces both cortisol and rumination. The book is not telling you the universe is cruel. It is telling you the universe is not personal, which is the same insight expressed without flinching.\nStraw dogs were ceremonial offerings — used once, with full attention, then discarded without sentiment. The chapter is recommending the same posture toward your seasons, your projects, your relationships at the end of their useful lives. Care while the rite is on. Burn the dog when the rite is done.",
    code: "type Stance = 'personal' | 'impersonal';\n\nconst distress = (event: Event, s: Stance): number =>\n  s === 'personal' ? event.magnitude * 4\n                   : event.magnitude * 1;\n\n// Same event. Two cortisol curves.\n// The chapter is asking you to choose the second one,\n// not because the first is wrong — because it is exhausting.",
    sources: [
      "Ethan Kross, Chatter (2021), on self-distancing as cognitive intervention.",
      "James Pennebaker, Opening Up (1997), on expressive writing for stress reduction."
    ]
  },

  6: {
    direct: "The valley spirit does not die.\nWe call her the dark female.\nThe gate of the dark female —\nwe call it the root of heaven and earth.\nFaint, faint, as if there.\nUse it without strain.",
    reading: "What if 'valley' and 'female' are doing the same work — naming the receptive structure?\nIn anatomy, in linguistics, in computer science, in landscape, the receptive form is the one that survives the longest. Caves outlast mountains. Containers outlast contents. Listeners outlast talkers. Carol Gilligan's research on relational ethics, Adrienne Mayor's reframing of myth, Ursula Le Guin's Carrier Bag Theory of Fiction (1986) — all argue that the receptive shape is the original shape, and the sword-shape was added later as a variant.\nThe valley spirit doesn't die because dying happens to forms that are pushed against. Forms that yield don't accumulate the damage that breaks them.",
    code: "// The two basic forms of structure:\nclass Sword { age = 0; survive(blow: Blow) { this.age++; if (this.age > 100) throw 'shattered'; } }\nclass Valley { survive(blow: Blow) { return this; } }\n\n// At t=infinity, only Valley is in scope.",
    sources: [
      "Ursula K. Le Guin, 'The Carrier Bag Theory of Fiction' (1986).",
      "Carol Gilligan, In a Different Voice (1982)."
    ]
  },

  7: {
    direct: "Heaven is long, earth is enduring.\nWhy can heaven and earth be long and enduring?\nBecause they do not live for themselves —\ntherefore they can live long.\nSo the sage puts himself behind, and is in front.\nPuts himself outside, and stays present.\nIs it not because he has no self?\nThus he can complete his self.",
    reading: "What if the chapter is the original description of psychological flow?\nMihaly Csikszentmihalyi's flow studies (Flow: The Psychology of Optimal Experience, 1990) found that the deepest sense of selfhood arrives, paradoxically, when the self is not the focus. Surgeons in the middle of a six-hour operation. Musicians mid-improvisation. Even rock climbers in technical sequences. They report afterwards that they were 'most themselves' — and during, they were not aware of themselves at all.\nThe chapter is reporting the same finding. The self that fades during good work is the self that survives. The self that constantly checks whether it is being seen is the self that gets used up.",
    code: "type Self = { active: boolean; intact: boolean };\n\nconst do_work = (s: Self): Self =>\n  s.active                                  // self in the foreground\n    ? { active: true,  intact: false }      // tired by sundown\n    : { active: false, intact: true  };     // present at sundown",
    sources: [
      "Mihaly Csikszentmihalyi, Flow: The Psychology of Optimal Experience (1990).",
      "Jonathan Haidt on self-effacement as a marker of moral expertise."
    ]
  },

  8: {
    direct: "The highest good is like water.\nWater benefits the ten thousand things and does not contend.\nIt dwells in the places people detest —\nso it is close to the way.\nDwell, good in place.\nHeart, good in depth.\nGiving, good in benevolence.\nSpeech, good in sincerity.\nGovernance, good in order.\nWork, good in capability.\nMotion, good in timing.\nBecause it does not contend, it has no fault.",
    direct_th: "ความดีสูงสุดเหมือนน้ำ\nน้ำเป็นประโยชน์กับหมื่นสิ่งและไม่แข่ง\nอยู่ในที่ที่คนรังเกียจ\nจึงใกล้ทาง\nที่อยู่ ดีตรงสถานที่\nใจ ดีตรงความลึก\nการให้ ดีตรงความเมตตา\nคำพูด ดีตรงความจริง\nการปกครอง ดีตรงระเบียบ\nการทำงาน ดีตรงความสามารถ\nการเคลื่อนไหว ดีตรงจังหวะ\nเพราะไม่แข่ง จึงไม่มีความผิด",
    reading: "What if water is the chapter's argument because of physics, not metaphor?\nWater wins by phase. It seeps where stone cannot. Slow dripping breaks granite — Cleopatra's Needle, the limestone caves at Lechuguilla — over geological time. The principle in fluid dynamics is shear minimisation: water does not push back, so it does not store the impact that breaks rocks. The book is not saying 'be passive.' It is saying 'do not store the impact.' Stone stores it. Stone shatters at the storage point. Water moves around the storage point.\nIn human terms: the practitioner who does not store the criticism, the loss, the slight, accumulates no shatter point. They are not invulnerable. They are unaccumulated. There is, in them, no place for the grievance to live long enough to harden into a self.",
    reading_th: "ถ้าน้ำเป็นข้อโต้แย้งเพราะฟิสิกส์ ไม่ใช่อุปลักษณ์\nน้ำชนะด้วยสถานะ มันซึมที่หินซึมไม่ได้ น้ำหยดช้า ๆ ทำลายหินแกรนิตได้ — ปิรามิดเฮิร์สต์ ถ้ำเลชูกียา — ในเวลาทางธรณีวิทยา หลักการในกลศาสตร์ของไหลคือ shear minimisation น้ำไม่ดันกลับ จึงไม่เก็บแรงกระแทกที่จะทำให้หินแตก หนังสือไม่ได้พูดว่า 'เฉื่อย' มันพูดว่า 'อย่าเก็บแรงกระแทก' หินเก็บไว้ หินแตกตรงที่เก็บ น้ำเคลื่อนรอบที่เก็บ\nในแง่มนุษย์ ผู้ฝึกที่ไม่เก็บคำวิจารณ์ การสูญเสีย ความขุ่น ก็ไม่สะสมจุดแตก ไม่ใช่ว่าเขาทำลายไม่ได้ เขาแค่ไม่สะสม ในตัวเขา ไม่มีที่ให้ความขัดเคืองอยู่นานพอจนกลายเป็นตัวตน",
    code: "type Stance = 'rigid' | 'fluid';\n\nfunction take_blow<T>(s: Stance, force: number) {\n  return s === 'rigid'\n    ? { stored: force, fracture_at: 100 - stored }\n    : { stored: 0,     fracture_at: Infinity };\n}\n\n// At sufficient time, only the fluid object is still in memory.",
    sources: [
      "Christopher Alexander, A Pattern Language (1977), on the durability of soft systems.",
      "Susan Cain, Quiet (2012), on the strategic value of low-aggression posture."
    ],
    image: "river-stones"
  },

  11: {
    direct: "Thirty spokes share one hub —\nin its emptiness lies the cart's use.\nClay is shaped into a vessel —\nin its emptiness lies the vessel's use.\nDoors and windows are cut to make a room —\nin its emptiness lies the room's use.\nSo: 'having' makes the convenience;\n'not-having' makes the use.",
    reading: "What if the chapter is the founding text of negative-space design?\nKenya Hara, art director of MUJI for two decades, has written explicitly that this chapter is the design brief MUJI has been executing for thirty years. Christopher Alexander's pattern language, Donald Schön's reflective practitioner, Yale's environmental psychology research on ceiling-height effects on cognition (Meyers-Levy, 2007) — all converge on the same observation. The shape of the void is the product. The walls are the bill.\nIn architecture you pay for the wall and live in the room. In code you pay for the function signature and use the return value. In friendship you pay for the manners and live in the silence the manners protect. The chapter is generalising: in every made thing, the void is the deliverable.",
    reading_th: "ถ้าบทนี้คือต้นกำเนิดของการออกแบบช่องว่าง\nKenya Hara ผู้กำกับศิลป์ของ MUJI กว่ายี่สิบปี เขียนชัดว่าบทนี้คือใบสั่งงานที่ MUJI ทำตามมาสามสิบปี Christopher Alexander, Donald Schön, การวิจัยจิตวิทยาสภาพแวดล้อมของ Yale เรื่องเพดานสูงกับการรู้คิด (Meyers-Levy 2007) — ทั้งหมดมาสู่ข้อสังเกตเดียวกัน รูปร่างของช่องว่างคือผลิตภัณฑ์ กำแพงคือใบเสร็จ\nในสถาปัตยกรรมคุณจ่ายให้กำแพง และอยู่ในห้อง ในโค้ดคุณจ่ายให้ลายเซ็นฟังก์ชัน และใช้ค่าที่คืนมา ในมิตรภาพคุณจ่ายให้มารยาท และอยู่ในความเงียบที่มารยาทรักษาไว้ บทนี้สรุปทั่วไป — ในของทุกอย่างที่สร้างขึ้น ช่องว่างคือสิ่งที่ส่งมอบ",
    code: "interface Wheel  { spokes: 30; hub: void;     }\ninterface Pot    { walls: Material; cavity: void; }\ninterface Room   { walls: Wall[];  void: 'usable' }\n\n// In every interface, the void is the deliverable.\n// `void` is not absence; it is the type of usefulness.\nfunction inhabit<T extends { void: unknown }>(t: T): T['void'] {\n  return t.void;\n}",
    sources: [
      "Kenya Hara, Designing Design (2007), MUJI's design philosophy.",
      "Joan Meyers-Levy & Rui Zhu, 'The Influence of Ceiling Height,' Journal of Consumer Research (2007).",
      "Donald Schön, The Reflective Practitioner (1983)."
    ],
    image: "muji-room"
  },

  13: {
    direct: "Favour and disgrace — startle as if frightened.\nValue great trouble as if it were yourself.\nWhat does 'favour and disgrace startle as if frightened' mean?\nFavour is below — gain it, startle; lose it, startle.\nThis is what is meant.\nWhat does 'value great trouble as if yourself' mean?\nThe reason I have great trouble is that I have a self.\nIf I had no self, what trouble could I have?\nSo: he who values himself as the world can be entrusted with it;\nhe who loves himself as the world can be given it.",
    reading: "What if the chapter is anticipating modern hedonic-adaptation research?\nDaniel Gilbert at Harvard has shown that lottery winners and paraplegics return to similar baseline happiness within 18 months. Brickman & Campbell's hedonic treadmill (1971) is the foundational paper. The mechanism: we re-baseline. The new state becomes neutral; only the change registers. Praise becomes the new floor that future praise must beat. Disgrace becomes the new ceiling. Both are the same neural circuit running in opposite directions.\nThe chapter's deeper point is harder. The 'great trouble' is the trouble of having a self that can win or lose. The Buddhist idea of anatta (non-self), the Stoic idea of the unjudging spectator, the contemporary cognitive-behavioural technique of metacognition — all are circling the same recommendation. Don't disown the self. Loosen its grip on your reactions.",
    code: "// The hedonic treadmill\ntype Mood = number;\n\nfunction on_event(e: 'praise' | 'disgrace', mood: Mood): Mood {\n  return mood + (e === 'praise' ? +1 : -1);\n  //                                   ↑ but wait\n  // 18 months later, baseline resets:\n  //   newBaseline = mood\n  //   subjective_change = 0\n}",
    sources: [
      "Brickman & Campbell, 'Hedonic Relativism and Planning the Good Society' (1971).",
      "Daniel Gilbert, Stumbling on Happiness (2006).",
      "Marcus Aurelius, Meditations 8.49: 'Take away the complaint, take away the harm.'"
    ]
  },

  16: {
    direct: "Reach the utmost emptiness; hold the deepest stillness.\nThe ten thousand things rise side by side — I watch their return.\nThings flourish, flourish, each one returns to its root.\nReturning to the root is called stillness.\nStillness is called returning to one's destiny.\nReturning to destiny is called the constant.\nKnowing the constant is called clarity.\nNot knowing the constant — recklessly making — disaster.\nKnowing the constant, you can hold things;\nholding, you are fair;\nfair, you are king;\nking, you are heaven;\nheaven, you are the way;\nway, you are lasting;\ntill the body ends — no danger.",
    reading: "What if the chapter is describing the default-mode network at rest?\nMarcus Raichle's discovery (2001) of the brain's default network — the regions that activate when nothing is being asked of them — reframed cognitive science. The network does autobiographical memory, self-referential thinking, and the construction of identity. It is most active when the body is still and the eyes are unfocused. It runs maintenance.\nThe chapter is recommending exactly this state — empty, still, watching things rise and fall — for the same reason: it is when the system reorganises. The 'returning to the root' is not mystical. It is the brain's housekeeping cycle. The wise person does not skip it.",
    code: "type State = 'task' | 'rest';\n\n// Default Mode Network on the second branch:\nfunction process(s: State) {\n  return s === 'task'\n    ? { mode: 'execute' }\n    : { mode: 'consolidate', cleanup: true, identity: 'rebuilt' };\n}",
    sources: [
      "Marcus Raichle et al., 'A default mode of brain function,' PNAS 98 (2001).",
      "Mary Helen Immordino-Yang, Rest Is Not Idleness (2012)."
    ]
  },

  20: {
    direct: "Cut off learning — no worries.\nYes and oh — how much apart?\nGood and ugly — how far away?\nWhat people fear, cannot but be feared.\nWild and wide, never ending!\nThe crowd is busy, busy — like at a great sacrifice, like climbing a tower in spring.\nI alone am still, with no sign yet — like an infant who has not yet smiled.\nWeary, weary, like having no place to return.\nThe crowd has more than enough; I alone seem to have lost.\nMy heart — a fool's heart, dim, dim!\nThe vulgar are bright, bright; I alone am dull.\nThe vulgar are sharp, sharp; I alone am dim.\nCalm, like the sea; drifting, as if no stop.\nThe crowd all has uses; I alone am stubborn and rough.\nI alone differ from people, yet value being fed by the mother.",
    reading: "What if this is the most autobiographical chapter — and a precise description of trait introversion?\nSusan Cain, in Quiet (2012), pulls together the research: introverts have lower thresholds for over-stimulation in the reticular activating system; their dopamine response to social novelty is attenuated; they recover from social activity by being alone, the way an extrovert recovers by being with people. The chapter's tone — left out at the banquet, drifting at the spring tower, unable to muster the laugh — is not depression. It is the lived texture of an introvert at a party. Lao Tzu, by every reading, was one.\nThe last line is the answer: 'I value being fed by the mother.' The introvert has a different food source — quiet, unstructured time, internal life. The chapter is not asking the world to change. It is asking the introvert to stop apologising for needing something different.",
    code: "interface Person { dopamine_baseline: number; }\n\nconst introvert: Person = { dopamine_baseline: 'high' as any };\nconst extrovert: Person = { dopamine_baseline: 'low'  as any };\n\nfunction restore(p: Person, ev: 'party' | 'solitude') {\n  if (p.dopamine_baseline === 'high' && ev === 'party')    return 'depleted';\n  if (p.dopamine_baseline === 'high' && ev === 'solitude') return 'restored';\n  if (p.dopamine_baseline === 'low'  && ev === 'party')    return 'restored';\n  if (p.dopamine_baseline === 'low'  && ev === 'solitude') return 'depleted';\n}",
    sources: [
      "Susan Cain, Quiet: The Power of Introverts in a World That Can't Stop Talking (2012).",
      "Hans Eysenck's research on cortical arousal and introversion (1967).",
      "Carl Jung, Psychological Types (1921), the original introvert/extrovert distinction."
    ]
  },

  22: {
    direct: "Bend, then whole.\nCrooked, then straight.\nHollow, then full.\nWorn, then new.\nLittle, then gain.\nMuch, then confused.\nSo the sage holds the One, and is the world's pattern.\nDoes not see himself — therefore clear.\nDoes not affirm himself — therefore distinguished.\nDoes not boast — therefore has merit.\nDoes not pride himself — therefore lasts.\nBecause he does not contend, none in the world can contend with him.\nThe ancient saying — 'bend, then whole' — is not empty.\nTruly, complete, and return to it.",
    reading: "What if the chapter is anticipating Nassim Taleb's antifragility thesis (2012)?\nTaleb distinguishes three responses to stressors: fragile (worse), robust (same), antifragile (better). The bamboo is antifragile — the storm strengthens it; root systems thicken; lignin deposits in response to wind. The oak is robust until it isn't, then fragile.\nThe chapter's list of paradoxes — bend/whole, hollow/full, worn/new — is a list of antifragile transformations. Each presupposes that the deformation is the input that produces the recovered form. The wise person is therefore not avoiding stress. They are using it as the build material.\nThis is, by the way, the same finding in muscle science (Selye's general adaptation syndrome, 1936), in immunology (vaccine response), and in resilient infrastructure (deliberately under-engineered components that fail-safe).",
    code: "type Response = 'fragile' | 'robust' | 'antifragile';\n\nfunction stress<T>(t: T, kind: Response): T {\n  if (kind === 'fragile')     return null as T;       // shatters\n  if (kind === 'robust')      return t;               // unchanged\n  if (kind === 'antifragile') return strengthen(t);   // gains\n}\n\nconst bamboo: Response = 'antifragile';\nconst oak:    Response = 'robust';      // until t = T_oak",
    sources: [
      "Nassim Nicholas Taleb, Antifragile (2012).",
      "Hans Selye, 'A Syndrome Produced by Diverse Nocuous Agents,' Nature 138 (1936)."
    ]
  },

  25: {
    direct: "There is a thing, formed in chaos, born before heaven and earth.\nSilent, void! Standing alone and unchanging,\nmoving in cycles and never tiring.\nIt may be the mother of the world.\nI do not know its name —\ncalling it 'the way' as a courtesy;\nforced to give it a name, I call it 'great.'\nGreat means leaving;\nleaving means far;\nfar means returning.\nSo: the way is great. Heaven is great. Earth is great. The king is also great.\nWithin the realm there are four greats —\nthe king occupies one of them.\nMan models himself on earth.\nEarth models itself on heaven.\nHeaven models itself on the way.\nThe way models itself on what is so of itself.",
    reading: "What if the chapter's last line is the chapter?\n'The way models itself on what is so of itself.' (道法自然.) The way doesn't follow a higher law. It follows the inherent pattern of things. There is no transcendent legislator.\nThis is functionally identical to the move physics made in the early modern period — replacing 'God commands the planets to orbit' with 'gravity emerges from mass-curvature.' Lawfulness without an external law-giver. Spinoza arrived at the same idea (Deus sive Natura) and was excommunicated for it. The Daoist tradition arrived 1900 years earlier and built a culture around it.\nThe practical implication: when you ask 'what should I do?' the answer is rarely upstream of you. It is downstream, in what is already happening. Read the situation. The situation is the law.",
    code: "// No transcendent legislator. Laws emerge from the substrate.\ntype LawSource = 'external' | 'intrinsic';\n\nconst pre_modern: LawSource = 'external';   // commanded\nconst the_way:    LawSource = 'intrinsic';  // emergent\n\nfunction act_well(situation: Situation): Action {\n  // Look at situation. Don't consult the rulebook.\n  return read(situation);\n}",
    sources: [
      "Spinoza, Ethics (1677), Deus sive Natura.",
      "Stuart Kauffman, Reinventing the Sacred (2008), on emergent law in complex systems."
    ]
  },

  33: {
    direct: "Knowing others — wisdom.\nKnowing oneself — clarity.\nOvercoming others — strength.\nOvercoming oneself — power.\nKnowing what is enough — wealth.\nForcing oneself onward — willpower.\nNot losing one's place — endurance.\nDying without perishing — longevity.",
    reading: "What if 'knowing yourself is clarity' is not a moral claim but a measurement claim?\nMetacognition — knowing what you know and don't know — is the most reliably trainable skill in cognitive psychology. Dunning & Kruger (1999) showed the bottom quartile of any skill systematically over-rate themselves; the top quartile slightly under-rate. The fix is not more skill. The fix is calibration — exactly the chapter's 'clarity.'\nThe chapter's eight lines are a calibration ladder. Each pair contrasts an external metric (wisdom, strength, willpower, endurance) with an internal one (clarity, power, enough, longevity). The internal metric is harder. The internal metric is the actual game.",
    code: "// Dunning-Kruger calibration\ntype Skill = number;\ntype SelfEstimate = number;\n\nconst calibrated = (s: Skill, e: SelfEstimate) => Math.abs(s - e) < 5;\n\n// The top of any skill is the corner of the graph\n// where calibrated === true.",
    sources: [
      "David Dunning & Justin Kruger, 'Unskilled and Unaware,' JPSP 77 (1999).",
      "John Flavell, 'Metacognition and cognitive monitoring,' American Psychologist 34 (1979)."
    ]
  },

  38: {
    direct: "High virtue is not virtue — therefore it has virtue.\nLow virtue does not lose virtue — therefore has none.\nHigh virtue does not act, has nothing to act for.\nLow virtue acts, has things to act for.\nHigh benevolence acts, has nothing to act for.\nHigh righteousness acts, has things to act for.\nHigh ritual acts — and when none responds, rolls up sleeves and casts them out.\nThus: lose the way, and virtue follows;\nlose virtue, and benevolence follows;\nlose benevolence, and righteousness follows;\nlose righteousness, and ritual follows.\nNow ritual — the husk of loyalty and faith, and the head of disorder.\nForeknowledge — the flower of the way, and the start of folly.\nSo the great man dwells in thickness, not in thinness;\nin the fruit, not the flower.\nLeaves that, takes this.",
    reading: "What if the chapter is describing virtue signalling, two-and-a-half millennia early?\nGeoffrey Miller's research on costly signalling (The Mating Mind, 2000), Robin Hanson on hidden motives in everyday life (Elephant in the Brain, 2018), Jonathan Haidt on the moralising machinery of group cohesion — they converge. Once a virtue becomes visible, it becomes an asset, and the asset crowds out the underlying behaviour. The signal eats the substance.\nLao Tzu's ladder — way, virtue, benevolence, righteousness, ritual — is the order of decay. We are now somewhere on the ritual rung. We have brand guidelines. We have ESG reports. We have ethics committees. We have, in modern terms, very well-developed virtue signalling — and a corresponding decline of the underlying behaviour the signals were originally tracking.",
    code: "type Stage = 'way' | 'virtue' | 'benevolence' | 'righteousness' | 'ritual';\n// Each stage is the signal of the previous, after the previous decayed.\n\nfunction decay(s: Stage): Stage {\n  const next: Record<Stage, Stage> = {\n    way: 'virtue', virtue: 'benevolence',\n    benevolence: 'righteousness',\n    righteousness: 'ritual',\n    ritual: 'ritual',  // terminal\n  };\n  return next[s];\n}",
    sources: [
      "Robin Hanson & Kevin Simler, The Elephant in the Brain (2018).",
      "Jonathan Haidt, The Righteous Mind (2012)."
    ]
  },

  40: {
    direct: "Returning is the way's motion.\nWeakness is the way's use.\nThe ten thousand things in the world are born from being.\nBeing is born from non-being.",
    reading: "What if the chapter is the cleanest statement of the second law of thermodynamics applied to social systems?\nEverything ordered tends to disorder; what goes up tends to come down; the gradient is the only thing that does work. Ilya Prigogine's Nobel-winning research on dissipative structures (1977) showed that order arises in open systems precisely as a way of accelerating the return. Social hierarchies, careers, empires — they are dissipative structures. They exist to convert their energy gradient into heat. The way's motion is reversal because the second law's motion is reversal.\nWeakness is the way's use because weakness is the gradient. A perfectly strong system has nothing left to do. A weak system is loaded with potential. The chapter's preference for the weak is also the engineer's preference for the under-tensioned cable.",
    code: "// The second law, in two lines.\ndeclare const time: number;\ndeclare const order: number;\n\nconsole.assert(\n  d_dt(order) <= 0,           // entropy doesn't decrease\n  'and yet, structures still arise — at the cost of heat'\n);",
    sources: [
      "Ilya Prigogine, From Being to Becoming (1980), on dissipative structures.",
      "Schroedinger, What is Life? (1944), on negentropy in living systems."
    ]
  },

  42: {
    direct: "The way produces one. One produces two. Two produces three.\nThree produces the ten thousand things.\nThe ten thousand things carry yin on their backs and embrace yang in their arms;\nthe rushing breath harmonises them.\nWhat people hate are 'orphan,' 'widowed,' 'unworthy,' yet kings and dukes use these as titles.\nSo: things — sometimes diminish and gain, sometimes gain and diminish.\nWhat others teach, I also teach:\n'The strong and forceful do not get a natural death.'\nI take this as the teacher of teaching.",
    reading: "What if 'three produces the ten thousand things' is anticipating combinatorial explosion?\nIn information theory, three is the smallest number that produces unbounded structure. With one symbol, you have monotone. With two, you have either-or. With three, you have a syntax — order matters, recursion is possible, and the system becomes Turing-complete (the smallest universal Turing machine has three symbols). The chapter's three is the threshold of complexity.\nThe second half — kings using 'orphan' as a title, the strong dying badly — is the practical inversion. Once you have complexity (three+), the simple monotone strategies fail. The system rewards humility precisely because the system is too rich to be solved by force.",
    code: "// The combinatorial threshold\ntype OneSymbol  = 'a';                          // boring\ntype TwoSymbols = 'a' | 'b';                    // logic\ntype Three      = 'a' | 'b' | 'c';              // syntax\n// With Three you can encode any computation.\n// All ten thousand things follow.",
    sources: [
      "Stephen Wolfram, A New Kind of Science (2002), on minimal universal computation.",
      "Yuval Noah Harari, Sapiens (2011), on cognitive complexity thresholds."
    ]
  },

  44: {
    direct: "Name or self — which is more cherished?\nSelf or wealth — which is more?\nGain or loss — which is the disease?\nThus: deep love brings great expense.\nMuch hoarding brings heavy loss.\nKnowing what is enough — no disgrace.\nKnowing where to stop — no danger.\nThus one can be lasting.",
    reading: "What if the chapter is articulating opportunity cost, in 81 characters?\nBecker, Stigler, and the entire Chicago school price theory tradition formalised this in the twentieth century: every choice has a forgone alternative whose value is the real cost of the choice. The chapter is asking — exactly — what is the forgone alternative cost of your name, your hoard, your gain.\nThe contemporary research is brutal. Hedonic adaptation (we already saw it in chapter 13) erodes the marginal utility of more. Daniel Kahneman's later work showed life satisfaction plateauing around USD ~75K/year in rich economies. The chapter is reporting that the curve flattens, and that the disease is mistaking the flat part of the curve for the steep part.",
    code: "// Marginal utility\nfunction utility(stuff: number): number {\n  return Math.log(stuff + 1);\n}\n// The chapter: notice that d/dx → 0 as x grows.\n// The disease is acting as if d/dx were constant.",
    sources: [
      "Daniel Kahneman & Angus Deaton, 'High income improves evaluation of life but not emotional well-being,' PNAS (2010).",
      "Tibor Scitovsky, The Joyless Economy (1976)."
    ]
  },

  48: {
    direct: "In learning, daily increase. In the way, daily decrease.\nDecrease and again decrease, until reaching not-doing.\nNot-doing — and nothing is not done.\nWinning the world: always with no affairs.\nWhen there are affairs, you cannot win the world.",
    reading: "What if 'subtract' is the most testable claim in the book?\nLeidy Klotz's recent research (Subtract, 2021) and his Nature paper (2021) ran a series of experiments showing that humans, by default, add — even when subtraction is the better solution. Asked to make a Lego structure stable, almost everyone added blocks. Subtraction was offered, free, as an option. Subjects ignored it.\nThe bias has a deep evolutionary explanation: addition is visible (you can show what you did); subtraction is invisible (you can only show what's no longer there, which is usually nothing). The chapter is not saying subtract for asceticism. It is saying subtract because subtraction is the move humans systematically miss.",
    code: "// Klotz et al. — humans default-add\nfunction default_response<T>(state: T): T {\n  return add(state, 'something');     // observed in 88% of experiments\n}\n// The Daoist response:\nfunction wise_response<T>(state: T): T {\n  return remove(state, identify_excess(state));\n}",
    sources: [
      "Leidy Klotz et al., 'People systematically overlook subtractive changes,' Nature 592 (2021).",
      "Cal Newport, Slow Productivity (2024).",
      "Marie Kondo, The Life-Changing Magic of Tidying Up (2014)."
    ],
    image: "empty-desk"
  },

  56: {
    direct: "Those who know do not speak.\nThose who speak do not know.\nBlock its openings, close its gates,\nblunt its sharpness, untie its knots,\nharmonise its glare, settle into its dust.\nThis is called 'dark sameness.'\nSo: cannot get close, cannot get far;\ncannot benefit, cannot harm;\ncannot honour, cannot debase.\nThus: the world's most valued.",
    reading: "What if 'those who know don't speak' is a comment on the curse of knowledge?\nElizabeth Newton's tapping experiment at Stanford (1990): tappers, who hear the song in their head, predicted listeners would identify the tune 50% of the time. The actual rate was 2.5%. Newton showed the gap is universal — once you know something, you cannot un-know it, and you systematically over-estimate how much of it has transferred.\nThe chapter's 'those who know don't speak' is therefore not anti-intellectual. It is recognising that experts who keep talking are usually filling in the gap they cannot perceive. The wise person, knowing the gap, speaks less, demonstrates more, and accepts that most of what they know cannot be communicated in the words they have.",
    code: "// Curse of knowledge (Newton, 1990)\nfunction explain<T>(idea: T, audience: Audience): Comprehension {\n  const expert_estimate = 0.50;\n  const actual         = 0.025;\n  return actual;\n}\n\n// The wise speaker silently subtracts 0.475 before opening the mouth.",
    sources: [
      "Elizabeth Newton, doctoral dissertation, Stanford (1990); the tapper-listener study.",
      "Steven Pinker, The Sense of Style (2014), on the curse of knowledge in writing."
    ]
  },

  64: {
    direct: "What is at peace is easy to hold.\nWhat has not yet appeared is easy to plan for.\nWhat is brittle is easy to break.\nWhat is small is easy to scatter.\nAct on it before it exists.\nGovern it before it falls into disorder.\nA tree of full embrace begins from a slender shoot.\nA nine-storey terrace rises from a heap of earth.\nA thousand-mile journey begins beneath the foot.\nThose who act ruin it; those who grasp lose it.\nSo the sage does not act and so does not ruin;\ndoes not grasp and so does not lose.\nPeople in their affairs always fail near completion.\nIf you take care of the end as of the beginning, no affair fails.",
    reading: "What if the chapter is the book's thesis on intervention timing?\nDanny Kahneman has a phrase for this: 'pre-mortem.' Before launching, ask — assume this fails; what killed it? — and address the answer now, while the fix is small. Klein's research on naturalistic decision-making (Sources of Power, 1998) shows expert firefighters and surgeons run pre-mortems unconsciously, dozens per shift. Each is the sentence 'what is small now that will be big later?' applied with discipline.\nThe chapter's tree-from-a-shoot, terrace-from-earth, journey-from-the-foot — is not motivational poster material. It is a reminder that the small intervention exists, with low cost and high leverage, only at the start. By the time the problem is visible, the intervention is expensive and the leverage is gone. The wise person spends almost all their attention on small starts.",
    code: "type Phase = 'sprout' | 'sapling' | 'tree' | 'forest';\n\nfunction cost_to_alter(p: Phase): number {\n  return ({ sprout: 1, sapling: 10, tree: 100, forest: 10_000 }[p]);\n}\n\n// The chapter is a comment on this lookup table.\n// The wise person always acts at index 0.",
    sources: [
      "Gary Klein, 'Performing a Project Premortem,' HBR (2007).",
      "Daniel Kahneman, Thinking, Fast and Slow (2011), Ch. 24."
    ]
  },

  67: {
    direct: "All under heaven say my way is great, yet seems unworthy.\nIt is because it is great that it seems unworthy.\nIf it were worthy, it would have been petty long ago.\nI have three treasures, hold and keep them:\nfirst, mercy;\nsecond, frugality;\nthird, daring not to be ahead of the world.\nMerciful, so I can be brave.\nFrugal, so I can be generous.\nNot ahead, so I can complete instruments.\nNow: abandon mercy and chase boldness;\nabandon frugality and chase generosity;\nabandon being last and chase being first —\ndeath.\nMercy: in battle, victory; in defence, fortress.\nWhen heaven would save someone, it guards them with mercy.",
    reading: "What if 'mercy makes you brave' is anatomical?\nResearch on the orbitofrontal cortex (OFC) — particularly the work of Antonio Damasio, summarised in Descartes' Error (1994) — shows the OFC integrates emotional valence with decision-making. Patients with OFC damage make rapid, fearless, and disastrous decisions. They are not brave. They are uncalibrated. The healthy brain's bravery is gated through emotional resonance with the people it is being brave for. Take the resonance away (mercy), and you don't get more bravery — you get reckless action that fails its own goals.\nThe chapter's three treasures, in order, are calibration mechanisms. Mercy calibrates bravery. Frugality calibrates generosity (you can only give what you didn't waste). Not-being-ahead calibrates leadership (you can only finish what you didn't rush). Drop the calibration, and the function diverges.",
    code: "// Three calibrators\nfunction brave(mercy: boolean): Bravery {\n  return mercy ? 'effective' : 'reckless';\n}\nfunction generous(frugal: boolean): Generosity {\n  return frugal ? 'sustainable' : 'bankrupt by Tuesday';\n}\nfunction lead(humility: boolean): Leadership {\n  return humility ? 'finishes' : 'starts and abandons';\n}",
    sources: [
      "Antonio Damasio, Descartes' Error: Emotion, Reason, and the Human Brain (1994).",
      "Joshua Greene, Moral Tribes (2013), on emotion-rational integration."
    ]
  },

  76: {
    direct: "When man is born, he is soft and pliable.\nWhen he dies, he is hard and stiff.\nThe ten thousand grasses and trees, in living, are soft and tender;\nin dying, they wither and dry.\nThus: hard and stiff are the disciples of death.\nSoft and tender are the disciples of life.\nSo: an army strong cannot conquer.\nA tree strong is felled.\nThe strong and great occupy the lower position.\nThe soft and weak occupy the upper.",
    reading: "What if the chapter is, almost literally, geriatric medicine?\nHaemodynamic arterial stiffness (Mitchell et al., Hypertension 2010, and follow-up work) is now recognised as a sharper predictor of mortality than blood pressure itself. The arteries of a young person are compliant — they expand and recoil. The arteries of an old person are stiff. Stiffness is not a side effect of aging; stiffness IS aging. The same is true of joints, of fascia, of the prefrontal cortex's response curve.\nThe chapter is making the same observation about social systems. The 'army that cannot conquer' is the over-engineered one — every joint locked, every supply chain rigid, no give. The 'tree that gets felled' is the one that grew too thick to bend in the storm. The book is recommending suppleness across all scales, because suppleness is what keeps the system in the live category.",
    code: "// Arterial stiffness ≈ mortality predictor\ntype Tissue = { compliance: number };\n\nfunction is_alive(t: Tissue): boolean {\n  return t.compliance > 0.4;        // approximate cutoff in live tissue\n}\n\n// Same function works on:\n//   – arteries\n//   – joints\n//   – institutions\n//   – philosophical positions",
    sources: [
      "Gary Mitchell et al., 'Arterial Stiffness and Cardiovascular Events,' Circulation 121 (2010).",
      "Bessel van der Kolk, The Body Keeps the Score (2014), on somatic rigidity in trauma."
    ]
  },

  78: {
    direct: "Under heaven nothing is softer or weaker than water.\nYet for attacking the hard and strong, nothing surpasses it.\nNothing can replace it.\nWeak overcoming strong, soft overcoming hard —\nunder heaven none does not know this; none can practise it.\nSo the sage says:\n'He who bears the country's filth — call him master of the altars.\nHe who bears the country's misfortune — call him king of the world.'\nStraight words seem to reverse.",
    reading: "What if 'straight words seem to reverse' is the key to the whole book?\nResearch on cognitive flexibility (Shimamura, 2000; Diamond, 2013) shows that the capacity to hold contradictory positions simultaneously — and tolerate the tension — is the strongest predictor of executive function across the lifespan. It is also, Daniel Kahneman noted, the marker of expert judgement: experts hold both 'this is probably X' and 'X may be wrong' in working memory at the same time, and act accordingly.\nThe chapter, again, is reporting a fact about good thinking. The truest sentences in any field sound paradoxical because the field has been simplified for non-experts. 'The investment that loses money is the safest one' (insurance). 'The slowest decision is the fastest project' (architecture). 'The leader who absorbs the country's filth is its actual king' (politics). Straight words reverse because reality is a Möbius strip and language is a piece of paper.",
    code: "// Cognitive flexibility (Diamond, 2013)\ntype Position = boolean;\n\nfunction expert_belief(p: Position): { p: Position; not_p: Position } {\n  // Both held simultaneously, weighted by evidence.\n  return { p: true, not_p: true };\n}\n// Novice: { p: true } only.",
    sources: [
      "Adele Diamond, 'Executive Functions,' Annual Review of Psychology 64 (2013).",
      "F. Scott Fitzgerald: 'The test of a first-rate intelligence is the ability to hold two opposed ideas in the mind at the same time.'"
    ]
  },

  // ─── code-only entries for the remaining chapters ───
  9:  { code: "// Knowing when to stop\nfunction hold(cup: number): cup is { full: false } {\n  return cup < 1.0;       // overflow at full=true is loss, not abundance\n}" },
  10: { code: "// Hold the One — even with the body, even with breath\ntype Question = (s: Self) => boolean;\nconst questions: Question[] = [\n  s => s.body && s.spirit,    // can you hold them as one?\n  s => s.breath === 'soft',   // soft as a baby?\n  s => s.mirror === 'clean',  // free of every smear?\n];\n// Most days, fail at question 3. Walk anyway." },
  12: { code: "// Sensory inflation\ntype Senses = { colours: 5; notes: 5; flavours: 5 };\nconst feed = (s: Senses): 'belly' | 'eyes' =>\n  s.colours > 100 ? 'eyes (lost)' : 'belly';" },
  14: { code: "// Three faculties refuse it\nconst look   = (w: Way) => undefined;   // can't see\nconst listen = (w: Way) => undefined;   // can't hear\nconst grasp  = (w: Way) => undefined;   // can't grab\n\n// Yet a fourth thing notices.\n// (We have not named the fourth thing.)" },
  15: { code: "type OldMaster = {\n  walk: 'as if crossing winter river';\n  posture: 'as if a guest';\n  shape: 'as if uncarved block';\n};\n// Notice each property is a simile, never a definition." },
  17: { code: "type Leader =\n  | 'barely-known'    // best\n  | 'loved'\n  | 'feared'\n  | 'mocked';         // worst\n\n// Quality decreases as visibility increases." },
  18: { code: "// The decay sequence — once a virtue is named, it is in trouble\ntype Stage = 'way' | 'kindness' | 'justice' | 'piety' | 'loyalty';\n// Each name appears as the previous fails." },
  19: { code: "// Drop three things\nconst society = {\n  saint:    null,\n  cleverness: null,\n  profit:   null,\n};\n// 'See the plain. Hold the uncarved.'" },
  21: { code: "// Virtue follows the way\ntype Virtue<T extends Way> = T extends infer V ? V : never;\n// Definition tracks the substrate, never overrides it." },
  23: { code: "// Wind, rain, words — all bounded\nconst wind  = ({ duration }: Storm) => duration < '1 morning';\nconst words = (n: number) => n < 100 || 'exhausted';" },
  24: { code: "type Tiptoe = { stable: false };\nconst stand = (height: number): boolean =>\n  height === 0;     // anything else collapses" },
  26: { code: "// Heavy is the root of light\nconst heavy = { stable: true,  visible: false };\nconst light = { stable: false, visible: true  };\n// The light at the window kills the cart." },
  27: { code: "// Good work leaves no track\nfunction walk(path: Path): Trace {\n  return null;     // good walking\n}" },
  28: { code: "// Three triplets\ntype Knew = 'male'  | 'white' | 'glory';\ntype Held = 'female'| 'black' | 'shame';\n// Know the first. Live in the second." },
  29: { code: "function shape_world(force: number): 'spoiled' {\n  return 'spoiled';      // any value of force\n}\n// The world is a sacred vessel; you cannot grip it." },
  31: { code: "// Weapons as funeral instruments\ntype Victory = { conducted_as: 'funeral' };\n// If you find it beautiful, you have lost." },
  32: { code: "// Once names appear, know when to stop\nfunction name_things(things: Set<unknown>): typeof things {\n  if (things.size > Number.MAX_SAFE_INTEGER) return things;\n  // Knowing-when-to-stop is the only safety constraint.\n  return things;\n}" },
  34: { code: "// The Way is great because it does not try to be great\nconst way = { tries_to_be: undefined };\nfunction greatness(x: { tries_to_be?: 'great' }): boolean {\n  return x.tries_to_be === undefined;\n}" },
  35: { code: "// Tasteless and inexhaustible\ntype Food = { taste: number; uses_left: number };\nconst music: Food = { taste: 9, uses_left: 1 };\nconst the_way: Food = { taste: 0, uses_left: Infinity };" },
  36: { code: "// Faint light\nconst diminish = (x: number) => stretch(x);   // first stretch it\nconst weaken   = (x: number) => strengthen(x); // first strengthen\nconst take     = (x: number) => give(x);      // first give" },
  37: { code: "// Way does nothing, nothing left undone\nfunction govern(world: World): World {\n  return world;     // identity function — and yet, things change" },
  39: { code: "// The One — six manifestations\nconst sky    = clear(One);\nconst earth  = steady(One);\nconst spirit = alert(One);\nconst valley = full(One);\nconst things = alive(One);\nconst king   = standard(One);\n// Drop the One, all six fail simultaneously." },
  41: { code: "// Three students\ntype Reaction = 'work' | 'half-believe' | 'laugh';\nconst best:    Reaction = 'work';\nconst average: Reaction = 'half-believe';\nconst worst:   Reaction = 'laugh';\n// If `worst` doesn't laugh, the way isn't the way." },
  43: { code: "// The softest rides the hardest\nconst air = { density: 0.001 };\nconst rock = { density: 2700 };\n// Air enters every solid; rock enters nothing." },
  45: { code: "// Greatness looks wrong\nconst great = {\n  accomplishment: 'looks unfinished',\n  fullness:       'looks empty',\n  straightness:   'looks bent',\n};" },
  46: { code: "// War-horse arithmetic\nconst peace = (war_horses: number) => 'fertilize fields';\nconst war   = (war_horses: number) => 'bred in the suburbs';" },
  47: { code: "// Travel and knowing\nfunction know(world: World, distance_travelled: number): number {\n  return Math.max(0, 100 - distance_travelled);\n  // The further you go, the less you know.\n}" },
  49: { code: "// Borrow the people's heart\nclass Sage {\n  heart: Heart | null = null;     // not fixed\n  use(p: People) { this.heart = p.heart; }\n}" },
  50: { code: "// No place for death\nclass Survivor {\n  target: false;     // gives the wild beast nowhere to land\n}" },
  51: { code: "// Produces. Cares for. Doesn't own.\ntype Parent<T> = {\n  produce(): T;\n  care(t: T): T;\n  own?: never;       // explicitly absent\n  claim?: never;\n  rule?: never;\n};" },
  52: { code: "// Close the mouth. Shut the door.\nclass Day {\n  mouth: 'closed' = 'closed';\n  door:  'closed' = 'closed';\n  energy: 100 = 100;\n}" },
  53: { code: "// Court swept, fields wild — capture\ntype Country = { court: 'clean'; fields: 'weeds'; granary: 'empty' };\nconst diagnosis: Country = {\n  court: 'clean', fields: 'weeds', granary: 'empty'\n};\n// Type signature of a captured state." },
  54: { code: "// See body through body\ntype View<T> = (x: T) => T;\nconst body_through_body: View<Body> = b => b;\n// Don't read the country off your own life." },
  55: { code: "// Newborn — full virtue\nclass Newborn {\n  bones: 'soft' = 'soft';\n  grip:  'firm' = 'firm';\n  cry:   'all day, no hoarseness' = 'all day, no hoarseness';\n  // Wisdom = retain these properties as long as possible.\n}" },
  57: { code: "// Less government\nconst less = {\n  taboos: 0,           // → less poverty\n  weapons: 0,          // → less chaos\n  cleverness: 0,       // → less strange goods\n  laws: 0,             // → fewer thieves\n};" },
  58: { code: "// Misfortune leans on fortune\ntype Pair = { fortune: 'high'; misfortune_loaded: true };\n// Every win has a debt buried in it." },
  59: { code: "// Thrift first\nconst budget = { display: 0, reserve: 100 };\n// Reserve is what you govern with." },
  60: { code: "// Cook a small fish\nfunction govern_country(c: Country): Country {\n  return c;       // do not flip more than once\n}" },
  61: { code: "// The great country lies low\nconst sea = { altitude: 0, gathered: 'all rivers' };\n// Lowest position. Most water." },
  62: { code: "// The way as storehouse\nclass Storehouse {\n  rejects(person: Person): false { return false; }   // takes everyone\n}" },
  63: { code: "// Hard things from easy starts\nfunction plan(state: 'easy' | 'hard'): Action {\n  return state === 'easy'\n    ? 'address the hard parts now'\n    : 'it is too late to plan; ship anyway';\n}" },
  65: { code: "// Don't make the people clever\nfunction govern(method: 'cleverness' | 'simplicity'): Outcome {\n  return method === 'cleverness' ? 'thief' : 'blessing';\n}" },
  66: { code: "// Sea wins by being lowest\nclass Sea { altitude = -1000; rivers_received = Infinity; }\nclass Mountain { altitude = 8848; rivers_received = 0; }" },
  68: { code: "// Use of people\nfunction lead(others: Person[]): Position {\n  return 'below them';     // not above\n}" },
  69: { code: "// Reluctant army\ntype Stance = 'host' | 'guest';\nconst preferred: Stance = 'guest';\n// Guests cause less damage." },
  71: { code: "// To know you don't know — best\nfunction state(self_assessment: number, actual: number): Health {\n  return self_assessment > actual ? 'disease' : 'healthy';\n}" },
  72: { code: "// When fear breaks, great power arrives\nfunction stability(fear: number, fatigue: number): boolean {\n  return fear > 0 && fatigue < 100;\n}" },
  73: { code: "// Brave in daring vs. brave in not-daring\ntype Bravery = 'daring' | 'not-daring';\nconst outcome: Record<Bravery, 'killed' | 'alive'> = {\n  daring: 'killed',\n  'not-daring': 'alive',\n};" },
  74: { code: "// Don't be the substitute carpenter\nfunction kill(role: 'state' | 'executioner'): Hand {\n  return role === 'state' ? 'injured' : 'fine';\n}" },
  75: { code: "// Hungry people, eaten taxes\nconst hunger    = (court_appetite: number) => court_appetite;\nconst dissent   = (court_doing: number) => court_doing;\nconst recklessness = (court_clinging: number) => court_clinging;" },
  77: { code: "// Heaven's bow\nfunction redistribute(state: { high: number; low: number }) {\n  return { high: state.high - 1, low: state.low + 1 };\n}\n// Humans run this function in reverse, and call it 'efficiency'." },
  79: { code: "// Settled grievance, residual grievance\nfunction settle(g: Grievance): Residual {\n  return g.residual = g.original * 0.4;     // never zero\n}" },
  80: { code: "// Small country, full life\nconst village = {\n  tools: many,     // present\n  used:  few,      // chosen\n  food:  'sweet',\n  clothes: 'beautiful',\n  homes: 'comfortable',\n  customs: 'joyful',\n};" },
  81: {
    direct: "Faithful words are not beautiful; beautiful words are not faithful.\nThe good do not argue; those who argue are not good.\nThose who know are not learned; those who are learned do not know.\nThe sage does not hoard.\nThe more he does for others, the more he has;\nthe more he gives, the more there is.\nThe way of heaven: benefits and does not harm.\nThe way of the sage: acts and does not contend.",
    reading: "What if the last chapter is the book's auto-undoing — and that's the point?\nGödel's incompleteness theorems (1931) showed that any formal system rich enough to be useful contains true sentences it cannot prove. The Daoist version is older: any sentence is wrong in a specific way. The book, having spent eighty chapters saying useful sentences, ends by reminding you that all of them are partially false.\nThis is not nihilism. It is intellectual hygiene. Karl Popper made the same case in The Logic of Scientific Discovery (1934): a theory is scientific exactly to the extent that it could, in principle, be wrong. The book is therefore making itself scientific, not in the empirical sense but in the structural one. The ending is the precondition of the beginning: read it again, knowing it is not the final word, and the words start to land properly.",
    code: "// The book closes with its own escape clause.\ntype Book = { claims: string[]; closure: 'all may be wrong' };\n\nfunction read(b: Book): Wisdom {\n  const informed = b.claims;\n  const guarded  = informed.map(c => `${c} (probably)`);\n  return new Wisdom({ informed, guarded });\n}\n\n// The closure is the door, not the wall.",
    sources: [
      "Karl Popper, The Logic of Scientific Discovery (1934).",
      "Kurt Gödel, 'On Formally Undecidable Propositions' (1931).",
      "Wittgenstein, Philosophical Investigations (1953), §6: 'All that I can give you is a method.'"
    ]
  }
};
