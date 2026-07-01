import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { PawPrint, Cat, ShieldCheck, CreditCard, Users, Store, Building2, FileText, Lock, Edit3 } from 'lucide-react'
import './styles.css'
import { CAT_QUESTIONS, OWNER_QUESTIONS, DEFAULT_RESULT_TEMPLATES, TRAITS, CAT_EXPRESSIONS } from './data/questions'
import { getStore, setStore, uid } from './utils/storage'

const ADMIN_EMAIL = 'kassab.team@icloud.com'
// Change this after upload. For real production use, move auth to Supabase/Clerk/Firebase.
const ADMIN_PASSCODE = 'CHANGE-THIS-ADMIN-PASSCODE'
const STRIPE_CAT_TEST_URL = 'https://buy.stripe.com/REPLACE_CAT_PERSONALITY_TEST_LINK'
const STRIPE_BREEDER_LISTING_URL = 'https://buy.stripe.com/REPLACE_BREEDER_5_ANNUAL_LINK'

const roles = [
  { id: 'owner', label: 'Pet Owner', icon: Cat },
  { id: 'breeder', label: 'Breeder', icon: Users },
  { id: 'vendor', label: 'Vendor', icon: Store },
  { id: 'association', label: 'Association / Organization', icon: Building2 },
  { id: 'transport', label: 'Pet Transport / Shipping Service', icon: Building2 },
]

const initialBreeder = {
  cattery: '', contactName: '', email: '', phone: '', location: '', website: '',
  breeds: '', rights: 'Pet only', registered: 'Yes', registry: 'TICA', registrationNumber: '',
  depositRequired: 'Yes', depositAmount: '', availability: 'Available now', delivery: 'Pickup only',
  certification: false, noBroker: false, status: 'pending', paid: false
}

function scoreToPercent(score, max = 4) { return Math.round((score / max) * 100) }

function calculateCatProfile(answers) {
  const traitScores = {}
  const traitCounts = {}
  CAT_QUESTIONS.forEach(q => {
    const answerIndex = answers[q.id]
    if (answerIndex === undefined) return
    const answer = q.answers[answerIndex]
    traitScores[q.trait] = (traitScores[q.trait] || 0) + answer.score
    traitCounts[q.trait] = (traitCounts[q.trait] || 0) + 1
  })
  const normalized = {}
  TRAITS.forEach(t => normalized[t] = traitCounts[t] ? Math.round((traitScores[t] / (traitCounts[t] * 4)) * 100) : 0)
  const avg = Object.values(normalized).reduce((a,b)=>a+b,0) / Object.values(normalized).length
  let archetype = 'Regal'
  if ((normalized.Curiosity + normalized.Confidence + normalized.Adaptability) / 3 > 65) archetype = 'Explorer'
  if ((normalized.Affection + normalized.Sociability) / 2 > 65) archetype = 'Shadow'
  if ((normalized.Dominance + normalized.Energy + normalized.Playfulness) / 3 > 65) archetype = 'Tiger'
  return { normalized, archetype, confidence: Math.round(avg) }
}

function ownerMatch(catProfile, ownerAnswers) {
  const vals = Object.values(ownerAnswers).map(v => Number(v) + 1)
  const ownerEnergy = vals.length ? vals.reduce((a,b)=>a+b,0) / (vals.length * 4) * 100 : 50
  const catEnergy = (catProfile.normalized.Energy + catProfile.normalized.Playfulness + catProfile.normalized.Affection) / 3
  const delta = Math.abs(ownerEnergy - catEnergy)
  const match = Math.max(0, Math.round(100 - delta))
  return match
}

function catCompatibility(a, b) {
  const pa = calculateCatProfile(a).normalized
  const pb = calculateCatProfile(b).normalized
  const diff = TRAITS.reduce((sum, t) => sum + Math.abs((pa[t]||0) - (pb[t]||0)), 0) / TRAITS.length
  return Math.max(0, Math.round(100 - diff))
}

function Header({ screen, setScreen, currentUser, logout }) {
  return <header className="topbar">
    <button className="brand" onClick={() => setScreen('home')}>
      <span className="brand-mark"><PawPrint size={22}/></span>
      <span><b>PETSONALITY</b><small>Four Paws. One Personality.</small></span>
    </button>
    <nav>
      <button onClick={() => setScreen('pricing')}>Pricing</button>
      <button onClick={() => setScreen('breeders')}>Breeder Directory</button>
      {currentUser ? <button onClick={() => setScreen('dashboard')}>Dashboard</button> : <button onClick={() => setScreen('register')}>Register</button>}
      <button onClick={() => setScreen('admin-login')} className="quiet">Admin</button>
      {currentUser && <button onClick={logout} className="quiet">Logout</button>}
    </nav>
  </header>
}

