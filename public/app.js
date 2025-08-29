// Synapse Soccer Prophet Application
class SynapseApp {
    constructor() {
        this.currentTab = 'predictions';
        this.data = {
            matches: [],
            leagues: [],
            standings: [],
            players: []
        };
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadData();
        this.renderContent();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-content`).classList.add('active');

        this.currentTab = tabName;
        this.renderContent();
    }

    async loadData() {
        try {
            const [matchesRes, leaguesRes, standingsRes, playersRes] = await Promise.all([
                fetch('/api/matches'),
                fetch('/api/leagues'),
                fetch('/api/standings'),
                fetch('/api/players')
            ]);

            this.data.matches = await matchesRes.json();
            this.data.leagues = await leaguesRes.json();
            this.data.standings = await standingsRes.json();
            this.data.players = await playersRes.json();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load application data');
        }
    }

    renderContent() {
        switch (this.currentTab) {
            case 'predictions':
                this.renderPredictions();
                break;
            case 'leagues':
                this.renderLeagues();
                break;
            case 'standings':
                this.renderStandings();
                break;
            case 'players':
                this.renderPlayers();
                break;
        }
    }

    renderPredictions() {
        const featuredMatches = this.data.matches.filter(match => match.featured);
        const allMatches = this.data.matches.filter(match => !match.featured);

        this.renderMatches('featured-matches', featuredMatches);
        this.renderMatches('all-matches', allMatches);
    }

    renderMatches(containerId, matches) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (matches.length === 0) {
            container.innerHTML = '<p class="text-white text-center col-span-full">No matches available</p>';
            return;
        }

        container.innerHTML = matches.map(match => `
            <div class="match-card floating">
                <div class="flex items-center justify-between mb-4">
                    <div class="team-logo">
                        ${match.homeTeam.substring(0, 3).toUpperCase()}
                    </div>
                    <div class="text-center relative">
                        <div class="vs-text">VS</div>
                        <div class="text-xs text-gray-500 mt-1">${match.date}</div>
                        <div class="text-xs text-gray-500">${match.time}</div>
                    </div>
                    <div class="team-logo">
                        ${match.awayTeam.substring(0, 3).toUpperCase()}
                    </div>
                </div>
                
                <div class="text-center mb-4">
                    <div class="text-sm font-semibold text-gray-800">${match.homeTeam}</div>
                    <div class="text-xs text-gray-400 font-medium my-1">versus</div>
                    <div class="text-sm font-semibold text-gray-800">${match.awayTeam}</div>
                </div>

                ${match.prediction ? `
                <div class="text-center mb-4">
                    <span class="prediction-badge">${match.prediction}</span>
                </div>
                ` : ''}

                <div class="flex justify-center mb-3">
                    <span class="odds-badge">
                        <i class="fas fa-chart-line mr-1"></i>
                        ODDS: ${match.odds}
                    </span>
                </div>

                <div class="text-center">
                    <div class="text-xs text-gray-500 font-medium">${match.league}</div>
                    ${match.confidence ? `<div class="text-xs text-green-600 font-semibold mt-1">
                        <i class="fas fa-star mr-1"></i>Confidence: ${match.confidence}%
                    </div>` : ''}
                </div>
            </div>
        `).join('');
    }

    renderLeagues() {
        const container = document.getElementById('leagues-list');
        if (!container) return;

        if (this.data.leagues.length === 0) {
            container.innerHTML = '<p class="text-white text-center col-span-full">No leagues available</p>';
            return;
        }

        container.innerHTML = this.data.leagues.map(league => `
            <div class="league-card">
                <div class="mb-3">
                    <div class="w-16 h-16 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
                        <i class="fas fa-futbol text-purple-600 text-2xl"></i>
                    </div>
                </div>
                <h4 class="font-bold text-lg mb-2">${league.name}</h4>
                <p class="text-gray-600 text-sm mb-2">${league.country}</p>
                <p class="text-xs text-gray-500">${league.teams} teams</p>
                <p class="text-xs text-gray-500">Season: ${league.season}</p>
            </div>
        `).join('');
    }

    renderStandings() {
        const container = document.getElementById('standings-table');
        if (!container) return;

        if (this.data.standings.length === 0) {
            container.innerHTML = '<p class="text-gray-600 text-center p-4">No standings available</p>';
            return;
        }

        container.innerHTML = `
            <table class="standings-table">
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Team</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GF</th>
                        <th>GA</th>
                        <th>GD</th>
                        <th>Pts</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.data.standings.map(team => `
                        <tr>
                            <td class="font-bold">${team.position}</td>
                            <td class="font-medium">${team.name}</td>
                            <td>${team.played}</td>
                            <td class="text-green-600">${team.won}</td>
                            <td class="text-yellow-600">${team.drawn}</td>
                            <td class="text-red-600">${team.lost}</td>
                            <td>${team.goalsFor}</td>
                            <td>${team.goalsAgainst}</td>
                            <td class="${team.goalDifference >= 0 ? 'text-green-600' : 'text-red-600'}">${team.goalDifference > 0 ? '+' : ''}${team.goalDifference}</td>
                            <td class="font-bold text-purple-600">${team.points}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    renderPlayers() {
        const container = document.getElementById('players-stats');
        if (!container) return;

        if (this.data.players.length === 0) {
            container.innerHTML = '<p class="text-white text-center col-span-full">No player statistics available</p>';
            return;
        }

        container.innerHTML = this.data.players.map(player => `
            <div class="player-card">
                <div class="flex items-center mb-3">
                    <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <i class="fas fa-user text-purple-600"></i>
                    </div>
                    <div>
                        <h4 class="font-bold">${player.name}</h4>
                        <p class="text-sm text-gray-600">${player.position}</p>
                        <p class="text-xs text-gray-500">${player.team}</p>
                    </div>
                </div>
                
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-sm">Goals:</span>
                        <span class="font-bold text-purple-600">${player.goals}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-sm">Assists:</span>
                        <span class="font-bold text-purple-600">${player.assists}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-sm">Apps:</span>
                        <span class="font-bold text-purple-600">${player.appearances}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-sm">Rating:</span>
                        <span class="font-bold text-green-600">${player.rating}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Calculator functions
function calculateWinnings() {
    const stake = parseFloat(document.getElementById('stake').value) || 0;
    const odds = parseFloat(document.getElementById('odds').value) || 0;
    
    if (stake <= 0 || odds <= 0) {
        document.getElementById('calculator-result').textContent = 'Please enter valid stake and odds';
        return;
    }
    
    const winnings = (stake * odds).toFixed(2);
    const profit = (winnings - stake).toFixed(2);
    
    document.getElementById('calculator-result').innerHTML = `
        <div>Total Return: $${winnings}</div>
        <div>Profit: $${profit}</div>
    `;
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SynapseApp();
});
