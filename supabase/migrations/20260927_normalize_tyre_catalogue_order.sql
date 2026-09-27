-- Give tyre catalogue arrays explicit stable position metadata.
-- Existing array order is preserved; no UI ordering is changed by this migration.
update public.tyre_page tp
set data = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(tp.data,'{brands}',coalesce((select jsonb_agg(jsonb_set(x,'{position}',to_jsonb(ord-1),true) order by ord) from jsonb_array_elements(coalesce(tp.data->'brands','[]'::jsonb)) with ordinality t(x,ord)),'[]'::jsonb),true),
      '{featured}',coalesce((select jsonb_agg(jsonb_set(x,'{position}',to_jsonb(ord-1),true) order by ord) from jsonb_array_elements(coalesce(tp.data->'featured','[]'::jsonb)) with ordinality t(x,ord)),'[]'::jsonb),true),
    '{sizes}',coalesce((select jsonb_agg(jsonb_set(x,'{position}',to_jsonb(ord-1),true) order by ord) from jsonb_array_elements(coalesce(tp.data->'sizes','[]'::jsonb)) with ordinality t(x,ord)),'[]'::jsonb),true),
  '{tyreProducts}',coalesce((select jsonb_agg(jsonb_set(x,'{position}',to_jsonb(ord-1),true) order by ord) from jsonb_array_elements(coalesce(tp.data->'tyreProducts','[]'::jsonb)) with ordinality t(x,ord)),'[]'::jsonb),true)
where tp.id=true;
