window.__ModuleLoader__.load({
  id: 'dsh-usage-heatmap',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const css = `.uh-page{height:100%;overflow:auto;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);padding:clamp(20px,4vw,52px);box-sizing:border-box}.uh-wrap{max-width:1050px;margin:auto}.uh-kicker{text-transform:uppercase;letter-spacing:.13em;color:var(--dsw-alias-state-success-primary);font-size:11px;font-weight:700}.uh-title{font-size:clamp(24px,4vw,34px);font-weight:650;letter-spacing:-.03em;margin:8px 0 6px}.uh-sub{font-size:13px;color:var(--dsw-alias-label-secondary);margin-bottom:24px}.uh-today{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;flex-wrap:wrap;padding:18px 20px;margin-bottom:18px;border-radius:14px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1)}.uh-today-main{display:flex;flex-direction:column;gap:4px}.uh-today-label{font-size:11px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--dsw-alias-label-secondary)}.uh-today-value{font-size:32px;font-weight:650;font-variant-numeric:tabular-nums;line-height:1.1}.uh-today-unit{font-size:12px;font-weight:500;color:var(--dsw-alias-label-secondary);margin-left:6px}.uh-today-split{display:flex;gap:22px;flex-wrap:wrap}.uh-today-split div{display:flex;flex-direction:column;gap:2px}.uh-today-split strong{font-size:14px;font-variant-numeric:tabular-nums}.uh-today-split span{font-size:11px;color:var(--dsw-alias-label-secondary)}.uh-card{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:18px;padding:clamp(18px,3vw,30px);box-shadow:0 16px 45px #00000009}.uh-top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.uh-tabs{display:flex;gap:5px;padding:4px;border-radius:10px;background:var(--dsw-alias-bg-layer-2)}.uh-tab{border:0;background:transparent;color:var(--dsw-alias-label-secondary);padding:8px 15px;border-radius:7px;cursor:pointer;font:inherit;font-size:13px}.uh-tab[aria-selected=true]{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);box-shadow:0 1px 4px #0002;font-weight:600}.uh-summary{font-size:13px;color:var(--dsw-alias-label-secondary)}.uh-summary strong{color:var(--dsw-alias-label-primary);font-size:18px;font-variant-numeric:tabular-nums}.uh-controls{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:22px 0}.uh-select,.uh-refresh{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;color:var(--dsw-alias-label-primary);padding:7px 10px;font:inherit;font-size:12px}.uh-refresh{cursor:pointer}.uh-scroll{overflow-x:auto;padding-bottom:6px}.uh-chart{min-width:730px;width:100%;position:relative}.uh-months{height:24px;position:relative;margin-left:35px;color:var(--dsw-alias-label-secondary);font-size:11px}.uh-month{position:absolute;white-space:nowrap}.uh-body{display:flex;gap:7px}.uh-weekdays{width:28px;flex:none;display:grid;grid-template-rows:repeat(7,15px);gap:3.75px;color:var(--dsw-alias-label-secondary);font-size:10px;line-height:15px}.uh-grid{display:grid;grid-auto-flow:column;grid-template-rows:repeat(7,15px);grid-auto-columns:15px;gap:3.75px}.uh-day{width:15px;height:15px;border:0;padding:0;border-radius:3px;background:var(--dsw-alias-bg-layer-2);cursor:pointer;outline-offset:2px}.uh-day[data-level="1"]{background:#0e4429}.uh-day[data-level="2"]{background:#006d32}.uh-day[data-level="3"]{background:#26a641}.uh-day[data-level="4"]{background:#39d353}.uh-day:hover,.uh-day:focus-visible{outline:2px solid var(--dsw-alias-brand-primary)}.uh-legend{display:flex;align-items:center;justify-content:flex-end;gap:5px;margin-top:18px;font-size:11px;color:var(--dsw-alias-label-secondary)}.uh-legend span{height:12px;width:12px;border-radius:2px;background:var(--dsw-alias-bg-layer-2)}.uh-legend span:nth-of-type(2){background:#0e4429}.uh-legend span:nth-of-type(3){background:#006d32}.uh-legend span:nth-of-type(4){background:#26a641}.uh-legend span:nth-of-type(5){background:#39d353}.uh-section{margin-top:20px;font-size:13px;color:var(--dsw-alias-label-secondary)}.uh-footer{display:flex;justify-content:space-between;gap:8px;font-size:11px;color:var(--dsw-alias-label-secondary)}.uh-stats{display:flex;flex-direction:column;gap:4px;min-width:140px}.uh-stat{display:flex;justify-content:space-between;gap:20px;font-size:15px;font-weight:600}.uh-stat-label{text-align:left}.uh-stat-value{text-align:right;font-variant-numeric:tabular-nums}.uh-error{color:var(--dsw-alias-state-error-primary)}.uh-detail{padding:15px;margin-top:22px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-2)}.uh-detail button{float:right;background:none;border:0;color:var(--dsw-alias-label-primary);cursor:pointer}.uh-detail ul{padding-left:20px;max-height:230px;overflow:auto}.uh-nav{width:24px;height:24px;display:block;color:var(--dsw-alias-state-success-primary)}`;
    const translations = {
      zh: { title:'用量热力图', tagline:'USAGE OVERVIEW', sub:'过去一年的会话活动与模型 Token 消耗', sessions:'会话', tokens:'Token 用量', year:'今年', months:'最近', monthUnit:'个月', refresh:'刷新', total:'合计', unit:'次活跃会话', tokenUnit:'Tokens', less:'少', more:'多', today:'今日', days7:'近 7 天', days15:'近 15 天', days30:'近 30 天', todaySessions:'今日会话', todayInput:'输入', todayOutput:'输出', todayCache:'缓存读取', local:'本地会话日志 · 不上传数据', errors:'个会话暂时无法读取', loading:'正在汇总历史会话…', detail:'当日活动', close:'关闭', noDetail:'没有可展示的会话', note:'Token 包含输入、输出及缓存；不等同于付费 Credits。', fail:'读取失败', monday:'一', wednesday:'三', friday:'五', sunday:'日' },
      en: { title:'Usage Heatmap', tagline:'USAGE OVERVIEW', sub:'Daily session activity and model token usage', sessions:'Sessions', tokens:'Token usage', year:'This year', months:'Last', monthUnit:'months', refresh:'Refresh', total:'Total', unit:'active sessions', tokenUnit:'tokens', less:'Less', more:'More', today:'Today', days7:'Last 7 days', days15:'Last 15 days', days30:'Last 30 days', todaySessions:'Sessions', todayInput:'Input', todayOutput:'Output', todayCache:'Cache read', local:'Local session logs · no upload', errors:'sessions could not be read', loading:'Summarizing historical sessions…', detail:'Daily activity', close:'Close', noDetail:'No sessions to display', note:'Tokens include input, output and cache; not monetary Credits.', fail:'Could not load', monday:'Mon', wednesday:'Wed', friday:'Fri', sunday:'Sun' },
    };
    function dateKey(d) { const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; }
    function addDay(date,n){const d=new Date(date.getFullYear(),date.getMonth(),date.getDate()+n);return d;}
    function bounds(range, months) { const now=new Date(), end=new Date(now.getFullYear(),now.getMonth(),now.getDate()); let start;
      if(range==='year')start=new Date(end.getFullYear(),0,1);else start=new Date(end.getFullYear(),end.getMonth()-months+1,1);
      return {from:dateKey(start),to:dateKey(end),start,end}; }
    function component({ ctx }) {
      return function UsageHeatmap() {
        const [locale,setLocale]=React.useState(()=>ctx.locale.getLocale().active);
        React.useEffect(()=>ctx.locale.subscribe(()=>setLocale(ctx.locale.getLocale().active)),[]);
        const zh=locale.toLowerCase().startsWith('zh');
        const t=translations[zh?'zh':'en'];
        const [metric,setMetric]=React.useState('sessions');
        const [range,setRange]=React.useState('months');
        const [months,setMonths]=React.useState(12);
        const [weekStart,setWeekStart]=React.useState(0);
        const [scale,setScale]=React.useState('quantile');
        const [selected,setSelected]=React.useState(null);
        const [refresh,setRefresh]=React.useState(0);
        const [data,setData]=React.useState(null);
        const [status,setStatus]=React.useState(null);
        const configured=React.useRef(false);
        const b=bounds(range,months);
        React.useEffect(()=>{
          let live=true; const controller=new AbortController();
          const load=async()=>{try{
            const url=`/api/dsh-usage-heatmap?from=${b.from}&to=${b.to}`+(selected?`&day=${selected}`:'');
            const response=await fetch(url,{signal:controller.signal,credentials:'same-origin'});
            const result=await response.json();if(!response.ok)throw Error(result.error||`HTTP ${response.status}`);
            if(!live)return;
            if(!configured.current){configured.current=true;setMetric(result.settings.defaultMetric==='tokens'?'total':'sessions');setMonths(result.settings.rangeMonths);setWeekStart(result.settings.weekStart);setScale(result.settings.scale);}
            setData(result);setStatus(null);
          }catch(e){if(live&&e.name!=='AbortError')setStatus(e.message||String(e));}};
          load();const timer=setInterval(load,15000);return ()=>{live=false;controller.abort();clearInterval(timer)};
        },[b.from,b.to,selected,refresh]);
        const rows=new Map((data?.days||[]).map(row=>[row.date,row]));
        const first=addDay(b.start,-((b.start.getDay()-weekStart+7)%7));
        const count=Math.ceil((Math.floor((b.end-first)/86400000)+1)/7)*7;
        const values=(data?.days||[]).map(row=>row[metric]||0).filter(v=>v>0).sort((a,c)=>a-c);
        const level=v=>{if(!v)return 0;if(scale==='fixed'){const cut=metric==='sessions'?[1,2,4,8]:[1000,10000,100000,1000000];return v>=cut[3]?4:v>=cut[2]?3:v>=cut[1]?2:1;}
          return Math.max(1,Math.min(4,Math.ceil(4*(values.findIndex(a=>a>=v)+1)/Math.max(1,values.length))));};
        const days=Array.from({length:count},(_,i)=>addDay(first,i));
        const firstMonth=[];days.forEach((d,i)=>{if(d>=b.start&&d<=b.end&&(i===0||days[i-1].getMonth()!==d.getMonth())) firstMonth.push({d,i});});
        const number=n=>new Intl.NumberFormat(locale).format(n||0);
        const total=data?.totals?.[metric]||0;
        const shownDay=selected?(rows.get(selected)||{date:selected,sessions:0,input:0,output:0,cacheRead:0,cacheWrite:0,total:0}):null;
        const today=(shownDay&&{
          date:selected,
          total:shownDay.total||0,
          input:shownDay.input, output:shownDay.output,
          cacheRead:shownDay.cacheRead, cacheWrite:shownDay.cacheWrite,
        })||data?.today;
        const periods=data?.periods||{};
        const period=(key,label)=>h('div',{key},h('strong',null,data?number(periods[key]?.total):'—'),h('span',null,label));
        return h('div',{className:'uh-page'},h('style',null,css),h('div',{className:'uh-wrap'},
          h('div',{className:'uh-kicker'},t.tagline),h('h1',{className:'uh-title'},t.title),h('p',{className:'uh-sub'},t.sub),
          h('section',{className:'uh-today'},
            h('div',{className:'uh-today-main'},
              h('span',{className:'uh-today-label'},(shownDay?t.detail:t.today)+(today?.date?' · '+today.date:'')),
              h('span',null,h('span',{className:'uh-today-value'},data?number(today?.total):'—'),h('span',{className:'uh-today-unit'},t.tokenUnit))),
            h('div',{className:'uh-today-split'},
              period('days7',t.days7), period('days15',t.days15), period('days30',t.days30))),
          h('section',{className:'uh-card'},
            h('div',{className:'uh-top'},h('div',{className:'uh-tabs',role:'tablist','aria-label':t.title},
              ['sessions','total'].map(key=>h('button',{key,role:'tab',type:'button',className:'uh-tab','aria-selected':metric===key,onClick:()=>setMetric(key)},key==='sessions'?t.sessions:t.tokens))),
              h('div',{className:'uh-summary'},t.total+' ',h('strong',null,data?number(total):'—'),' '+(metric==='sessions'?t.unit:t.tokenUnit))),
            h('div',{className:'uh-controls'},h('select',{className:'uh-select','aria-label':t.months,value:range,onChange:e=>setRange(e.target.value)},h('option',{value:'months'},t.months+' '+months+' '+t.monthUnit),h('option',{value:'year'},t.year)),
              range==='months'&&h('select',{className:'uh-select','aria-label':t.monthUnit,value:months,onChange:e=>setMonths(Number(e.target.value))},[3,6,12,18,24].map(n=>h('option',{key:n,value:n},n+' '+t.monthUnit))),
              h('button',{className:'uh-refresh',type:'button',onClick:()=>setRefresh(n=>n+1)},t.refresh)),
            h('div',{className:'uh-scroll'},h('div',{className:'uh-chart'},
              h('div',{className:'uh-months'},firstMonth.map(({d,i})=>h('span',{key:i,className:'uh-month',style:{left:`${Math.floor(i/7)*18.75}px`}},new Intl.DateTimeFormat(locale,{month:'short'}).format(d)))),
              h('div',{className:'uh-body'},h('div',{className:'uh-weekdays'},Array.from({length:7},(_,i)=>{const day=(i+weekStart)%7;return h('span',{key:i},day===1?t.monday:day===3?t.wednesday:day===5?t.friday:day===0?t.sunday:'');})),
                h('div',{className:'uh-grid'},days.map(d=>{const key=dateKey(d),row=rows.get(key),v=row?.[metric]||0,active=d>=b.start&&d<=b.end;return h('button',{key,type:'button',className:'uh-day','data-level':active?level(v):0,disabled:!active,
                  title:`${key} · ${number(v)} ${metric==='sessions'?t.unit:t.tokenUnit}`,'aria-label':`${key}: ${number(v)} ${metric==='sessions'?t.unit:t.tokenUnit}`,onClick:()=>setSelected(key),style:!active?{opacity:0}:undefined});}))))),
            h('div',{className:'uh-legend'},t.less,[0,1,2,3,4].map(n=>h('span',{key:n,'aria-hidden':'true'})),t.more),
            h('div',{className:'uh-footer'},h('span',null,t.local),h('span',{className:'uh-stats'},h('span',{className:'uh-stat'},h('span',{className:'uh-stat-label'},t.todayInput),h('span',{className:'uh-stat-value'},data?number(today?.input):'—')),h('span',{className:'uh-stat'},h('span',{className:'uh-stat-label'},t.todayOutput),h('span',{className:'uh-stat-value'},data?number(today?.output):'—')),h('span',{className:'uh-stat'},h('span',{className:'uh-stat-label'},t.todayCache),h('span',{className:'uh-stat-value'},data?number(today?.cacheRead):'—')))),
            h('p',{className:'uh-section'},t.note),
            status?h('p',{className:'uh-error',role:'alert'},t.fail+': '+status):!data?h('p',{className:'uh-section'},t.loading):data.errors?h('p',{className:'uh-error'},data.errors+' '+t.errors):null,
            selected&&h('div',{className:'uh-detail'},h('button',{type:'button','aria-label':t.close,onClick:()=>setSelected(null)},'×'),
              h('strong',null,t.detail+' · '+selected),
              data?.sessions?.length?h('ul',null,data.sessions.map(session=>h('li',{key:session.id},`${session.id} · ${new Date(session.createdAt).toLocaleString(locale)}`))):h('p',null,t.noDetail))
          )));
      };
    }
    function Icon({size=20}){const cells=[[.25,.35,.55],[.4,.7,.9],[.3,.75,1]];
      return h('svg',{className:'uh-nav',viewBox:'0 0 24 24',width:size,height:size,'aria-hidden':true,style:{display:'block'}},
        h('rect',{x:0,y:0,width:24,height:24,rx:5,fill:'currentColor',opacity:.14}),
        cells.flatMap((row,y)=>row.map((opacity,x)=>h('rect',{key:`${x}:${y}`,x:4.5+x*5.5,y:4.5+y*5.5,width:4.5,height:4.5,rx:1,fill:'currentColor',opacity}))));}
    return {inject:['slots','locale'],apply(ctx){
      ctx.effect(()=>ctx.locale.register('usage-heatmap','zh',translations.zh));
      ctx.effect(()=>ctx.locale.register('usage-heatmap','en',translations.en));
      ctx.slots.inject('sidebar.panellist',()=>ctx.slots.register({name:'sidebar.panellist',id:'usage-heatmap',order:25,label:()=>ctx.locale.getLocale().active.toLowerCase().startsWith('zh')?'用量热力图':'Usage Heatmap'},Icon));
      ctx.slots.inject('main',()=>ctx.slots.register({name:'main',key:'usage-heatmap'},component({ctx})));
    }};
  },
});