function Home({ setScreen }) {
  return <main className="hero">
    <section className="hero-card">
      <div className="badge"><ShieldCheck size={16}/> Questions locked until payment</div>
      <h1>Discover the personality behind the paws.</h1>
      <p>Petsonality creates paid cat personality reports, owner-to-cat matches, and cat-to-cat compatibility insights using scenario answers and body-language observations.</p>
      <div className="actions">
        <button className="primary" onClick={() => setScreen('pricing')}>Start Paid Assessment</button>
        <button onClick={() => setScreen('breeders')}>View Breeder Directory</button>
      </div>
    </section>
    <section className="preview-card">
      <h3>Sample result preview</h3>
      <p className="muted">Full questions, scoring, and result templates unlock after payment.</p>
      <div className="locked"><Lock/> Assessment Questions Locked</div>
      <TraitBar label="Confidence" value={82}/><TraitBar label="Affection" value={71}/><TraitBar label="Adaptability" value={64}/>
    </section>
  </main>
}

function Pricing({ setScreen }) {
  return <main className="grid two">
    <section className="panel price">
      <h2>Cat Personality Assessment</h2>
      <div className="money">$9</div>
      <p>Unlock the full questionnaire and report.</p>
      <ul><li>Cat personality profile</li><li>Body-language expression mapping</li><li>Owner-to-cat compatibility</li><li>Cat-to-cat match tools</li></ul>
      <button className="primary" onClick={() => setScreen('checkout')}>Continue to Checkout</button>
    </section>
    <section className="panel price">
      <h2>Breeder Directory Listing</h2>
      <div className="money">$5 <small>/ year</small></div>
      <p>For registered TICA/CFA breeders only. No brokers, wholesalers, or marketing agents.</p>
      <button onClick={() => setScreen('breeder-register')}>Register Breeder Listing</button>
    </section>
  </main>
}

function Checkout({ setPaid, setScreen }) {
  return <main className="panel narrow">
    <CreditCard size={38}/><h2>Checkout</h2>
    <p>Connect this to Stripe when your Stripe Payment Link is ready. For testing, use “Mark Paid & Unlock.”</p>
    <a className="button" href={STRIPE_CAT_TEST_URL} target="_blank">Open Stripe Placeholder</a>
    <button className="primary" onClick={() => { setPaid(true); setScreen('assessment') }}>Mark Paid & Unlock Test</button>
  </main>
}

function Register({ setCurrentUser, setScreen }) {
  const [form, setForm] = useState({ name:'', email:'', role:'owner' })
  function submit(e){ e.preventDefault(); const user={...form, id:uid()}; setStore('petsonality_user', user); setCurrentUser(user); setScreen('dashboard') }
  return <main className="panel narrow">
    <h2>Create account</h2><p className="muted">Admin is not a public option.</p>
    <form onSubmit={submit} className="form">
      <input placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <div className="role-grid">{roles.map(r => <button type="button" className={form.role===r.id?'selected':''} onClick={()=>setForm({...form,role:r.id})} key={r.id}><r.icon size={18}/>{r.label}</button>)}</div>
      <button className="primary">Create account</button>
    </form>
  </main>
}

function Dashboard({ user, setScreen, paid }) {
  const roleLabel = roles.find(r=>r.id===user?.role)?.label || 'User'
  return <main className="panel">
    <h2>{roleLabel} Dashboard</h2><p>Welcome {user?.name || user?.email}. Choose what you want to work on.</p>
    <div className="tiles">
      <Tile icon={Cat} title="Cat Personality Test" text={paid?'Unlocked':'Locked until paid'} onClick={()=>setScreen(paid?'assessment':'pricing')}/>
      <Tile icon={Users} title="Owner Match" text="Compare owner style to cat personality" onClick={()=>setScreen(paid?'owner-match':'pricing')}/>
      <Tile icon={Cat} title="Cat-to-Cat Match" text="Compare two cat profiles" onClick={()=>setScreen(paid?'cat-match':'pricing')}/>
      <Tile icon={FileText} title="Documents" text="Registration papers, receipts, contracts" onClick={()=>setScreen('documents')}/>
      <Tile icon={Users} title="Breeder Directory" text="Create or update listing" onClick={()=>setScreen('breeder-register')}/>
      <Tile icon={Edit3} title="Social Planner" text="Captions, hashtags, post status" onClick={()=>setScreen('social')}/>
    </div>
  </main>
}
function Tile({icon:Icon,title,text,onClick}){return <button className="tile" onClick={onClick}><Icon/><b>{title}</b><span>{text}</span></button>}

