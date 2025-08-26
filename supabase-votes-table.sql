-- ÉTAPE 3: Créer la table votes si elle n'existe pas
CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    user_agent TEXT,
    vote_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Contrainte unique : 1 vote par utilisateur par candidat par jour
    UNIQUE(candidate_id, user_id, vote_date),
    -- Contrainte unique : 1 vote par IP par candidat par jour
    UNIQUE(candidate_id, ip_address, vote_date)
);

-- Index pour votes
CREATE INDEX IF NOT EXISTS idx_votes_candidate_id ON votes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_ip_date ON votes(ip_address, vote_date);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);