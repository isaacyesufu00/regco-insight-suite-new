import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import EditorialNavbar from "@/components/editorial/EditorialNavbar";
import EditorialFooter from "@/components/editorial/EditorialFooter";

const AboutPage = () => (
  <div className="min-h-screen bg-[var(--paper)] text-ink">
    <EditorialNavbar />

    <section className="pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="container-narrow">
        <p className="tag mb-8">About RegCo</p>
        <h1 className="font-serif text-[44px] md:text-[64px] leading-[1.04] text-ink">
          We are building the regulatory infrastructure Nigerian finance has been waiting for.
        </h1>
      </div>
    </section>

    <article className="container-narrow pb-24 md:pb-32 space-y-8 text-[17px] leading-[1.7] text-ink">
      <p className="first-letter:font-serif first-letter:text-[64px] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.9]">
        Every quarter, compliance officers at hundreds of Nigerian banks and microfinance institutions spend days — sometimes weeks — manually compiling regulatory returns. They pull data from core banking systems, reformat it into templates the CBN, NDIC, NFIU, SCUML and FIRS each require, cross-check arithmetic by hand, and pray nothing was missed before the deadline.
      </p>
      <p>
        When something does go wrong — a missed deadline, a formatting error, a single transposed figure — the consequences are severe. Penalties start at ₦2,000,000 and escalate quickly. For a unit microfinance bank, one sanction can erase a quarter of operating revenue.
      </p>
      <p className="font-serif italic text-[22px] text-ink-muted border-l-2 border-rust pl-6 my-12">
        We built RegCo because this problem is entirely solvable with technology. The data already exists. The return formats are well-defined. What was missing was infrastructure to connect the two — automatically, accurately, on time, every cycle.
      </p>
      <h2 className="font-serif text-[34px] mt-16 text-ink">A note on independence.</h2>
      <p>
        RegCo is an independent technology company. We are not affiliated with the Central Bank of Nigeria, the NDIC, the NFIU, SCUML, or FIRS. We do not represent any regulator. We build the tools institutions use to comply with them.
      </p>
      <h2 className="font-serif text-[34px] mt-16 text-ink">What we believe.</h2>
      <p>
        Regulatory reporting should never be the reason a bank faces sanctions. It should be a quiet, predictable function — like reconciliation, or payroll. Software that does it well is not a luxury for the largest institutions; it is the floor.
      </p>
      <p>
        We are headquartered in Abuja and serve financial institutions nationwide.
      </p>
    </article>

    <section className="bg-ink text-[var(--paper)]">
      <div className="container-editorial py-24 md:py-32 grid md:grid-cols-12 gap-12 items-center">
        <h2 className="md:col-span-7 font-serif text-4xl md:text-6xl leading-[1.05] text-[var(--paper)]">
          Talk to the team that built it.
        </h2>
        <div className="md:col-span-5 md:pl-12">
          <p className="text-[15.5px] text-[var(--paper)]/70 leading-relaxed">
            We answer every demo request personally, usually within twenty-four hours.
          </p>
          <Link to="/book-demo" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--rust)] text-white text-[14.5px] font-medium hover:bg-[var(--rust-dark)] transition-colors">
            Book a demo <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>

    <EditorialFooter />
  </div>
);

export default AboutPage;