function Assessment({ paid, setScreen, templates }) {
  const [cat, setCat] = useState(getStore('petsonality_cat',{ name:'', age:'', breed:'', photo:'' }))
  const [answers, setAnswers] = useState(getStore('petsonality_answers',{}))
  if(!paid) return <Locked setScreen={setScreen}/>
  const done = Object.keys(answers).length === CAT_QUESTIONS.length
  const profile = calculateCatProfile(answers)
  function saveAnswer(qid, i){ const next={...answers,[qid]:i}; setAnswers(next); setStore('petsonality_answers', next) }
  return <main className="panel assessment">
    <h2>Cat Personality Assessment</h2>
    <div className="cat-form">
      <input placeholder="Cat name" value={cat.name} onChange={e=>{const n={...cat,name:e.target.value}; setCat(n); setStore('petsonality_cat',n)}}/>
      <input placeholder="Age" value={cat.age} onChange={e=>{const n={...cat,age:e.target.value}; setCat(n); setStore('petsonality_cat',n)}}/>
      <input placeholder="Breed" value={cat.breed} onChange={e=>{const n={...cat,breed:e.target.value}; setCat(n); setStore('petsonality_cat',n)}}/>
    </div>
    {CAT_QUESTIONS.map(q => <Question key={q.id} q={q} selected={answers[q.id]} saveAnswer={saveAnswer}/>) }
    {done && <Results profile={profile} templates={templates} cat={cat}/>} 
  </main>
}

function Question({ q, selected, saveAnswer }) {
  return <section className="question"><h3>{q.text}</h3>{q.answers.map((a,i)=><button key={i} onClick={()=>saveAnswer(q.id,i)} className={selected===i?'answer selected':'answer'}><span>{a.text}</span><small>{a.expression}</small></button>)}</section>
}

function Results({ profile, templates, cat }) {
  const t = templates[profile.archetype] || DEFAULT_RESULT_TEMPLATES[profile.archetype]
  return <section className="results"><h2>{cat.name || 'Your Cat'} is {t.name}</h2><p>{t.description}</p>
    <div className="bars">{TRAITS.map(tr => <TraitBar key={tr} label={tr} value={profile.normalized[tr]||0}/>)}</div>
    <div className="result-grid"><div><h4>Strengths</h4><p>{t.strengths}</p></div><div><h4>Challenges</h4><p>{t.challenges}</p></div><div><h4>Recommendations</h4><p>{t.tips}</p></div></div>
  </section>
}
function TraitBar({label,value}){return <div className="trait"><span>{label}</span><b>{value}%</b><div><i style={{width:`${value}%`}}/></div></div>}
function Locked({setScreen}){return <main className="panel narrow"><Lock size={40}/><h2>Questions are locked</h2><p>Please purchase the assessment before viewing questions.</p><button className="primary" onClick={()=>setScreen('pricing')}>Go to Pricing</button></main>}

function OwnerMatch({ paid, setScreen }) {
  const [owner, setOwner] = useState(getStore('petsonality_owner_answers',{}))
  const catAnswers = getStore('petsonality_answers',{})
  if(!paid) return <Locked setScreen={setScreen}/>
  const catProfile = calculateCatProfile(catAnswers)
  const match = ownerMatch(catProfile, owner)
  return <main className="panel"><h2>Owner ↔ Cat Match</h2>{OWNER_QUESTIONS.map((q)=><section className="question" key={q.id}><h3>{q.text}</h3>{q.answers.map((a,i)=><button className={owner[q.id]===i?'answer selected':'answer'} onClick={()=>{const n={...owner,[q.id]:i}; setOwner(n); setStore('petsonality_owner_answers',n)}} key={a}>{a}</button>)}</section>)}<h2>Match: {match}%</h2><p>{match > 75 ? 'Strong lifestyle match.' : match > 50 ? 'Good match with some adjustments.' : 'This match may need more support and environmental planning.'}</p></main>
}

