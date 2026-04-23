import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FinalCTA = () => {
  return (
    <section className="bg-[#0A0A0A] py-24 md:py-[120px]">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-4xl md:text-[52px] font-black text-white leading-tight"
        >
          Stop filing manually.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-5 text-[18px] text-[#999] max-w-xl mx-auto"
        >
          One CBN sanction starts at ₦2,000,000. RegCo costs a fraction of that.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to="/book-demo" className="btn-brand">
            Get Started
          </Link>
          <Link
            to="/book-demo"
            className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold text-white bg-transparent border-[1.5px] border-white/80 transition-all duration-300 hover:bg-white hover:text-foreground"
          >
            See a Demo
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
