export const C_NODES = [
  { id:'dawn',      label:'清晨',         x:.24, y:.10, f:0 },
  { id:'cafe',      label:'咖啡馆',       x:.58, y:.09, f:1 },
  { id:'deadline',  label:'deadline前',   x:.86, y:.19, f:2 },
  { id:'city',      label:'城市角落',     x:.11, y:.32, f:3 },
  { id:'alone',     label:'独处',         x:.42, y:.28, f:0 },
  { id:'diner',     label:'老街小馆',     x:.77, y:.36, f:1 },
  { id:'happy',     label:'小确幸',       x:.26, y:.50, f:2 },
  { id:'hollow',    label:'说不上来的空', x:.55, y:.49, f:3 },
  { id:'midnight',  label:'深夜',         x:.83, y:.56, f:0 },
  { id:'hallway',   label:'深夜走廊',     x:.17, y:.68, f:1 },
  { id:'tired',     label:'撑过去了',     x:.47, y:.67, f:2 },
  { id:'invisible', label:'不被看见',     x:.74, y:.70, f:3 },
  { id:'shadow',    label:'陌生人背影',   x:.31, y:.84, f:0 },
  { id:'empty',     label:'空镜留白',     x:.62, y:.86, f:1 },
];

export const C_LINKS = [
  ['dawn','alone'], ['cafe','hollow'], ['city','shadow'],
  ['midnight','empty'], ['tired','invisible'], ['hallway','deadline'],
  ['happy','dawn'], ['diner','midnight'],
];

export const C_INSPIRATIONS = {
  'deadline+hollow':  { title:'交稿前的无感时刻', desc:'不是在逃避，是真的感受不到任何情绪了。记录这种状态：空杯子、灰屏、数不清楚的页数。', shot:'拍你的桌面：越乱越真实，加一句：今晚还差多少。', tags:['#deadline', '#情绪低谷', '#真实在线'] },
  'cafe+alone':       { title:'一个人的咖啡馆下午', desc:'不是炫耀，是记录：这两个小时只属于自己，什么都不用解释。', shot:'拍你坐下后看到的视角：杯子、窗外、路过的人，不加滤镜。', tags:['#独处', '#咖啡馆', '#给自己的时间'] },
  'city+dawn':        { title:'早上七点半的某个路口', desc:'上班的、遛狗的、还没开张的店铺——这段时间城市里有另一种逻辑在运转。', shot:'拍一个固定路口三分钟，人来人往但镜头不动。', tags:['#清晨', '#城市', '#另一面'] },
  'hallway+midnight': { title:'深夜走廊，还有灯亮着', desc:'不需要知道那盏灯后面是谁，只知道：你不是今晚唯一一个还没睡的人。', shot:'拍走廊尽头的光，或者门缝透出来的那一条。长曝或正常快门都行。', tags:['#深夜', '#走廊', '#存在感'] },
  'hollow+tired':     { title:'好像比昨天多撑了一点', desc:'不励志，只承认：今天很难，但我还在。这种克制的表达最容易触到人。', shot:'拍最累的那个时刻：空杯子、快没电的屏幕、或你的手。', tags:['#撑住', '#真实感', '#情绪共鸣'] },
  'invisible+shadow': { title:'那些不被看见的人', desc:'保洁阿姨、小摊贩、保安——他们每天都在，但几乎没人拍他们。用镜头让他们存在一次。', shot:'拍工作的手或重复的背影，不打扰，只是让他们被看见。', tags:['#小人物', '#被看见', '#城市'] },
  'alone+city':       { title:'我的专属城市角落', desc:'你常去的那个地方——不是因为特别，是因为你一直在那里，所以它变得特别了。', shot:'拍那个地方你坐下后的视角：你看到什么，窗外什么，旁边什么。', tags:['#独处', '#城市角落', '#习惯'] },
  'diner+midnight':   { title:'深夜小馆还在营业', desc:'不是种草，是记录：这个时间来吃饭的人，刚从哪里来，要去哪里。', shot:'拍灯光、菜品、付钱的手；不打扰，只让他们存在。', tags:['#深夜探店', '#烟火气', '#城市夜晚'] },
  'empty+hollow':     { title:'今天有点说不上来', desc:'不强迫找理由，就是记录这种说不上来的状态。很多人也在这里。', shot:'拍窗外、天花板、或你发呆时眼睛停留的地方。', tags:['#发呆', '#空白感', '#共鸣'] },
  'city+happy':       { title:'今天好像变好了一点点', desc:'不需要解释为什么，只需要记录这个时刻。一条阳光、一个角落都可以是证据。', shot:'拍让你有这种感觉的那个地方，就一张，不多解释。', tags:['#小确幸', '#今日份快乐', '#城市生活'] },
  'deadline+tired':   { title:'今天真的累了', desc:'不鸡血，不打气，只是诚实地说：今天的目标我尽力了。书桌的乱是状态最好的证明。', shot:'拍你的桌面现在的样子，乱的程度就是你状态的程度，不用整理。', tags:['#今日份努力', '#真实在学', '#共鸣'] },
  'hallway+shadow':   { title:'这栋楼里，今晚还有人在', desc:'深夜那个独自走过的背影——你不知道他从哪来、要去哪，但你们同时存在于这一刻。', shot:'长走廊 + 尽头一个人 + 脚步声。远景，不拍脸。', tags:['#深夜背影', '#楼道', '#存在感'] },
};

export function getInspiration(ids) {
  const sorted = [...ids].sort();
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const key = sorted[i] + '+' + sorted[j];
      if (C_INSPIRATIONS[key]) return C_INSPIRATIONS[key];
    }
  }
  for (const id of sorted) {
    const hit = Object.keys(C_INSPIRATIONS).find(k =>
      k === id || k.startsWith(id + '+') || k.endsWith('+' + id));
    if (hit) return C_INSPIRATIONS[hit];
  }
  return null;
}
