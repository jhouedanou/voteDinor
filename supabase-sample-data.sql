-- ÉTAPE 6: Données de test (optionnel)

-- Ajouter des candidats de test seulement si la table est vide
INSERT INTO candidates (nom, prenom, photo_url, description, status) 
SELECT * FROM (VALUES
    ('Martin', 'Pierre', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face', 'Passionné de cuisine traditionnelle française', 'approved'),
    ('Dubois', 'Marie', 'https://images.unsplash.com/photo-1494790108755-2616b612b494?w=300&h=300&fit=crop&crop=face', 'Chef spécialisée dans la pâtisserie', 'approved'),
    ('Lefebvre', 'Jean', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face', 'Expert en cuisine méditerranéenne', 'approved'),
    ('Moreau', 'Sophie', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face', 'Créatrice de recettes innovantes', 'approved'),
    ('Petit', 'Lucas', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face', 'Spécialiste des produits du terroir', 'approved')
) AS new_candidates(nom, prenom, photo_url, description, status)
WHERE NOT EXISTS (SELECT 1 FROM candidates LIMIT 1);

-- Afficher le résultat
SELECT 'Setup terminé avec succès!' as message;
SELECT COUNT(*) || ' candidats dans la base' as candidats FROM candidates;
SELECT 'RLS activé sur toutes les tables' as security;