-- Fix: permission denied for table quiz_passwords

GRANT USAGE ON SCHEMA public TO postgres, service_role;

GRANT ALL ON TABLE public.quiz_passwords TO postgres, service_role;
GRANT ALL ON TABLE public.quiz_results TO postgres, service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;

GRANT EXECUTE ON FUNCTION public.consume_quiz_attempt(text) TO service_role;

-- RLS policies for service_role (belt-and-suspenders)
DROP POLICY IF EXISTS service_role_all ON public.quiz_passwords;
DROP POLICY IF EXISTS service_role_all ON public.quiz_results;

CREATE POLICY service_role_all ON public.quiz_passwords
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY service_role_all ON public.quiz_results
  FOR ALL TO service_role USING (true) WITH CHECK (true);