function CatMatch({ paid, setScreen }) {
  const [a,setA] = useState(getStore('petsonality_answers',{}))
  const [b,setB] = useState({})
  if(!paid) return <Locked setScreen={setScreen}/>
  const match = Object.keys(b).length ? catCompatibility(a,b) : null
  return <main className="panel"><h2>Cat ↔ Cat Compatibility</h2><p>Use Cat A from your saved assessment. Answer a quick profile for Cat B.</p>{CAT_QUESTIONS.slice(0,5).map(q=><section className="question" key={q.id}><h3>{q.text}</h3>{q.answers.map((ans,i)=><button className={b[q.id]===i?'answer selected':'answer'} onClick={()=>setB({...b,[q.id]:i})} key={ans.text}>{ans.text}<small>{ans.expression}</small></button>)}</section>)}{match!==null && <div className="results"><h2>Compatibility: {match}%</h2><p>{match>75?'Likely compatible with careful introductions.':match>50?'Possible match; watch energy, territory, and confidence differences.':'Use slow introductions, scent swapping, and separate resources.'}</p></div>}</main>
}

function BreederRegister() {
  const [form,setForm] = useState(getStore('petsonality_breeder', initialBreeder))
  const [saved,setSaved] = useState(false)
  function update(k,v){const n={...form,[k]:v}; setForm(n); setStore('petsonality_breeder',n)}
  return <main className="panel"><h2>Breeder Directory Registration</h2><p className="warning">TICA or CFA breeder registration required. No cat brokers, wholesalers, or marketing agents. Pet transport/shipping services must register separately.</p>
    <div className="form grid-form">
      {['cattery','contactName','email','phone','location','website','breeds','registrationNumber'].map(k=><input key={k} placeholder={k.replace(/([A-Z])/g,' $1')} value={form[k]} onChange={e=>update(k,e.target.value)}/>) }
      <Select label="What do you sell?" value={form.rights} onChange={v=>update('rights',v)} options={['Pet only','Breeder rights only','Show rights only','Pet and breeder rights','Pet and show rights','Breeder and show rights','All options']}/>
      <Select label="Registered cats/kittens?" value={form.registered} onChange={v=>update('registered',v)} options={['Yes','No','Some are registered']}/>
      <Select label="Registration organization" value={form.registry} onChange={v=>update('registry',v)} options={['TICA','CFA','TICA and CFA','Other']}/>
      <Select label="Delivery options" value={form.delivery} onChange={v=>update('delivery',v)} options={['Pickup only','Local delivery available','Flight nanny available','Depends on location']}/>
      <Select label="Deposit required?" value={form.depositRequired} onChange={v=>update('depositRequired',v)} options={['Yes','No']}/>
      <input placeholder="Deposit amount" value={form.depositAmount} onChange={e=>update('depositAmount',e.target.value)}/>
      <Select label="Kitten availability" value={form.availability} onChange={v=>update('availability',v)} options={['Available now','Upcoming litter','Waitlist only','Seasonal','Contact breeder for availability']}/>
    </div>
    <label className="check"><input type="checkbox" checked={form.certification} onChange={e=>update('certification',e.target.checked)}/> I certify I have breeder registration with TICA and/or CFA.</label>
    <label className="check"><input type="checkbox" checked={form.noBroker} onChange={e=>update('noBroker',e.target.checked)}/> I am not a cat broker, wholesaler, or marketing agent.</label>
    <a className="button" href={STRIPE_BREEDER_LISTING_URL} target="_blank">Pay $5 Annual Listing Placeholder</a>
    <button className="primary" onClick={()=>{update('paid',true); setSaved(true)}}>Save Listing</button>{saved&&<p className="success">Saved. Please update your breeder registry whenever kitten availability, pricing, registration status, or delivery options change.</p>}
  </main>
}
function Select({label,value,onChange,options}){return <label>{label}<select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></label>}

function Breeders() {
  const breeder = getStore('petsonality_breeder', null)
  return <main className="panel"><h2>Breeder Directory</h2><p>Approved TICA/CFA breeders only. No brokers or wholesalers.</p>{breeder ? <div className="directory-card"><h3>{breeder.cattery || 'Breeder Listing'}</h3><p>{breeder.breeds}</p><p>{breeder.location} • {breeder.registry} • {breeder.availability}</p><small>Status: {breeder.status} • Paid: {breeder.paid?'Yes':'No'}</small></div> : <p className="muted">No breeder listings saved yet.</p>}</main>
}

function AdminLogin({ setAdmin, setScreen }) {
  const [email,setEmail]=useState(''), [pass,setPass]=useState(''), [err,setErr]=useState('')
  function submit(e){e.preventDefault(); if(email===ADMIN_EMAIL && pass===ADMIN_PASSCODE){setAdmin(true); setScreen('admin')} else setErr('Invalid admin login')}
  return <main className="panel narrow"><h2>Admin Login</h2><form className="form" onSubmit={submit}><input placeholder="Admin email" value={email} onChange={e=>setEmail(e.target.value)}/><input placeholder="Admin passcode" type="password" value={pass} onChange={e=>setPass(e.target.value)}/><button className="primary">Login</button>{err&&<p className="error">{err}</p>}</form></main>
}

