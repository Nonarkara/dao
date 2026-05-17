/* =============================================================
   問 wèn · DAILY CHECK-IN QUESTIONS
   30 reflective prompts, trilingual, in Dr Non's voice.
   Three rotations of 10 — Perception · Action · Will — adapted
   from the Stoic triad (see Ryan Holiday, The Daily Stoic, 2016)
   but grounded in Daoist + Buddhist + lived-everyday Bangkok register.

   Schema: each prompt has id (stable identifier never re-used),
   theme (perception/action/will), q_en / q_th / q_cn (the question
   itself), and an optional nudge (a small line shown beneath the
   question to help the reader get started — not a leading answer).

   The day-of-year picks a question via index % 30, so the same
   prompt comes back every 30 days. Repetition is the point;
   the Dao De Jing teaches itself through return.
   ============================================================ */
window.CHECKIN_QUESTIONS = [
  // ─── PERCEPTION (1–10) — how we see ───────────────────────────
  {
    id: 'p01-control',
    theme: 'perception',
    q_en: 'What is the one thing today that I am trying to control that does not belong to me?',
    q_th: 'วันนี้มีสิ่งใดที่ผมพยายามควบคุม ทั้งที่มันไม่ใช่ของผมเลย?',
    q_cn: '今天我正在试图掌控、而其实根本不属于我的那一件事，是什么？',
    nudge_en: 'Other people’s opinions. The weather. A reply that hasn’t come.',
    nudge_th: 'ความเห็นของคนอื่น สภาพอากาศ คำตอบที่ยังไม่มา',
    nudge_cn: '别人的看法。天气。还没回的那条消息。',
  },
  {
    id: 'p02-naming',
    theme: 'perception',
    q_en: 'What did I name today that lost something the moment I named it?',
    q_th: 'วันนี้ผมตั้งชื่ออะไรไป แล้วสิ่งนั้นเสียบางอย่างไปทันทีที่ถูกตั้งชื่อ?',
    q_cn: '今天我给什么东西命了名——而它一被命名，就少了一些什么？',
    nudge_en: 'A feeling reduced to one word. A relationship called a label. A meal called by its calories.',
    nudge_th: 'ความรู้สึกที่ถูกย่อเหลือคำเดียว ความสัมพันธ์ที่ถูกแปะป้าย อาหารที่ถูกเรียกตามแคลอรี',
    nudge_cn: '一种情绪被压成一个词。一段关系被贴上标签。一顿饭被叫成热量。',
  },
  {
    id: 'p03-noise',
    theme: 'perception',
    q_en: 'Whose opinion of me did I let into my head today, and was the rent fair?',
    q_th: 'วันนี้ผมยอมให้ความเห็นของใครเข้ามาในหัว และค่าเช่าห้องนั้นยุติธรรมหรือเปล่า?',
    q_cn: '今天我让谁对我的看法住进了脑子里，那房租公道吗？',
  },
  {
    id: 'p04-mundane',
    theme: 'perception',
    q_en: 'What small, ordinary thing today was actually beautiful if I bothered to look?',
    q_th: 'วันนี้มีสิ่งเล็ก ๆ ธรรมดา ๆ อะไรบ้างที่จริง ๆ แล้วสวย ถ้าผมยอมเสียเวลามอง?',
    q_cn: '今天有哪些再普通不过的小事，其实只要肯多看一眼就很美？',
  },
  {
    id: 'p05-mirror',
    theme: 'perception',
    q_en: 'If a stranger watched my day on video, what would they say I value?',
    q_th: 'ถ้าคนแปลกหน้าดูวันนี้ของผมเป็นวิดีโอ เขาจะบอกว่าผมให้คุณค่ากับอะไร?',
    q_cn: '如果一个陌生人把今天我的日子拍成视频看完，他会说我看重的是什么？',
  },
  {
    id: 'p06-attention',
    theme: 'perception',
    q_en: 'Where did my attention go today — and was that on purpose?',
    q_th: 'วันนี้ความสนใจของผมไปอยู่ที่ไหน — แล้วผมตั้งใจให้มันไปอยู่ตรงนั้นไหม?',
    q_cn: '今天我的注意力都跑到哪去了——那是我有意让它去的吗？',
  },
  {
    id: 'p07-noise-input',
    theme: 'perception',
    q_en: 'What information did I let in today that I will regret tomorrow?',
    q_th: 'วันนี้ผมรับข้อมูลอะไรเข้ามาที่พรุ่งนี้ผมจะเสียดาย?',
    q_cn: '今天有哪些信息我让它进来了，明天会后悔的？',
  },
  {
    id: 'p08-judge',
    theme: 'perception',
    q_en: 'Did I judge someone today before I asked them anything?',
    q_th: 'วันนี้ผมตัดสินใครก่อนถามอะไรเขาเลยหรือเปล่า?',
    q_cn: '今天我有没有还没问对方任何问题，就先把他判定了？',
  },
  {
    id: 'p09-reframe',
    theme: 'perception',
    q_en: 'What did I call bad luck today that might be the wheel arriving late?',
    q_th: 'วันนี้สิ่งที่ผมเรียกว่าโชคไม่ดี อาจเป็นล้อรถที่มาช้ากว่ากำหนดได้ไหม?',
    q_cn: '今天我说倒霉的那件事，会不会其实只是行李轮子还没寄到？',
  },
  {
    id: 'p10-silence',
    theme: 'perception',
    q_en: 'When was the last silence in my day, and what filled it?',
    q_th: 'วันนี้ความเงียบครั้งสุดท้ายของผมอยู่ตรงไหน แล้วอะไรเข้ามาแทนที่?',
    q_cn: '今天我最后一次安静是什么时候，那段安静后来被什么填满了？',
  },

  // ─── ACTION (11–20) — what we do ──────────────────────────────
  {
    id: 'a01-no',
    theme: 'action',
    q_en: 'What did I agree to today that I should have said no to?',
    q_th: 'วันนี้ผมตกลงเรื่องอะไรไป ทั้งที่ควรจะปฏิเสธ?',
    q_cn: '今天我答应了什么本该说不的事？',
  },
  {
    id: 'a02-subtract',
    theme: 'action',
    q_en: 'What could I have removed today instead of adding?',
    q_th: 'วันนี้มีอะไรที่ผมควรเอาออก แทนที่จะใส่เพิ่ม?',
    q_cn: '今天我本可以减掉什么，而不是再加点什么？',
  },
  {
    id: 'a03-minimum',
    theme: 'action',
    q_en: 'What was the minimum thing today that kept me in the flow?',
    q_th: 'วันนี้สิ่งน้อยที่สุดที่ทำให้ผมอยู่ในโฟลว์ได้คืออะไร?',
    q_cn: '今天能让我保持在心流里的最少那件事，是什么？',
  },
  {
    id: 'a04-help',
    theme: 'action',
    q_en: 'Whose problem did I help solve today without anyone asking?',
    q_th: 'วันนี้ผมช่วยแก้ปัญหาของใครโดยที่ไม่มีใครขอ?',
    q_cn: '今天我没等谁开口，就帮谁解了一道难题？',
  },
  {
    id: 'a05-finish',
    theme: 'action',
    q_en: 'What did I finish today — and what did I refuse to call finished?',
    q_th: 'วันนี้ผมทำอะไรเสร็จ — แล้วมีอะไรที่ผมยังไม่ยอมเรียกว่าเสร็จ?',
    q_cn: '今天我把什么收了尾，又有什么我硬不肯说它完成了？',
  },
  {
    id: 'a06-belly',
    theme: 'action',
    q_en: 'Did I eat from the belly or from the eyes today?',
    q_th: 'วันนี้ผมกินจากท้อง หรือกินจากตา?',
    q_cn: '今天我是从肚子吃，还是从眼睛吃？',
  },
  {
    id: 'a07-sleep',
    theme: 'action',
    q_en: 'How much sleep did I steal from myself last night, and what did I buy with it?',
    q_th: 'เมื่อคืนผมขโมยเวลานอนของตัวเองไปเท่าไหร่ แล้วเอาไปแลกอะไร?',
    q_cn: '昨晚我从自己这里偷了多少觉，换来了什么？',
  },
  {
    id: 'a08-write',
    theme: 'action',
    q_en: 'What sentence do I owe someone but have not written yet?',
    q_th: 'มีประโยคไหนบ้างที่ผมติดค้างใครอยู่ แต่ยังไม่ได้เขียน?',
    q_cn: '我欠谁一句话却到现在还没写下来？',
  },
  {
    id: 'a09-deferred',
    theme: 'action',
    q_en: 'What small thing have I been deferring all week that takes ten minutes?',
    q_th: 'มีเรื่องเล็ก ๆ อะไรที่ผมเลื่อนมาทั้งสัปดาห์ ทั้งที่ใช้เวลาแค่สิบนาที?',
    q_cn: '有什么小事其实十分钟就能做完，我却拖了整整一周？',
  },
  {
    id: 'a10-presence',
    theme: 'action',
    q_en: 'Who got the version of me that was actually present today?',
    q_th: 'วันนี้ใครได้เจอผมในเวอร์ชันที่ใจอยู่ตรงนั้นจริง ๆ?',
    q_cn: '今天谁见到了那个真正在场的我？',
  },

  // ─── WILL (21–30) — what we accept ────────────────────────────
  {
    id: 'w01-mortality',
    theme: 'will',
    q_en: 'If today were my last day, what about it would I keep — and what would I let go?',
    q_th: 'ถ้าวันนี้เป็นวันสุดท้ายของผม สิ่งใดที่ผมจะเก็บไว้ — และสิ่งใดที่ผมจะปล่อยไป?',
    q_cn: '如果今天是我最后一天，今天有什么我想留，又有什么我愿意放下？',
  },
  {
    id: 'w02-acceptance',
    theme: 'will',
    q_en: 'What did I waste energy resisting today that was never mine to win?',
    q_th: 'วันนี้ผมเสียพลังต้านอะไร ทั้งที่ไม่เคยเป็นของผมตั้งแต่แรก?',
    q_cn: '今天我花力气抗拒什么——而那件事原本就不归我赢？',
  },
  {
    id: 'w03-amorfati',
    theme: 'will',
    q_en: 'Name one thing about today that I did not choose but can love.',
    q_th: 'มีอะไรในวันนี้ที่ผมไม่ได้เลือก แต่สามารถรักได้?',
    q_cn: '今天有什么不是我选的，但我可以去爱？',
  },
  {
    id: 'w04-gratitude',
    theme: 'will',
    q_en: 'What did I take for granted today that I would miss if it were gone tomorrow?',
    q_th: 'วันนี้ผมรับอะไรเป็นเรื่องปกติ ที่พรุ่งนี้ถ้ามันหายไปผมจะคิดถึง?',
    q_cn: '今天我把什么当成理所当然，而要是明天它没了，我会想念？',
  },
  {
    id: 'w05-grief',
    theme: 'will',
    q_en: 'Is there someone I have not let myself grieve for yet?',
    q_th: 'มีใครที่ผมยังไม่ยอมเปิดใจให้ตัวเองโศกเศร้าให้?',
    q_cn: '有没有一个人，我还没让自己好好为他难过？',
  },
  {
    id: 'w06-flow',
    theme: 'will',
    q_en: 'When did I feel time disappear today — and could I get back there tomorrow?',
    q_th: 'วันนี้ผมรู้สึกว่าเวลาหายไปตอนไหน — แล้วพรุ่งนี้ผมจะกลับไปอยู่ตรงนั้นได้ไหม?',
    q_cn: '今天我什么时候觉得时间不见了——明天有办法再回到那里吗？',
  },
  {
    id: 'w07-parent',
    theme: 'will',
    q_en: 'What would my younger self thank me for today?',
    q_th: 'วันนี้ตัวผมในวัยเด็กจะขอบคุณผมเรื่องอะไร?',
    q_cn: '今天，小时候的我会因为什么事谢谢现在的我？',
  },
  {
    id: 'w08-enough',
    theme: 'will',
    q_en: 'What number would be enough — and why am I still chasing more?',
    q_th: 'ตัวเลขเท่าไหร่ถึงจะพอ — แล้วทำไมผมยังวิ่งหามากกว่านั้น?',
    q_cn: '到什么数字才算够——我为什么还在追比这个更多的？',
  },
  {
    id: 'w09-loneliness',
    theme: 'will',
    q_en: 'Was today’s solitude restful, or was it the kind that taught me something?',
    q_th: 'ความเงียบของวันนี้ทำให้ผมพัก หรือเป็นความเงียบที่สอนผม?',
    q_cn: '今天的独处，是让我休息，还是教了我什么？',
  },
  {
    id: 'w10-tomorrow',
    theme: 'will',
    q_en: 'One sentence: what do I want tomorrow to feel like?',
    q_th: 'หนึ่งประโยค: ผมอยากให้พรุ่งนี้รู้สึกแบบไหน?',
    q_cn: '一句话：我希望明天的感觉是什么样？',
  },
];

window.CHECKIN_THEMES = {
  perception: { en: 'Perception', th: 'การมอง', cn: '观',  cn_full: '观见 · perception' },
  action:     { en: 'Action',     th: 'การทำ',   cn: '行',  cn_full: '行止 · action' },
  will:       { en: 'Will',       th: 'การยอม',  cn: '愿',  cn_full: '愿受 · will' },
};
