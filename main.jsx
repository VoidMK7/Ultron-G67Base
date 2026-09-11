import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Sparkles, Video, Image as ImageIcon, Library, Users, Shield,
  Settings, Plus, Heart, MessageCircle, Share2, Download, Wand2,
  ChevronDown, Menu, X, Play, Clock3, Search, Upload, Mic2
} from "lucide-react";
import "./styles.css";

const demoCreations = [
  { id: 1, type: "video", title: "Neon Lagos", meta: "Cinematic • 16:9", likes: 128 },
  { id: 2, type: "image", title: "Future City", meta: "Photorealistic", likes: 94 },
  { id: 3, type: "video", title: "Little Dragon", meta: "3D Cartoon • 9:16", likes: 217 },
  { id: 4, type: "image", title: "African Space Pilot", meta: "Concept Art", likes: 76 }
];

function App() {
  const [page, setPage] = useState("create");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState("video");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [ratio, setRatio] = useState("16:9");
  const [duration, setDuration] = useState("30 sec");
  const [audio, setAudio] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const nav = [
    ["create", "Create", Sparkles],
    ["library", "Library", Library],
    ["community", "Community", Users],
    ["admin", "Admin", Shield]
  ];

  async function generate() {
    if (!prompt.trim()) {
      setToast("Describe what you want to create first.");
      return;
    }
    setBusy(true);
    setToast("Generation job queued...");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ mode, prompt, style, ratio, duration, audio })
      });
      const data = await res.json();
      setToast(data.message || "Job queued.");
    } catch {
      setToast("Demo mode: backend is not connected yet.");
    } finally {
      setTimeout(() => setBusy(false), 1200);
    }
  }

  return (
    <div className="app-shell">
      <aside className={mobileOpen ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={19}/></div>
          <div><b>AI Studio</b><span>CREATE WITHOUT LIMITS</span></div>
        </div>

        <div className="nav-label">WORKSPACE</div>
        {nav.map(([id,label,Icon]) => (
          <button key={id} className={page===id ? "nav-item active" : "nav-item"}
            onClick={() => {setPage(id); setMobileOpen(false);}}>
            <Icon size={18}/><span>{label}</span>
          </button>
        ))}

        <div className="sidebar-bottom">
          <button className="nav-item"><Settings size={18}/><span>Settings</span></button>
          <div className="profile-card">
            <div className="avatar">A</div>
            <div><b>Creator</b><span>Free workspace</span></div>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="backdrop" onClick={()=>setMobileOpen(false)} />}

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X/> : <Menu/>}
          </button>
          <div className="crumb"><span>AI Studio</span><b>/</b><strong>{page[0].toUpperCase()+page.slice(1)}</strong></div>
          <div className="top-actions">
            <button className="icon-btn"><Search size={18}/></button>
            <button className="credits">⚡ 0 credits</button>
          </div>
        </header>

        {page === "create" && (
          <section className="content">
            <div className="hero">
              <div>
                <div className="eyebrow"><Sparkles size={14}/> CREATIVE ENGINE</div>
                <h1>Turn your ideas into <em>reality.</em></h1>
                <p>Generate cinematic videos, photorealistic images and animated worlds from simple prompts.</p>
              </div>
            </div>

            <div className="studio-grid">
              <div className="composer card">
                <div className="mode-tabs">
                  <button className={mode==="video"?"selected":""} onClick={()=>setMode("video")}><Video size={17}/> Video</button>
                  <button className={mode==="image"?"selected":""} onClick={()=>setMode("image")}><ImageIcon size={17}/> Image</button>
                </div>

                <label className="field-label">PROMPT</label>
                <textarea value={prompt} onChange={e=>setPrompt(e.target.value)}
                  placeholder={mode==="video"
                    ? "Describe your video... e.g. A cinematic drone shot flying over Lagos at night after rainfall, realistic reflections, moving traffic, atmospheric lighting..."
                    : "Describe your image... e.g. A photorealistic portrait of a futuristic African astronaut..."}/>

                <div className="quick-row">
                  <button onClick={()=>setPrompt("A cinematic 3D cartoon adventure with expressive characters, dramatic camera movement and rich environmental detail.")}>Try cartoon</button>
                  <button onClick={()=>setPrompt("A photorealistic cinematic scene with natural skin texture, realistic lighting and shallow depth of field.")}>Try realistic</button>
                </div>

                <div className="control-grid">
                  <Select label="STYLE" value={style} setValue={setStyle}
                    options={["Cinematic","Photorealistic","3D Cartoon","Anime","Fantasy","Documentary","Comic"]}/>
                  <Select label="ASPECT" value={ratio} setValue={setRatio}
                    options={["16:9","9:16","1:1","4:3"]}/>
                  {mode==="video" && <Select label="DURATION" value={duration} setValue={setDuration}
                    options={["8 sec","15 sec","30 sec","60 sec","90 sec","2 min"]}/>}
                </div>

                {mode==="video" && (
                  <div className="audio-toggle">
                    <div className="audio-icon"><Mic2 size={17}/></div>
                    <div><b>Native audio</b><span>Dialogue, ambience & sound effects</span></div>
                    <button className={audio?"toggle on":"toggle"} onClick={()=>setAudio(!audio)}><span/></button>
                  </div>
                )}

                <div className="generate-row">
                  <label htmlFor="reference-upload" className="secondary-btn">
  <Upload size={17}/> Reference
</label>
<input
  id="reference-upload"
  type="file"
  accept="image/*"
  onChange={e => setReference(e.target.files[0])}
  style={{display:"none"}}
/>
                  <button className="generate-btn" onClick={generate} disabled={busy}>
                    {busy ? <><Clock3 size={18}/> Queueing...</> : <><Wand2 size={18}/> Generate {mode}</>}
                  </button>
                </div>
                {toast && <div className="toast">{toast}</div>}
              </div>

              <div className="preview card">
                <div className="preview-head"><span>PREVIEW</span><span className="status-dot">● Ready</span></div>
                <div className="empty-preview">
                  <div className="empty-icon">{mode==="video"?<Video size={28}/>:<ImageIcon size={28}/>}</div>
                  <h3>Your creation will appear here</h3>
                  <p>Generation happens in the background. You can continue browsing while it renders.</p>
                </div>
              </div>
            </div>

            <section className="recent">
              <div className="section-head"><div><h2>Recent creations</h2><p>Your latest AI generations</p></div><button onClick={()=>setPage("library")}>View library <ChevronDown size={16}/></button></div>
              <div className="creation-grid">{demoCreations.map(c=><CreationCard key={c.id} item={c}/>)}</div>
            </section>
          </section>
        )}

        {page === "library" && <LibraryPage />}
        {page === "community" && <CommunityPage />}
        {page === "admin" && <AdminPage />}
      </main>
    </div>
  );
}

