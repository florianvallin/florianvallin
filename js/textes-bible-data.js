(() => {
  "use strict";
  window.FV_BIBLE_DATA = {
  "version": "2026-08-10-bible-cleanup-1",
  "cycles": {
    "origines": {
      "id": "origines",
      "label": "Récits des origines",
      "shortLabel": "Origines",
      "reference": "Genèse 1–11",
      "coordinate": "Récits des origines · avant les patriarches",
      "texts": [
        "genese-naissance-du-monde",
        "genese-la-chute",
        "genese-cain-abel",
        "genese-deluge",
        "genese-babel"
      ],
      "intro": "Avant toute histoire nationale, la Genèse pose les grandes coordonnées du monde humain : création, limite, violence, jugement et dispersion.",
      "gaps": [
        {
          "order": 5001,
          "reference": "Genèse 5",
          "title": "D’Adam à Noé",
          "description": "La généalogie relie les premières générations au récit de Noé."
        },
        {
          "order": 10001,
          "reference": "Genèse 10",
          "title": "La table des peuples",
          "description": "Les peuples et leurs territoires préparent le récit de Babel."
        }
      ]
    },
    "abraham": {
      "id": "abraham",
      "label": "Cycle d’Abraham",
      "shortLabel": "Abraham",
      "reference": "Genèse 12–25",
      "coordinate": "Patriarches · cycle d’Abraham",
      "texts": [
        "genese-appel-abraham",
        "genese-alliance-abraham",
        "genese-sodome",
        "genese-sacrifice-isaac",
        "genese-mort-abraham"
      ],
      "intro": "Avec Abraham, le récit quitte les origines universelles pour suivre une promesse : une terre, une descendance et une bénédiction destinée à s’étendre.",
      "gaps": [
        {
          "order": 13001,
          "reference": "Genèse 13",
          "title": "Abraham et Loth",
          "description": "La séparation des deux hommes prépare les épisodes liés à Sodome."
        },
        {
          "order": 16001,
          "reference": "Genèse 16",
          "title": "Agar et Ismaël",
          "description": "L’attente de la promesse se complique autour d’Agar et d’Ismaël."
        },
        {
          "order": 21001,
          "reference": "Genèse 21",
          "title": "Naissance d’Isaac",
          "description": "La naissance d’Isaac accomplit la promesse longtemps différée."
        },
        {
          "order": 24001,
          "reference": "Genèse 24",
          "title": "Rébecca pour Isaac",
          "description": "Le mariage d’Isaac prépare le passage à la génération suivante."
        }
      ]
    },
    "isaac-jacob": {
      "id": "isaac-jacob",
      "label": "Isaac et Jacob",
      "shortLabel": "Isaac & Jacob",
      "reference": "Genèse 25–36",
      "coordinate": "Patriarches · cycle d’Isaac et Jacob",
      "texts": [
        "genese-jacob-esau-droit-ainesse",
        "genese-benediction-jacob",
        "genese-songe-jacob",
        "genese-combat-jacob"
      ],
      "intro": "La promesse traverse désormais une famille déchirée par les préférences, la rivalité fraternelle, la ruse et les départs, jusqu’à la transformation de Jacob en Israël.",
      "gaps": [
        {
          "order": 29001,
          "reference": "Genèse 29",
          "title": "Jacob rencontre Rachel",
          "description": "Chez Laban, Jacob entre dans une nouvelle histoire familiale."
        },
        {
          "order": 30001,
          "reference": "Genèse 30–31",
          "title": "Jacob chez Laban",
          "description": "Travail, mariages, enfants et tensions conduisent Jacob au retour."
        },
        {
          "order": 33001,
          "reference": "Genèse 33",
          "title": "Jacob retrouve Ésaü",
          "description": "Après le combat nocturne, les deux frères se rencontrent de nouveau."
        },
        {
          "order": 35001,
          "reference": "Genèse 35",
          "title": "Retour à Béthel",
          "description": "Le cycle se resserre autour du retour, de Béthel et de la fin de la génération d’Isaac."
        }
      ]
    },
    "joseph": {
      "id": "joseph",
      "label": "Cycle de Joseph",
      "shortLabel": "Joseph",
      "reference": "Genèse 37–50",
      "coordinate": "Patriarches · cycle de Joseph · avant l’Exode",
      "texts": [
        "genese-joseph-vendu-freres",
        "genese-reves-pharaon-joseph",
        "genese-pardon-joseph",
        "genese-juda-heriter-promesse"
      ],
      "intro": "Le dernier grand cycle de la Genèse transforme la rivalité fraternelle en itinéraire de survie, de puissance et de réconciliation, jusqu’à l’installation de la famille en Égypte.",
      "gaps": [
        {
          "order": 39001,
          "reference": "Genèse 39",
          "title": "Joseph chez Putiphar",
          "description": "Joseph passe du service dans une maison égyptienne à la prison."
        },
        {
          "order": 40001,
          "reference": "Genèse 40",
          "title": "Joseph en prison",
          "description": "Son aptitude à interpréter les rêves prépare son élévation."
        },
        {
          "order": 42001,
          "reference": "Genèse 42–44",
          "title": "Les frères en Égypte",
          "description": "La famine ramène les frères de Joseph devant lui sans qu’ils le reconnaissent."
        },
        {
          "order": 46001,
          "reference": "Genèse 46",
          "title": "Jacob descend en Égypte",
          "description": "La famille rejoint Joseph et s’installe en Égypte."
        },
        {
          "order": 50001,
          "reference": "Genèse 50",
          "title": "La fin du livre",
          "description": "La mort de Jacob puis celle de Joseph referment la Genèse et préparent l’Exode."
        }
      ]
    }
  },
  "texts": {
    "genese-naissance-du-monde": {
      "readingBlocks": [
        {
          "type": "heading",
          "text": "Premier récit — la Création en sept jours"
        },
        {
          "type": "movementStart",
          "title": "Le monde s’ordonne",
          "range": "1,1–13",
          "marker": "1",
          "aria": "Genèse 1, verset 1",
          "text": "Au commencement, Dieu créa le ciel et la terre."
        },
        {
          "type": "verse",
          "marker": "2",
          "aria": "Genèse 1, verset 2",
          "text": "La terre était informe et vide, les ténèbres étaient au-dessus de l’abîme et le souffle de Dieu planait au-dessus des eaux."
        },
        {
          "type": "verse",
          "marker": "3",
          "aria": "Genèse 1, verset 3",
          "text": "Dieu dit : « Que la lumière soit. » Et la lumière fut."
        },
        {
          "type": "verse",
          "marker": "4",
          "aria": "Genèse 1, verset 4",
          "text": "Dieu vit que la lumière était bonne, et Dieu sépara la lumière des ténèbres."
        },
        {
          "type": "verse",
          "marker": "5",
          "aria": "Genèse 1, verset 5",
          "text": "Dieu appela la lumière : « jour », il appela les ténèbres : « nuit ». Il y eut un soir, il y eut un matin : ce fut le premier jour."
        },
        {
          "type": "verse",
          "marker": "6",
          "aria": "Genèse 1, verset 6",
          "text": "Et Dieu dit : « Qu’il y ait un firmament au milieu des eaux, et qu’il sépare les eaux. »"
        },
        {
          "type": "verse",
          "marker": "7",
          "aria": "Genèse 1, verset 7",
          "text": "Dieu fit le firmament, il sépara les eaux qui sont au-dessous du firmament et les eaux qui sont au-dessus. Et ce fut ainsi."
        },
        {
          "type": "verse",
          "marker": "8",
          "aria": "Genèse 1, verset 8",
          "text": "Dieu appela le firmament : « ciel ». Il y eut un soir, il y eut un matin : ce fut le deuxième jour."
        },
        {
          "type": "verse",
          "marker": "9",
          "aria": "Genèse 1, verset 9",
          "text": "Et Dieu dit : « Les eaux qui sont au-dessous du ciel, qu’elles se rassemblent en un seul lieu, et que paraisse la terre ferme. » Et ce fut ainsi."
        },
        {
          "type": "verse",
          "marker": "10",
          "aria": "Genèse 1, verset 10",
          "text": "Dieu appela la terre ferme : « terre », et il appela la masse des eaux : « mer ». Et Dieu vit que cela était bon."
        },
        {
          "type": "verse",
          "marker": "11",
          "aria": "Genèse 1, verset 11",
          "text": "Dieu dit : « Que la terre produise l’herbe, la plante qui porte sa semence, et l’arbre à fruit qui donne, selon son espèce, le fruit qui porte sa semence. » Et ce fut ainsi."
        },
        {
          "type": "verse",
          "marker": "12",
          "aria": "Genèse 1, verset 12",
          "text": "La terre produisit l’herbe, la plante qui porte sa semence, selon son espèce, et l’arbre qui donne, selon son espèce, le fruit qui porte sa semence. Et Dieu vit que cela était bon."
        },
        {
          "type": "verse",
          "marker": "13",
          "aria": "Genèse 1, verset 13",
          "text": "Il y eut un soir, il y eut un matin : ce fut le troisième jour."
        },
        {
          "type": "movementStart",
          "title": "Le ciel et les vivants",
          "range": "1,14–25",
          "marker": "14",
          "aria": "Genèse 1, verset 14",
          "text": "Et Dieu dit : « Qu’il y ait des luminaires au firmament du ciel, pour séparer le jour de la nuit ; qu’ils servent de signes pour marquer les fêtes, les jours et les années ;"
        },
        {
          "type": "verse",
          "marker": "15",
          "aria": "Genèse 1, verset 15",
          "text": "et qu’ils soient, au firmament du ciel, des luminaires pour éclairer la terre. » Et ce fut ainsi."
        },
        {
          "type": "verse",
          "marker": "16",
          "aria": "Genèse 1, verset 16",
          "text": "Dieu fit les deux grands luminaires : le plus grand pour régner sur le jour, le plus petit pour régner sur la nuit ; il fit aussi les étoiles."
        },
        {
          "type": "verse",
          "marker": "17",
          "aria": "Genèse 1, verset 17",
          "text": "Dieu les plaça au firmament du ciel pour éclairer la terre,"
        },
        {
          "type": "verse",
          "marker": "18",
          "aria": "Genèse 1, verset 18",
          "text": "pour régner sur le jour et sur la nuit, pour séparer la lumière des ténèbres. Et Dieu vit que cela était bon."
        },
        {
          "type": "verse",
          "marker": "19",
          "aria": "Genèse 1, verset 19",
          "text": "Il y eut un soir, il y eut un matin : ce fut le quatrième jour."
        },
        {
          "type": "verse",
          "marker": "20",
          "aria": "Genèse 1, verset 20",
          "text": "Et Dieu dit : « Que les eaux foisonnent d’une profusion d’êtres vivants, et que les oiseaux volent au-dessus de la terre, sous le firmament du ciel. »"
        },
        {
          "type": "verse",
          "marker": "21",
          "aria": "Genèse 1, verset 21",
          "text": "Dieu créa, selon leur espèce, les grands monstres marins, tous les êtres vivants qui vont et viennent et qui foisonnent dans les eaux, et aussi, selon leur espèce, tous les oiseaux qui volent. Et Dieu vit que cela était bon."
        },
        {
          "type": "verse",
          "marker": "22",
          "aria": "Genèse 1, verset 22",
          "text": "Dieu les bénit par ces paroles : « Soyez féconds et multipliez-vous, remplissez les mers, que les oiseaux se multiplient sur la terre. »"
        },
        {
          "type": "verse",
          "marker": "23",
          "aria": "Genèse 1, verset 23",
          "text": "Il y eut un soir, il y eut un matin : ce fut le cinquième jour."
        },
        {
          "type": "verse",
          "marker": "24",
          "aria": "Genèse 1, verset 24",
          "text": "Et Dieu dit : « Que la terre produise des êtres vivants selon leur espèce, bestiaux, bestioles et bêtes sauvages selon leur espèce. » Et ce fut ainsi."
        },
        {
          "type": "verse",
          "marker": "25",
          "aria": "Genèse 1, verset 25",
          "text": "Dieu fit les bêtes sauvages selon leur espèce, les bestiaux selon leur espèce, et toutes les bestioles de la terre selon leur espèce. Et Dieu vit que cela était bon."
        },
        {
          "type": "movementStart",
          "title": "L’être humain",
          "range": "1,26–31",
          "marker": "26",
          "aria": "Genèse 1, verset 26",
          "text": "Dieu dit : « Faisons l’homme à notre image, selon notre ressemblance. Qu’il soit le maître des poissons de la mer, des oiseaux du ciel, des bestiaux, de toutes les bêtes sauvages, et de toutes les bestioles qui vont et viennent sur la terre. »"
        },
        {
          "type": "verse",
          "marker": "27",
          "aria": "Genèse 1, verset 27",
          "text": "Dieu créa l’homme à son image, à l’image de Dieu il le créa, il les créa homme et femme."
        },
        {
          "type": "pause",
          "reference": "PSAUME 8",
          "title": "La dignité du mortel",
          "text": "Qu’est-donc un mortel pour que tu t’en souviennes, et un fils d’homme pour que tu le visites ?"
        },
        {
          "type": "verse",
          "marker": "28",
          "aria": "Genèse 1, verset 28",
          "text": "Dieu les bénit et leur dit : « Soyez féconds et multipliez-vous, remplissez la terre et soumettez-la. Soyez les maîtres des poissons de la mer, des oiseaux du ciel, et de tous les animaux qui vont et viennent sur la terre. »"
        },
        {
          "type": "verse",
          "marker": "29",
          "aria": "Genèse 1, verset 29",
          "text": "Dieu dit encore : « Je vous donne toute plante qui porte sa semence sur toute la surface de la terre, et tout arbre dont le fruit porte sa semence : telle sera votre nourriture."
        },
        {
          "type": "verse",
          "marker": "30",
          "aria": "Genèse 1, verset 30",
          "text": "Aux bêtes sauvages, aux oiseaux du ciel, à tout ce qui va et vient sur la terre et qui a souffle de vie, je donne comme nourriture toute herbe verte. » Et ce fut ainsi."
        },
        {
          "type": "verse",
          "marker": "31",
          "aria": "Genèse 1, verset 31",
          "text": "Et Dieu vit tout ce qu’il avait fait : c’était très bon. Il y eut un soir, il y eut un matin : ce fut le sixième jour."
        },
        {
          "type": "gallery",
          "title": "La Création du monde en images",
          "artworks": [
            {
              "title": "La Création dans une Bible enluminée",
              "alt": "Page enluminée médiévale montrant en plusieurs scènes la Création, Adam et Ève et les premiers épisodes de la Genèse.",
              "details": "Bible de Saint-Jean-d’Acre, v. 1250–1254, Bibliothèque de l’Arsenal (BnF), ms. 5211, fol. 3v.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Biblioth%C3%A8que_de_l%27Arsenal%2C_5211_-_Genesis_frontispiece.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Biblioth%C3%A8que_de_l%27Arsenal%2C_5211_-_Genesis_frontispiece.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Biblioth%C3%A8que_de_l%27Arsenal%2C_5211_-_Genesis_frontispiece.jpg",
              "description": "L’enluminure médiévale montre comment le récit de Genèse 1 a longtemps été pensé comme une série d’actes distincts et hiérarchisés."
            },
            {
              "title": "La Création",
              "alt": "Les volets fermés du Jardin des délices de Jérôme Bosch représentant la Création du monde.",
              "details": "Jérôme Bosch, v. 1480–1490, musée du Prado.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Hieronymus_Bosch_-_The_Garden_of_Earthly_Delights_-_The_exterior_%28shutters%29.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Hieronymus_Bosch_-_The_Garden_of_Earthly_Delights_-_The_exterior_%28shutters%29.jpg?width=2200",
              "source": "https://commons.wikimedia.org/wiki/File:Hieronymus_Bosch_-_The_Garden_of_Earthly_Delights_-_The_exterior_%28shutters%29.jpg",
              "description": "Bosch condense la Création en une vision cosmique : la petitesse du monde habité souligne l’ampleur du geste créateur."
            },
            {
              "title": "La Création des animaux",
              "alt": "Fresque de Raphaël représentant Dieu entouré des animaux qu’il vient de créer.",
              "details": "Raphaël, 1518, Loggias du Vatican.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Loggia_di_raffaello_02.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Loggia_di_raffaello_02.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Loggia_di_raffaello_02.jpg",
              "description": "Raphaël met l’accent sur la profusion du vivant : la Création apparaît comme peuplement progressif du monde."
            },
            {
              "title": "La Création des animaux",
              "alt": "Peinture du Tintoret représentant Dieu au milieu des oiseaux, poissons et animaux terrestres.",
              "details": "Le Tintoret, 1551–1552, Gallerie dell’Accademia, Venise.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tintoretto%2C_Jacopo_-_Creation_of_the_Animals_-_1551-52.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tintoretto%2C_Jacopo_-_Creation_of_the_Animals_-_1551-52.jpg?width=1920",
              "source": "https://commons.wikimedia.org/wiki/File:Tintoretto%2C_Jacopo_-_Creation_of_the_Animals_-_1551-52.jpg",
              "description": "Le Tintoret transforme la création des animaux en mouvement : le vivant semble surgir dans un monde encore neuf."
            },
            {
              "title": "La Création du monde",
              "alt": "Peinture attribuée à Johann Melchior Bocksberger représentant la création du monde et des animaux.",
              "details": "Attribué à Johann Melchior Bocksberger, XVIe siècle, Musée des Beaux-Arts de Strasbourg.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Johann_Melchior_Bocksberger_-_La_Cr%C3%A9ation_du_monde_-_Mus%C3%A9e_des_Beaux-Arts_de_Strasbourg_MNR_366.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Johann_Melchior_Bocksberger_-_La_Cr%C3%A9ation_du_monde_-_Mus%C3%A9e_des_Beaux-Arts_de_Strasbourg_MNR_366.jpg?width=1900",
              "source": "https://commons.wikimedia.org/wiki/File:Johann_Melchior_Bocksberger_-_La_Cr%C3%A9ation_du_monde_-_Mus%C3%A9e_des_Beaux-Arts_de_Strasbourg_MNR_366.jpg",
              "description": "Cette composition rassemble plusieurs moments de la Création et permet de lire le récit comme une succession ordonnée."
            },
            {
              "title": "Dieu créant le ciel et la terre",
              "alt": "Gravure de Jan Harmensz. Muller montrant Dieu créant le ciel et la terre.",
              "details": "Jan Harmensz. Muller, d’après Hendrick Goltzius, 1589, The Metropolitan Museum of Art.",
              "src": "https://collectionapi.metmuseum.org/api/collection/v1/iiif/373999/776407/main-image",
              "original": "https://collectionapi.metmuseum.org/api/collection/v1/iiif/373999/776407/main-image",
              "source": "https://www.metmuseum.org/art/collection/search/373999",
              "description": "La gravure donne une forme visible à la séparation et à l’ordonnancement du monde : le récit biblique devient architecture du cosmos."
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "movementStart",
          "title": "Le repos de Dieu",
          "range": "2,1–4",
          "marker": "1",
          "aria": "Genèse 2, verset 1",
          "text": "Ainsi furent achevés le ciel et la terre, et tout leur déploiement."
        },
        {
          "type": "verse",
          "marker": "2",
          "aria": "Genèse 2, verset 2",
          "text": "Le septième jour, Dieu avait achevé l’œuvre qu’il avait faite. Il se reposa, le septième jour, de toute l’œuvre qu’il avait faite."
        },
        {
          "type": "verse",
          "marker": "3",
          "aria": "Genèse 2, verset 3",
          "text": "Et Dieu bénit le septième jour : il en fit un jour sacré parce que, ce jour-là, il s’était reposé de toute l’œuvre de création qu’il avait faite."
        },
        {
          "type": "verse",
          "marker": "4",
          "aria": "Genèse 2, verset 4",
          "text": "Telle fut l’origine du ciel et de la terre lorsqu’ils furent créés."
        },
        {
          "type": "heading",
          "text": "Second récit — la création de l’être humain"
        },
        {
          "type": "movementStart",
          "title": "L’homme et le jardin",
          "range": "2,7–17",
          "marker": "7",
          "aria": "Genèse 2, verset 7",
          "text": "Alors le Seigneur Dieu modela l’homme avec la poussière tirée du sol ; il insuffla dans ses narines le souffle de vie, et l’homme devint un être vivant."
        },
        {
          "type": "pause",
          "reference": "PSAUME 138",
          "title": "L’être humain, œuvre merveilleuse",
          "text": "Je te célébrerai pour tes terribles merveilles ; merveilles, que tes œuvres ! Mon âme, tu la connaissais bien."
        },
        {
          "type": "pause",
          "reference": "PSAUME 103",
          "title": "Poussière et grâce",
          "text": "Yahvé sait, lui, de quoi nous sommes formés, il se souvient que nous sommes poussière. Mais la grâce de Yahvé dure d’éternité en éternité pour ceux qui le craignent…"
        },
        {
          "type": "verse",
          "marker": "8",
          "aria": "Genèse 2, verset 8",
          "text": "Le Seigneur Dieu planta un jardin en Éden, à l’orient, et y plaça l’homme qu’il avait modelé."
        },
        {
          "type": "verse",
          "marker": "9",
          "aria": "Genèse 2, verset 9",
          "text": "Le Seigneur Dieu fit pousser du sol toute sorte d’arbres à l’aspect attirant et aux fruits savoureux ; il y avait aussi l’arbre de vie au milieu du jardin, et l’arbre de la connaissance du bien et du mal."
        },
        {
          "type": "omission",
          "text": "[…]"
        },
        {
          "type": "verse",
          "marker": "15",
          "aria": "Genèse 2, verset 15",
          "text": "Le Seigneur Dieu prit l’homme et le conduisit dans le jardin de l’Éden pour qu’il le travaille et le garde."
        },
        {
          "type": "verse",
          "marker": "16",
          "aria": "Genèse 2, verset 16",
          "text": "Le Seigneur Dieu fit à l’homme cette interdiction : « Tu peux manger les fruits de tous les arbres du jardin ;"
        },
        {
          "type": "verse",
          "marker": "17",
          "aria": "Genèse 2, verset 17",
          "text": "mais quant à l’arbre de la connaissance du bien et du mal, tu n’en mangeras pas ; car, le jour où tu en mangeras, tu seras condamné à mourir. »"
        },
        {
          "type": "movementStart",
          "title": "La recherche d’une aide",
          "range": "2,18–20",
          "marker": "18",
          "aria": "Genèse 2, verset 18",
          "text": "Le Seigneur Dieu dit : « Il n’est pas bon que l’homme soit seul. Je vais lui faire une aide qui lui correspondra. »"
        },
        {
          "type": "verse",
          "marker": "19",
          "aria": "Genèse 2, verset 19",
          "text": "Avec de la terre, le Seigneur Dieu façonna toutes les bêtes des champs et tous les oiseaux du ciel, et il les amena vers l’homme pour voir quels noms il leur donnerait. C’étaient des êtres vivants, et l’homme donna un nom à chacun."
        },
        {
          "type": "verse",
          "marker": "20",
          "aria": "Genèse 2, verset 20",
          "text": "L’homme donna donc leurs noms à tous les animaux, aux oiseaux du ciel et à toutes les bêtes des champs. Mais il ne trouva aucune aide qui lui corresponde."
        },
        {
          "type": "movementStart",
          "title": "La femme et l’union",
          "range": "2,21–25",
          "marker": "21",
          "aria": "Genèse 2, verset 21",
          "text": "Alors le Seigneur Dieu fit tomber sur lui un sommeil mystérieux, et l’homme s’endormit. Le Seigneur Dieu prit de la chair dans son côté, puis il referma."
        },
        {
          "type": "verse",
          "marker": "22",
          "aria": "Genèse 2, verset 22",
          "text": "Avec ce qu’il avait pris à l’homme, il forma une femme et il l’amena vers l’homme."
        },
        {
          "type": "verse",
          "marker": "23",
          "aria": "Genèse 2, verset 23",
          "text": "L’homme dit alors : « Cette fois-ci, voilà l’os de mes os et la chair de ma chair ! on l’appellera : ‘femme’. »"
        },
        {
          "type": "verse",
          "marker": "24",
          "aria": "Genèse 2, verset 24",
          "text": "À cause de cela, l’homme quittera son père et sa mère, il s’attachera à sa femme, et tous deux ne feront plus qu’un."
        },
        {
          "type": "pause",
          "reference": "MATTHIEU 19",
          "title": "La reprise par le Christ",
          "intro": "Le Christ, un jour, reprendra le texte de la Genèse :",
          "text": "N’avez-vous pas lu que le Créateur, au commencement, homme et femme il les fit et qu’il dit : À cause de cela, l’homme quittera père et mère, et il s’attachera à sa femme, et les deux ne seront qu’une seule chair. Ainsi donc, ils ne sont plus deux mais une seule chair. Et bien ! ce que Dieu a uni, que l’homme ne le sépare pas."
        },
        {
          "type": "verse",
          "marker": "25",
          "aria": "Genèse 2, verset 25",
          "text": "Tous les deux, l’homme et sa femme, étaient nus, et ils n’en éprouvaient aucune honte l’un devant l’autre."
        },
        {
          "type": "gallery",
          "title": "L’être humain et le jardin d’Éden",
          "artworks": [
            {
              "title": "La création d’Ève",
              "alt": "Mosaïque médiévale représentant la création d’Ève à partir d’Adam.",
              "details": "Mosaïque du XIIIe siècle, narthex de la basilique Saint-Marc, Venise.",
              "src": "https://1oeuvre-1histoire.com/creation-adam-eve-3.jpg",
              "original": "https://1oeuvre-1histoire.com/creation-adam-eve-3.jpg",
              "source": "https://1oeuvre-1histoire.com/creation-adam-eve.html",
              "description": "La mosaïque insiste sur la naissance d’Ève à partir d’Adam et matérialise le thème de la relation et de l’union développé en Genèse 2."
            },
            {
              "title": "Le Jardin des délices",
              "alt": "Triptyque de Jérôme Bosch montrant le jardin d’Éden, le monde terrestre et l’enfer.",
              "details": "Jérôme Bosch, v. 1480–1505, musée du Prado.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg",
              "description": "Bosch fait du jardin un monde foisonnant et ambigu, où l’harmonie première laisse déjà pressentir la fragilité du désir humain."
            },
            {
              "title": "La Création d’Adam",
              "alt": "Fresque de Michel-Ange représentant Dieu donnant vie à Adam.",
              "details": "Michel-Ange, 1508–1512, chapelle Sixtine, Vatican.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Creaci%C3%B3n_de_Ad%C3%A1n.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Creaci%C3%B3n_de_Ad%C3%A1n.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Creaci%C3%B3n_de_Ad%C3%A1n.jpg",
              "description": "Michel-Ange isole le moment de la création de l’homme : le récit cosmique se resserre soudain sur la relation entre Dieu et l’humain."
            },
            {
              "title": "Adam et Ève au paradis terrestre",
              "alt": "Miniature représentant Adam et Ève au paradis terrestre dans une tradition islamique.",
              "details": "Miniature tirée de La fine fleur des histoires de Louqman, 1583, Türk ve İslam Eserleri Müzesi, Istanbul.",
              "src": "https://assets-mid.lls.fr/pages/52313190/f6.5.4.tex.coran-paradis.webp",
              "original": "https://assets-mid.lls.fr/pages/52313190/f6.5.4.tex.coran-paradis.webp",
              "source": "https://www.lelivrescolaire.fr/page/15762527",
              "description": "La miniature inscrit Adam et Ève dans une tradition visuelle non occidentale et rappelle la circulation très large du récit de la Genèse."
            },
            {
              "title": "La Terre ou le paradis terrestre",
              "alt": "Paysage de Jan Brueghel l’Ancien représentant un paradis peuplé d’animaux.",
              "details": "Jan Brueghel l’Ancien, XVIIe siècle, musée du Louvre.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jan_brueghel_il_vecchio%2C_la_terra_o_paradiso_terrestre%2C_1607-1608.JPG?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jan_brueghel_il_vecchio%2C_la_terra_o_paradiso_terrestre%2C_1607-1608.JPG?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Jan_brueghel_il_vecchio%2C_la_terra_o_paradiso_terrestre%2C_1607-1608.JPG",
              "description": "Brueghel donne au paradis l’ampleur d’un paysage naturel : l’humain y apparaît comme une partie d’un vivant beaucoup plus vaste."
            },
            {
              "title": "Adam et Ève au paradis terrestre",
              "alt": "Peinture de Johann Wenzel Peter représentant Adam et Ève au milieu des animaux du jardin d’Éden.",
              "details": "Johann Wenzel Peter, fin XVIIIe–début XIXe siècle, Pinacothèque vaticane.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Adam_et_%C3%88ve_au_Paradis_Terrestre.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Adam_et_%C3%88ve_au_Paradis_Terrestre.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Adam_et_%C3%88ve_au_Paradis_Terrestre.jpg",
              "description": "La scène développe la paix du paradis terrestre : humains et animaux partagent encore un espace sans rupture."
            },
            {
              "title": "Adam et Ève au jardin d’Éden",
              "alt": "Vitrail représentant Adam et Ève au jardin d’Éden.",
              "details": "Vitrail de l’église Saint-Vaast, Béthune.",
              "src": "https://eglisesduconfluent.fr/imagesAT/AT-AdamEve/ATAdamEve_62Bethunes_EgliseStVaast-Vitrail1.jpg",
              "original": "https://eglisesduconfluent.fr/imagesAT/AT-AdamEve/ATAdamEve_62Bethunes_EgliseStVaast-Vitrail1.jpg",
              "source": "https://www.eglisesduconfluent.fr/Pages/AT-Genese-AdamEve.php",
              "description": "Le vitrail transforme le jardin d’Éden en image de mémoire collective : le récit devient un espace à contempler dans l’architecture religieuse."
            },
            {
              "title": "Le paradis terrestre",
              "alt": "Enluminure représentant Adam et Ève dans le paradis terrestre.",
              "details": "Enluminure conservée à la Bibliothèque nationale de France.",
              "src": "https://cdn.essentiels.bnf.fr/media/images/cache/crop/rc/ej42bLks/uploads/media/image/20210706164952000000_20201204061949000000_can_263.jpg",
              "original": "https://cdn.essentiels.bnf.fr/media/images/cache/crop/rc/ej42bLks/uploads/media/image/20210706164952000000_20201204061949000000_can_263.jpg",
              "source": "https://essentiels.bnf.fr/fr/article/7d6606b6-f27e-4db5-ae91-74825d32e19d-sources-lutopie",
              "description": "L’enluminure résume le paradis terrestre par quelques signes essentiels : jardin clos, présence humaine et ordre du vivant."
            },
            {
              "title": "Adam et Ève",
              "alt": "Représentation artistique d’Adam et Ève.",
              "details": "",
              "src": "https://cdn.prod.website-files.com/5ed7bf5384079963115358b8/670e1e731056bd91b44556a0_5f083235697e96469589596c_7026707189_30eb229578_b%2520copie.jpeg",
              "original": "https://cdn.prod.website-files.com/5ed7bf5384079963115358b8/670e1e731056bd91b44556a0_5f083235697e96469589596c_7026707189_30eb229578_b%2520copie.jpeg",
              "description": "Cette représentation rassemble Adam et Ève comme couple primordial, au cœur du second récit de la création de l’humain."
            }
          ]
        }
      ],
      "paragraphs": [
        "<strong>Premier récit — la Création en sept jours</strong>",
        "Au commencement, Dieu créa le ciel et la terre. La terre était informe et vide, les ténèbres étaient au-dessus de l’abîme et le souffle de Dieu planait au-dessus des eaux. Dieu dit : « Que la lumière soit. » Et la lumière fut. Dieu vit que la lumière était bonne, et Dieu sépara la lumière des ténèbres. Dieu appela la lumière : « jour », il appela les ténèbres : « nuit ». Il y eut un soir, il y eut un matin : ce fut le premier jour.",
        "Et Dieu dit : « Qu’il y ait un firmament au milieu des eaux, et qu’il sépare les eaux. » Dieu fit le firmament, il sépara les eaux qui sont au-dessous du firmament et les eaux qui sont au-dessus. Et ce fut ainsi. Dieu appela le firmament : « ciel ». Il y eut un soir, il y eut un matin : ce fut le deuxième jour.",
        "Et Dieu dit : « Les eaux qui sont au-dessous du ciel, qu’elles se rassemblent en un seul lieu, et que paraisse la terre ferme. » Et ce fut ainsi. Dieu appela la terre ferme : « terre », et il appela la masse des eaux : « mer ». Et Dieu vit que cela était bon.",
        "Dieu dit : « Que la terre produise l’herbe, la plante qui porte sa semence, et l’arbre à fruit qui donne, selon son espèce, le fruit qui porte sa semence. » Et ce fut ainsi. La terre produisit l’herbe, la plante qui porte sa semence, selon son espèce, et l’arbre qui donne, selon son espèce, le fruit qui porte sa semence. Et Dieu vit que cela était bon. Il y eut un soir, il y eut un matin : ce fut le troisième jour.",
        "Et Dieu dit : « Qu’il y ait des luminaires au firmament du ciel, pour séparer le jour de la nuit ; qu’ils servent de signes pour marquer les fêtes, les jours et les années ; et qu’ils soient, au firmament du ciel, des luminaires pour éclairer la terre. » Et ce fut ainsi. Dieu fit les deux grands luminaires : le plus grand pour régner sur le jour, le plus petit pour régner sur la nuit ; il fit aussi les étoiles. Dieu les plaça au firmament du ciel pour éclairer la terre, pour régner sur le jour et sur la nuit, pour séparer la lumière des ténèbres. Et Dieu vit que cela était bon. Il y eut un soir, il y eut un matin : ce fut le quatrième jour.",
        "Et Dieu dit : « Que les eaux foisonnent d’une profusion d’êtres vivants, et que les oiseaux volent au-dessus de la terre, sous le firmament du ciel. » Dieu créa, selon leur espèce, les grands monstres marins, tous les êtres vivants qui vont et viennent et qui foisonnent dans les eaux, et aussi, selon leur espèce, tous les oiseaux qui volent. Et Dieu vit que cela était bon. Dieu les bénit par ces paroles : « Soyez féconds et multipliez-vous, remplissez les mers, que les oiseaux se multiplient sur la terre. » Il y eut un soir, il y eut un matin : ce fut le cinquième jour.",
        "Et Dieu dit : « Que la terre produise des êtres vivants selon leur espèce, bestiaux, bestioles et bêtes sauvages selon leur espèce. » Et ce fut ainsi. Dieu fit les bêtes sauvages selon leur espèce, les bestiaux selon leur espèce, et toutes les bestioles de la terre selon leur espèce. Et Dieu vit que cela était bon.",
        "Dieu dit : « Faisons l’homme à notre image, selon notre ressemblance. Qu’il soit le maître des poissons de la mer, des oiseaux du ciel, des bestiaux, de toutes les bêtes sauvages, et de toutes les bestioles qui vont et viennent sur la terre. » Dieu créa l’homme à son image, à l’image de Dieu il le créa, il les créa homme et femme.",
        "Dieu les bénit et leur dit : « Soyez féconds et multipliez-vous, remplissez la terre et soumettez-la. Soyez les maîtres des poissons de la mer, des oiseaux du ciel, et de tous les animaux qui vont et viennent sur la terre. » Dieu dit encore : « Je vous donne toute plante qui porte sa semence sur toute la surface de la terre, et tout arbre dont le fruit porte sa semence : telle sera votre nourriture. Aux bêtes sauvages, aux oiseaux du ciel, à tout ce qui va et vient sur la terre et qui a souffle de vie, je donne comme nourriture toute herbe verte. » Et ce fut ainsi. Et Dieu vit tout ce qu’il avait fait : c’était très bon. Il y eut un soir, il y eut un matin : ce fut le sixième jour.",
        "Ainsi furent achevés le ciel et la terre, et tout leur déploiement. Le septième jour, Dieu avait achevé l’œuvre qu’il avait faite. Il se reposa, le septième jour, de toute l’œuvre qu’il avait faite. Et Dieu bénit le septième jour : il en fit un jour sacré parce que, ce jour-là, il s’était reposé de toute l’œuvre de création qu’il avait faite. Telle fut l’origine du ciel et de la terre lorsqu’ils furent créés.",
        "<strong>Second récit — la création de l’être humain</strong>",
        "Alors le Seigneur Dieu modela l’homme avec la poussière tirée du sol ; il insuffla dans ses narines le souffle de vie, et l’homme devint un être vivant. Le Seigneur Dieu planta un jardin en Éden, à l’orient, et y plaça l’homme qu’il avait modelé. Le Seigneur Dieu fit pousser du sol toute sorte d’arbres à l’aspect attirant et aux fruits savoureux ; il y avait aussi l’arbre de vie au milieu du jardin, et l’arbre de la connaissance du bien et du mal.",
        "Le Seigneur Dieu prit l’homme et le conduisit dans le jardin de l’Éden pour qu’il le travaille et le garde. Le Seigneur Dieu fit à l’homme cette interdiction : « Tu peux manger les fruits de tous les arbres du jardin ; mais quant à l’arbre de la connaissance du bien et du mal, tu n’en mangeras pas ; car, le jour où tu en mangeras, tu seras condamné à mourir. »",
        "Le Seigneur Dieu dit : « Il n’est pas bon que l’homme soit seul. Je vais lui faire une aide qui lui correspondra. » Avec de la terre, le Seigneur Dieu façonna toutes les bêtes des champs et tous les oiseaux du ciel, et il les amena vers l’homme pour voir quels noms il leur donnerait. C’étaient des êtres vivants, et l’homme donna un nom à chacun. L’homme donna donc leurs noms à tous les animaux, aux oiseaux du ciel et à toutes les bêtes des champs. Mais il ne trouva aucune aide qui lui corresponde.",
        "Alors le Seigneur Dieu fit tomber sur lui un sommeil mystérieux, et l’homme s’endormit. Le Seigneur Dieu prit de la chair dans son côté, puis il referma. Avec ce qu’il avait pris à l’homme, il forma une femme et il l’amena vers l’homme. L’homme dit alors : « Cette fois-ci, voilà l’os de mes os et la chair de ma chair ! on l’appellera : ‘femme’. »",
        "À cause de cela, l’homme quittera son père et sa mère, il s’attachera à sa femme, et tous deux ne feront plus qu’un.",
        "Tous les deux, l’homme et sa femme, étaient nus, et ils n’en éprouvaient aucune honte l’un devant l’autre."
      ],
      "family": null,
      "entities": [
        {
          "term": "Adam",
          "definition": "Premier humain du récit de la Genèse ; son nom est lié à l’hébreu adam, « humain », et à adamah, « sol »."
        },
        {
          "term": "Ève",
          "definition": "Femme d’Adam ; son nom est rapproché dans le récit de la vie et de la maternité."
        }
      ],
      "cycleId": "origines",
      "cycleIndex": 0,
      "reader": {
        "book": "Gen",
        "chapter": "1",
        "verse": "1"
      },
      "narrativeOrder": 1001
    },
    "genese-la-chute": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "La tentation",
          "range": "3,1–5",
          "marker": "1",
          "aria": "Genèse 3, verset 1",
          "text": "Le serpent était le plus rusé de tous les animaux des champs que le Seigneur Dieu avait faits. Il dit à la femme : « Alors, Dieu vous a dit : ‘Vous ne mangerez le fruit d’aucun arbre du jardin’ ? »"
        },
        {
          "type": "verse",
          "marker": "2",
          "aria": "Genèse 3, verset 2",
          "text": "La femme répondit au serpent : « Nous mangeons les fruits des arbres du jardin."
        },
        {
          "type": "verse",
          "marker": "3",
          "aria": "Genèse 3, verset 3",
          "text": "Mais, pour celui qui est au milieu du jardin, Dieu a dit : ‘Vous n’en mangerez pas, vous n’y toucherez pas, sinon vous mourrez.’ »"
        },
        {
          "type": "verse",
          "marker": "4",
          "aria": "Genèse 3, verset 4",
          "text": "Le serpent dit à la femme : « Pas du tout ! Vous ne mourrez pas !"
        },
        {
          "type": "verse",
          "marker": "5",
          "aria": "Genèse 3, verset 5",
          "text": "Mais Dieu sait que, le jour où vous en mangerez, vos yeux s’ouvriront, et vous serez comme des dieux, connaissant le bien et le mal. »"
        },
        {
          "type": "movementStart",
          "title": "La transgression",
          "range": "3,6–7",
          "marker": "6",
          "aria": "Genèse 3, verset 6",
          "text": "La femme s’aperçut que le fruit de l’arbre devait être savoureux, qu’il avait un aspect agréable et qu’il était désirable, puisqu’il donnait l’intelligence. Elle prit de ce fruit, et en mangea. Elle en donna aussi à son mari, et il en mangea."
        },
        {
          "type": "verse",
          "marker": "7",
          "aria": "Genèse 3, verset 7",
          "text": "Alors leurs yeux à tous deux s’ouvrirent et ils connurent qu’ils étaient nus. Ils attachèrent les unes aux autres des feuilles de figuier, et ils s’en firent des pagnes."
        },
        {
          "type": "gallery",
          "title": "Éden et la Chute en images",
          "artworks": [
            {
              "title": "Le Jardin des délices",
              "alt": "Le triptyque de Jérôme Bosch, dont le panneau gauche représente le jardin d’Éden.",
              "details": "Jérôme Bosch, v. 1480–1505, musée du Prado.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg",
              "description": "Chez Bosch, le paradis porte déjà une étrangeté qui rend sensible la fragilité de l’innocence et la proximité de la Chute."
            },
            {
              "title": "Le Jardin d’Éden et la Chute de l’homme",
              "alt": "Adam et Ève auprès de l’arbre de la connaissance dans un paradis rempli d’animaux.",
              "details": "Jan Brueghel l’Ancien et Pierre Paul Rubens, 1615, Mauritshuis, La Haye.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jan_Brueghel_de_Oude_en_Peter_Paul_Rubens_-_Het_aards_paradijs_met_de_zondeval_van_Adam_en_Eva.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jan_Brueghel_de_Oude_en_Peter_Paul_Rubens_-_Het_aards_paradijs_met_de_zondeval_van_Adam_en_Eva.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Jan_Brueghel_de_Oude_en_Peter_Paul_Rubens_-_Het_aards_paradijs_met_de_zondeval_van_Adam_en_Eva.jpg",
              "description": "Brueghel et Rubens font coexister l’exubérance du vivant et le geste décisif d’Adam et Ève : la faute surgit au cœur d’un monde encore luxuriant."
            },
            {
              "title": "Le jardin d’Éden",
              "alt": "Adam et Ève dans le jardin d’Éden au milieu des animaux.",
              "details": "Johann Wenzel Peter, fin XVIIIe–début XIXe siècle, Pinacothèque vaticane.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Adam_et_%C3%88ve_au_Paradis_Terrestre.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Adam_et_%C3%88ve_au_Paradis_Terrestre.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Adam_et_%C3%88ve_au_Paradis_Terrestre.jpg",
              "description": "Le jardin est encore présenté comme un espace d’abondance et d’harmonie : c’est précisément cet ordre que la transgression va rompre."
            }
          ]
        },
        {
          "type": "pause",
          "reference": "ROMAINS 7",
          "title": "La division intérieure",
          "intro": "Pécheurs, nous sommes intérieurement déchirés :",
          "text": "Le bien que je veux, je ne le fais pas, mais le mal que je ne veux pas, je le commets. Car je prends plaisir à la loi de Dieu selon l’homme intérieur ; mais je vois dans mes membres une autre loi qui lutte contre la loi de ma raison et me tient captif sous la loi du péché. Malheureux homme que je suis ! Qui me délivrera ?"
        },
        {
          "type": "movementStart",
          "title": "La confrontation",
          "range": "3,8–13",
          "marker": "8",
          "aria": "Genèse 3, verset 8",
          "text": "Ils entendirent le Seigneur Dieu qui se promenait dans le jardin à la brise du jour. L’homme et la femme allèrent se cacher aux regards du Seigneur Dieu parmi les arbres du jardin."
        },
        {
          "type": "verse",
          "marker": "9",
          "aria": "Genèse 3, verset 9",
          "text": "Le Seigneur Dieu appela l’homme et lui dit : « Où es-tu donc ? »"
        },
        {
          "type": "verse",
          "marker": "10",
          "aria": "Genèse 3, verset 10",
          "text": "L’homme répondit : « Je t’ai entendu dans le jardin, j’ai pris peur parce que je suis nu, et je me suis caché. »"
        },
        {
          "type": "verse",
          "marker": "11",
          "aria": "Genèse 3, verset 11",
          "text": "Le Seigneur reprit : « Qui donc t’a dit que tu étais nu ? Je t’avais interdit de manger du fruit de l’arbre ; en aurais-tu mangé ? »"
        },
        {
          "type": "verse",
          "marker": "12",
          "aria": "Genèse 3, verset 12",
          "text": "L’homme répondit : « La femme que tu m’as donnée, c’est elle qui m’a donné du fruit de l’arbre, et j’en ai mangé. »"
        },
        {
          "type": "verse",
          "marker": "13",
          "aria": "Genèse 3, verset 13",
          "text": "Le Seigneur Dieu dit à la femme : « Qu’as-tu fait là ? » La femme répondit : « Le serpent m’a trompée, et j’ai mangé. »"
        },
        {
          "type": "pause",
          "reference": "ESDRAS 9",
          "title": "Honte et culpabilité",
          "text": "Mon Dieu, j’ai trop de honte et de confusion pour lever vers toi mon visage, ô mon Dieu ; car nos fautes se sont multipliées jusqu’à dépasser nos têtes, et notre culpabilité a grandi jusqu’au ciel. Depuis les jours de nos pères jusqu’à ce jour, nous sommes grandement coupables, et à cause de nos fautes nous avons été livrés, nous, nos rois et nos prêtres, aux mains des rois des pays, au glaive, à la captivité, au pillage et à la honte du visage, comme (il en est) en ce jour."
        },
        {
          "type": "movementStart",
          "title": "Les conséquences",
          "range": "3,14–19",
          "marker": "14",
          "aria": "Genèse 3, verset 14",
          "text": "Alors le Seigneur Dieu dit au serpent : « Parce que tu as fait cela, tu seras maudit parmi tous les animaux et toutes les bêtes des champs. Tu ramperas sur le ventre et tu mangeras de la poussière tous les jours de ta vie."
        },
        {
          "type": "verse",
          "marker": "15",
          "aria": "Genèse 3, verset 15",
          "text": "Je mettrai une hostilité entre la femme et toi, entre sa descendance et ta descendance : sa descendance te meurtrira la tête, et toi, tu lui meurtriras le talon. »"
        },
        {
          "type": "verse",
          "marker": "16",
          "aria": "Genèse 3, verset 16",
          "text": "Le Seigneur Dieu dit ensuite à la femme : « J’aggraverai tes souffrances et tes grossesses ; c’est dans la souffrance que tu enfanteras des fils. Le désir te portera vers ton mari, et celui-ci dominera sur toi. »"
        },
        {
          "type": "verse",
          "marker": "17",
          "aria": "Genèse 3, verset 17",
          "text": "Il dit enfin à l’homme : « Parce que tu as écouté la voix de ta femme, et que tu as mangé le fruit de l’arbre que je t’avais interdit de manger : maudit soit le sol à cause de toi ! C’est dans la souffrance que tu en tireras ta nourriture, tous les jours de ta vie."
        },
        {
          "type": "verse",
          "marker": "18",
          "aria": "Genèse 3, verset 18",
          "text": "De lui-même, il te donnera épines et chardons, mais tu auras ta nourriture en cultivant les champs."
        },
        {
          "type": "verse",
          "marker": "19",
          "aria": "Genèse 3, verset 19",
          "text": "C’est à la sueur de ton visage que tu gagneras ton pain, jusqu’à ce que tu retournes à la terre dont tu proviens ; car tu es poussière, et tu retourneras à la poussière. »"
        },
        {
          "type": "pause",
          "reference": "OSÉE 10",
          "title": "Le mal porte ses fruits",
          "text": "Vous avez labouré la méchanceté,<br>vous avez moissonné l’injustice…<br>Tu t’es confié à tes chars,<br>dans la multitude de tes guerriers.<br>Toutes les forteresses seront dévastées."
        },
        {
          "type": "movementStart",
          "title": "L’expulsion d’Éden",
          "range": "3,20–24",
          "marker": "20",
          "aria": "Genèse 3, verset 20",
          "text": "L’homme appela sa femme Ève (c’est-à-dire : la vivante), parce qu’elle fut la mère de tous les vivants."
        },
        {
          "type": "verse",
          "marker": "21",
          "aria": "Genèse 3, verset 21",
          "text": "Le Seigneur Dieu fit à l’homme et à sa femme des tuniques de peau et les en revêtit."
        },
        {
          "type": "verse",
          "marker": "22",
          "aria": "Genèse 3, verset 22",
          "text": "Puis le Seigneur Dieu déclara : « Voilà que l’homme est devenu comme l’un de nous par la connaissance du bien et du mal ! Maintenant, ne permettons pas qu’il avance la main, qu’il cueille aussi le fruit de l’arbre de vie, qu’il en mange et vive éternellement ! »"
        },
        {
          "type": "verse",
          "marker": "23",
          "aria": "Genèse 3, verset 23",
          "text": "Alors le Seigneur Dieu le renvoya du jardin d’Éden, pour qu’il travaille la terre d’où il avait été tiré."
        },
        {
          "type": "verse",
          "marker": "24",
          "aria": "Genèse 3, verset 24",
          "text": "Il expulsa l’homme, et il posta, à l’orient du jardin d’Éden, les Kéroubim, armés d’un glaive fulgurant, pour garder l’accès de l’arbre de vie."
        },
        {
          "type": "gallery",
          "title": "La faute, le jugement et l’expulsion",
          "artworks": [
            {
              "title": "Le Jugement dernier — Adam et Ève chassés du paradis",
              "alt": "Panneau de Jérôme Bosch associant le paradis, la faute et le jugement.",
              "details": "Jérôme Bosch, Le Jugement dernier, panneau de gauche, 1504, Gemäldegalerie der Bildenden Künste, Vienne.",
              "src": "https://assets-mid.lls.fr/pages/52313190/f6.5.4.tex.bosch-jugement.webp",
              "original": "https://assets-mid.lls.fr/pages/52313190/f6.5.4.tex.bosch-jugement.webp",
              "source": "https://www.lelivrescolaire.fr/page/15762527",
              "description": "Bosch inscrit l’expulsion dans une vision plus vaste du jugement : la sortie d’Éden devient la première grande rupture de la condition humaine."
            },
            {
              "title": "Dieu réprimandant Adam et Ève",
              "alt": "Le Dominiquin représente Dieu interrogeant Adam et Ève après la faute.",
              "details": "Le Dominiquin, v. 1623–1625, musée de Grenoble.",
              "src": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Dieu_r%C3%A9primandant_Adam_et_%C3%88ve%2C_par_Le_Dominiquin.jpg",
              "original": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Dieu_r%C3%A9primandant_Adam_et_%C3%88ve%2C_par_Le_Dominiquin.jpg",
              "source": "https://commons.wikimedia.org/wiki/File:Dieu_r%C3%A9primandant_Adam_et_%C3%88ve%2C_par_Le_Dominiquin.jpg",
              "description": "Le Dominiquin choisit le moment de la confrontation : après le geste interdit vient la parole qui oblige chacun à répondre de ce qu’il a fait."
            },
            {
              "title": "Adam et Ève chassés du jardin d’Éden",
              "alt": "Gravure de Gustave Doré représentant un ange chassant Adam et Ève du jardin d’Éden.",
              "details": "Gustave Doré, illustration de la Bible de Doré, 1866.",
              "src": "https://www.meisterdrucke.fr/kunstwerke/1260px/Gustave_Dore_-_Adam_and_Eve_banished_from_the_Garden_of_Eden_by_an_angel_Illustration_from_the_-_%28MeisterDrucke-1488673%29.jpg",
              "original": "https://www.meisterdrucke.fr/kunstwerke/1260px/Gustave_Dore_-_Adam_and_Eve_banished_from_the_Garden_of_Eden_by_an_angel_Illustration_from_the_-_%28MeisterDrucke-1488673%29.jpg",
              "source": "https://www.meisterdrucke.fr/fine-art-prints/Gustave-Dore/1488673/Adam-et-%C3%88ve-chass%C3%A9s-du-Jardin-d%27%C3%89den-par-un-ange%2C-Illustration-de-la-Bible-de-Dor%C3%A9.html",
              "description": "Doré dramatise le passage du jardin au monde extérieur : la lumière perdue derrière les personnages rend visible l’irréversibilité de l’exil."
            },
            {
              "title": "Adam et Ève quittant le paradis",
              "alt": "Gravure de Gustave Doré représentant Adam et Ève chassés du paradis.",
              "details": "Gustave Doré, illustration du Paradis perdu de John Milton, gravure, 1866.",
              "src": "https://www.meisterdrucke.fr/kunstwerke/1260px/Gustave_Dore_-_Adam_and_Eve_are_hunting_from_Paradise_Illustration_by_Gustave_Dore_for_Paradise_-_%28MeisterDrucke-1508079%29.jpg",
              "original": "https://www.meisterdrucke.fr/kunstwerke/1260px/Gustave_Dore_-_Adam_and_Eve_are_hunting_from_Paradise_Illustration_by_Gustave_Dore_for_Paradise_-_%28MeisterDrucke-1508079%29.jpg",
              "source": "https://www.meisterdrucke.ie/fine-art-prints/Gustave-Dore/1508079/Adam-and-Eve-are-hunting-from-Paradise.-Illustration-by-Gustave-Dore-for-%25E2%2580%259CParadise-Lost%25E2%2580%259D-by-John-Milton.-Engraving-from-1866.-Private-Collection.html",
              "description": "En illustrant Milton, Doré transforme la sortie du paradis en scène de séparation et de deuil : Adam et Ève quittent un monde qui ne leur est plus accessible."
            }
          ]
        },
        {
          "type": "pause",
          "reference": "PSAUME 130",
          "title": "Des profondeurs à la grâce",
          "text": "Des profondeurs je t’appelle, Yahvé ;<br>Si tu prends garde aux fautes, Yahvé,<br>Seigneur qui subsistera ?<br>Mon âme attend le Seigneur<br>plus que veilleurs le matin<br>car près de Yahvé est la grâce<br>et près de lui abonde le rachat."
        }
      ],
      "paragraphs": [],
      "family": null,
      "entities": [
        {
          "term": "Adam",
          "definition": "Premier humain du récit ; après la transgression, il répond avec Ève à l’appel de Dieu."
        },
        {
          "term": "Ève",
          "definition": "Femme d’Adam ; elle dialogue avec le serpent puis mange du fruit avant d’en donner à Adam."
        }
      ],
      "cycleId": "origines",
      "cycleIndex": 1,
      "reader": {
        "book": "Gen",
        "chapter": "3",
        "verse": "1"
      },
      "narrativeOrder": 3001
    },
    "genese-cain-abel": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "Deux frères, deux offrandes",
          "range": "4,1–5",
          "marker": "1",
          "aria": "Genèse 4, verset 1",
          "text": "L’homme s’unit à Ève, sa femme ; elle conçut, et elle mit au monde Caïn. Elle dit alors : « J’ai donné la vie à un homme avec l’aide du Seigneur ! »"
        },
        {
          "type": "verse",
          "marker": "2",
          "aria": "Genèse 4, verset 2",
          "text": "Dans la suite, elle mit au monde Abel, frère de Caïn. Abel devint berger, et Caïn cultivait la terre."
        },
        {
          "type": "verse",
          "marker": "3",
          "aria": "Genèse 4, verset 3",
          "text": "À l’époque habituelle, Caïn présenta des produits de la terre en offrande au Seigneur."
        },
        {
          "type": "verse",
          "marker": "4",
          "aria": "Genèse 4, verset 4",
          "text": "De son côté, Abel présenta les premiers-nés de son troupeau, en offrant les morceaux les meilleurs. Le Seigneur tourna son regard vers Abel et son offrande,"
        },
        {
          "type": "verse",
          "marker": "5",
          "aria": "Genèse 4, verset 5",
          "text": "mais il détourna son regard de Caïn et de son offrande. Caïn en fut très irrité et montra un visage accablé."
        },
        {
          "type": "movementStart",
          "title": "La jalousie à la porte",
          "range": "4,6–7",
          "marker": "6",
          "aria": "Genèse 4, verset 6",
          "text": "Le Seigneur dit à Caïn : « Pourquoi es-tu irrité, pourquoi ce visage accablé ?"
        },
        {
          "type": "verse",
          "marker": "7",
          "aria": "Genèse 4, verset 7",
          "text": "Si tu agis bien, tu pourras relever ton visage. Mais si tu n’agis pas bien, le péché est accroupi à ta porte. Il est à l’affût, mais tu dois le dominer ! »"
        },
        {
          "type": "pause",
          "reference": "JACQUES 4",
          "title": "Des passions à la guerre",
          "text": "D’où viennent les guerres, d’où viennent les batailles parmi vous ? N’est-ce pas de ceci : vos passions qui combattent dans vos membres ? Vous convoitez, et vous n’avez pas ; vous tuez, vous jalousez, et vous ne pouvez obtenir ; vous bataillez et faites la guerre."
        },
        {
          "type": "movementStart",
          "title": "Le meurtre d’Abel",
          "range": "4,8",
          "marker": "8",
          "aria": "Genèse 4, verset 8",
          "text": "Caïn dit à son frère Abel : « Sortons dans les champs. » Et, quand ils furent dans la campagne, Caïn se jeta sur son frère Abel et le tua."
        },
        {
          "type": "gallery",
          "title": "Caïn et Abel en images",
          "artworks": [
            {
              "title": "Caïn et Abel",
              "alt": "Représentation de Caïn et Abel autour du thème de la fraternité, du sacrifice et de la rivalité.",
              "details": "",
              "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaNECI-TDx9WjrA4CJamJKuC__xN4qb9t-grc_kGXm2koFF0mgkFT8bNE&s=10",
              "original": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaNECI-TDx9WjrA4CJamJKuC__xN4qb9t-grc_kGXm2koFF0mgkFT8bNE&s=10",
              "description": "La scène place les deux frères face à face avant que la rivalité ne devienne violence : le conflit naît au sein même de la fraternité."
            },
            {
              "title": "Les sacrifices de Caïn et d’Abel",
              "alt": "Wilhelm Ebbinghaus représente les deux offrandes, celle de Caïn et celle d’Abel.",
              "details": "Wilhelm Ebbinghaus, lithographie en couleurs.",
              "src": "https://www.meisterdrucke.fr/kunstwerke/1260px/Wilhelm_Ebbinghaus_-_Sacrifices_of_Cain_and_Abel_%28colour_litho%29_-_%28MeisterDrucke-1406805%29.jpg",
              "original": "https://www.meisterdrucke.fr/kunstwerke/1260px/Wilhelm_Ebbinghaus_-_Sacrifices_of_Cain_and_Abel_%28colour_litho%29_-_%28MeisterDrucke-1406805%29.jpg",
              "source": "https://www.meisterdrucke.fr/kunstwerke/1260px/Wilhelm_Ebbinghaus_-_Sacrifices_of_Cain_and_Abel_%28colour_litho%29_-_%28MeisterDrucke-1406805%29.jpg",
              "description": "La représentation des deux offrandes rend visible le point de départ du récit : deux gestes semblables reçoivent une issue différente."
            },
            {
              "title": "Caïn",
              "alt": "Représentation de Caïn après le meurtre de son frère.",
              "details": "Œuvre reproduite par Arts Mythologica.",
              "src": "https://arts.mythologica.fr/artist-c/pic/crespid_cain.jpg",
              "original": "https://arts.mythologica.fr/artist-c/pic/crespid_cain.jpg",
              "source": "https://arts.mythologica.fr/artist-c/pic/crespid_cain.jpg",
              "description": "Le portrait de Caïn concentre l’attention sur le personnage après la rupture : la violence n’efface pas la question de ce qu’il devient."
            },
            {
              "title": "Caïn",
              "alt": "Autre représentation de Caïn, habitée par la faute, la violence ou le remords.",
              "details": "Œuvre reproduite par Arts Mythologica.",
              "src": "https://arts.mythologica.fr/artist-f/pic/ferretti_cain.jpg",
              "original": "https://arts.mythologica.fr/artist-f/pic/ferretti_cain.jpg",
              "source": "https://arts.mythologica.fr/artist-f/pic/ferretti_cain.jpg",
              "description": "Cette autre figure de Caïn insiste sur le poids intérieur du meurtre et sur la marque laissée par l’acte."
            },
            {
              "title": "Le meurtre d’Abel",
              "alt": "Scène illustrant le meurtre d’Abel par Caïn.",
              "details": "",
              "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyimaMS8iVjqyGSgoBYPF3Hn8q9vd_iZwQxpaNOMR-Jbb_wN2qizsdRUOL&s=10",
              "original": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyimaMS8iVjqyGSgoBYPF3Hn8q9vd_iZwQxpaNOMR-Jbb_wN2qizsdRUOL&s=10",
              "description": "Le meurtre d’Abel montre le basculement décisif : la jalousie devient atteinte irréversible à l’autre."
            },
            {
              "title": "Caïn",
              "alt": "Fernand Cormon représente Caïn dans l’errance, après la faute.",
              "details": "Fernand Cormon, XIXe siècle.",
              "src": "https://histoire-image.org/sites/default/files/2021-11/cormon-cain.jpg",
              "original": "https://histoire-image.org/sites/default/files/2021-11/cormon-cain.jpg",
              "source": "https://histoire-image.org/sites/default/files/2021-11/cormon-cain.jpg",
              "description": "Cormon fait de Caïn une figure d’errance : le meurtre se prolonge dans le déplacement et l’impossibilité de retrouver l’ordre ancien."
            },
            {
              "title": "Caïn et Abel",
              "alt": "Interprétation artistique du récit de Caïn et Abel.",
              "details": "",
              "src": "https://images.navigart.fr/1000/5C/98/5C98702.jpg",
              "original": "https://images.navigart.fr/1000/5C/98/5C98702.jpg",
              "source": "https://images.navigart.fr/1000/5C/98/5C98702.jpg",
              "description": "La confrontation des deux frères résume la question centrale du passage : que devient la fraternité lorsque le désir de reconnaissance se transforme en rivalité ?"
            }
          ]
        },
        {
          "type": "movementStart",
          "title": "« Où est ton frère ? »",
          "range": "4,9–12",
          "marker": "9",
          "aria": "Genèse 4, verset 9",
          "text": "Le Seigneur dit à Caïn : « Où est ton frère Abel ? » Caïn répondit : « Je ne sais pas. Est-ce que je suis le gardien de mon frère ? »"
        },
        {
          "type": "pause",
          "reference": "MATTHIEU 25",
          "title": "Le frère comme prochain",
          "intro": "Jésus dit :",
          "text": "Chaque fois que vous l’avez fait au moindre de mes frères que voici, c’est à moi que vous l’avez fait."
        },
        {
          "type": "verse",
          "marker": "10",
          "aria": "Genèse 4, verset 10",
          "text": "Le Seigneur reprit : « Qu’as-tu fait ? La voix du sang de ton frère crie de la terre vers moi !"
        },
        {
          "type": "verse",
          "marker": "11",
          "aria": "Genèse 4, verset 11",
          "text": "Maintenant donc, sois maudit et chassé loin de cette terre qui a ouvert la bouche pour boire le sang de ton frère, versé par ta main."
        },
        {
          "type": "verse",
          "marker": "12",
          "aria": "Genèse 4, verset 12",
          "text": "Tu auras beau cultiver la terre, elle ne produira plus rien pour toi. Tu seras un errant, un vagabond à travers le monde. »"
        },
        {
          "type": "movementStart",
          "title": "Le châtiment et le signe",
          "range": "4,13–15",
          "marker": "13",
          "aria": "Genèse 4, verset 13",
          "text": "Alors Caïn dit au Seigneur : « Ce châtiment est au-dessus de mes forces !"
        },
        {
          "type": "verse",
          "marker": "14",
          "aria": "Genèse 4, verset 14",
          "text": "Voici qu’aujourd’hui tu m’as chassé de ma terre. Je dois me cacher loin de toi, je serai un errant, un vagabond à travers le monde, et le premier venu me tuera. »"
        },
        {
          "type": "verse",
          "marker": "15",
          "aria": "Genèse 4, verset 15",
          "text": "Le Seigneur lui répondit : « Si quelqu’un tue Caïn, Caïn sera vengé sept fois. » Et le Seigneur mit un signe sur Caïn pour le préserver d’être tué par le premier venu."
        },
        {
          "type": "pause",
          "reference": "JEAN 8",
          "title": "La vengeance retenue",
          "intro": "Mais il dit aussi :",
          "text": "Que celui d’entre vous qui est sans péché lui jette la première pierre."
        }
      ],
      "paragraphs": [],
      "family": null,
      "entities": [
        {
          "term": "Caïn",
          "definition": "Fils d’Adam et Ève, cultivateur ; il tue son frère Abel puis reçoit un signe de protection."
        },
        {
          "term": "Abel",
          "definition": "Frère de Caïn, berger ; sa mort fait de lui la première victime de violence fraternelle dans la Genèse."
        }
      ],
      "cycleId": "origines",
      "cycleIndex": 2,
      "reader": {
        "book": "Gen",
        "chapter": "4",
        "verse": "1"
      },
      "narrativeOrder": 4001
    },
    "genese-deluge": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "La violence et la grâce",
          "range": "6,5–10",
          "marker": "5",
          "aria": "Genèse 6, verset 5",
          "text": "Le Seigneur vit que la méchanceté de l’homme était grande sur la terre, et que toutes les pensées de son cœur se portaient uniquement vers le mal à longueur de journée."
        },
        {
          "type": "verse",
          "marker": "6",
          "aria": "Genèse 6, verset 6",
          "text": "Le Seigneur regretta d’avoir fait l’homme, et de l’avoir mis sur la terre ; il s’en affligea et il dit :"
        },
        {
          "type": "verse",
          "marker": "7",
          "aria": "Genèse 6, verset 7",
          "text": "« Je vais effacer de la surface du sol les hommes que j’ai créés — et, avec les hommes, les bestiaux, les bestioles et les oiseaux du ciel — car je regrette de les avoir faits. »"
        },
        {
          "type": "verse",
          "marker": "8",
          "aria": "Genèse 6, verset 8",
          "text": "Mais Noé trouva grâce aux yeux du Seigneur."
        },
        {
          "type": "verse",
          "marker": "9",
          "aria": "Genèse 6, verset 9",
          "text": "Voici l’histoire de Noé : Noé était un homme juste, parfait parmi ceux de sa génération ; il marchait avec Dieu."
        },
        {
          "type": "verse",
          "marker": "10",
          "aria": "Genèse 6, verset 10",
          "text": "Noé engendra trois fils, Sem, Cham et Japhet."
        },
        {
          "type": "omission",
          "text": "[…]"
        },
        {
          "type": "movementStart",
          "title": "L’arche et l’alliance",
          "range": "6,13–19.21–22",
          "marker": "13",
          "aria": "Genèse 6, verset 13",
          "text": "Dieu dit à Noé : « La fin de toute chair est arrivée pour moi, car la terre est remplie de violence à cause d’eux : voici que je vais les détruire ainsi que la terre."
        },
        {
          "type": "verse",
          "marker": "14",
          "aria": "Genèse 6, verset 14",
          "text": "Fais-toi une arche en bois de cyprès. Tu disposeras l’arche en cellules et tu l’enduiras de bitume à l’intérieur et à l’extérieur."
        },
        {
          "type": "verse",
          "marker": "15",
          "aria": "Genèse 6, verset 15",
          "text": "Voici comment tu la feras : de trois cents coudées sera la longueur de l’arche, de cinquante coudées sa largeur, de trente coudées sa hauteur."
        },
        {
          "type": "verse",
          "marker": "16",
          "aria": "Genèse 6, verset 16",
          "text": "Tu feras à l’arche un toit et tu l’achèveras à une coudée au-dessus. Tu mettras l’entrée de l’arche sur son côté et tu feras un premier, un second et un troisième étage."
        },
        {
          "type": "verse",
          "marker": "17",
          "aria": "Genèse 6, verset 17",
          "text": "Et moi, voici que je vais faire venir sur la terre le déluge — les eaux — pour détruire de dessous le ciel toute chair qui a en elle souffle de vie ; tout ce qui est sur la terre expirera."
        },
        {
          "type": "verse",
          "marker": "18",
          "aria": "Genèse 6, verset 18",
          "text": "Mais j’établirai mon alliance avec toi ; tu entreras dans l’arche, toi, tes fils, ta femme et les femmes de tes fils avec toi."
        },
        {
          "type": "verse",
          "marker": "19",
          "aria": "Genèse 6, verset 19",
          "text": "De tout ce qui vit, de toute chair, tu feras entrer dans l’arche deux de chaque espèce pour que tu les conserves en vie ; ils seront mâle et femelle."
        },
        {
          "type": "omission",
          "text": "[…]"
        },
        {
          "type": "verse",
          "marker": "21",
          "aria": "Genèse 6, verset 21",
          "text": "Et toi, procure-toi de tous les aliments qui se mangent, et fais-en provision ; cela te servira de nourriture pour toi et pour eux. »"
        },
        {
          "type": "verse",
          "marker": "22",
          "aria": "Genèse 6, verset 22",
          "text": "Noé fit en tout selon ce que lui avait commandé Dieu ; ainsi fit-il."
        },
        {
          "type": "divider"
        },
        {
          "type": "movementStart",
          "title": "Le déluge",
          "range": "7,11–24",
          "marker": "11",
          "aria": "Genèse 7, verset 11",
          "text": "En l’an six cent de la vie de Noé, le deuxième mois, le dix-septième jour du mois, en ce jour-là, jaillirent toutes les sources du grand Abîme et les écluses du ciel s’ouvrirent."
        },
        {
          "type": "verse",
          "marker": "12",
          "aria": "Genèse 7, verset 12",
          "text": "Et il y eut de la pluie sur la terre pendant quarante jours et quarante nuits."
        },
        {
          "type": "verse",
          "marker": "13–14",
          "aria": "Genèse 7, versets 13 à 14, extrait",
          "text": "Ce jour-là même, Noé entra dans l’arche, ainsi que Sem, Cham et Japhet, fils de Noé et avec eux la femme de Noé et les trois femmes de ses fils, ainsi que toutes les bêtes selon leur espèce."
        },
        {
          "type": "omission",
          "text": "[…]"
        },
        {
          "type": "verse",
          "marker": "16",
          "aria": "Genèse 7, verset 16, fin du verset reproduite dans la source",
          "text": "Et Yahvé ferma sur eux la porte de l’arche."
        },
        {
          "type": "verse",
          "marker": "17",
          "aria": "Genèse 7, verset 17",
          "text": "Et ce fut le déluge pendant quarante jours sur la terre. Les eaux s’accrurent et soulevèrent l’arche qui s’éleva au-dessus de la terre."
        },
        {
          "type": "verse",
          "marker": "18",
          "aria": "Genèse 7, verset 18",
          "text": "Les eaux grossirent et s’accrurent beaucoup sur la terre, et l’arche allait sur la face des eaux."
        },
        {
          "type": "verse",
          "marker": "19",
          "aria": "Genèse 7, verset 19",
          "text": "Et les eaux grossirent beaucoup, beaucoup sur la terre et toutes les hautes montagnes qui sont sous les cieux furent recouvertes."
        },
        {
          "type": "verse",
          "marker": "20",
          "aria": "Genèse 7, verset 20",
          "text": "De quinze coudées au-dessus les eaux avaient grossi et les montagnes avaient été recouvertes."
        },
        {
          "type": "verse",
          "marker": "21",
          "aria": "Genèse 7, verset 21",
          "text": "Alors expira toute chair qui se meut sur la terre : oiseaux, bestiaux, bêtes, tout être pullulant qui pullule sur la terre, ainsi que tous les hommes."
        },
        {
          "type": "verse",
          "marker": "22",
          "aria": "Genèse 7, verset 22",
          "text": "Tout ce qui avait haleine de vie dans les narines, tout ce qui était sur la terre ferme, mourut."
        },
        {
          "type": "verse",
          "marker": "23",
          "aria": "Genèse 7, verset 23",
          "text": "Ainsi fut effacé tout être qui se trouvait sur la surface du sol, depuis l’homme jusqu’aux bestiaux, aux reptiles et aux oiseaux du ciel : ils furent effacés de la terre. Il ne resta que Noé et ce qui était avec lui dans l’arche."
        },
        {
          "type": "verse",
          "marker": "24",
          "aria": "Genèse 7, verset 24",
          "text": "Les eaux grandirent sur la terre durant cent cinquante jours."
        },
        {
          "type": "gallery",
          "title": "De l’arche au Déluge",
          "artworks": [
            {
              "title": "Le Déluge",
              "alt": "Des hommes tentent d’échapper aux eaux du Déluge dans la fresque de la chapelle Sixtine.",
              "details": "Michel-Ange, 1508–1509, chapelle Sixtine, Vatican.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Deluge_after_restoration.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Deluge_after_restoration.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:The_Deluge_after_restoration.jpg",
              "description": "Michel-Ange montre surtout la panique humaine au cœur du fléau : le Déluge apparaît comme jugement mais aussi comme catastrophe vécue par des corps."
            },
            {
              "title": "Entry of Animals into the Ark",
              "alt": "Une multitude d’animaux se rassemble pour entrer dans l’arche de Noé.",
              "details": "Jan Brueghel l’Ancien, 1613, J. Paul Getty Museum, Los Angeles.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jan_Brueghel_the_Elder_-_The_Entry_of_the_Animals_into_Noah%27s_Ark_-_Google_Art_Project.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jan_Brueghel_the_Elder_-_The_Entry_of_the_Animals_into_Noah%27s_Ark_-_Google_Art_Project.jpg?width=2400",
              "source": "https://www.getty.edu/art/collection/object/103RJT",
              "description": "Brueghel met l’accent sur le rassemblement du vivant : l’arche devient un lieu de conservation au milieu d’un monde menacé."
            },
            {
              "title": "L’Hiver ou Le Déluge",
              "alt": "Un paysage sombre et presque entièrement submergé représente la catastrophe du Déluge.",
              "details": "Nicolas Poussin, 1660–1664, musée du Louvre, Paris.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Nicolas_Poussin_-_L%27Hiver_ou_Le_D%C3%A9luge.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Nicolas_Poussin_-_L%27Hiver_ou_Le_D%C3%A9luge.jpg?width=2200",
              "source": "https://collections.louvre.fr/ark:/53355/cl010066113",
              "description": "Poussin donne au Déluge la forme d’un paysage ultime : l’eau, le froid et l’obscurité réduisent l’humanité à une extrême vulnérabilité."
            },
            {
              "title": "The Building of Noah's Ark",
              "alt": "Noé et des ouvriers construisent l’arche avant le Déluge.",
              "details": "Aureliano Milani, première moitié du XVIIIe siècle, Musée des Beaux-Arts de Budapest.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Franz%C3%B6sischer_Meister_um_1675_001.jpg?width=1200",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Franz%C3%B6sischer_Meister_um_1675_001.jpg?width=1576",
              "source": "https://www.mfab.hu/artworks/10130/",
              "description": "Milani choisit le temps de la préparation : avant la catastrophe, le salut passe par un travail concret, patient et presque démesuré."
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "movementStart",
          "title": "Les eaux se retirent",
          "range": "8,1–5",
          "marker": "1",
          "aria": "Genèse 8, verset 1",
          "text": "Dieu se souvint de Noé, de toutes les bêtes et de tous les bestiaux qui étaient avec lui dans l’arche. Dieu fit passer un vent sur la terre et les eaux s’apaisèrent."
        },
        {
          "type": "verse",
          "marker": "2",
          "aria": "Genèse 8, verset 2",
          "text": "Les sources de l’Abîme et les écluses du ciel furent fermées et la pluie fut retenue du ciel."
        },
        {
          "type": "verse",
          "marker": "3",
          "aria": "Genèse 8, verset 3",
          "text": "Les eaux revinrent graduellement de dessus la terre ; les eaux baissèrent au bout de cent cinquante jours."
        },
        {
          "type": "verse",
          "marker": "4",
          "aria": "Genèse 8, verset 4",
          "text": "Au septième mois, le dix-septième jour du mois, l’arche se posa sur les monts d’Ararat."
        },
        {
          "type": "verse",
          "marker": "5",
          "aria": "Genèse 8, verset 5",
          "text": "Les eaux continuèrent de baisser jusqu’au dixième mois. Le dixième mois, le premier du mois, apparurent les sommets des montagnes."
        },
        {
          "type": "movementStart",
          "title": "Le corbeau et la colombe",
          "range": "8,6–13",
          "marker": "6",
          "aria": "Genèse 8, verset 6",
          "text": "Au bout de quarante jours, Noé ouvrit la fenêtre de l’arche qu’il avait construite,"
        },
        {
          "type": "verse",
          "marker": "7",
          "aria": "Genèse 8, verset 7",
          "text": "et il lâcha un corbeau ; celui-ci s’envola et revint en attendant que la terre soit redevenue sèche."
        },
        {
          "type": "verse",
          "marker": "8",
          "aria": "Genèse 8, verset 8",
          "text": "Ensuite, Noé lâcha une colombe pour savoir si les eaux avaient baissé à la surface du sol."
        },
        {
          "type": "verse",
          "marker": "9",
          "aria": "Genèse 8, verset 9",
          "text": "La colombe ne trouva pas d’endroit où se poser, et elle revint vers l’arche auprès de lui, parce que les eaux couvraient toute la terre ; Noé tendit la main, prit la colombe, et la fit rentrer auprès de lui dans l’arche."
        },
        {
          "type": "verse",
          "marker": "10",
          "aria": "Genèse 8, verset 10",
          "text": "Il attendit encore sept jours, et lâcha de nouveau la colombe hors de l’arche."
        },
        {
          "type": "verse",
          "marker": "11",
          "aria": "Genèse 8, verset 11",
          "text": "Sur le soir, la colombe revint, et dans son bec il y avait un rameau d’olivier tout frais ! Noé sut ainsi que les eaux avaient baissé à la surface de la terre."
        },
        {
          "type": "verse",
          "marker": "12",
          "aria": "Genèse 8, verset 12",
          "text": "Il attendit encore sept autres jours et lâcha la colombe, qui ne revint plus."
        },
        {
          "type": "verse",
          "marker": "13",
          "aria": "Genèse 8, verset 13",
          "text": "C’est en l’an six cent un de la vie de Noé, au premier mois, le premier du mois, que la terre redevint sèche. Noé enleva le toit de l’arche, et regarda : la surface de la terre était sèche."
        },
        {
          "type": "omission",
          "text": "[…]"
        },
        {
          "type": "movementStart",
          "title": "L’autel et la promesse",
          "range": "8,20–22",
          "marker": "20",
          "aria": "Genèse 8, verset 20",
          "text": "Noé dressa un autel au Seigneur ; il prit, parmi tous les animaux purs et tous les oiseaux purs, des victimes qu’il offrit en holocauste sur l’autel."
        },
        {
          "type": "verse",
          "marker": "21",
          "aria": "Genèse 8, verset 21",
          "text": "Le Seigneur respira l’agréable odeur, et il se dit en lui-même : « Je ne maudirai plus jamais le sol à cause de l’homme. Les pensées de son cœur sont mauvaises dès sa jeunesse ; mais plus jamais je ne frapperai tous les vivants comme je l’ai fait."
        },
        {
          "type": "verse",
          "marker": "22",
          "aria": "Genèse 8, verset 22",
          "text": "Tant que la terre durera,<br>semailles et moissons,<br>froidure et chaleur,<br>été et hiver,<br>jour et nuit<br>ne cesseront jamais. »"
        },
        {
          "type": "gallery",
          "title": "Le retour à la terre et l’action de grâce",
          "artworks": [
            {
              "title": "Noah after the Flood",
              "alt": "Noé et sa famille sont représentés avec les animaux après le Déluge.",
              "details": "Atelier de Jacopo Bassano, seconde moitié du XVIe siècle, Museo del Prado, Madrid.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/No%C3%A9_despu%C3%A9s_del_Diluvio.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/No%C3%A9_despu%C3%A9s_del_Diluvio.jpg?width=1920",
              "source": "https://www.museodelprado.es/en/the-collection/art-work/noah-after-the-flood/8a95a6e5-e940-494d-b19d-18d44d1e5237",
              "description": "L’atelier de Bassano insiste sur l’après : hommes, animaux et objets retrouvent leur place dans un monde où la vie doit être recommencée."
            },
            {
              "title": "The Thanksgiving of Noah",
              "alt": "Noé rend grâce à Dieu après la fin du Déluge.",
              "details": "Giovanni Battista Gaulli, dit Il Baciccio, v. 1700, High Museum of Art, Atlanta.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Thanksgiving_of_Noah_by_Il_Baciccio%2C_c._1700%2C_High_Museum_of_Art.jpg?width=1200",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Thanksgiving_of_Noah_by_Il_Baciccio%2C_c._1700%2C_High_Museum_of_Art.jpg",
              "source": "https://commons.wikimedia.org/wiki/File:The_Thanksgiving_of_Noah_by_Il_Baciccio%2C_c._1700%2C_High_Museum_of_Art.jpg",
              "description": "L’action de grâce de Noé rappelle que la fin du Déluge n’est pas seulement un retour matériel à la terre, mais aussi un acte religieux."
            },
            {
              "title": "The Assuaging of the Waters",
              "alt": "Les eaux du Déluge s’apaisent dans un vaste paysage dominé par l’arche.",
              "details": "John Martin, 1840, Fine Arts Museums of San Francisco.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Assuaging_of_the_Waters_by_John_Martin%2C_1840.jpg?width=1200",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Assuaging_of_the_Waters_by_John_Martin%2C_1840.jpg",
              "source": "https://commons.wikimedia.org/wiki/File:The_Assuaging_of_the_Waters_by_John_Martin%2C_1840.jpg",
              "description": "John Martin représente l’apaisement des eaux comme un changement d’échelle : après la violence du Déluge, le monde recommence à devenir habitable."
            },
            {
              "title": "Noé sortant de l’arche",
              "alt": "Noé et les siens après la sortie de l’arche, au moment du sacrifice offert après le Déluge.",
              "details": "Jean Battaille, v. 1841, Museum voor Schone Kunsten, Gand.",
              "src": "https://imagehub.mskgent.be/iiif/2/public%2F74.tif/full/1200,/0/default.jpg",
              "original": "https://imagehub.mskgent.be/iiif/2/public%2F74.tif/full/full/0/default.jpg",
              "source": "https://www.mskgent.be/fr/collection/1841-a",
              "description": "La sortie de l’arche montre le passage du salut conservé à la vie reprise : Noé et les siens retrouvent un monde transformé."
            },
            {
              "title": "The Return of the Dove to the Ark",
              "alt": "Deux jeunes femmes accueillent la colombe revenue vers l’arche avec le signe du retour de la terre.",
              "details": "John Everett Millais, 1851, Ashmolean Museum, Oxford.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Millais_-_Die_R%C3%BCckkehr_der_Taube_zur_Arche_Noah.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Millais_-_Die_R%C3%BCckkehr_der_Taube_zur_Arche_Noah.jpg?width=2200",
              "source": "https://images.ashmolean.org/asset/5617",
              "description": "Millais fait de la colombe un signe d’attente et d’espérance : un détail fragile suffit à annoncer le retour possible à la terre."
            }
          ]
        },
        {
          "type": "pause",
          "reference": "MATTHIEU 13,47–49a",
          "title": "Le jugement et le tri",
          "intro": "Sans jugement, où serait le sérieux de la vie ?",
          "text": "Le Royaume des Cieux est semblable à un filet jeté en mer et qui recueille toute espèce de poissons. Une fois rempli, les pêcheurs le tirent sur le rivage, puis s’asseyant, ils ramassent ce qui est bon dans des paniers et rejettent ce qui ne vaut rien. Ainsi en sera-t-il à la fin du monde."
        },
        {
          "type": "pause",
          "reference": "ÉZÉCHIEL 33,11",
          "title": "La justice et la vie",
          "intro": "Mais sans amour, que serait la justice ?",
          "text": "Par ma vie ! — oracle du Seigneur Yahvé — je ne désire pas la mort du méchant, mais qu’il se détourne de sa voie et qu’il vive."
        },
        {
          "type": "pause",
          "reference": "ISAÏE 54,8–10",
          "title": "Comme aux jours de Noé",
          "text": "Dans un amour éternel j’ai pitié de toi, dit ton rédempteur, Yahvé. Il en sera pour moi comme aux jours de Noé : comme j’avais juré que les eaux de Noé ne submergeraient plus la terre… ma grâce ne se retirera pas de toi."
        },
        {
          "type": "pause",
          "reference": "LUC 19,10",
          "title": "Chercher et sauver",
          "text": "Le Fils de l’homme est venu chercher et sauver ce qui était perdu."
        }
      ],
      "paragraphs": [],
      "family": null,
      "entities": [
        {
          "term": "Noé",
          "definition": "Homme juste choisi pour traverser le Déluge avec sa famille et les êtres vivants accueillis dans l’arche."
        }
      ],
      "cycleId": "origines",
      "cycleIndex": 3,
      "reader": {
        "book": "Gen",
        "chapter": "6",
        "verse": "1"
      },
      "narrativeOrder": 6001
    },
    "genese-babel": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "Un même langage",
          "range": "11,1–2",
          "marker": "1",
          "aria": "Genèse 11, verset 1",
          "text": "Toute la terre avait alors le même langage et les mêmes mots."
        },
        {
          "type": "verse",
          "marker": "2",
          "aria": "Genèse 11, verset 2",
          "text": "Au cours de leurs déplacements du côté de l’orient, les hommes découvrirent une plaine en Mésopotamie, et ils s’y installèrent."
        },
        {
          "type": "movementStart",
          "title": "La ville, la tour et la renommée",
          "range": "11,3–4",
          "marker": "3",
          "aria": "Genèse 11, verset 3",
          "text": "Ils se dirent l’un à l’autre : « Allons ! fabriquons des briques et mettons-les à cuire ! » Les briques leur servaient de pierres, et le bitume, de mortier."
        },
        {
          "type": "verse",
          "marker": "4",
          "aria": "Genèse 11, verset 4",
          "text": "Ils dirent : « Allons ! bâtissons une ville, avec une tour dont le sommet soit dans les cieux. Nous travaillerons à notre renommée, pour n’être pas dispersés sur toute la terre. »"
        },
        {
          "type": "movementStart",
          "title": "Le Seigneur descend",
          "range": "11,5–7",
          "marker": "5",
          "aria": "Genèse 11, verset 5",
          "text": "Le Seigneur descendit pour voir la ville et la tour que les hommes avaient bâties."
        },
        {
          "type": "verse",
          "marker": "6",
          "aria": "Genèse 11, verset 6",
          "text": "Et le Seigneur dit : « Ils sont un seul peuple, ils ont tous le même langage : s’ils commencent ainsi, rien ne les empêchera désormais de faire tout ce qu’ils décideront."
        },
        {
          "type": "verse",
          "marker": "7",
          "aria": "Genèse 11, verset 7",
          "text": "Eh bien ! descendons, embrouillons leur langage : qu’ils ne se comprennent plus les uns les autres. »"
        },
        {
          "type": "movementStart",
          "title": "La dispersion",
          "range": "11,8–9",
          "marker": "8",
          "aria": "Genèse 11, verset 8",
          "text": "De là, le Seigneur les dispersa sur toute l’étendue de la terre. Ils cessèrent donc de bâtir la ville."
        },
        {
          "type": "verse",
          "marker": "9",
          "aria": "Genèse 11, verset 9",
          "text": "C’est pourquoi on l’appela Babel (Babylone), car c’est là que le Seigneur embrouilla le langage des habitants de toute la terre ; et c’est de là qu’il les dispersa sur toute l’étendue de la terre."
        },
        {
          "type": "pause",
          "reference": "ACTES DES APÔTRES 2,7–11",
          "title": "La Pentecôte : comprendre dans la diversité",
          "intro": "Ce que l’orgueil a dispersé, l’amour le rassemblera. Au matin de la Pentecôte.",
          "text": "... Dans leur étonnement ; ils disaient : « Tous ces gens qui parlent ne sont-ils donc pas Galiléens ? Comment alors les entendons-nous chacun dans sa propre langue maternelle ? Parthes, Mèdes, Elamites, habitants de la Mésopotamie, de Judée et de Cappadoce... Romains résidant ici... nous les entendons parler dans nos langues des grandes œuvres de Dieu ! »"
        },
        {
          "type": "pause",
          "reference": "GALATES 3,28",
          "title": "Une unité qui dépasse les divisions",
          "text": "Il n’y a ni Juif ni Grec, il n’y a ni esclave ni homme libre, il n’y a ni homme ni femme : vous n’êtes tous qu’un en Christ Jésus."
        },
        {
          "type": "gallery",
          "title": "Babel : du projet à la dispersion",
          "artworks": [
            {
              "title": "Nimrod Deciding Where to Build the Tower",
              "alt": "Nimrod désigne l’emplacement où doit s’élever la tour de Babel, tandis que le terrain est mesuré et préparé.",
              "details": "Jan Collaert I, d’après Jan Snellinck I, 1585, série The Tower of Babel.",
              "description": "La décision précède le chantier : le projet collectif prend forme sous l’autorité de Nimrod, avant même que la tour ne s’élève.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Nimrod%20wijst%20aan%20waar%20de%20toren%20gebouwd%20moet%20worden%20Geschiedenis%20van%20de%20toren%20van%20Babel%20%28serietitel%29%20Historia%20Turris%20Babijlonicae%20%28serietitel%29%20Thesaurus%20sacrarum%20historiarum%20veteris%20testamenti%2C%20elegantissimis%20imaginibu%2C%20RP-P-1995-25-19.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Nimrod%20wijst%20aan%20waar%20de%20toren%20gebouwd%20moet%20worden%20Geschiedenis%20van%20de%20toren%20van%20Babel%20%28serietitel%29%20Historia%20Turris%20Babijlonicae%20%28serietitel%29%20Thesaurus%20sacrarum%20historiarum%20veteris%20testamenti%2C%20elegantissimis%20imaginibu%2C%20RP-P-1995-25-19.jpg?width=2400",
              "source": "https://www.metmuseum.org/art/collection/search/653611"
            },
            {
              "title": "La Tour de Babel",
              "alt": "La gigantesque tour de Babel domine un vaste chantier peuplé d’ouvriers et de machines.",
              "details": "Pieter Bruegel l’Ancien, 1563, Kunsthistorisches Museum, Vienne.",
              "description": "Bruegel donne une échelle monumentale au projet : l’unité des hommes devient puissance de construction, mais aussi démesure architecturale.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pieter%20Bruegel%20the%20Elder%20-%20The%20Tower%20of%20Babel%20%28Vienna%29%20-%20Google%20Art%20ProjectFXD.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pieter%20Bruegel%20the%20Elder%20-%20The%20Tower%20of%20Babel%20%28Vienna%29%20-%20Google%20Art%20ProjectFXD.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_(Vienna)_-_Google_Art_ProjectFXD.jpg"
            },
            {
              "title": "La Petite Tour de Babel",
              "alt": "Une tour massive et inachevée occupe presque tout le paysage, sous un ciel sombre.",
              "details": "Pieter Bruegel l’Ancien, vers 1568, Museum Boijmans Van Beuningen, Rotterdam.",
              "description": "Plus ramassée et plus sombre que la version de Vienne, cette tour paraît absorber tout l’espace : la démesure du projet devient presque oppressante.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pieter%20Bruegel%20the%20Elder%20-%20The%20Tower%20of%20Babel%20%28Rotterdam%29%20-%20Google%20Art%20Project%20-%20edited.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pieter%20Bruegel%20the%20Elder%20-%20The%20Tower%20of%20Babel%20%28Rotterdam%29%20-%20Google%20Art%20Project%20-%20edited.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_(Rotterdam)_-_Google_Art_Project_-_edited.jpg"
            },
            {
              "title": "La Confusion des langues",
              "alt": "Dieu intervient au-dessus de la tour tandis que les hommes, désormais incapables de se comprendre, se dispersent.",
              "details": "Gustave Doré, vers 1865–1868, gravure pour la Bible.",
              "description": "Doré concentre l’image sur le basculement du récit : la parole commune se défait et l’intervention divine transforme le chantier en scène de confusion.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Confusion%20of%20Tongues.png?width=1200",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Confusion%20of%20Tongues.png",
              "source": "https://commons.wikimedia.org/wiki/File:Confusion_of_Tongues.png"
            },
            {
              "title": "The Confusion of Tongues",
              "alt": "La confusion des langues interrompt le chantier de Babel et entraîne la fuite et la dispersion des hommes.",
              "details": "Jan Collaert I, d’après Jan Snellinck I, 1585, série The Tower of Babel.",
              "description": "Le dernier mouvement est celui de la rupture : le travail commun s’arrête, les groupes se séparent et la dispersion remplace l’unité recherchée au commencement.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Babylonische%20spraakverwarring%20Geschiedenis%20van%20de%20toren%20van%20Babel%20%28serietitel%29%20Thesaurus%20sacrarum%20historiarum%20veteris%20testamenti%2C%20elegantissimis%20imaginibus%20expressum%20excellentissimorum%20in%20hac%20arte%20virorum%20opera%20nunc%20pr%2C%20RP-P-1988-312-15.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Babylonische%20spraakverwarring%20Geschiedenis%20van%20de%20toren%20van%20Babel%20%28serietitel%29%20Thesaurus%20sacrarum%20historiarum%20veteris%20testamenti%2C%20elegantissimis%20imaginibus%20expressum%20excellentissimorum%20in%20hac%20arte%20virorum%20opera%20nunc%20pr%2C%20RP-P-1988-312-15.jpg?width=2400",
              "source": "https://www.metmuseum.org/art/collection/search/653616"
            }
          ]
        }
      ],
      "paragraphs": [],
      "family": null,
      "entities": [],
      "cycleId": "origines",
      "cycleIndex": 4,
      "reader": {
        "book": "Gen",
        "chapter": "11",
        "verse": "1"
      },
      "narrativeOrder": 11001
    },
    "genese-appel-abraham": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "L’appel et la bénédiction",
          "range": "12,1–3",
          "marker": "1",
          "aria": "Genèse 12, verset 1",
          "text": "Abram vivait alors en Chaldée. Le Seigneur lui dit : « Pars de ton pays, laisse ta famille et la maison de ton père, va dans le pays que je te montrerai."
        },
        {
          "type": "verse",
          "marker": "2",
          "aria": "Genèse 12, verset 2",
          "text": "Je ferai de toi une grande nation,<br>je te bénirai,<br>je rendrai grand ton nom,<br>et tu deviendras une bénédiction."
        },
        {
          "type": "verse",
          "marker": "3",
          "aria": "Genèse 12, verset 3",
          "text": "Je bénirai ceux qui te béniront,<br>je maudirai celui qui te méprisera.<br>En toi seront bénies<br>toutes les familles de la terre. »"
        },
        {
          "type": "movementStart",
          "title": "Partir vers Canaan",
          "range": "12,4–6",
          "marker": "4",
          "aria": "Genèse 12, verset 4",
          "text": "Abram partit, comme le Seigneur le lui avait dit, et Loth partit avec lui. Abram avait soixante-quinze ans lorsqu’il sortit de Harrane."
        },
        {
          "type": "verse",
          "marker": "5",
          "aria": "Genèse 12, verset 5",
          "text": "Il prit sa femme Saraï, son neveu Loth, tous leurs biens, et les serviteurs qu’ils avaient acquis à Harrane ; ils se mirent en route pour Canaan et ils arrivèrent dans ce pays."
        },
        {
          "type": "verse",
          "marker": "6",
          "aria": "Genèse 12, verset 6",
          "text": "Abram traversa le pays jusqu’à Sichem, au Chêne de Moré. Les Cananéens étaient alors dans le pays."
        },
        {
          "type": "movementStart",
          "title": "La terre promise et les autels",
          "range": "12,7–9",
          "marker": "7",
          "aria": "Genèse 12, verset 7",
          "text": "Le Seigneur apparut à Abram et lui dit : « Voilà le pays que je donnerai à ta descendance. » Et là, Abram bâtit un autel au Seigneur qui lui était apparu."
        },
        {
          "type": "verse",
          "marker": "8",
          "aria": "Genèse 12, verset 8",
          "text": "De là, il se rendit dans la montagne, à l’est de Béthel et il planta sa tente, ayant Béthel à l’ouest et Aï à l’est. À cet endroit, il éleva un autel au Seigneur et invoqua le nom du Seigneur."
        },
        {
          "type": "verse",
          "marker": "9",
          "aria": "Genèse 12, verset 9",
          "text": "Puis, de campement en campement, Abram s’en alla vers le Néguev."
        },
        {
          "type": "movementStart",
          "title": "La promesse face à l’absence d’héritier",
          "range": "15,1–4",
          "marker": "1",
          "aria": "Genèse 15, verset 1",
          "text": "La parole du Seigneur fut adressée à Abram dans une vision : « Ne crains pas, Abram ! Je suis un bouclier pour toi. Tu recevras de cette Alliance un merveilleux salaire. »"
        },
        {
          "type": "verse",
          "marker": "2",
          "aria": "Genèse 15, verset 2",
          "text": "Abram répondit : « Mon Seigneur Dieu, qu’est-ce que tu vas me donner ? Je suis sans enfant…"
        },
        {
          "type": "verse",
          "marker": "3",
          "aria": "Genèse 15, verset 3",
          "text": "Tu ne m’as pas donné de descendance, et c’est un de mes serviteurs qui sera mon héritier. »"
        },
        {
          "type": "verse",
          "marker": "4",
          "aria": "Genèse 15, verset 4",
          "text": "Alors cette parole du Seigneur fut adressée à Abram : « Ce n’est pas lui qui sera ton héritier, mais quelqu’un de ton sang. »"
        },
        {
          "type": "movementStart",
          "title": "Compter les étoiles et croire",
          "range": "15,5–6",
          "marker": "5",
          "aria": "Genèse 15, verset 5",
          "text": "Puis il le fit sortir et lui dit : « Regarde le ciel, et compte les étoiles, si tu le peux… » Et il déclara : « Voilà quelle descendance tu auras ! »"
        },
        {
          "type": "verse",
          "marker": "6",
          "aria": "Genèse 15, verset 6",
          "text": "Abram eut foi dans le Seigneur, et le Seigneur estima qu’il était juste."
        },
        {
          "type": "pause",
          "reference": "ROMAINS 4,17–21",
          "title": "Espérer contre toute espérance",
          "text": "Abraham est notre père devant Dieu en qui il a cru. Espérant contre toute espérance, il crut et devint par là le père d’un grand nombre de nations. C’est sans faiblir dans la foi qu’il songea à son corps déjà mort, et au sein de Sara, mort aussi. Il n’hésita pas, pleinement convaincu que ce que Dieu a promis, il est assez puissant pour l’accomplir."
        },
        {
          "type": "pause",
          "reference": "DEUTÉRONOME 7,6–8a",
          "title": "Choisi parce qu’aimé",
          "text": "Tu es un peuple consacré à Yahvé ton Dieu. C’est toi qu’a choisi Yahvé pour être son propre peuple parmi tous les peuples qui sont à la surface du sol. Si Yahvé s’est épris de vous et vous a choisis, ce n’est pas que vous soyez plus nombreux qu’aucun des autres peuples, car vous êtes le moindre de tous les peuples. Mais c’est parce que Yahvé vous aime."
        },
        {
          "type": "pause",
          "reference": "PSAUME 100,1.3–5",
          "title": "Son peuple et le troupeau de son pâturage",
          "text": "Acclamez Yahvé, terre entière !<br>C’est lui qui nous a faits et nous sommes à lui,<br>son peuple et le troupeau de son pâturage.<br>Entrez par ses portes avec la louange.<br>Car il est bon, Yahvé,<br>éternelle, sa fidélité,<br>d’âge en âge, sa sincérité !"
        },
        {
          "type": "gallery",
          "title": "L’appel d’Abraham en images",
          "artworks": [
            {
              "title": "Departure of Abraham for Canaan",
              "alt": "Abraham quitte son pays avec sa famille, ses serviteurs, ses animaux et ses biens, dans une grande scène de départ vers Canaan.",
              "details": "Jacopo Bassano avec Francesco Bassano, vers 1570, National Gallery of Canada.",
              "description": "Cette scène donne une forme visible au commandement « Pars de ton pays » : l’appel devient départ réel, avec la famille, les biens, les animaux et tout ce qu’il faut quitter pour marcher vers la terre promise.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bassano%20-%20Departure%20of%20Abraham%20for%20Canaan.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bassano%20-%20Departure%20of%20Abraham%20for%20Canaan.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Bassano_-_Departure_of_Abraham_for_Canaan.jpg"
            },
            {
              "title": "Abraham Journeying to the Land of Canaan",
              "alt": "Abraham et sa suite avancent vers Canaan au milieu d’un paysage, accompagnés d’animaux et de voyageurs.",
              "details": "Giovanni Benedetto Castiglione, XVIIe siècle, Fitzwilliam Museum.",
              "description": "L’œuvre insiste sur la route elle-même : Abraham n’est pas seulement celui qui a entendu une parole, mais celui qui consent à traverser l’espace, à vivre en marche et à faire confiance à une promesse encore invisible.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Giovanni%20Benedetto%20Castiglione%20%281609-1664%29%20-%20Abraham%20Journeying%20to%20the%20Land%20of%20Canaan%20-%20148%20-%20Fitzwilliam%20Museum.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Giovanni%20Benedetto%20Castiglione%20%281609-1664%29%20-%20Abraham%20Journeying%20to%20the%20Land%20of%20Canaan%20-%20148%20-%20Fitzwilliam%20Museum.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Giovanni_Benedetto_Castiglione_(1609-1664)_-_Abraham_Journeying_to_the_Land_of_Canaan_-_148_-_Fitzwilliam_Museum.jpg"
            },
            {
              "title": "The Caravan of Abram",
              "alt": "Une longue caravane guidée par Abram progresse dans un format vertical, évoquant l’entrée en Canaan et la marche du peuple en devenir.",
              "details": "James Tissot, vers 1896–1902, Jewish Museum, New York.",
              "description": "La verticalité de l’image et la file des voyageurs mettent en valeur l’idée de pèlerinage : l’appel d’Abraham engage tout un déplacement, presque une manière d’exister en route vers ce que Dieu promet.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tissot%20The%20Caravan%20of%20Abraham.jpg?width=1200",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tissot%20The%20Caravan%20of%20Abraham.jpg?width=2000",
              "source": "https://commons.wikimedia.org/wiki/File:Tissot_The_Caravan_of_Abraham.jpg"
            },
            {
              "title": "God appearing to Abraham",
              "alt": "Dieu apparaît à Abraham et lui montre le ciel étoilé, image de la descendance promise.",
              "details": "Nicolas Chaperon, d’après l’atelier de Raphaël, 1649, d’après la Loggia du Vatican.",
              "description": "Cette gravure correspond au second moment de la fiche : en Genèse 15, Dieu promet à Abraham une descendance aussi nombreuse que les étoiles. L’image traduit la foi d’Abraham face à une promesse encore impossible à vérifier.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/God%20verschijnt%20aan%20Abraham%2C%20RP-P-OB-42.585.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/God%20verschijnt%20aan%20Abraham%2C%20RP-P-OB-42.585.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:God_verschijnt_aan_Abraham,_RP-P-OB-42.585.jpg"
            }
          ]
        }
      ],
      "paragraphs": [],
      "family": null,
      "entities": [
        {
          "term": "Abram",
          "definition": "Nom d’Abraham avant Genèse 17 ; il quitte son pays à l’appel de Dieu et reçoit une promesse de terre et de descendance."
        },
        {
          "term": "Abraham",
          "definition": "Patriarche biblique porteur de la promesse ; son nom est donné à Abram en Genèse 17."
        }
      ],
      "cycleId": "abraham",
      "cycleIndex": 0,
      "reader": {
        "book": "Gen",
        "chapter": "12",
        "verse": "1"
      },
      "narrativeOrder": 12001
    },
    "genese-alliance-abraham": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "Marcher en présence de Dieu",
          "range": "17,1–2",
          "marker": "1",
          "aria": "Genèse 17, verset 1",
          "text": "Lorsque Abram eut atteint quatre-vingt-dix-neuf ans, le Seigneur lui apparut et lui dit : « Je suis le Dieu Tout-Puissant ; marche en ma présence et sois parfait."
        },
        {
          "type": "verse",
          "marker": "2",
          "aria": "Genèse 17, verset 2",
          "text": "J’établis mon Alliance entre moi et toi, et je multiplierai ta descendance à l’infini. »"
        },
        {
          "type": "movementStart",
          "title": "Un nouveau nom, une multitude de peuples",
          "range": "17,3–6",
          "marker": "3",
          "aria": "Genèse 17, verset 3",
          "text": "Abram tomba la face contre terre et Dieu lui parla ainsi :"
        },
        {
          "type": "verse",
          "marker": "4",
          "aria": "Genèse 17, verset 4",
          "text": "« Voici l’Alliance que je fais avec toi : tu deviendras le père d’un grand nombre de peuples,"
        },
        {
          "type": "verse",
          "marker": "5",
          "aria": "Genèse 17, verset 5",
          "text": "au lieu d’être appelé Abram, comme jusqu’ici, ton nom sera désormais Abraham, car je fais de toi le père d’un grand nombre de peuples."
        },
        {
          "type": "verse",
          "marker": "6",
          "aria": "Genèse 17, verset 6",
          "text": "Je te ferai porter des fruits à l’infini, de toi je ferai des peuples, et des rois sortiront de toi."
        },
        {
          "type": "movementStart",
          "title": "Une Alliance perpétuelle",
          "range": "17,7–8",
          "marker": "7",
          "aria": "Genèse 17, verset 7",
          "text": "J’instituerai mon Alliance entre moi et toi, et après toi avec ta descendance, de génération en génération ; ce sera une Alliance perpétuelle par laquelle je serai ton Dieu, et celui de ta descendance après toi."
        },
        {
          "type": "verse",
          "marker": "8",
          "aria": "Genèse 17, verset 8",
          "text": "À toi et à ta descendance après toi je donnerai tout le pays de Canaan, — ce pays où tu es venu en immigré — pour que tu en aies la possession perpétuelle, et je serai votre Dieu. »"
        },
        {
          "type": "movementStart",
          "title": "Observer l’Alliance et en porter le signe",
          "range": "17,9–10",
          "marker": "9",
          "aria": "Genèse 17, verset 9",
          "text": "Dieu lui dit aussi : « Tu observeras mon Alliance, toi et ta descendance après toi, de génération en génération."
        },
        {
          "type": "verse",
          "marker": "10",
          "aria": "Genèse 17, verset 10",
          "text": "Et voici le pacte d’Alliance qui sera observé entre moi et vous, c’est-à-dire toi et ta descendance : tous vos enfants mâles seront circoncis. »"
        },
        {
          "type": "pause",
          "reference": "PSAUME 89,20.27–29",
          "title": "L’Alliance et la fidélité envers l’élu",
          "text": "J’ai exalté de mon peuple un élu.<br>Il m’invoquera : Tu es mon père,<br>mon Dieu, le Rocher de mon salut.<br>Aussi, moi, je ferai de lui un premier-né.<br>À jamais je lui garderai ma fidélité,<br>et mon alliance pour lui sera loyale."
        },
        {
          "type": "pause",
          "reference": "JÉRÉMIE 31,31.33–34",
          "title": "La promesse d’une Alliance nouvelle",
          "intro": "Au moment de l’Exil et de ses ruines, une alliance « nouvelle » commence d’être envisagée :",
          "text": "Voici venir des jours où je conclurai avec la maison d’Israël et avec la maison de Juda une alliance nouvelle. Je mettrai ma loi au-dedans d’eux et je l’écrirai sur leur cœur. Je serai leur Dieu et eux seront mon peuple. Je pardonnerai leurs fautes et de leur péché je ne me souviendrai plus."
        },
        {
          "type": "pause",
          "reference": "PRIÈRE EUCHARISTIQUE",
          "title": "L’Alliance nouvelle et éternelle",
          "intro": "Dans la liturgie chrétienne, le thème de l’Alliance est repris dans les paroles sur la coupe :",
          "text": "« Ceci est la coupe de mon sang, le sang de l’Alliance nouvelle et éternelle, qui sera versé pour vous et pour la multitude en rémission des péchés. »"
        },
        {
          "type": "gallery",
          "title": "L’Alliance avec Abraham en images",
          "artworks": [
            {
              "title": "God verschijnt voor Abraham",
              "alt": "Dieu apparaît à Abraham et lui parle de l’alliance, tandis qu’au second plan Ismaël et les hommes de la maison reçoivent la circoncision.",
              "details": "Dirck Volckertsz. Coornhert, d’après Maarten van Heemskerck, 1549, Rijksmuseum.",
              "description": "Cette gravure condense toute la logique de Genèse 17 : Dieu se révèle à Abraham, lui parle de l’Alliance, et le signe de cette Alliance — la circoncision — apparaît déjà à l’arrière-plan.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/God%20verschijnt%20voor%20Abraham%20Geschiedenis%20van%20Abraham%20%28serietitel%29%2C%20RP-P-BI-6498.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/God%20verschijnt%20voor%20Abraham%20Geschiedenis%20van%20Abraham%20%28serietitel%29%2C%20RP-P-BI-6498.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:God_verschijnt_voor_Abraham_Geschiedenis_van_Abraham_(serietitel),_RP-P-BI-6498.jpg"
            },
            {
              "title": "Abraham reçoit l’institution de la circoncision",
              "alt": "Abraham agenouillé devant Dieu reçoit le commandement de la circoncision dans une enluminure médiévale.",
              "details": "Bible historiale, tradition médiévale française, XIVe siècle.",
              "description": "L’enluminure insiste sur la dimension religieuse du texte : Genèse 17 n’est pas seulement une promesse, mais une Alliance explicitement formulée, accompagnée d’un signe concret à observer de génération en génération.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Circumcision%20of%20Abraham%20%28Bible%20of%20Jean%20de%20Sy%29.jpg?width=1200",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Circumcision%20of%20Abraham%20%28Bible%20of%20Jean%20de%20Sy%29.jpg?width=1800",
              "source": "https://commons.wikimedia.org/wiki/File:Circumcision_of_Abraham_(Bible_of_Jean_de_Sy).jpg"
            },
            {
              "title": "Abraham Took Ishmael with All the Males Born in His House and Circumcised Them",
              "alt": "Abraham et les hommes de sa maison accomplissent la circoncision, signe de l’Alliance reçue de Dieu.",
              "details": "Gerard Hoet et atelier, Figures de la Bible, 1728.",
              "description": "Après la parole reçue vient l’acte. Cette image montre le passage de la promesse au signe visible : l’Alliance entre dans la chair et devient une pratique commune pour la maison d’Abraham.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Figures%20017%20Abraham%20Took%20Ishmael%20with%20All%20the%20Males%20Born%20in%20His%20House%20and%20Circumcised%20Them.jpg?width=1200",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Figures%20017%20Abraham%20Took%20Ishmael%20with%20All%20the%20Males%20Born%20in%20His%20House%20and%20Circumcised%20Them.jpg?width=1800",
              "source": "https://commons.wikimedia.org/wiki/File:Figures_017_Abraham_Took_Ishmael_with_All_the_Males_Born_in_His_House_and_Circumcised_Them.jpg"
            }
          ]
        }
      ],
      "paragraphs": [],
      "family": null,
      "entities": [
        {
          "term": "Abraham",
          "definition": "Patriarche avec lequel Dieu conclut ici une alliance et auquel il promet une descendance nombreuse."
        },
        {
          "term": "Abram",
          "definition": "Ancien nom d’Abraham, changé dans ce passage pour signifier une nouvelle étape de la promesse."
        }
      ],
      "cycleId": "abraham",
      "cycleIndex": 1,
      "reader": {
        "book": "Gen",
        "chapter": "17",
        "verse": "1"
      },
      "narrativeOrder": 17001
    },
    "genese-sodome": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "Dieu fait connaître à Abraham ce qu’il va faire",
          "range": "18,17–21",
          "marker": "17",
          "aria": "Genèse 18, verset 17",
          "text": "Le Seigneur s’était dit : « Est-ce que je vais cacher à Abraham ce que je veux faire ?"
        },
        {
          "type": "verse",
          "marker": "18",
          "aria": "Genèse 18, verset 18",
          "text": "Non, car Abraham doit devenir une nation grande et puissante, et toutes les nations de la terre doivent être bénies en lui."
        },
        {
          "type": "verse",
          "marker": "19",
          "aria": "Genèse 18, verset 19",
          "text": "En effet, je l’ai choisi pour qu’il ordonne à ses fils et à sa descendance de garder le chemin du Seigneur, en pratiquant la justice et le droit, afin que le Seigneur réalise ce qu’il avait promis en faveur d’Abraham. »"
        },
        {
          "type": "verse",
          "marker": "20",
          "aria": "Genèse 18, verset 20",
          "text": "Alors le Seigneur lui dit : « Comme elle est grande, la clameur qui monte de Sodome et de Gomorrhe ! Et leur faute, comme elle est lourde !"
        },
        {
          "type": "verse",
          "marker": "21",
          "aria": "Genèse 18, verset 21",
          "text": "Je veux descendre pour voir si leur conduite correspond à la clameur venue jusqu’à moi. Si c’est faux, je le reconnaîtrai. »"
        },
        {
          "type": "movementStart",
          "title": "Abraham demande que le juste ne périsse pas avec le pécheur",
          "range": "18,22–26",
          "marker": "22",
          "aria": "Genèse 18, verset 22",
          "text": "Les deux hommes se dirigèrent vers Sodome, tandis qu’Abraham demeurait devant le Seigneur."
        },
        {
          "type": "verse",
          "marker": "23",
          "aria": "Genèse 18, verset 23",
          "text": "Il s’avança et dit : « Vas-tu vraiment faire périr le juste avec le pécheur ?"
        },
        {
          "type": "verse",
          "marker": "24",
          "aria": "Genèse 18, verset 24",
          "text": "Peut-être y a-t-il cinquante justes dans la ville. Vas-tu vraiment les faire périr ? Est-ce que tu ne pardonneras pas à cause des cinquante justes qui sont dans la ville ?"
        },
        {
          "type": "verse",
          "marker": "25",
          "aria": "Genèse 18, verset 25",
          "text": "Quelle horreur, si tu faisais une chose pareille ! Faire mourir le juste avec le pécheur, traiter le juste de la même manière que le pécheur, quelle horreur ! Celui qui juge toute la terre va-t-il rendre une sentence contraire à la justice ? »"
        },
        {
          "type": "verse",
          "marker": "26",
          "aria": "Genèse 18, verset 26",
          "text": "Le Seigneur répondit : « Si je trouve cinquante justes dans Sodome, à cause d’eux je pardonnerai à toute la ville. »"
        },
        {
          "type": "movementStart",
          "title": "L’intercession : de cinquante justes à dix",
          "range": "18,27–32",
          "marker": "27",
          "aria": "Genèse 18, verset 27",
          "text": "Abraham reprit : « Oserai-je parler encore à mon Seigneur, moi qui suis poussière et cendre ?"
        },
        {
          "type": "verse",
          "marker": "28",
          "aria": "Genèse 18, verset 28",
          "text": "Peut-être, sur les cinquante justes, en manquera-t-il cinq : « Non, je ne la détruirai pas, si j’en trouve quarante-cinq. »"
        },
        {
          "type": "verse",
          "marker": "29",
          "aria": "Genèse 18, verset 29",
          "text": "Abraham insista : « Peut-être en trouvera-t-on seulement quarante ? » Le Seigneur répondit : « Pour quarante, je ne le ferai pas. »"
        },
        {
          "type": "verse",
          "marker": "30",
          "aria": "Genèse 18, verset 30",
          "text": "Abraham dit : « Que mon seigneur ne se mette pas en colère, si j’ose parler encore : peut-être y en aura-t-il seulement trente ? » Il répondit : « Si j’en trouve trente, je ne le ferai pas. »"
        },
        {
          "type": "verse",
          "marker": "31",
          "aria": "Genèse 18, verset 31",
          "text": "Abraham dit alors : « Oserai-je parler encore à mon Seigneur ? Peut-être en trouvera-t-on seulement vingt ? » Il répondit : « Pour vingt, je ne détruirai pas. »"
        },
        {
          "type": "verse",
          "marker": "32",
          "aria": "Genèse 18, verset 32",
          "text": "Il dit : « Que mon Seigneur ne se mette pas en colère : je ne parlerai plus qu’une fois. Peut-être en trouvera-t-on seulement dix ? » Et le Seigneur répondit : « Pour dix, je ne détruirai pas la ville de Sodome. »"
        },
        {
          "type": "movementStart",
          "title": "La fin de l’entretien",
          "range": "18,33",
          "marker": "33",
          "aria": "Genèse 18, verset 33",
          "text": "Quand le Seigneur eut fini de s’entretenir avec Abraham il partit, et Abraham retourna chez lui."
        },
        {
          "type": "pause",
          "reference": "ISAÏE 1,10.20",
          "title": "Pas d’amour sans justice",
          "text": "Écoutez la parole de Yahvé,<br>magistrats de Sodome,<br>prêtez l’oreille à l’enseignement de notre Dieu,<br>peuple de Gomorrhe !<br>Si vous refusez, si vous êtes rebelles,<br>par le glaive vous serez mangés."
        },
        {
          "type": "pause",
          "reference": "ISAÏE 57,16.18",
          "title": "Mais pas non plus de justice sans amour",
          "text": "Je n’incrimine pas à jamais,<br>je n’incrimine pas sans fin.<br>Je le guérirai, je le guiderai,<br>je le comblerai de consolations."
        },
        {
          "type": "pause",
          "reference": "PSAUME 86,5–7",
          "title": "La prière confiante",
          "text": "Toi, Seigneur, tu es bon et clément,<br>riche en fidélité pour tous ceux qui t’invoquent.<br>Yahvé, prête l’oreille à ma prière.<br>Au jour de ma détresse, je t’appelle,<br>car tu me réponds."
        },
        {
          "type": "gallery",
          "title": "Sodome en images",
          "artworks": [
            {
              "title": "Abraham and the Three Angels",
              "alt": "Abraham accueille les trois visiteurs près de sa demeure, au seuil du récit qui conduit à Sodome.",
              "details": "Giovanni Battista Tiepolo, première moitié du XVIIIe siècle, Museo del Prado, Madrid.",
              "description": "Cette scène replace l’intercession dans son contexte immédiat : avant de plaider pour Sodome, Abraham reçoit les visiteurs par lesquels Dieu entre en dialogue avec lui au chapitre 18.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Giovanni%20Battista%20Tiepolo%20-%20Abraham%20and%20the%20Three%20Angels%20-%20WGA22273.jpg?width=1200",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Giovanni%20Battista%20Tiepolo%20-%20Abraham%20and%20the%20Three%20Angels%20-%20WGA22273.jpg?width=1800",
              "source": "https://commons.wikimedia.org/wiki/File:Giovanni_Battista_Tiepolo_-_Abraham_and_the_Three_Angels_-_WGA22273.jpg"
            },
            {
              "title": "Abraham imploring God to spare Sodom and Gomorrah",
              "alt": "Abraham se prosterne et intercède auprès de Dieu afin qu’il épargne Sodome et Gomorrhe.",
              "details": "Étienne Delaune, 1550–1572, gravure, British Museum.",
              "description": "C’est l’image la plus directement liée au passage de Genèse 18,22–32 : Abraham se tient devant Dieu et plaide pour que le juste ne périsse pas avec le pécheur.",
              "src": "https://media.britishmuseum.org/media/Repository/Documents/2014_11/12_10/5fd419e5_d7fb_4445_b9d7_a3e100b18cbd/preview_00096680_001.jpg",
              "original": "https://media.britishmuseum.org/media/Repository/Documents/2014_11/12_10/5fd419e5_d7fb_4445_b9d7_a3e100b18cbd/preview_00096680_001.jpg",
              "source": "https://www.britishmuseum.org/collection/object/P_1834-0804-73"
            },
            {
              "title": "Destruction of Sodom and Gomorrah",
              "alt": "Une vision sombre et presque abstraite du châtiment de Sodome et Gomorrhe.",
              "details": "Henry Ossawa Tanner, 1929–1930, High Museum of Art, Atlanta.",
              "description": "Avec Tanner, la destruction n’est plus surtout narrative : elle devient vision spirituelle et bouleversement cosmique, comme si le jugement débordait toute représentation littérale.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Destruction%20of%20Sodom%20and%20Gomorrah%2C%20by%20Henry%20Ossawa%20Tanner%2C%201929-1930.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Destruction%20of%20Sodom%20and%20Gomorrah%2C%20by%20Henry%20Ossawa%20Tanner%2C%201929-1930.jpg?width=2200",
              "source": "https://commons.wikimedia.org/wiki/File:Destruction_of_Sodom_and_Gomorrah,_by_Henry_Ossawa_Tanner,_1929-1930.jpg"
            },
            {
              "title": "The Destruction of Sodom and Gomorrah",
              "alt": "Le cataclysme détruit la ville dans une vaste composition dramatique, tandis que les survivants fuient au premier plan.",
              "details": "John Martin, 1852, Laing Art Gallery, Newcastle upon Tyne.",
              "description": "Cette dernière image montre l’aboutissement spectaculaire du récit : après le dialogue sur la justice et la miséricorde, vient le moment du jugement qui s’abat sur la ville.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/John%20Martin%20-%20Sodom%20and%20Gomorrah.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/John%20Martin%20-%20Sodom%20and%20Gomorrah.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:John_Martin_-_Sodom_and_Gomorrah.jpg"
            }
          ]
        }
      ],
      "paragraphs": [],
      "family": null,
      "entities": [
        {
          "term": "Abraham",
          "definition": "Patriarche qui intercède ici pour Sodome en demandant que le juste ne soit pas traité comme le coupable."
        }
      ],
      "cycleId": "abraham",
      "cycleIndex": 2,
      "reader": {
        "book": "Gen",
        "chapter": "18",
        "verse": "17"
      },
      "narrativeOrder": 18017
    },
    "genese-sacrifice-isaac": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "L’épreuve impossible",
          "range": "22,1–2",
          "marker": "1",
          "aria": "Genèse 22, verset 1",
          "text": "Dieu mit Abraham à l’épreuve. Il lui dit : « Abraham ! » Celui-ci répondit : « Me voici ! »"
        },
        {
          "type": "verse",
          "marker": "2",
          "aria": "Genèse 22, verset 2",
          "text": "Dieu dit : « Prends ton fils, ton fils unique, celui que tu aimes, Isaac, va au pays de Moriah, et là tu l’offriras en sacrifice sur la montagne que je t’indiquerai. »"
        },
        {
          "type": "movementStart",
          "title": "La route vers Moriah",
          "range": "22,3–5",
          "marker": "3",
          "aria": "Genèse 22, verset 3",
          "text": "Abraham se leva de bon matin, sella son âne, et prit avec lui deux de ses serviteurs et son fils Isaac. Il fendit le bois pour le sacrifice, et se mit en route vers l’endroit que Dieu lui avait indiqué."
        },
        {
          "type": "verse",
          "marker": "4",
          "aria": "Genèse 22, verset 4",
          "text": "Le troisième jour, Abraham, levant les yeux, vit l’endroit de loin."
        },
        {
          "type": "verse",
          "marker": "5",
          "aria": "Genèse 22, verset 5",
          "text": "Abraham dit à ses serviteurs : « Restez ici avec l’âne. Moi et l’enfant nous irons jusque là-bas pour adorer, puis nous reviendrons vers vous. »"
        },
        {
          "type": "movementStart",
          "title": "« Tous deux ensemble »",
          "range": "22,6–8",
          "marker": "6",
          "aria": "Genèse 22, verset 6",
          "text": "Abraham prit le bois pour le sacrifice et le chargea sur son fils Isaac ; il prit le feu et le couteau, et tous deux s’en allèrent ensemble."
        },
        {
          "type": "verse",
          "marker": "7",
          "aria": "Genèse 22, verset 7",
          "text": "Isaac interrogea son père Abraham : « Mon père ! — Eh bien, mon fils ? » Isaac reprit : « Voilà le feu et le bois, mais où est l’agneau pour l’holocauste ? »"
        },
        {
          "type": "verse",
          "marker": "8",
          "aria": "Genèse 22, verset 8",
          "text": "Abraham répondit : « Dieu saura bien trouver l’agneau pour l’holocauste, mon fils », et ils s’en allèrent tous les deux ensemble."
        },
        {
          "type": "movementStart",
          "title": "Le geste arrêté",
          "range": "22,9–13",
          "marker": "9",
          "aria": "Genèse 22, verset 9",
          "text": "Ils arrivèrent à l’endroit que Dieu avait indiqué. Abraham y éleva l’autel et disposa le bois, puis il lia son fils Isaac et le mit sur l’autel, par-dessus le bois."
        },
        {
          "type": "verse",
          "marker": "10",
          "aria": "Genèse 22, verset 10",
          "text": "Abraham étendit la main et saisit le couteau pour immoler son fils."
        },
        {
          "type": "verse",
          "marker": "11",
          "aria": "Genèse 22, verset 11",
          "text": "Mais l’Ange du Seigneur l’appela du haut du ciel et dit : « Abraham ! Abraham ! » Il répondit : « Me voici ! »"
        },
        {
          "type": "verse",
          "marker": "12",
          "aria": "Genèse 22, verset 12",
          "text": "L’Ange lui dit : « Ne porte pas la main sur l’enfant ! Ne lui fais aucun mal ! Je sais maintenant que tu crains Dieu : tu ne m’as pas refusé ton fils, ton fils unique. »"
        },
        {
          "type": "verse",
          "marker": "13",
          "aria": "Genèse 22, verset 13",
          "text": "Abraham leva les yeux et vit un bélier, qui s’était pris les cornes dans un buisson. Il alla prendre le bélier et l’offrit en holocauste à la place de son fils."
        },
        {
          "type": "gallery",
          "title": "Le sacrifice d’Isaac en images",
          "artworks": [
            {
              "title": "Le Sacrifice d’Isaac",
              "alt": "Abraham tient Isaac près de l’autel tandis qu’un ange intervient pour empêcher le sacrifice.",
              "details": "Andrea del Sarto, vers 1527–1529, Staatliche Kunstsammlungen Dresden.",
              "description": "Andrea del Sarto déploie la tension entre le corps vulnérable d’Isaac, la décision d’Abraham et l’irruption de l’ange : toute la composition suspend le récit au moment où la mort cesse d’être possible.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Andrea_del_Sarto_-_Il_sacrificio_di_Isacco_%28Dresden%29.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Andrea_del_Sarto_-_Il_sacrificio_di_Isacco_%28Dresden%29.jpg?width=2200",
              "source": "https://commons.wikimedia.org/wiki/File:Andrea_del_Sarto_-_Il_sacrificio_di_Isacco_(Dresden).jpg"
            },
            {
              "title": "Le Sacrifice d’Isaac",
              "alt": "Abraham et Isaac sont arrêtés au moment du sacrifice par l’intervention de l’ange, dans une vaste composition vénitienne.",
              "details": "Paolo Veronese, 1586, Museo del Prado, Madrid.",
              "description": "Cette œuvre est celle signalée dans l’édition photographiée. Véronèse donne plus d’espace au décor et aux figures, mais conserve le même centre narratif : le geste d’Abraham est interrompu et Isaac est rendu à la vie ordinaire.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sacrifice_of_Isaac_%28Veronese%29.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sacrifice_of_Isaac_%28Veronese%29.jpg?width=2200",
              "source": "https://commons.wikimedia.org/wiki/File:Sacrifice_of_Isaac_(Veronese).jpg"
            },
            {
              "title": "Le Sacrifice d’Isaac",
              "alt": "L’ange retient brusquement la main d’Abraham au moment où celui-ci s’apprête à sacrifier Isaac.",
              "details": "Le Caravage, vers 1603, Galerie des Offices, Florence.",
              "description": "Caravage concentre toute la scène sur l’instant de l’interruption : le couteau est encore dans la main d’Abraham, tandis que l’ange arrête physiquement le geste et que le bélier apparaît déjà comme substitut.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sacrifice_of_Isaac-Caravaggio_%28Uffizi%29.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sacrifice_of_Isaac-Caravaggio_%28Uffizi%29.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Sacrifice_of_Isaac-Caravaggio_(Uffizi).jpg"
            },
            {
              "title": "The Sacrifice of Isaac",
              "alt": "Un ange saisit le bras d’Abraham dans une composition diagonale très dramatique, tandis qu’Isaac est couché sur l’autel.",
              "details": "Rembrandt, 1635, musée de l’Ermitage, Saint-Pétersbourg.",
              "description": "Chez Rembrandt, l’arrêt du sacrifice devient presque une collision : l’intervention de l’ange rompt le mouvement d’Abraham au dernier instant et fait tomber le couteau.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rembrandt_-_Sacrifice_of_Isaac_-_WGA19096.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rembrandt_-_Sacrifice_of_Isaac_-_WGA19096.jpg?width=2200",
              "source": "https://commons.wikimedia.org/wiki/File:Rembrandt_-_Sacrifice_of_Isaac_-_WGA19096.jpg"
            }
          ]
        },
        {
          "type": "omission",
          "text": "[…]"
        },
        {
          "type": "movementStart",
          "title": "La bénédiction renouvelée",
          "range": "22,15–17",
          "marker": "15–17",
          "aria": "Genèse 22, versets 15 à 17, extrait",
          "text": "Du ciel l’Ange du Seigneur appela une seconde fois Abraham : « Je le jure par moi-même, déclare le Seigneur : parce que tu as fait cela, parce que tu ne m’as pas refusé ton fils, ton fils unique, je te comblerai de bénédictions, je rendrai ta descendance aussi nombreuse que les étoiles du ciel et que le sable au bord de la mer, et ta descendance tiendra les places fortes de ses ennemis. […] »"
        },
        {
          "type": "pause",
          "reference": "ROMAINS 8,32",
          "title": "Un parallèle chrétien",
          "intro": "La note de l’édition rapproche la formule de Genèse 22 d’un passage de Paul :",
          "text": "« Lui n’a pas épargné son propre Fils, mais il l’a livré pour nous tous. »"
        },
        {
          "type": "pause",
          "reference": "HÉBREUX 11,17.19",
          "title": "Abraham relu comme figure de la foi",
          "intro": "La Lettre aux Hébreux relit l’épisode à partir de la confiance d’Abraham :",
          "text": "C’est par la foi qu’Abraham offrit Isaac, lorsqu’il fut mis à l’épreuve. […] Il pensait que Dieu est puissant, même pour ressusciter les morts."
        }
      ],
      "paragraphs": [],
      "family": {
        "title": "La lignée de la promesse",
        "levels": [
          [
            "Abraham + Sara"
          ],
          [
            "Isaac"
          ]
        ],
        "highlight": [
          "Isaac"
        ]
      },
      "entities": [
        {
          "term": "Abraham",
          "definition": "Patriarche mis à l’épreuve dans le récit ; il est le père d’Isaac."
        },
        {
          "term": "Isaac",
          "definition": "Fils d’Abraham et Sara, enfant de la promesse ; il est conduit sur la montagne mais le sacrifice est interrompu."
        }
      ],
      "cycleId": "abraham",
      "cycleIndex": 3,
      "reader": {
        "book": "Gen",
        "chapter": "22",
        "verse": "1"
      },
      "narrativeOrder": 22001
    },
    "genese-mort-abraham": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "La mort et la sépulture d’Abraham",
          "range": "25,8–10",
          "marker": "8",
          "aria": "Genèse 25, versets 8 à 10",
          "text": "Puis Abraham expira et mourut en heureuse vieillesse, âgé et rassasié de jours, et il fut réuni aux siens. Isaac et Ismaël ses fils, l’ensevelirent dans la grotte de Makpéla, dans le champ d’Ephrôn, fils de Sohar le Hittite, en face de Mambré, champ qu’Abraham avait acheté au fils de Het. Là fut enseveli Abraham ainsi que Sara, sa femme."
        },
        {
          "type": "movementStart",
          "title": "La bénédiction passe à Isaac",
          "range": "25,11",
          "marker": "11",
          "aria": "Genèse 25, verset 11",
          "text": "Or après la mort d’Abraham, Dieu bénit Isaac, son fils ; et Isaac habita près du puits de Lahaï Roï."
        }
      ],
      "paragraphs": [],
      "family": {
        "title": "Le passage de génération",
        "levels": [
          [
            "Abraham + Sara"
          ],
          [
            "Isaac"
          ]
        ],
        "highlight": [
          "Abraham",
          "Isaac"
        ]
      },
      "entities": [
        {
          "term": "Abraham",
          "definition": "Patriarche dont la mort clôt un grand cycle de la Genèse."
        },
        {
          "term": "Isaac",
          "definition": "Fils d’Abraham et Sara ; après la mort de son père, le récit dit que Dieu le bénit."
        },
        {
          "term": "Ismaël",
          "definition": "Fils d’Abraham et Agar ; il participe avec Isaac à l’ensevelissement de leur père."
        }
      ],
      "cycleId": "abraham",
      "cycleIndex": 4,
      "reader": {
        "book": "Gen",
        "chapter": "25",
        "verse": "8"
      },
      "narrativeOrder": 25008
    },
    "genese-jacob-esau-droit-ainesse": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "Rébecca, les jumeaux et l’oracle",
          "range": "25,19–23",
          "marker": "19",
          "aria": "Genèse 25, versets 19 à 23",
          "text": "Voici l’histoire d’Isaac, fils d’Abraham. Abraham engendra Isaac. Isaac était âgé de quarante ans quand il prit pour femme Rébecca, fille de Betouël, l’Araméen de Peddân-Aram, et sœur de l’Araméen Laban. Isaac implora Yahvé au sujet de sa femme, car elle était stérile ; Yahvé l’exauça et sa femme Rébecca conçut. Comme ses fils s’entrechoquaient dans son sein, elle dit : « S’il en est ainsi, pourquoi donc vivre ? », et elle alla consulter Yahvé. Yahvé lui dit :<br>« Il y a deux nations dans ton sein ;<br>deux peuples issus de tes entrailles se sépareront.<br>Un peuple sera plus fort que l’autre<br>et l’aîné servira le cadet. »"
        },
        {
          "type": "movementStart",
          "title": "Naissance de Jacob et d’Ésaü",
          "range": "25,24–28",
          "marker": "24",
          "aria": "Genèse 25, versets 24 à 28",
          "text": "Quand furent accomplis les jours où elle devait enfanter, voici qu’il y avait des jumeaux dans son sein. Le premier sortit : il était roux tout entier comme un manteau de poils ; on l’appela du nom d’Ésaü. Après cela sortit son frère, et sa main tenait le talon d’Ésaü ; on l’appela du nom de Jacob. Isaac était âgé de soixante ans à leur naissance.<br><br>Les garçons grandirent. Ésaü fut un habile chasseur, un homme des champs ; Jacob était un homme paisible habitant sous les tentes. Isaac aimait Ésaü, car le gibier était de son goût, mais Rébecca aimait Jacob."
        },
        {
          "type": "movementStart",
          "title": "Le droit d’aînesse contre un bouillon de lentilles",
          "range": "25,29–34",
          "marker": "29",
          "aria": "Genèse 25, versets 29 à 34",
          "text": "Comme Jacob préparait un bouillon, Ésaü rentra des champs, épuisé. Ésaü dit à Jacob : « Laisse-moi avaler de ce roux-là, car je suis épuisé. » Voilà pourquoi on l’a appelé du nom d’Edom. Jacob dit : « Vends-moi tout de suite ton droit d’aînesse. » Ésaü dit : « Voici que je vais mourir ; que m’importe le droit d’aînesse ? » Jacob dit : « Jure-le moi tout de suite ! » Il lui jura et vendit son droit d’aînesse à Jacob. Alors Jacob donna à Ésaü du pain et du bouillon de lentilles. Il mangea et but, se leva et partit. C’est ainsi qu’Ésaü méprisa le droit d’aînesse."
        },
        {
          "type": "gallery",
          "title": "Le droit d’aînesse en images",
          "artworks": [
            {
              "title": "Ésaü vend son droit d’aînesse à Jacob",
              "alt": "Ésaü, revenu de la chasse, reçoit le plat de lentilles tandis que Jacob et Rébecca sont assis à table.",
              "details": "D’après Maerten de Vos, gravure publiée aux XVIe–XVIIe siècles, Rijksmuseum.",
              "description": "La gravure met explicitement en scène la chasse, la faim et le repas : tout le récit de Genèse 25 se resserre autour du choix d’Ésaü.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Esau_verkoopt_zijn_eerstgeboorterecht_aan_Jakob,_RP-P-1976-30-35.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Esau_verkoopt_zijn_eerstgeboorterecht_aan_Jakob,_RP-P-1976-30-35.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Esau_verkoopt_zijn_eerstgeboorterecht_aan_Jakob,_RP-P-1976-30-35.jpg"
            },
            {
              "title": "Ésaü vend son droit d’aînesse à Jacob",
              "alt": "Jacob et Ésaü sont réunis autour du plat de lentilles qui scelle l’échange du droit d’aînesse.",
              "details": "Matthias Stom, vers 1630–1640.",
              "description": "La lumière concentre l’attention sur le marché entre les deux frères : la nourriture présente devient le prix d’un héritage futur.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Matteus_stom,_esa%C3%B9_che_vende_la_sua_primogenitura,_1630-40_ca.JPG?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Matteus_stom,_esa%C3%B9_che_vende_la_sua_primogenitura,_1630-40_ca.JPG?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Matteus_stom,_esa%C3%B9_che_vende_la_sua_primogenitura,_1630-40_ca.JPG"
            }
          ]
        }
      ],
      "paragraphs": [],
      "family": {
        "title": "Repère familial",
        "levels": [
          [
            "Abraham"
          ],
          [
            "Isaac + Rébecca"
          ],
          [
            "Ésaü · Jacob"
          ]
        ],
        "highlight": [
          "Ésaü",
          "Jacob"
        ]
      },
      "entities": [
        {
          "term": "Isaac",
          "definition": "Fils d’Abraham ; époux de Rébecca et père des jumeaux Ésaü et Jacob."
        },
        {
          "term": "Rébecca",
          "definition": "Épouse d’Isaac et mère d’Ésaü et Jacob ; l’oracle reçu pendant sa grossesse annonce l’inversion entre l’aîné et le cadet."
        },
        {
          "term": "Ésaü",
          "definition": "Fils aîné d’Isaac et Rébecca, frère jumeau de Jacob ; il cède ici son droit d’aînesse."
        },
        {
          "term": "Jacob",
          "definition": "Fils cadet d’Isaac et Rébecca ; il obtient le droit d’aînesse d’Ésaü et recevra plus tard le nom d’Israël."
        }
      ],
      "cycleId": "isaac-jacob",
      "cycleIndex": 0,
      "reader": {
        "book": "Gen",
        "chapter": "25",
        "verse": "19"
      },
      "narrativeOrder": 25019
    },
    "genese-benediction-jacob": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "Isaac veut bénir Ésaü",
          "range": "27,1–5",
          "marker": "1",
          "aria": "Genèse 27, versets 1 à 5",
          "text": "Isaac était devenu vieux, ses yeux avaient faibli et il n’y voyait plus. Il appela Ésaü son fils aîné : « Mon fils ! » Celui-ci répondit : « Me voici. » Isaac reprit : « Tu vois : je suis devenu vieux, mais je ne sais pas le jour de ma mort. Prends donc tes armes, ton carquois et ton arc, sors dans la campagne et tue-moi du gibier. Prépare-moi un des plats que j’aime et apporte-le-moi pour que je mange, et que je te bénisse avant de mourir. » Pendant qu’Isaac parlait ainsi à son fils Ésaü. Rébecca écoutait. Ésaü alla donc dans la campagne chasser du gibier pour son père."
        },
        {
          "type": "movementStart",
          "title": "Rébecca prépare la substitution",
          "range": "27,6–14",
          "marker": "6",
          "aria": "Genèse 27, versets 6 à 14",
          "text": "Rébecca dit à Jacob, son fils : « Voici que j’ai entendu ton père parler à Ésaü, ton frère, en ces termes : Apporte-moi du gibier et prépare-moi un régal, que je mange et que je te bénisse devant Yahvé avant ma mort. Maintenant donc, mon fils, écoute bien ce que je vais te commander. Va au troupeau et prends-moi de là deux beaux chevreaux, et j’en préparerai pour ton père un régal comme il aime. Tu l’apporteras à ton père et il mangera pour qu’il te bénisse avant sa mort. » Jacob dit à Rébecca sa mère : « Mais Ésaü, mon frère, est un homme velu, et moi je n’ai pas de poil. Peut-être mon père va-t-il me palper et je passerai à ses yeux pour un railleur, et je ferai venir sur moi une malédiction, et non une bénédiction. » Sa mère lui dit : « Ta malédiction, qu’elle soit sur moi ; écoute-moi seulement et va me prendre les chevreaux. » Il alla donc les prendre et les apporta à sa mère, qui en prépara un régal comme l’aimait son père."
        },
        {
          "type": "movementStart",
          "title": "Jacob prend l’apparence d’Ésaü",
          "range": "27,15–17",
          "marker": "15",
          "aria": "Genèse 27, versets 15 à 17",
          "text": "Rébecca prit les meilleurs habits d’Ésaü, son fils aîné, ceux qu’elle gardait à la maison ; elle en revêtit Jacob, son fils cadet. Puis, avec des peaux de chevreau, elle lui couvrit les mains et le cou. Elle lui remit ensuite le plat et le pain qu’elle avait préparés."
        },
        {
          "type": "movementStart",
          "title": "La voix de Jacob, les mains d’Ésaü",
          "range": "27,18–26",
          "marker": "16–26",
          "aria": "Genèse 27, versets 18 à 26",
          "text": "Jacob entra chez son père et lui dit : « Mon père ! » Celui-ci répondit : « Me voici. Qui es-tu, mon fils ? » Jacob dit à son père : « Je suis Ésaü, ton premier-né ; j’ai fait ce que tu m’as dit. Viens donc t’asseoir, mange de mon gibier, et tu me béniras. » Isaac lui dit : « Comme tu as trouvé vite, mon fils ! » Jacob répondit : « C’est que le Seigneur, ton Dieu, a favorisé ma chasse. » Isaac lui dit : « Approche donc, mon fils, que je te palpe, pour savoir si tu es bien mon fils Ésaü ! » Jacob s’approcha de son père. Celui-ci le palpa et dit : « La voix est celle de Jacob, mais les mains sont celles d’Ésaü. » Il ne reconnut pas Jacob car ses mains étaient velues comme celles de son frère Ésaü, et il le bénit. Il dit encore : « C’est bien toi mon fils Ésaü ? » Jacob répondit : « C’est bien moi. » Isaac reprit : « Apporte-moi le gibier, mon fils, je le mangerai et je te bénirai. » Jacob le servit, et il mangea. Jacob lui présenta du vin, et il but. Isaac dit alors : « Viens m’embrasser, mon fils. »"
        },
        {
          "type": "movementStart",
          "title": "La bénédiction",
          "range": "27,27–29",
          "marker": "27",
          "aria": "Genèse 27, versets 27 à 29",
          "text": "Comme Jacob venait l’embrasser, Isaac respira l’odeur de ses vêtements, et il le bénit en disant :<br>« Voici que l’odeur de mon fils<br>est comme l’odeur d’un champ que le Seigneur a béni.<br>Que Dieu te donne la rosée du ciel<br>et la fertilité de la terre,<br>froment et vin en abondance !<br>Que les nations te servent,<br>que les peuples se prosternent devant toi.<br>Sois un chef pour tes frères,<br>que les fils de ta mère se prosternent devant toi.<br>Maudit soit qui te maudira,<br>béni soit qui te bénira ! »"
        },
        {
          "type": "gallery",
          "title": "La bénédiction de Jacob en images",
          "artworks": [
            {
              "title": "Isaac bénit Jacob",
              "alt": "Isaac, assis, bénit Jacob agenouillé tandis que Rébecca se tient derrière lui.",
              "details": "Mosaïque, XIIe siècle, cathédrale de Monreale, Sicile.",
              "description": "C’est le motif reproduit dans l’édition photographiée : la main d’Isaac posée sur Jacob fait de la bénédiction le centre visible de la scène.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Isaak_gives_blessing_to_Jacob_(Monreale).jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Isaak_gives_blessing_to_Jacob_(Monreale).jpg?width=2200",
              "source": "https://commons.wikimedia.org/wiki/File:Isaak_gives_blessing_to_Jacob_(Monreale).jpg"
            },
            {
              "title": "Isaac, Jacob et Ésaü",
              "alt": "Isaac bénit Jacob tandis qu’Ésaü revient de la chasse à l’arrière-plan.",
              "details": "Haggadah dite « Sister Haggadah », XIVe siècle, British Library.",
              "description": "L’image rassemble en une seule scène la bénédiction obtenue par Jacob et le retour d’Ésaü, rendant visible la collision imminente entre les deux frères.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Isaac,_Jacob_and_Esau.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Isaac,_Jacob_and_Esau.jpg?width=2200",
              "source": "https://commons.wikimedia.org/wiki/File:Isaac,_Jacob_and_Esau.jpg"
            }
          ]
        }
      ],
      "paragraphs": [],
      "family": {
        "title": "Repère familial",
        "levels": [
          [
            "Abraham"
          ],
          [
            "Isaac + Rébecca"
          ],
          [
            "Ésaü · Jacob"
          ]
        ],
        "highlight": [
          "Isaac",
          "Rébecca",
          "Ésaü",
          "Jacob"
        ]
      },
      "entities": [
        {
          "term": "Isaac",
          "definition": "Père d’Ésaü et Jacob ; devenu vieux et aveugle, il veut transmettre sa bénédiction à son fils aîné."
        },
        {
          "term": "Rébecca",
          "definition": "Mère d’Ésaü et Jacob ; elle organise la substitution de Jacob à Ésaü."
        },
        {
          "term": "Ésaü",
          "definition": "Fils aîné d’Isaac ; la bénédiction qu’il attend est reçue par Jacob."
        },
        {
          "term": "Jacob",
          "definition": "Fils cadet d’Isaac ; déguisé en Ésaü, il reçoit la bénédiction paternelle."
        }
      ],
      "cycleId": "isaac-jacob",
      "cycleIndex": 1,
      "reader": {
        "book": "Gen",
        "chapter": "27",
        "verse": "1"
      },
      "narrativeOrder": 27001
    },
    "genese-songe-jacob": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "La nuit et l’échelle",
          "range": "28,10–12",
          "marker": "10",
          "aria": "Genèse 28, versets 10 à 12",
          "text": "Jacob était parti de Bershéba* et se dirigeait vers Harrane*. Surpris par le coucher du soleil, il s’arrêta à l’endroit où il était, pour y passer la nuit ; il prit une pierre pour la mettre sous sa tête, et c’est là qu’il dormit. Il eut un songe : une échelle était dressée sur la terre, et son sommet touchait le ciel ; des anges de Dieu montaient et descendaient."
        },
        {
          "type": "movementStart",
          "title": "La promesse renouvelée",
          "range": "28,13–15",
          "marker": "13",
          "aria": "Genèse 28, versets 13 à 15",
          "text": "Le Seigneur se tenait près de lui. Il lui dit : « Je suis le Seigneur, le Dieu d’Abraham ton père, le Dieu d’Isaac. La terre sur laquelle tu es couché, je te la donne, à toi et à tes descendants. Tes descendants seront nombreux comme la poussière du sol, ils se répandront à l’orient et à l’occident, au nord et au midi ; en toi et en ta descendance seront bénies toutes les familles de la terre. Voici que je suis avec toi ; je te garderai partout où tu iras et je te ramènerai sur cette terre ; car je ne t’abandonnerai pas avant d’avoir accompli ce que je t’ai promis. »"
        },
        {
          "type": "movementStart",
          "title": "« La maison de Dieu, la porte du ciel »",
          "range": "28,16–17",
          "marker": "16",
          "aria": "Genèse 28, versets 16 et 17",
          "text": "Jacob sortit de son sommeil et s’écria : « Vraiment, le Seigneur est dans ce lieu ! Et moi, je ne le savais pas. » Saisi de crainte, il disait : « Que ce lieu est redoutable ! Il est réellement la maison de Dieu, la porte du ciel ! »"
        },
        {
          "type": "movementStart",
          "title": "La pierre devient stèle, Louz devient Béthel",
          "range": "28,18–19",
          "marker": "19",
          "aria": "Genèse 28, versets 18 et 19",
          "text": "Jacob se leva de bon matin, il prit la pierre qu’il avait mise sous sa tête, il la dressa pour en faire une stèle, et il la consacra en versant de l’huile sur le sommet. Et à ce lieu, qui s’appelait alors Louz, il donna le nom de Béthel (c’est-à-dire : « Maison de Dieu »)."
        },
        {
          "type": "gallery",
          "title": "Le songe de Jacob en images",
          "artworks": [
            {
              "title": "Jacob’s Dream",
              "alt": "Jacob dort au premier plan tandis qu’une vaste construction en forme d’escalier conduit des anges vers Dieu.",
              "details": "Giorgio Vasari, 1558, Walters Art Museum, Baltimore.",
              "description": "Vasari donne au songe une architecture monumentale : la communication entre la terre et le ciel prend la forme d’un immense escalier Renaissance.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Giorgio_Vasari_II_-_Jacob's_Dream_-_Walters_372508.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Giorgio_Vasari_II_-_Jacob's_Dream_-_Walters_372508.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Giorgio_Vasari_II_-_Jacob's_Dream_-_Walters_372508.jpg"
            },
            {
              "title": "Jacob’s Ladder",
              "alt": "Jacob dort tandis que des anges apparaissent au-dessus de lui dans la vision de l’échelle.",
              "details": "Rembrandt, 1655.",
              "description": "Dans cette interprétation plus intime, le contraste entre le sommeil de Jacob et l’ouverture du ciel renforce l’idée d’une révélation qui survient sans être maîtrisée.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jacob's_Ladder,_1655.jpg?width=1200",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jacob's_Ladder,_1655.jpg?width=1800",
              "source": "https://commons.wikimedia.org/wiki/File:Jacob's_Ladder,_1655.jpg"
            },
            {
              "title": "Jacob’s Dream",
              "alt": "Jacob dort au pied d’une vision circulaire où des figures angéliques montent vers le ciel.",
              "details": "William Blake, vers 1805, British Museum, Londres.",
              "description": "Blake transforme l’échelle en une ascension lumineuse presque spiralée : la frontière entre ciel et terre devient mouvement continu.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Blake_jacobsladder.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Blake_jacobsladder.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Blake_jacobsladder.jpg"
            }
          ]
        }
      ],
      "paragraphs": [],
      "family": {
        "title": "Repère familial",
        "levels": [
          [
            "Abraham"
          ],
          [
            "Isaac + Rébecca"
          ],
          [
            "Jacob"
          ]
        ],
        "highlight": [
          "Jacob"
        ]
      },
      "entities": [
        {
          "term": "Jacob",
          "definition": "Fils d’Isaac et Rébecca ; en route vers Harrane, il reçoit à Béthel une vision et le renouvellement de la promesse."
        },
        {
          "term": "Abraham",
          "definition": "Grand-père de Jacob et premier patriarche de la lignée de la promesse."
        },
        {
          "term": "Isaac",
          "definition": "Père de Jacob ; Dieu se présente dans le songe comme le Dieu d’Abraham et d’Isaac."
        }
      ],
      "cycleId": "isaac-jacob",
      "cycleIndex": 2,
      "reader": {
        "book": "Gen",
        "chapter": "28",
        "verse": "10"
      },
      "narrativeOrder": 28010
    },
    "genese-combat-jacob": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "Jacob reste seul",
          "range": "32,23–26",
          "marker": "23",
          "aria": "Genèse 32, versets 23 à 26",
          "text": "Cette nuit-là, Jacob se leva, il prit ses deux femmes, ses deux servantes, ses onze enfants, et passa le gué du Yabboq. Il leur fit traverser le torrent et il fit passer aussi tout ce qui lui appartenait. Jacob resta seul. Or, quelqu’un lutta avec lui jusqu’au lever de l’aurore. L’homme, voyant qu’il ne pouvait pas le vaincre, le frappa au creux de la hanche, et la hanche de Jacob se démit pendant ce combat."
        },
        {
          "type": "movementStart",
          "title": "« Je ne te lâcherai que si tu me bénis »",
          "range": "32,27–30",
          "marker": "27",
          "aria": "Genèse 32, versets 27 à 30",
          "text": "L’homme lui dit : « Lâche-moi, car l’aurore s’est levée. » Jacob répondit : « Je ne te lâcherai que si tu me bénis. » L’homme lui demanda : « Quel est ton nom ? — Je m’appelle Jacob. — On ne t’appellera plus Jacob parce que tu as lutté contre Dieu comme on lutte contre des hommes, et tu as vaincu. » Jacob lui fit cette demande : « Révèle-moi ton nom, je t’en prie. » Mais il répondit : « Pourquoi me demandes-tu mon nom ? » Et à cet endroit il le bénit."
        },
        {
          "type": "movementStart",
          "title": "Pénouël : « Face de Dieu »",
          "range": "32,31–32",
          "marker": "32",
          "aria": "Genèse 32, versets 31 et 32",
          "text": "Jacob appela ce lieu Pénouël (ce qui signifie : « Face de Dieu »), car il disait : « J’ai vu Dieu face à face, et j’ai eu la vie sauve. » Au lever du soleil, il traversa le torrent à Pénouël. Il resta boiteux de la hanche."
        },
        {
          "type": "gallery",
          "title": "Le combat de Jacob en images",
          "artworks": [
            {
              "title": "La Lutte de Jacob avec l’Ange",
              "alt": "Jacob lutte corps à corps avec l’ange dans un vaste paysage, tandis que le jour se lève.",
              "details": "Eugène Delacroix, 1856–1861, église Saint-Sulpice, Paris.",
              "description": "Delacroix fait du combat une épreuve physique totale : les deux corps sont noués l’un à l’autre, mais la scène demeure ouverte sur un paysage immense et sur l’aurore.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Eug%C3%A8ne_Delacroix_%E2%80%94_Jacob_Wrestling_with_the_Angel.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Eug%C3%A8ne_Delacroix_%E2%80%94_Jacob_Wrestling_with_the_Angel.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Eug%C3%A8ne_Delacroix_%E2%80%94_Jacob_Wrestling_with_the_Angel.jpg"
            },
            {
              "title": "Jacob Wrestling with the Angel",
              "alt": "Jacob lutte avec un ange dans une illustration dramatique en noir et blanc.",
              "details": "Gustave Doré, XIXe siècle.",
              "description": "Doré accentue la disproportion entre Jacob et l’être qu’il affronte : la lutte humaine se mesure à une présence qui la dépasse tout en se laissant saisir.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jacob_Wrestling_with_the_Angel.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jacob_Wrestling_with_the_Angel.jpg?width=2200",
              "source": "https://commons.wikimedia.org/wiki/File:Jacob_Wrestling_with_the_Angel.jpg"
            }
          ]
        }
      ],
      "paragraphs": [],
      "family": {
        "title": "Repère familial",
        "levels": [
          [
            "Abraham"
          ],
          [
            "Isaac + Rébecca"
          ],
          [
            "Jacob → Israël"
          ]
        ],
        "highlight": [
          "Jacob",
          "Israël"
        ]
      },
      "entities": [
        {
          "term": "Jacob",
          "definition": "Patriarche qui lutte toute la nuit avec un mystérieux adversaire et reçoit le nom d’Israël."
        },
        {
          "term": "Israël",
          "definition": "Nom donné à Jacob après le combat ; il devient aussi le nom du peuple qui se réclame de sa descendance."
        }
      ],
      "cycleId": "isaac-jacob",
      "cycleIndex": 3,
      "reader": {
        "book": "Gen",
        "chapter": "32",
        "verse": "23"
      },
      "narrativeOrder": 32023
    },
    "genese-joseph-vendu-freres": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "La préférence de Jacob",
          "range": "37,3–4",
          "marker": "3",
          "aria": "Genèse 37, versets 3 et 4",
          "text": "Jacob aimait Joseph plus que tous ses autres enfants, parce qu’il était le fils de sa vieillesse, et il lui fit faire une tunique de grand prix. En voyant qu’il leur préférait Joseph, ses autres fils se mirent à détester celui-ci, et ils ne pouvaient plus lui dire que des paroles hostiles."
        },
        {
          "type": "movementStart",
          "title": "Le premier songe : les gerbes",
          "range": "37,5–8",
          "marker": "5",
          "aria": "Genèse 37, versets 5 à 8",
          "text": "Joseph eut un songe qu’il fit connaître à ses frères ; il leur dit : “Écoutez, je vous prie, ce songe que j’ai eu. Voici que nous étions à lier des gerbes au milieu des champs, et voici que ma gerbe se leva et elle tint debout, et voici que vos gerbes l’entourèrent et se prosternèrent devant ma gerbe.” Ses frères lui dirent : “Voudrais-tu donc régner sur nous en roi, ou bien nous dominer en maître ?” Et ils le haïrent encore plus à cause de ses songes et de ses paroles."
        },
        {
          "type": "movementStart",
          "title": "Le second songe : le soleil, la lune et les étoiles",
          "range": "37,9–11",
          "marker": "9",
          "aria": "Genèse 37, versets 9 à 11",
          "text": "Il eut encore un autre songe, qu’il raconta à ses frères ; il leur dit : “Voici que j’ai eu encore un songe. Voici que le soleil, la lune et onze étoiles se prosternaient devant moi.” Il raconta cela à son père et à ses frères, mais son père le réprimanda et lui dit : “Qu’est-ce que ce songe que tu as eu ? Nous faudra-t-il, moi, ta mère, et tes frères, venir nous prosterner à terre devant toi ?” Ses frères furent jaloux de lui, mais son père retint la chose."
        },
        {
          "type": "gallery",
          "title": "Des songes à la vente de Joseph",
          "artworks": [
            {
              "title": "Joseph racontant ses songes à ses parents et à ses frères",
              "alt": "Joseph raconte ses songes à sa famille réunie autour d’un lit.",
              "details": "Rembrandt, 1633, Rijksmuseum, Amsterdam.",
              "description": "Rembrandt choisit le moment de la parole : le songe n’est pas seulement une image intérieure, il devient un événement familial dès qu’il est raconté.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jozef%20vertelt%20zijn%20dromen%20aan%20zijn%20ouders%20en%20zijn%20broers%20Rijksmuseum%20SK-A-3477.jpeg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jozef%20vertelt%20zijn%20dromen%20aan%20zijn%20ouders%20en%20zijn%20broers%20Rijksmuseum%20SK-A-3477.jpeg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Jozef%20vertelt%20zijn%20dromen%20aan%20zijn%20ouders%20en%20zijn%20broers%20Rijksmuseum%20SK-A-3477.jpeg"
            },
            {
              "title": "Joseph vendu par ses frères",
              "alt": "Joseph est conduit vers les marchands après avoir été livré par ses frères.",
              "details": "Gustave Doré, 1866.",
              "description": "Doré dramatise la rupture fraternelle en isolant Joseph au milieu du groupe qui décide de son destin.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/026.Joseph%20Is%20Sold%20by%20His%20Brothers.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/026.Joseph%20Is%20Sold%20by%20His%20Brothers.jpg?width=2300",
              "source": "https://commons.wikimedia.org/wiki/File:026.Joseph%20Is%20Sold%20by%20His%20Brothers.jpg"
            },
            {
              "title": "Joseph vendu par ses frères",
              "alt": "Des marchands emmènent Joseph tandis que les chameaux et ses frères structurent la scène.",
              "details": "Eugène Leroux, d’après Alexandre-Gabriel Decamps, 1854, British Museum.",
              "description": "La scène insiste sur la dimension concrète de la vente : Joseph entre dans le mouvement d’une caravane qui l’emporte vers l’Égypte.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Joseph%20vendu%20par%20ses%20fr%C3%A8res%20(BM%201889,0608.420).jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Joseph%20vendu%20par%20ses%20fr%C3%A8res%20(BM%201889,0608.420).jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Joseph%20vendu%20par%20ses%20fr%C3%A8res%20(BM%201889,0608.420).jpg"
            }
          ]
        },
        {
          "type": "movementStart",
          "title": "Le complot contre Joseph",
          "range": "37,12–20",
          "marker": "12",
          "aria": "Genèse 37, versets 12 à 20",
          "text": "Ils étaient allés à Sichem* faire paître le troupeau de leur père. Celui-ci dit à Joseph : “Tes frères gardent le troupeau à Sichem ; je vais t’envoyer là-bas.” Joseph partit rejoindre ses frères qui se trouvaient alors à Dotân. Ils l’aperçurent de loin et, avant qu’il arrive près d’eux, ils complotèrent de le faire mourir. Ils se dirent l’un à l’autre : “Voilà l’homme aux songes qui arrive ! C’est le moment, allons-y, tuons-le, et jetons-le dans une de ces citernes. Nous raconterons qu’une bête féroce l’a dévoré, et on verra ce que voulaient dire ses songes !”"
        },
        {
          "type": "movementStart",
          "title": "Roubène veut le sauver",
          "range": "37,21–22",
          "marker": "21",
          "aria": "Genèse 37, versets 21 et 22",
          "text": "Mais Roubène les entendit, et voulut le sauver de leurs mains. Il leur dit : “Ne touchons pas à sa vie.” Et il ajouta : “Ne répandez pas son sang ; jetez-le dans cette citerne du désert, mais sans le frapper.” Il voulait le sauver de leurs mains et le ramener à son père."
        },
        {
          "type": "movementStart",
          "title": "Joseph vendu aux marchands",
          "range": "37,23–28",
          "marker": "23",
          "aria": "Genèse 37, versets 23 à 28",
          "text": "Dès que Joseph eut rejoint ses frères, ils le dépouillèrent de la tunique précieuse qu’il portait, ils se saisirent de lui et le jetèrent dans la citerne, qui était vide et sans eau. Ils s’assirent ensuite pour manger. En levant les yeux, ils virent une caravane d’Ismaélites* qui venait de Galaad. Leurs chameaux étaient chargés d’aromates, de baume et de myrrhe* qu’ils allaient livrer en Egypte. Alors Juda dit à ses frères : “Quel profit aurions-nous à tuer notre frère et à dissimuler sa mort ? Vendons-le plutôt aux Ismaélites et ne portons pas la main sur lui, car il est du même sang que nous, c’est notre frère.” Les autres l’écoutèrent. Quand la caravane arriva, ils retirèrent Joseph de la citerne, ils le vendirent pour vingt pièces d’argent aux Ismaélites, et ceux-ci l’emmenèrent en Egypte."
        },
        {
          "type": "movementStart",
          "title": "La tunique ensanglantée et le deuil de Jacob",
          "range": "37,31–35",
          "marker": "31",
          "aria": "Genèse 37, versets 31 à 35",
          "text": "Ils prirent la tunique de Joseph, égorgèrent un bouc et trempèrent la tunique dans le sang. Puis ils envoyèrent la tunique à longues manches et la firent parvenir à leur père en disant : “Voici ce que nous avons trouvé ; examine bien si c’est la tunique de ton fils ou non”. Il l’examina et dit : “La tunique de mon fils ! Une bête féroce l’a dévoré ! Oui, Joseph a été mis en pièces !” Jacob déchira ses habits, mit un sac sur ses reins et pendant de longs jours fit le deuil de son fils. Tous ses fils et toutes ses filles entreprirent de le consoler, mais il refusa de se consoler et il dit : “Non, c’est dans le deuil que je descendrai auprès de mon fils, au shéol*.” Et son père le pleura."
        },
        {
          "type": "movementStart",
          "title": "Joseph est vendu en Égypte",
          "range": "37,36",
          "marker": "36",
          "aria": "Genèse 37, verset 36",
          "text": "Quant aux Madianites, ils le vendirent en Egypte à Putiphar, eunuque de Pharaon, commandant des gardes."
        }
      ],
      "paragraphs": [],
      "family": {
        "title": "La famille de Joseph",
        "levels": [
          [
            "Abraham"
          ],
          [
            "Isaac + Rébecca"
          ],
          [
            "Jacob (Israël)"
          ],
          [
            "12 fils — dont Ruben · Juda · Joseph · Benjamin"
          ]
        ],
        "highlight": [
          "Joseph"
        ]
      },
      "entities": [
        {
          "term": "Jacob",
          "definition": "Père de Joseph et de ses frères ; sa préférence pour Joseph déclenche une part de la jalousie familiale."
        },
        {
          "term": "Joseph",
          "definition": "Fils de Jacob ; ses songes annoncent une élévation future avant qu’il soit vendu et conduit en Égypte."
        },
        {
          "term": "Roubène",
          "definition": "Fils aîné de Jacob ; il cherche à empêcher la mise à mort de Joseph et espère le ramener à son père."
        },
        {
          "term": "Juda",
          "definition": "Fils de Jacob ; il propose de vendre Joseph plutôt que de le tuer."
        }
      ],
      "cycleId": "joseph",
      "cycleIndex": 0,
      "reader": {
        "book": "Gen",
        "chapter": "37",
        "verse": "3"
      },
      "narrativeOrder": 37003
    },
    "genese-reves-pharaon-joseph": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "Le rêve des sept vaches",
          "range": "41,1–4",
          "marker": "1",
          "aria": "Genèse 41, versets 1 à 4",
          "text": "Or, au bout de deux ans, Pharaon eut un songe. Voici qu’il se tenait près du Nil, et voici que du Nil montaient sept vaches belles d’aspect et grasses de chair, qui se mirent à pâturer dans les joncs. Et voici que sept autres vaches montaient du Nil après elles, laides d’aspect et maigres de chair, et elles se tinrent à côté des autres vaches sur la rive du Nil. Et les vaches laides d’aspect et maigres de chair dévorèrent les sept vaches belles d’aspect et grasses. Alors Pharaon se réveilla."
        },
        {
          "type": "movementStart",
          "title": "Le rêve des sept épis",
          "range": "41,5–7",
          "marker": "5",
          "aria": "Genèse 41, versets 5 à 7",
          "text": "Il se rendormit et eut un second songe. Voici que sept épis montaient sur une même tige, gras et bons. Et voici que sept épis maigres et brûlés par le vent d’est poussaient auprès d’eux. Et les épis maigres engloutirent les sept épis gras et pleins. Alors Pharaon se réveilla, et voilà que c’était un songe !"
        },
        {
          "type": "movementStart",
          "title": "Le trouble de Pharaon",
          "range": "41,8",
          "marker": "8",
          "aria": "Genèse 41, verset 8",
          "text": "Or, au matin, l’esprit troublé, Pharaon envoya appeler tous les magiciens d’Egypte et tous ses sages, et il leur raconta le songe qu’il avait eu, mais personne ne put l’interpréter à Pharaon."
        },
        {
          "type": "gallery",
          "title": "Les rêves de Pharaon en images",
          "artworks": [
            {
              "title": "Le rêve de Pharaon",
              "alt": "Pharaon rêve des vaches grasses et maigres dans une miniature médiévale.",
              "details": "Haggadah dite « Sister Haggadah », XIVe siècle, British Library.",
              "description": "La miniature condense le rêve en une image narrative : le sommeil du souverain et les vaches appartiennent au même espace visuel.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pharao's%20dream.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pharao's%20dream.jpg?width=1900",
              "source": "https://commons.wikimedia.org/wiki/File:Pharao's%20dream.jpg"
            },
            {
              "title": "Joseph interprète le rêve de Pharaon",
              "alt": "Joseph explique à Pharaon la signification de son rêve devant la cour.",
              "details": "D’après Nicolas Poussin, XVIIe siècle, Statens Museum for Kunst.",
              "description": "L’image déplace l’attention du rêve à son interprétation : le centre de la scène devient la parole de Joseph devant le pouvoir royal.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Poussin%20-%20Joseph%20Interprets%20Pharaoh's%20Dream,%20KMSsp691.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Poussin%20-%20Joseph%20Interprets%20Pharaoh's%20Dream,%20KMSsp691.jpg?width=1590",
              "source": "https://commons.wikimedia.org/wiki/File:Poussin%20-%20Joseph%20Interprets%20Pharaoh's%20Dream,%20KMSsp691.jpg"
            },
            {
              "title": "Joseph interprète le rêve de Pharaon",
              "alt": "Joseph se tient devant Pharaon et sa cour pour expliquer les rêves du souverain.",
              "details": "Gustave Doré, 1866.",
              "description": "Doré met en scène l’écart de statut entre le prisonnier hébreu et le souverain : l’autorité de Joseph vient ici de sa capacité à donner sens au songe.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/027.Joseph%20Interprets%20Pharaoh's%20Dream.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/027.Joseph%20Interprets%20Pharaoh's%20Dream.jpg?width=2300",
              "source": "https://commons.wikimedia.org/wiki/File:027.Joseph%20Interprets%20Pharaoh's%20Dream.jpg"
            }
          ]
        },
        {
          "type": "movementStart",
          "title": "Joseph donne la clé des deux rêves",
          "range": "41,25–28",
          "marker": "25",
          "aria": "Genèse 41, versets 25 à 28",
          "text": "Joseph dit à Pharaon : “Le songe de Pharaon est un : Dieu a annoncé à Pharaon ce qu’il va faire. Les sept vaches belles sont sept années, les sept beaux épis sont sept années : c’est un seul songe. Les sept vaches minces et laides qui montaient après elles sont sept années, et les sept épis vides, brûlés par le vent d’est, ce seront sept années de famine. C’est la parole que j’ai dite à Pharaon : Dieu a fait voir à Pharaon ce qu’il va faire."
        },
        {
          "type": "movementStart",
          "title": "Sept années d’abondance, sept années de famine",
          "range": "41,29–32",
          "marker": "29",
          "aria": "Genèse 41, versets 29 à 32",
          "text": "Voici venir sept années de grande abondance dans tout le pays d’Egypte. Surgiront après elles sept années de famine : on oubliera toute l’abondance dans le pays d’Egypte, et la famine consumera le pays. On ne connaîtra plus l’abondance dans le pays, à cause de cette famine qui suivra ; car elle sera très grave. Et si le songe a été répété deux fois à Pharaon, c’est que la chose est bien décidée de la part de Dieu et que Dieu va se hâter de la faire."
        }
      ],
      "paragraphs": [],
      "family": {
        "title": "La famille de Joseph",
        "levels": [
          [
            "Abraham"
          ],
          [
            "Isaac + Rébecca"
          ],
          [
            "Jacob (Israël)"
          ],
          [
            "12 fils — dont Ruben · Juda · Joseph · Benjamin"
          ]
        ],
        "highlight": [
          "Joseph"
        ]
      },
      "entities": [
        {
          "term": "Pharaon",
          "definition": "Titre du souverain d’Égypte ; ses deux rêves ouvrent la voie à l’élévation de Joseph."
        },
        {
          "term": "Joseph",
          "definition": "Fils de Jacob conduit en Égypte ; il interprète les rêves de Pharaon comme l’annonce de sept années d’abondance puis de famine."
        }
      ],
      "cycleId": "joseph",
      "cycleIndex": 1,
      "reader": {
        "book": "Gen",
        "chapter": "41",
        "verse": "1"
      },
      "narrativeOrder": 41001
    },
    "genese-pardon-joseph": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "Joseph se fait reconnaître",
          "range": "45,1–3",
          "marker": "1",
          "aria": "Genèse 45, versets 1 à 3",
          "text": "Joseph ne put se contenir devant tous les gens de sa suite, et il s’écria : “Faites sortir tout le monde.” Quand il n’y eut plus personne auprès de lui, il se fit reconnaître de ses frères.<br><br>Il dit à ses frères : “Je suis Joseph ! Est-ce que mon père vit encore ?” Mais ses frères étaient incapables de lui répondre, tant ils étaient bouleversés de se trouver en face de lui."
        },
        {
          "type": "movementStart",
          "title": "« Je suis Joseph, votre frère »",
          "range": "45,4–5",
          "marker": "4",
          "aria": "Genèse 45, versets 4 et 5",
          "text": "Alors il leur dit : “Venez près de moi.” Ils s’approchèrent, et il leur dit : “Je suis Joseph, votre frère, que vous avez vendu pour qu’il soit emmené en Egypte. Mais maintenant ne vous affligez pas, et ne regrettez plus de m’avoir vendu, car c’est pour vous conserver la vie que Dieu m’a envoyé le premier."
        },
        {
          "type": "gallery",
          "title": "Joseph se fait reconnaître de ses frères",
          "artworks": [
            {
              "title": "Joseph révèle son identité à ses frères",
              "alt": "Joseph et ses frères se retrouvent dans une miniature médiévale de la Haggadah.",
              "details": "Sister Haggadah, XIVe siècle, British Library.",
              "description": "La miniature replace la scène dans une longue histoire juive de lecture et d’illustration du cycle de Joseph.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Joseph%20revealing%20himself%20to%20his%20brothers.jpg?width=1200",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Joseph%20revealing%20himself%20to%20his%20brothers.jpg?width=1600",
              "source": "https://commons.wikimedia.org/wiki/File:Joseph%20revealing%20himself%20to%20his%20brothers.jpg"
            },
            {
              "title": "Joseph se fait reconnaître de ses frères",
              "alt": "Joseph révèle son identité à ses frères dans une vaste composition de groupe.",
              "details": "Peter von Cornelius, 1816–1817, Alte Nationalgalerie, Berlin.",
              "description": "Cornelius donne à la reconnaissance une dimension théâtrale : les gestes des frères rendent visible le choc produit par la parole de Joseph.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Peter%20von%20Cornelius%20-%20Joseph%20gibt%20sich%20seinen%20Br%C3%BCdern%20zu%20erkennen%20-%20Google%20Art%20Project.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Peter%20von%20Cornelius%20-%20Joseph%20gibt%20sich%20seinen%20Br%C3%BCdern%20zu%20erkennen%20-%20Google%20Art%20Project.jpg?width=2400",
              "source": "https://commons.wikimedia.org/wiki/File:Peter%20von%20Cornelius%20-%20Joseph%20gibt%20sich%20seinen%20Br%C3%BCdern%20zu%20erkennen%20-%20Google%20Art%20Project.jpg"
            },
            {
              "title": "Joseph révèle son identité à ses frères",
              "alt": "Joseph accueille ses frères au moment où il leur révèle qui il est.",
              "details": "Gustave Doré, 1866.",
              "description": "Doré insiste sur le retournement de la situation : celui qui avait été rejeté est désormais en position de puissance, mais la scène s’oriente vers la reconnaissance plutôt que vers la vengeance.",
              "src": "https://commons.wikimedia.org/wiki/Special:Redirect/file/028.Joseph%20Reveals%20Himself%20to%20His%20Brothers.jpg?width=1400",
              "original": "https://commons.wikimedia.org/wiki/Special:Redirect/file/028.Joseph%20Reveals%20Himself%20to%20His%20Brothers.jpg?width=2300",
              "source": "https://commons.wikimedia.org/wiki/File:028.Joseph%20Reveals%20Himself%20to%20His%20Brothers.jpg"
            }
          ]
        },
        {
          "type": "movementStart",
          "title": "Sauver la vie pour une grande délivrance",
          "range": "45,6–8",
          "marker": "6",
          "aria": "Genèse 45, versets 6 à 8",
          "text": "Car voilà deux ans que la famine est à l’intérieur du pays, et il y aura encore cinq années sans labour ni moisson. Dieu m’a envoyé en avant de vous pour vous assurer un reste dans le pays et vous sauver la vie pour une grande délivrance. Ainsi donc, ce n’est pas vous qui m’avez envoyé ici, mais Dieu, et il m’a établi comme père pour Pharaon, comme maître de toute sa maison et gouverneur dans tout le pays d’Egypte."
        },
        {
          "type": "movementStart",
          "title": "Faire descendre Jacob en Égypte",
          "range": "45,9–13",
          "marker": "9",
          "aria": "Genèse 45, versets 9 à 13",
          "text": "Hâtez-vous donc de remonter auprès de mon père ; vous lui direz : Ainsi parle ton fils Joseph : ‘Dieu m’a établi comme maître de toute l’Egypte : descends auprès de moi, ne tarde pas. Tu habiteras dans le pays de Goshen, et tu seras près de moi, toi, tes fils, les fils de tes fils, ton petit et ton gros bétail, tout ce qui est à toi. Là, je pourvoirai à ta subsistance, car il y aura encore cinq années de famine — pour que tu ne tombes pas dans l’indigence, toi, ta famille et tout ce qui est à toi.’ Et voilà que vos yeux le voient, ainsi que les yeux de mon frère Benjamin : c’est bien ma bouche qui vous parle. Informez mon père de toute ma gloire et de tout ce que vous avez vu ; et hâtez-vous de faire descendre mon père ici.”"
        },
        {
          "type": "movementStart",
          "title": "Les larmes et l’embrassade",
          "range": "45,14–15",
          "marker": "14",
          "aria": "Genèse 45, versets 14 et 15",
          "text": "Alors, il se jeta au cou de Benjamin, son frère, et pleura. Benjamin aussi pleura à son cou. Puis il embrassa tous ses frères et pleura tout contre eux ; après quoi, ses frères parlèrent avec lui."
        }
      ],
      "paragraphs": [],
      "family": {
        "title": "La famille de Joseph",
        "levels": [
          [
            "Abraham"
          ],
          [
            "Isaac + Rébecca"
          ],
          [
            "Jacob (Israël)"
          ],
          [
            "12 fils — dont Ruben · Juda · Joseph · Benjamin"
          ]
        ],
        "highlight": [
          "Joseph",
          "Benjamin"
        ]
      },
      "entities": [
        {
          "term": "Joseph",
          "definition": "Fils de Jacob devenu puissant en Égypte ; il se fait reconnaître de ses frères et relit son histoire sous le signe d’une délivrance."
        },
        {
          "term": "Benjamin",
          "definition": "Plus jeune frère de Joseph ; sa présence joue un rôle décisif dans la réconciliation familiale."
        },
        {
          "term": "Pharaon",
          "definition": "Souverain d’Égypte auprès duquel Joseph exerce une autorité élevée."
        }
      ],
      "cycleId": "joseph",
      "cycleIndex": 2,
      "reader": {
        "book": "Gen",
        "chapter": "45",
        "verse": "1"
      },
      "narrativeOrder": 45001
    },
    "genese-juda-heriter-promesse": {
      "readingBlocks": [
        {
          "type": "movementStart",
          "title": "Hommage et puissance",
          "range": "49,8",
          "marker": "8",
          "aria": "Genèse 49, verset 8",
          "text": "« Juda, tes frères te rendront hommage,<br>ta main fera plier la nuque de tes ennemis<br>et les fils de ton père s’inclineront devant toi."
        },
        {
          "type": "movementStart",
          "title": "Juda, jeune lion",
          "range": "49,9",
          "marker": "9",
          "aria": "Genèse 49, verset 9",
          "text": "Juda mon fils est un jeune lion ;<br>il est revenu de la chasse ;<br>il s’est accroupi, il s’est couché comme un lion ;<br>ce fauve, qui le fera lever ?"
        },
        {
          "type": "movementStart",
          "title": "La royauté et le commandement",
          "range": "49,10",
          "marker": "10",
          "aria": "Genèse 49, verset 10",
          "text": "La royauté n’échappera point à Juda,<br>ni le commandement, à sa descendance,<br>jusqu’à ce que vienne celui à qui le pouvoir appartient,<br>à qui les peuples obéiront. »"
        }
      ],
      "paragraphs": [],
      "family": {
        "title": "De Jacob à Juda",
        "levels": [
          [
            "Abraham"
          ],
          [
            "Isaac + Rébecca"
          ],
          [
            "Jacob (Israël)"
          ],
          [
            "Juda · Joseph · leurs frères"
          ]
        ],
        "highlight": [
          "Juda"
        ]
      },
      "entities": [
        {
          "term": "Juda",
          "definition": "Fils de Jacob ; la bénédiction de Genèse 49 lui associe la royauté et une place majeure dans la tradition biblique."
        },
        {
          "term": "Jacob",
          "definition": "Père des douze fils ; à la fin de sa vie, il prononce sur eux des paroles de bénédiction et d’avenir."
        }
      ],
      "cycleId": "joseph",
      "cycleIndex": 3,
      "reader": {
        "book": "Gen",
        "chapter": "49",
        "verse": "8"
      },
      "narrativeOrder": 49008
    }
  }
};
})();
