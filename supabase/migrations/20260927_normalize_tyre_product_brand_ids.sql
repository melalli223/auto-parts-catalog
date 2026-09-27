-- Normalize legacy numeric tyre brand references to stable IDs.
-- Data-only migration; no UI changes.

UPDATE public.tyre_page
SET data = jsonb_set(
  jsonb_set(
    data,
    '{brands}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN b.value ? 'id' THEN b.value
          ELSE jsonb_set(
            b.value,
            '{id}',
            to_jsonb(
              'tb-' || regexp_replace(
                lower(coalesce(b.value->>'name','brand')),
                '[^a-z0-9]+',
                '-',
                'g'
              )
            )
          )
        END
        ORDER BY b.ord
      )
      FROM jsonb_array_elements(coalesce(data->'brands','[]'::jsonb))
           WITH ORDINALITY b(value,ord)
    ),
    true
  ),
  '{tyreProducts}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN (p.value->>'brandId') ~ '^[0-9]+$'
         AND (p.value->>'brandId')::integer >= 0
         AND (p.value->>'brandId')::integer < jsonb_array_length(coalesce(data->'brands','[]'::jsonb))
        THEN jsonb_set(
          p.value,
          '{brandId}',
          to_jsonb(
            'tb-' || regexp_replace(
              lower(coalesce(data->'brands'->((p.value->>'brandId')::integer)->>'name','brand')),
              '[^a-z0-9]+',
              '-',
              'g'
            )
          )
        )
        ELSE p.value
      END
      ORDER BY p.ord
    )
    FROM jsonb_array_elements(coalesce(data->'tyreProducts','[]'::jsonb))
         WITH ORDINALITY p(value,ord)
  ),
  true
)
WHERE id = true;
