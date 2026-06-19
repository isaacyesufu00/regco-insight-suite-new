import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SiteNavbar from "@/components/site/SiteNavbar";
import SiteFooter from "@/components/site/SiteFooter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <SiteNavbar />

      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-narrow">
          <p className="tag mb-4">About RegCo</p>
          <h1 className="text-display">
            We are building the regulatory infrastructure Nigerian finance has been waiting for.
          </h1>
        </div>
      </section>

      <article className="container-narrow pb-20 md:pb-28 space-y-7 text-[16.5px] leading-[1.7] text-ink">
        <p>
          Every quarter, compliance officers at hundreds of Nigerian banks and microfinance institutions spend days — sometimes weeks — manually compiling regulatory returns, screening new customers against five sanctions lists, and re-reading the same CBN circulars to make sure nothing changed since the last cycle. They pull data from core banking systems, reformat it into templates the CBN, NDIC, NFIU, SCUML and FIRS each require, cross-check arithmetic by hand, and pray nothing was missed before the deadline.
        </p>
        <p>
          When something does go wrong — a missed deadline, a missed sanctions hit, a single transposed figure — the consequences are severe. Penalties start at ₦2,000,000 and escalate quickly. For a unit microfinance bank, one sanction can erase a quarter of operating revenue.
        </p>
        <p className="text-[18px] leading-[1.55] text-ink-2 border-l-2 border-ink pl-6 my-10 font-medium">
          We built RegCo because this problem is entirely solvable with technology. The data already exists. The return formats are well-defined. The watchlists are public. What was missing was infrastructure to connect them all — automatically, accurately, on time, every cycle.
        </p>

        <h2 className="text-h2 mt-12 text-ink">A note on independence.</h2>
        <p>
          RegCo is an independent technology company. We are not affiliated with the Central Bank of Nigeria, the NDIC, the NFIU, SCUML, or FIRS. We do not represent any regulator. We build the tools institutions use to comply with them.
        </p>

        <h2 className="text-h2 mt-12 text-ink">What we believe.</h2>
        <p>
          Compliance should never be the reason a bank faces sanctions. It should be a quiet, predictable function — like reconciliation, or payroll. Software that does it well is not a luxury for the largest institutions; it is the floor.
        </p>
        <p>We are headquartered in Abuja and serve financial institutions nationwide.</p>
      </article>

      <section className="bg-ink text-white">
        <div className="container-site py-20 md:py-28 grid md:grid-cols-12 gap-10 items-end">
          <h2 className="md:col-span-7 text-h2 text-white max-w-[18ch]">
            Talk to the team that built it.
          </h2>
          <div className="md:col-span-5">
            <p className="text-[14.5px] leading-[1.6] text-white/70">
              We answer every demo request personally, usually within twenty-four hours.
            </p>
            <Link to="/book-demo" className="mt-6 h-10 px-5 inline-flex items-center gap-2 rounded-full bg-white text-ink text-[14px] font-medium hover:bg-white/90 transition-colors">
              Book a demo <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
