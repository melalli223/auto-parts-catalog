-- Normalize legacy numeric tyre product typeId values to stable tyre type IDs.
-- This is intentionally data-only; it does not alter the public/admin UI.
-- Safe to run repeatedly: already-normalized IDs are left unchanged.

UPDATE public.tyre_page AS tp
SET data = jsonb_set(
  tp.data,
  '{tyreProducts}',
  COALESCE((
    SELECT jsonb_agg(
      CASE
        WHEN (product->>'typeId') ~ '^[0-9]+$'
         AND (product->>'typeId')::integer >= 0
         AND (product->>'typeId')::integer < jsonb_array_length(COALESCE(tp.data->'featured', '[]'::jsonb))
        THEN jsonb_set(
          product,
          '{typeId}',
          to_jsonb(
            COALESCE(
              tp.data->'featured'->((product->>'typeId')::integer)->>'id',
              product->>'typeId'
            )
          )
        )
        ELSE product
      END
      ORDER BY ord
    )
    FROM jsonb_array_elements(COALESCE(tp.data->'tyreProducts', '[]'::jsonb))
         WITH ORDINALITY AS products(product, ord)
  ), '[]'::jsonb),
  true
)
WHERE tp.id = true
  AND jsonb_typeof(tp.data->'tyreProducts') = 'array';
