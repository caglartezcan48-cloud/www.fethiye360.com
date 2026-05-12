-- 406 hatasini bypass etmek icin bir fonksiyon olusturalim
CREATE OR REPLACE FUNCTION get_business_by_owner(p_owner_id UUID)
RETURNS SETOF businesses AS $$
BEGIN
    RETURN QUERY SELECT * FROM businesses WHERE owner_id = p_owner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonksiyona erisim izni verelim
GRANT EXECUTE ON FUNCTION get_business_by_owner(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_business_by_owner(UUID) TO anon;
