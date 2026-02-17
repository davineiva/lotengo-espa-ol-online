
-- Allow professors to view all student profiles for management
CREATE POLICY "Professors can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'professor'));

-- Allow professors to view all user_roles for student listing
CREATE POLICY "Professors can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'professor'));
