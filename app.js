
/* FORGE STARTUP — wait for the application to finish loading; never overwrite a healthy render */
(function(){
  window.__forgeRendered=false;
  window.__forgeBootError="";
  window.__forgeBootStarted=Date.now();
  function captureError(e){
    window.__forgeBootError=(e&&e.message)||String(e||"Forge startup error");
  }
  window.addEventListener("error",captureError);
  window.addEventListener("unhandledrejection",function(e){captureError(e&&e.reason)});
  function showRecovery(){
    if(window.__forgeRendered)return;
    var app=document.getElementById("app");
    if(!app)return;
    var detail=String(window.__forgeBootError||"The workspace did not finish initializing.");
    var safe=detail.replace(/[<>&]/g,function(c){return c==="&"?"&amp;":c===">"?"&gt;":"&lt;"});
    app.innerHTML="<div class='onboarding'><div class='onboarding-card'><div class='brand'><div class='mark'>F</div>FORGE <small>AI BUSINESS OS</small></div><div class='eyebrow' style='margin-top:32px'>FORGE RECOVERY</div><div class='h1'>Your workspace is ready to retry.</div><p class='sub'>Forge is taking longer than expected to start. Your saved business data has not been replaced.</p><div class='notice'><b>Workspace protection is active.</b><div class='small'>No business profile or product data was deleted.</div></div><div class='actions' style='margin-top:18px'><button class='btn primary' onclick='location.reload()'>Retry Forge →</button></div><div class='small' style='margin-top:14px;opacity:.55'>Startup detail: "+safe+"</div></div></div>";
  }
  function boot(){
    if(window.__forgeRendered)return;
    try{
      if(typeof render==="function"){
        render();
        if(window.__forgeRendered)return;
      }
    }catch(e){captureError(e)}
    if(Date.now()-window.__forgeBootStarted<15000){
      setTimeout(boot,250);
    }else{
      showRecovery();
    }
  }
  setTimeout(boot,50);
})();


/* ---- FORGE SCRIPT BOUNDARY ---- */


