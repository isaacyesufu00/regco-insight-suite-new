import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import EditorialAuthShell from "@/components/editorial/EditorialAuthShell";

const fieldClass =
  "w-full bg-transparent border-0 border-b border-ink-15 px-0 py-3 text-[15px] text-ink placeholder:text-ink-muted/60 focus:outline-none focus:border-ink transition-colors";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);
    if (signInError) {
      setError("Invalid email or password.");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <EditorialAuthShell
      title="Sign in."
      subtitle="Welcome back to your compliance desk."
      footer={
        <>
          New to RegCo?{" "}
          <Link to="/sign-up" className="text-ink underline underline-offset-4 decoration-rust hover:text-rust transition-colors">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">Email</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            autoComplete="email" required className={fieldClass}
          />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">Password</label>
            <Link to="/forgot-password" className="text-[12px] text-ink-muted hover:text-ink transition-colors">
              Forgot?
            </Link>
          </div>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password" required className={fieldClass}
          />
        </div>

        {error && <p className="text-[13px] text-[var(--rust)]">{error}</p>}

        <button
          type="submit" disabled={loading}
          className="w-full py-3.5 rounded-full bg-ink text-[var(--paper)] text-[14.5px] font-medium hover:bg-[var(--rust)] disabled:opacity-60 transition-colors"
        >
          {loading ? "Signing in…" : "Continue"}
        </button>
      </form>
    </EditorialAuthShell>
  );
}
