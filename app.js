const screen = document.getElementById('screen');

let config = {
  nbJoueurs: 5,
  nbMaitres: 1,
  tempsVision: 10,
};

let etape = 0;
let roles = [];
let mots = [
  "flandrin", "psittacisme", "escarcelle", "hypogée", "outrenoir",
  "carabistouille", "chafouin", "dénoyauter", "rodomontade", "mirliflore"
];
let motChoisi = "";

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
  roles = Array(config.nbJoueurs).fill("joueur");
  for (let i = 0; i < config.nbMaitres; i++) {
    roles[i] = "maitre";
  }
  roles = roles.sort(() => Math.random() - 0.5);
  motChoisi = mots[Math.floor(Math.random() * mots.length)];
  etape = 0;
  montrerTransition();
}

function montrerTransition() {
  if (etape >= config.nbJoueurs) return montrerVote();
  screen.innerHTML = `
    <div class="card">
      <h2>Joueur ${etape + 1}</h2>
      <p>Passe le téléphone.</p>
      <button onclick="montrerRole(${etape})">Voir ton mot</button>
    </div>
  `;
}

function montrerRole(index) {
  let role = roles[index];
  screen.innerHTML = `
    <div class="card">
      <h2>Joueur ${index + 1}</h2>
      <p>Tu es <strong>${role === "maitre" ? "le maître" : "un joueur"}</strong>.</p>
      ${role === "joueur" ? `<p>Mot : <strong>${motChoisi}</strong></p>` : `<p>Tu ne connais pas le mot. Tu devras deviner la bonne définition !</p>`}
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
      <h2>Fin de la distribution</h2>
      <p>Chaque joueur invente une définition à voix haute !</p>
      <p>Les maîtres doivent voter pour la plus crédible.</p>
      <button onclick="montrerAccueil()">Rejouer</button>
    </div>
  `;
}

montrerAccueil();