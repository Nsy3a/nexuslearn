const base = ''
async function j(method, path, body){
  const r = await fetch(base+path,{method,headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined})
  const t = await r.text()
  try{ return JSON.parse(t) }catch{ return {raw:t} }
}
function val(id){ return document.getElementById(id).value }
function out(id,obj){ document.getElementById(id).textContent = JSON.stringify(obj,null,2) }

document.getElementById('btnGoal').onclick = async ()=>{
  const r = await j('POST','/goals',{userId:val('userId'),goal:val('goal'),skills:val('skills').split(',')})
  out('outGoal',r)
}
document.getElementById('btnPlan').onclick = async ()=>{
  const r = await j('POST','/plans',{userId:val('userId'),timeBudgetDays:7})
  out('outPlan',r)
}
document.getElementById('btnProfile').onclick = async ()=>{
  const r = await j('PUT','/profile/'+val('userId'),{preferences:{format:val('prefFormat')},avoidRules:[val('avoid')]})
  out('outProfile',r)
}
document.getElementById('btnIngestUrl').onclick = async ()=>{
  const r = await j('POST','/ingest/url',{url:val('matUrl'),tags:{density:'进阶',subject:'会计',form:'理论'}})
  out('outMat',r)
}
document.getElementById('btnUpload').onclick = async ()=>{
  const r = await j('POST','/ingest/upload',{filename:val('upName'),contentBase64:val('upData'),tags:{density:'入门',subject:'通用',form:'理论'}})
  out('outMat',r)
}
document.getElementById('btnListMat').onclick = async ()=>{
  const r = await j('GET','/materials')
  out('outMat',r)
}
document.getElementById('btnSearch').onclick = async ()=>{
  const filters = encodeURIComponent(JSON.stringify({subject:val('searchSubject')}))
  const r = await fetch('/search?q='+encodeURIComponent(val('searchQ'))+'&userId='+encodeURIComponent(val('userId'))+'&filters='+filters)
  out('outSearch',await r.json())
}
let lastDemandId = ''
document.getElementById('btnDemand').onclick = async ()=>{
  const r = await j('POST','/demands',{title:val('dmTitle'),description:'Vue3 方案',techStack:['Vue3'],budgetStablecoin:Number(val('dmBudget'))})
  lastDemandId = r.demand.id
  out('outDemand',r)
}
document.getElementById('btnAnswer').onclick = async ()=>{
  const r = await j('POST','/answers',{demandId:lastDemandId,contributor:'0xabc',contentUri:val('ansUri'),quality:0.9})
  out('outDemand',r)
}
document.getElementById('btnAccept').onclick = async ()=>{
  const r = await j('POST','/accept',{demandId:lastDemandId,contributions:[{address:'0xabc',share:1.0}],contentHash:'ipfs://QmWork',summary:'登录方案'})
  out('outDemand',r)
}
document.getElementById('btnNfts').onclick = async ()=>{
  const r = await j('GET','/nfts')
  out('outDemand',r)
}
document.getElementById('btnAiPlan').onclick = async ()=>{
  const r = await j('POST','/ai/plan',{userId:val('userId'),goal:val('goal'),skills:val('skills').split(','),timeBudgetDays:7})
  out('outAi',r)
}
document.getElementById('btnAiGen').onclick = async ()=>{
  const r = await j('POST','/ai/generate',{type:val('aiType'),goal:val('goal')})
  out('outAi',r)
}

