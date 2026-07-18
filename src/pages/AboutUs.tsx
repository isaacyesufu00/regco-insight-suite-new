import FoundingLetter from "@/components/FoundingLetter";
import { Nav, EditorialFooter, C, HELV, Col } from "@/components/editorial/EditorialTheme";

export default function AboutUs() {
  return (
    <div className="regco-page" style={{ background: C.page, color: C.ink, minHeight: "100vh", fontFamily: HELV }}>
      <Nav />
      <section style={{ paddingTop: 200, paddingBottom: 128 }}>
        <div style={Col}>
          <FoundingLetter />
        </div>
      </section>
      <EditorialFooter />
    </div>
  );
}
