export const catalog=[
 {id:'bottle',title:'玻璃瓶的微光',area:'客廳',text:'綠色微光藏在玻璃瓶裡。切換尺度後，同一張桌子變成了高台。'},
 {id:'button',title:'鈕扣小井',area:'客廳',text:'四個細小的孔洞，在迷你視角下變得格外清楚。'},
 {id:'spool',title:'棉線高塔',area:'客廳',text:'纏繞在線軸上的棉線，近看是一層又一層的紋理。'},
 {id:'marble',title:'玻璃圓頂',area:'客廳',text:'玻璃珠的表面反射著房間的暖光。'},
 {id:'fern',title:'葉下森林',area:'溫室',text:'羽狀葉片一層層展開，縮小後可以從葉片下方看見枝葉的排列。'},
 {id:'dew',title:'露珠圓頂',area:'溫室',text:'一片低垂葉子的邊緣，留著透明水珠。玻璃般的表面映著附近的綠色。'},
 {id:'flower',title:'花瓣帳篷',area:'溫室',text:'花瓣向外展開，下面留有可供迷你探險家穿過的空間。'},
 {id:'water',title:'銅壺與水波',area:'溫室',text:'銅色澆水壺停在水盤旁。微弱的水波正向外擴散。'},
 {id:'seed',title:'種子小港',area:'溫室',text:'幾顆種子放在淺淺的木盤裡，旁邊是一張捲起的植物標籤。'}
];
const ids=new Set(catalog.map(x=>x.id));let found=new Set();try{const a=JSON.parse(localStorage.getItem('little-house-journal'));if(Array.isArray(a))found=new Set(a.filter(x=>ids.has(x)));}catch{}
export const journal={record(id){if(!ids.has(id))return false;const fresh=!found.has(id);found.add(id);try{localStorage.setItem('little-house-journal',JSON.stringify([...found]));}catch{}return fresh;},get entries(){return catalog.map(x=>({...x,found:found.has(x.id)}));},get count(){return found.size;}};
