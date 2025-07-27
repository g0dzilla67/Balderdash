
const screen = document.getElementById('screen');

let config = {
  players: 5,
  masters: 1,
  time: 30,
  wordList: [],
};

let roles = [];
let currentPlayer = 1;
let definitions = {};

const defaultWords = [
  'Concupiscent',
  'Fumivore',
  'Épistolaire',
  'Zinzolin',
  'Dénoyauteur',
  'Streptopelia',
  'Cacographie',
  'Borborygme'
];

function showHome() {
  screen.innerHTML = `
    <h2>Configurer la partie</h2>
    <label>Nombre de joueurs<br><input type="number" id="nbPlayers" value="${config.players}" min="3" /></label><br>
    <label>Nombre de maîtres<br><input type="number" id="nbMasters" value="${config.masters}" min="1" /></label><br>
    <label>Temps pour chaque définition (s)<br><input type="number" id="timePerPlayer" value="${config.time}" min="10" /></label><br>
    <button onclick="startGame()">Lancer</button>
    <hr>
    <button onclick="importWords()">Importer une liste JSON</button>
    <button onclick="exportWords()">Exporter la liste</button>
  `;
}

function startGame() {
  config.players = parseInt(document.getElementById('nbPlayers').value);
  config.masters = parseInt(document.getElementById('nbMasters').value);
  config.time = parseInt(document.getElementById('timePerPlayer').value);
  roles = Array(config.players).fill('joueur');
  for (let i = 0; i < config.masters; i++) roles[i] = 'maître';
  shuffleArray(roles);
  config.wordList = config.wordList.length ? config.wordList : defaultWords;
  config.word = config.wordList[Math.floor(Math.random() * config.wordList.length)];
  definitions = {};
  currentPlayer = 1;
  showPassScreen();
}

function showPassScreen() {
  if (currentPlayer > config.players) return showSummary();
  screen.innerHTML = `
    <h2>Joueur ${currentPlayer}</h2>
    <p>Appuie pour voir ton rôle</p>
    <button onclick="revealRole()">Voir mon rôle</button>
  `;
}

function revealRole() {
  const role = roles[currentPlayer - 1];
  const isMaster = role === 'maître';
  screen.innerHTML = `
    <h2>${isMaster ? 'Tu es le Maître' : 'Tu es un Joueur'}</h2>
    <p>${isMaster ? 'Ne regarde pas le mot !' : 'Mot : <b>' + config.word + '</b>'}</p>
    ${isMaster ? '' : '<textarea id="defInput" placeholder="Entre ta définition"></textarea>'}
    <button onclick="nextPlayer()">Passer au suivant</button>
  `;
}

function nextPlayer() {
  const role = roles[currentPlayer - 1];
  if (role !== 'maître') {
    const val = document.getElementById('defInput').value.trim();
    definitions['Joueur ' + currentPlayer] = val || '[aucune définition]';
  }
  currentPlayer++;
  showPassScreen();
}

function showSummary() {
  screen.innerHTML = `<h2>Phase de vote</h2><p>Voici les définitions (anonymes) :</p><ul>
    ${Object.values(definitions).map(d => `<li>${d}</li>`).join('')}
  </ul>
  <p>Les maîtres votent maintenant avec les doigts 👆</p>
  <button onclick="showHome()">Retour au menu</button>`;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function importWords() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        config.wordList = JSON.parse(e.target.result);
        alert('Liste importée');
      } catch {
        alert('Erreur dans le JSON');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function exportWords() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config.wordList));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', 'mots.json');
  link.click();
}

showHome();

