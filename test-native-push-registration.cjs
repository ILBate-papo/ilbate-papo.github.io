const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{webcrypto}=require('node:crypto');
const source=fs.readFileSync(__dirname+'/native-push-registration.js','utf8');
async function flush(){for(let i=0;i<12;i++)await new Promise(r=>setTimeout(r,5));}
(async()=>{
 const writes=[],events={},accounts=[];let tick,authChange,user={id:'first'};
 const api={available:true,permission:true,fcmToken:'token-one',account:id=>accounts.push(id)};
 const db={auth:{onAuthStateChange:fn=>{authChange=fn},async getSession(){return{data:{session:user?{user}:null}}}},from:table=>({async upsert(row,options){writes.push({table,row,options});return{error:null}}})};
 const window={__ilbpAppClient:db,ILBPNativeAlerts:api,addEventListener:(n,fn)=>events[n]=fn,dispatchEvent(){}};
 vm.runInNewContext(source,{window,document:{addEventListener(){}},crypto:webcrypto,TextEncoder,Event,console,setTimeout:()=>1,setInterval:fn=>{tick=fn;return 1},clearInterval(){},Promise});
 tick();await flush();assert.equal(writes.length,1);assert.equal(writes[0].table,'push_subscriptions');assert.equal(writes[0].row.user_id,'first');assert.equal(writes[0].row.subscription.transport,'fcm');assert.equal(writes[0].row.subscription.app_id,'ilbp');
 const firstEndpoint=writes[0].row.endpoint;
 api.fcmToken='token-two';events['ilbp-native-alert-state']();await flush();assert.equal(writes.length,2);assert.notEqual(writes[1].row.endpoint,firstEndpoint,'new token must replace the registered target');
 user=null;authChange();events['ilbp-native-alert-state']();await flush();assert.equal(writes.length,2,'logout must never register an unauthenticated target');assert.equal(accounts.at(-1),'');
 user={id:'second'};authChange();events['ilbp-native-alert-state']();await flush();assert.equal(writes.at(-1).row.user_id,'second');assert(writes.at(-1).row.endpoint.startsWith('fcm:ilbp:second:'));
 api.permission=false;events['ilbp-native-alert-state']();const count=writes.length;await flush();assert.equal(writes.length,count,'no registration without notification permission');
 console.log('PASS: native target registration, token renewal, logout, account switch and permission gate');
})().catch(e=>{console.error(e);process.exitCode=1});
