import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface Profile {
  id: string;
  company_name: string | null;
  cbn_license_category: string | null;
  rc_number: string | null;
  compliance_lead_name: string | null;
  phone: string | null;
  notification_email_report_ready: boolean | null;
  full_name: string | null;
  account_status: string | null;
}

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  institutionName: string;
  licenseCategory: string;
  rcNumber: string;
  userName: string;
  userInitial: string;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  institutionName: "Your Institution",
  licenseCategory: "",
  rcNumber: "",
  userName: "",
  userInitial: "U",
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, company_name, cbn_license_category, rc_number, compliance_lead_name, phone, notification_email_report_ready, full_name, account_status")
      .eq("id", user.id)
      .maybeSingle();
    if (data) setProfile(data as Profile);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    if (!user?.id) return;

    const channel = supabase
      .channel(`profile-changes-${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
        () => fetchProfile(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fallbackName = profile?.compliance_lead_name || profile?.full_name || user?.email?.split("@")[0] || "Compliance Officer";

  const value: ProfileContextType = {
    profile,
    loading,
    refreshProfile: fetchProfile,
    institutionName: profile?.company_name || "Your Institution",
    licenseCategory: profile?.cbn_license_category || "",
    rcNumber: profile?.rc_number || "",
    userName: fallbackName,
    userInitial: fallbackName.charAt(0).toUpperCase(),
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => useContext(ProfileContext);
