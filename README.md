# L'Échiquier Martinérois

Plateforme numérique officielle du club d'échecs de Saint-Martin-d'Hères. Ce projet intègre des outils de jeu interactifs, une gestion de contenu dynamique et une interface utilisateur haute performance.

## Technologies Utilisées

* **Framework** : Next.js 16 (App Router)
* **Langage** : TypeScript
* **Interface de jeu** : React Chessboard & Chess.js
* **Moteur d'analyse** : Stockfish
* **Gestion de contenu (CMS)** : Sanity.io
* **Styles** : Tailwind CSS 4
* **Communication** : EmailJS

## Architecture du Projet

Le code source est centralisé dans le répertoire `src/` pour séparer la logique applicative de la configuration racine :

* **src/app** : Système de routage et pages de l'application.
* **src/components** : Composants UI réutilisables (Navigation, Chessboard, Sections).
* **src/lib** : Fonctions utilitaires et clients API.
* **src/sanity** : Schémas de données et configuration du studio Sanity.
* **public** : Ressources statiques (images, logos).

## Installation et Configuration

### Prérequis

* Node.js version 18.0 ou supérieure.
* Un gestionnaire de paquets (npm, pnpm ou yarn).

### Procédure d'installation

1.  **Clonage du dépôt**
    ```bash
    git clone [https://github.com/votre-username/echiquier-martinerois.git](https://github.com/votre-username/echiquier-martinerois.git)
    cd echiquier-martinerois
    ```

2.  **Installation des dépendances**
    ```bash
    npm install
    ```

3.  **Variables d'environnement**
    Créer un fichier `.env.local` à la racine du projet. Ce fichier est ignoré par Git. Renseigner les clés suivantes :
    ```env
    # Sanity Configuration
    NEXT_PUBLIC_SANITY_PROJECT_ID=votre_id_projet
    NEXT_PUBLIC_SANITY_DATASET=production

    # EmailJS Configuration
    NEXT_PUBLIC_EMAILJS_SERVICE_ID=votre_service_id
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=votre_template_id
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=votre_cle_publique
    ```

4.  **Lancement du serveur de développement**
    ```bash
    npm run dev
    ```
    L'application sera accessible sur `http://localhost:3000`.

## Fonctionnalités Clés

* **Atelier Interactif** : Analyse de positions en temps réel avec le moteur Stockfish intégré.
* **Gestion Dynamique** : Mise à jour simplifiée des tarifs, des tournois et des actualités via le CMS Sanity.
* **Formulaire de Contact** : Intégration directe avec EmailJS pour la gestion des demandes d'adhésion.
* **Optimisation SEO** : Utilisation des métadonnées Next.js pour assurer la visibilité du club.

## Sécurité et Publication

Ce dépôt est configuré pour un usage public sous réserve de respecter les consignes suivantes :
* Ne jamais inclure de fichiers `.env` dans les commits (configuré dans `.gitignore`).
* Les clés d'API doivent être renseignées via les secrets de votre plateforme d'hébergement (Vercel, Netlify, etc.) lors du déploiement en production.