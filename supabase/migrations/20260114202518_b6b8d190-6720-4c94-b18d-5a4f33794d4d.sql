-- Fix RLS policies on hotspots table - require proper authentication check
DROP POLICY IF EXISTS "Utenti autenticati possono eliminare hotspots" ON hotspots;
DROP POLICY IF EXISTS "Utenti autenticati possono aggiornare hotspots" ON hotspots;
DROP POLICY IF EXISTS "Utenti autenticati possono inserire hotspots" ON hotspots;

-- Recreate policies with proper auth checks
CREATE POLICY "Utenti autenticati possono eliminare hotspots"
ON hotspots FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utenti autenticati possono aggiornare hotspots"
ON hotspots FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Utenti autenticati possono inserire hotspots"
ON hotspots FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);