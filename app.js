const mots = [
  { mot: "Myrmidon", definition: "Personne insignifiante, sans valeur." },
  { mot: "Obombrer", definition: "Couvrir d’ombre, assombrir." },
  { mot: "Cacographie", definition: "Mauvaise écriture ou écriture incorrecte." },
  { mot: "Déréliction", definition: "État d’abandon, de solitude morale." },
  { mot: "Tautochrone", definition: "Courbe parcourue en un temps identique." }
];

let joueurs = [];
let joueurActuel = 0;
let tempsRestant = 30;
let timer;

function demarrerJeu() {
  const nb = parseInt(document.getElementById('nbJoueurs').value);
  const temps = parseInt(document.getElementById('tempsParJoueur').value);
  tempsRestant = temps;

  const motChoisi = mots[Math.floor(Math.random() * mots.length)];

  const roles = Array(nb).fill('fourbe');
  const idxMaitre = Math.floor(Math.random() * nb);
  roles[idxMaitre] = 'maitre';

  let idxMalin;
  do {
    idxMalin = Math.floor(Math.random() * nb);
  } while (idxMalin === idxMaitre);
  roles[idxMalin] = 'malin';

  joueurs = roles.map((role, i) => ({
    id: i + 1,
    role: role,
    mot: motChoisi.mot,
    definition: role === 'malin' ? motChoisi.definition : null
  }));

  document.getElementById('config').classList.add('hidden');
  afficherJoueur();
}

function afficherJoueur() {
  if (joueurActuel >= joueurs.length) {
    document.getElementById('roleDisplay').classList.add('hidden');
    document.getElementById('compteur').classList.add('hidden');
    document.getElementById('finJeu').classList.remove('hidden');
    return;
  }

  document.getElementById('roleDisplay').classList.remove('hidden');
  document.getElementById('infosRole').classList.add('hidden');
  document.getElementById('nomJoueur').textContent = `Joueur ${joueurs[joueurActuel].id}, prépare-toi !`;
}

function voirRole() {
  const joueur = joueurs[joueurActuel];
  let texte = "";

  if (joueur.role === "maitre") {
    texte = "Tu es le MAÎTRE.\nTu ne vois ni mot ni définition.";
  } else if (joueur.role === "malin") {
    texte = `Tu es l'influenceur malin !\nMot : ${joueur.mot}\nDéfinition : ${joueur.definition}`;
  } else {
    texte = `Tu es un influenceur fourbe !\nMot : ${joueur.mot}\nInvente une définition convaincante.`;
  }

  document.getElementById('affichageRole').textContent = texte;
  document.getElementById('infosRole').classList.remove('hidden');
}

function terminerJoueur() {
  document.getElementById('roleDisplay').classList.add('hidden');
  lancerChrono();
}

function lancerChrono() {
  document.getElementById('compteur').classList.remove('hidden');
  document.getElementById('chrono').textContent = tempsRestant;
  let temps = tempsRestant;

  timer = setInterval(() => {
    temps--;
    document.getElementById('chrono').textContent = temps;
    if (temps <= 0) {
      clearInterval(timer);
      document.getElementById('compteur').classList.add('hidden');
      joueurActuel++;
      afficherJoueur();
    }
  }, 1000);
}