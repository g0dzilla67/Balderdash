const screen = document.getElementById('screen');

let config = {
  nbJoueurs: 5,
  nbMaitres: 2,
};

let etape = 0;
let roles = [];
let mots = [
  "psittacisme", "escarcelle", "rodomontade", "hypogée", "mirliflore",
  "outrenoir", "dénoyauter", "carabistouille", "chafouin", "palimpseste"
];
let motChoisi = "";
let vraiMaitreIndex = -1;

function montrerAccueil() {
  screen.innerHTML = `
    <div class="card">
      <h2>Défi Définitions</h2>
      <label>Nombre de joueurs : <input type="number" id="nbJ" min="3" value="${config.nbJoueurs}" /></label>
      <label>Nombre de maîtres : <input type="number" id="nbM" min="1" value="${config.nbMaitres}" /></label>
      <button onclick="demarrerPartie()">Commencer</button>
    </div>
  `;
}

function demarrerPartie() {
  config.nbJoueurs = parseInt(document.getElementById('nbJ').value);
  config.nbMaitres = parseInt(document.getElementById('nbM').value);

  // Créer tableau de rôles
  roles = Array(config.nbJoueurs).fill("joueur");
  for (let i = 0; i < config.nbMaitres; i++) {
    roles[i] = "maitre";
  }

  // Mélanger rôles
  roles = roles.sort(() => Math.random() - 0.5);

  // Choisir un mot et le maître qui connaît la vraie définition
  motChoisi = mots[Math.floor(Math.random() * mots.length)];
  let maitresIndexes = roles
    .map((r, i) => (r === "maitre" ? i : null))
    .filter(i => i !== null);

  vraiMaitreIndex = maitresIndexes[Math.floor(Math.random() * maitresIndexes.length)];

  etape = 0;
  montrerTransition();
}

function montrerTransition() {
  if (etape >= config.nbJoueurs) return montrerVote();

  screen.innerHTML = `
    <div class="card">
      <h2>Joueur ${etape + 1}</h2>
      <p>Passe le téléphone.</p>
      <button onclick="montrerRole(${etape})">Voir ton rôle</button>
    </div>
  `;
}

function montrerRole(index) {
  const role = roles[index];
  let contenu = "";

  if (role === "joueur") {
    contenu = `
      <p>Tu es <strong>joueur</strong>.</p>
      <p>Mot : <strong>${motChoisi}</strong></p>
      <p>Prépare-toi à l'expliquer comme si tu savais !</p>
    `;
  } else if (index === vraiMaitreIndex) {
    contenu = `
      <p>Tu es <strong>le maître connaisseur</strong>.</p>
      <p>Mot : <strong>${motChoisi}</strong></p>
      <p>Tu es le seul à connaître la vraie définition.</p>
    `;
  } else {
    contenu = `
      <p>Tu es <strong>maître imposteur</strong>.</p>
      <p>Mot : <strong>${motChoisi}</strong></p>
      <p>Tu dois <em>inventer</em> une définition crédible.</p>
    `;
  }

  screen.innerHTML = `
    <div class="card">
      <h2>Joueur ${index + 1}</h2>
      ${contenu}
      <button onclick="suivant()">OK</button>
    </div>
  `;
}

function suivant() {
  etape++;
  montrerTransition();
}

function montrerVote() {
  screen.innerHTML = `
    <div class="card">
      <h2>Présentation terminée !</h2>
      <p>Maintenant, chaque joueur doit <strong>présenter sa définition à voix haute</strong>.</p>
      <p>Les joueurs votent ensuite pour celui qui dit la vérité !</p>
      <button onclick="montrerAccueil()">Rejouer</button>
    </div>
  `;
}

montrerAccueil();