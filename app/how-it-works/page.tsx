export default function HowItWorksPage() {
  return (
    <main>
      <section className="process">
        <div className="container">
          <p className="kicker">FROM PHOTO TO CHARACTER</p>
          <h2>One photograph.<span>One physical identity.</span></h2>
          <div className="steps">
            {[
              ["01","Upload","Send us one normal photograph."],
              ["02","Create","Our workflow turns it into a 3D character."],
              ["03","Personalize","Choose the form that fits you."],
              ["04","Make","Your character becomes physical."]
            ].map(([n,t,d])=>(
              <div key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="statement">
        <div className="container statement-grid">
          <p className="kicker">STARTING POINT</p>
          <div><h2>Personalization begins with one photograph.</h2></div>
        </div>
      </section>
    </main>
  );
}
