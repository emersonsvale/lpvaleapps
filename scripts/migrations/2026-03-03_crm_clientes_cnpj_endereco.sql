-- Adiciona campos opcionais de identificação fiscal e endereço no CRM de clientes
-- Data: 2026-03-03

begin;

alter table public.crm_clientes
  add column if not exists cnpj text,
  add column if not exists endereco text;

comment on column public.crm_clientes.cnpj is 'CNPJ opcional do cliente (uso comercial/financeiro)';
comment on column public.crm_clientes.endereco is 'Endereço opcional do cliente';

commit;
