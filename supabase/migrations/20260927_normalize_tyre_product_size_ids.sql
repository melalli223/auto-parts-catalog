-- Normalize tyre size references stored in tyre_page.data.
-- Current catalogue sizes already use stable ts-* IDs; this migration is
-- intentionally idempotent and converts legacy numeric product sizeId values.

update public.tyre_page
set data = jsonb_set(
  data,
  '{sizes}',
  (
    select coalesce(jsonb_agg(
      case
        when coalesce(s->>'id','') <> '' then s
        else jsonb_set(
          s,
          '{id}',
          to_jsonb('ts-' || regexp_replace(lower(coalesce(s->>'label', s->>'name', 'size-' || (ord-1)::text)), '[^a-z0-9]+', '-', 'g'))
        )
      end
      order by ord
    ), '[]'::jsonb)
    from jsonb_array_elements(coalesce(data->'sizes','[]'::jsonb)) with ordinality t(s,ord)
  ),
  true
)
where id = true;

update public.tyre_page tp
set data = jsonb_set(
  tp.data,
  '{tyreProducts}',
  (
    select coalesce(jsonb_agg(
      case
        when (p->>'sizeId') ~ '^[0-9]+$'
          and (p->>'sizeId')::int >= 0
          and (p->>'sizeId')::int < jsonb_array_length(coalesce(tp.data->'sizes','[]'::jsonb))
        then jsonb_set(
          p,
          '{sizeId}',
          to_jsonb((tp.data->'sizes'->((p->>'sizeId')::int)->>'id'))
        )
        else p
      end
      order by ord
    ), '[]'::jsonb)
    from jsonb_array_elements(coalesce(tp.data->'tyreProducts','[]'::jsonb)) with ordinality t(p,ord)
  ),
  true
)
where id = true;
