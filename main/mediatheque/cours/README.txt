MÉDIATHÈQUE — COURS ÉCRITS
===========================

Principe
--------
Les documents originaux lourds (.docx, .pdf, images) ne sont pas embarqués dans le site.
Chaque cours est converti en fichier texte Markdown (.md), chargé uniquement lorsqu'on l'ouvre.

Organisation actuelle
---------------------
Psychologie
└─ Licence
   └─ L1
      └─ Semestre 1
         └─ UE1 — Thèmes et histoire de la psychologie

Chemin des contenus :
/mediatheque/cours/contenus/psycho/l1/s1/ue1/

Pour ajouter un cours
---------------------
1. Convertir le document en .md ou .txt léger.
2. Le placer dans /mediatheque/cours/contenus/<formation>/<niveau>/<semestre>/<ue>/.
3. Ajouter sa fiche dans /mediatheque/data.js avec kind: "cours".
4. Renseigner au minimum :
   formation, degree, year, semester, ue, module, courseTheme,
   sourceType, format, contentUrl, title, description.

Couleurs prévues
----------------
Psychologie : famille bleu froid.
Philosophie / esthétique : famille ocre chaude.
Autres corpus : teinte neutre vert-gris.
Chaque domaine peut ensuite utiliser des accents secondaires par thème.

Confidentialité
---------------
Tout le dossier /mediatheque/ reste en noindex et bloqué dans robots.txt.
Cela évite l'indexation, mais ne constitue pas une authentification : une URL connue reste accessible.