function Select({label,value,setValue,options}) {
  return <div><label className="field-label">{label}</label><div className="select-wrap">
    <select value={value} onChange={e=>setValue(e.target.value)}>{options.map(x=><option key={x}>{x}</option>)}</select>
    <ChevronDown size={16}/>
  </div></div>
}

function CreationCard({item}) {
  return <article className="creation-card">
    <div className={"thumb "+item.type}><div className="thumb-symbol">{item.type==="video"?<Play fill="currentColor"/>:<ImageIcon/>}</div></div>
    <div className="creation-info"><b>{item.title}</b><span>{item.meta}</span><div className="mini-actions"><span>♥ {item.likes}</span><button><Download size={14}/></button><button><Share2 size={14}/></button></div></div>
  </article>
}

function LibraryPage() {
  return <section className="content"><PageTitle title="My Library" sub="Everything you create, organized in one place."/>
    <div className="library-tabs"><button className="active">All</button><button>Videos</button><button>Images</button><button>Projects</button><button>Favorites</button></div>
    <div className="creation-grid library-grid">{[...demoCreations,...demoCreations].map((x,i)=><CreationCard key={i} item={{...x,id:i}}/>)}</div>
  </section>
}

function CommunityPage() {
  return <section className="content"><PageTitle title="Community" sub="Discover what other creators are building."/>
    <div className="community-actions"><button className="pill active">Trending</button><button className="pill">New</button><button className="pill">Following</button><button className="post-btn"><Plus size={17}/> Post a creation</button></div>
    <div className="community-grid">{demoCreations.map((x,i)=><div className="community-card" key={i}>
      <div className={"community-media "+x.type}><div className="community-play">{x.type==="video"?<Play fill="currentColor"/>:<ImageIcon/>}</div></div>
      <div className="community-body"><div className="creator"><div className="avatar small">{String.fromCharCode(65+i)}</div><div><b>@creator_{i+1}</b><span>2h ago</span></div></div><h3>{x.title}</h3><div className="engage"><span><Heart size={16}/> {x.likes}</span><span><MessageCircle size={16}/> {12+i}</span><span><Share2 size={16}/></span></div></div>
    </div>)}</div>
  </section>
}

function AdminPage() {
  const stats = [["Users","0","Registered creators"],["Generations","0","All-time jobs"],["Community posts","0","Published creations"],["Failed jobs","0","Needs attention"]];
  return <section className="content"><PageTitle title="Admin Control Center" sub="Moderate creators, generations and community activity."/>
    <div className="stats-grid">{stats.map(s=><div className="stat card" key={s[0]}><span>{s[0]}</span><strong>{s[1]}</strong><small>{s[2]}</small></div>)}</div>
    <div className="admin-layout"><div className="card admin-panel"><h3>Generation queue</h3><div className="empty-admin"><Clock3 size={24}/><p>No jobs waiting.</p></div></div><div className="card admin-panel"><h3>Moderation</h3><div className="empty-admin"><Shield size={24}/><p>No reports.</p></div></div></div>
  </section>
}

function PageTitle({title,sub}) {
  return <div className="page-title"><div><div className="eyebrow">WORKSPACE</div><h1>{title}</h1><p>{sub}</p></div></div>
}

createRoot(document.getElementById("root")).render(<App />);
