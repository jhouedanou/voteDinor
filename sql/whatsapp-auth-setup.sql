-- Tables pour l'authentification WhatsApp

-- Table pour les codes de connexion temporaires
CREATE TABLE IF NOT EXISTS login_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    whatsapp VARCHAR(15) NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les sessions WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    whatsapp VARCHAR(15) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_login_codes_whatsapp ON login_codes(whatsapp);
CREATE INDEX IF NOT EXISTS idx_login_codes_expires ON login_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_token ON whatsapp_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_candidate ON whatsapp_sessions(candidate_id);

-- Fonction pour nettoyer les codes expirés
CREATE OR REPLACE FUNCTION cleanup_expired_codes()
RETURNS void AS $$
BEGIN
    DELETE FROM login_codes WHERE expires_at < NOW();
    DELETE FROM whatsapp_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger pour nettoyer automatiquement (optionnel)
-- CREATE OR REPLACE FUNCTION trigger_cleanup_expired_codes()
-- RETURNS trigger AS $$
-- BEGIN
--     PERFORM cleanup_expired_codes();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER cleanup_expired_codes_trigger
--     AFTER INSERT ON login_codes
--     EXECUTE FUNCTION trigger_cleanup_expired_codes();

-- Ajouter la colonne auth_method à la table candidates si elle n'existe pas
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS auth_method VARCHAR(20) DEFAULT 'email';

-- Politiques RLS pour les nouvelles tables
ALTER TABLE login_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;

-- Politiques pour login_codes (lecture/écriture pour tous)
CREATE POLICY "Allow all operations on login_codes" ON login_codes
    FOR ALL USING (true);

-- Politiques pour whatsapp_sessions (lecture/écriture pour tous)
CREATE POLICY "Allow all operations on whatsapp_sessions" ON whatsapp_sessions
    FOR ALL USING (true);
