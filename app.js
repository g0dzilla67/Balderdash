// Liste de mots + vraie définitions
const dict = [
  { mot: "Dénoyauter", definition: "Enlever le noyau d’un fruit." },
  { mot: "Myrmidon", definition: "Personne insignifiante, sans valeur." },
  { mot: "Cacographie", definition: "Mauvaise écriture." },
  { mot: "Obombrer", definition: "Couvrir d’ombre, assombrir." },
  { mot: "Tautochrone", definition: "Courbe parcourue en un temps identique." }
];

let joueurs = [], idxJ = 0, chronoID = null;

// Éléments DOM
const cfg  = document.getElementById("config");
const rs   = document.getElementById("roleScreen");
const ps   = document.getElementById("presScreen");
const es   = document.getElementById("endScreen");
const btnStart   = document.getElementById("btnStart");
const btnVoir    = document.getElementById("btnVoir");
const btnSuivant = document.getElementById("btnSuivant");
const btnLancer  = document.getElementById("btnLancer");
const btnRestart = document.getElementById("btnRestart");

// Démarrage
btnStart.onclick = () => {
  const n = parseInt(document.getElementById("nbJoueurs").value);
  const t = parseInt(document.getElementById("tempsSec").value);
  if (n < 3) return alert("Au moins 3 joueurs requi’s");
  // Crée tableau de rôles
  joueurs = Array.from({length:n}, (_,i) => ({id:i+1,role:""}));
  // Désigne maître & malin
  const m = Math.floor(Math.random()*n);
  let f; do { f = Math.floor(Math.random()*n); } while(f===m);
  joueurs[m].role = "maitre";
  joueurs[f].role = "malin";
  // Les autres = fourbes
  joueurs.forEach(p => { if(!p.role) p.role="fourbe" });
  // Choisit mot
  const wd = dict[Math.floor(Math.random()*dict.length)];
  joueurs.forEach(p => { p.mot = wd.mot; p.def = (p.role==="malin"? wd.definition : null) });
  // Prépare 1er joueur
  idxJ = 0;
  cfg.classList.add("hidden");
  showRoleScreen();
};

// Affiche rôle
function showRoleScreen(){
  const p = joueurs[idxJ];
  document.getElementById("txtJoueur").innerText = `Joueur ${p.id}, à toi :`;
  document.getElementById("roleInfo").classList.add("hidden");
  btnVoir.classList.remove("hidden");
  rs.classList.remove("hidden");
}

// Voir rôle
btnVoir.onclick = () => {
  const p = joueurs[idxJ];
  let txt = "";
  if (p.role==="maitre")  txt = "Tu es LE MAÎTRE.\nTu ne connais ni mot ni définition.";
  if (p.role==="malin")   txt = `Tu es l’influenceur MALIN.\nMot : ${p.mot}\nDéfinition : ${p.def}`;
  if (p.role==="fourbe")  txt = `Tu es un influenceur FOURBE.\nMot : ${p.mot}\nInvente une définition !`;
  document.getElementById("txtRole").innerText = txt;
  document.getElementById("roleInfo").classList.remove("hidden");
  btnVoir.classList.add("hidden");
};

// Joueur suivant
btnSuivant.onclick = () => {
  idxJ++;
  rs.classList.add("hidden");
  if (idxJ < joueurs.length) {
    showRoleScreen();
  } else {
    idxJ = 0;
    rs.classList.add("hidden");
    startPresentation();
  }
};

// Phase présentation
function startPresentation(){
  ps.classList.remove("hidden");
  document.getElementById("txtPres").innerText = `Joueur ${joueurs[idxJ].id}, présente !`;
  document.getElementById("motPres").innerText = `Mot : ${joueurs[idxJ].mot}`;
  document.getElementById("chrono").innerText = document.getElementById("tempsSec").value;
}

// Lance le chrono
btnLancer.onclick = () => {
  let t = parseInt(document.getElementById("tempsSec").value);
  btnLancer.disabled = true;
  document.getElementById("chrono").innerText = t;
  chronoID = setInterval(()=>{
    t--;
    document.getElementById("chrono").innerText = t;
    if (t<=0) {
      clearInterval(chronoID);
      idxJ++;
      if (idxJ<joueurs.length) {
        btnLancer.disabled = false;
        startPresentation();
      } else {
        ps.classList.add("hidden");
        es.classList.remove("hidden");
      }
    }
  },1000);
};

// Rejouer
btnRestart.onclick = () => location.reload();