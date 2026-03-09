import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "regco_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = sessionStorage.getItem(COOKIE_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    sessionStorage.setItem(COOKIE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] bg-foreground p-4 md:p-5">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-background text-center sm:text-left leading-relaxed">
          We use cookies to improve your experience. By continuing to use this site you accept our cookie policy.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            size="sm"
            asChild
            className="rounded-full bg-background text-foreground hover:bg-background/90"
          >
            <Link to="/privacy-policy">Learn More</Link>
          </Button>
          <Button
            size="sm"
            className="rounded-full"
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
