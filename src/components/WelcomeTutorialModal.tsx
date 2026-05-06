import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function WelcomeTutorialModal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("tutorial_completed")
        .eq("id", user.id)
        .maybeSingle();
      if (data && !data.tutorial_completed) {
        setShow(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [user]);

  const handleStart = () => {
    setShow(false);
    navigate("/dashboard/tutorial");
  };

  const handleSkip = async () => {
    setShow(false);
    if (user) {
      await supabase.from("profiles").update({ tutorial_completed: true }).eq("id", user.id);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "48px 40px 36px",
              maxWidth: 420,
              width: "90%",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1D1D1F", marginBottom: 12 }}>
              Welcome to RegCo
            </h2>
            <p style={{ fontSize: 17, color: "#6E6E73", lineHeight: 1.5, marginBottom: 32 }}>
              Let us show you how to generate your first CBN return in 5 minutes.
            </p>
            <button
              onClick={handleStart}
              style={{
                width: "100%",
                padding: "14px 0",
                background: "#0066CC",
                color: "#fff",
                border: "none",
                borderRadius: 980,
                fontSize: 17,
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: 16,
              }}
            >
              Start Tutorial
            </button>
            <button
              onClick={handleSkip}
              style={{
                background: "none",
                border: "none",
                color: "#6E6E73",
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Skip for now
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
