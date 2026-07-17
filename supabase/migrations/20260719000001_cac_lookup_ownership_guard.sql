-- ============================================================================
-- DRAFT — NOT YET APPLIED. For review only.
-- File lives in supabase/migrations/_drafts/ so it is NOT picked up by
-- `supabase db push` until moved to ../ and reviewed.
--
-- Fixes (security, CBN Pillar 2 — KYB / CAC lookup):
--   The cac-lookup Edge Function fetches a customer by id using the
--   service_role client with NO check that the caller owns that customer.
--   Any authenticated user who supplies (or enumerates) a customer_id can
--   trigger a CAC lookup and read back that customer's full_name +
--   institution_id, then DELETE/INSERT beneficial owners for a customer
--   they do not own.
--
--   This migration adds a DB-side ownership guard fn_user_owns_customer()
--   that the Edge Function MUST call before acting. (The function code edit
--   is shown at the bottom of this file for reference.)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_user_owns_customer(p_user uuid, p_customer_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  v_inst uuid;
  v_cust_inst uuid;
BEGIN
  IF p_user IS NULL OR p_customer_id IS NULL THEN
    RETURN false;
  END IF;

  -- Platform admins may act on any customer (audit/examination use).
  IF public.has_role(p_user, 'admin'::app_role) THEN
    RETURN true;
  END IF;

  -- Resolve the caller's institution via institution_users
  -- (profiles has no institution_id column).
  SELECT institution_id INTO v_inst
  FROM public.institution_users WHERE user_id = p_user LIMIT 1;
  IF v_inst IS NULL THEN
    RETURN false;
  END IF;

  -- The target customer must belong to the same institution.
  SELECT institution_id INTO v_cust_inst
  FROM public.customers WHERE id = p_customer_id;

  RETURN v_cust_inst IS NOT DISTINCT FROM v_inst;
END;
$$;

GRANT EXECUTE ON FUNCTION public.fn_user_owns_customer(uuid, uuid) TO authenticated;

-- ============================================================================
-- REFERENCE: required Edge Function change (supabase/functions/cac-lookup/index.ts)
-- Insert this check right after the `customer` lookup and BEFORE any
-- delete/insert of beneficial owners. Swap the service_role customer fetch for
-- an auth-scoped one, then assert ownership:
--
--   const { data: customer, error: custError } = await admin
--     .from("customers")
--     .select("id, institution_id, full_name")
--     .eq("id", customer_id)
--     .single();
--   if (custError || !customer) {
--     return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404, ... });
--   }
--
--   const { data: ownsRow } = await admin
--     .rpc("fn_user_owns_customer", { p_user: userId, p_customer_id: customer_id });
--   if (!ownsRow) {
--     return new Response(JSON.stringify({ error: "Forbidden: not your customer" }), { status: 403, ... });
--   }
--
-- Also drop the brittle `profiles.institution_id` lookup (that column does not
-- exist) and rely on the JWT `sub` + the ownership guard for userId.
-- ============================================================================