function Admin({ admin, templates, setTemplates }) {
  const [active,setActive]=useState('Explorer')
  const [expression,setExpression]=useState('')
  if(!admin) return <main className="panel narrow"><Lock/><h2>Admin only</h2></main>
  const t=templates[active]
  function update(k,v){const n={...templates,[active]:{...t,[k]:v}}; setTemplates(n); setStore('petsonality_templates',n)}
  return <main className="panel"><h2>Admin Dashboard</h2><p>Edit result behavior text as you learn from your own cats.</p><div className="tabs">{Object.keys(templates).map(k=><button className={active===k?'selected':''} onClick={()=>setActive(k)} key={k}>{templates[k].name}</button>)}</div><div className="form"><input value={t.name} onChange={e=>update('name',e.target.value)}/><textarea value={t.description} onChange={e=>update('description',e.target.value)}/><textarea value={t.strengths} onChange={e=>update('strengths',e.target.value)}/><textarea value={t.challenges} onChange={e=>update('challenges',e.target.value)}/><textarea value={t.tips} onChange={e=>update('tips',e.target.value)}/></div><h3>Cat Expression Library</h3><div className="chips">{CAT_EXPRESSIONS.map(x=><span key={x}>{x}</span>)}</div><div className="form inline"><input placeholder="Add expression" value={expression} onChange={e=>setExpression(e.target.value)}/><button onClick={()=>setExpression('')}>Add placeholder</button></div><p className="muted">Full database-backed editing should be added with Supabase/Firebase before launch.</p></main>
}

function Documents(){return <main className="panel"><h2>Documents</h2><p>Framework for registrations, pedigrees, contracts, sales, and expense receipts. For production, connect file uploads to Supabase Storage, Firebase Storage, or S3.</p><div className="tiles"><Tile icon={FileText} title="Registration" text="TICA/CFA papers"/><Tile icon={FileText} title="Sales Contracts" text="Buyer agreements"/><Tile icon={FileText} title="Expense Receipts" text="Vet, food, shows, supplies"/></div></main>}
function Social(){return <main className="panel"><h2>Social Media Planner</h2><p>Create captions and mark posts as posted. Automatic posting requires separate API permissions for each platform.</p><textarea placeholder="Caption"></textarea><input placeholder="#hashtags"/><button className="primary">Save Draft</button></main>}

function App(){
  const [screen,setScreen]=useState(location.hash?.replace('#','') || 'home')
  const [currentUser,setCurrentUser]=useState(getStore('petsonality_user',null))
  const [paid,setPaid]=useState(getStore('petsonality_paid',false))
  const [admin,setAdmin]=useState(false)
  const [templates,setTemplates]=useState(getStore('petsonality_templates',DEFAULT_RESULT_TEMPLATES))
  function go(s){setScreen(s); history.replaceState(null,'',`#${s}`)}
  function setPaidPersist(v){setPaid(v); setStore('petsonality_paid',v)}
  function logout(){setCurrentUser(null); localStorage.removeItem('petsonality_user'); go('home')}
  const pages = {
    home:<Home setScreen={go}/>, pricing:<Pricing setScreen={go}/>, checkout:<Checkout setPaid={setPaidPersist} setScreen={go}/>, register:<Register setCurrentUser={setCurrentUser} setScreen={go}/>, dashboard:<Dashboard user={currentUser} setScreen={go} paid={paid}/>, assessment:<Assessment paid={paid} setScreen={go} templates={templates}/>, 'owner-match':<OwnerMatch paid={paid} setScreen={go}/>, 'cat-match':<CatMatch paid={paid} setScreen={go}/>, 'breeder-register':<BreederRegister/>, breeders:<Breeders/>, 'admin-login':<AdminLogin setAdmin={setAdmin} setScreen={go}/>, admin:<Admin admin={admin} templates={templates} setTemplates={setTemplates}/>, documents:<Documents/>, social:<Social/>
  }
  return <><Header screen={screen} setScreen={go} currentUser={currentUser} logout={logout}/>{pages[screen] || pages.home}<footer>© Cats & Kittens Organization • Petsonality</footer></>
}

createRoot(document.getElementById('root')).render(<App />)
