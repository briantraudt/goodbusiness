"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const hdr = document.querySelector("header.site");
    const onScroll = () => hdr?.classList.toggle("scrolled", window.scrollY > 8);
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      document.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const year = new Date().getFullYear();

  const mailtoTrial =
    "mailto:hello@goodbusinesshq.com?subject=Trial%20enquiry%20%E2%80%94%20Good%20Business&body=Hi%20%E2%80%94%20here%27s%20what%20we%27re%20trying%20to%20fix%3A%0A%0A";

  return (
    <>
      <header className="site">
        <div className="wrap nav">
          <a className="brand" href="#top" aria-label="Good Business home">
            <span className="dot" aria-hidden="true"></span>
            <span>Good Business</span>
          </a>
          <nav className="navlinks" aria-label="Primary">
            <a href="#what">What we do</a>
            <a href="#trial">The trial</a>
            <a href="#why">Why us</a>
            <a className="cta-mini" href="#contact">
              Start a trial <span className="arrow">→</span>
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <div className="eyebrow mono">
              <span className="pip" aria-hidden="true"></span>AI software consultancy · for SMB owners
            </div>
            <h1 className="hero-h reveal">
              Your business,
              <br />
              <span className="serif">ready for</span>{" "}
              <span className="accent">what&apos;s next.</span>
            </h1>
            <p className="lede reveal">
              We&apos;re a small software studio that helps SMB owners use AI where it actually pays — streamlining the slow parts, automating the busywork, and shipping the systems that move the number.{" "}
              <span className="serif">No decks.</span> Working software, fast.
            </p>
            <div className="ctas reveal">
              <a className="btn btn-primary" href="#contact">
                Start a no‑risk trial <span className="arrow">→</span>
              </a>
              <a className="btn btn-ghost" href="#trial">
                See how it works
              </a>
              <span className="trial-tag">
                <span className="ok" aria-hidden="true"></span>
                Two weeks. No invoice unless you keep it.
              </span>
            </div>
          </div>

          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              <span>Workflow audit</span>
              <span>Custom AI tools</span>
              <span>Automation that sticks</span>
              <span>Operator‑grade software</span>
              <span>Two‑week trials</span>
              <span>Built and handed back</span>
              <span>No retainers</span>
              <span>Workflow audit</span>
              <span>Custom AI tools</span>
              <span>Automation that sticks</span>
              <span>Operator‑grade software</span>
              <span>Two‑week trials</span>
              <span>Built and handed back</span>
              <span>No retainers</span>
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section id="what" className="gb">
          <div className="wrap">
            <div className="section-head">
              <div className="mono">01 — What we do</div>
              <h2 className="reveal">
                We find the drag in your business. Then we build software that ends it.
              </h2>
              <p className="kicker reveal">
                Most consultants leave you a slide deck. We leave you a tool your team uses on Monday morning.
              </p>
            </div>

            <div className="pillars">
              <div className="pillar reveal">
                <span className="num">P / 01</span>
                <span className="arrow-dot" aria-hidden="true"></span>
                <h3>Spot the leak</h3>
                <p>
                  We map where your business is actually losing time — handoffs, manual reports, lost leads, the stuff people work around without telling you.
                </p>
              </div>
              <div className="pillar reveal">
                <span className="num">P / 02</span>
                <span className="arrow-dot" aria-hidden="true"></span>
                <h3>Build it with AI</h3>
                <p>
                  We design and ship the workflow, automation, or AI tool that fixes it. Real working software, built by senior engineers — not a Zapier flowchart.
                </p>
              </div>
              <div className="pillar reveal">
                <span className="num">P / 03</span>
                <span className="arrow-dot" aria-hidden="true"></span>
                <h3>Hand it back better</h3>
                <p>
                  Your team uses what we build on day one. You own the code, the docs, and the playbook. We stay only as long as you want us to.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE TRIAL */}
        <section id="trial" className="gb tinted">
          <div className="wrap">
            <div className="section-head">
              <div className="mono">02 — How the trial works</div>
              <h2 className="reveal">
                Two weeks. <span className="serif">One real thing.</span> Zero risk.
              </h2>
              <p className="kicker reveal">
                We don&apos;t pitch you. We build something useful and let it argue for itself.
              </p>
            </div>

            <div className="steps">
              <div className="step reveal">
                <div className="label">
                  <span className="step-num">STEP 01</span>
                  <span className="time">30 min</span>
                </div>
                <h4>Pick the leak</h4>
                <p>
                  A 30‑minute call. You talk, we listen. By the end we agree on the one thing worth fixing first — the bottleneck that frees the most time or revenue.
                </p>
              </div>
              <div className="step reveal">
                <div className="label">
                  <span className="step-num">STEP 02</span>
                  <span className="time">2 weeks</span>
                </div>
                <h4>We build it</h4>
                <p>
                  We ship a working version of the fix in two weeks. Real software, in your hands, doing real work. No invoice goes out until you see it run.
                </p>
              </div>
              <div className="step reveal">
                <div className="label">
                  <span className="step-num">STEP 03</span>
                  <span className="time">Your call</span>
                </div>
                <h4>You decide</h4>
                <p>
                  Keep it and pay a fair flat fee. Walk away free if it isn&apos;t a clear win. Either way, the documentation is yours — including how we&apos;d build the next one.
                </p>
              </div>
            </div>

            <div className="promise reveal">
              <div>
                <h3>
                  If it doesn&apos;t earn its keep, <span className="accent">you don&apos;t pay.</span>
                </h3>
                <p>
                  Most engagements pay back inside the first quarter. The trial exists because we believe SMB owners shouldn&apos;t have to gamble on AI to find out if it works.
                </p>
              </div>
              <div className="cta-col">
                <a className="btn btn-accent" href="#contact">
                  Start a trial <span className="arrow">→</span>
                </a>
                <span className="meta">No retainer · No long contract · Code is yours</span>
              </div>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section id="why" className="gb">
          <div className="wrap">
            <div className="why-grid">
              <div className="copy reveal">
                <div className="mono" style={{ marginBottom: 18 }}>03 — Why us</div>
                <h2>
                  Built for the kind of owner who&apos;d rather see the thing working{" "}
                  <span className="serif">than hear about it.</span>
                </h2>
                <p>
                  AI is the biggest operating leverage SMBs have had in a decade — and the easiest one to fumble. The trap is buying tools that don&apos;t fit your business, hiring consultants who don&apos;t ship, or waiting until your competitor moves first.
                </p>
                <p>
                  Good Business is a small studio of senior operators, engineers, and designers. We&apos;ve built and run software inside the kinds of businesses we now help: 20–500 person companies where one good system pays for itself in months, and one bad one costs you a year.
                </p>
              </div>
              <div className="reveal">
                <div className="facts">
                  <div className="fact">
                    <span className="k">Team</span>
                    <span className="v">
                      Senior engineers + operators. <span className="serif">No juniors learning on your dime.</span>
                    </span>
                  </div>
                  <div className="fact">
                    <span className="k">Speed</span>
                    <span className="v">
                      Trial ships in <span className="serif">two weeks.</span> First engagement, start to value, inside a quarter.
                    </span>
                  </div>
                  <div className="fact">
                    <span className="k">Stack</span>
                    <span className="v">Modern AI + the boring software that actually keeps your business running.</span>
                  </div>
                  <div className="fact">
                    <span className="k">Ownership</span>
                    <span className="v">You keep the code, docs, and accounts. We don&apos;t lock you in.</span>
                  </div>
                  <div className="fact">
                    <span className="k">Pricing</span>
                    <span className="v">
                      Flat fees. No retainers. <span className="serif">No surprises.</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="gb tinted">
          <div className="wrap">
            <div className="section-head">
              <div className="mono">04 — Questions owners ask</div>
              <h2 className="reveal">The honest answers.</h2>
            </div>

            <div className="faq">
              <details className="q">
                <summary>
                  What does &quot;no risk&quot; actually mean? <span className="sign" aria-hidden="true">+</span>
                </summary>
                <div className="a">
                  We agree on a single problem to solve and a flat fee. We build it. If you don&apos;t think it earned its keep when you see it running, you owe nothing. The working code and documentation are still yours.
                </div>
              </details>
              <details className="q">
                <summary>
                  Are you a consultancy or a software shop? <span className="sign" aria-hidden="true">+</span>
                </summary>
                <div className="a">
                  Both, on purpose. Most &quot;AI consultants&quot; can&apos;t ship software, and most software shops won&apos;t take the time to understand your operations. We do both because the only thing that creates lasting value is software your team actually uses.
                </div>
              </details>
              <details className="q">
                <summary>
                  What size of company is this for? <span className="sign" aria-hidden="true">+</span>
                </summary>
                <div className="a">
                  SMB owners — roughly 20 to 500 people. Big enough that workflow friction is a real cost; small enough that one good tool changes the operating math.
                </div>
              </details>
              <details className="q">
                <summary>
                  What kinds of problems do you actually solve? <span className="sign" aria-hidden="true">+</span>
                </summary>
                <div className="a">
                  Quote turnaround time, lead follow‑up that falls through the cracks, manual reporting that eats a person every Monday, intake forms that take three days to route, knowledge that lives in one person&apos;s head. AI fits a lot of these now — but only if the rest of the workflow is built right.
                </div>
              </details>
              <details className="q">
                <summary>
                  Will my team have to use a bunch of new tools? <span className="sign" aria-hidden="true">+</span>
                </summary>
                <div className="a">
                  We try to subtract before we add. If your team already uses something, we build into it. The goal is that the new thing feels obvious — not heroic.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final" id="contact">
          <div className="wrap">
            <div className="mono" style={{ marginBottom: 18 }}>05 — Let&apos;s start</div>
            <h2 className="reveal">
              Got <span className="serif">thirty minutes?</span>
              <br />
              Let&apos;s find the first thing worth fixing.
            </h2>
            <p className="reveal">
              Tell us what&apos;s slow, what&apos;s broken, or what you wish existed. We&apos;ll come back with a one‑page plan for a two‑week trial — or tell you straight if we&apos;re not the right team for it.
            </p>
            <div className="ctas reveal">
              <a className="btn btn-primary" href={mailtoTrial}>
                Start a no‑risk trial <span className="arrow">→</span>
              </a>
              <a className="btn btn-ghost" href="mailto:hello@goodbusinesshq.com">
                hello@goodbusinesshq.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site">
        <div className="wrap foot">
          <a className="brand" href="#top">
            <span className="dot" aria-hidden="true"></span>Good Business
          </a>
          <div className="foot-small">
            © {year} · Built for SMB owners ·{" "}
            <a href="mailto:hello@goodbusinesshq.com">hello@goodbusinesshq.com</a>
          </div>
        </div>
      </footer>
    </>
  );
}