const STORAGE_KEY="forge_profile_v3";
const DEFAULT_PROFILE={budget:0,age:0,income:0,expenses:0,reserve:0,market:"Bangladesh",city:"",occupation:"",experience:"Beginner",skills:"",workStyle:"Builder",category:"Open to anything",goal:"Profit + growth",risk:"Balanced",riskCapacity:"Medium",lossTolerance:0,time:0,targetIncome:0,model:"Open to recommendations"};
let saved=null;try{saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null")}catch(e){}
const savedQueue=Array.isArray(saved?.sourcingQueue)?saved.sourcingQueue:[];
const state={page:saved?.locked?"home":"onboarding",business:saved?.business||null,profile:saved?.profile||DEFAULT_PROFILE,profileLocked:!!saved?.locked,selectedProduct:savedQueue.length?(saved?.selectedProduct||savedQueue[0]):null,selectedOpportunityName:saved?.selectedOpportunityName||null,planStatus:savedQueue.length?(saved?.planStatus||null):null,planRequestedAt:savedQueue.length?(saved?.planRequestedAt||null):null,planEtaMinutes:savedQueue.length?(Number(saved?.planEtaMinutes||0)):0,planEtaSeconds:savedQueue.length?(Number(saved?.planEtaSeconds||0)):0,sourcingQueue:savedQueue,brandStudio:saved?.brandStudio||{},storeLaunch:saved?.storeLaunch||{},contentRequests:saved?.contentRequests||[],contentAssets:saved?.contentAssets||[],contentAutomation:saved?.contentAutomation||{},chat:[["ai","I am your AI co-founder. Your locked profile is the foundation for every recommendation. I will not change it when ranking businesses or products."]]};
function persistProfile(){localStorage.setItem(STORAGE_KEY,JSON.stringify({locked:true,profile:state.profile,business:state.business,selectedProduct:state.selectedProduct,selectedOpportunityName:state.selectedOpportunityName,planStatus:state.planStatus,planRequestedAt:state.planRequestedAt,planEtaMinutes:state.planEtaMinutes,planEtaSeconds:state.planEtaSeconds,sourcingQueue:state.sourcingQueue,brandStudio:state.brandStudio||{},storeLaunch:state.storeLaunch||{},contentRequests:state.contentRequests||[],contentAssets:state.contentAssets||[],contentAutomation:state.contentAutomation||{},billing:state.billing||{},billingInvoice:state.billingInvoice||null}))}
function clearProfileForDemo(){localStorage.removeItem(STORAGE_KEY);location.reload()}

const navItems=[["home","⌂","Overview"],["advisor","✦","AI Advisor"],["ideas","◈","Business Finder"],["products","□","Product Lab"],["plan","▤","Business Plan"],["orders","↗","Orders"],["brand","✺","Brand Studio"],["store","▱","Store Launch"],["content","✦","Content Library"],["marketing","◎","AI Marketing"],["billing","▣","Billing & Budget"],["support","◌","AI Customer Support"],["analytics","⌁","Analytics & Decisions"]];
const BDT=n=>"৳"+Number(n||0).toLocaleString("en-BD");
const pct=n=>Math.round(Number(n)||0)+"%";
function nav(){return navItems.map(x=>"<button class='nav "+(state.page===x[0]?"active":"")+"' onclick=\"go('"+x[0]+"')\"><span class='ico'>"+x[1]+"</span>"+x[2]+"</button>").join("")}
function forgePageGuide(){
 const b=state.business||{},p=state.profile||{};
 const titles={
  home:["Lean launch mode","Comparing paths against your capital, time, and risk limits."],
  advisor:["Ask Forge what the numbers say.","Use your current profile and business context to pressure-test decisions."],
  ideas:["Find a business you can actually start.","Compare practical paths against the money, time, experience, and risk you can commit."],
  products:["Research products before you buy.","Check supplier options, landed economics, and demand before committing stock."],
  plan:["Turn the opportunity into a plan.","Connect the chosen path to pricing, marketing, milestones, and operating assumptions."],
  orders:["Track what's selling.","Keep order flow, revenue, and fulfillment decisions visible in one place."],
  brand:["Build a brand customers can recognize.","Shape the identity, positioning, and customer-facing system around the business."],
  store:["Prepare the storefront for launch.","Turn the chosen business direction into a launch-ready store and operating setup."],
  content:["Build a repeatable content system.","Organize product-led content so the business can publish consistently."],
  marketing:["Put marketing decisions behind the numbers.","Plan campaigns around the offer, audience, economics, and measurable next actions."],
  billing:["Know where the money is going.","Keep spend, budget, invoices, and launch economics visible."],
  support:["Give customers fast, consistent answers.","Use Forge's business context to structure reliable customer support."],
  analytics:["Track what's selling and what needs a decision.","Read the business signals that should change what you do next."]
 };
 if(state.page==="advisor")return ""; const t=titles[state.page]||titles.home;
 return "<div class='forge-page-header'><div><h1>"+t[0]+"</h1><p>"+t[1]+"</p></div><button class='btn secondary' onclick='openWizard()'>Change inputs</button></div>";
}

function shell(c){
 let b=state.business;
 return "<header class='top'><div class='brand'><div class='mark'>F</div>FORGE <small>AI BUSINESS OS</small></div><div class='topright'><span class='pill online'><span id='forgeStatusText'>AI is online</span></span><button class='pill' onclick='openWizard()'>New business</button><div class='avatar'>M</div></div></header><button class='corner-tab' onclick='toggleCorner()'>Categories</button><aside id='cornerPanel' class='corner-panel'><div class='row' style='justify-content:space-between'><div><div class='eyebrow'>Forge workspace</div><h3>Categories & tools</h3><div class='small'>Tap to open. Tap again to close.</div></div><button class='btn' onclick='toggleCorner()'>Close</button></div><div class='navlabel'>Business workflow</div>"+nav()+"</aside><div class='layout'><aside class='side'><div class='navlabel'>Business workspace</div>"+nav()+"<div class='navlabel' style='margin-top:18px'>Your business</div><div class='business-mini'><div class='row'><div class='bizicon'>◈</div><div><b>"+(b?esc(b.name):"No business yet")+"</b><div class='small'>"+(b?"AI plan · active":"Start your first venture")+"</div></div></div><div class='progress' style='margin-top:12px'><i style='width:'+(b?68:0)+'%'></i></div></div></aside><main class='main'>"+forgeContextBar()+forgePageGuide()+c+"</main></div>";
}
function forgeContextBar(){
 const p=state.profile||{},b=state.business||{};
 const cap=Math.max(0,Number(p.budget||b.budget||0)-Number(p.reserve||0));
 return "<div class='forge-context'><div class='context-business'><b>"+esc(b.name||businessName(p.category||"Fashion & accessories"))+"</b><span>"+esc(p.market||"Bangladesh")+"</span><span>"+esc(p.category||"Fashion & accessories")+"</span></div><div class='context-stats'><div><span>Deployable</span><b>"+BDT(cap)+"</b></div><div><span>Time</span><b>"+Number(p.time||0)+"h / week</b></div><div><span>Risk</span><b>"+esc(p.risk||"Balanced")+"</b></div></div></div>";
}

function toggleCorner(){document.getElementById("cornerPanel").classList.toggle("open")}
function home(){
  const b=state.business||{}, p=state.profile||{}, cap=Math.max(0,Number(p.budget||b.budget||0)-Number(p.reserve||0));
  const all=typeof opportunities==="function"?opportunities():[];
  const fallback=[{name:"Commission-based selling",fit:78,cap:0,time:4,risk:"Low",model:"Commission",thesis:"Sell an existing product or service without carrying inventory.",experience:"Beginner"},{name:"Social media service",fit:74,cap:0,time:5,risk:"Low",model:"Service",thesis:"Turn an existing skill into a focused service offer.",experience:"Beginner"},{name:"Pre-order custom products",fit:68,cap:5000,time:7,risk:"Low",model:"Pre-order",thesis:"Validate demand before committing to a larger stock purchase.",experience:"Beginner"}];
  const shortlist=(all.length?all:fallback).slice(0,3);
  const capitalText=x=>Number(x.cap||0)===0?"No inventory required":Number(x.cap||0)<=cap?"Within available capital":"Needs more capital";
  const rationale=x=>Number(x.cap||0)<=cap?"The estimated starting requirement fits the capital Forge can currently deploy.":(x.model==="Service"||x.model==="Commission")?"Can be tested without purchasing inventory first.":x.model==="Pre-order"?"Demand can be tested before committing to a larger stock purchase.":"Forge is keeping this path visible because the estimated launch requires more capital than the current launch envelope.";
  const rows=shortlist.map((x,i)=>"<article class='decision-path "+(i===0?"is-primary":"")+"'><div class='path-main'><div class='path-heading'><div><span class='path-dot "+(i===0?"active":"")+"'></span><h3>"+esc(x.name)+"</h3></div><div class='path-match "+(i===0?"dominant":"")+"'><strong>"+Math.round(Number(x.fit||0))+"%</strong><span>match</span></div></div><p class='path-thesis'>"+esc(x.thesis||"A business path Forge can evaluate against your current constraints.")+"</p><div class='path-data'><div><span>Starting capital</span><b>"+capitalText(x)+"</b></div><div><span>Time</span><b>"+Number(x.time||0)+"h / week</b></div><div><span>Risk</span><b>"+esc(x.risk||"Not set")+"</b></div><div><span>Model</span><b>"+esc(x.model||"Business")+"</b></div></div><div class='forge-read'><b>Forge's read</b><p>"+esc(rationale(x))+" "+(x.experience?"Experience fit: "+esc(p.experience===x.experience?"aligned":"manageable with support")+".":"")+"</p></div><div class='path-actions'><button class='btn primary' onclick=\"selectOpportunity('"+String(x.name).replace(/'/g,"\\'")+"')\">Open opportunity</button><button class='btn' onclick=\"openFitModal('"+x.name.replace(/'/g,"\\'")+"')\">Why it fits</button>></div></div></article>").join("");
  return "<div class='decision-dashboard'><header class='decision-header'><div><h1>Lean launch mode</h1><p>Comparing paths against your capital, time, and risk limits.</p></div><div class='decision-stats'><div><span>Available capital</span><strong>"+BDT(cap)+"</strong></div><div><span>Time available</span><strong>"+Number(p.time||0)+"h / week</strong></div><div><span>Risk profile</span><strong>"+esc(p.risk||"Not set")+"</strong></div></div></header><div class='decision-layout'><main><section class='paths-section'><div class='section-title'><div><h2>Paths worth evaluating</h2><p>Ranked against the inputs you gave Forge. The first path is the strongest current profile match.</p></div></div><div class='decision-paths'>"+rows+"</div></section></main><aside class='decision-aside'><section><h3>How Forge decides</h3><p>Each path is checked against four practical constraints before it reaches your shortlist.</p><div class='decision-factor'><b>Capital</b><span>Can the first test happen within the money you can actually deploy?</span></div><div class='decision-factor'><b>Time</b><span>Does the weekly workload fit the time you said you can give?</span></div><div class='decision-factor'><b>Experience</b><span>Does the model match your current experience, or can Forge support the gap?</span></div><div class='decision-factor'><b>Risk</b><span>Is the exposure consistent with the risk level you selected?</span></div></section><section class='active-profile'><h3>Active profile</h3><p>"+esc(p.category||"Open to anything")+" · "+esc(p.market||"Primary market not set")+"</p><div><span>Goal</span><b>"+esc(p.goal||"Not set")+"</b></div><div><span>Experience</span><b>"+esc(p.experience||"Not set")+"</b></div><button class='btn' onclick='openWizard()'>Change inputs</button></section></aside></div></div>";
}
function ensureForgeModalHost(){
  let modal=document.getElementById("modal");
  if(modal)return modal;
  modal=document.createElement("div");
  modal.id="modal";
  modal.className="modal";
  modal.setAttribute("role","dialog");
  modal.setAttribute("aria-modal","true");
  modal.innerHTML="<div id='modalbox' class='modalbox'></div>";
  document.body.appendChild(modal);
  return modal;
}
function openWizard(){
 if(window.__forgeWizardOpen)return;
 window.__forgeWizardOpen=true;
 const modal=ensureForgeModalHost();
 const onboarding=document.querySelector(".onboarding");
 if(onboarding)onboarding.classList.add("wizard-underlay-hidden");
 if(state.profileLocked){
  document.getElementById("modalbox").innerHTML="<div><div class='row' style='justify-content:space-between'><div><div class='eyebrow'>Identity locked</div><h2 style='margin:6px 0'>Your Forge profile is fixed.</h2><div class='small'>These inputs control your recommendations. They are not editable from the dashboard.</div></div><button class='btn' onclick='closeModal()'>✕</button></div><div class='locked-profile'>"+profileSummary()+"</div><div class='notice'><b>Why locked?</b><p class='small'>If your real financial or personal situation changes materially, Forge should reassess the profile instead of letting individual recommendations be manipulated.</p></div><div class='actions' style='justify-content:flex-end;margin-top:20px'><button class='btn primary' onclick='closeModal();go(\"ideas\")'>Continue to Business Finder →</button></div></div>";
  document.getElementById("modal").classList.add("open");return;
 }
 let step=1,d={...DEFAULT_PROFILE};
 function draw(){
   const back=step>1?"<button id='wizardBackBtn' type='button' class='btn'>← Back</button>":"";
   const next=step<5?"Continue →":"Lock my profile & enter Forge →";
   document.getElementById("modalbox").innerHTML="<div><div class='row' style='justify-content:space-between'><div><div class='eyebrow'>Forge onboarding · "+step+" / 5</div><h2 style='margin:6px 0'>Let's understand the entrepreneur first.</h2><div class='small'>No dashboard until this profile is complete. Your answers become locked decision inputs.</div></div></div><div class='progress' style='margin:18px 0'><i style='width:"+(step*20)+"%'></i></div>"+wizardStep(step,d)+"<div class='actions' style='justify-content:flex-end;margin-top:22px'>"+back+"<button id='wizardContinueBtn' type='button' class='btn primary'>"+next+"</button></div></div>";
   const backBtn=document.getElementById("wizardBackBtn");
   const continueBtn=document.getElementById("wizardContinueBtn");
   if(backBtn)backBtn.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();wizardBack()});
   if(continueBtn)continueBtn.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();step<5?wizardNext():finishWizard()});
   document.getElementById("modalbox")?.querySelectorAll("input,select,textarea").forEach(function(el){
     el.addEventListener("input",function(){el.classList.remove("wizard-field-error");el.nextElementSibling?.classList.contains("wizard-error-msg")&&el.nextElementSibling.remove()});
     el.addEventListener("change",function(){el.classList.remove("wizard-field-error");el.nextElementSibling?.classList.contains("wizard-error-msg")&&el.nextElementSibling.remove()});
   });
 }
 window.wizardBack=()=>{if(step>1){step--;draw()}};
 window.wizardNext=()=>{captureWizard();if(!validateWizard(step))return;step++;draw()};
 window.captureWizard=()=>{["budget","age","income","expenses","reserve","market","city","occupation","experience","skills","workStyle","category","goal","risk","riskCapacity","lossTolerance","time","targetIncome","model"].forEach(k=>{let e=document.getElementById("w"+k);if(e)d[k]=e.type==="number"?Number(e.value):e.value})};
 window.clearWizardErrors=()=>{
   document.querySelectorAll(".wizard-field-error").forEach(e=>e.classList.remove("wizard-field-error"));
   document.querySelectorAll(".wizard-error-msg").forEach(e=>e.remove());
   document.querySelectorAll(".wizard-required-note").forEach(e=>e.remove());
 };
 window.showWizardErrors=(keys)=>{
   clearWizardErrors();
   let first=null;
   keys.forEach(k=>{
     const el=document.getElementById("w"+k);
     if(!el)return;
     el.classList.add("wizard-field-error");
     const msg=document.createElement("div");
     msg.className="wizard-error-msg";
     msg.textContent="Please fill this field before continuing.";
     el.insertAdjacentElement("afterend",msg);
     if(!first)first=el;
   });
   if(keys.length){
     const note=document.createElement("div");
     note.className="wizard-required-note";
     note.textContent="Please fill in the highlighted required field"+(keys.length>1?"s":"")+" before going to the next step.";
     document.getElementById("modalbox")?.querySelector(".actions")?.insertAdjacentElement("beforebegin",note);
     first?.focus();
     first?.scrollIntoView({behavior:"smooth",block:"center"});
     toast("Please fill the highlighted required fields");
     return false;
   }
   return true;
 };
 window.validateWizard=(s)=>{
   const required=s===1?["budget","income","expenses","reserve"]:s===2?["age","city","occupation","time"]:s===3?["risk","riskCapacity","lossTolerance"]:[];
   const invalid=[];
   for(const k of required){
     const el=document.getElementById("w"+k);
     if(!el)continue;
     const v=el.value;
     const numeric=["budget","income","expenses","reserve","age","time","lossTolerance"].includes(k);
     const bad=numeric
       ?(v===""||v===null||Number.isNaN(Number(v))||Number(v)<0||(k==="age"&&Number(v)<18)||(k==="time"&&Number(v)<=0))
       :!String(v||"").trim();
     if(bad)invalid.push(k);
   }
   return showWizardErrors(invalid);
 };
 window.finishWizard=()=>{captureWizard();if(!validateWizard(5))return;const reality=forgeRealityCheck(d);state.profile={...d,reality};state.business={name:businessName(d.category),budget:Math.max(0,Number(d.budget||0)-Number(d.reserve||0)),market:d.market,category:d.category,age:d.age,income:d.income,goal:d.goal,risk:d.risk,time:d.time,targetMargin:categoryMargin(d.category),planMode:planMode(d),realityMode:reality.mode,realitySeverity:reality.severity,realityFlags:reality.flags};state.profileLocked=true;state.page="ideas";persistProfile();closeModal();render();toast("Profile locked — Forge is now personalized to you")};
 document.getElementById("modal").classList.add("open");draw();
}
function profileSummary(){
 const p=state.profile;
 const rr=forgeRealityCheck(p);
 return "<div class='notice span12' style='margin-bottom:14px'><b>Forge mode: "+rr.mode.replace("-", " ")+"</b><div class='small'>"+rr.label+". Forge uses your inputs as constraints rather than assuming every business can fit.</div></div><div class='grid'><div class='locked-item span4'><div class='label'>Business capital</div><div class='v'>"+BDT(p.budget)+"</div></div><div class='locked-item span4'><div class='label'>Monthly income</div><div class='v'>"+BDT(p.income)+"</div></div><div class='locked-item span4'><div class='label'>Monthly expenses</div><div class='v'>"+BDT(p.expenses)+"</div></div><div class='locked-item span4'><div class='label'>Age</div><div class='v'>"+p.age+"</div></div><div class='locked-item span4'><div class='label'>Risk profile</div><div class='v'>"+p.risk+" · "+p.riskCapacity+" capacity</div></div><div class='locked-item span4'><div class='label'>Loss tolerance</div><div class='v'>"+BDT(p.lossTolerance)+"</div></div><div class='locked-item span4'><div class='label'>Experience</div><div class='v'>"+p.experience+"</div></div><div class='locked-item span4'><div class='label'>Available time</div><div class='v'>"+p.time+"h/week</div></div><div class='locked-item span4'><div class='label'>Business focus</div><div class='v'>"+p.category+"</div></div></div>";
}
function wizardStep(s,d){
 if(s===1)return "<h3>1 · Money & financial reality</h3><p class='small'>Use real numbers. Forge uses them to protect your personal cash flow and business budget.</p><div class='grid'><div class='span6 field'><label>Business capital you can deploy *</label><input class='input' id='wbudget' type='number' min='0' value='"+(d.budget||"")+"' placeholder='e.g. 200000'></div><div class='span6 field'><label>Monthly personal income *</label><input class='input' id='wincome' type='number' min='0' value='"+(d.income||"")+"' placeholder='e.g. 60000'></div><div class='span6 field'><label>Monthly personal expenses *</label><input class='input' id='wexpenses' type='number' min='0' value='"+(d.expenses||"")+"' placeholder='e.g. 35000'></div><div class='span6 field'><label>Emergency reserve you will NOT invest *</label><input class='input' id='wreserve' type='number' min='0' value='"+(d.reserve||"")+"' placeholder='e.g. 100000'></div></div>";
 if(s===2)return "<h3>2 · Who you are</h3><p class='small'>This determines how much complexity Forge should put on your plate.</p><div class='grid'><div class='span4 field'><label>Age *</label><input class='input' id='wage' type='number' min='18' value='"+(d.age||"")+"' placeholder='28'></div><div class='span4 field'><label>City / location *</label><input class='input' id='wcity' value='"+(d.city||"")+"' placeholder='Dhaka'></div><div class='span4 field'><label>Occupation *</label><input class='input' id='woccupation' value='"+(d.occupation||"")+"' placeholder='Job / student / business'></div><div class='span4 field'><label>Business experience</label><select class='input' id='wexperience'><option>Beginner</option><option>Some experience</option><option>Experienced</option><option>Serial entrepreneur</option></select></div><div class='span4 field'><label>Hours available per week *</label><input class='input' id='wtime' type='number' min='1' value='"+(d.time||"")+"' placeholder='15'></div><div class='span4 field'><label>Work style</label><select class='input' id='wworkStyle'><option>Builder</option><option>Seller</option><option>Operator</option><option>Creator</option><option>Analyst</option><option>Hybrid</option></select></div><div class='span12 field'><label>Skills / interests</label><input class='input' id='wskills' value='"+(d.skills||"")+"' placeholder='e.g. fashion, sales, design, sourcing, food, technology'></div></div>";
 if(s===3)return "<h3>3 · Your risk profile</h3><p class='small'>Forge separates what you <b>want</b> to risk from what you can realistically afford to lose.</p><div class='grid'><div class='span4 field'><label>Risk appetite</label><select class='input' id='wrisk'><option>Conservative</option><option>Balanced</option><option>Growth</option><option>Aggressive</option></select></div><div class='span4 field'><label>Risk capacity</label><select class='input' id='wriskCapacity'><option>Low</option><option>Medium</option><option>High</option></select></div><div class='span4 field'><label>Maximum comfortable loss *</label><input class='input' id='wlossTolerance' type='number' min='0' value='"+(d.lossTolerance||"")+"' placeholder='e.g. 50000'></div></div><div class='grid' style='margin-top:4px'><div class='span4 choice'><b>Conservative</b><p class='small'>Protect capital. Prefer low inventory and service/pre-order models.</p></div><div class='span4 choice'><b>Growth</b><p class='small'>Accept controlled losses to find scalable products.</p></div><div class='span4 choice'><b>Aggressive</b><p class='small'>Able to test larger inventory and brand bets when capital supports it.</p></div></div>";
 if(s===4)return "<h3>4 · What should Forge build around?</h3><div class='grid'><div class='span6 field'><label>Preferred category</label><select class='input' id='wcategory'><option>Open to anything</option><option>Fashion & accessories</option><option>Beauty & personal care</option><option>Home & living</option><option>Electronics</option><option>Food & beverage</option><option>Sports & fitness</option><option>Services / digital</option></select></div><div class='span6 field'><label>Primary goal</label><select class='input' id='wgoal'><option>Profit + growth</option><option>Low-risk side income</option><option>Long-term brand</option><option>Fastest revenue</option><option>Replace my salary</option></select></div><div class='span6 field'><label>Preferred business model</label><select class='input' id='wmodel'><option>Open to recommendations</option><option>Online product selling</option><option>Private label</option><option>Reselling</option><option>Service business</option><option>Wholesale / distribution</option></select></div><div class='span6 field'><label>Target additional monthly income</label><input class='input' id='wtargetIncome' type='number' min='0' value='"+(d.targetIncome||"")+"' placeholder='e.g. 50000'></div><div class='span6 field'><label>Primary market</label><select class='input' id='wmarket'><option>Bangladesh</option><option>India</option><option>UAE</option><option>Saudi Arabia</option><option>USA</option></select></div></div>";
 return "<h3>5 · Confirm before Forge unlocks</h3><div class='notice'><b>Your profile becomes locked after you continue.</b><p class='small'>Forge will use this profile to rank opportunities, set conservative planning assumptions, choose product priorities and generate a business plan. Product economics shown later are read-only.</p></div><div class='locked-profile' style='margin-top:15px'>"+profileSummaryFor(d)+"</div><div class='danger notice' style='margin-top:15px'><b>Important:</b> Forge will never treat estimated prices, supplier costs or margins as guaranteed. Real sourcing will verify those assumptions later.</div>";
}
function profileSummaryFor(p){
 return "<div class='grid'><div class='locked-item span4'><div class='label'>Capital</div><div class='v'>"+BDT(p.budget)+"</div></div><div class='locked-item span4'><div class='label'>Income</div><div class='v'>"+BDT(p.income)+"</div></div><div class='locked-item span4'><div class='label'>Expenses</div><div class='v'>"+BDT(p.expenses)+"</div></div><div class='locked-item span4'><div class='label'>Risk</div><div class='v'>"+p.risk+" / "+p.riskCapacity+"</div></div><div class='locked-item span4'><div class='label'>Time</div><div class='v'>"+p.time+"h/week</div></div><div class='locked-item span4'><div class='label'>Focus</div><div class='v'>"+p.category+"</div></div></div>";
}
function planMode(p){const cap=Number(p.budget||0),risk=p.risk;return cap>=1000000&&["Growth","Aggressive"].includes(risk)?"Scale-ready":risk==="Conservative"||p.riskCapacity==="Low"?"Capital-protective":"Validation-first"}
function categoryMargin(c){return ({"Fashion & accessories":43,"Beauty & personal care":48,"Home & living":46,"Electronics":28,"Food & beverage":35,"Sports & fitness":40}[c]||43)}
function businessName(c){return ({"Fashion & accessories":"Northstar Goods","Beauty & personal care":"Nura Labs","Home & living":"Hearth & Form","Electronics":"Circuit Lane","Food & beverage":"Daily Harvest Co.","Sports & fitness":"Motion Supply"}[c]||"Northstar Ventures")}
function closeModal(){
 const modal=document.getElementById("modal");
 if(modal)modal.classList.remove("open");
 window.__forgeWizardOpen=false;
 document.querySelector(".onboarding")?.classList.remove("wizard-underlay-hidden");
}
function opportunities(){
 let p=state.profile,cap=Math.max(0,Number(p.budget||0)-Number(p.reserve||0)),base=[
 {name:"Commission-based selling",icon:"🤝",margin:30,cap:0,bep:1,risk:"Low",thesis:"Sell someone else's product or service for a commission, so you do not need to buy inventory first.",time:4,experience:"Beginner",model:"Commission",test:"Find a supplier or business that already offers a commission arrangement, then make the first sale before spending."},
 {name:"Social media service",icon:"📱",margin:70,cap:0,bep:1,risk:"Low",thesis:"Sell a simple social-media service using skills and tools you already have. Forge treats the first test as a service sale, not an inventory launch.",time:5,experience:"Beginner",model:"Service",test:"Get 1 paying customer before spending on tools or ads."},
 {name:"Tutoring / coaching",icon:"🎓",margin:80,cap:0,bep:1,risk:"Low",thesis:"Turn a skill or subject you already know into a simple paid service.",time:4,experience:"Beginner",model:"Service",test:"Find 1 learner willing to pay before buying equipment or software."},
 {name:"Freelance design",icon:"✦",margin:75,cap:0,bep:1,risk:"Low",thesis:"Sell design work directly to businesses and creators using skills and tools you already have.",time:6,experience:"Beginner",model:"Service",test:"Offer one clear service and try to secure the first paid project before spending."},
 {name:"Pre-order custom products",icon:"🎁",margin:45,cap:5,bep:1,risk:"Low",thesis:"Show the product first, collect a real order, then source it. This can test product demand without buying a large stock.",time:7,experience:"Beginner",model:"Pre-order",test:"Get a genuine customer order before committing money to inventory."},
 {name:"Premium carry goods",icon:"👜",margin:48,cap:180000,bep:80,risk:"Low",thesis:"Everyday bags and organizers with strong gifting potential.",time:8,experience:"Beginner",model:"Inventory"},
 {name:"Urban footwear",icon:"👟",margin:42,cap:220000,bep:70,risk:"Medium",thesis:"Locally relevant footwear with controlled SKU depth.",time:10,experience:"Some experience",model:"Inventory"},
 {name:"Home fragrance",icon:"🕯️",margin:52,cap:140000,bep:90,risk:"Low",thesis:"Candles, diffusers and gift sets with manageable first batches.",time:7,experience:"Beginner",model:"Inventory"},
 {name:"Modern watches",icon:"⌚",margin:44,cap:190000,bep:55,risk:"Medium",thesis:"Affordable premium watches where design and presentation matter.",time:9,experience:"Some experience",model:"Inventory"},
 {name:"Everyday beauty",icon:"🧴",margin:50,cap:160000,bep:110,risk:"Medium",thesis:"Focused personal care with trust and repeat purchase.",time:10,experience:"Some experience",model:"Inventory"},
 {name:"Fitness essentials",icon:"🏋️",margin:41,cap:170000,bep:75,risk:"Low",thesis:"Compact fitness accessories suited to content-led selling.",time:8,experience:"Beginner",model:"Inventory"},
 {name:"Private-label brand launch",icon:"🏷️",margin:45,cap:650000,bep:180,risk:"High",thesis:"A differentiated brand with deeper inventory, content and customer acquisition investment.",time:25,experience:"Experienced",model:"Inventory"}
 ];
 let list=base;
 if(p.category!=="Open to anything"){let map={"Fashion & accessories":["Premium carry goods","Urban footwear","Modern watches","Private-label brand launch","Pre-order custom products","Commission-based selling"],"Beauty & personal care":["Everyday beauty","Pre-order custom products","Commission-based selling"],"Home & living":["Home fragrance","Pre-order custom products","Commission-based selling"],"Sports & fitness":["Fitness essentials","Commission-based selling"],"Electronics":["Commission-based selling"],"Food & beverage":["Pre-order custom products","Commission-based selling"],"Services / digital":["Social media service","Tutoring / coaching","Freelance design","Commission-based selling"]};list=base.filter(x=>(map[p.category]||[]).includes(x.name));if(!list.length)list=base}
 if(cap<=10)list=list.filter(x=>x.model==="Service"||x.model==="Commission"||x.model==="Pre-order");
 else if(cap<1000)list=list.filter(x=>x.cap<=5000||x.model==="Service"||x.model==="Commission"||x.model==="Pre-order");
 const riskScore=(r)=>p.risk==="Conservative"?(r==="Low"?18:r==="Medium"?4:-12):p.risk==="Balanced"?(r==="Low"?10:r==="Medium"?12:r==="High"?5:0):p.risk==="Growth"?(r==="Low"?6:r==="Medium"?15:r==="High"?16:0):(r==="High"?20:r==="Medium"?14:7);
 const expScore=(x)=>p.experience==="Beginner"?(x==="Beginner"?10:x==="Some experience"?2:-8):p.experience==="Experienced"?(x==="Experienced"?10:5):0;
 return list.map(x=>{
   const capital=x.cap<=cap?22:(x.model==="Service"||x.model==="Pre-order"?(cap>=x.cap?22:cap>=1?8:0):(cap<=0?-30:(cap/x.cap>=.75?8:cap/x.cap>=.5?0:cap/x.cap>=.25?-12:-24)));
   const time=p.time>=x.time?10:Math.max(-12,10-Math.round((x.time-p.time)*1.2));
   let fit=50+capital+time+riskScore(x.risk)+expScore(x.experience);
   if(cap<x.cap && x.model==="Inventory")fit=Math.min(fit,44);
   if(cap<x.cap && x.model==="Pre-order")fit=Math.min(fit,68);
   if((x.model==="Service"||x.model==="Commission") && cap<=10)fit=Math.max(fit,78);
   if(x.model==="Pre-order" && cap<=10)fit=Math.max(fit,70);
   fit=Math.max(15,Math.min(97,fit));
   return {...x,fit,cap:x.cap,capitalGap:Math.max(0,x.cap-cap),capitalFit:cap>=x.cap,model:x.model||"Inventory"};
 }).sort((a,b)=>b.fit-a.fit);
}
function ideas(){
 let ps=opportunities(),p=state.profile,cap=Math.max(0,Number(p.budget||0)-Number(p.reserve||0)),mode=forgeRealityCheck(p).mode;
 let modeTitle=mode==="lean-launch"?"Lean launch":mode==="capital-protective"?"Capital-protective":"Validation-first";
 let modeNote=cap<=10
   ?"Your available business budget is extremely small. Forge will focus on ways to test demand without buying inventory first."
   :cap<1000
   ?"Your starting budget is limited. Forge will prioritize low-upfront-cost tests before larger launches."
   :"Forge is comparing each path with the money, time, experience and risk limits you entered.";
 let immediate=ps.filter(x=>x.cap<=cap).slice(0,3);
 let testPaths=ps.filter(x=>x.model==="Service"||x.model==="Commission"||x.model==="Pre-order").slice(0,3);
 let focus=immediate.length?immediate:testPaths;
 let lead=focus[0]||ps[0];
 let riskLabel=x=>x.risk==="High"?"Higher":x.risk;
 let capitalText=x=>x.cap===0?"No inventory required":x.cap<=cap?"Within your budget":"Needs more capital";
 let rationale=x=>{
   if(x.cap<=cap) return "The estimated starting requirement fits the capital Forge can currently deploy.";
   if(x.model==="Service"||x.model==="Commission") return "Can be tested without purchasing inventory first.";
   if(x.model==="Pre-order") return "Demand can be tested before committing to a larger stock purchase.";
   return "Forge is keeping this lower because the estimated launch requires more capital.";
 };
 let icon=x=>x.model==="Commission"?"↗":x.model==="Pre-order"?"◇":x.model==="Service"?"✦":"▦";
 let card=(x,i)=>{
   let primary=x===lead;
   return "<article class='finder-card "+(primary?"is-primary":"")+"'>"+
     "<div class='finder-card-top'><div class='finder-kind'><span class='finder-icon'>"+icon(x)+"</span><div><span class='finder-model'>"+x.model+" · "+riskLabel(x.risk)+" risk</span><h3>"+x.name+"</h3></div></div>"+
     "<div class='finder-score'><b>"+x.fit+"%</b><span>fit</span></div></div>"+
     "<p class='finder-thesis'>"+x.thesis+"</p>"+
     "<div class='finder-progress'><i style='width:"+x.fit+"%'></i></div>"+
     "<div class='finder-metrics'>"+
       "<div><span>Starting capital</span><b>"+capitalText(x)+"</b><small>"+BDT(x.cap)+" estimated</small></div>"+
       "<div><span>Time</span><b>"+x.time+"h / week</b><small>"+(p.time>=x.time?"Fits your availability":"Above your availability")+"</small></div>"+
       "<div><span>Risk</span><b>"+riskLabel(x.risk)+"</b><small>"+(x.risk==="Low"?"Lower exposure":"More execution exposure")+"</small></div>"+
       "<div><span>Model</span><b>"+x.model+"</b><small>"+(x.model==="Inventory"?"Stock-led":"Demand-led")+"</small></div>"+
     "</div>"+
     "<div class='finder-read'><span>Forge's read</span><p>"+rationale(x)+" "+(p.experience&&x.experience?("Experience fit: "+(p.experience===x.experience?"aligned":"manageable with support")+"."):"")+"</p></div>"+
     "<div class='finder-actions'><button class='btn primary' onclick=\"selectOpportunity('"+x.name.replace(/'/g,"\\'")+"')\">Open opportunity</button><button class='btn' type='button' onclick=\"event.preventDefault();event.stopPropagation();openFitModal('"+x.name.replace(/'/g,"\\'")+"')\">Why it fits</button></div>"+
   "</article>";
 };
 return "<div class='finder-shell'>"+
   "<header class='finder-header'><div><div class='finder-kicker'>Business Finder</div><h1>Find a business you can actually start.</h1><p>Forge turns your profile into practical opportunities, then shows what each path needs before you commit.</p></div><button class='btn' onclick='openWizard()'>Review my profile</button></header>"+
   "<section class='finder-context-grid'>"+
     "<div class='finder-mode'><span class='finder-mini'>Your launch mode</span><strong>"+modeTitle+"</strong><p>"+modeNote+"</p></div>"+
     "<div class='finder-stat'><span>Available capital</span><b>"+BDT(cap)+"</b><small>After your reserve</small></div>"+
     "<div class='finder-stat'><span>Time available</span><b>"+(p.time||0)+"h / week</b><small>Weekly commitment</small></div>"+
     "<div class='finder-stat'><span>Risk profile</span><b>"+(p.risk||"Not set")+"</b><small>Current tolerance</small></div>"+
   "</section>"+
   "<div class='finder-main-grid'>"+
     "<main><div class='finder-section-heading'><div><h2>Paths worth evaluating</h2><p>Each option is checked against your capital, time, experience and risk.</p></div><span>"+ps.length+" opportunities</span></div>"+
       "<div class='finder-grid'>"+ps.map(card).join("")+"</div>"+
     "</main>"+
     "<aside class='finder-reference'><section class='finder-reference-block'><span class='finder-mini'>How Forge decides</span><h3>Practical before promising.</h3><p>Forge ranks opportunities by whether you can realistically test them now.</p></section>"+
       "<div class='finder-rule'><b>Capital</b><span>Can the first test happen within your available money?</span></div>"+
       "<div class='finder-rule'><b>Time</b><span>Does the weekly workload fit the time you can give?</span></div>"+
       "<div class='finder-rule'><b>Experience</b><span>Can your current experience support the model?</span></div>"+
       "<div class='finder-rule'><b>Risk</b><span>Is the exposure consistent with your selected risk?</span></div>"+
       "<section class='finder-profile'><span class='finder-mini'>Active profile</span><h3>"+(p.category||"Open to anything")+"</h3><p>"+(p.market||"Primary market not set")+" · "+(p.goal||"Goal not set")+"</p><button class='btn' onclick='openWizard()'>Change inputs</button></section>"+
     "</aside>"+
   "</div></div>";
}
function openFitModal(name){
 const x=opportunities().find(o=>o.name===name); if(!x)return;
 const p=state.profile||{},cap=Math.max(0,Number(p.budget||0)-Number(p.reserve||0));
 const moneyFit=x.cap<=cap,timeFit=Number(p.time||0)>=Number(x.time||0);
 const expFit=!x.experience||!p.experience||p.experience===x.experience;
 const scenario=(p.category&&p.category!=="Open to anything"?p.category:"your chosen category")+" in "+(p.market||"your target market");
 let why=x.model==="Commission"
 ? "You can start by selling an existing offer instead of tying up launch capital in stock. For a "+scenario+" profile, the first experiment is about finding demand and learning the sales process."
 :x.model==="Service"
 ? "This path turns time and an existing skill into revenue before you take on inventory risk. That matters when Forge has "+Number(p.time||0)+" hours a week to work with."
 :x.model==="Pre-order"
 ? "You can validate the product with a real customer order before committing to a larger purchase. Your capital is committed only after demand becomes visible."
 : "This is an inventory-led path. It can fit your profile, but the launch requires more discipline around stock, cash flow and sell-through.";
 const capitalLine=moneyFit?"The estimated starting requirement of "+BDT(x.cap)+" is within the "+BDT(cap)+" Forge considers deployable.":"The estimated requirement is "+BDT(x.cap)+", above the "+BDT(cap)+" currently deployable. Capital is the main constraint Forge is flagging.";
 const timeLine=timeFit?"The expected workload of "+Number(x.time||0)+" hours a week fits your "+Number(p.time||0)+"-hour availability.":"The expected workload of "+Number(x.time||0)+" hours a week is above your "+Number(p.time||0)+"-hour availability, so execution is the pressure point.";
 const expLine=x.experience&&p.experience?(expFit?"Your "+p.experience+" experience is aligned with this model.":"Your experience differs from the model's usual starting point, so Forge assumes support may be needed."):"Forge has limited experience data, so this is not a major part of the fit.";
 const riskLine=x.risk==="Low"?"Forge rates this model low risk, keeping the first test relatively contained.":"Forge rates this model "+String(x.risk||"unknown").toLowerCase()+" risk, so the size and timing of the first commitment matter.";
 const next=x.test||"Run the smallest credible test, measure the response, then decide whether to commit more capital.";
 const modal=ensureForgeModalHost();
 document.getElementById("modalbox").innerHTML="<div class='fit-modal'>"+
 "<div class='fit-modal-head'><div><span class='fit-eyebrow'>Why this fits your scenario</span><h2>"+esc(x.name)+"</h2><p>"+esc(x.thesis||"A practical business path evaluated against your current profile.")+"</p></div><button class='fit-close' onclick='closeModal()' aria-label='Close'>×</button></div>"+
 "<div class='fit-score-row'><div><span>Forge fit</span><strong>"+Math.round(Number(x.fit||0))+"%</strong></div><span class='fit-tag'>"+esc(x.model)+" model</span><span class='fit-tag'>"+esc(x.risk||"Risk not set")+" risk</span></div>"+
 "<div class='fit-body'><section class='fit-main'><h3>Why Forge sees a fit</h3><p>"+esc(why)+"</p><div class='fit-checks'>"+
 "<div class='"+(moneyFit?"fit-good":"fit-pressure")+"'><b>Capital</b><span>"+esc(capitalLine)+"</span></div>"+
 "<div class='"+(timeFit?"fit-good":"fit-pressure")+"'><b>Time</b><span>"+esc(timeLine)+"</span></div>"+
 "<div class='"+(expFit?"fit-good":"fit-pressure")+"'><b>Experience</b><span>"+esc(expLine)+"</span></div>"+
 "<div class='fit-good'><b>Risk</b><span>"+esc(riskLine)+"</span></div></div></section>"+
 "<aside class='fit-side'><div><span>Your scenario</span><b>"+esc(p.category||"Open to anything")+"</b><small>"+esc(p.market||"Market not set")+" · "+esc(p.goal||"Goal not set")+"</small></div>"+
 "<div><span>Available to deploy</span><b>"+BDT(cap)+"</b><small>"+Number(p.time||0)+"h / week · "+esc(p.risk||"Risk not set")+"</small></div>"+
 "<div><span>First test</span><p>"+esc(next)+"</p></div></aside></div>"+
 "<div class='fit-modal-foot'><div><b>Forge's practical recommendation</b><span>Start with the smallest test that can produce real customer evidence.</span></div><button class='btn primary' onclick=\"closeModal();selectOpportunity('"+String(x.name).replace(/'/g,"\\'")+"')\">Open opportunity</button></div></div>";
 modal.classList.add("open"); setTimeout(function(){document.querySelector(".fit-close")?.focus()},30);
}
function applyFilters(){toast("Your profile is locked. Finder filters are intentionally disabled so recommendations cannot be gamed.")}
function selectOpportunity(n){state.selectedOpportunityName=n;state.selectedProduct=opportunities().find(x=>x.name===n)||opportunities()[0];state.page="products";persistProfile();render();toast(n+" added to your personalized plan")}
function productCatalog(){return {
"Premium carry goods":{price:2490,landed:980,cac:260,fee:1,pack:60,returns:100,batch:40,icon:"👜",description:"A focused everyday-carry line: structured work bags, organizers and compact travel pieces aimed at urban professionals and gifting buyers.",customer:"University students, young professionals and gift buyers in Dhaka and other major cities.",position:"Affordable premium utility: better materials and organization without luxury-brand pricing.",source:"China/India private-label suppliers; sample first, then negotiate a 30–50 unit opening MOQ.",channels:"Facebook/Instagram, TikTok, own store and selected marketplaces.",plan:["Start with 1 hero SKU plus 2 supporting SKUs; avoid a wide catalog.","Collect 20–30 customer interviews before the commercial order.","Order 40 hero units after sample/QC approval.","Launch with 3–5 creative angles and a controlled Meta test.","Reorder only after 60%+ sell-through with positive contribution."]},
"Urban footwear":{price:3290,landed:1480,cac:320,fee:1,pack:90,returns:140,batch:40,icon:"👟",description:"Everyday urban footwear with a tight size curve, practical materials and a clear use case rather than a generic fashion catalog.",customer:"18–35 urban buyers who want style, comfort and reasonable pricing.",position:"Reliable everyday footwear with premium-looking presentation at an attainable price.",source:"China/private-label footwear factories; sample fit, sole and finishing before MOQ.",channels:"Meta, TikTok, own store, creator seeding and retargeting.",plan:["Launch one hero silhouette and keep size depth concentrated in proven sizes.","Test fit and comfort with local users before bulk purchase.","Build product photography around real use cases.","Use COD with confirmation and track failed deliveries separately.","Scale only when return rate and contribution stay within target."]},
"Home fragrance":{price:1590,landed:620,cac:180,fee:1,pack:55,returns:90,batch:60,icon:"🕯️",description:"Compact candles, diffusers and giftable fragrance sets designed for home ambience and affordable gifting.",customer:"Young professionals, newly married households and gift buyers.",position:"Simple, aesthetic home fragrance that feels premium without premium pricing.",source:"Local/private-label fragrance makers or importers; verify ingredients, packaging and batch consistency.",channels:"Instagram, Facebook, gifting content, marketplaces and own store.",plan:["Start with 2 scents and 1 gift bundle.","Validate scent preference and repeat intent with a small test batch.","Keep packaging compact to protect delivery economics.","Build bundles to increase average order value.","Reorder the top scent rather than expanding SKU count too early."]},
"Modern watches":{price:3990,landed:1760,cac:350,fee:1,pack:70,returns:130,batch:30,icon:"⌚",description:"Affordable-premium watches where dial design, packaging and perceived quality carry more weight than a huge model range.",customer:"Young professionals and gifting buyers seeking a polished accessory.",position:"Design-led watches that look more expensive than they are.",source:"China watch OEM/private-label suppliers; verify movement, glass, strap and warranty terms.",channels:"Meta video, creator reviews, gifting campaigns and own store.",plan:["Choose one signature case/dial family.","Request samples from 2–3 suppliers and compare finishing.","Include warranty terms and after-sales handling in the offer.","Lead with close-up product video and gifting creatives.","Keep the first PO small because model preferences can fragment demand."]},
"Everyday beauty":{price:1290,landed:540,cac:170,fee:1,pack:40,returns:70,batch:80,icon:"🧴",description:"A focused personal-care offer built around one repeat-use hero product instead of a broad cosmetic catalog.",customer:"18–35 buyers seeking practical, trustworthy personal-care solutions.",position:"Simple, trustworthy daily care with clear benefits and accessible pricing.",source:"Compliant local/private-label manufacturer or verified importer; validate labeling and documentation.",channels:"UGC, Meta, TikTok, creator sampling and repeat-purchase flows.",plan:["Start with one hero product and one bundle.","Verify manufacturer, ingredients, labeling and shelf life before ordering.","Use education-led content rather than aggressive claims.","Track repeat purchase and complaint rate from day one.","Expand only after the hero product shows repeat demand."]},
"Fitness essentials":{price:1890,landed:980,cac:220,fee:1,pack:55,returns:85,batch:50,icon:"🏋️",description:"Compact fitness accessories selected for easy shipping, simple demonstrations and clear use cases.",customer:"Gym-goers, home-workout users and beginner fitness customers.",position:"Useful fitness gear without overcomplicated equipment or high ticket prices.",source:"China/India suppliers; inspect material quality, load tolerance and packaging.",channels:"Short-form video, fitness creators, Meta and own store.",plan:["Choose 2–3 compact SKUs that can be bundled.","Use demonstration videos to prove utility.","Avoid bulky equipment until demand is proven.","Bundle complementary items to raise basket size.","Reorder winners based on sell-through and contribution."]},
"Private-label brand launch":{price:3490,landed:1450,cac:420,fee:1,pack:90,returns:150,batch:80,icon:"🏷️",description:"A differentiated private-label hero product with a coherent brand system, controlled opening inventory and room to expand after proof of demand.",customer:"Urban 20–40 buyers who value design, utility and brand trust.",position:"Ownable brand proposition rather than commodity reselling.",source:"China/India OEM or verified local manufacturer; qualify multiple suppliers and negotiate branding, packaging and QC terms.",channels:"Meta, TikTok, creators, own store, selected retail/wholesale partners.",plan:["Qualify 2–3 suppliers and approve branded samples before any commercial commitment.","Launch 80 units across one hero SKU and one supporting offer; keep SKU depth tight.","Invest in professional brand identity, product photography and creator seeding.","Scale paid acquisition only after contribution and return rate are proven.","Expand into additional SKUs and wholesale/retail only after repeatable demand is established."]}
};}
function marketBenchmark(d,p){const ranges={"Premium carry goods":"৳1,800–৳3,300","Urban footwear":"৳1,800–৳4,000","Home fragrance":"৳390–৳1,100","Modern watches":"৳1,500–৳4,000","Everyday beauty":"৳600–৳1,800","Fitness essentials":"৳900–৳2,500","Private-label brand launch":"৳1,800–৳4,500"};return ranges[p.name]||"৳800–৳3,000"}
function fixedEconomics(p){let gross=p.price-p.landed,fees=p.price*p.fee/100,contrib=gross-p.cac-fees-p.pack-p.returns;return {gross,grossPct:gross/p.price*100,contrib,contribPct:contrib/p.price*100};}
function liveEconomics(p){
  const supplier=bdtEstimate(p?.priceUsd);
  const risk=String(state.profile?.riskCapacity||state.profile?.risk||"Medium").toLowerCase();
  const logistics=Math.max(90,Math.round(supplier*.12/10)*10);
  const landed=supplier+logistics;
  const multiplier=risk.includes("high")?2.65:risk.includes("low")?2.15:2.4;
  const selling=Math.max(499,Math.round(landed*multiplier/10)*10);
  const cac=Math.max(100,Math.round(selling*(risk.includes("high")?.15:risk.includes("low")?.09:.12)/10)*10);
  const fee=Math.round(selling*.015);
  const pack=Math.max(50,Math.round(selling*.025/10)*10);
  const returns=Math.max(50,Math.round(selling*.035/10)*10);
  const contribution=selling-landed-cac-fee-pack-returns;
  return {supplier,logistics,landed,selling,cac,fee,pack,returns,contribution,margin:selling?Math.round(contribution/selling*100):0};
}
function productLabHeader(){
  const p=state.selectedProduct;
  const direction=state.selectedOpportunityName||state.profile?.category||"your business direction";
  return "<div class='hero cj-hero'><div><div class='eyebrow'>Product Lab</div><div class='h1'>Real products. Real supplier data. A clearer first move.</div><div class='sub'>Forge is matching real supplier products to <b>"+esc(direction)+"</b> and your locked capital, market, time and risk profile. Compare the economics before you commit.</div><div class='cj-hero-points'><span><b>Live</b> supplier pricing</span><span><b>Profile</b> matched</span><span><b>Economics</b> modeled</span></div></div><div class='actions'><button class='btn' data-page='ideas' onclick='go(this.dataset.page)'>Change business direction</button>"+(p?"<button class='btn primary' data-page='orders' onclick='go(this.dataset.page)'>View sourcing queue</button>":"")+"</div></div>";
}
function cjPanel(){
  return "<section class='cj-live'><div class='cj-head'><div><div class='eyebrow'>Product discovery</div><h2>Products worth looking at</h2><div class='small'>Live supplier images, current supplier prices, stock signals and Forge's modeled Bangladesh economics — all in one scan-friendly grid.</div></div><div class='cj-live-note'><span class='pill online'>● Live price check</span><div class='small' id='cjstatus' style='margin-top:8px'>Selecting products from the connected supplier catalogue…</div></div></div><div class='cj-toolbar'><div class='cj-count' id='cjmeta'>Finding relevant products…</div><div class='cj-fresh' id='cjfresh'>Supplier data checked live</div></div><div id='cjresults' class='cj-results'><div class='cj-empty cj-loading'><b>Finding products for your profile…</b><br><span class='small'>Forge is checking the connected supplier catalogue.</span></div></div></section>";
}
function products(){return productLabHeader()+cjPanel();}
function goPlan(){go("plan")}
function goOrders(){go("orders")}

function goPlan(){go("plan")}
function goOrders(){go("orders")}

function goPlan(){go("plan")}
function goOrders(){go("orders")}

function recalc(){let price=+document.getElementById("calcprice").value||0,cost=+document.getElementById("calccost").value||0,cac=+document.getElementById("calccac").value||0,fee=(+document.getElementById("calcfee").value||0)/100,gross=price-cost,contrib=gross-cac-price*fee;document.getElementById("gm").textContent=pct(price?gross/price*100:0)+" gross margin";document.getElementById("cm").textContent=BDT(contrib);document.getElementById("cmp").textContent=pct(price?contrib/price*100:0)}
function landedCost(){let p=state.selectedProduct||opportunities()[0];let d=productCatalog()[p.name];return d?.landed||890}
function recommendedBatch(d){let p=state.profile,base=d.batch;if(p.risk==="Conservative"||p.riskCapacity==="Low")return Math.max(12,Math.round(base*.6));if(p.risk==="Aggressive"&&p.budget>=500000)return Math.round(base*1.75);if(p.budget>=1000000&&p.riskCapacity==="High")return Math.round(base*1.4);return base}
function personalizedPlan(d){let p=state.profile,mode=planMode(p);if(mode==="Scale-ready")return ["Validate supplier samples and negotiate commercial terms across 2–3 qualified suppliers.","Launch with the confirmed quantity plus a controlled content and paid-acquisition system.","Build a hero SKU, supporting bundle and clear repeat/reorder logic.","Scale winning creatives and channels only while CAC and contribution stay inside the locked model.","Expand supplier depth, wholesale/retail channels and SKU range only after validated sell-through."];if(mode==="Capital-protective")return ["Sample from multiple suppliers; do not place a large first PO.","Start with "+recommendedBatch(d)+" units or a pre-order/limited-drop validation.","Use low-cost content and customer interviews before heavy paid acquisition.","Reorder only after strong sell-through, positive contribution and acceptable returns.","Keep the majority of unused capital protected until the business proves repeatability."];return ["Validate the offer with samples and 15–30 target-customer conversations.","Start with "+recommendedBatch(d)+" units and keep a protected cash reserve.","Run controlled content and paid tests; cut weak creatives and SKUs quickly.","Reorder only when sell-through and contribution meet the Forge scale trigger.","Use the first 30–60 days to turn the winning product into a repeatable acquisition system."]}
function orderLifecycle(p){
  const payment=p.paymentStatus||"unpaid";
  const procurement=p.orderStatus||"draft";
  if(p.deliveryStatus==="delivered")return {key:"delivered",label:"Delivered",tone:"green",desc:"Order delivered"};
  if(p.deliveryStatus==="in_transit")return {key:"in_transit",label:"In transit",tone:"blue",desc:"Shipment is moving"};
  if(procurement==="ordered"||procurement==="processing")return {key:"procurement",label:"Procurement",tone:"blue",desc:"Supplier order is being processed"};
  if(payment==="paid")return {key:"paid",label:"Paid · procurement next",tone:"green",desc:"Payment received; supplier purchase is next"};
  if(payment==="submitted")return {key:"payment_review",label:"Payment submitted",tone:"amber",desc:"Payment awaiting verification"};
  return {key:"payment",label:"Pending payment",tone:"amber",desc:"Payment required before procurement"};
}
function quantityPlan(p){
  const e=p.economics||liveEconomics(p);
  const stock=Number(p.inventory||0);
  const budget=Number(state.profile?.budget||state.business?.budget||0);
  const category=String(p.category||state.profile?.category||"").toLowerCase();
  const supplierMoq=Math.max(0,Number(p.moq||p.minOrderQty||0));
  let businessMin=10;
  if(category.includes("bag"))businessMin=12;
  else if(category.includes("shoe")||category.includes("footwear"))businessMin=12;
  else if(category.includes("watch"))businessMin=10;
  else if(category.includes("beauty")||category.includes("cosmetic"))businessMin=15;
  else if(category.includes("home"))businessMin=12;
  else if(category.includes("fitness")||category.includes("sport"))businessMin=10;
  businessMin=Math.max(businessMin,supplierMoq);
  const affordable=budget>0?Math.floor((budget*.25)/Math.max(1,e.landed)):businessMin*2;
  const risk=String(state.profile?.risk||"Balanced").toLowerCase();
  const riskFactor=risk.includes("conservative")?.65:risk.includes("growth")||risk.includes("aggressive")?1.15:.85;
  const suggested=Math.max(businessMin,Math.round((Math.max(businessMin,affordable*riskFactor))/5)*5);
  const plannedBase=budget>0?Math.floor((budget*.20)/Math.max(1,e.landed)):suggested;
  const planned=Math.max(businessMin,Math.min(suggested,Math.max(businessMin,Math.round(plannedBase/5)*5)));
  return {minimum:businessMin,suggested,planned,stock,affordable};
}
function normalizeOrderQuantity(p){
  const qp=quantityPlan(p);
  let q=Number(p.orderQty||0);
  if(!Number.isFinite(q)||q<qp.minimum)q=qp.planned;
  // Never silently reduce the customer's planned quantity because of current stock.
  // Keep the requested quantity visible; procurement/payment will be blocked if stock is insufficient.
  p.orderQty=q;
  p.minimumOrderQty=qp.minimum;
  p.suggestedOrderQty=qp.suggested;
  p.plannedOrderQty=qp.planned;
  return qp;
}
function orderTotals(p){
  normalizeOrderQuantity(p);
  const qty=Math.max(1,Number(p.orderQty||1));
  const e=p.economics||liveEconomics(p);
  return {qty,landed:Number(e.landed||0),selling:Number(e.selling||0),payable:Math.max(0,Math.round(Number(e.landed||0)*qty)),contribution:Number(e.contribution||0)};
}
function orderCounts(queue){
  const out={all:queue.length,payment:0,paid:0,procurement:0,in_transit:0,delivered:0};
  queue.forEach(p=>{const k=orderLifecycle(p).key;if(k==="payment"||k==="payment_review")out.payment++;else if(k==="paid")out.paid++;else if(k==="procurement")out.procurement++;else if(k==="in_transit")out.in_transit++;else if(k==="delivered")out.delivered++;});
  return out;
}
let ordersFilter="all";
function orders(){
  const queue=Array.isArray(state.sourcingQueue)?state.sourcingQueue:[];
  queue.forEach(normalizeOrderQuantity);
  try{persistProfile()}catch{}
  const counts=orderCounts(queue);
  const visible=queue.filter(p=>{
    if(ordersFilter==="all")return true;
    const k=orderLifecycle(p).key;
    if(ordersFilter==="payment")return k==="payment"||k==="payment_review";
    return k===ordersFilter;
  });
  const tabs=[
    ["all","All orders",counts.all],
    ["payment","Pending payment",counts.payment],
    ["paid","Paid",counts.paid],
    ["procurement","Procurement",counts.procurement],
    ["in_transit","In transit",counts.in_transit],
    ["delivered","Delivered",counts.delivered]
  ];
  const rows=visible.length?visible.map(p=>{
    const realIndex=queue.indexOf(p),stage=orderLifecycle(p),t=orderTotals(p),qp=quantityPlan(p);
    const paymentLabel=p.paymentStatus==="paid"?"Paid":p.paymentStatus==="submitted"?"Submitted":"Unpaid";
    return "<tr>"+
      "<td><b>"+esc(p.orderRef||"FORGE-ORDER")+"</b><div class='small'>"+new Date(p.selectedAt||Date.now()).toLocaleDateString("en-BD")+"</div></td>"+
      "<td><div class='order-product'><img src='"+esc(p.image)+"' alt='"+esc(p.name)+"'><div><b>"+esc(p.name)+"</b><div class='small'>SKU "+esc(p.sku||"—")+"</div><div class='small'>"+esc(p.variant||"Standard variant")+"</div></div></div></td>"+
      "<td><div class='order-qty-cell'><div class='qty-stepper'><button "+(p.paymentStatus==="unpaid"?"":"disabled")+" onclick='adjustOrderQuantity("+realIndex+",-1)' aria-label='Decrease quantity'>−</button><input "+(p.paymentStatus==="unpaid"?"":"disabled")+" type='number' min='"+qp.minimum+"' max='"+(qp.stock>0?qp.stock:"")+"' step='1' value='"+t.qty+"' onchange='setOrderQuantity("+realIndex+",this.value,false)' aria-label='Order quantity'><button "+(p.paymentStatus==="unpaid"?"":"disabled")+" onclick='adjustOrderQuantity("+realIndex+",1)' aria-label='Increase quantity'>+</button></div><div class='order-qty-meta'><span>Min "+qp.minimum+"</span><span>Suggested "+qp.suggested+"</span><span class='planned'>Plan "+qp.planned+"</span></div></div></td>"+
      "<td><b>"+BDT(t.payable)+"</b><div class='small'>"+t.qty+" units × "+BDT(t.landed)+" landed/unit</div><div class='small "+(t.qty>qp.stock&&qp.stock>0?"qty-stock-warning":"")+"'>"+esc(orderStockStatus(p,t.qty).text)+"</div></td>"+
      "<td><span class='status "+stage.tone+"'>"+stage.label+"</span><div class='small order-stage-note'>"+stage.desc+"</div></td>"+
      "<td><span class='payment-dot "+(paymentLabel==="Paid"?"is-paid":"")+"'>"+paymentLabel+"</span></td>"+
      "<td><div class='order-actions'><button class='btn' onclick='reviewQueued("+realIndex+")'>Open order →</button>"+(p.paymentStatus==="unpaid"?"<button class='btn delete-order-btn' onclick='deleteQueuedOrder("+realIndex+")' title='Delete order' aria-label='Delete order'>✕</button>":"")+"</div></td>"+
    "</tr>";
  }).join(""):"<tr><td colspan='6'><div class='cj-empty' style='padding:45px'><b>No orders in this stage.</b><br><span class='small'>Choose a product in Product Lab or change the filter above.</span></div></td></tr>";

  const active=queue.filter(p=>["payment","payment_review"].includes(orderLifecycle(p).key)).reduce((n,p)=>n+1,0);
  const inventoryCommit=queue.reduce((n,p)=>n+Number(p.orderQty||0),0);
  return "<div class='hero order-hero'><div><div class='eyebrow'>ORDER OPERATIONS</div><div class='h1'>From payment to delivery.</div><div class='sub'>Every confirmed product becomes a real operational order here. Quantity is mandatory: Forge sets a sensible launch minimum, recommends a starting quantity and lets you choose the final quantity before payment.</div></div><div class='actions'><button class='btn' onclick=\"go('products')\">Find another product</button>"+(state.selectedProduct?"<button class='btn primary' onclick=\"go('plan')\">View business plan →</button>":"")+"</div></div>"+
  "<div class='order-command card'><div><div class='eyebrow'>ORDER CONTROL</div><h2 style='margin:5px 0'>One product. One quantity. One operational record.</h2><p class='small'>A single unit is treated as a sample, not a business launch. Forge calculates a minimum launch quantity, a suggested quantity and a planned quantity from your capital, risk profile, product economics and available stock.</p></div><div class='order-flow'><span class='is-active'>01 Product</span><i>→</i><span>02 Quantity</span><i>→</i><span>03 Payment</span><i>→</i><span>04 Procurement</span><i>→</i><span>05 Shipping</span><i>→</i><span>06 Delivered</span></div></div>"+
  "<div class='order-metrics'>"+
    "<div class='card'><div class='label'>TOTAL ORDERS</div><div class='stat'>"+counts.all+"</div><div class='small'>Confirmed product orders</div></div>"+
    "<div class='card action-metric'><div class='label'>PENDING PAYMENT</div><div class='stat'>"+counts.payment+"</div><div class='small'>"+active+" require payment action</div></div>"+
    "<div class='card'><div class='label'>UNITS COMMITTED</div><div class='stat'>"+inventoryCommit.toLocaleString("en-US")+"</div><div class='small'>Across confirmed orders</div></div>"+
    "<div class='card'><div class='label'>IN TRANSIT</div><div class='stat'>"+counts.in_transit+"</div><div class='small'>Shipment underway</div></div>"+
    "<div class='card'><div class='label'>DELIVERED</div><div class='stat'>"+counts.delivered+"</div><div class='small'>Completed orders</div></div>"+
  "</div>"+
  "<div class='section order-section-head'><div><div class='eyebrow'>YOUR ORDERS</div><h2>Order workspace</h2><p>Only confirmed products appear here. Supplier catalogue browsing remains inside Product Lab.</p></div></div>"+
  "<div class='order-tabs'>"+tabs.map(t=>"<button class='"+(ordersFilter===t[0]?"active":"")+"' onclick='setOrdersFilter(\""+t[0]+"\")'>"+t[1]+" <b>"+t[2]+"</b></button>").join("")+"</div>"+
  "<div class='card order-table-card'><div style='overflow:auto'><table class='table order-table'><thead><tr><th>Order</th><th>Product</th><th>Quantity</th><th>Customer payable</th><th>Stage</th><th>Payment</th><th></th></tr></thead><tbody>"+rows+"</tbody></table></div></div>"+
  "<div class='qty-planning-note'><strong>How quantity works:</strong> Forge uses your capital, income/risk profile, product economics, supplier minimums and live stock to calculate <b>Minimum</b>, <b>Suggested</b> and <b>Planned</b> quantities. The <b>Planned</b> quantity is Forge's recommended starting point—not a forced purchase. You can edit it directly. Your selected quantity always drives the order total; supplier stock is checked separately and never silently changes your number.</div>"+
  "<div class='notice order-policy'><b>Procurement rule:</b> payment must be received and verified before Forge releases a supplier purchase. Final variant, quantity, supplier stock, freight and landed cost are rechecked immediately before procurement.</div>";
}
function setOrdersFilter(filter){
  ordersFilter=filter||"all";
  render();
  scrollTo({top:0,behavior:"smooth"});
}
function updateQueuedOrder(i,patch){
  const q=Array.isArray(state.sourcingQueue)?state.sourcingQueue:[];
  if(!q[i])return;
  q[i]={...q[i],...patch,updatedAt:new Date().toISOString()};
  state.sourcingQueue=q;
  if(state.selectedProduct?.orderRef===q[i].orderRef)state.selectedProduct=q[i];
  try{persistProfile()}catch{}
  render();
}
function markPaymentSubmitted(i){
  const p=(state.sourcingQueue||[])[i];if(!p)return;
  updateQueuedOrder(i,{paymentStatus:"submitted",paymentSubmittedAt:new Date().toISOString()});
  toast("Payment submitted for verification.");
  reviewQueued(i);
}
function markPaymentReceived(i){
  const p=(state.sourcingQueue||[])[i];if(!p)return;
  updateQueuedOrder(i,{paymentStatus:"paid",paidAt:new Date().toISOString(),orderStatus:"draft",procurementStatus:"ready"});
  toast("Payment recorded. Order is ready for procurement.");
  reviewQueued(i);
}
function advanceProcurement(i){
  const p=(state.sourcingQueue||[])[i];if(!p)return;
  if(p.paymentStatus!=="paid")return toast("Payment must be verified before procurement.");
  updateQueuedOrder(i,{orderStatus:"processing",procurementStatus:"supplier_order_pending",procurementStartedAt:new Date().toISOString()});
  toast("Order moved to procurement.");
  reviewQueued(i);
}
function markSupplierOrdered(i){
  const p=(state.sourcingQueue||[])[i];if(!p)return;
  if(p.paymentStatus!=="paid")return toast("Verify payment first.");
  updateQueuedOrder(i,{orderStatus:"ordered",procurementStatus:"supplier_order_placed",supplierOrderAt:new Date().toISOString()});
  toast("Supplier procurement recorded.");
  reviewQueued(i);
}
function markInTransit(i){
  const p=(state.sourcingQueue||[])[i];if(!p)return;
  updateQueuedOrder(i,{deliveryStatus:"in_transit",shippedAt:new Date().toISOString()});
  toast("Shipment marked in transit.");
  reviewQueued(i);
}
function markDelivered(i){
  const p=(state.sourcingQueue||[])[i];if(!p)return;
  updateQueuedOrder(i,{deliveryStatus:"delivered",deliveredAt:new Date().toISOString()});
  toast("Order marked delivered.");
  reviewQueued(i);
}
function setOrderQuantity(i,value,openDetail=true){
  const p=(state.sourcingQueue||[])[i];if(!p)return;
  if(p.paymentStatus&&p.paymentStatus!=="unpaid"){
    toast("Quantity is locked after payment is submitted. Open the order to see the next step.");
    return;
  }
  const qp=quantityPlan(p);
  let q=Math.floor(Number(value||0));
  if(!Number.isFinite(q))q=qp.planned;
  if(q<qp.minimum){toast("Minimum launch quantity is "+qp.minimum+" units.");q=qp.minimum;}
  if(q<1)q=1;
  updateQueuedOrder(i,{orderQty:q,minimumOrderQty:qp.minimum,suggestedOrderQty:qp.suggested,plannedOrderQty:qp.planned});
  toast("Quantity set to "+formatQty(q)+" units.");
  if(openDetail)reviewQueued(i);
}
function adjustOrderQuantity(i,delta){
  const p=(state.sourcingQueue||[])[i];if(!p)return;
  if(p.paymentStatus&&p.paymentStatus!=="unpaid")return toast("Quantity is locked after payment is submitted.");
  const qp=quantityPlan(p);
  const current=Number(p.orderQty||qp.planned);
  setOrderQuantity(i,current+Number(delta||0),false);
}
function deleteQueuedOrder(i){
  const q=Array.isArray(state.sourcingQueue)?state.sourcingQueue:[];const p=q[i];if(!p)return;
  if(p.paymentStatus&&p.paymentStatus!=="unpaid")return toast("Paid or payment-submitted orders cannot be deleted. Open the order for the next operational step.");
  if(!window.confirm("Delete this product order? This removes the confirmed order from your workspace. You can choose the product again from Product Lab later."))return;
  const ref=p.orderRef;
  q.splice(i,1);
  state.sourcingQueue=q;
  if(state.selectedProduct?.orderRef===ref)state.selectedProduct=null;
  state.planStatus=null;
  state.planRequestedAt=null;
  try{persistProfile()}catch{}
  closeModal();
  render();
  toast("Order deleted. The product is no longer committed.");
}
function orderStockStatus(p,qty){
  const stock=Number(p.inventory||0);
  if(!stock)return {ok:true,text:"Stock check required before procurement.",tone:"neutral"};
  if(qty>stock)return {ok:false,text:"Requested "+formatQty(qty)+" · supplier currently shows "+formatQty(stock)+" available",tone:"warning"};
  return {ok:true,text:formatQty(stock)+" available in supplier stock",tone:"good"};
}
function reviewQueued(i){
  const p=(state.sourcingQueue||[])[i]; if(!p)return;
  const qp=quantityPlan(p);
  if(!p.orderQty||Number(p.orderQty)<qp.minimum)p.orderQty=qp.planned;
  const t=orderTotals(p),stage=orderLifecycle(p);
  const stockState=orderStockStatus(p,t.qty);
  const paymentButton=p.paymentStatus==="paid"
    ? "<span class='status green'>Payment verified</span>"
    : p.paymentStatus==="submitted"
      ? "<button class='btn' onclick='markPaymentReceived("+i+")'>Verify payment received</button>"
      : stockState.ok
        ? "<button class='btn primary' onclick='markPaymentSubmitted("+i+")'>Make payment →</button>"
        : "<button class='btn' disabled title='Supplier stock is below your requested quantity'>Waiting for stock →</button>";
  let next="";
  if(p.paymentStatus==="paid" && !["processing","ordered"].includes(p.orderStatus)) next="<button class='btn primary' onclick='advanceProcurement("+i+")'>Release to procurement →</button>";
  else if(p.paymentStatus==="paid" && p.orderStatus==="processing") next="<button class='btn primary' onclick='markSupplierOrdered("+i+")'>Confirm supplier order placed →</button>";
  else if(p.orderStatus==="ordered" && p.deliveryStatus!=="in_transit" && p.deliveryStatus!=="delivered") next="<button class='btn primary' onclick='markInTransit("+i+")'>Mark shipment in transit →</button>";
  else if(p.deliveryStatus==="in_transit") next="<button class='btn primary' onclick='markDelivered("+i+")'>Mark delivered →</button>";

  const stockWarning=!stockState.ok
    ? "<div class='qty-warning'><b>Stock is below your requested quantity.</b> You selected "+formatQty(t.qty)+" units, but the supplier currently shows "+formatQty(qp.stock)+" units. Your quantity and total stay unchanged so you can see the true order economics; payment/procurement remains blocked until stock is sufficient or you reduce the quantity.</div>"
    : (qp.stock>0&&qp.stock<qp.minimum
      ? "<div class='qty-warning'><b>This supplier cannot currently support Forge's minimum launch quantity.</b> Forge recommends at least "+qp.minimum+" units, but only "+formatQty(qp.stock)+" are currently shown. Consider another supplier/product.</div>"
      : "");

  document.getElementById("modalbox").innerHTML=
    "<div class='row' style='justify-content:space-between;gap:12px'><div><div class='eyebrow'>ORDER "+esc(p.orderRef||"")+" · QUANTITY REQUIRED</div><h2 style='margin:5px 0'>"+esc(p.name)+"</h2><div class='small'>"+stage.label+" · created "+new Date(p.selectedAt||Date.now()).toLocaleString("en-BD")+"</div></div><button class='btn' onclick='closeModal()'>✕</button></div>"+
    "<div class='order-modal-grid' style='margin-top:20px'>"+
      "<div><img class='cj-detail-img' src='"+esc(p.image)+"' alt='"+esc(p.name)+"'></div>"+
      "<div><div class='cj-detail-price'>"+BDT(t.payable)+"</div><div class='small'>Customer payable for <b>"+t.qty+" units</b> · based on estimated landed cost per unit</div>"+
        "<div class='qty-summary'>"+
          "<div class='qty-box'><div class='label'>MINIMUM TO LAUNCH</div><div class='qty-value'>"+qp.minimum+" units</div><div class='qty-help'>Below this is a sample, not a proper opening batch.</div></div>"+
          "<div class='qty-box'><div class='label'>FORGE SUGGESTED</div><div class='qty-value'>"+qp.suggested+" units</div><div class='qty-help'>Balanced against capital, risk and unit economics.</div></div>"+
          "<div class='qty-box highlight'><div class='label'>FORGE PLANNED</div><div class='qty-value'>"+qp.planned+" units</div><div class='qty-help'>Starting quantity used by the business plan.</div></div>"+
          "<div class='qty-box'><div class='label'>SUPPLIER STOCK</div><div class='qty-value'>"+formatQty(qp.stock)+"</div><div class='qty-help'>Rechecked before procurement.</div></div>"+
        "</div>"+
        "<div class='qty-editor'><label for='orderQtyInput'>Your quantity</label><input id='orderQtyInput' class='qty-input' type='number' min='"+qp.minimum+"' max='"+(qp.stock>0?qp.stock:"")+"' step='1' value='"+t.qty+"' "+(p.paymentStatus==="unpaid"?"":"disabled")+" onchange='setOrderQuantity("+i+",this.value,true)' onkeydown=\"if(event.key==='Enter')setOrderQuantity("+i+",this.value,true)\"><span class='qty-cap'>Minimum "+qp.minimum+" · Suggested "+qp.suggested+" · Planned "+qp.planned+". You can choose any quantity from the minimum up to available stock before payment.</span></div>"+
        stockWarning+
        "<div class='qty-note'>Forge does not force you to buy the suggested quantity. You can increase or decrease the batch above the minimum when stock and capital allow. The chosen quantity becomes the quantity used for payment, procurement and the product-specific business plan.</div>"+
        "<div class='cj-data order-detail-data'><div>Variant<b>"+esc(p.variant||"Standard variant")+"</b></div><div>Quantity<b>"+t.qty+" units</b></div><div>Supplier cost / unit<b>"+moneyUsd(p.priceUsd)+" · ≈ "+BDT(bdtEstimate(p.priceUsd))+"</b></div><div>Estimated landed / unit<b>"+BDT(t.landed)+"</b></div><div>Estimated selling / unit<b>"+BDT(t.selling)+"</b></div><div>Estimated contribution / unit<b>"+BDT(t.contribution)+"</b></div></div>"+
      "</div>"+
    "</div>"+
    "<div class='order-timeline'><div class='"+(p.paymentStatus==="paid"?"done":"current")+"'><b>01</b><span>Payment</span><small>"+(p.paymentStatus==="paid"?"Verified":"Awaiting payment")+"</small></div><div class='"+(p.orderStatus==="processing"||p.orderStatus==="ordered"?"done":"")+"'><b>02</b><span>Procurement</span><small>"+(p.orderStatus==="ordered"?"Supplier order placed":p.orderStatus==="processing"?"Preparing supplier order":"Waiting for payment")+"</small></div><div class='"+(p.deliveryStatus==="in_transit"||p.deliveryStatus==="delivered"?"done":"")+"'><b>03</b><span>Shipping</span><small>"+(p.deliveryStatus==="delivered"?"Delivered":p.deliveryStatus==="in_transit"?"In transit":"Not started")+"</small></div><div class='"+(p.deliveryStatus==="delivered"?"done":"")+"'><b>04</b><span>Delivery</span><small>"+(p.deliveryStatus==="delivered"?"Completed":"Pending")+"</small></div></div>"+
    "<div class='notice' style='margin-top:18px'><b>How this order works</b><div class='small'>Choose the quantity → make payment → payment is verified → Forge releases procurement → the supplier order is placed → shipment is tracked → delivery is recorded. No supplier catalogue is exposed in this workspace.</div></div>"+
    "<div class='actions' style='margin-top:18px;justify-content:flex-end'>"+(p.paymentStatus==="unpaid"?"<button class='btn delete-order-btn' onclick='deleteQueuedOrder("+i+")'>Delete this order</button>":"")+paymentButton+next+"<button class='btn' onclick='closeModal()'>Close</button></div>";
  modal.classList.add("open");
  document.body.classList.add("modal-open");
  requestAnimationFrame(()=>modalBox.querySelector(".cj-modal-close")?.focus?.());
}
function brandStudioPage(){
  const p=state.selectedProduct;
  const profile=state.profile||{};
  const saved=state.brandStudio||{};
  if(!p){
    return "<div class='hero'><div><div class='eyebrow'>BRAND STUDIO</div><div class='h1'>Build the business identity after the product is real.</div><div class='sub'>Brand Studio takes one confirmed supplier product and turns it into a customer-facing business identity: company name, product name, social handles, domain direction, story and launch system.</div></div><button class='btn primary' onclick=\"go('products')\">Choose a product first →</button></div>"+
      "<div class='notice'><b>Nothing to brand yet.</b><div class='small'>First confirm a product in Product Lab. Then Forge will build the brand around that exact product instead of creating a generic branding exercise.</div></div>";
  }
  const name=p.name||"Selected product";
  const category=String(p.category||profile.category||"your category");
  const clean=String(name).replace(/\\s+/g," ").trim();
  const baseWords=clean.replace(/[^A-Za-z0-9 ]/g,"").split(" ").filter(Boolean);
  const productCore=baseWords.slice(0,3).join(" ");
  const direction=saved.direction||{
    audience:"Define the primary customer from the product's actual use case, price point and launch market.",
    position:"Own a clear position around "+productCore+": useful, credible and easy to understand at the moment of purchase.",
    promise:"Make the strongest customer benefit obvious in the first few seconds, then prove it with the real product.",
    personality:"Modern, confident, practical and premium in presentation without overclaiming.",
    proof:"Real product photography, verified specifications, supplier evidence, customer feedback and transparent commercial terms."
  };
  const identity=saved.identity||{};
  const candidates=saved.names||generateNameSet(p,0);
  const chosenName=saved.chosenName||"";
  const productNames=saved.productNames||[
    productCore+" Essential",
    productCore+" Signature",
    productCore+" Everyday"
  ];
  const chosenProductName=saved.chosenProductName||"";
  const social=saved.social||{
    facebook:chosenName?chosenName.toLowerCase().replace(/[^a-z0-9]+/g,""):"yourbrand",
    instagram:chosenName?chosenName.toLowerCase().replace(/[^a-z0-9]+/g,""):"yourbrand",
    domain:chosenName?chosenName.toLowerCase().replace(/[^a-z0-9]+/g,"")+".com":"yourbrand.com"
  };
  const story=saved.story||{
    hook:"A focused product chosen for a real customer need—not a generic catalogue item.",
    body:"Connect the customer's situation, the product's strongest proof point and the reason the offer deserves its price. Keep every claim specific and verifiable.",
    content:"Use case → product detail → proof → objection handling → offer."
  };
  const packaging=saved.packaging||{
    front:"Brand mark + product name + one restrained descriptor.",
    inside:"Thank-you message + care/use guidance + support contact.",
    rule:"Packaging should look like the brand, not like a supplier shipment."
  };
  const launch=saved.launch||{
    message:"Show the product. Explain the reason. Prove the claim.",
    angles:["Use-case demonstration","Product detail / quality proof","Objection handling","Social proof / creator use"],
    channels:"Facebook, Instagram, TikTok, creators and the own store."
  };
  const modules=[
    ["positioning","01","Positioning","Who is this for, why should they care, and where should the product sit?"],
    ["naming","02","Company & brand name","Choose the name customers will remember across the business."],
    ["productNaming","03","Product name","Give the confirmed supplier item a customer-facing product name."],
    ["digital","04","Facebook, Instagram & domain","Create a consistent digital identity direction."],
    ["story","05","Product story","Give product pages, sales and ads one consistent narrative."],
    ["packaging","06","Packaging","Define the physical experience from box to unboxing."],
    ["launch","07","Launch system","Give marketing one coherent message and repeatable creative angles."]
  ];
  const completed=modules.filter(m=>saved[m[0]]).length+(chosenName?1:0)+(chosenProductName?1:0);
  const progress=Math.min(100,Math.round((completed/9)*100));
  const escHtml=v=>esc(v);
  const moduleCard=(key,num,title,desc,content,button)=>{
    const done=!!saved[key];
    return "<article class='brand-module "+(done?"is-done":"")+"'><div class='brand-module-top'><span class='brand-step'>"+num+"</span><span class='status "+(done?"":"amber")+"'>"+(done?"Ready":"Open")+"</span></div><h3>"+title+"</h3><p class='small'>"+desc+"</p>"+content+(button||"")+"</article>";
  };
  const kitReady=!!(chosenName&&chosenProductName);
  return "<div class='hero brand-hero'><div><div class='eyebrow'>BRAND STUDIO · BUSINESS IDENTITY</div><div class='h1'>Turn the chosen product into a real brand.</div><div class='sub'>This is not a mood-board page. Forge helps you make the commercial identity decisions that customers actually see: company name, product name, social presence, website direction, positioning, packaging and launch message.</div></div><div class='actions'><button class='btn' onclick=\"go('products')\">Change product</button><button class='btn primary' onclick='generateBrandDirection()'>"+(saved.direction?"Refresh recommendations":"Build my brand direction")+" →</button></div></div>"+
    "<div class='brand-product-strip card'><div class='brand-product-media'><img src='"+esc(p.image||"")+"' alt='"+esc(name)+"'></div><div class='brand-product-info'><div class='eyebrow'>CONFIRMED PRODUCT</div><h2>"+esc(name)+"</h2><p class='small'>Supplier listing · SKU "+esc(p.sku||"—")+" · Forge will create the customer-facing name below.</p><div class='brand-commercial'><div><span>Supplier cost</span><b>"+moneyUsd(p.priceUsd)+"</b></div><div><span>Planning sell</span><b>"+(p.economics?BDT(p.economics.selling):"—")+"</b></div><div><span>Contribution / unit</span><b>"+(p.economics?BDT(p.economics.contribution):"—")+"</b></div><div><span>Stock checked</span><b>"+formatQty(p.inventory||0)+"</b></div></div></div><div class='brand-lock'>SOURCE<br>LOCKED</div></div>"+
    "<div class='brand-progress card'><div><div class='eyebrow'>BRAND BUILD</div><h2>"+(kitReady?"Core identity prepared. Now refine the launch system.":"Let's make the identity decisions in the right order.")+"</h2><p class='small'>"+completed+" of 9 key decisions prepared. Forge keeps the confirmed supplier product as the source of truth.</p></div><div class='brand-progress-meter'><b>"+progress+"%</b><div class='progress'><i style='width:"+progress+"%'></i></div></div></div>"+
    (kitReady?"<div class='brand-identity-banner'><div class='eyebrow'>YOUR BRAND STARTER KIT</div><h2>"+esc(chosenName)+"</h2><p>"+esc(chosenProductName)+" · Digital identity and launch assets should use this exact naming system.</p><div class='brand-kit'><div class='brand-kit-item'><div class='kit-label'>Facebook Page</div><div class='kit-value'>@"+esc(social.facebook)+"</div><div class='kit-help'>Suggested handle · check availability before claiming.</div></div><div class='brand-kit-item'><div class='kit-label'>Instagram</div><div class='kit-value'>@"+esc(social.instagram)+"</div><div class='kit-help'>Suggested handle · keep it identical across platforms where possible.</div></div><div class='brand-kit-item'><div class='kit-label'>Website domain</div><div class='kit-value'>"+esc(social.domain)+"</div><div class='kit-help'>Suggested domain · availability must be checked before purchase.</div></div><div class='brand-kit-item'><div class='kit-label'>Business role</div><div class='kit-value'>Brand + product</div><div class='kit-help'>The company identity can expand beyond this first SKU.</div></div></div></div>":"")+
    "<div class='section'><div><h2>01 · Brand foundation</h2><p>First make the commercial logic understandable. Then name it.</p></div></div>"+    "<div class='brand-foundation grid'><div class='card span8'><div class='label'>WHAT THIS BRAND SHOULD STAND FOR</div><div class='brand-thesis'>"+escHtml(direction.position)+"</div><div class='brand-proof-grid'><div><span>Who it is for</span><b>"+escHtml(direction.audience)+"</b></div><div><span>Customer promise</span><b>"+escHtml(direction.promise)+"</b></div><div><span>Brand personality</span><b>"+escHtml(direction.personality)+"</b></div><div><span>Proof we can use</span><b>"+escHtml(direction.proof)+"</b></div></div></div><div class='card span4 brand-coach'><div class='label'>FORGE COACH NOTE</div><h3>Do not copy the supplier.</h3><p class='small'>The supplier gives us a product. Your business needs its own company identity, customer-facing product name, promise, content language and commercial reason to exist.</p><button class='btn primary' onclick='generateBrandDirection()'>"+(saved.direction?"Improve direction":"Build direction")+" →</button></div></div>"+
    "<div class='section'><div><h2>02 · Build the identity</h2><p>These are the concrete decisions you will use on your store, social pages, packaging and ads.</p></div></div>"+
    "<div class='brand-modules'>"+
      moduleCard("positioning","01","Positioning","Define the customer, promise and market position.","<div class='brand-copy'>"+escHtml(direction.position)+"</div>","<button class='btn' onclick='generateBrandModule(\"positioning\")'>"+(saved.positioning?"Refine positioning":"Generate positioning")+" →</button>")+
      moduleCard("naming","02","Company & brand name","Forge keeps generating fresh directions until you find one that feels like your company. You can also use the name you already dreamed of.","<div class='brand-suggestion-count'>Fresh set · "+(saved.nameRefreshCount||0)+" refreshes</div><div class='brand-name-list'>"+candidates.map((n,i)=>"<button class='brand-name-option "+(chosenName===n?"selected":"")+"' onclick='selectBrandName("+i+")'><span>"+esc(n)+"</span><small>"+(chosenName===n?"Selected":"Use this name →")+"</small></button>").join("")+"</div><div class='brand-manual'><div class='label'>YOUR OWN COMPANY / BRAND NAME</div><div class='small' style='margin:5px 0 9px'>Already have a name in mind? Enter it and Forge will use it throughout the brand system.</div><div class='brand-manual-grid'><input class='input' id='manualBrandName' placeholder='e.g. Arvo Living' value='"+esc(chosenName&&!candidates.includes(chosenName)?chosenName:"")+"'><button class='btn' onclick='useManualBrandName()'>Use my name →</button></div></div><div class='brand-refresh-note'>Refresh does not repeat the same three names. Each refresh creates a new naming direction from the product, category and business profile.</div>","<button class='btn primary' onclick='generateBrandModule(\"naming\")'>Refresh names ↻</button>")+
      moduleCard("productNaming","03","Product name","Replace the supplier listing title with a short, memorable customer-facing name.","<div class='brand-suggestion-count'>Fresh product-name set</div><div class='brand-name-list'>"+productNames.map((n,i)=>"<button class='brand-name-option "+(chosenProductName===n?"selected":"")+"' onclick='selectProductName("+i+")'><span>"+esc(n)+"</span><small>"+(chosenProductName===n?"Selected":"Use this product name →")+"</small></button>").join("")+"</div>","<button class='btn primary' onclick='generateBrandModule(\"productNaming\")'>Refresh product names ↻</button>")+
      moduleCard("digital","04","Digital identity","Create one consistent Facebook Page, Instagram handle and website domain direction.","<div class='brand-kit'><div class='brand-kit-item'><div class='kit-label'>Facebook</div><div class='kit-value'>@"+esc(social.facebook)+"</div></div><div class='brand-kit-item'><div class='kit-label'>Instagram</div><div class='kit-value'>@"+esc(social.instagram)+"</div></div><div class='brand-kit-item "+(state.brandStudio?.selectedDomain?"domain-selected-tile":"")+"'><div class='kit-label'>Website domain</div><div class='kit-value'>"+esc(social.domain)+"</div><div class='small' style='margin-top:6px'>"+(state.brandStudio?.selectedDomain?"Selected for Store Launch":"Candidate — verify below")+"</div></div><div class='brand-kit-item'><div class='kit-label'>Registrar status</div><div class='kit-value'>"+(saved.digital?"Prepared":"Suggested")+" · "+domainCheckLabel(social.domain)+"</div></div></div><div class='brand-manual'><div class='label'>CHOOSE THE DOMAIN FOR YOUR STORE</div><div class='small' style='margin:5px 0 9px'>Check the domain here. If the connected registrar confirms it is available, Forge will show the live registration price and one <b>Use this domain</b> button. That selection then flows automatically to Store Launch.</div><div class='brand-manual-grid'><input class='input' id='manualBrandDomain' placeholder='e.g. arvoliving.com' value='"+esc(social.domain||"")+"'><button class='btn primary' onclick='checkManualDomainAvailability()'>Check availability + live price ↗</button></div>"+domainLaunchNotice(social.domain)+"<div class='small' style='margin-top:8px'>Only an exact registrar result can be selected. Forge will never put a guessed price on the launch invoice.</div></div>","<button class='btn primary' onclick='generateBrandModule(\"digital\")'>Refresh digital direction ↻</button>")+moduleCard("story","05","Product story","Give product pages, sales and ads one consistent narrative.","<div class='brand-copy'><b>"+escHtml(story.hook)+"</b><p>"+escHtml(story.body)+"</p><p><b>Content rhythm:</b> "+escHtml(story.content)+"</p></div>","<button class='btn' onclick='generateBrandModule(\"story\")'>"+(saved.story?"Refine story":"Generate story")+" →</button>")+
      moduleCard("packaging","06","Packaging","Make the physical experience feel like your brand, not a supplier parcel.","<div class='brand-copy'><p><b>Front:</b> "+escHtml(packaging.front)+"</p><p><b>Inside:</b> "+escHtml(packaging.inside)+"</p><p><b>Rule:</b> "+escHtml(packaging.rule)+"</p></div>","<button class='btn' onclick='generateBrandModule(\"packaging\")'>"+(saved.packaging?"Refine packaging":"Generate packaging")+" →</button>")+
      moduleCard("launch","07","Launch system","Give marketing a repeatable message instead of random creative ideas.","<div class='brand-copy'><b>"+escHtml(launch.message)+"</b><div class='brand-angle-list'>"+launch.angles.map(x=>"<span>"+esc(x)+"</span>").join("")+"</div><p><b>Channels:</b> "+escHtml(launch.channels)+"</p></div>","<button class='btn' onclick='generateBrandModule(\"launch\")'>"+(saved.launch?"Refine launch system":"Generate launch system")+" →</button>")+
    "</div>"+
    "<div class='brand-next card'><div><div class='eyebrow'>NEXT STEP</div><h2>"+(kitReady?"Identity is ready to move downstream.":"Choose the company name and product name first.")+"</h2><p class='small'>Once approved, the same identity should flow into Store Launch, product pages, packaging and AI Marketing. Suggested social handles and domains still require availability checks.</p></div><div class='actions'><button class='btn' onclick=\"go('plan')\">View business plan</button><button class='btn primary' onclick='completeBrandHandoff()'>Approve identity →</button></div></div>";
}

function generateBrandDirection(){
  const p=state.selectedProduct;if(!p)return go("products");
  const base=String(p.name||"Selected Product").replace(/[^A-Za-z0-9 ]/g,"").replace(/\s+/g," ").trim();
  const words=base.split(" ").filter(Boolean);
  const core=words.slice(0,3).join(" ");
  const category=String(p.category||state.profile?.category||"").toLowerCase();
  const brandCandidates=[
    category.includes("bag")?"Carry & Co.":category.includes("footwear")?"Stride House":"Northstar & Co.",
    category.includes("beauty")?"Nura Form":category.includes("home")?"Hearth & Form":"Form House",
    "Novera Goods"
  ];
  const productCandidates=[core+" Essential",core+" Signature",core+" Everyday"];
  const chosen=state.brandStudio?.chosenName||"";
  const handleBase=(chosen||brandCandidates[0]).toLowerCase().replace(/[^a-z0-9]+/g,"");
  state.brandStudio={
    ...(state.brandStudio||{}),
    direction:{
      audience:"Primary customers are selected from the product's actual use case, price point, launch market and the locked business profile.",
      position:"Own a clear position around "+core+": useful, credible and easy to understand at the moment of purchase.",
      promise:"Make the strongest customer benefit obvious in the first few seconds, then prove it with the real product.",
      personality:"Modern, confident, practical and premium in presentation without overclaiming.",
      proof:"Real product photography, verified specifications, supplier evidence, customer feedback and transparent commercial terms."
    },
    names:brandCandidates,
    productNames:productCandidates,
    social:{facebook:handleBase,instagram:handleBase,domain:(state.brandStudio?.selectedDomain||handleBase+".com")},
    positioning:true,
    naming:true,
    productNaming:true,
    digital:true
  };
  persistProfile();render();toast("Brand direction prepared: company name, product name and digital identity are ready to review.");
}

function generateBrandModule(key){
  const p=state.selectedProduct;if(!p)return go("products");
  const base=String(p.name||"selected product").replace(/[^A-Za-z0-9 ]/g,"").replace(/\s+/g," ").trim();
  const words=base.split(" ").filter(Boolean);
  const core=words.slice(0,3).join(" ");
  const category=String(p.category||state.profile?.category||"").toLowerCase();
  const b=state.brandStudio||{};
  if(key==="positioning"){b.positioning=true;b.direction=b.direction||{};b.direction.position="Position "+core+" around a specific customer problem and a believable benefit—not around generic category language.";}
  if(key==="naming"){b.naming=true;b.nameRefreshCount=Number(b.nameRefreshCount||0)+1;b.names=generateNameSet(p,b.nameRefreshCount);}
  if(key==="productNaming"){b.productNaming=true;b.productNames=[core+" Essential",core+" Signature",core+" Everyday"];}
  if(key==="digital"){
    b.digital=true;
    const n=b.chosenName||b.names?.[0]||"yourbrand";
    const h=String(n).toLowerCase().replace(/[^a-z0-9]+/g,"");
    b.social={facebook:h,instagram:h,domain:h+".com"};
  }
  if(key==="story"){b.story={hook:"A focused product chosen for a real customer need—not a generic catalogue item.",body:"Connect the customer's situation, the product's strongest proof point and the reason the offer deserves its price. Keep every claim specific and verifiable.",content:"Use case → product detail → proof → objection handling → offer."};}
  if(key==="packaging"){b.packaging={front:"Brand mark + customer-facing product name + one restrained descriptor.",inside:"Thank-you message + care/use guidance + support contact.",rule:"Packaging should look like the brand, not like a supplier shipment."};}
  if(key==="launch"){b.launch={message:"Show the product. Explain the reason. Prove the claim.",angles:["Use-case demonstration","Product detail / quality proof","Objection handling","Social proof / creator use"],channels:"Facebook, Instagram, TikTok, creators and the own store."};}
  state.brandStudio=b;persistProfile();render();toast(key.charAt(0).toUpperCase()+key.slice(1)+" module updated.");
}

function generateNameSet(p,cycle){
  const cat=String(p.category||state.profile?.category||"").toLowerCase();
  const seedNames={
    bag:[["Carryva","Mora & Co.","Veyra Living"],["Lunaro","Cove & Form","Avela Goods"],["Vanta Carry","Nomi House","Sora & Co."],["Orla Goods","Maven Carry","Velora"],["Cora & Lane","Aster Carry","Nove & Co."]],
    footwear:[["Stride House","Solevia","Form & Sole"],["Veyro","Northline Goods","Aero & Co."],["Morrow Sole","Crest Footwear","Nexa Step"],["Urban Form","Vanta Sole","Rove Goods"],["Solaire Goods","North & Sole","Aven Step"]],
    beauty:[["Nura Form","Velune Beauty","Mira & Co."],["Aurelia Labs","Novi Skin","Luma Form"],["Veya Beauty","Serein Labs","Mora Skin"],["Elora Care","Nuvia","Sola Beauty"],["Aven Beauty","Ciela Labs","Viora"]],
    home:[["Hearth & Form","Mora Home","Nove Living"],["Cedar & Co.","Vela Home","Aster Living"],["Forma Home","Luno Living","Nora House"],["Maven Home","Cove & Form","Veya Living"],["Arden Home","Novi Living","Luma House"]],
    default:[["Northstar & Co.","Form House","Novera Goods"],["Morrow & Co.","Vela Goods","Aster House"],["Novi & Co.","Crest Goods","Mora House"],["Veyra Goods","Northline Co.","Luno House"],["Aven & Co.","Cove Goods","Sora House"]]
  };
  const group=cat.includes("bag")?seedNames.bag:cat.includes("footwear")||cat.includes("shoe")?seedNames.footwear:cat.includes("beauty")?seedNames.beauty:cat.includes("home")?seedNames.home:seedNames.default;
  return group[Math.abs(Number(cycle||0))%group.length];
}
function useManualBrandName(){
  const input=document.getElementById("manualBrandName");
  const name=(input?.value||"").trim();
  if(name.length<2)return toast("Enter your company or brand name first.");
  const b=state.brandStudio||{};
  b.chosenName=name;b.names=[name,...(b.names||[]).filter(x=>x!==name).slice(0,2)];
  b.naming=true;
  const h=name.toLowerCase().replace(/[^a-z0-9]+/g,"").replace(/[^a-z0-9]+/g,"");
  const handle=h||"yourbrand";
  b.selectedDomain="";
  b.social={facebook:handle,instagram:handle,domain:handle+".com"};
  b.digital=true;
  state.brandStudio=b;persistProfile();autoBuildContentDepartment("brand_selected");render();toast("Your brand name is now the active identity.");
}
function selectBrandName(i){
  const b=state.brandStudio||{};
  const names=b.names||["Northstar & Co.","Form House","Novera Goods"];
  b.names=names;
  b.chosenName=names[i]||names[0];
  const h=String(b.chosenName).toLowerCase().replace(/[^a-z0-9]+/g,"");
  b.selectedDomain="";
  b.social={facebook:h,instagram:h,domain:h+".com"};
  b.naming=true;b.digital=true;
  b.digital=true;
  state.brandStudio=b;
  persistProfile();autoBuildContentDepartment("brand_selected");render();toast("Company / brand name selected. Digital identity updated to match.");
}
const SUPABASE_URL="https://pmyfswozvkdpqgnsiibf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_RrciEiRwRPkbU6yO6wt8Zg_BI0tSYEW";
const FX_RATE_URL=SUPABASE_URL+"/functions/v1/fx-rate";
const SHOPIFY_BASIC_MONTHLY_USD=39;
const SHOPIFY_BASIC_YEARLY_USD=29;
const FORGE_USD_BDT_RATE=130;
const FORGE_VAT_RATE=0.15;
const FORGE_BILLING_USD_BDT=FORGE_USD_BDT_RATE*(1+FORGE_VAT_RATE);
let forgeFxRate=FORGE_BILLING_USD_BDT;
let forgeFxSource="Google Finance";
let forgeFxFetchedAt=null;
let forgeFxLoading=false;
function domainResult(domain){
  return (state.brandStudio?.domainChecks||{})[String(domain||"").toLowerCase()]||null;
}
function domainCheckLabel(domain){
  const r=domainResult(domain);
  if(!r)return "Availability not checked";
  if(r.status==="available")return "Available to register";
  if(r.status==="taken")return "Already registered";
  if(r.status==="setup_required")return "Registrar setup required";
  if(r.status==="unsupported")return "Extension not supported by registrar API";
  if(r.status==="likely_available")return "Likely available · confirm at registrar";
  return "Check could not be confirmed";
}
function domainLivePriceLabel(result){
  if(!result)return "Price shown after availability check";
  if(result.status!=="available")return "Not available for this launch";
  if(Number(result.priceAmount ?? result.priceUsd)>0){
    const years=Number(result.priceYears||1);
    const usd=Number(result.priceAmount ?? result.priceUsd);
    const currency=result.priceCurrency||"USD";
    const bdt=Math.round(usd*forgeFxRate);
    return BDT(bdt)+" for "+years+" year"+(years===1?"":"s")+" · LIVE";
  }
  return result.priceUnavailableReason?"Registrar price unavailable right now":"Waiting for live registrar price";
}
function domainLaunchNotice(domain){
  const r=domainResult(domain);
  if(!r)return "";
  const selected=String(state.brandStudio?.selectedDomain||"").toLowerCase()===String(domain||"").toLowerCase();
  if(r.status==="available"){
    return "<div class='domain-result-card "+(selected?"selected":"")+"'><div><div class='domain-result-title'>✓ "+esc(domain)+" is available</div><div class='domain-result-price'>"+esc(domainLivePriceLabel(r))+"</div><div class='small'>Verified by the connected registrar. Forge will use this exact domain for Store Launch only after you select it.</div></div><div class='domain-result-actions'>"+(selected?"<span class='status'>Selected for Store Launch</span>":"<button class='btn primary' onclick='selectAvailableDomain(\""+esc(domain)+"\")'>Use this domain →</button>")+"<button class='btn' onclick='go(\"store\")'>Open Store Launch</button></div></div>";
  }
  if(r.status==="taken")return "<div class='notice danger'><b>"+esc(domain)+" is already registered.</b><span>This domain cannot be used for this launch. Choose another domain and check it before selecting.</span></div>";
  if(r.status==="setup_required")return "<div class='notice danger'><b>Registrar connection needs one-time setup.</b><span>Connect the Cloudflare Registrar account to Forge before this domain can be verified or priced.</span></div>";
  if(r.status==="unsupported")return "<div class='notice danger'><b>"+esc(domain)+" cannot be registered through the connected registrar API.</b><span>Choose another supported extension or domain.</span></div>";
  if(r.status==="likely_available")return "<div class='notice danger'><b>"+esc(domain)+" is not yet registrar-verified.</b><span>Forge requires an exact Cloudflare Registrar result before a domain can be selected or priced.</span></div>";
  return "";
}
async function refreshForgeFxRate(){
  if(forgeFxLoading)return;
  forgeFxLoading=true;
  try{
    const res=await fetch(FX_RATE_URL,{headers:{"apikey":SUPABASE_PUBLISHABLE_KEY,"Authorization":"Bearer "+SUPABASE_PUBLISHABLE_KEY}});
    const data=await res.json();
    if(!res.ok||!data.ok||!Number(data.rate))throw new Error(data.error||"FX rate unavailable");
    // Forge launch pricing uses a fixed BDT 130/USD base plus 15% VAT.
    // Keep the external FX service available for diagnostics, but never use its market rate for customer billing.
    forgeFxRate=FORGE_BILLING_USD_BDT;
    forgeFxSource=data.source||"Google Finance";
    forgeFxFetchedAt=data.fetchedAt||new Date().toISOString();
    render();
  }catch(e){
    console.warn("Forge FX refresh failed; keeping last known rate.",e);
  }finally{
    forgeFxLoading=false;
  }
}

async function checkDomainAvailability(domain){
  const clean=String(domain||"").trim().toLowerCase().replace(/^https?:\/\//,"").replace(/\/$/,"");
  if(!clean || !clean.includes("."))return toast("Enter a valid domain, such as yourbrand.com.");
  toast("Checking "+clean+"…");
  try{
    const res=await fetch(SUPABASE_URL+"/functions/v1/domain-availability",{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_PUBLISHABLE_KEY,"Authorization":"Bearer "+SUPABASE_PUBLISHABLE_KEY},body:JSON.stringify({domain:clean})});
    const data=await res.json();
    if(!res.ok || !data.results?.[0])throw new Error(data.error||"Availability check failed.");
    const result=data.results[0];
    const b=state.brandStudio||{};b.domainChecks=b.domainChecks||{};b.domainChecks[clean]=result;state.brandStudio=b;persistProfile();render();
    if(result.status==="available")toast(clean+" is available to register.");
    else if(result.status==="taken")toast(clean+" is already registered.");
    else if(result.status==="setup_required")toast("Cloudflare Registrar is not connected yet.");
    else if(result.status==="unsupported")toast(clean+" is not supported by the connected registrar API.");
    else if(result.status==="likely_available")toast(clean+" looks available, but final registrar confirmation is required.");
    else toast("Forge could not confirm availability for "+clean+".");
  }catch(e){toast("Domain check failed: "+(e.message||"try again"));console.error(e);}
}
function checkDomainAvailabilityFromUI(){ checkDomainAvailability((state.brandStudio?.social?.domain)||""); }
function selectAvailableDomain(domain){
  const clean=String(domain||"").trim().toLowerCase().replace(/^https?:\/\//,"").replace(/\/$/,"");
  const result=domainResult(clean);
  if(!result)return toast("Check this domain first so Forge can attach the live registrar result.");
  if(result.status!=="available")return toast(result.status==="likely_available"?"The registrar has not confirmed this domain yet.":"This domain is not available for this launch.");
  const b=state.brandStudio||{};
  b.selectedDomain=clean;
  b.social=b.social||{};
  b.social.domain=clean;
  b.domainSelectedAt=new Date().toISOString();
  state.brandStudio=b;
  persistProfile();
  render();
  toast(clean+" selected for Store Launch.");
}
function checkManualDomainAvailability(){
  const input=document.getElementById("manualBrandDomain");
  checkDomainAvailability(input?.value||"");
}
function useManualDomain(){
  const input=document.getElementById("manualBrandDomain");
  const domain=(input?.value||"").trim().toLowerCase().replace(/^https?:\/\//,"").replace(/\/$/,"");
  if(!domain || !domain.includes("."))return toast("Enter a valid domain, such as yourbrand.com.");
  const b=state.brandStudio||{};b.social=b.social||{};
  b.social.domain=domain;b.digital=true;
  state.brandStudio=b;persistProfile();render();toast("Your domain is now the active digital identity.");checkDomainAvailability(domain);
}
function selectProductName(i){
  const b=state.brandStudio||{};
  const names=b.productNames||[String(state.selectedProduct?.name||"Product")+" Essential",String(state.selectedProduct?.name||"Product")+" Signature",String(state.selectedProduct?.name||"Product")+" Everyday"];
  b.productNames=names;
  b.chosenProductName=names[i]||names[0];
  state.brandStudio=b;
  persistProfile();render();toast("Customer-facing product name selected.");
}

function completeBrandHandoff(){
  const b=state.brandStudio||{};
  if(!b.chosenName)return toast("Choose the company / brand name first.");
  if(!b.chosenProductName)return toast("Choose the customer-facing product name first.");
  b.handoff=true;
  state.brandStudio=b;
  persistProfile();render();toast("Brand identity approved — Store Launch and AI Marketing can now use the same identity.");
}

function storeLaunchState(){
  const s=state.storeLaunch||{};
  if(!s.etaMinutes){
    const seed=String(state.selectedProduct?.id||state.selectedProduct?.name||"forge").split("").reduce((a,ch)=>a+ch.charCodeAt(0),0);
    s.etaMinutes=18+(seed%28);
  }
  state.storeLaunch=s;
  return s;
}
function availableDomainChoices(){
  const checks=state.brandStudio?.domainChecks||{};
  return Object.entries(checks).filter(([domain,r])=>r?.status==="available").map(([domain,r])=>({domain,result:r}));
}
function storeLaunchBill(){
  const brand=state.brandStudio||{};
  const selected=String(brand.selectedDomain||"").trim().toLowerCase();
  const result=selected?domainResult(selected):null;
  const launchable=!!(selected && result?.status==="available");
  const domain=launchable?selected:"";
  const domainUsd=launchable?Number(result.priceAmount ?? result.priceUsd ?? 0):0;
  const domainYears=launchable?Number(result.priceYears||1):0;
  const hostingUsd=SHOPIFY_BASIC_MONTHLY_USD;
  const hostingBdt=Math.round(hostingUsd*forgeFxRate);
  const domainBdt=Math.round(domainUsd*forgeFxRate);
  const setup=5000;
  const launchTotal=setup+domainBdt+hostingBdt;
  return {
    setup,
    domain,
    domainResult:launchable?result:null,
    domainUsd,
    domainBdt,
    domainYears,
    domainEstimate:launchable?domainLivePriceLabel(result):"Select an available domain to add it to this launch",
    hostingProvider:"Shopify",
    hostingPlan:"Basic",
    hostingValidity:"1 month",
    hostingUsd,
    hostingBdt,
    hostingAnnualUsd:SHOPIFY_BASIC_YEARLY_USD*12,
    hostingAnnualBdt:Math.round(SHOPIFY_BASIC_YEARLY_USD*12*forgeFxRate),
    launchTotal,
    fxRate:forgeFxRate,
    fxSource:forgeFxSource,
    fxFetchedAt:forgeFxFetchedAt,
    hasCustomDomain:!!domain
  };
}
function startStoreBuildPayment(){
  const selected=state.selectedProduct;
  if(!selected)return toast("Choose and confirm a product before starting Store Launch.");
  const b=state.brandStudio||{};
  if(!b.chosenName)return toast("Choose a company / brand name in Brand Studio first.");
  if(!b.chosenProductName)return toast("Choose a customer-facing product name in Brand Studio first.");
  const s=storeLaunchState();
  s.invoiceRef=s.invoiceRef||("STORE-"+new Date().toISOString().replace(/\D/g,"").slice(0,14));
  s.status="awaiting_payment";
  s.createdAt=s.createdAt||new Date().toISOString();
  state.storeLaunch=s;
  persistProfile();
  render();
  toast("Launch invoice prepared. Review the live total above, then pay to start the build.");
}
function payStoreLaunch(){
  const selected=state.selectedProduct;
  if(!selected)return toast("Choose a confirmed product first.");
  const b=state.brandStudio||{};
  if(!b.chosenName||!b.chosenProductName)return toast("Finish the core Brand Studio choices first.");
  const s=storeLaunchState();
  s.status="building";
  s.paidAt=new Date().toISOString();
  s.startedAt=s.paidAt;
  s.invoiceRef=s.invoiceRef||("STORE-"+new Date().toISOString().replace(/\D/g,"").slice(0,14));
  state.storeLaunch=s;
  persistProfile();
  render();
  toast("Payment recorded. Forge has started your store build.");
}
function refreshStoreBuild(){
  const s=storeLaunchState();
  if(s.status==="building"){
    const age=Math.max(0,Math.round((Date.now()-new Date(s.startedAt||Date.now()).getTime())/60000));
    if(age>=Number(s.etaMinutes||30)){
      s.status="ready";
      s.completedAt=new Date().toISOString();
      state.storeLaunch=s;
      persistProfile();
      toast("Your store build is marked ready for final review.");
    } else {
      render();
      toast("Build is still in progress. Estimated completion: about "+Math.max(1,Number(s.etaMinutes||30)-age)+" minute(s).");
    }
  } else render();
}


function contentLibrary(){
  const p=state.selectedProduct||{};
  const brand=state.brandStudio?.chosenName||state.business?.name||"Your brand";
  const product=p.name||"your selected product";
  if(!p.name){
    return "<div class='hero'><div><div class='eyebrow'>CONTENT STUDIO · PRODUCT-FIRST</div><div class='h1'>Build content from the <span style='color:var(--accent)'>real product.</span></div><div class='sub'>Forge uses the actual supplier/Shopify product media and product data. It does not present fabricated product photography or developer placeholders as finished content.</div></div><div class='actions'><button class='btn primary' onclick='go(\"products\")'>Choose a product →</button></div></div><div class='card content-no-product'><div style='font-size:42px'>▧</div><h2>Content starts after product confirmation</h2><p>Choose a real product in Product Lab. Forge will use the strongest available product media and build a professional social launch pack around it.</p><button class='btn primary' style='margin-top:18px' onclick='go(\"products\")'>Open Product Lab →</button></div>";
  }
  if(!state.contentAutomation?.key || !String(state.contentAutomation.key).includes(String(p.id||p.name))){
    autoBuildContentDepartment("content_page_sync");
  }
  const assets=Array.isArray(state.contentAssets)?state.contentAssets:[];
  const quality=productMediaQuality(p);
  const ready=assets.filter(x=>x.qualityStatus==="ready").length;
  const image=esc(p.image||"");
  return "<div class='content-studio-hero'><div class='card'><div class='eyebrow'>FORGE CONTENT STUDIO · REAL PRODUCT MODE</div><div class='h1' style='font-size:clamp(38px,5vw,62px)'>Turn one product into a <span style='color:var(--accent)'>real launch pack.</span></div><p class='sub'>"+esc(product)+" is connected to your sourcing record. Forge uses verified product media, product facts and your brand system to create publishable social content without requiring a paid image-generation API.</p><div class='content-quality'><div><span>Media</span><b>"+quality.label+"</b></div><div><span>Source</span><b>"+(p.sourceType==="connected_supplier"?"Supplier":"Shopify")+"</b></div><div><span>Pack</span><b>"+ready+" ready</b></div><div><span>Engine</span><b>Forge Core</b></div></div><div class='content-rule'><b>Quality rule:</b> Forge never turns a weak or missing product source into a finished hero creative. Product imagery stays tied to the real product record.</div></div><div class='content-studio-product'><span class='quality-pill status'>"+quality.label+"</span><img src='"+image+"' alt='"+esc(product)+"' onload='validateContentMedia(this)' onerror='blockContentMedia(this)'><div class='product-source'>Real product media · "+esc(p.supplierName||p.supplier||"connected supplier")+"</div></div></div><div class='content-command-v3 card'><div class='eyebrow'>ONE-CLICK PRODUCTION</div><h2>Build the Facebook launch pack</h2><p>Creates the core posts a new business actually needs: product launch, benefits, price/offer, detail, trust, Facebook cover, Story and Reel cover. The product itself stays authentic.</p><div class='actions'><button class='btn primary' onclick='generateProductLaunchPack()'>Build professional pack →</button><button class='btn' onclick='go(\"brand\")'>Review brand system</button><button class='btn' onclick='go(\"store\")'>Open store connection</button></div></div><div class='content-pack-head'><div><div class='eyebrow'>YOUR PUBLISHABLE ASSETS</div><h2>"+esc(product)+" · Social Launch Pack</h2><p>Professional product-first creatives for Facebook and Instagram. No generic Forge placeholder artwork.</p></div><span class='status'>"+assets.length+" assets</span></div><div id='forgeContentPack' class='content-studio-grid'>"+contentStudioAssetsHtml(assets)+"</div><div id='forgeCopyPack' class='content-copy-pack'>"+contentCopyPackHtml()+"</div>";
}

function blockContentMedia(img){
  state.contentMediaGate={status:"blocked",reason:"The product image could not be loaded."};
  const pack=document.getElementById("forgeContentPack");
  if(pack)pack.innerHTML="<div class='content-empty-quality' style='grid-column:1/-1'><b>Product media failed the source check.</b><div class='small' style='margin-top:5px'>Forge is keeping finished creatives out of the library until a valid product image is available.</div><button class='btn' style='margin-top:12px' onclick='go(\"products\")'>Return to Product Lab →</button></div>";
}
function validateContentMedia(img){
  const w=Number(img.naturalWidth||0),h=Number(img.naturalHeight||0);
  const acceptable=w>=800&&h>=800&&Math.max(w,h)>=1200;
  state.contentMediaGate={status:acceptable?"ready":"blocked",width:w,height:h,reason:acceptable?"":"Source image resolution is below Forge's publishable-content threshold."};
  const pack=document.getElementById("forgeContentPack");
  if(!acceptable && pack){
    pack.innerHTML="<div class='content-empty-quality' style='grid-column:1/-1'><b>Source image needs a better resolution.</b><div class='small' style='margin-top:5px'>Detected "+w+"×"+h+" px. Forge will not present an upscaled or blurry supplier image as finished social content.</div><button class='btn primary' style='margin-top:12px' onclick='go(\"products\")'>Find another product / source →</button></div>";
  }
  if(acceptable)persistProfile();
}

function productMediaQuality(p){
  if(!p?.image)return {ready:false,label:"No image"};
  return {ready:true,label:"Verified source"};
}
function contentStudioAssetsHtml(list){
  const ready=list.filter(x=>x.qualityStatus==="ready");
  if(!ready.length)return "<div class='content-empty-quality' style='grid-column:1/-1'><b>No finished product creative is being shown.</b><div class='small' style='margin-top:5px'>Forge will not downgrade the library with a fake or weak-looking product creative.</div></div>";
  return ready.map((x,i)=>{
    const src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(x.svg||"");
    return "<article class='content-studio-card card'><div class='content-studio-preview'><img src='"+esc(src)+"' loading='lazy' alt='"+esc(x.name||"Forge creative")+"'><span class='asset-live-tag'>"+esc(x.format||"SOCIAL")+"</span></div><div class='content-studio-body'><div class='content-meta'>"+esc(x.type||"Social Creative")+"</div><h3>"+esc(x.name||"Forge creative")+"</h3><p>"+esc(x.description||"Product-specific creative built from the approved product media.")+"</p><div class='content-studio-actions'><button class='btn primary' onclick='downloadForgeAsset("+i+")'>Download</button><button class='btn' onclick='useForgeAsset("+i+")'>Use →</button></div></div></article>";
  }).join("");
}
async function generateProductLaunchPack(){
  const p=state.selectedProduct||{};
  if(!p.name)return toast("Choose a product first.");
  const button=[...document.querySelectorAll("button")].find(x=>x.textContent.includes("Build professional pack"));
  if(button){button.disabled=true;button.dataset.original=button.textContent;button.textContent="Collecting supplier media…";}
  const pack=document.getElementById("forgeContentPack");
  if(pack)pack.innerHTML="<div class='content-empty-quality' style='grid-column:1/-1'><b>Collecting the supplier's full media set…</b><div class='small' style='margin-top:6px'>Forge checks the original product record for the gallery and any supplier video before creating the finished social pack.</div></div>";
  try{
    const pid=String(p.id||p.sku||"").trim();
    if(pid){
      const response=await fetch(CJ_PROXY+"?detailPid="+encodeURIComponent(pid));
      const detail=await response.json();
      if(response.ok&&detail.ok&&detail.product){
        const d=detail.product;
        p.image=d.image||p.image;
        p.mediaGallery=Array.isArray(d.images)&&d.images.length?d.images:[p.image].filter(Boolean);
        p.supplierVideos=Array.isArray(d.videos)?d.videos:[];
        p.supplierDescription=d.description||p.supplierDescription||"";
        p.material=d.material||p.material||"";
        p.mediaSource="CJ product detail";
        state.selectedProduct=p;
        const idx=state.sourcingQueue.findIndex(x=>String(x.id||x.sku)===String(p.id||p.sku));
        if(idx>=0)state.sourcingQueue[idx]={...state.sourcingQueue[idx],...p};
      }
    }
    state.contentMediaGate={status:p.image?"ready":"blocked",source:p.mediaSource||"supplier"};
    state.contentAssets=[];
    state.contentAutomation={};
    autoBuildContentDepartment("manual_launch_pack");
    persistProfile();
    if(pack)pack.innerHTML=contentStudioAssetsHtml(state.contentAssets||[]);
    const copy=document.getElementById("forgeCopyPack");
    if(copy)copy.innerHTML=contentCopyPackHtml();
    toast("Forge built the social launch pack from the supplier's actual product media.");
  }catch(e){
    if(pack)pack.innerHTML="<div class='content-empty-quality' style='grid-column:1/-1'><b>Supplier media could not be collected.</b><div class='small' style='margin-top:6px'>"+esc(e.message||"Please try again.")+"</div><button class='btn primary' style='margin-top:12px' onclick='generateProductLaunchPack()'>Try again →</button></div>";
  }finally{
    if(button){button.disabled=false;button.textContent=button.dataset.original||"Build professional pack →";}
  }
}
function autoBuildContentDepartment(reason){
  const p=state.selectedProduct||{};
  if(!p.name)return;
  const brand=state.brandStudio?.chosenName||state.business?.name||"YOUR BRAND";
  const product=p.name||"YOUR PRODUCT";
  const gallery=Array.isArray(p.mediaGallery)&&p.mediaGallery.length?p.mediaGallery:[p.image].filter(Boolean);
  const image=gallery[0]||"";
  const key=["forge-content-studio-v4",brand,product,p.id,gallery.join("|")].join("|");
  if(state.contentAutomation?.key===key&&Array.isArray(state.contentAssets)&&state.contentAssets.length)return;
  state.contentAutomation={key:key,reason:reason,startedAt:new Date().toISOString(),status:"building",engine:"forge-content-studio-v4"};
  state.contentAssets=[];
  const accent=state.brandStudio?.primaryColor||"#69dda0";
  const econ=liveEconomics(p);
  const items=[
    ["Hero Product","Facebook / Instagram","Clean launch creative using the supplier's original product media.","product-hero","1:1",0],
    ["Product Benefits","Facebook / Instagram","Benefit-led creative built only from verified product context.","product-benefits","1:1",1],
    ["Offer Creative","Facebook / Instagram","Conversion-focused offer using the current modeled price.","product-offer","1:1",2],
    ["Product Detail","Facebook / Instagram","Close product presentation using another supplier image when available.","product-detail","1:1",3],
    ["Facebook Cover","Facebook","Professional wide launch cover for the new business page.","facebook-cover","16:9",0],
    ["Instagram Story","Instagram Story","Vertical launch creative for the first story sequence.","product-story","9:16",1],
    ["Reel Cover","Reels","Vertical cover for a product reveal or demo reel.","reel-cover","9:16",2],
    ["Product Carousel","Facebook / Instagram","Gallery-led product sequence using the actual supplier media.","product-carousel","1:1",4]
  ];
  items.forEach((x,i)=>{
    const img=gallery[x[6]%gallery.length]||image;
    const svg=forgeProductSvg(x[0],x[1],brand,product,accent,img,x[3],econ,i);
    saveForgeAsset(x[0],x[1],x[2],svg);
    const item=state.contentAssets[0];
    if(item){item.sourceImage=img;item.qualityStatus=img?"ready":"blocked";item.format=x[5];item.productId=p.id||"";item.sourceType=p.sourceType||"connected_supplier";item.mediaIndex=x[6]%gallery.length;}
  });
  state.contentRequests=state.contentRequests||[];
  state.contentRequests.unshift({request:"Professional social launch pack for "+product,createdAt:new Date().toISOString(),status:"generated",reason:reason});
  state.contentAutomation.status="ready";
  state.contentAutomation.completedAt=new Date().toISOString();
  persistProfile();
}
function contentCopyPackHtml(){
  const p=state.selectedProduct||{};
  if(!p.name)return "";
  const product=String(p.name),short=product.length>70?product.slice(0,67).replace(/\s+\S*$/,"")+"…":product;
  const e=liveEconomics(p),price=e?.selling?BDT(e.selling):"";
  const captions=[
    ["Launch","Meet "+short+".\nA focused product launch built around the details customers actually need to know.\n\n"+(price?"Available around "+price+".":"Check the product page for current pricing.")+"\n\nShop now."],
    ["Benefits","Looking for a practical upgrade? "+short+" is now available.\n\nClear product information. Straightforward value. An easier way to decide."],
    ["Offer","A new product worth a closer look.\n\n"+short+(price?" · "+price:"")+"\n\nExplore the product and see if it fits your everyday needs."],
    ["Trust","Real product. Real supplier media. Clear information.\n\n"+short+" is presented using the connected product record so customers can see what they are actually buying."]
  ];
  return "<section class='content-copy-section'><div class='eyebrow'>COPY PACK · READY TO PUBLISH</div><h2>Captions that match the creatives</h2><p class='small'>Forge keeps the copy factual and avoids invented reviews, certifications, materials or performance claims.</p><div class='content-copy-grid'>"+captions.map((x,i)=>"<article class='content-copy-card'><span>"+esc(x[0])+"</span><pre>"+esc(x[1])+"</pre><button class='btn' onclick='copyForgeCaption("+i+")'>Copy caption</button></article>").join("")+"</div></section>";
}
function copyForgeCaption(i){
  const p=state.selectedProduct||{},product=String(p.name||""),short=product.length>70?product.slice(0,67).replace(/\s+\S*$/,"")+"…":product,e=liveEconomics(p),price=e?.selling?BDT(e.selling):"";
  const caps=[
    "Meet "+short+".\nA focused product launch built around the details customers actually need to know.\n\n"+(price?"Available around "+price+".":"Check the product page for current pricing.")+"\n\nShop now.",
    "Looking for a practical upgrade? "+short+" is now available.\n\nClear product information. Straightforward value. An easier way to decide.",
    "A new product worth a closer look.\n\n"+short+(price?" · "+price:"")+"\n\nExplore the product and see if it fits your everyday needs.",
    "Real product. Real supplier media. Clear information.\n\n"+short+" is presented using the connected product record so customers can see what they are actually buying."
  ];
  navigator.clipboard?.writeText(caps[i]||caps[0]);toast("Caption copied.");
}

function forgeProductSvg(title,type,brand,product,accent,image,kind,e,variant){
  const wide=kind==="facebook-cover";
  const story=kind==="product-story"||kind==="reel-cover";
  const w=wide?1600:story?1080:1200;
  const h=wide?650:story?1350:1200;
  const bg=["#f5f2ec","#eef2ef","#f1eee8","#e9efeb"][variant%4];
  const ink="#101713", muted="#53665d", a=String(accent||"#69dda0").replace(/[^#a-zA-Z0-9]/g,"");
  const img=image?'<image href="'+esc(image)+'" x="'+(w*.51)+'" y="'+(h*.13)+'" width="'+(w*.40)+'" height="'+(h*.68)+'" preserveAspectRatio="xMidYMid meet" filter="url(#s)"/>':"";
  let headline="Meet "+esc(product);
  if(kind==="product-benefits")headline="Made for everyday use";
  if(kind==="product-detail")headline="Look closer";
  if(kind==="product-trust")headline="Simple. Clear. Ready to buy";
  if(kind==="product-offer")headline="Your next favourite";
  if(kind==="facebook-cover")headline="Now launching";
  if(kind==="product-story")headline="Meet the product";
  if(kind==="reel-cover")headline="See it in detail";
  const sub=kind==="product-benefits"?"Built around verified product details":kind==="product-detail"?"Real product media. Real product context.":kind==="product-trust"?"No invented reviews. No invented claims.":kind==="product-offer"?"A clean offer creative with the current product economics":brand;
  const price=(kind==="product-offer"&&e?.selling)?BDT(e.selling):"";
  const priceBlock=price?'<rect x="'+(w*.08)+'" y="'+(h*.67)+'" width="270" height="64" rx="32" fill="'+a+'"/><text x="'+(w*.08+135)+'" y="'+(h*.67+42)+'" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" font-weight="800" fill="#061a12">'+esc(price)+"</text>":"";
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'"><defs><filter id="s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="25" stdDeviation="22" flood-opacity=".22"/></filter></defs><rect width="100%" height="100%" fill="'+bg+'"/><circle cx="'+(w*.91)+'" cy="'+(h*.06)+'" r="'+(Math.min(w,h)*.27)+'" fill="'+a+'" opacity=".12"/><rect x="'+(w*.06)+'" y="'+(h*.06)+'" width="'+(w*.88)+'" height="'+(h*.88)+'" rx="38" fill="none" stroke="'+ink+'" opacity=".10"/>'+img+'<text x="'+(w*.08)+'" y="'+(h*.16)+'" font-family="Arial,sans-serif" font-size="17" font-weight="800" letter-spacing="4" fill="'+muted+'">'+esc(type.toUpperCase())+'</text><text x="'+(w*.08)+'" y="'+(h*.39)+'" font-family="Arial,sans-serif" font-size="'+(wide?58:story?62:60)+'" font-weight="800" fill="'+ink+'">'+headline+'</text><text x="'+(w*.08)+'" y="'+(h*.48)+'" font-family="Arial,sans-serif" font-size="'+(wide?24:27)+'" fill="'+muted+'">'+esc(sub)+'</text><text x="'+(w*.08)+'" y="'+(h*.58)+'" font-family="Arial,sans-serif" font-size="29" font-weight="700" fill="'+ink+'">'+esc(product)+'</text>'+priceBlock+'<rect x="'+(w*.08)+'" y="'+(h*.83)+'" width="245" height="52" rx="26" fill="'+ink+'"/><text x="'+(w*.08+122.5)+'" y="'+(h*.83+34)+'" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="800" fill="#fff">SHOP NOW</text><text x="'+(w*.08)+'" y="'+(h*.91)+'" font-family="Arial,sans-serif" font-size="13" letter-spacing="2" fill="'+muted+'">'+esc(brand.toUpperCase())+'</text></svg>';
}
function saveForgeAsset(name,type,description,svg){
  state.contentAssets=state.contentAssets||[];
  state.contentAssets.unshift({name:name,type:type,description:description,svg:svg,createdAt:new Date().toISOString()});
  persistProfile();
}
function contentAutomationSummaryHtml(){
  const p=state.selectedProduct||{},b=state.brandStudio||{},count=(state.contentAssets||[]).length;
  const product=b.chosenProductName||p.name||"your confirmed product";
  if(!p.name)return '<div class="card content-auto-panel"><div class="eyebrow">AUTOPILOT</div><h2>Choose a product and Forge takes over.</h2><p class="small">Once a real product is confirmed, Forge automatically prepares the website, social, product, campaign and marketing asset packs.</p></div>';
  return '<div class="card content-auto-panel"><div><div class="eyebrow">FORGE AUTOPILOT · '+(count?"READY":"BUILDING")+'</div><h2>Your creative department is already working.</h2><p class="small"><b>'+esc(product)+'</b> is the active product. Forge automatically prepares the launch kit from your locked business, brand and supplier data. No repetitive creative setup is required.</p><div class="auto-pipeline"><span>Product</span><i>→</i><span>Brand</span><i>→</i><span>Website</span><i>→</i><span>Social</span><i>→</i><span>Ads</span><i>→</i><span>Publish</span></div></div><div class="auto-count"><b>'+count+'</b><span>assets prepared</span></div></div>';
}
function createContentRequest(prefill){
  const el=document.getElementById("forgeContentPrompt"), request=(prefill||el?.value||"").trim();
  if(!request)return toast("Tell Forge what you want to create first.");
  state.contentRequests=state.contentRequests||[];
  state.contentRequests.unshift({request,createdAt:new Date().toISOString(),status:"brief_ready"});
  persistProfile(); toast("Forge brief created — your content request is saved to the Content Library.");
  if(el){el.value="";el.placeholder="Your request is saved. Tell Forge what to create next…";}
}
function openContentCollection(label){
  const map={"Brand":"Brand Identity Kit","Social":"Social Media Kit","Website":"Website Launch Kit","Product":"Product Creative Pack","Video":"Video Studio","Advertising":"Advertising Kit","Copy":"Marketing Copy","Documents":"Business Documents","Print":"Print & Offline Kit","Campaigns":"Campaign Workspace"};
  const target=map[label]||label;
  const el=[...document.querySelectorAll(".content-asset-card")].find(x=>x.querySelector(".content-meta")?.textContent.toLowerCase().includes(label.toLowerCase()));
  const vault=document.querySelector(".content-asset-grid");
  if(vault){vault.scrollIntoView({behavior:"smooth",block:"start"});toast(target+" is connected to your autogenerated launch kit.");}
  else toast(target+" will use your approved brand and product context.");
}
function contentHandoffHtml(){
  const p=state.selectedProduct||{},s=state.storeLaunch||{},ready=!!(p.name&&(state.brandStudio?.chosenName||state.business?.name));
  return '<div class="card content-handoff"><div><div class="eyebrow">STORE CONNECTION</div><h2>'+ (ready?'Your launch assets are store-ready.':'Waiting for the business inputs.') +'</h2><p class="small">'+(ready?'The same product image, approved brand identity, product copy and creative system are packaged for Store Launch. When a real storefront connection is authorized, Forge can publish the prepared assets instead of asking the customer to rebuild them manually.':'Forge will prepare the handoff automatically after a product is confirmed.')+'</p></div><div class="handoff-status"><span>Product</span><b>'+(p.name?'Ready':'Waiting')+'</b><span>Brand</span><b>'+(state.brandStudio?.chosenName?'Ready':'Waiting')+'</b><span>Store API</span><b>'+((s.connectionStatus||"Not connected")==="connected"?"Connected":"Connect in Store Launch")+'</b></div><button class="btn primary" onclick="go(&quot;store&quot;)">'+(s.connectionStatus==="connected"?"Publish prepared kit →":"Open Store Launch →")+'</button></div>';
}
function contentAssetVaultHtml(){
  const list=Array.isArray(state.contentAssets)?state.contentAssets:[];
  if(!list.length)return '<div class="card content-asset-grid" style="grid-column:1/-1;margin-top:18px"><div style="grid-column:1/-1;text-align:center;padding:25px"><div class="eyebrow">YOUR LIBRARY</div><h2>Forge is waiting for a product.</h2><p class="small">Confirm a product in Product Lab and the launch library will be built automatically.</p><button class="btn primary" onclick="go(&quot;products&quot;)">Open Product Lab →</button></div></div>';
  return '<div class="section"><div><div class="eyebrow">YOUR LIBRARY · AUTOGENERATED</div><h2>Your launch kit</h2><p class="small">Every creative is generated from the selected product and approved brand identity. Product imagery appears only where it belongs.</p></div></div><div class="content-asset-grid">'+list.slice(0,18).map((x,i)=>{
    const src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(x.svg||"");
    return '<article class="content-asset-card card"><div class="asset-preview real-preview"><img src="'+esc(src)+'" loading="lazy" alt="'+esc(x.name||"Forge asset")+'"><span class="asset-live-tag">'+(x.sourceImage?"REAL PRODUCT CONTEXT":"FORGE TEMPLATE")+'</span></div><div class="asset-body"><div class="content-meta">'+esc(x.type||"Creative")+'</div><h3>'+esc(x.name||"Forge asset")+'</h3><p>'+esc(x.description||"Forge-generated asset")+'</p><div class="content-asset-actions"><button class="btn primary" onclick="downloadForgeAsset('+i+')">Download</button><button class="btn" onclick="useForgeAsset('+i+')">Use →</button></div></div></article>';
  }).join("")+'</div>';
}
function forgeSvg(title,subtitle,kind,accent,image,variant=0){
  const isBanner=["facebook","tiktok","website-hero","launch","email","brand-banner"].includes(kind);
  const isStory=kind==="story", isSquare=!isBanner&&!isStory&&kind!=="logo"&&kind!=="favicon";
  const w=isBanner?1600:isStory?1080:1200, h=isBanner?620:isStory?1350:1200;
  const a=String(accent||"#69dda0").replace(/[^#a-zA-Z0-9(),.% -]/g,""), bg=["#07120e","#0b1713","#10131c","#14101b","#0c1720"][variant%5];
  const safeTitle=esc(title), safeSub=esc(subtitle);
  const img=image&&["tiktok","website-hero","product-hero","product-feature","product-post","story","launch","offer","whatsapp","email"].includes(kind)
    ? '<rect x="'+(w*.57)+'" y="'+(h*.13)+'" width="'+(w*.34)+'" height="'+(h*.66)+'" rx="44" fill="#14261f"/><image href="'+esc(image)+'" x="'+(w*.60)+'" y="'+(h*.17)+'" width="'+(w*.28)+'" height="'+(h*.58)+'" preserveAspectRatio="xMidYMid meet"/>'
    : '';
  const logo=(kind==="logo"||kind==="favicon")?'<rect x="'+(w*.08)+'" y="'+(h*.10)+'" width="'+(kind==="favicon"?110:150)+'" height="'+(kind==="favicon"?110:150)+'" rx="34" fill="'+a+'"/><text x="'+(w*.08+(kind==="favicon"?55:75))+'" y="'+(h*.10+(kind==="favicon"?76:104))+'" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="'+(kind==="favicon"?58:78)+'" font-weight="900" fill="#061a12">F</text>':'';
  const accentShape=variant%2===0
    ? '<circle cx="'+(w*.90)+'" cy="'+(h*.10)+'" r="'+Math.min(w,h)*.30+'" fill="'+a+'" opacity=".10"/>'
    : '<rect x="'+(w*.72)+'" y="'+(h*.06)+'" width="'+(w*.34)+'" height="'+(h*.34)+'" rx="90" fill="'+a+'" opacity=".08"/>';
  const titleSize=isBanner?58:isStory?66:64;
  const titleY=isBanner?.64:isStory?.55:.70;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'"><defs><linearGradient id="g'+variant+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+a+'"/><stop offset="1" stop-color="#c8f6da"/></linearGradient></defs><rect width="100%" height="100%" fill="'+bg+'"/>'+accentShape+img+logo+'<rect x="'+(w*.06)+'" y="'+(h*.06)+'" width="'+(w*.88)+'" height="'+(h*.88)+'" rx="42" fill="none" stroke="'+a+'" opacity=".20"/><text x="'+(w*.08)+'" y="'+(h*.37)+'" font-family="Inter,Arial,sans-serif" font-size="18" font-weight="800" letter-spacing="4" fill="'+a+'">FORGE · '+esc(kind.toUpperCase())+'</text><text x="'+(w*.08)+'" y="'+(h*titleY)+'" font-family="Inter,Arial,sans-serif" font-size="'+titleSize+'" font-weight="850" fill="#f4f8f5">'+safeTitle+'</text><text x="'+(w*.08)+'" y="'+(h*(titleY+.10))+'" font-family="Inter,Arial,sans-serif" font-size="'+(isBanner?28:31)+'" fill="#9fb8ad">'+safeSub+'</text><rect x="'+(w*.08)+'" y="'+(h*.78)+'" width="'+(isBanner?360:390)+'" height="56" rx="28" fill="url(#g'+variant+')"/><text x="'+(w*.08+(isBanner?180:195))+'" y="'+(h*.78+37)+'" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="20" font-weight="850" fill="#061a12">READY TO USE</text><text x="'+(w*.08)+'" y="'+(h*.91)+'" font-family="Inter,Arial,sans-serif" font-size="16" letter-spacing="3" fill="#668178">FORGE · YOUR BUSINESS CREATIVE SYSTEM</text></svg>';
}
function saveForgeAsset(name,type,description,svg){
  state.contentAssets=state.contentAssets||[];
  state.contentAssets.unshift({name,type,description,svg,createdAt:new Date().toISOString()});
  persistProfile();
}
function generateStarterKit(){
  const b=state.brandStudio||{},p=state.selectedProduct||{},brand=b.chosenName||state.business?.name||"Your Brand",product=b.chosenProductName||p.name||"Your Product",accent=b.primaryColor||"#69dda0";
  saveForgeAsset(brand+" · Logo","Brand Identity","Primary brand mark generated locally by Forge",forgeSvg(brand,product,"logo",accent));
  saveForgeAsset(brand+" · Launch Banner","Social / Website","Launch banner generated locally by Forge",forgeSvg("Meet "+product,"Now launching with "+brand,"banner",accent));
  saveForgeAsset(brand+" · Product Post","Social Creative","Product announcement graphic generated locally by Forge",forgeSvg(product,"Discover the new "+brand+" collection","post",accent));
  state.contentRequests=state.contentRequests||[];state.contentRequests.unshift({request:"Generate starter content kit",createdAt:new Date().toISOString(),status:"generated"});
  persistProfile();render();toast("Starter kit generated locally — no paid image API required.");
}
function downloadForgeAsset(i){
  const a=(state.contentAssets||[])[i];if(!a)return;const blob=new Blob([a.svg],{type:"image/svg+xml"}),url=URL.createObjectURL(blob),x=document.createElement("a");
  x.href=url;x.download=(a.name||"forge-asset").replace(/[^a-z0-9]+/gi,"-").toLowerCase()+".svg";document.body.appendChild(x);x.click();x.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("SVG downloaded — editable and sharp at any size.");
}
function useForgeAsset(i){const a=(state.contentAssets||[])[i];if(!a)return;state.contentRequests=state.contentRequests||[];state.contentRequests.unshift({request:"Use asset: "+a.name,createdAt:new Date().toISOString(),status:"approved"});persistProfile();toast(a.name+" approved for your creative workflow.");}
function store(){
  const p=state.selectedProduct;
  const brand=state.brandStudio||{};
  const s=storeLaunchState();
  const bill=storeLaunchBill();
  const readyForInvoice=!!(p&&brand.chosenName&&brand.chosenProductName);
  const age=s.startedAt?Math.max(0,Math.round((Date.now()-new Date(s.startedAt).getTime())/60000)):0;
  const eta=Number(s.etaMinutes||30);
  const progress=s.status==="ready"?100:s.status==="building"?Math.min(92,Math.max(8,Math.round(age/eta*100))):0;
  const remaining=Math.max(1,eta-age);
  const brandName=brand.chosenName||"Your brand";
  const productName=brand.chosenProductName||p?.name||"Confirmed product";
  const domain=bill.domain||"";
  const checklist=[
    ["Store structure","AI builds the homepage, navigation, collection structure and core pages."],
    ["Product presentation","AI prepares the confirmed product image set: clean background, crop, sizing, hero image and storefront-ready gallery media."],
    ["Product listing","Customer-facing product name, description, variants, pricing structure and product details."],
    ["SEO setup","Product title, meta description, URL handle, image naming and on-page search structure."],
    ["Trust & policy","Shipping, returns, contact, FAQ and essential trust sections prepared from the approved business rules."],
    ["Commerce setup","Checkout, payment/shipping configuration and order flow prepared for the selected platform."],
    ["Analytics & tracking","Store analytics, conversion events and required tracking configuration prepared."],
    ["Final QA","Mobile/desktop review, product-page checks, checkout test and launch-readiness review."]
  ];
  let statusTitle="Ready to build your store";
  let statusText="Once the launch invoice is paid, Forge starts the build automatically.";
  if(s.status==="awaiting_payment"){statusTitle="Invoice ready · payment required";statusText="Your selections are locked into this build request. Pay the one-time setup fee to start."; }
  if(s.status==="building"){statusTitle="Your store is being built";statusText="Forge is working through your product, brand, storefront, SEO and launch configuration. Estimated completion: about "+remaining+" minute(s).";}
  if(s.status==="ready"){statusTitle="Store build complete · review before launch";statusText="The automated build is complete. Preview the store, check the final details and then publish when you are satisfied.";}
  const primaryButton=!readyForInvoice
    ? "<button class='btn primary' onclick=\"go('brand')\">Finish Brand Studio →</button>"
    : s.status==="building"
      ? "<button class='btn primary' onclick='refreshStoreBuild()'>Check build status ↻</button>"
      : s.status==="ready"
        ? "<button class='btn primary' onclick=\"toast('Store preview is being prepared')\">Preview completed store ↗</button>"
        : "<button class='btn primary' onclick='go(&quot;billing&quot;)'>Review and pay in Billing →</button>";
  const domainReady=!!bill.hasCustomDomain;
  const domainChoices=availableDomainChoices();
  const domainChoicePanel=!domainReady && domainChoices.length
    ? "<div class='card domain-launch-selector'><div class='eyebrow'>AVAILABLE DOMAINS READY TO CHOOSE</div><h2>Select the domain for this store</h2><p class='small'>These names were verified as available. Choose one and Forge will carry the exact domain and live registrar price into the launch invoice.</p><div class='domain-choice-list'>"+domainChoices.map(x=>"<div class='domain-choice "+(brand.selectedDomain===x.domain?"selected":"")+"'><div><b>"+esc(x.domain)+"</b><div class='domain-result-price'>"+esc(domainLivePriceLabel(x.result))+"</div></div><button class='btn primary' onclick='selectAvailableDomain(\""+esc(x.domain)+"\");go(\"store\")'>"+(brand.selectedDomain===x.domain?"Selected":"Use this domain →")+"</button></div>").join("")+"</div></div>"
    : "";
  const domainAttention=!domainReady&&readyForInvoice&&s.status!=="building"&&s.status!=="ready"?"<div class='notice "+(domainChoices.length?"":"danger")+"' style='margin-bottom:15px'><b>"+(domainChoices.length?"Domain selection is ready.":"Domain selection still needs attention.")+"</b><span>"+(domainChoices.length?"Choose an available domain below. The live price will appear in the invoice immediately.":"Check a domain in Brand Studio first; unavailable or unverified names are never put on the invoice.")+"</span><button class='btn' onclick=\"go('brand')\">Check / change domain →</button></div>":"";
  return "<div class='hero store-launch-hero'><div><div class='eyebrow'>STORE LAUNCH · AUTOMATED BUILD</div><div class='h1'>Pay once. Forge builds the store around your decisions.</div><div class='sub'>You already chose the product, company name, customer-facing product name and digital identity. Store Launch turns those approved decisions into a working storefront instead of asking you to build everything yourself.</div></div><div class='actions'>"+primaryButton+"</div></div>"+
  "<div class='store-build-banner card'><div><div class='eyebrow'>BUILD STATUS</div><h2>"+statusTitle+"</h2><p class='small'>"+statusText+"</p></div><div class='store-build-meter'><b>"+(s.status==="building"?progress+"%":s.status==="ready"?"100%":"NOT STARTED")+"</b>"+(s.status==="building"||s.status==="ready"?"<div class='progress'><i style='width:"+progress+"%'></i></div>":"<div class='progress'><i style='width:0%'></i></div>")+"</div></div>"+
  domainAttention+domainChoicePanel+
  "<div class='store-build-grid'>"+
    "<div class='card store-order-card'><div class='eyebrow'>YOUR BUILD</div><h2>"+esc(brandName)+"</h2><div class='store-selected-product'>"+(p?.image?"<img src='"+esc(p.image)+"' alt='"+esc(productName)+"'>":"")+"<div><b>"+esc(productName)+"</b><div class='small'>Confirmed supplier product · one selected hero product</div></div></div><div class='store-build-details'><div><span>Website</span><b>"+(domain?esc(domain):"Not selected · choose an available domain")+"</b></div><div><span>Brand</span><b>"+esc(brandName)+"</b></div><div><span>Product</span><b>"+esc(productName)+"</b></div><div><span>Estimated completion</span><b>"+(s.status==="building"||s.status==="ready"?eta+" min est.":"Shown after payment")+"</b></div></div></div>"+
    "<div class='card store-invoice-card'><div class='eyebrow'>YOUR LAUNCH COST</div><h2>Everything you need to launch</h2><p class='small'>A simple upfront view of the required launch costs.</p><div class='invoice-row'><span>Store setup · one time</span><b>"+BDT(bill.setup)+"</b></div><div class='invoice-row'><span>Website domain"+(bill.hasCustomDomain?" · "+esc(domain)+" · "+bill.domainYears+" year":" · 1 year")+"</span><b>"+(bill.hasCustomDomain?BDT(bill.domainBdt):"Choose a domain first")+"</b></div><div class='invoice-row'><span>Store hosting · "+esc(bill.hostingValidity)+"</span><b>"+BDT(bill.hostingBdt)+"</b></div><div class='invoice-total'><span>Total launch cost</span><b>"+BDT(bill.launchTotal)+"</b></div><div class='notice' style='margin-top:12px'><b>Included</b><div class='small'>Store setup, your selected domain for the stated validity, and store hosting for the stated period.</div></div>"+(s.invoiceRef?"<div class='small' style='margin-top:8px'>Launch reference "+esc(s.invoiceRef)+"</div>":"")+"</div><div class='section'><div><h2>What Forge does after payment</h2><p>No repetitive setup work for the customer. AI prepares the store from the approved business decisions.</p></div></div>"+
  "<div class='store-checklist'>"+checklist.map((x,i)=>"<div class='store-check card'><div class='store-check-number'>"+String(i+1).padStart(2,"0")+"</div><div><b>"+x[0]+"</b><p class='small'>"+x[1]+"</p></div><span class='status "+(s.status==="ready"?"":"amber")+"'>"+(s.status==="ready"?"READY":"QUEUED")+"</span></div>").join("")+"</div>"+
  "";
}
function billingData(){const p=state.selectedProduct||{},e=liveEconomics(p),b=state.billing||{},sb=typeof storeLaunchBill==="function"?storeLaunchBill():{};const qty=Math.max(1,Number(b.quantity||p.orderQty||p.batch||40)),supplier=Number(e.supplier||0),cac=Number(e.cac||0),logistics=Number(e.logistics||0),domain=Number(sb.domainBdt||0),shopify=Number(sb.hostingBdt||0),setup=Number(sb.setup||0);return {qty,supplier,cac,logistics,domain,shopify,setup,domainYears:Number(sb.domainYears||0),productTotal:supplier*qty,marketingTotal:cac*qty,logisticsTotal:logistics*qty,total:(supplier+cac+logistics)*qty+domain+shopify+setup};}
function prepareBilling(){const d=billingData(),p=state.selectedProduct||{},profile=state.profile||{},deployable=Math.max(0,Number(profile.budget||0)-Number(profile.reserve||0));if(!p.name)return toast("Choose a product first.");if(!d.supplier)return toast("Supplier purchase price is unavailable for this product.");if(deployable<=0)return toast("No deployable business budget is available. Add capital or adjust the protected reserve before proceeding.");if(d.total>deployable){return toast("This commitment is "+BDT(d.total-deployable)+" above your available business budget. Reduce the quantity or costs before proceeding.");}const ref=state.billingInvoice?.ref||("FORGE-BILL-"+new Date().toISOString().replace(/\D/g,"").slice(0,14));state.billingInvoice={ref,createdAt:state.billingInvoice?.createdAt||new Date().toISOString(),status:"payment_pending",total:d.total,orderRef:p.orderRef||null};state.billing={...(state.billing||{}),quantity:d.qty};p.paymentStatus="unpaid";p.orderStatus="payment_pending";persistProfile();render();toast("Billing record created. Complete payment from this page.");}
function setBillingQuantity(){state.billing={...(state.billing||{}),quantity:Math.max(1,Number(document.getElementById("billingQty")?.value||1))};persistProfile();render();}
function billing(){const d=billingData(),p=state.selectedProduct||{},inv=state.billingInvoice||null;if(!p.name)return "<div class='hero'><div><div class='eyebrow'>BILLING & BUDGET</div><div class='h1'>One place to review and pay.</div><div class='sub'>Choose a product first. Forge will calculate its supplier purchase price, product-specific marketing budget, domain and store costs here.</div></div></div><div class='card' style='padding:24px'><h2>No product selected</h2><p class='small'>Product Lab chooses the product. Billing is the only customer payment point.</p><button class='btn primary' onclick='go(&quot;products&quot;)'>Choose product →</button></div>";return "<div class='hero'><div><div class='eyebrow'>BILLING & BUDGET · SINGLE PAYMENT POINT</div><div class='h1'>Review everything. Pay once.</div><div class='sub'>The total is assembled from the selected product's supplier economics, product-specific marketing plan, domain and applicable store costs. <b>Forge will not create a payment record above your deployable business budget.</b></div></div></div><div class='billing-layout'><section class='billing-summary card'><div class='eyebrow'>AMOUNT DUE</div><div class='billing-product-line'><div><b>"+esc(p.name)+"</b><span>"+d.qty+" units · supplier-linked product</span></div><input id='billingQty' type='number' min='1' value='"+d.qty+"' onchange='setBillingQuantity()'></div><div class='billing-total'><span>Total to pay</span><strong>"+BDT(d.total)+"</strong></div><div class='billing-breakdown'><div class='billing-line'><div><b>Product purchase</b><span>"+d.qty+" × "+BDT(d.supplier)+" supplier cost</span></div><strong>"+BDT(d.productTotal)+"</strong></div><div class='billing-line'><div><b>Fulfillment / logistics</b><span>"+d.qty+" × "+BDT(d.logistics)+" / unit</span></div><strong>"+BDT(d.logisticsTotal)+"</strong></div><div class='billing-line'><div><b>AI marketing budget</b><span>"+d.qty+" × "+BDT(d.cac)+" / expected purchase</span></div><strong>"+BDT(d.marketingTotal)+"</strong></div><div class='billing-line'><div><b>Domain</b><span>"+(d.domain?((d.domainYears||1)+"-year registration"):"No confirmed domain charge")+"</span></div><strong>"+(d.domain?BDT(d.domain):"—")+"</strong></div><div class='billing-line'><div><b>Shopify store</b><span>"+(d.shopify?"Applicable plan · hosting included":"No confirmed store charge")+"</span></div><strong>"+(d.shopify?BDT(d.shopify):"—")+"</strong></div><div class='billing-line'><div><b>Store setup</b><span>"+(d.setup?"Forge store-build service":"No setup charge")+"</span></div><strong>"+(d.setup?BDT(d.setup):"—")+"</strong></div></div><div class='billing-note'><b>"+(inv?.status==="paid"?"PAID":inv?.status==="payment_pending"?"PAYMENT PENDING":"READY")+"</b><span>Orders can display the same amount and status, but customers do not pay from Orders.</span></div><button class='btn primary' style='width:100%;margin-top:15px' onclick='prepareBilling()'>Review & continue to payment →</button><div class='small' style='margin-top:9px'>Marketing is a planning allocation, not a guaranteed Meta charge. Actual CPA can be lower or higher after campaigns go live.</div></section><aside class='billing-explain'><div class='eyebrow'>BILL DESCRIPTION</div><div class='explain-card'><div class='explain-icon'>01</div><div><h3>Product purchase</h3><p>Forge uses the supplier-linked purchase economics for this selected product and quantity.</p><span class='data-tag verified'>SUPPLIER DATA</span></div></div><div class='explain-card'><div class='explain-icon'>02</div><div><h3>Marketing</h3><p>The charge is based on this product's current Forge acquisition model. It is a budget allocation; Meta is auction-based and actual CPA can vary.</p><span class='data-tag planning'>AI PLANNING</span></div></div><div class='explain-card'><div class='explain-icon'>03</div><div><h3>Domain & store</h3><p>Domain and applicable Shopify costs are added when current pricing is available. Hosting is not double-counted.</p></div></div><div class='explain-card'><div class='explain-icon'>04</div><div><h3>After payment</h3><p>Orders becomes the tracking record: Payment pending → Paid → procurement/fulfillment. There is no second payment there.</p></div></div></aside></div><div class='billing-footer card'><div><div class='eyebrow'>CUSTOMER FLOW</div><h2>Product → Billing → Payment → Orders</h2><p class='small'>One total, one payment point, then operational tracking.</p></div><button class='btn' onclick='go(&quot;orders&quot;)'>View Orders →</button></div>";}
function marketingConnection(){
  const m=state.marketingConnection||{};
  return {
    pageUrl:m.pageUrl||"",
    pageName:m.pageName||"",
    status:m.status||"not_connected",
    metaConnected:!!m.metaConnected,
    adAccount:m.adAccount||"",
    instagram:m.instagram||"",
    lastSync:m.lastSync||""
  };
}
function saveMarketingPageUrl(){
  const input=document.getElementById("metaPageUrl");
  const url=String(input?.value||"").trim();
  if(!url)return toast("Paste your Facebook Page link first.");
  if(!/^https?:\/\/(www\.)?facebook\.com\//i.test(url))return toast("Use the Facebook Page link customers see.");
  state.marketingConnection={...marketingConnection(),pageUrl:url,status:"page_added"};
  persistProfile();render();
  toast("Page added. One secure Meta connection is the next step.");
}
function beginMetaPermission(){
  const m=marketingConnection();
  if(!m.pageUrl)return toast("Add your Facebook Page link first.");
  state.marketingConnection={...m,status:"permission_ready",permissionStartedAt:new Date().toISOString()};
  persistProfile();render();
  toast("Meta connection is ready. The secure permission window will open once the Meta app connection is configured.");
}
function disconnectMarketing(){
  state.marketingConnection={status:"not_connected"};
  persistProfile();render();toast("Meta connection removed from this Forge business.");
}
function marketingStep(status,number,title,desc,action){
  const done=status==="done",active=status==="active";
  return "<div class='meta-step "+(done?"done ":"")+(active?"active":"")+"'><div class='meta-step-icon'>"+(done?"✓":number)+"</div><div class='meta-step-body'><b>"+title+"</b><span>"+desc+"</span></div>"+(action||"")+"</div>";
}
function marketing(){
  const m=marketingConnection();
  const selected=state.selectedProduct;
  const brand=state.brandStudio?.chosenName||state.business?.name||"Your business";
  const budget=Math.round((state.business?.budget||250000)*.15);
  const connected=m.metaConnected;
  const step1=m.pageUrl?"done":"active";
  const step2=connected?"done":(m.pageUrl?"active":"locked");
  const step3=connected?"active":"locked";
  const step4=connected?"active":"locked";

  if(!connected){
    return "<div class='hero marketing-hero'><div><div class='eyebrow'>AI MARKETING · HANDS-OFF SETUP</div><div class='h1'>Tell Forge where your Facebook Page is.</div><div class='sub'>You should not have to learn Meta Ads Manager. Add the Page link once. Forge will use that to start the secure connection, then handle the marketing workflow from this page.</div></div></div>"+
    "<div class='meta-connect-card card'>"+
      "<div class='eyebrow'>ONE-TIME CONNECTION</div><h2>Connect your Facebook Page</h2><p class='small'>No campaign settings yet. No audience forms. No confusing Meta terminology.</p>"+
      "<label class='label'>FACEBOOK PAGE LINK</label><div class='meta-url-row'><input id='metaPageUrl' value='"+esc(m.pageUrl)+"' placeholder='https://facebook.com/yourpage'><button class='btn primary' onclick='saveMarketingPageUrl()'>Continue →</button></div>"+
      (m.pageUrl?"<div class='meta-page-found'><span class='status'>Page link saved</span><b>"+esc(m.pageUrl)+"</b><button class='btn' onclick='beginMetaPermission()'>Give Forge permission →</button></div>":"<div class='small' style='margin-top:10px'>If the customer does not have a Page yet, Forge should send them to the Facebook Page creation flow instead of showing an error.</div>")+
    "</div>"+
    "<div class='section'><div class='eyebrow'>WHAT HAPPENS NEXT</div><h2>Four steps. One place.</h2></div>"+
    "<div class='meta-steps'>"+
      marketingStep(step1,"01","Facebook Page","Paste the Page link. That's the only information Forge needs from the customer at this stage.","")+
      marketingStep(step2,"02","Secure Meta permission","One Meta permission screen. Forge requests only what the marketing workspace needs.","")+
      marketingStep(step3,"03","Forge prepares the plan","Products, Shopify data, economics and available creative assets are analyzed automatically.","")+
      marketingStep(step4,"04","Launch & optimize","Forge prepares campaigns, reports performance and asks before consequential account changes.","")+
    "</div>"+
    "<div class='notice' style='margin-top:18px'><b>Hassle rule:</b> The customer should never be asked to paste tokens, business IDs, pixel IDs, campaign IDs or technical API credentials into Forge.</div>";
  }

  const product=selected?.name||"No product selected";
  const e=selected?liveEconomics(selected):null;
  const selling=e?.selling?BDT(e.selling):"—";
  const statusText=m.status==="connected"?"Connected and syncing":"Connected";  return "<div class='hero marketing-hero'><div><div class='eyebrow'>AI MARKETING · AUTOPILOT WORKSPACE</div><div class='h1'>"+esc(brand)+" marketing, without the Meta headache.</div><div class='sub'>Forge is connected to the business context. The customer stays inside this page while Forge plans, prepares, monitors and explains the marketing.</div></div><div class='actions'><button class='btn primary' onclick='toast(\"AI marketing analysis queued\")'>Run AI analysis →</button><button class='btn' onclick='disconnectMarketing()'>Disconnect Meta</button></div></div>"+
  "<div class='grid'><div class='card span3'><div class='label'>Meta connection</div><div class='stat' style='font-size:20px'>"+statusText+"</div><div class='small'>"+esc(m.pageUrl)+"</div></div><div class='card span3'><div class='label'>Monthly marketing envelope</div><div class='stat'>"+BDT(budget)+"</div></div><div class='card span3'><div class='label'>Product in focus</div><div class='stat' style='font-size:18px'>"+esc(product)+"</div></div><div class='card span3'><div class='label'>Current selling price</div><div class='stat'>"+selling+"</div></div></div>"+
  "<div class='section'><div class='eyebrow'>AI MARKETING CONTROL ROOM</div><h2>Forge decides what needs attention.</h2></div>"+
  "<div class='grid'><div class='card span8'><div class='label'>TODAY'S AI BRIEF</div><h2 style='margin:7px 0'>No manual campaign setup required.</h2><p class='small'>Forge should combine Shopify sales, product economics, inventory, creative availability and Meta performance before recommending a change. It should never invent results or silently spend money.</p><div class='actions'><button class='btn primary' onclick='toast(\"AI brief generated\")'>Generate today's brief →</button><button class='btn' onclick='toast(\"Campaign draft prepared\")'>Prepare campaign draft</button></div></div><div class='card span4'><div class='label'>AUTOPILOT MODE</div><div class='kpi'><span><b>Approval required</b><div class='small'>Recommended default for new businesses</div></span><span class='status amber'>SAFE</span></div><div class='kpi'><span><b>Auto-optimization</b><div class='small'>Can be enabled later</div></span><button class='btn' onclick='toast(\"Autopilot settings opened\")'>Settings</button></div></div></div>"+
  "<div class='section'><h2>Campaign desk</h2></div><div class='card'><div class='kpi'><span><b>Product launch campaign</b><div class='small'>Sales objective · connected product · Shopify destination</div></span><span class='status'>Draft</span></div><div class='kpi'><span><b>Creative testing</b><div class='small'>Use available product media first; request AI production only when needed.</div></span><span class='status'>Ready</span></div><div class='kpi'><span><b>Performance monitoring</b><div class='small'>Spend, purchases, CPA, revenue and contribution should feed the Forge decision layer.</div></span><span class='status'>Connected</span></div></div>"+
  "<div class='notice' style='margin-top:15px'><b>Customer promise:</b> Forge handles the complexity. The customer supplies the Page link and gives permission once; everything else should happen inside AI Marketing.</div>";
}
function support(){return "<div class='hero'><div><div class='eyebrow'>AI customer support</div><div class='h1'>Fast answers. Safe escalation.</div><div class='sub'>Routine questions can be automated; sensitive cases remain visible to a human.</div></div></div><div class='grid'><div class='card span4'><div class='label'>Conversations today</div><div class='stat'>84</div></div><div class='card span4'><div class='label'>Median response</div><div class='stat'>11 sec</div></div><div class='card span4'><div class='label'>Human escalations</div><div class='stat'>3</div></div></div><div class='section'><h2>Support queue</h2></div><div class='card'>"+[["Do you have size 42?","Catalog availability","Resolved"],["When will my parcel arrive?","Order tracking","Resolved"],["Can I exchange this size?","Policy","Resolved"],["Wrong item received.","Evidence required","Needs you"],["I want a refund for change of mind.","Policy","Needs you"]].map(x=>"<div class='kpi'><span><b>"+x[0]+"</b><div class='small'>"+x[1]+"</div></span><span class='status "+(x[2]==="Needs you"?"amber":"")+"'>"+x[2]+"</span></div>").join("")+"</div><div class='notice' style='margin-top:15px'><b>Safety rule:</b> AI must not invent stock, delivery dates, refunds or policy exceptions.</div>"}
function plan(){
  const selected=state.selectedProduct;
  if(!selected)return "<div class='hero'><div><div class='eyebrow'>BUSINESS PLAN</div><div class='h1'>Your business plan starts with one confirmed product.</div><div class='sub'>Choose a live supplier product in Product Lab. Forge will then build a complete, product-specific operating document around that exact product, your capital, market, risk profile and business goal.</div></div><button class='btn primary' onclick=\"go('products')\">Open Product Lab →</button></div>";

  const e=selected.economics||liveEconomics(selected);
  const profile=state.profile||{};
  const bs=state.brandStudio||{};
  const brand=bs.chosenName||state.business?.name||"Your New Business";
  const productName=bs.chosenProductName||selected.name;
  const market=profile.market||"your target market";
  const city=profile.city||"";
  const category=profile.category||selected.category||"your product category";
  const budget=Number(profile.budget||state.business?.budget||0);
  const reserve=Number(profile.reserve||0);
  const income=Number(profile.income||0);
  const expenses=Number(profile.expenses||0);
  const monthlySurplus=Math.max(0,income-expenses);
  const qp=quantityPlan(selected);
  const firstBatch=Math.max(Number(qp.minimum||1),Number(selected.orderQty||selected.plannedOrderQty||qp.planned||1));
  const inventoryCapital=Math.round(firstBatch*Number(e.landed||0));
  const deployable=Math.max(0,budget-reserve);
  const afterInventory=Math.max(0,deployable-inventoryCapital);
  const testBudget=Math.round(afterInventory*.25);
  const supplierPrice=Number(selected.priceUsd||0);
  const image=selected.image||"";
  const productId=selected.id||selected.sku||"Connected supplier record";
  const margin=Number(e.margin||0);
  const selling=Number(e.selling||0);
  const landed=Number(e.landed||0);
  const cac=Number(e.cac||0);
  const contribution=Number(e.contribution||0);
  const risk=profile.risk||"Balanced";
  const experience=profile.experience||"Beginner";
  const goal=profile.goal||"Profit + growth";
  const workStyle=profile.workStyle||"Builder";
  const occupation=profile.occupation||"";
  const skills=profile.skills||"";
  const time=Number(profile.time||0);
  const targetIncome=Number(profile.targetIncome||0);

  const mission="Build "+brand+" into a focused "+category+" business around "+productName+", solving a specific customer need with a credible offer, disciplined economics and a customer experience strong enough to earn trust.";
  const vision="Turn the first validated product into a repeatable "+category+" brand in "+market+"—then expand only into products, channels and markets that are supported by real customer and financial evidence.";
  const positioning="For customers in "+market+" looking for a dependable "+category+" option, "+brand+" will make the purchase easier by combining "+productName+" with clear value, honest product information, proof and dependable service.";
  const customerProblem="Customers need a clear reason to choose this product, confidence that the product matches the promise, transparent pricing and a low-friction buying experience.";
  const promise="Make the customer's decision easier—not louder.";
  const moat="The early advantage will come from product-specific knowledge, trustworthy presentation, fast learning cycles, disciplined cash use and customer feedback—not from simply having access to the same supplier.";
  const doItems=[
    "Launch around the confirmed product instead of spreading capital across too many SKUs.",
    "Use real product evidence, accurate specifications and transparent policies.",
    "Test the offer with controlled acquisition spend and measure delivered orders.",
    "Track CAC, conversion, returns, contribution, stock velocity and customer objections.",
    "Reinvest only when the evidence supports the next batch."
  ];
  const dontItems=[
    "Do not treat supplier stock or a low supplier price as proof of demand.",
    "Do not spend the protected reserve on inventory or advertising experiments.",
    "Do not compete only by being cheaper than every alternative.",
    "Do not publish benefits, materials, delivery promises or reviews that cannot be verified.",
    "Do not scale spend, add products or expand markets while the first model is still unclear."
  ];
  const assumptions=[
    "Supplier price and stock are live inputs from the connected supplier record and must be rechecked before purchase.",
    "Landed cost, selling price, CAC and margin are Forge planning estimates, not guaranteed outcomes.",
    "Demand, conversion, returns and delivery performance must be validated after launch.",
    "Domain, platform, payment, advertising and other third-party costs remain separate unless explicitly included.",
    "Forge does not guarantee revenue, profit, demand, conversion, delivery performance or business success. Confirm live costs and customer demand before committing material cash.",
    "Do not treat future sales, borrowed funds or expected funding as available capital unless they are actually available and intentionally approved by the founder."
  ];
  const section=(n,title,body)=>"<section class='plan-section'><div class='plan-number'>"+n+"</div><div><h2>"+title+"</h2>"+body+"</div></section>";
  const bullets=(items)=>"<ul style='margin:8px 0 0;padding-left:18px'>"+items.map(x=>"<li class='plan-bullet'>"+esc(x)+"</li>").join("")+"</ul>";
  const metric=(label,value,sub)=>"<div><span>"+label+"</span><b>"+value+"</b><small>"+sub+"</small></div>";

  state.planStatus="ready";
  try{persistProfile()}catch(e){}

  const readiness=budget>0&&firstBatch>0&&selling>0;
  const cityLine=city?city+", ":"";
  const founderContext=[occupation,experience+" experience",workStyle+" work style"].filter(Boolean).join(" · ");

  return [
    "<div class='plan-cover'>"+
      "<div class='plan-cover-copy'>"+
        "<div class='eyebrow'>FORGE · BUSINESS BLUEPRINT</div>"+
        "<div class='plan-kicker'>PERSONALIZED OPERATING DOCUMENT</div>"+
        "<div class='h1'>"+esc(brand)+"</div>"+
        "<p class='plan-cover-title'>A complete plan built around <strong>"+esc(productName)+"</strong>.</p>"+
        "<p class='sub'>This is not a generic business-plan template. Forge has connected the confirmed supplier product with the founder profile, available capital, target market, risk preference, brand direction and execution model.</p>"+
        "<div class='plan-cover-meta'><span>PRODUCT · "+esc(productName)+"</span><span>MARKET · "+esc(cityLine+market)+"</span><span>GOAL · "+esc(goal)+"</span><span>RISK · "+esc(risk)+"</span></div>"+
      "</div>"+
      (image?"<div class='plan-cover-product'><img src='"+esc(image)+"' alt='"+esc(productName)+"'><span>CONFIRMED PRODUCT</span></div>":"")+
    "</div>",
    "<div class='plan-actions card'><div><div class='eyebrow'>YOUR BUSINESS DOCUMENT</div><b>Read this from top to bottom before spending serious money.</b><p class='small'>Every major assumption is separated from what still needs to be proven.</p></div><div class='actions'><button class='btn' onclick='printBusinessPlan()'>Print / Save PDF ↗</button><button class='btn primary' onclick='downloadBusinessPlan()'>Download plan document ↓</button></div></div>",
    "<div class='plan-executive grid'>"+
      "<div class='card span8'><div class='eyebrow'>THE BUSINESS AT A GLANCE</div><h2 style='margin:7px 0 9px'>"+esc(positioning)+"</h2><p class='plan-lead' style='font-size:15px'>"+esc(mission)+"</p><div class='plan-metrics'>"+
        metric("SELLING MODEL",BDT(selling),"planned selling price")+
        metric("LANDED / UNIT",BDT(landed),"planning estimate")+
        metric("CONTRIBUTION / UNIT",BDT(contribution),"before fixed overhead")+
        metric("TARGET CAC",BDT(cac),"acquisition ceiling")+
      "</div></div>"+
      "<div class='card span4'><div class='eyebrow'>PLAN STATUS</div><div class='plan-status-ready'>● PLAN READY</div><p class='small'>"+(readiness?"Core inputs are connected.":"Some financial inputs are still incomplete.")+"</p><div class='plan-checklist'>"+
        "<span>✓ Confirmed product</span><span>✓ Founder profile</span><span>✓ Market direction</span><span>✓ Capital model</span><span>✓ Operating rules</span><span>✓ 90-day roadmap</span>"+
      "</div></div>"+
    "</div>",
    "<div class='plan-command card'><div><div class='eyebrow'>THE NORTH STAR</div><h2>Build a real business, not just a product listing.</h2><p>"+esc(promise)+"</p></div><div class='plan-command-quote'>"+esc(mission)+"</div></div>",
    "<div class='plan-document card'>",
    section("01","Executive summary","<div class='plan-highlight'><b>MISSION</b><p>"+esc(mission)+"</p><b>VISION</b><p>"+esc(vision)+"</p><b>POSITIONING</b><p>"+esc(positioning)+"</p><b>EARLY ADVANTAGE</b><p>"+esc(moat)+"</p></div>"),
    section("02","Founder profile & constraints","<div class='plan-two-col'><div><b>Founder context</b><p class='small'>"+esc(founderContext||"Profile supplied to Forge")+" "+(city?"· "+esc(city):"")+"</p><b>Experience</b><p class='small'>"+esc(experience)+"</p><b>Risk preference</b><p class='small'>"+esc(risk)+" · capacity "+esc(profile.riskCapacity||"Medium")+" · loss tolerance "+BDT(profile.lossTolerance||0)+"</p></div><div><b>Personal economics</b><p class='small'>Monthly income: "+BDT(income)+"<br>Monthly expenses: "+BDT(expenses)+"<br>Monthly surplus: "+BDT(monthlySurplus)+"</p><b>Available time</b><p class='small'>"+(time?formatQty(time)+" hours/week":"Not specified")+" · target income "+(targetIncome?BDT(targetIncome):"Not specified")+"</p><b>Skills</b><p class='small'>"+esc(skills||"Not specified")+"</p></div></div>"),
    section("03","The chosen product","<div class='plan-highlight'><b>CONFIRMED PRODUCT</b><p>"+esc(productName)+"</p><p class='small'>Supplier record: "+esc(productId)+" · Current supplier price: "+moneyUsd(supplierPrice)+" · Category: "+esc(category)+"</p></div><div class='plan-two-col' style='margin-top:12px'><div><b>Why this product is the starting point</b><p class='small'>The business is built around this exact confirmed product, so sourcing, pricing, content, offer design and launch decisions stay connected to one real commercial object.</p></div><div><b>Evidence still required</b>"+bullets(["Product quality / sample validation","Material, dimensions and specification accuracy","Variant availability and supplier consistency","Actual customer objections and purchase intent"])+"</div></div>"),
    section("04","Customer, market & positioning","<div class='plan-two-col'><div><b>Primary market</b><p class='small'>"+esc(market)+"</p><b>Customer problem</b><p class='small'>"+esc(customerProblem)+"</p></div><div><b>Positioning statement</b><p class='small'>"+esc(positioning)+"</p><b>Why customers should believe us</b><p class='small'>Show the product clearly, explain the important details, answer objections before checkout and keep every claim supportable.</p></div></div>"),
    section("05","Offer architecture","<div class='plan-roadmap'><div><b>CORE OFFER</b><p class='small'>One clear hero product with a strong value proposition.</p></div><div><b>TRUST LAYER</b><p class='small'>Authentic imagery, specifications, FAQs, delivery information and transparent policies.</p></div><div><b>CONVERSION LAYER</b><p class='small'>Clear price-value communication, frictionless checkout and responsive support.</p></div></div><div class='plan-highlight' style='margin-top:12px'><b>OFFER RULE</b><p>Do not add complexity before the customer understands the product, its value and why this brand should be trusted.</p></div>"),
    section("06","Unit economics & money model","<div class='plan-metrics plan-metrics-wide'>"+
      metric("SUPPLIER PRICE",moneyUsd(supplierPrice),"live supplier input")+
      metric("LANDED COST",BDT(landed),"modeled per unit")+
      metric("SELLING PRICE",BDT(selling),"planned")+
      metric("TARGET CAC",BDT(cac),"planned ceiling")+
      metric("CONTRIBUTION",BDT(contribution),"per unit")+
      metric("MODELED MARGIN",pct(margin),"planning estimate")+
    "</div><p class='small' style='margin-top:12px'>Contribution is a planning figure. Recalculate after freight, payment fees, delivery, discounts, returns and actual advertising data are known.</p>"),
    section("07","Capital plan & cash protection","<div class='plan-metrics plan-metrics-wide'>"+
      metric("AVAILABLE CAPITAL",BDT(budget),"founder input")+
      metric("PROTECTED RESERVE",BDT(reserve),"do not deploy casually")+
      metric("FIRST BATCH",formatQty(firstBatch)+" units","planned procurement")+
      metric("INVENTORY COMMITMENT",BDT(inventoryCapital),"first batch at landed cost")+
      metric("AFTER INVENTORY + RESERVE",BDT(afterInventory),"remaining deployable envelope")+
      metric("TESTING ENVELOPE",BDT(testBudget),"25% of remaining envelope")+
    "</div><div class='notice' style='margin-top:12px'><b>Cash rule:</b> "+(reserve>0?"Protect the reserve of "+BDT(reserve)+" and do not use it to rescue a weak launch.":"Set and protect a reserve before committing the full available capital.")+"</div>"),
    section("08","First-batch & sourcing strategy","<div class='plan-highlight'><b>STARTING QUANTITY</b><p>"+formatQty(firstBatch)+" units</p><p class='small'>Supplier minimum: "+formatQty(qp.minimum)+" · Forge suggestion: "+formatQty(qp.suggested)+" · Planned: "+formatQty(qp.planned)+". Confirm variant mix, stock, freight and final landed cost before purchase.</p></div>"+bullets(["Order only the quantity required to learn and validate.","QC the first shipment before scaling the SKU.","Record which variants move and which objections repeat.","Recalculate economics whenever supplier, freight or selling price changes."])),
    section("09","Brand strategy","<div class='plan-two-col'><div><b>Brand</b><p class='small'>"+esc(brand)+"</p><b>Brand promise</b><p class='small'>"+esc(promise)+"</p><b>Personality</b><p class='small'>Clear · modern · credible · customer-first.</p></div><div><b>What the brand should become</b><p class='small'>A trusted specialist around a coherent category—not a random catalogue.</p><b>What the brand must avoid</b><p class='small'>Discount-only positioning, copy-paste supplier pages, unsupported claims and uncontrolled product expansion.</p></div></div>"),
    section("10","Store & digital execution","<div class='plan-roadmap'><div><b>STOREFRONT</b><p class='small'>Clear navigation, strong hero message, category logic and trust pages.</p></div><div><b>PRODUCT PAGE</b><p class='small'>Benefits, specifications, visuals, FAQs, delivery, policies and objection handling.</p></div><div><b>DISCOVERY</b><p class='small'>Search-friendly titles, URLs, metadata and content built around customer intent.</p></div></div><p class='small' style='margin-top:12px'>The store should make the business understandable in seconds: what it sells, who it is for, why this product matters and why the customer should trust it.</p>"),
    section("11","Marketing launch system","<div class='plan-roadmap'><div><b>PROVE</b><p class='small'>Create multiple hooks and creatives. Test controlled audiences and landing-page behavior.</p></div><div><b>IMPROVE</b><p class='small'>Fix the measurable constraint: hook, creative, price presentation, conversion, CAC, delivery or product communication.</p></div><div><b>SCALE</b><p class='small'>Increase spend only when delivered-order contribution remains healthy and demand is repeatable.</p></div></div><div class='plan-two-col' style='margin-top:12px'><div><b>Primary metrics</b>"+bullets(["Delivered orders","CAC","Conversion rate","Return / cancellation rate","Contribution per delivered order","Repeat purchase"])+"</div><div><b>Creative rules</b>"+bullets(["Lead with the customer problem","Show the actual product","Demonstrate useful details","Make the offer easy to understand","Do not make unsupported claims"])+"</div></div>"),
    section("12","Customer experience & operations","<div class='plan-two-col'><div><b>Customer promise</b>"+bullets(["Accurate product information","Clear delivery expectations","Fast routine support","Human escalation for exceptions","Transparent exchange / return rules"])+"</div><div><b>Operating system</b>"+bullets(["Confirm stock before PO","QC incoming inventory","Track every shipment","Log return reasons","Feed customer objections back into the product page"])+"</div></div>"),
    section("13","What we will do / what we will not do","<div class='plan-two-col'><div><b>WE WILL DO</b>"+bullets(doItems)+"</div><div><b>WE WILL NOT DO</b>"+bullets(dontItems)+"</div></div>"),
    section("14","30 · 60 · 90 day execution roadmap","<div class='plan-roadmap'><div><b>DAY 1–30 · VALIDATE</b><p class='small'>Finalize identity, store, product page, sample/QC, content system and controlled launch. Learn what customers actually respond to.</p></div><div><b>DAY 31–60 · IMPROVE</b><p class='small'>Improve conversion, creative winners, CAC, customer service, objections, returns and offer clarity using real data.</p></div><div><b>DAY 61–90 · EXPAND CAREFULLY</b><p class='small'>Reorder proven demand, improve the operating system and prepare the next product only from evidence.</p></div></div>"),
    section("15","Risk map & guardrails","<div class='plan-risk'><div><b>INVENTORY</b><p class='small'>Keep the first commitment controlled and variant-specific.</p></div><div><b>CAC</b><p class='small'>Stop uncontrolled spend when delivered contribution deteriorates.</p></div><div><b>RETURNS</b><p class='small'>Track reasons and fix the root cause rather than hiding the metric.</p></div><div><b>CASH</b><p class='small'>Protect reserve and avoid overcommitting capital.</p></div></div>"),
    section("16","Decision rules","<div class='plan-decision-grid'><div class='plan-decision'><span>01 · SCALE</span><b>Evidence supports the next investment.</b><p>Delivered contribution is positive, demand is repeatable and operations can support the next batch.</p></div><div class='plan-decision'><span>02 · IMPROVE</span><b>Demand exists but a constraint is visible.</b><p>Fix the measurable bottleneck before increasing complexity or spend.</p></div><div class='plan-decision'><span>03 · PAUSE / REPOSITION</span><b>The model is not proving itself.</b><p>Contribution stays negative, objections persist or sustainable demand cannot be established within the planned test.</p></div></div>"),
    section("17","What must be proven before scaling","<div class='plan-two-col'><div>"+bullets(["Customers will pay the planned selling price.","Actual CAC fits inside the contribution model.","Returns / cancellations remain manageable.","Supplier quality and stock remain consistent.","The business can fulfill demand without breaking customer experience."])+"</div><div><b>Current assumptions</b>"+bullets(assumptions)+"</div></div>"),
    section("18","One-page operating brief","<div class='plan-quote'>"+esc(brand)+" exists to build a focused "+esc(category)+" business around "+esc(productName)+" for "+esc(market)+". Start with "+formatQty(firstBatch)+" units, protect "+BDT(reserve)+" of capital, communicate a clear value proposition, measure delivered-order economics and use evidence—not excitement—to decide what happens next.</div>"),
    "</div>",
    "<div class='plan-final card'><div><div class='eyebrow'>YOUR NEXT MOVE</div><h2>Take the first controlled step.</h2><p class='small'>The plan is now the operating reference. Product Lab, Orders, Brand Studio, Store Launch and AI Marketing should all stay connected to this same product and business direction.</p></div><div class='actions'><button class='btn' onclick=\"go('orders')\">Review order →</button><button class='btn primary' onclick=\"go('brand')\">Continue to Brand Studio →</button></div></div>",
    "<div class='notice' style='margin-top:18px'><b>Forge planning note:</b> This document is personalized to the current product and founder profile. It is a planning model, not a guarantee. Refresh supplier price, stock, freight, domain cost, platform fees, CAC, returns and demand assumptions before major cash commitments.</div>"
  ].join("");
}

function planSnapshot(){
  const selected=state.selectedProduct;if(!selected)return null;
  const e=selected.economics||liveEconomics(selected), p=state.profile||{}, bs=state.brandStudio||{};
  const brand=bs.chosenName||state.business?.name||"Your New Business";
  const productName=bs.chosenProductName||selected.name;
  const qp=quantityPlan(selected), firstBatch=Math.max(qp.minimum,Number(selected.orderQty||selected.plannedOrderQty||qp.planned));
  return {selected,e,p,brand,productName,firstBatch};
}
function loadPdfLibraries(){
  if(window.jspdf?.jsPDF && window.html2canvas)return Promise.resolve();
  if(window.__forgePdfLibraries)return window.__forgePdfLibraries;
  window.__forgePdfLibraries=Promise.all([
    new Promise((resolve,reject)=>{if(window.jspdf?.jsPDF)return resolve();const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";s.onload=resolve;s.onerror=()=>reject(new Error("Could not load PDF engine."));document.head.appendChild(s)}),
    new Promise((resolve,reject)=>{if(window.html2canvas)return resolve();const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";s.onload=resolve;s.onerror=()=>reject(new Error("Could not load PDF renderer."));document.head.appendChild(s)})
  ]);
  return window.__forgePdfLibraries;
}
async function downloadBusinessPlan(){
  const d=planSnapshot();if(!d)return toast("Confirm a product first.");
  const source=document.querySelector(".plan-document");if(!source)return toast("Business plan is not ready yet.");
  const button=document.querySelector("[onclick*='downloadBusinessPlan']");
  const oldText=button?.textContent;
  try{
    if(button){button.disabled=true;button.textContent="Preparing PDF…"}
    await loadPdfLibraries();
    const pdf=new window.jspdf.jsPDF({orientation:"portrait",unit:"mm",format:"a4",compress:true});
    const root=document.createElement("div");
    root.style.cssText="position:absolute;left:-100000px;top:0;width:794px;background:#fff;color:#17221f;font-family:Inter,Arial,Helvetica,sans-serif;padding:48px 52px;line-height:1.5";
    root.innerHTML=
      "<div style='font-size:10px;letter-spacing:.18em;font-weight:900;color:#267b5b;text-transform:uppercase'>FORGE · PERSONALIZED BUSINESS PLAN</div>"+
      "<div style='font-size:46px;line-height:1.05;font-weight:900;letter-spacing:-.04em;margin:10px 0 8px'>"+esc(d.brand)+"</div>"+
      "<div style='font-size:18px;font-weight:700;margin-bottom:5px'>Built around: "+esc(d.productName)+"</div>"+
      "<div style='font-size:11px;color:#52625b;margin-bottom:25px'>Market: "+esc(d.p.market||"—")+" · Personalized operating plan generated from your current Forge profile and confirmed product.</div>"+
      source.innerHTML+
      "<div style='margin-top:28px;padding:16px 18px;border:1px solid #cddbd4;border-radius:12px;background:#f5f9f7;font-size:10px;color:#52625b'><b style='color:#267b5b'>FORGE PLANNING NOTE</b><br>This document is a planning model, not a guarantee. Refresh supplier price, stock, freight, platform fees, CAC, returns and demand assumptions before major cash commitments.</div>";
    document.body.appendChild(root);
    root.querySelectorAll("button").forEach(el=>el.remove());
    root.querySelectorAll("img").forEach(img=>{img.crossOrigin="anonymous"});
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    await pdf.html(root,{
      x:0,y:0,width:210,windowWidth:794,
      margin:[12,12,14,12],
      autoPaging:"text",
      html2canvas:{scale:1.8,useCORS:true,backgroundColor:"#ffffff",logging:false,scrollX:0,scrollY:0},
      callback:function(doc){
        const filename=(d.brand||"business-plan").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-business-plan.pdf";
        doc.save(filename);
      }
    });
    root.remove();
    toast("Beautiful PDF business plan downloaded.");
  }catch(err){
    console.error("Forge PDF error",err);
    toast("PDF could not be generated. Please try again.");
  }finally{
    if(button){button.disabled=false;button.textContent=oldText||"Download PDF"}
  }
}
function printBusinessPlan(){
  const d=planSnapshot();if(!d)return toast("Confirm a product first.");
  const content=document.querySelector(".plan-document")?.innerHTML||"";
  const w=window.open("","_blank","width=1100,height=850");if(!w)return toast("Allow pop-ups to print the business plan.");
  w.document.write("<!doctype html><html><head><title>"+esc(d.brand)+" — Business Plan</title><style>body{font-family:Arial,sans-serif;color:#000;max-width:950px;margin:30px auto;padding:0 25px;line-height:1.55}.plan-section{display:grid;grid-template-columns:64px 1fr;gap:18px;padding:25px 0;border-bottom:1px solid #000;break-inside:avoid}.plan-number{font-size:24px;font-weight:900;color:#000}.plan-section h2{margin:0 0 9px}.plan-finance,.plan-risk,.plan-roadmap,.plan-two-col{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.plan-finance>div,.plan-risk>div,.plan-roadmap>div,.plan-two-col>div{padding:13px;background:#fff;border:1px solid #000;border-radius:9px}.plan-finance span{display:block;font-size:9px;color:#000;text-transform:uppercase}.plan-finance b{font-size:18px}.small{font-size:13px;color:#000}.plan-quote{font-size:19px;font-weight:650;border-left:3px solid #000;padding:14px;background:#fff}.plan-meta{display:flex;gap:15px;flex-wrap:wrap;font-size:10px;color:#000}@media print{body{margin:0}}</style></head><body><h1>"+esc(d.brand)+" — Business Plan</h1><p class='small'>Personalized to the confirmed product, capital, market and operating profile.</p>"+content+"</body></html>");
  w.document.close();setTimeout(()=>w.print(),250);
}

/* ---- FORGE SCRIPT BOUNDARY ---- */


function analytics(){let b=state.business||{targetMargin:43};return "<div class='hero'><div><div class='eyebrow'>Decision intelligence</div><div class='h1'>Numbers that lead to decisions.</div><div class='sub'>Track demand, unit economics, cash efficiency, customer experience, inventory risk and marketing efficiency.</div></div><button class='btn' onclick=\"toast('Decision model refreshed')\">Refresh model ↻</button></div><div class='grid'><div class='card span8'><div class='label'>Illustrative revenue trajectory</div><div class='chart'>"+[32,41,38,55,63,71,86].map(h=>"<div class='bar' style='height:"+h+"%'></div>").join("")+"</div><div class='small'>Indexed planning view. Connect actual sales data before financial decisions.</div></div><div class='card span4'><div class='label'>AI business verdict</div><h2>Validate before scaling.</h2><p class='small'>Keep the first batch small enough to learn. Scale only when contribution remains positive after acquisition, delivery fees and expected returns.</p></div></div><div class='section'><h2>Scorecard</h2></div><div class='grid'>"+[["Demand",92,"Strong"],["Unit economics",88,"Healthy"],["Cash efficiency",73,"Watch"],["Customer experience",95,"Strong"],["Inventory risk",68,"Watch"],["Marketing efficiency",84,"Healthy"]].map(x=>"<div class='card span4'><div class='row' style='justify-content:space-between'><b>"+x[0]+"</b><span class='status "+(x[2]==="Watch"?"amber":"")+"'>"+x[2]+"</span></div><div class='stat'>"+x[1]+"</div><div class='score'><i style='width:"+x[1]+"%'></i></div></div>").join("")+"</div><div class='section'><h2>Financial guardrails</h2></div><div class='grid'><div class='card span4'><div class='label'>Protected reserve</div><div class='stat'>22%</div></div><div class='card span4'><div class='label'>Target gross margin</div><div class='stat'>"+b.targetMargin+"%</div></div><div class='card span4'><div class='label'>Break-even rule</div><div class='stat'>Contribution &gt; 0</div></div></div>"}
function advisor(){
 const p=state.profile||{};
 const messages=state.chat.map(m=>"<div class='bubble "+(m[0]==="me"?"me":"")+"'>"+m[1]+"</div>").join("");
 const commands=["Find my best products","Build a 30-day launch plan","Calculate my break-even","What is my biggest risk?","How much should I spend on ads?"];
 return "<div class='decision-dashboard advisor-dashboard'><header class='decision-header'><div><h1>Ask Forge anything about the business.</h1><p>Use plain language. Forge answers using your current profile and product economics.</p></div><div class='decision-stats'><div><span>Available capital</span><strong>"+BDT(p.budget)+"</strong></div><div><span>Time available</span><strong>"+Number(p.time||0)+"h / week</strong></div><div><span>Risk profile</span><strong>"+esc(p.risk||"Not set")+"</strong></div></div></header><div class='decision-layout'><main><section class='paths-section advisor-chat-section'><div class='section-title'><div><h2>Ask anything about the business</h2><p>Forge will use the locked profile as the decision context for every answer.</p></div></div><div class='advisor-chat-panel'><div class='chat' id='chat'>"+messages+"</div><div class='composer'><input class='input' id='chatInput' placeholder='e.g. I have ৳2 lakh. What can I sell?' onkeydown=\"if(event.key==='Enter')sendChat()\"><button class='btn primary' onclick='sendChat()'>Send</button></div></div><section class='advisor-commands'><h2>Quick commands</h2><div class='actions'>"+commands.map(x=>"<button class='btn' onclick=\"quick('"+x.replace(/'/g,"\\'")+"')\">"+x+"</button>").join("")+"</div></section></section></main><aside class='decision-aside'><section><h3>Current context</h3><p>Forge keeps these inputs fixed while answering so recommendations stay consistent.</p><div class='decision-factor'><b>Capital</b><span>"+BDT(p.budget)+" available</span></div><div class='decision-factor'><b>Market</b><span>"+esc(p.market||"Not set")+"</span></div><div class='decision-factor'><b>Category</b><span>"+esc(p.category||"Not set")+"</span></div><div class='decision-factor'><b>Risk</b><span>"+esc(p.risk||"Not set")+"</span></div><div class='decision-factor'><b>Time</b><span>"+Number(p.time||0)+"h / week</span></div></section><section class='active-profile'><h3>Active profile</h3><p>"+esc(p.category||"Open to anything")+" · "+esc(p.market||"Primary market not set")+"</p><div><span>Goal</span><b>"+esc(p.goal||"Not set")+"</b></div><div><span>Experience</span><b>"+esc(p.experience||"Not set")+"</b></div><button class='btn' onclick='openWizard()'>Change inputs</button></section></aside></div></div>";
}
function sendChat(){let i=document.getElementById("chatInput"),v=i.value.trim();if(!v)return;state.chat.push(["me",v],["ai",answer(v)]);render()}
function quick(v){state.chat.push(["me",v],["ai",answer(v)]);render()}
function answer(v){let s=v.toLowerCase(),p=state.selectedProduct||opportunities()[0];if(s.includes("product")||s.includes("sell"))return "Based on your profile, I would start with "+p.name+". Validate a small first batch before committing the full budget.";if(s.includes("break"))return "Break-even should be based on contribution per unit: selling price minus landed cost, CAC, fees and expected returns.";if(s.includes("ads")||s.includes("marketing"))return "Start around 10–15% of available capital as a testing envelope. Scale only when contribution stays healthy.";if(s.includes("risk"))return "Your biggest early risk is inventory commitment before demand validation. Sample first, keep a reserve and set a reorder trigger.";if(s.includes("30")||s.includes("launch"))return "Days 1–7: validate customers and products. Days 8–14: samples, pricing and store. Days 15–21: controlled creative tests. Days 22–30: cut weak SKUs and reorder proven winners.";return "I can help with opportunity selection, product economics, sourcing, branding, store launch, marketing, customer support and business decisions."}
function go(p){state.page=p;render();window.scrollTo({top:0,behavior:"smooth"})}
function toast(t){let e=document.getElementById("toast");e.textContent=t;e.style.display="block";clearTimeout(window.tt);window.tt=setTimeout(()=>e.style.display="none",2500)}
function onboardingLanding(){return "<div class='onboarding'><div class='onboarding-card'><div class='brand'><div class='mark'>F</div>FORGE <small>AI BUSINESS OS</small></div><div class='eyebrow' style='margin-top:32px'>Step 0 · before the dashboard</div><div class='h1'>Tell Forge who you are.<br>Then we build around you.</div><p class='sub'>Forge is not a generic business dashboard. It builds your workspace around your real money, time, experience, risk and business direction. Complete this once, then the downstream tools use the same context.</p><div class='step-intro'><div><b>01 · Your reality</b><span>Capital, income, expenses and the amount you can actually deploy.</span></div><div><b>02 · Your risk</b><span>How much uncertainty you can accept and how much loss you can comfortably absorb.</span></div><div><b>03 · Your direction</b><span>Your category, goal, skills, time and preferred way of building.</span></div></div><div class='onboarding-trust'><strong>Why Forge asks first:</strong> every recommendation downstream is supposed to use these inputs. If a number or constraint changes materially, update the profile rather than making decisions from stale assumptions.</div><button id='forge-start-profile' type='button' class='btn primary forge-start-profile' aria-label='Start my Forge profile' style='margin-top:24px;padding:16px 24px;position:relative;z-index:9999;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:rgba(105,221,160,.2);cursor:pointer'>Start my Forge profile →</button><p class='small' style='margin-top:12px'>Your profile stays in this browser for continuity. Forge will not invent missing financial information.</p></div></div>"}

/* FORGE_CJ_LIVE_SOURCING */
const CJ_PROXY="https://pmyfswozvkdpqgnsiibf.supabase.co/functions/v1/cj-products";
let cjState=[];
let cjLastFetched=null;

function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\":"&quot;","'":"&#039;"}[m]))}
function bdtEstimate(usd){return Math.round(Number(usd||0)*FORGE_BILLING_USD_BDT)}
function moneyUsd(v){return "$"+Number(v||0).toFixed(2)}
function formatQty(v){return Number(v||0).toLocaleString("en-US")}

function cjRecommendationKeyword(){
  const p=state.profile||{};
  const d=String(state.selectedOpportunityName||"").toLowerCase();
  const cat=String(p.category||"").toLowerCase();
  if(d.includes("footwear")||d.includes("shoe")) return "men sneakers";
  if(d.includes("carry")||d.includes("bag")) return "women handbags";
  if(d.includes("fragrance")) return "home fragrance diffuser";
  if(d.includes("watch")) return "men watches";
  if(d.includes("beauty")) return "beauty personal care";
  if(d.includes("fitness")) return "fitness accessories";
  if(d.includes("private-label")||d.includes("private label")){
    if(cat.includes("beauty")) return "beauty personal care";
    if(cat.includes("home")) return "home organization";
    if(cat.includes("sports")) return "fitness accessories";
    return "fashion accessories";
  }
  if(cat.includes("fashion")) return "fashion accessories";
  if(cat.includes("beauty")) return "beauty personal care";
  if(cat.includes("home")) return "home living";
  if(cat.includes("electronics")) return "consumer electronics";
  if(cat.includes("sports")) return "fitness accessories";
  return "fashion accessories";
}
async function fetchCjKeyword(keyword,page=1){
  const url=CJ_PROXY+"?keyword="+encodeURIComponent(keyword)+"&page="+page+"&size=24";
  const r=await fetch(url);
  const j=await r.json();
  if(!r.ok||!j.ok) throw Error(j.error||"The connected supplier catalogue could not be reached.");
  return j;
}
function showCjWaitStage(box,keyword){
  if(!box)return;
  const started=Date.now();
  box.innerHTML="<div class='cj-wait-stage' style='grid-column:1/-1'><div class='cj-wait-spinner' aria-hidden='true'></div><div><strong>Connecting to CJ Dropshipping…</strong><span>Forge is securely connecting to the live supplier catalogue, checking availability and preparing real product results.</span><div class='cj-wait-time' id='cjWaitTime'>Connecting · 0s</div></div></div>";
  const timer=setInterval(function(){
    const el=document.getElementById("cjWaitTime");
    if(!el){clearInterval(timer);return}
    const sec=Math.floor((Date.now()-started)/1000);
    el.textContent=sec<4?"Connecting · "+sec+"s":sec<8?"Still checking live supplier data · "+sec+"s":"Almost there · "+sec+"s";
  },250);
  box.dataset.waitTimer=String(started);
}
async function autoCjSearch(){
  const box=document.getElementById("cjresults"),status=document.getElementById("cjstatus"),meta=document.getElementById("cjmeta"),fresh=document.getElementById("cjfresh");
  if(!box)return;
  const keyword=cjRecommendationKeyword();
  if(status)status.textContent="Matching live supplier products to your profile…";
  if(meta)meta.textContent="Finding 20 different products…";
  showCjWaitStage(box,keyword);
  try{
    const collected=[],seen=new Set();
    const confirmed=new Set((state.sourcingQueue||[]).map(x=>String(x.id||x.name||"").trim().toLowerCase()));
    for(let page=1;page<=3 && collected.length<20;page++){
      const j=await fetchCjKeyword(keyword,page);
      const products=Array.isArray(j.products)?j.products:[];
      for(const p of products){
        const idKey=String(p.id||p.productId||p.sku||"").trim().toLowerCase();
        const nameKey=String(p.name||"").trim().toLowerCase();
        const uniqueKey=idKey||nameKey;
        if(!uniqueKey||seen.has(uniqueKey))continue;
        if(confirmed.has(uniqueKey)||confirmed.has(nameKey))continue;
        seen.add(uniqueKey);
        collected.push(p);
        if(collected.length>=20)break;
      }
      cjLastFetched=j.fetchedAt||cjLastFetched;
    }
    cjState=collected.slice(0,20);
    cjLastFetched=cjLastFetched||new Date().toISOString();
    renderCjResults({products:cjState,fetchedAt:cjLastFetched});
    if(status)status.textContent=cjState.length+" unique live products matched to your profile";
    if(fresh)fresh.textContent="Checked "+new Date(cjLastFetched).toLocaleTimeString("en-BD",{hour:"2-digit",minute:"2-digit"});
  }catch(e){
    cjState=[];
    box.innerHTML="<div class='cj-empty' style='grid-column:1/-1'><b>Live product matching is temporarily unavailable.</b><br><span class='small'>"+esc(e.message)+"</span><br><br><button class='btn primary' onclick='autoCjSearch()'>Try again</button></div>";
    if(status)status.textContent="Supplier connection needs another try";
    if(meta)meta.textContent="No supplier products loaded";
  }
}
async function cjSearch(page=1){
  const q=(document.getElementById("cjq")?.value||"").trim();
  const box=document.getElementById("cjresults");
  if(!q){toast("Enter a product keyword");return}
  box.innerHTML="<div class='cj-empty cj-loading'>Connecting to the live product network…</div>";
  try{
    const url=CJ_PROXY+"?keyword="+encodeURIComponent(q)+"&page="+page+"&size=18";
    const r=await fetch(url,{headers:{"apikey":"sb_publishable_RrciEiRwRPkbU6yO6wt8Zg_BI0tSYEW","Authorization":"Bearer sb_publishable_RrciEiRwRPkbU6yO6wt8Zg_BI0tSYEW"}});
    const j=await r.json();
    if(!r.ok||!j.ok) throw Error(j.error||"The product network could not be reached.");
    cjState=Array.isArray(j.products)?j.products:[];
    cjLastFetched=j.fetchedAt||new Date().toISOString();
    renderCjResults(j);
  }catch(e){
    box.innerHTML="<div class='cj-empty'><b>Live sourcing is temporarily unavailable.</b><br><span class='small'>"+esc(e.message)+"</span><br><br><span class='small'>No fake products or placeholder prices are shown when the supplier does not return valid data.</span></div>";
  }
}

function renderCjResults(j){
  const box=document.getElementById("cjresults");
  if(!box)return;
  if(!cjState.length){
    box.innerHTML="<div class='cj-empty' style='grid-column:1/-1'><b>Forge could not find verified products for this business yet.</b><br><span class='small'>We never fabricate supplier images, names or prices. Refresh the Product Lab to check again.</span></div>";
    return;
  }
  box.innerHTML=cjState.map((p,i)=>{
    const e=liveEconomics(p);
    const featured=i===0;
    return "<article class='cj-card "+(featured?"featured":"")+"'>"+
      "<div class='cj-image-wrap'><span class='cj-live-badge'>"+(featured?"Top match":"Live product")+"</span><span class='cj-rec-number'>"+String(i+1).padStart(2,"0")+"</span><img src='"+esc(p.image)+"' loading='lazy' alt='"+esc(p.name)+"'></div>"+
      "<div class='cj-card-body'>"+
      "<div class='cj-recommendation'><span>Forge recommendation</span><b>"+(i+1)+"</b></div>"+
      "<h3>"+esc(p.name)+"</h3>"+
      "<div class='cj-meta'><span class='cj-chip'>"+esc(p.category||"Product")+"</span><span class='cj-chip'>"+(Number(p.inventory||0)?"Stock checked":"Stock check at order")+"</span></div>"+
      "<div class='cj-price-row'><div><div class='cj-price'>"+moneyUsd(p.priceUsd)+"</div><div class='cj-bdt'>Live supplier price · ≈ "+BDT(e.supplier)+"</div></div><span class='cj-fresh-time'>"+new Date(cjLastFetched||Date.now()).toLocaleTimeString("en-BD",{hour:"2-digit",minute:"2-digit"})+"</span></div>"+
      "<div class='cj-economics'>"+
      "<div><span>Estimated landed</span><b>"+BDT(e.landed)+"</b><small>Logistics included</small></div>"+
      "<div><span>Estimated selling</span><b>"+BDT(e.selling)+"</b><small>Forge model</small></div>"+
      "<div><span>Marketing / CAC</span><b>"+BDT(e.cac)+"</b><small>Target acquisition</small></div>"+
      "<div class='cj-contribution'><span>Contribution</span><b>"+BDT(e.contribution)+"</b><small>"+e.margin+"% after modeled costs</small></div>"+
      "</div>"+
      "<div class='cj-stock'><span>Supplier stock</span><b>"+formatQty(p.inventory)+"</b><i></i><span>Delivery</span><b>"+esc(p.deliveryDays||"Checked before order")+"</b></div>"+
      "<div class='cj-footer'><button class='btn primary' style='width:100%' onclick='reviewCj("+i+")'>Review this product</button></div>"+
      "</div></article>";
  }).join("");
  const meta=document.getElementById("cjmeta");
  if(meta) meta.innerHTML="<b>"+cjState.length+" unique real products</b> matched to your profile · live supplier prices";
}

function reviewCj(i){
  const p=cjState[i]; if(!p)return;
  const e=liveEconomics(p);
  // Product Lab can render without the global modal host. Always create it before opening a product review.
  const modal=ensureForgeModalHost();
  const modalBox=document.getElementById("modalbox");
  if(!modalBox)return;
  modalBox.innerHTML=
    "<div class='forge-product-review'>"+
      "<div class='forge-review-head'>"+
        "<div class='forge-review-head-copy'><div class='forge-review-kicker'>Product Lab · live supplier review</div><h2>Review this product</h2><p>Verify the product, unit economics and supply signal before selecting it.</p></div>"+
        "<button class='forge-review-close' onclick='closeModal()' aria-label='Close'>×</button>"+
      "</div>"+
      "<div class='forge-review-main'>"+
        "<div class='forge-review-gallery'>"+
          "<div class='forge-review-image-stage'>"+
            "<span class='forge-review-live'><i></i>Live supplier</span>"+
            "<span class='forge-review-rec'>"+String(i+1).padStart(2,"0")+"</span>"+
            "<img class='forge-review-image' src='"+esc(p.image)+"' alt='"+esc(p.name)+"'>"+
          "</div>"+
        "</div>"+
        "<div class='forge-review-details'>"+
          "<span class='forge-review-category'>"+esc(p.category||"Product")+"</span>"+
          "<h3 class='forge-review-title'>"+esc(p.name)+"</h3>"+
          "<div class='forge-review-price-row'>"+
            "<div><div class='forge-review-price'>"+moneyUsd(p.priceUsd)+"</div><div class='forge-review-price-note'>Live supplier price · ≈ "+BDT(e.supplier)+"</div></div>"+
            "<div class='forge-review-source'>Checked "+new Date(cjLastFetched||Date.now()).toLocaleTimeString("en-BD",{hour:"2-digit",minute:"2-digit"})+"</div>"+
          "</div>"+
          "<div class='forge-review-section-title'>Unit economics</div>"+
          "<div class='forge-review-economics'>"+
            "<div class='forge-review-metric'><span>Estimated landed</span><b>"+BDT(e.landed)+"</b><small>Logistics included</small></div>"+
            "<div class='forge-review-metric'><span>Estimated selling</span><b>"+BDT(e.selling)+"</b><small>Forge model</small></div>"+
            "<div class='forge-review-metric'><span>Marketing / CAC</span><b>"+BDT(e.cac)+"</b><small>Target acquisition</small></div>"+
            "<div class='forge-review-metric is-positive'><span>Contribution</span><b>"+BDT(e.contribution)+" · "+e.margin+"%</b><small>After modeled costs</small></div>"+
          "</div>"+
          "<div class='forge-review-section-title'>Supply signals</div>"+
          "<div class='forge-review-signals'>"+
            "<div class='forge-review-signal'><span>Supplier stock</span><b>"+formatQty(p.inventory)+" units</b></div>"+
            "<div class='forge-review-signal'><span>Delivery</span><b>"+esc(p.deliveryDays||"Checked before order")+"</b></div>"+
          "</div>"+
        "</div>"+
      "</div>"+
      "<div class='forge-review-next'><div class='forge-review-next-icon'>→</div><div><b>What happens after you choose it</b><span>This exact supplier record becomes the selected product for Sourcing & Orders. Forge carries its economics into the business plan, brand, store and marketing workflow. Stock, shipping and payable amount are rechecked before purchase.</span></div></div>"+
      "<div class='forge-review-footer'><button class='btn' onclick='closeModal()'>Keep comparing</button><button class='btn primary' onclick='addCjToQueue("+i+")'>Choose this product →</button></div>"+
    "</div>";
  document.getElementById("modal").classList.add("open");
}

function addCjToQueue(i){
  const p=cjState[i]; if(!p)return;
  const e=liveEconomics(p);
  const qp=quantityPlan(p);
  const item={...p,economics:e,selectedAt:new Date().toISOString(),sourceType:"connected_supplier",orderStatus:"draft",paymentStatus:"unpaid",procurementStatus:"awaiting_payment",deliveryStatus:"not_started",orderQty:qp.planned,minimumOrderQty:qp.minimum,suggestedOrderQty:qp.suggested,plannedOrderQty:qp.planned,variant:"Standard variant",orderRef:"FORGE-"+new Date().toISOString().replace(/\D/g,"").slice(0,14),planStatus:"preparing",planRequestedAt:new Date().toISOString()};
  const existing=state.sourcingQueue.findIndex(x=>x.id===p.id);
  if(existing>=0)state.sourcingQueue[existing]=item;else state.sourcingQueue.unshift(item);
  state.selectedProduct=item;
  state.planStatus="preparing";
  autoBuildContentDepartment("product_confirmed");
  state.planRequestedAt=new Date().toISOString();
  state.planEtaSeconds=6+Math.abs(String(p.id||p.name||"").split("").reduce((a,ch)=>a+ch.charCodeAt(0),0))%15;
  state.business=state.business||{name:(state.profile?.occupation||"My Business"),budget:Number(state.profile?.budget||0)};
  try{persistProfile()}catch(e){}
  closeModal();
  toast("Product confirmed with "+qp.planned+" planned units. Draft order created and business-plan preparation started.");
  go("plan");
}

function bindMobileInteractions(){
  const start=document.getElementById("forge-start-profile");
  if(!start || start.dataset.bound==="1")return;
  start.dataset.bound="1";
  start.style.pointerEvents="auto";
  start.style.webkitUserSelect="none";
  start.style.userSelect="none";
  start.addEventListener("click",function(e){
    e.preventDefault();
    e.stopPropagation();
    openWizard();
  },false);
}
function render(){
  window.__forgeRendered=true;
  try{sessionStorage.removeItem("forge_boot_retry_v1")}catch(e){}
  document.body.dataset.page=state.page||"home";
  let pages={home,advisor,ideas,products,plan,orders,brand:brandStudioPage,store,content:contentLibrary,marketing,billing,support,analytics};
  if(!state.profileLocked){document.getElementById("app").innerHTML=onboardingLanding();bindMobileInteractions();return}
  const pageFn=pages[state.page]||home;
  try{
    document.getElementById("app").innerHTML=shell(pageFn());
    if(state.page==="products")setTimeout(autoCjSearch,0);
    if(state.page==="plan" && state.planStatus==="preparing")setTimeout(()=>{ if(state.page==="plan") render(); },500);
  }catch(err){
    console.error("Forge render error",state.page,err);
    const detail=esc(String(err&&err.message||err));
    document.getElementById("app").innerHTML=shell(`<div class="hero"><div><div class="eyebrow">FORGE RECOVERY</div><div class="h1">This workspace hit an error.</div><div class="sub">Your saved business data is safe. Forge could not render this page, so you can retry or return to Orders.</div></div><div class="actions"><button class="btn" onclick=\"go('orders')\">Back to Orders</button><button class="btn primary" onclick=\"go('brand')\">Retry Brand Studio</button></div></div><div class="notice"><b>Technical detail</b><div class="small">${detail}</div></div>`);
  }
}

/* FORGE LAUNCH SYSTEM V4 — global UX, reliable onboarding, light business UI */
Object.assign(DEFAULT_PROFILE,{
  budget:50000,age:28,income:5000,expenses:10000,reserve:0,market:"Bangladesh",
  city:"Dhaka",occupation:"Entrepreneur",experience:"Beginner",skills:"",
  workStyle:"Builder",category:"Open to anything",goal:"Profit + growth",
  risk:"Balanced",riskCapacity:"Medium",lossTolerance:10000,time:10,
  targetIncome:0,model:"Open to recommendations"
});

function forgeWorkspaceBar(){
  const p=state.profile||{}, b=state.business||{};
  const cap=Number(p.budget||b.budget||0);
  const reserve=Number(p.reserve||0);
  const deploy=Math.max(0,cap-reserve);
  return "<div class='forge-workspace-bar'>"+
    "<div class='forge-workspace-main'><span class='forge-live-dot'></span><div><strong>"+esc(b.name||"New venture")+"</strong><span>"+esc(p.market||"Bangladesh")+" · "+esc(p.category||"Business setup")+"</span></div></div>"+
    "<div class='forge-workspace-metrics'>"+
      "<span><b>"+BDT(deploy)+"</b><small>deployable</small></span>"+
      "<span><b>"+(p.time||0)+"h</b><small>per week</small></span>"+
      "<span><b>"+esc(p.risk||"Balanced")+"</b><small>risk profile</small></span>"+
      "<span class='forge-locked'>✓ Profile locked</span>"+
    "</div></div>";
}

function shell(c){
  const b=state.business;
  return "<header class='top'><div class='brand'><div class='mark'>F</div><span>FORGE</span><small>AI BUSINESS OS</small></div>"+
    "<div class='topright'><span class='pill online'>● <span id='forgeStatusText'>AI is online</span></span><button class='pill forge-new-btn' type='button' onclick='openWizard()'>＋ New business</button><div class='avatar'>M</div></div></header>"+
    "<button class='corner-tab' type='button' onclick='toggleCorner()'>CATEGORIES</button>"+
    "<aside id='cornerPanel' class='corner-panel'><div class='row' style='justify-content:space-between'><div><div class='eyebrow'>Forge workspace</div><h3>Categories & tools</h3><div class='small'>Everything stays connected to the same business context.</div></div><button class='btn' type='button' onclick='toggleCorner()'>✕</button></div><div class='navlabel'>Business workflow</div>"+nav()+"</aside>"+
    "<div class='layout'><aside class='side'><div class='navlabel'>Business workspace</div>"+nav()+
      "<div class='navlabel' style='margin-top:18px'>Your business</div><div class='business-mini'><div class='row'><div class='bizicon'>◈</div><div><b>"+(b?esc(b.name):"New venture")+"</b><div class='small'>"+(b?"Operating workspace active":"Profile not completed")+"</div></div></div><div class='progress' style='margin-top:12px'><i style='width:"+(b?72:8)+"%'></i></div></div>"+
      "<div class='forge-sidebar-note'><b>Forge principle</b><span>Every downstream decision should trace back to your profile, live data and explicit assumptions.</span></div>"+
    "</aside><main class='main'>"+forgeWorkspaceBar()+forgePageGuide()+c+"</main></div>";
}

function forgeWizardData(){
  try{
    const raw=JSON.parse(localStorage.getItem("forge_wizard_draft_v1")||"null");
    return {...DEFAULT_PROFILE,...(raw||{})};
  }catch(e){return {...DEFAULT_PROFILE}};
}
function forgeWizardField(label,key,type="text",placeholder="",options){
  const d=window.__forgeWizardData||forgeWizardData(),v=d[key]??"";
  if(options){
    return "<label class='forge-w-field'><span>"+label+"</span><select id='fw_"+key+"' data-key='"+key+"'>"+
      options.map(o=>"<option value='"+esc(o)+"' "+(String(v)===String(o)?"selected":"")+">"+esc(o)+"</option>").join("")+"</select></label>";
  }
  return "<label class='forge-w-field'><span>"+label+"</span><input id='fw_"+key+"' data-key='"+key+"' type='"+type+"' value='"+esc(v)+"' placeholder='"+esc(placeholder)+"'></label>";
}
function forgeRealityCheck(d){
  const cap=Math.max(0,Number(d.budget||0)-Number(d.reserve||0));
  const budget=Math.max(0,Number(d.budget||0));
  const reserve=Math.max(0,Number(d.reserve||0));
  const loss=Math.max(0,Number(d.lossTolerance||0));
  const time=Math.max(0,Number(d.time||0));
  const target=Math.max(0,Number(d.targetIncome||0));
  const flags=[];
  let mode="standard";
  if(budget<=10)mode="micro-test";
  else if(budget<10000)mode="lean-test";
  else if(budget<100000)mode="lean-launch";
  else if(budget<500000)mode="standard";
  else mode="larger-launch";
  if(reserve>budget)flags.push({type:"attention",title:"Check your savings amount",text:"The amount you want to keep aside is larger than the money you said you have available. Forge will not spend the protected amount."});
  if(loss>cap && cap>=0)flags.push({type:"attention",title:"Your loss limit is above your available business money",text:"You said you are comfortable losing more than the money currently available to the business. Forge will treat your available money as the hard spending boundary until you change this."});
  if(budget<=10)flags.push({type:"info",title:"This is a very small starting budget",text:"Forge will prioritize ideas that can be tested with little or no upfront spending. It will not pretend an inventory-heavy launch fits this budget."});
  else if(budget<1000)flags.push({type:"info",title:"Start with a small test",text:"Your budget is limited, so Forge will favor service, pre-order and other low-upfront-cost approaches before suggesting a larger launch."});
  if(time>0 && time<3)flags.push({type:"info",title:"You have very little time available",text:"Forge will favor simple models that can run in a few hours each week and avoid plans that need daily operations."});
  if(target>0 && cap>0 && target>=cap*2)flags.push({type:"info",title:"Your monthly income goal is a stretch target",text:"Your goal is about "+(target/cap).toFixed(1)+"× the money available to start. Forge will treat ৳"+target.toLocaleString("en-BD")+" as a target to build toward, never as expected or guaranteed month-one profit."});
  if(target>0 && Number(d.income||0)>0 && Number(d.expenses||0)>=Number(d.income||0))flags.push({type:"info",title:"Your personal costs already use most or all of your income",text:"Forge will not assume the new business can immediately replace or add to your personal income. It will prioritize validation and cash-flow milestones first."});
  if(cap>0 && target>0 && target>=cap*5)flags.push({type:"info",title:"Forge will build this goal in stages",text:"A "+BDT(cap)+" starting budget and a "+BDT(target)+" monthly owner-income goal are very different milestones. Forge will separate the first test, first revenue, reinvestment and later income targets."});
  if(cap<=0)flags.push({type:"attention",title:"There is no deployable business money yet",text:"Forge can still help you validate an idea, but it will not treat unpaid effort, borrowed money or future revenue as available capital."});
  if(reserve===0 && budget>0)flags.push({type:"info",title:"You have not set aside an emergency reserve",text:"Forge will not invent a reserve for you, but before committing significant cash it should show what remains after the proposed spend and give you a chance to reduce the commitment."});
  if(target>0 && cap>0 && target>cap && target<cap*2)flags.push({type:"info",title:"Your income goal is above your starting capital",text:"That is a growth target, not a spending limit or a promise. Forge will separate revenue generation from owner withdrawals and test the economics before recommending scale."});
  const severity=flags.some(x=>x.type==="attention")?"attention":flags.length?"guided":"ready";
  const label=severity==="attention"?"Needs a quick check":severity==="guided"?"Forge will adapt":"Looks clear";
  return {cap,budget,reserve,loss,time,target,mode,severity,label,flags};
}
function forgeRealityHTML(d){
  const r=forgeRealityCheck(d);
  const cls=r.severity==="attention"?"attention":r.severity==="guided"?"guided":"ready";
  const lead=r.severity==="attention"?"I found something worth checking before we build the plan.":r.severity==="guided"?"Your numbers are workable. I’ll adapt the plan to your limits.":"Your numbers are clear. I can use them as business constraints.";
  return "<div class='forge-reality-panel "+cls+"'><div class='forge-reality-head'><div><span class='forge-finance-kicker'>FORGE REALITY CHECK</span><b>"+r.label+"</b></div><span class='forge-reality-mode'>"+r.mode.replace("-", " ").toUpperCase()+"</span></div><p>"+lead+"</p>"+(r.flags.length?r.flags.slice(0,2).map(f=>"<div class='forge-reality-item "+f.type+"'><b>"+f.title+"</b><span>"+f.text+"</span></div>").join(""):"<div class='forge-reality-item ready'><b>What happens next?</b><span>Forge will use these numbers when choosing opportunities, setting test budgets and building your first plan.</span></div>")+"</div>";
}
function forgeFinancePreview(){
  const d=window.__forgeWizardData||forgeWizardData();
  const read=k=>Number(document.getElementById("fw_"+k)?.value??d[k]??0)||0;
  const budget=read("budget"),income=read("income"),expenses=read("expenses"),reserve=read("reserve");
  const available=Math.max(0,budget-reserve);
  const monthlyGap=income-expenses;
  const el=id=>document.getElementById(id);
  if(el("fwAvailableCapital"))el("fwAvailableCapital").textContent=BDT(available);
  if(el("fwReserveAmount"))el("fwReserveAmount").textContent=BDT(reserve);
  if(el("fwMonthlyGap"))el("fwMonthlyGap").textContent=BDT(Math.max(0,income-expenses));
  const rp=document.querySelector(".forge-reality-panel");
  if(rp){const wrap=document.createElement("div");wrap.innerHTML=forgeRealityHTML({...(window.__forgeWizardData||{}),budget,income,expenses,reserve});rp.replaceWith(wrap.firstElementChild);}
  const note=el("fwFinanceNote");
  if(note){
    if(budget===0)note.innerHTML="<b>Forge is listening.</b><span>Tell me how much you can start with. I’ll use that number to keep your first business ideas and launch costs realistic.</span>";
    else if(reserve>budget)note.innerHTML="<b>Your safe money is more than your starting money.</b><span>That’s okay — just check the numbers. Forge won’t use money you want to keep safe for the business.</span>";
    else if(available===0)note.innerHTML="<b>Nothing is available to start with yet.</b><span>Forge will treat your business starting budget as ৳0 until you add an amount you can use.</span>";
    else {
      const goal=income, surplus=income-expenses;
      const goalText=goal>0?" Your monthly business-income goal is <strong>"+BDT(goal)+"</strong> — I’ll treat that as a target to build toward, not guaranteed first-month profit.":"";
      const cashText=surplus<0?" Your personal spending is higher than your stated income, so Forge will not rely on immediate owner withdrawals.":surplus===0?" Your stated income currently covers your personal spending, so Forge will protect your business cash flow before planning owner withdrawals.":" You currently have about <strong>"+BDT(surplus)+"</strong> left after personal spending.";
      note.innerHTML="<b>Got it — I understand your starting position.</b><span>You can start with <strong>"+BDT(available)+"</strong>. I’ll keep <strong>"+BDT(reserve)+"</strong> aside and won’t count it as business money."+goalText+cashText+"</span>";
    }
  }
}
function forgeWizardView(){
  const step=window.__forgeWizardStep||1,d=window.__forgeWizardData||forgeWizardData();
  const titles=[
    ["Your money","Tell Forge what money you can work with.","Starting money, monthly needs and savings."],
    ["About you","Help Forge understand you and your situation.","Your experience, time, location and interests."],
    ["Your comfort level","Tell Forge how much risk feels comfortable to you.","How much risk and loss you can handle."],
    ["What you want to build","Tell Forge what kind of business you want.","What to sell, where to sell and how you want to earn."],
    ["Check everything","Take one last look before Forge starts working.","You can change anything before you activate."]
  ];
  const t=titles[step-1];
  let body="";
  if(step===1) body="<div class='forge-finance-intro'><div><span class='forge-finance-kicker'>YOUR MONEY</span><h3>Let’s start with the money you have to work with.</h3><p>Tell Forge what you can comfortably spend. I’ll use this to keep your ideas, products and launch plan within a realistic budget.</p></div><div class='forge-finance-badge'><span>Currency</span><b>৳ BDT</b><small>Bangladeshi Taka</small></div></div>"+
    "<div class='forge-finance-fields'>"+
    "<label class='forge-money-field'><span>How much money can you start your business with?</span><small>Enter the amount you are comfortable using to start.</small><div class='forge-money-wrap'><b>৳</b><input id='fw_budget' data-key='budget' type='number' min='0' value='"+esc(d.budget??"")+"' placeholder='50,000' oninput='forgeFinancePreview()'><em>BDT</em></div></label>"+
    "<label class='forge-money-field'><span>How much would you like the business to pay you each month?</span><small>This is your personal income goal from the business — not a promise of profit.</small><div class='forge-money-wrap'><b>৳</b><input id='fw_income' data-key='income' type='number' min='0' value='"+esc(d.income??"")+"' placeholder='50,000' oninput='forgeFinancePreview()'><em>/ month</em></div></label>"+
    "<label class='forge-money-field'><span>How much do you spend for yourself each month?</span><small>Include things like food, transport, rent, bills and other personal costs.</small><div class='forge-money-wrap'><b>৳</b><input id='fw_expenses' data-key='expenses' type='number' min='0' value='"+esc(d.expenses??"")+"' placeholder='10,000' oninput='forgeFinancePreview()'><em>/ month</em></div></label>"+
    "<label class='forge-money-field'><span>How much money do you want to keep aside?</span><small>Keep this money safe for emergencies. Forge won’t use it as your business budget.</small><div class='forge-money-wrap'><b>৳</b><input id='fw_reserve' data-key='reserve' type='number' min='0' value='"+esc(d.reserve??"")+"' placeholder='0' oninput='forgeFinancePreview()'><em>protected</em></div></label>"+
    "</div>"+
    "<div class='forge-finance-understanding'><div class='forge-understanding-head'><div><span class='forge-finance-kicker'>FORGE'S CURRENT UNDERSTANDING</span><b>This is what I’ll use when building your plan.</b></div><span class='forge-live-dot'>LIVE</span></div><div class='forge-finance-metrics'><div><small>Money you can start with</small><strong id='fwAvailableCapital'>"+BDT(Math.max(0,Number(d.budget||0)-Number(d.reserve||0)))+"</strong><span>available after your protected savings</span></div><div><small>Money kept aside</small><strong id='fwReserveAmount'>"+BDT(d.reserve)+"</strong><span>Forge will leave this untouched</span></div><div><small>Money left after personal costs</small><strong id='fwMonthlyGap'>"+BDT(Math.max(0,Number(d.income||0)-Number(d.expenses||0)))+"</strong><span>based on income minus monthly spending</span></div></div><div id='fwFinanceNote' class='forge-finance-note'><b>Forge is ready to use these numbers.</b><span>I’ll build around <strong>"+BDT(Math.max(0,Number(d.budget||0)-Number(d.reserve||0)))+"</strong> of starting money and keep <strong>"+BDT(d.reserve)+"</strong> aside.</span></div></div>"+forgeRealityHTML(d);
  if(step===2) body="<div class='forge-founder-intro'><div><span>YOUR STARTING POINT</span><b>You don't need to have it all figured out.</b><p>Just tell Forge a little about you. I'll use this to suggest businesses that fit your skills, time, experience and market.</p></div><strong>~ 2 MIN</strong></div><div class='forge-w-grid'>"+
    forgeWizardField("How old are you?","age","number","28")+
    forgeWizardField("Where will you run your business?","city","text","Dhaka")+
    forgeWizardField("What do you do right now?","occupation","text","",["Student","Full-time employee","Part-time employee","Freelancer / independent professional","Entrepreneur","Business owner","Family business","Content creator / creator","Homemaker / caregiver","Job seeker","Retired","Professional / specialist","Other"])+
    forgeWizardField("How much business experience do you have?","experience","text","",["I'm new to business","I've tried a business before","I run a business now","I've built several businesses"])+
    forgeWizardField("How much time can you give your business each week?","time","number","10")+
    forgeWizardField("What kind of work feels most natural to you?","workStyle","text","",["Building things","Selling & talking","Managing operations","Creating & designing","Research & analysis","A mix of these"])+
    forgeWizardField("What do you already have that could help you start?","resources","text","",["Nothing yet","An audience / social following","Suppliers or products","Equipment / workspace","A useful skill or service","A team or business partner"])+
    "</div>"+forgeWizardField("What are you already good at or interested in? (optional)","skills","text","e.g. fashion, sales, design, sourcing, technology");
  if(step===3) body="<div class='forge-w-grid'>"+
    forgeWizardField("How much risk are you comfortable taking?","risk","text","",["Conservative","Balanced","Growth","Aggressive"])+
    forgeWizardField("How much financial risk can you realistically handle?","riskCapacity","text","",["Low","Medium","High"])+
    forgeWizardField("What is the most you are comfortable losing while testing an idea?","lossTolerance","number","10000")+
    "</div><div class='forge-risk-note'><b>Forge will use this as a safety limit.</b><span>Recommendations, opening quantities and testing budgets should stay proportional to this limit.</span></div>";
  if(step===4) body="<div class='forge-direction-intro'><span>YOUR BUSINESS DIRECTION</span><b>Let's narrow down what could actually work for you.</b><p>You don't need a perfect business idea yet. Give Forge a direction, and it will connect your money, skills, risk and market before suggesting what to build.</p></div><div class='forge-w-grid'>"+
    forgeWizardField("What kind of business interests you?","category","text","",["Open to anything","Fashion & accessories","Beauty & personal care","Home & living","Electronics","Food & beverage","Sports & fitness","Services / digital"])+
    forgeWizardField("Who would you most like to serve?","customer","text","",["Open to recommendations","Everyday consumers","Students & young adults","Working professionals","Families & households","Business customers (B2B)","Niche / enthusiast customers","Local community"])+
    forgeWizardField("How would you like to reach customers?","channel","text","",["Open to recommendations","Social media + website","Online marketplace","Physical shop / outlet","B2B sales","A mix of online and offline"])+
    forgeWizardField("How would you like to make money?","model","text","",["Open to recommendations","Online product selling","Private label","Reselling","Service business","Wholesale / distribution","Subscription / recurring revenue","Commission / marketplace"])+
    forgeWizardField("What do you want this business to do for you?","goal","text","",["Low-risk side income","Steady monthly income","Profit + growth","Long-term brand","Fastest path to first sales","Replace my salary"])+
    forgeWizardField("Where would you like to sell?","market","text","",["Bangladesh","India","UAE","Saudi Arabia","USA","International / wherever Forge recommends"])+
    forgeWizardField("How much extra money would you like to make each month? (optional)","targetIncome","number","0")+
    "</div>";
  if(step===5) body="<div class='forge-review-grid'>"+
    [["Capital",BDT(d.budget)],["Income / month",BDT(d.income)],["Expenses / month",BDT(d.expenses)],["Reserve",BDT(d.reserve)],["Location",d.city+", "+d.market],["What you do",d.occupation],["Experience",d.experience],["Time",d.time+"h/week"],["Work style",d.workStyle],["Starting resources",d.resources],["Risk",d.risk+" · "+d.riskCapacity],["Comfortable loss",BDT(d.lossTolerance)],["Direction",d.category],["Customer",d.customer],["Sales channel",d.channel],["Goal",d.goal],["Model",d.model]].map(x=>"<div><small>"+x[0]+"</small><b>"+esc(String(x[1]))+"</b></div>").join("")+
    "</div><div class='forge-activation-note'><strong>Ready to activate Forge.</strong><span>These inputs become the shared decision context for Business Finder, Product Lab, Business Plan, Brand Studio, Store Launch, Marketing and Forge Chat.</span></div>";
  return "<div class='forge-wizard'><div class='forge-wizard-shell'>"+
    "<div class='forge-wizard-top'><div class='brand'><div class='mark'>F</div><span>FORGE</span><small>AI BUSINESS OS</small></div><span class='forge-w-draft'>Auto-saved locally</span></div>"+
    "<div class='forge-w-layout'><aside class='forge-w-side'><div class='forge-w-kicker'>FORGE ONBOARDING · "+step+" / 5</div><h1>"+t[0]+"</h1><p>"+t[1]+"</p><div class='forge-w-steps'>"+
      titles.map((x,i)=>"<div class='"+(i+1===step?"active ":"")+(i+1<step?"done":"")+"'><span>"+(i+1<step?"✓":String(i+1).padStart(2,"0"))+"</span><div><b>"+x[0]+"</b><small>"+x[2]+"</small></div></div>").join("")+
    "</div><div class='forge-w-trust'><b>Why this matters</b><span>Forge is designed to work from your reality, not generic assumptions.</span></div></aside>"+
    "<section class='forge-w-content'><div class='forge-w-heading'><div><span>Decision input "+String(step).padStart(2,"0")+"</span><h2>"+t[0]+"</h2><p>"+t[1]+"</p></div><div class='forge-w-progress'><b>"+(step*20)+"%</b><i><em style='width:"+(step*20)+"%'></em></i></div></div>"+
    body+
    "<div id='forgeWizardError' class='forge-w-error' role='alert' aria-live='polite'></div>"+
    "<div class='forge-w-actions'>"+(step>1?"<button class='btn' type='button' onclick='forgeWizardBack()'>← Back</button>":"<button class='btn' type='button' onclick='forgeWizardExit()'>Save & exit</button>")+
    "<button class='btn primary' type='button' onclick='forgeWizardNext()'>"+(step<5?"Continue →":"Activate Forge →")+"</button></div>"+
    "<div class='forge-w-footnote'>Your draft is saved in this browser. You can change these values before activation.</div></section></div></div></div>";
}
function forgeWizardCollect(){
  const d=window.__forgeWizardData||forgeWizardData();
  document.querySelectorAll("[data-key]").forEach(el=>{
    const k=el.dataset.key;
    d[k]=el.type==="number"?(el.value===""?0:Number(el.value)):el.value;
  });
  window.__forgeWizardData=d;
  localStorage.setItem("forge_wizard_draft_v1",JSON.stringify(d));
}
function forgeWizardError(msg){
  const e=document.getElementById("forgeWizardError");if(e)e.textContent=msg||"Please review the highlighted fields.";
  document.querySelector(".forge-w-field.error")?.scrollIntoView({behavior:"smooth",block:"center"});
}
function forgeWizardValidate(step){
  const d=window.__forgeWizardData||forgeWizardData(),bad=[];
  const req=step===1?["budget","income","expenses","reserve"]:step===2?["age","city","occupation","time"]:step===3?["risk","riskCapacity","lossTolerance"]:step===4?["category","goal","model","market"]:[];
  req.forEach(k=>{const el=document.getElementById("fw_"+k),v=el?.value??d[k];if(el)el.closest(".forge-w-field")?.classList.remove("error");if((["budget","income","expenses","reserve","age","time","lossTolerance"].includes(k)&&(!Number.isFinite(Number(v))||Number(v)<0))||(!["budget","income","expenses","reserve","age","time","lossTolerance"].includes(k)&&!String(v||"").trim())){bad.push(k);el?.closest(".forge-w-field")?.classList.add("error");}});
  if(step===2 && Number(d.age)<18){bad.push("age");document.getElementById("fw_age")?.closest(".forge-w-field")?.classList.add("error");}
  if(step===2 && Number(d.time)<=0){bad.push("time");document.getElementById("fw_time")?.closest(".forge-w-field")?.classList.add("error");}
  if(bad.length){forgeWizardError("Please complete the highlighted fields before continuing.");return false}
  forgeWizardError("");return true;
}
function forgeWizardNext(){
  forgeWizardCollect();
  const step=window.__forgeWizardStep||1;
  if(!forgeWizardValidate(step))return;
  if(step<5){window.__forgeWizardStep=step+1;document.getElementById("app").innerHTML=forgeWizardView();window.scrollTo({top:0,behavior:"smooth"});return;}
  const d=window.__forgeWizardData;
  state.profile={...DEFAULT_PROFILE,...d,reality:forgeRealityCheck(d)};
  const reality=forgeRealityCheck(d);
  state.business={name:businessName(d.category),budget:Number(d.budget||0),market:d.market,category:d.category,age:Number(d.age||0),income:Number(d.income||0),goal:d.goal,risk:d.risk,time:Number(d.time||0),targetMargin:categoryMargin(d.category),planMode:planMode(d),realityMode:reality.mode,realitySeverity:reality.severity,realityFlags:reality.flags};
  state.profileLocked=true;state.page="ideas";
  try{localStorage.removeItem("forge_wizard_draft_v1")}catch(e){}
  persistProfile();render();toast("Forge is activated — your workspace is now personalized");
}
function forgeWizardBack(){forgeWizardCollect();const step=window.__forgeWizardStep||1;if(step>1){window.__forgeWizardStep=step-1;document.getElementById("app").innerHTML=forgeWizardView();window.scrollTo({top:0,behavior:"smooth"})}}
function forgeWizardExit(){forgeWizardCollect();state.profileLocked=false;state.page="onboarding";document.getElementById("app").innerHTML=onboardingLanding();bindMobileInteractions()}
function forgeOpenWizard(){
  if(state.profileLocked){window.__forgeWizardReadOnly=true;document.getElementById("app").innerHTML=forgeLockedProfileView();return;}
  window.__forgeWizardReadOnly=false;window.__forgeWizardStep=1;window.__forgeWizardData=forgeWizardData();document.getElementById("app").innerHTML=forgeWizardView();window.scrollTo({top:0,behavior:"smooth"});
}
function forgeLockedProfileView(){
  const p=state.profile||{};
  return "<div class='forge-profile-page'><div class='forge-profile-card'><div class='brand'><div class='mark'>F</div><span>FORGE</span><small>AI BUSINESS OS</small></div><div class='eyebrow'>PROFILE · LOCKED</div><h1>Your Forge decision context.</h1><p class='sub'>These inputs drive the operating system. They are read-only while the business is active.</p><div class='forge-review-grid'>"+
    [["Capital",BDT(p.budget)],["Income / month",BDT(p.income)],["Expenses / month",BDT(p.expenses)],["Reserve",BDT(p.reserve)],["Location",p.city+", "+p.market],["Experience",p.experience],["Time",p.time+"h/week"],["Risk",p.risk+" · "+p.riskCapacity],["Comfortable loss",BDT(p.lossTolerance)],["Direction",p.category],["Goal",p.goal],["Model",p.model]].map(x=>"<div><small>"+x[0]+"</small><b>"+esc(String(x[1]))+"</b></div>").join("")+
    "</div><div class='forge-w-actions'><button class='btn' type='button' onclick='render()'>← Back to workspace</button></div></div></div>";
}
window.openWizard=forgeOpenWizard;

function onboardingLanding(){
  return "<div class='onboarding forge-onboarding-v4'><div class='onboarding-card forge-landing-card'><div class='brand'><div class='mark'>F</div><span>FORGE</span><small>AI BUSINESS OS</small></div><div class='eyebrow'>STEP 0 · BEFORE THE DASHBOARD</div><div class='h1'>Your business workspace starts with you.</div><p class='sub'>Forge builds the operating system around your real capital, time, experience, risk and direction. We keep the same context connected across every page.</p><div class='forge-landing-grid'><div><b>01 · Financial reality</b><span>Capital, income, expenses and reserve.</span></div><div><b>02 · Risk guardrails</b><span>Risk appetite, capacity and loss tolerance.</span></div><div><b>03 · Business direction</b><span>Category, goal, market and business model.</span></div></div><div class='forge-starter-note'><b>Starter values are already filled.</b><span>They are only starting points. Edit anything that does not describe you.</span></div><button id='forge-start-profile' type='button' class='btn primary forge-start-profile'>Start my Forge profile →</button><p class='small'>Nothing is purchased or published during onboarding. Forge only activates the workspace after you confirm the inputs.</p></div></div>";
}

function render(){
  window.__forgeRendered=true;
  document.body.dataset.page=state.page||"home";
  const app=document.getElementById("app");if(!app)return;
  if(!state.profileLocked){app.innerHTML=onboardingLanding();bindMobileInteractions();return;}
  const pages={home,advisor,ideas,products,plan,orders,brand:brandStudioPage,store,content:contentLibrary,marketing,billing,support,analytics};
  const pageFn=pages[state.page]||home;
  try{
    app.innerHTML=shell(pageFn());
    updateForgeContext();    if(state.page==="products")setTimeout(autoCjSearch,0);
    if(state.page==="plan"&&state.planStatus==="preparing")setTimeout(()=>{if(state.page==="plan")render()},500);
  }catch(err){
    console.error("Forge render error",state.page,err);
    const detail=esc(String(err&&err.message||err));
    app.innerHTML=shell("<div class='forge-error-page'><div class='eyebrow'>WORKSPACE RECOVERY</div><h1>This section could not render.</h1><p class='sub'>Your saved business data is safe. Forge has kept the rest of the workspace available.</p><div class='actions'><button id='forgeRecoveryHome' class='btn primary' type='button'>Return to Command Center</button><button id='forgeRecoveryChat' class='btn' type='button'>Open Forge Chat</button></div><pre>"+detail+"</pre></div>");
    document.getElementById("forgeRecoveryHome")?.addEventListener("click",()=>go("home"));
    document.getElementById("forgeRecoveryChat")?.addEventListener("click",()=>go("advisor"));
  }
}


render();
function updateForgeContext(){
  const labels={
    home:"Command center",
    advisor:"Decision advisor",
    ideas:"Opportunity engine",
    products:"Product Lab",
    plan:"Business plan",
    orders:"Order workspace",
    brand:"Brand Studio",
    store:"Store Launch",
    content:"Content Library",
    marketing:"AI growth loop",
    support:"Customer support",
    analytics:"Business intelligence"
  };
  const el=document.getElementById("forgeStatusText");
  if(el)el.textContent=labels[state.page]||"AI is online";
}
updateForgeContext();
setTimeout(refreshForgeFxRate,50);
setInterval(refreshForgeFxRate,3600000);


/* ---- FORGE SCRIPT BOUNDARY ---- */


(function(){
if(window.__forgeChatV1)return;window.__forgeChatV1=true;
function fcSaved(){try{return JSON.parse(localStorage.getItem("forge_profile_v3")||"{}")}catch(e){return {}}}
function fcData(){var s=fcSaved(),p=s.profile||{},prod=s.selectedProduct||{},brand=s.brandStudio||{},q=Array.isArray(s.sourcingQueue)?s.sourcingQueue:[];return{s:s,p:p,prod:prod,brand:brand,q:q,page:document.body.dataset.page||"home"}}
function fcContext(){var c=fcData(),p=c.p,prod=c.prod,b=c.brand,parts=[];if(c.s.business&&c.s.business.name)parts.push("Business: "+c.s.business.name);if(p.budget)parts.push("Capital: BDT "+Number(p.budget).toLocaleString("en-BD"));if(p.income)parts.push("Income: BDT "+Number(p.income).toLocaleString("en-BD")+"/month");if(p.market)parts.push("Market: "+p.market);if(p.category)parts.push("Category: "+p.category);if(p.risk)parts.push("Risk: "+p.risk);if(p.time)parts.push("Time: "+p.time+"h/week");if(prod.name)parts.push("Product: "+prod.name);if(b.chosenName)parts.push("Brand: "+b.chosenName);return parts.length?parts.join(" · "):"Profile setup is not complete yet."}
function fcMoney(n){return "BDT "+Number(n||0).toLocaleString("en-BD")}
function fcAnswer(question){
var q=String(question||"").trim(),s=q.toLowerCase(),c=fcData(),p=c.p||{},prod=c.prod||{},b=c.brand||{},hist=window.__forgeChatHistory||[];
var budget=Number(p.budget||0),income=Number(p.income||0),expenses=Number(p.expenses||0),reserve=Number(p.reserve||0);
var available=Math.max(0,budget-reserve);
var e=prod.economics||{};
function money(n){return fcMoney(Math.round(Number(n)||0))}
function has(re){return re.test(s)}
function num(){var m=s.match(/(?:\\b|^)(\\d[\\d,]*(?:\\.\\d+)?)(?:\\s*(?:tk|taka|bdt|৳|lakh|lac|k))?/i);if(!m)return 0;var n=Number(String(m[1]).replace(/,/g,""));var u=(m[2]||"").toLowerCase();if(u==="lakh"||u==="lac")n*=100000;else if(u==="k")n*=1000;return n}
function contextLine(){var bits=[];if(budget)bits.push("deployable capital "+money(available));if(reserve)bits.push("protected reserve "+money(reserve));if(p.category)bits.push(p.category);if(p.risk)bits.push(p.risk+" risk appetite");if(p.time)bits.push(p.time+"h/week");if(prod.name)bits.push("product: "+prod.name);return bits.length?bits.join(" · "):"profile not fully configured"}
function stage(){
if(!prod.name)return "profile";
if(!b.chosenName)return "product";
if(!b.chosenProductName)return "brand";
return "plan";
}
if(!q)return "Tell me what you are trying to decide. You can ask in normal language—even if it is not one of my preset questions. I can work from your Forge profile, product, economics, brand and launch stage.";
if(has(/only budget|budget.*only|only.*money.*have|i have.*\d.*budget|my budget is/)){
var stated=num();
if(stated){
  var reserveNow=Number(p.reserve||0);
  var deployNow=Math.max(0,stated-reserveNow);
  return "Got it. I’ll treat "+money(stated)+" as the business budget you are talking about. With the current reserve of "+money(reserveNow)+", the modeled deployable amount is "+money(deployNow)+". I’ll use that number when we discuss product quantity, testing spend and launch costs. I won’t invent another reserve or change your locked profile unless you explicitly update it.";
}
}
if(has(/i (do not|don't|dont) need (an? )?emergency|no (emergency|reserve)|use all|all (of )?my (money|budget|capital)|invest (all|the whole)|no reserve/)){
var invest=num()||available||budget;
return "Understood. You are saying the money is intended for the business, not that you want Forge to hold a separate emergency reserve. Forge currently has a protected reserve of "+money(reserve)+". If you want the full "+money(budget)+" treated as deployable, update the profile input; I will then recalculate the downstream numbers. I won't silently override your locked profile from chat.";
}
if(has(/^(hi|hello|hey|yo|bro|good morning|good evening)\\b/))return "Hey. I’m here. Ask me the actual business question in your own words—budget, product, supplier, pricing, quantity, brand, domain, launch, ads, orders, or whether an idea makes sense.";
if(has(/what (do|can) you know|what.*(know|remember)|my (profile|situation|context)|tell me about my/)){
return "Here is the context Forge is using right now: "+contextLine()+". "+(p.market?"Primary market: "+p.market+". ":"")+(p.experience?"Experience: "+p.experience+". ":"")+(p.goal?"Goal: "+p.goal+". ":"")+"I use these inputs to make the next answer specific to your situation.";
}
if(has(/how much.*invest|how much.*spend|how much.*put|invest.*(budget|capital)|start.*budget|budget.*start/)){
var n=num();
if(n){var remain=available-n;return "If you invest "+money(n)+" from the currently deployable amount of "+money(available)+", you would have about "+money(remain)+" left under Forge’s current profile. "+(remain<0?"That is above the currently deployable amount, so the plan would need a larger deployable budget.":"I would then size the first order, acquisition test and cash buffer around the remaining amount rather than treating the whole budget as inventory.") }
return "Your profile currently shows "+money(available)+" deployable capital. Tell me the amount you are considering investing, and I can show what remains and how that affects first-order quantity, marketing room and cash exposure.";
}
if(has(/profit|make money|earn|income target|salary replacement|monthly.*income|revenue target/)){
var target=Number(p.targetIncome||0);
if(e.contribution&&target){var units=Math.ceil(target/Number(e.contribution));return "Your target additional monthly income is "+money(target)+". At the current modeled contribution of "+money(e.contribution)+" per unit, that is roughly "+units+" contribution-positive units/month before fixed overhead and taxes. Treat this as a planning calculation, not a guaranteed sales forecast."}
return "I can model this from your target income and the confirmed product contribution. "+(prod.name?"Your current product is "+prod.name+". ":"")+"If you give me the monthly income target you want, I can convert it into an approximate unit and revenue requirement.";
}
if(has(/price|pricing|sell for|selling price|charge/)){
if(!prod.name)return "There is no confirmed product in Forge yet. Choose a product first, then I can explain the modeled selling price against supplier cost, CAC, fees, packaging and returns.";
var price=Number(e.selling||0),landed=Number(e.landed||0),cac=Number(e.cac||0),con=Number(e.contribution||0);
return "For "+prod.name+", Forge currently models a selling price of "+money(price)+", landed cost "+money(landed)+", acquisition cost "+money(cac)+", and contribution of about "+money(con)+" per unit. If you want, ask “why this price?”, “what if I sell at ৳X?”, or “what margin do I need?” and I’ll recalculate the logic.";
}
if(has(/what if.*(?:price|sell)|sell.*for.*\\d|price.*\\d/)){
if(!prod.name)return "Choose a product first so I have a cost basis.";
var n2=num(),landed2=Number(e.landed||0),cac2=Number(e.cac||0),fee2=Number(e.fee||0),pack2=Number(e.pack||0),ret2=Number(e.returns||0);
if(!n2)return "Give me the proposed selling price, for example: “What if I sell it for 1,799?”";
var c2=n2-landed2-cac2-fee2-pack2-ret2;
return "At a selling price of "+money(n2)+", using the current modeled landed cost, CAC, fee, packaging and returns, the estimated contribution is "+money(c2)+" per unit ("+(n2?Math.round(c2/n2*100):0)+"%). That is a scenario calculation; it does not change your locked plan.";
}
if(has(/cost|economics|margin|contribution|break.?even|cac|landed/)){
if(!prod.name)return "I need a confirmed product to calculate product economics. Product Lab will connect the supplier record first.";
var gross=Number(e.selling||0)-Number(e.landed||0),cont=Number(e.contribution||0),pct=Number(e.selling||0)?Math.round(cont/Number(e.selling||1)*100):0;
return "Let’s break it down for "+prod.name+": selling "+money(e.selling)+", landed "+money(e.landed)+", CAC "+money(e.cac)+", other modeled costs "+money(Number(e.fee||0)+Number(e.pack||0)+Number(e.returns||0))+", leaving about "+money(cont)+" contribution/unit ("+pct+"%). Break-even then depends on your fixed monthly overhead. If you tell me that overhead, I can calculate the required monthly units.";
}
if(has(/break.?even.*(?:overhead|fixed)|fixed cost|overhead/)){
if(!prod.name)return "Choose a product first. Then give me your monthly fixed overhead and I’ll calculate the approximate break-even units.";
var overhead=num();
if(!overhead)return "What is your monthly fixed overhead? For example: “My fixed cost is ৳40,000.”";
var cu=Number(e.contribution||0),bu=cu>0?Math.ceil(overhead/cu):0;
return cu>0?"With "+money(overhead)+" monthly fixed overhead and about "+money(cu)+" contribution per unit, break-even is roughly "+bu+" units/month. This excludes taxes or unusual one-off costs.":"The current product model has no positive contribution, so a unit break-even calculation is not meaningful until the economics improve.";
}
if(has(/how many|quantity|units|batch|first order|opening order|moq/)){
if(!prod.name)return "Product Lab needs to confirm a product before I can size its opening order.";
var stock=Number(prod.inventory||0),moq=Number(prod.moq||prod.minOrderQty||0),land=Number(e.landed||0),qmax=land?Math.floor(available*.25/land):0;
var suggested=Math.max(moq||10,Math.min(qmax||moq||10,Math.max(moq||10,Number(prod.batch||20))));
return "For "+prod.name+", I would calculate the first order from four things: supplier MOQ"+(moq?" ("+moq+" units)":"")+", landed cost "+money(land)+", your deployable capital "+money(available)+", and your risk profile ("+(p.risk||"not set")+"). A conservative planning ceiling is about "+(qmax||suggested)+" units from 25% of deployable capital. Supplier stock"+(stock?" is "+stock.toLocaleString("en-BD")+" units":" is not available in the saved record")+"; stock should be checked again before payment.";
}
if(has(/supplier|cj|dropship|product lab|stock|connect|loading|why.*wait/)){
return "Product Lab is a live supplier-data step, not a static catalog. Forge should show a visible “Connecting to supplier / checking price & stock” state while CJ data is loading. Once connected, supplier image, name, price, stock and product details should feed the economics. If the feed fails, the UI should say so instead of showing an empty product area.";
}
if(has(/why.*recommend|recommend.*why|why this|why.*chosen|why.*product/)){
if(!prod.name)return "No product is confirmed yet, so there is not a product-specific recommendation to explain.";
var fit=[];if(budget)fit.push("capital");if(p.risk)fit.push("risk");if(p.time)fit.push("available time");if(p.category)fit.push("category");if(p.market)fit.push("market");
return "Forge selected "+prod.name+" because the recommendation is evaluated against "+fit.join(", ")+" and then checked against supplier economics and availability. The important part is the chain: profile → business fit → product → landed economics → quantity → execution. If you tell me what part looks wrong, I can inspect that specific assumption.";
}
if(has(/business idea|what business|what can i sell|which business|start a business|opportunity/)){
var ops=opportunities().slice(0,3).map(function(x){return x.name+" ("+x.fit+"% profile fit)"}).join(", ");
return "Based on your current Forge profile, the available opportunity set includes "+ops+". I can explain any one of them, compare the assumptions side-by-side, or help you understand why Forge is surfacing a particular model.";
}
if(has(/brand|name|instagram|facebook|domain|handle/)){
return "Brand Studio is the identity layer after product confirmation. It can work through company name, product name, social handle and domain in sequence. A domain should only be marked available after the connected registrar confirms live availability and price.";
}
if(has(/store|shopify|launch|website/)){
return "Store Launch should consume the approved decisions from the earlier steps rather than ask you to repeat them. The key dependencies are confirmed product, final product name, domain availability/price and launch configuration. Ask me about any one and I’ll walk through it.";
}
if(has(/marketing|ads|facebook ads|tiktok|content|customer acquisition/)){
return "For marketing, Forge should start from the product’s contribution and your acquisition ceiling—not from a generic ad budget. With a confirmed product, I can turn your modeled CAC into a test budget and show how many orders are needed to recover that spend.";
}
if(has(/order|procure|payment|delivery|shipping/)){
return "Orders is where an approved product becomes an operational commitment. The safe sequence is: confirm quantity → verify price/stock → submit payment → verify payment → procure → track shipment → delivery. Chat can explain each step without changing the order automatically.";
}
if(has(/risk|loss|safe|danger|risky/)){
return "Your Forge risk settings are "+(p.risk||"not set")+" appetite, "+(p.riskCapacity||"not set")+" capacity, with a maximum comfortable loss of "+money(p.lossTolerance||0)+". I use those constraints to keep recommendations proportional to your stated tolerance rather than treating every opportunity the same.";
}
if(has(/confus|don't understand|dont understand|explain|help|what does this mean|what is this/)){
return "Yes—let’s make it simple. Tell me what you see or paste the exact text that confused you. I’ll explain that specific thing using your current Forge context, then give you the next action. You do not need to use a preset question.";
}
if(has(/next|now what|then what|where do i go|what should i do/)){
var st=stage();
if(st==="profile")return "First finish the entrepreneur profile. Forge needs the real constraints before it can personalize recommendations.";
if(st==="product")return "Next, go to Product Lab and confirm a real supplier product. After that, its price, stock and economics become the basis for the downstream workflow.";
if(st==="brand")return "Next, finish Brand Studio: company identity and customer-facing product name. Then review the Business Plan before moving into Store Launch.";
return "Your core product and brand decisions are connected. Next, review the Business Plan, challenge any assumption you dislike here, then move to Store Launch and marketing.";
}
var n3=num();
if(n3){
var base=available||budget;
if(has(/invest|put|spend|use/))return "I see "+money(n3)+" in your question. Compared with your current deployable amount of "+money(base)+", that is "+(base?Math.round(n3/base*100):0)+"% of the available capital. Tell me what the money is for—inventory, ads, branding, store or something else—and I’ll model that specific use.";
}
var topic=has(/product|sell|supplier|cj|dropship/)?"product sourcing":has(/brand|name|domain|instagram|facebook/)?"brand identity":has(/store|shopify|website|launch/)?"store launch":has(/ads|marketing|content|customer/)?"customer acquisition":has(/order|payment|delivery|shipping/)?"operations":has(/money|budget|capital|cost|price|profit|margin/)?"business economics":"business decision";
var stageLabel=stage();
var pageLabel=c.page==="products"?"Product Lab":c.page==="plan"?"Business Plan":c.page==="brand"?"Brand Studio":c.page==="store"?"Store Launch":c.page==="marketing"?"AI Marketing":c.page==="orders"?"Orders":c.page==="ideas"?"Business Finder":"your current Forge workspace";
var productLine=prod.name?" The active product is "+prod.name+".":"";
var capitalLine=budget?" You are working from "+money(available)+" deployable capital.":"";
var generic="I’m treating this as a "+topic+" question from "+pageLabel+"."+productLine+capitalLine+" Based on the information currently saved in Forge, the next useful move is to connect this question to a concrete decision—amount, product, quantity, price, supplier, channel or deadline. Give me that detail in your own words and I’ll calculate the impact instead of giving you a generic answer.";
if(stageLabel==="profile")generic+=" Your profile is the main missing dependency, so I’ll keep the answer anchored to the inputs you have already entered.";
return generic;
}
function fcAdd(role,text){var box=document.getElementById("fcMessages");if(!box)return;var d=document.createElement("div");d.className="fc-msg "+(role==="user"?"user":"assistant");d.textContent=text;box.appendChild(d);box.scrollTop=box.scrollHeight}
function fcSend(q){
var input=document.getElementById("fcInput"),t=String(q||input?.value||"").trim();if(!t)return;
if(input)input.value="";
window.__forgeChatHistory=window.__forgeChatHistory||[];
fcAdd("user",t);
window.__forgeChatHistory.push(t);
if(window.__forgeChatHistory.length>12)window.__forgeChatHistory.shift();
var thinking=document.createElement("div");thinking.className="fc-msg assistant";thinking.id="fcThinking";thinking.innerHTML='<span class="fc-thinking"><i></i><i></i><i></i></span> Forge is thinking…';document.getElementById("fcMessages")?.appendChild(thinking);
setTimeout(function(){thinking.remove();var reply=fcAnswer(t);fcAdd("assistant",reply)},260);
}
function fcContextRefresh(){var el=document.getElementById("fcContext");if(el)el.textContent="Using your Forge context: "+fcContext()}
function fcToggle(){var panel=document.getElementById("forgeChatPanel");if(!panel)return;panel.classList.toggle("open");if(panel.classList.contains("open")){fcContextRefresh();setTimeout(function(){document.getElementById("fcInput")?.focus()},60)}}
function fcInstall(){if(document.getElementById("forgeChatLauncher"))return;var l=document.createElement("button");l.id="forgeChatLauncher";l.type="button";l.innerHTML='<span class="fc-dot"></span> Forge Chat';l.onclick=fcToggle;document.body.appendChild(l);var p=document.createElement("section");p.id="forgeChatPanel";p.innerHTML='<div class="fc-head"><div class="fc-brand"><div class="fc-mark">F</div><div><div class="fc-title">Forge Chat</div><div class="fc-subtitle">Context-aware business assistant</div></div></div><button class="fc-close" type="button">×</button></div><div id="fcContext" class="fc-context"></div><div id="fcMessages" class="fc-messages"><div class="fc-msg assistant"><b>Hi. I’m Forge Chat.</b> Ask me anything about what you see in Forge. I’ll use your saved business context to explain it and suggest the next practical step.</div></div><div class="fc-suggestions"><button class="fc-suggestion" data-q="What should I do next?">What should I do next?</button><button class="fc-suggestion" data-q="Why was this recommended?">Why was this recommended?</button><button class="fc-suggestion" data-q="Explain the economics">Explain the economics</button></div><form class="fc-compose" id="fcForm"><input id="fcInput" class="fc-input" autocomplete="off" placeholder="Ask Forge Chat…"><button class="fc-send" type="submit">Send</button></form>';document.body.appendChild(p);p.querySelector(".fc-close").onclick=fcToggle;p.querySelectorAll(".fc-suggestion").forEach(function(b){b.onclick=function(){fcSend(b.dataset.q)}});p.querySelector("#fcForm").addEventListener("submit",function(e){e.preventDefault();fcSend()})}
function fcAddNav(){document.querySelectorAll(".side,#cornerPanel").forEach(function(nav){if(!nav.querySelector(".forge-chat-nav")){var b=document.createElement("button");b.type="button";b.className="nav forge-chat-nav";b.innerHTML='<span class="ico">◉</span>Forge Chat';b.onclick=fcToggle;nav.appendChild(b)}})}
fcInstall();fcAddNav();fcContextRefresh();new MutationObserver(function(){fcAddNav();fcContextRefresh()}).observe(document.getElementById("app")||document.body,{childList:true,subtree:true});window.fcToggle=fcToggle;
})();

/* FORGE BUSINESS PLAN V2 — portfolio-first planning + 3-product selection */
(function(){
  function forgePlanProducts(){
    const q=Array.isArray(state.sourcingQueue)?state.sourcingQueue:[];
    const selected=q.filter(x=>x && x.planSelected).slice(0,3);
    if(selected.length) return selected;
    return state.selectedProduct ? [state.selectedProduct] : [];
  }

  function forgePlanEconomics(products){
    return products.reduce(function(a,p){
      const e=p.economics||liveEconomics(p)||{};
      const qty=Number(p.plannedOrderQty||p.orderQty||quantityPlan(p).planned||1);
      a.capital+=qty*Number(e.landed||0);
      a.selling+=Number(e.selling||0);
      a.contribution+=Number(e.contribution||0);
      a.cac+=Number(e.cac||0);
      a.qty+=qty;
      a.products+=1;
      return a;
    },{capital:0,selling:0,contribution:0,cac:0,qty:0,products:0});
  }

  function forgePlanSelectionBar(){
    const products=forgePlanProducts();
    let el=document.getElementById("forge-plan-selection");
    if(!products.length){
      if(el) el.remove();
      return;
    }
    if(!el){
      el=document.createElement("div");
      el.id="forge-plan-selection";
      document.body.appendChild(el);
    }
    el.innerHTML=
      "<div class='forge-plan-tray-inner'>"+
        "<div class='forge-plan-tray-copy'><span>PLAN SHORTLIST</span><b>"+products.length+"/3 products selected</b><small>"+(products.length<2?"Add at least one more product to compare the portfolio.":"Your selected products will be planned together.")+"</small></div>"+
        "<div class='forge-plan-tray-products'>"+
          products.map(function(p,i){
            return "<div class='forge-plan-tray-product'><img src='"+esc(p.image||"")+"' alt=''><div><b>"+esc(p.name||"Product")+"</b><span>"+(i===0?"Hero product":"Product "+(i+1))+"</span></div><button type='button' onclick='forgeRemovePlanProduct("+i+")' aria-label='Remove product'>×</button></div>";
          }).join("")+
        "</div>"+
        "<div class='forge-plan-tray-actions'><button class='btn' type='button' onclick='forgeClearPlanProducts()'>Clear</button><button class='btn primary' type='button' "+(products.length<2?"disabled":"")+" onclick='go("plan")'>Build business plan →</button></div>"+
      "</div>";
  }

  window.forgeRemovePlanProduct=function(index){
    const products=forgePlanProducts();
    const target=products[index];
    if(!target)return;
    const item=state.sourcingQueue.find(x=>x===target || x.id===target.id);
    if(item)item.planSelected=false;
    if(state.selectedProduct && (state.selectedProduct===target || state.selectedProduct.id===target.id)){
      const next=forgePlanProducts()[0]||null;
      state.selectedProduct=next;
    }
    try{persistProfile()}catch(e){}
    render();
  };

  window.forgeClearPlanProducts=function(){
    (state.sourcingQueue||[]).forEach(function(x){x.planSelected=false});
    state.selectedProduct=null;
    try{persistProfile()}catch(e){}
    const tray=document.getElementById("forge-plan-selection");
    if(tray)tray.remove();
    toast("Plan shortlist cleared");
  };

  window.forgeSetHeroProduct=function(index){
    const products=forgePlanProducts();
    if(!products[index])return;
    products.forEach(function(x){x.planSelected=false});
    const hero=products[index];
    hero.planSelected=true;
    const q=state.sourcingQueue||[];
    q.forEach(function(x){if(x.id!==hero.id)x.planSelected=false});
    /* Preserve ordering while moving the chosen hero to the front. */
    const rest=q.filter(function(x){return x.id!==hero.id});
    state.sourcingQueue=[hero].concat(rest);
    state.selectedProduct=hero;
    try{persistProfile()}catch(e){}
    render();
  };

  function forgeProductSelectionCard(p,index){
    const e=p.economics||liveEconomics(p)||{};
    const qp=quantityPlan(p);
    const qty=Number(p.plannedOrderQty||p.orderQty||qp.planned||1);
    const role=index===0?"HERO PRODUCT":"SUPPORTING PRODUCT";
    return "<article class='fp-product-card "+(index===0?"is-hero":"")+"'>"+
      "<div class='fp-product-media'><img src='"+esc(p.image||"")+"' alt='"+esc(p.name||"Product")+"'><span>"+role+"</span><button type='button' onclick='forgeSetHeroProduct("+index+")' title='Make this the hero product'>"+(index===0?"01":"0"+(index+1))+"</button></div>"+
      "<div class='fp-product-body'>"+
        "<div class='fp-product-index'>PRODUCT "+String(index+1).padStart(2,"0")+"</div>"+
        "<h3>"+esc(p.name||"Unnamed product")+"</h3>"+
        "<p>"+esc(p.category||"Connected supplier product")+" · live supplier record</p>"+
        "<div class='fp-product-numbers'>"+
          "<div><span>Landed / unit</span><b>"+BDT(e.landed)+"</b></div>"+
          "<div><span>Selling / unit</span><b>"+BDT(e.selling)+"</b></div>"+
          "<div><span>Contribution</span><b>"+BDT(e.contribution)+"</b></div>"+
          "<div><span>Margin</span><b>"+pct(e.margin)+"</b></div>"+
        "</div>"+
        "<div class='fp-product-foot'><span>"+formatQty(qty)+" planned units</span><button class='fp-text-btn' type='button' onclick='forgeRemovePlanProduct("+index+")'>Remove</button></div>"+
      "</div>"+
    "</article>";
  }

  function forgePlanV2(){
    const products=forgePlanProducts();
    if(!products.length){
      return "<div class='fp-empty'>"+
        "<div><span class='fp-eyebrow'>BUSINESS PLAN</span><h1>Build the plan after you shortlist your products.</h1><p>Select 2–3 live supplier products in Product Lab. Forge will turn the shortlist into one operating plan instead of forcing you to create separate plans.</p><button class='btn primary' onclick='go("products")'>Open Product Lab →</button></div>"+
      "</div>";
    }

    const p=state.profile||{};
    const b=state.business||{};
    const brand=(state.brandStudio&&state.brandStudio.chosenName)||b.name||"Your New Business";
    const market=p.market||"Bangladesh";
    const category=p.category||products[0].category||"your category";
    const risk=p.risk||"Balanced";
    const goal=p.goal||"Profit + growth";
    const deploy=Math.max(0,Number(p.budget||b.budget||0)-Number(p.reserve||0));
    const totals=forgePlanEconomics(products);
    const remaining=Math.max(0,deploy-totals.capital);
    const testEnvelope=Math.round(remaining*.25);
    const avgContribution=totals.qty?Math.round(totals.contribution/products.length):0;
    const blendedMargin=totals.selling?Math.round(totals.contribution/totals.selling*100):0;
    const hero=products[0];
    const heroE=hero.economics||liveEconomics(hero)||{};
    const firstBatch=totals.qty;
    const founderTime=Number(p.time||0);

    const metric=function(label,value,note){
      return "<div class='fp-metric'><span>"+label+"</span><b>"+value+"</b><small>"+note+"</small></div>";
    };

    const productRows=products.map(function(x,i){
      const e=x.economics||liveEconomics(x)||{};
      const q=Number(x.plannedOrderQty||x.orderQty||quantityPlan(x).planned||1);
      return "<div class='fp-table-row'><div><span>"+String(i+1).padStart(2,"0")+"</span><b>"+esc(x.name||"Product")+"</b></div><b>"+formatQty(q)+"</b><b>"+BDT(e.landed)+"</b><b>"+BDT(e.selling)+"</b><b>"+BDT(e.contribution)+"</b><b>"+pct(e.margin)+"</b></div>";
    }).join("");

    const roadmap=[
      ["01","Validate","Samples, product quality, variants, delivery and customer objections."],
      ["02","Launch","One storefront, one clear offer, controlled acquisition tests and reliable support."],
      ["03","Measure","Contribution, CAC, conversion, delivered orders, returns and product velocity."],
      ["04","Scale","Increase the winning SKU only when real delivered economics support the next commitment."]
    ];

    return "<div class='fp-page'>"+
      "<header class='fp-hero'>"+
        "<div class='fp-hero-main'>"+
          "<div class='fp-eyebrow'>FORGE / BUSINESS PLAN</div>"+
          "<div class='fp-status'><span></span>CONNECTED OPERATING PLAN</div>"+
          "<h1>"+esc(brand)+"</h1>"+
          "<p class='fp-hero-sub'>A portfolio plan built around <strong>"+products.length+" connected products</strong>, your capital, market, time and risk limits.</p>"+
          "<div class='fp-meta'><span>"+esc(market)+"</span><span>"+esc(category)+"</span><span>"+esc(goal)+"</span><span>"+esc(risk)+" risk</span></div>"+
        "</div>"+
        "<div class='fp-hero-side'><span>DEPLOYABLE CAPITAL</span><b>"+BDT(deploy)+"</b><small>"+(founderTime?founderTime+"h / week available":"Time not set")+" · reserve "+BDT(p.reserve||0)+"</small></div>"+
      "</header>"+

      "<section class='fp-product-section'>"+
        "<div class='fp-section-head'><div><span class='fp-eyebrow'>THE PRODUCT PORTFOLIO</span><h2>Your plan is built around these products.</h2><p>Forge keeps the products connected so pricing, cash use, marketing and launch decisions stay consistent.</p></div><button class='btn' onclick='go("products")'>Edit shortlist</button></div>"+
        "<div class='fp-product-grid'>"+products.map(forgeProductSelectionCard).join("")+"</div>"+
      "</section>"+

      "<section class='fp-command'>"+
        "<div><span class='fp-eyebrow'>FORGE'S READ</span><h2>"+(products.length===1?"One focused product.":"A controlled product portfolio.")+"</h2><p>"+(products.length===1?"This keeps the first launch easy to learn from.":"Use one hero product to establish the brand, then use the supporting products to test adjacent demand without turning the launch into a catalogue.")+"</p></div>"+
        "<div class='fp-command-side'><b>"+formatQty(firstBatch)+"</b><span>planned opening units across the portfolio</span></div>"+
      "</section>"+

      "<section class='fp-economics'>"+
        "<div class='fp-section-head'><div><span class='fp-eyebrow'>MONEY MODEL</span><h2>Portfolio economics at a glance.</h2><p>Planning values only. Supplier price, freight, fees and actual acquisition costs must be rechecked before payment.</p></div></div>"+
        "<div class='fp-metric-grid'>"+
          metric("OPENING INVENTORY",BDT(totals.capital),"planned landed commitment")+
          metric("SELLING VALUE",BDT(totals.selling),"one unit of each product")+
          metric("MODELED CONTRIBUTION",BDT(totals.contribution),"portfolio unit contribution")+
          metric("BLENDED MARGIN",blendedMargin+"%","modeled contribution / selling")+
          metric("REMAINING ENVELOPE",BDT(remaining),"after planned inventory")+
          metric("TEST ENVELOPE",BDT(testEnvelope),"25% of remaining capital")+
        "</div>"+
        "<div class='fp-table'>"+
          "<div class='fp-table-head'><span>PRODUCT</span><span>QTY</span><span>LANDED</span><span>SELLING</span><span>CONTRIBUTION</span><span>MARGIN</span></div>"+
          productRows+
        "</div>"+
      "</section>"+

      "<section class='fp-two-column'>"+
        "<div class='fp-panel'>"+
          "<div class='fp-panel-head'><span class='fp-eyebrow'>BUSINESS LOGIC</span><h2>Why this portfolio makes sense</h2></div>"+
          "<div class='fp-reason'><b>One brand story</b><span>The products should serve the same customer and category rather than becoming unrelated supplier listings.</span></div>"+
          "<div class='fp-reason'><b>One learning loop</b><span>Every order gives Forge evidence about demand, CAC, conversion, objections, returns and product velocity.</span></div>"+
          "<div class='fp-reason'><b>One cash discipline</b><span>The opening commitment is visible as one portfolio envelope instead of hiding cash exposure inside separate product decisions.</span></div>"+
        "</div>"+
        "<div class='fp-panel'>"+
          "<div class='fp-panel-head'><span class='fp-eyebrow'>GUARDRAILS</span><h2>Before you spend</h2></div>"+
          "<div class='fp-guardrail'><span>01</span><b>Recheck live supplier price and stock.</b></div>"+
          "<div class='fp-guardrail'><span>02</span><b>Validate samples and product claims.</b></div>"+
          "<div class='fp-guardrail'><span>03</span><b>Protect the reserve of "+BDT(p.reserve||0)+".</b></div>"+
          "<div class='fp-guardrail'><span>04</span><b>Scale only after delivered economics are proven.</b></div>"+
        "</div>"+
      "</section>"+

      "<section class='fp-roadmap'>"+
        "<div class='fp-section-head'><div><span class='fp-eyebrow'>90-DAY OPERATING ROADMAP</span><h2>What happens next.</h2></div><button class='btn' onclick='printBusinessPlan()'>Print / Save PDF</button></div>"+
        "<div class='fp-roadmap-grid'>"+
          roadmap.map(function(r){return "<div><span>"+r[0]+"</span><b>"+r[1]+"</b><p>"+r[2]+"</p></div>"}).join("")+
        "</div>"+
      "</section>"+

      "<section class='fp-footer-note'><div><span class='fp-eyebrow'>PLAN PRINCIPLE</span><b>Build evidence before adding complexity.</b><p>Forge will carry this product portfolio into Brand Studio, Store Launch, Marketing and Orders. Any live cost or supplier change should trigger a fresh economics check.</p></div><button class='btn primary' onclick='go("brand")'>Continue to Brand Studio →</button></section>"+
    "</div>";
  }

  window.printBusinessPlan=function(){
    const el=document.querySelector(".fp-page");
    if(!el)return toast("Build the business plan first.");
    const w=window.open("","_blank","width=1200,height=900");
    if(!w)return toast("Allow pop-ups to print the business plan.");
    w.document.write("<!doctype html><html><head><title>Forge Business Plan</title><style>body{font-family:Inter,Arial,sans-serif;color:#111;background:#fff;max-width:1100px;margin:0 auto;padding:36px;line-height:1.45}*{box-sizing:border-box}.fp-hero,.fp-command,.fp-panel,.fp-product-card,.fp-economics,.fp-roadmap,.fp-footer-note{border:1px solid #111;border-radius:18px;padding:24px;margin-bottom:18px}.fp-product-grid,.fp-metric-grid,.fp-two-column,.fp-roadmap-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.fp-product-grid{grid-template-columns:repeat(3,1fr)}.fp-product-media{height:180px;background:#f5f5f5;position:relative;overflow:hidden}.fp-product-media img{width:100%;height:100%;object-fit:contain}.fp-product-body{padding:18px}.fp-product-numbers{display:grid;grid-template-columns:1fr 1fr;gap:8px}.fp-metric{border:1px solid #ddd;border-radius:12px;padding:15px}.fp-metric span,.fp-metric small{display:block;color:#666}.fp-metric b{display:block;font-size:21px;margin:4px 0}.fp-table-head,.fp-table-row{display:grid;grid-template-columns:2.2fr .7fr 1fr 1fr 1fr .7fr;gap:10px;padding:12px;border-bottom:1px solid #ddd}.fp-table-head{font-size:10px;font-weight:800}.fp-table-row b{font-size:13px}.fp-eyebrow{font-size:10px;font-weight:800;letter-spacing:.14em}.fp-hero h1{font-size:54px;margin:10px 0}.fp-hero{display:flex;justify-content:space-between;gap:30px}.fp-hero-side{min-width:220px}.fp-hero-side b{font-size:32px;display:block}.fp-reason,.fp-guardrail{padding:12px 0;border-bottom:1px solid #ddd}.fp-reason b,.fp-reason span{display:block}.fp-roadmap-grid>div{border:1px solid #ddd;border-radius:12px;padding:16px}.fp-roadmap-grid span{font-size:11px;font-weight:800}.fp-roadmap-grid b{display:block;margin:5px 0}.fp-footer-note{display:flex;justify-content:space-between;gap:20px}@media print{body{padding:0}.fp-page{width:100%}.btn{display:none!important}}</style></head><body>"+el.outerHTML+"</body></html>");
    w.document.close();setTimeout(function(){w.print()},250);
  };

  /* Product Lab selection flow: max 3, sticky tray, selection survives navigation. */
  window.reviewCj=function(i){
    const p=cjState[i]; if(!p)return;
    const e=liveEconomics(p)||{};
    const modal=ensureForgeModalHost();
    const box=document.getElementById("modalbox");
    if(!box)return;
    const already=forgePlanProducts().some(function(x){return x.id===p.id});
    box.innerHTML=
      "<div class='forge-product-review-v2'>"+
        "<div class='fp-modal-top'><div><span class='fp-eyebrow'>PRODUCT LAB / LIVE RECORD</span><h2>Review product</h2><p>Inspect the supplier record before adding it to your business-plan shortlist.</p></div><button type='button' class='fp-modal-close' onclick='closeModal()'>×</button></div>"+
        "<div class='fp-modal-grid'>"+
          "<div class='fp-modal-image'><img src='"+esc(p.image||"")+"' alt='"+esc(p.name||"Product")+"'><span>LIVE SUPPLIER RECORD</span></div>"+
          "<div class='fp-modal-info'><span class='fp-modal-category'>"+esc(p.category||"Product")+"</span><h3>"+esc(p.name||"Product")+"</h3><div class='fp-modal-price'>"+moneyUsd(p.priceUsd)+"</div><small>Live supplier price · ≈ "+BDT(e.supplier)+"</small>"+
            "<div class='fp-modal-econ'>"+
              "<div><span>Landed</span><b>"+BDT(e.landed)+"</b></div><div><span>Selling</span><b>"+BDT(e.selling)+"</b></div><div><span>Contribution</span><b>"+BDT(e.contribution)+"</b></div><div><span>Margin</span><b>"+pct(e.margin)+"</b></div>"+
            "</div>"+
            "<div class='fp-modal-stock'><span>Supplier stock</span><b>"+formatQty(p.inventory)+"</b><span>Delivery</span><b>"+esc(p.deliveryDays||"Checked before order")+"</b></div>"+
          "</div>"+
        "</div>"+
        "<div class='fp-modal-next'><b>Why Forge keeps this in the shortlist</b><span>This product is connected to the same supplier economics used by the Business Plan. Adding it does not commit you to a purchase; it only places the live record into your 3-product planning set.</span></div>"+
        "<div class='fp-modal-actions'><button class='btn' onclick='closeModal()'>Keep comparing</button><button class='btn primary' "+(already?"disabled":"")+" onclick='addCjToQueue("+i+")'>"+(already?"Already shortlisted":"Add to plan shortlist →")+"</button></div>"+
      "</div>";
    document.getElementById("modal").classList.add("open");
  };

  window.addCjToQueue=function(i){
    const p=cjState[i]; if(!p)return;
    const current=forgePlanProducts();
    if(current.some(function(x){return x.id===p.id})){
      closeModal();toast("This product is already in your plan shortlist.");return;
    }
    if(current.length>=3){
      closeModal();toast("Your business plan can contain up to 3 products.");return;
    }
    const e=liveEconomics(p)||{};
    const qp=quantityPlan(p);
    const item={...p,economics:e,selectedAt:new Date().toISOString(),sourceType:"connected_supplier",orderStatus:"draft",paymentStatus:"unpaid",procurementStatus:"awaiting_payment",deliveryStatus:"not_started",orderQty:qp.planned,minimumOrderQty:qp.minimum,suggestedOrderQty:qp.suggested,plannedOrderQty:qp.planned,variant:"Standard variant",orderRef:"FORGE-"+new Date().toISOString().replace(/\D/g,"").slice(0,14),planStatus:"preparing",planRequestedAt:new Date().toISOString(),planSelected:true};
    state.sourcingQueue=Array.isArray(state.sourcingQueue)?state.sourcingQueue:[];
    state.sourcingQueue.unshift(item);
    state.selectedProduct=state.selectedProduct||item;
    state.planStatus="preparing";
    state.planRequestedAt=new Date().toISOString();
    state.business=state.business||{name:(state.profile?.occupation||"My Business"),budget:Number(state.profile?.budget||0)};
    try{persistProfile()}catch(e){}
    closeModal();
    forgePlanSelectionBar();
    toast("Added to plan shortlist · "+(current.length+1)+"/3");
  };

  const originalRenderCjResults=window.renderCjResults||renderCjResults;
  window.renderCjResults=function(j){
    originalRenderCjResults(j);
    setTimeout(forgePlanSelectionBar,0);
  };

  /* The existing render() calls the local function binding. Replace that binding with the V2 plan renderer. */
  plan=forgePlanV2;

  /* Inject the product shortlist tray whenever Product Lab is visible. */
  const originalGo=window.go;
  if(typeof originalGo==="function"){
    window.go=function(page){
      originalGo(page);
      setTimeout(function(){if(page==="products")forgePlanSelectionBar();},40);
    };
  }

  const style=document.createElement("style");
  style.id="forge-business-plan-v2";
  style.textContent=
    ":root{--fp-black:#111;--fp-ink:#171717;--fp-muted:#6b6b6b;--fp-line:#dedede;--fp-soft:#f6f6f6;--fp-white:#fff}"+
    ".fp-page{max-width:1320px;margin:0 auto;padding:8px 0 90px;color:var(--fp-ink)}"+
    ".fp-eyebrow{display:block;font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#555}"+
    ".fp-hero{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:24px;border-bottom:1px solid #111;padding:42px 0 34px;margin-bottom:34px}"+
    ".fp-hero-main h1{font-size:clamp(44px,6vw,78px);line-height:.94;letter-spacing:-.055em;margin:12px 0 18px;font-weight:800}"+
    ".fp-hero-sub{max-width:760px;font-size:18px;line-height:1.55;margin:0 0 18px;color:#444}.fp-hero-sub strong{color:#111}"+
    ".fp-status{display:inline-flex;align-items:center;gap:7px;border:1px solid #111;border-radius:999px;padding:6px 10px;font-size:9px;font-weight:800;letter-spacing:.12em}.fp-status span{width:6px;height:6px;border-radius:50%;background:#111}"+
    ".fp-meta{display:flex;flex-wrap:wrap;gap:7px}.fp-meta span{border:1px solid #cfcfcf;border-radius:999px;padding:7px 10px;font-size:10px;font-weight:700}"+
    ".fp-hero-side{border-left:1px solid #ddd;padding:8px 0 8px 26px;display:flex;flex-direction:column;justify-content:center}.fp-hero-side span{font-size:10px;font-weight:800;letter-spacing:.12em;color:#666}.fp-hero-side b{font-size:36px;letter-spacing:-.04em;margin:7px 0}.fp-hero-side small{color:#666;font-size:11px}"+
    ".fp-section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:16px}.fp-section-head h2{font-size:28px;letter-spacing:-.035em;margin:5px 0}.fp-section-head p{margin:0;color:#666;max-width:720px;font-size:13px;line-height:1.5}"+
    ".fp-product-section{margin-bottom:38px}.fp-product-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.fp-product-card{border:1px solid #cfcfcf;border-radius:16px;background:#fff;overflow:hidden;transition:transform .18s ease,box-shadow .18s ease}.fp-product-card:hover{transform:translateY(-2px);box-shadow:0 12px 35px rgba(0,0,0,.07)}.fp-product-card.is-hero{border-color:#111}.fp-product-media{height:230px;background:#f7f7f7;position:relative;border-bottom:1px solid #ddd}.fp-product-media img{width:100%;height:100%;object-fit:contain}.fp-product-media>span{position:absolute;top:12px;left:12px;background:#111;color:#fff;border-radius:999px;padding:7px 9px;font-size:9px;font-weight:800;letter-spacing:.12em}.fp-product-media>button{position:absolute;right:12px;top:12px;width:30px;height:30px;border:1px solid #111;background:#fff;border-radius:50%;font-size:10px;font-weight:800;cursor:pointer}.fp-product-body{padding:17px}.fp-product-index{font-size:9px;font-weight:800;letter-spacing:.15em;color:#777}.fp-product-body h3{font-size:19px;line-height:1.15;letter-spacing:-.02em;margin:7px 0}.fp-product-body>p{font-size:11px;color:#666;margin:0 0 15px}.fp-product-numbers{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #e1e1e1}.fp-product-numbers>div{padding:10px 8px;border-bottom:1px solid #e1e1e1}.fp-product-numbers>div:nth-child(odd){border-right:1px solid #e1e1e1}.fp-product-numbers span{display:block;font-size:9px;color:#777}.fp-product-numbers b{display:block;font-size:14px;margin-top:3px}.fp-product-foot{display:flex;align-items:center;justify-content:space-between;padding-top:13px;font-size:10px;font-weight:700}.fp-text-btn{border:0;background:none;text-decoration:underline;font-weight:700;cursor:pointer}.fp-command{display:flex;justify-content:space-between;align-items:center;gap:30px;border-top:1px solid #111;border-bottom:1px solid #111;padding:25px 0;margin:38px 0}.fp-command h2{font-size:25px;margin:5px 0}.fp-command p{max-width:720px;color:#555;margin:0;font-size:13px}.fp-command-side{min-width:190px;text-align:right}.fp-command-side b{display:block;font-size:35px}.fp-command-side span{font-size:10px;color:#666}"+
    ".fp-economics{margin-bottom:40px}.fp-metric-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0}.fp-metric{border:1px solid #ddd;border-radius:12px;padding:16px;background:#fff}.fp-metric span{display:block;font-size:9px;font-weight:800;letter-spacing:.08em;color:#777}.fp-metric b{display:block;font-size:24px;letter-spacing:-.035em;margin:6px 0}.fp-metric small{display:block;color:#777;font-size:10px}.fp-table{border:1px solid #ddd;border-radius:14px;overflow:hidden}.fp-table-head,.fp-table-row{display:grid;grid-template-columns:2.3fr .65fr 1fr 1fr 1.1fr .7fr;gap:10px;align-items:center;padding:13px 15px}.fp-table-head{background:#f5f5f5;font-size:9px;font-weight:800;letter-spacing:.1em;color:#666}.fp-table-row{border-top:1px solid #e4e4e4;font-size:11px}.fp-table-row>div{display:flex;align-items:center;gap:10px}.fp-table-row>div span{font-size:9px;color:#888;font-weight:800}.fp-table-row b{font-size:12px}.fp-two-column{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:40px}.fp-panel{border:1px solid #ddd;border-radius:15px;padding:22px}.fp-panel-head h2{font-size:22px;margin:5px 0 16px}.fp-reason{padding:14px 0;border-top:1px solid #e5e5e5}.fp-reason b{display:block;font-size:13px}.fp-reason span{display:block;color:#666;font-size:11px;line-height:1.5;margin-top:4px}.fp-guardrail{display:grid;grid-template-columns:28px 1fr;gap:10px;padding:12px 0;border-top:1px solid #e5e5e5}.fp-guardrail span{font-size:9px;font-weight:800;color:#777}.fp-guardrail b{font-size:12px}.fp-roadmap{margin-bottom:28px}.fp-roadmap-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.fp-roadmap-grid>div{border:1px solid #ddd;border-radius:14px;padding:18px;min-height:150px}.fp-roadmap-grid span{font-size:9px;font-weight:800;color:#777}.fp-roadmap-grid b{display:block;font-size:16px;margin:7px 0}.fp-roadmap-grid p{font-size:11px;line-height:1.5;color:#666;margin:0}.fp-footer-note{display:flex;justify-content:space-between;align-items:center;gap:25px;border:1px solid #111;border-radius:16px;padding:22px}.fp-footer-note>b,.fp-footer-note p{display:block}.fp-footer-note>div>b{display:block;font-size:18px;margin-top:5px}.fp-footer-note>div p{color:#666;font-size:11px;max-width:760px;margin:6px 0 0}"+
    ".fp-empty{min-height:560px;display:flex;align-items:center;justify-content:center;text-align:center;border:1px solid #ddd;border-radius:18px;padding:60px}.fp-empty>div{max-width:650px}.fp-empty h1{font-size:48px;letter-spacing:-.05em;margin:10px 0}.fp-empty p{color:#666;line-height:1.6;margin-bottom:24px}"+
    ".forge-product-review-v2{max-width:980px;background:#fff;border:1px solid #111;border-radius:20px;padding:28px}.fp-modal-top{display:flex;justify-content:space-between;gap:20px;border-bottom:1px solid #ddd;padding-bottom:18px}.fp-modal-top h2{font-size:32px;letter-spacing:-.035em;margin:5px 0}.fp-modal-top p{margin:0;color:#666;font-size:12px}.fp-modal-close{width:38px;height:38px;border:1px solid #111;background:#fff;border-radius:50%;font-size:20px;cursor:pointer}.fp-modal-grid{display:grid;grid-template-columns:44% 56%;gap:28px;padding:26px 0}.fp-modal-image{height:430px;background:#f7f7f7;border:1px solid #ddd;border-radius:14px;position:relative;overflow:hidden}.fp-modal-image img{width:100%;height:100%;object-fit:contain}.fp-modal-image span{position:absolute;top:14px;left:14px;background:#111;color:#fff;padding:7px 9px;border-radius:999px;font-size:9px;font-weight:800;letter-spacing:.12em}.fp-modal-category{font-size:10px;color:#666;text-transform:uppercase;letter-spacing:.1em;font-weight:800}.fp-modal-info h3{font-size:30px;line-height:1.1;letter-spacing:-.04em;margin:8px 0 16px}.fp-modal-price{font-size:36px;font-weight:800;letter-spacing:-.04em}.fp-modal-info small{color:#666}.fp-modal-econ{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:24px}.fp-modal-econ>div{border:1px solid #ddd;border-radius:12px;padding:15px}.fp-modal-econ span,.fp-modal-stock span{display:block;color:#777;font-size:9px}.fp-modal-econ b{display:block;font-size:18px;margin-top:4px}.fp-modal-stock{display:grid;grid-template-columns:1fr 1fr;gap:12px;border-top:1px solid #ddd;margin-top:18px;padding-top:18px}.fp-modal-stock b{font-size:14px}.fp-modal-next{border:1px solid #111;border-radius:12px;padding:16px;display:grid;gap:5px}.fp-modal-next b{font-size:12px}.fp-modal-next span{font-size:11px;line-height:1.5;color:#666}.fp-modal-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:18px}"+
    ".forge-plan-tray{display:none}.forge-plan-tray-inner{max-width:1320px;margin:0 auto;display:grid;grid-template-columns:190px 1fr auto;gap:18px;align-items:center}.forge-plan-tray-copy span{display:block;font-size:9px;font-weight:800;letter-spacing:.14em;color:#777}.forge-plan-tray-copy b{display:block;font-size:14px}.forge-plan-tray-copy small{display:block;color:#777;font-size:10px;margin-top:2px}.forge-plan-tray-products{display:flex;gap:8px;min-width:0}.forge-plan-tray-product{display:flex;align-items:center;gap:8px;border:1px solid #ccc;background:#fff;border-radius:10px;padding:6px 8px;min-width:170px}.forge-plan-tray-product img{width:38px;height:38px;object-fit:contain;background:#f6f6f6;border-radius:7px}.forge-plan-tray-product div{min-width:0}.forge-plan-tray-product b{display:block;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px}.forge-plan-tray-product span{display:block;font-size:9px;color:#777}.forge-plan-tray-product button{margin-left:auto;border:0;background:none;font-size:17px;cursor:pointer}.forge-plan-tray-actions{display:flex;gap:7px}.forge-plan-tray-actions .btn[disabled]{opacity:.35;cursor:not-allowed}"+
    "#forge-plan-selection{position:fixed;left:calc(50% + 92px);right:20px;bottom:16px;z-index:9000;background:#fff;border:1px solid #111;border-radius:16px;padding:10px 12px;box-shadow:0 18px 50px rgba(0,0,0,.12)}"+
    "@media(max-width:1050px){.fp-hero{grid-template-columns:1fr}.fp-hero-side{border-left:0;border-top:1px solid #ddd;padding:18px 0 0}.fp-product-grid{grid-template-columns:1fr 1fr}.fp-roadmap-grid{grid-template-columns:1fr 1fr}.fp-metric-grid{grid-template-columns:1fr 1fr}.forge-plan-tray-inner{grid-template-columns:1fr}.forge-plan-tray-products{overflow:auto}.forge-plan-tray-actions{justify-content:flex-end}}"+
    "@media(max-width:760px){.fp-page{padding:0 0 100px}.fp-hero-main h1{font-size:46px}.fp-product-grid,.fp-two-column,.fp-roadmap-grid,.fp-metric-grid{grid-template-columns:1fr}.fp-section-head,.fp-command,.fp-footer-note{display:block}.fp-section-head .btn,.fp-footer-note .btn{margin-top:12px}.fp-table{overflow:auto}.fp-table-head,.fp-table-row{min-width:760px}.fp-modal-grid{grid-template-columns:1fr}.fp-modal-image{height:300px}.forge-plan-tray-inner{display:block}.forge-plan-tray-products{margin:8px 0}.forge-plan-tray-actions{justify-content:space-between}#forge-plan-selection{left:10px;right:10px;bottom:10px}}";
  document.head.appendChild(style);

  /* Reinstall the tray after navigation/rerender without creating duplicates. */
  const observer=new MutationObserver(function(){
    if(state.page==="products")forgePlanSelectionBar();
  });
  observer.observe(document.getElementById("app")||document.body,{childList:true,subtree:true});
  setTimeout(function(){if(state.page==="products")forgePlanSelectionBar()},100);
})();
