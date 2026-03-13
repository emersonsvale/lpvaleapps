begin;

drop policy if exists "equipe_auth_update_own" on public.equipe;
create policy "equipe_auth_update_own"
on public.equipe for update
to authenticated
using (
  uid = auth.uid()
  or (
    uid is null
    and lower(coalesce(email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
)
with check (
  uid = auth.uid()
);

commit;