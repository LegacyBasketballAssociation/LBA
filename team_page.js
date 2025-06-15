// Parse the query param — your URLs are like team_page.html?TeamName
    const query = window.location.search.substring(1);
    const teamId = query || null;

    // Team data
    const teams = {
      ColumbusRiverhawks: {
        name: "Columbus Riverhawks",
        owner: "Kay Rivers",
        color: "#684428",
        logo: "https://drive.google.com/thumbnail?id=1E-WHv0i16L6ViK2AhLsY3tyduxo7j2nS&sz=w250-h180",
        dataRow: 15,
        dataRow2: 19,
        dataRow3: 10,
        dataRow4: 33,
        dataRow5: 14
      },
      DallasSteers: {
        name: "Dallas Steers",
        owner: "Keyon Hens",
        color: "silver",
        logo: "https://drive.google.com/thumbnail?id=1pIxyc3TwFKx0fEkhk7Tyc_ae4E0kRiuk&sz=w250-h180",
        dataRow: 13,
        dataRow2: 7,
        dataRow3: 8,
        dataRow4: 17,
        dataRow5: 43
      },
      DenverMountaineers: {
        name: "Denver Mountaineers",
        owner: "Hunter Jackson",
        color: "#E1A80E",
        logo: "https://drive.google.com/thumbnail?id=1wkB6z3U6EwTGnYjad__52dR84KWMloL2&sz=w250-h180",
        dataRow: 1,
        dataRow2: 31,
        dataRow3: 21,
        dataRow4: 22,
        dataRow5: 9
      },
      MaineMobsters: {
        name: "Maine Mobsters",
        owner: "AK Abass",
        color: "gold",
        logo: "https://drive.google.com/thumbnail?id=1qZk64ky90r0Ddg_uhH7NOPQg5-vSHDjZ&sz=w250-h180",
        dataRow: 34,
        dataRow2: 29,
        dataRow3: 20,
        dataRow4: 27,
        dataRow5: 50
      },
      MiamiViceSinners: {
        name: "Miami Vice Sinners",
        owner: "Kenan Kurt",
        color: "pink",
        logo: "https://drive.google.com/thumbnail?id=1qUSjUwrpWiHvExokwTkJWDCR0TZ9hlwT&sz=w250-h180",
        dataRow: 2,
        dataRow2: 6,
        dataRow3: 38,
        dataRow4: 40,
        dataRow5: 36
      },
      NewYorkCitySlickers: {
        name: "New York City Slickers",
        owner: "Maverick Doncic",
        color: "#263D4E",
        logo: "https://drive.google.com/thumbnail?id=1N0ZekAA21kXlQ9tnbyAseBePJJw79vy2&sz=w250-h180",
        dataRow: 18,
        dataRow2: 31,
        dataRow3: 25,
        dataRow4: 37,
        dataRow5: 45
      },
      PhoenixHeat: {
        name: "Phoenix Heat",
        owner: "Razor Blades",
        color: "orange",
        logo: "https://drive.google.com/thumbnail?id=1h-vWWI_naDdsmKz2lsvfsPgFowBJQIWO&sz=w250-h180",
        dataRow: 3,
        dataRow2: 26,
        dataRow3: 24,
        dataRow4: 23,
        dataRow5: 12
      },
      UtahRaptors: {
        name: "Utah Raptors",
        owner: "King Beowulf",
        color: "antiquewhite",
        logo: "https://drive.google.com/thumbnail?id=1zRbm7lk35HC9XMiOBEUhcBc_UMMhZ7t5&sz=w250-h180",
        dataRow: 4,
        dataRow2: 39,
        dataRow3: 30,
        dataRow4: 5,
        dataRow5: 35
      }
    };

    // Function to fetch and parse CSV data
    function fetchRosterData() {
      const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQJJKiG4UE5nmSlrtKQ79eKhNaxqnWEUpwKMlOrmiCgRSBe9uFsJ1ywQGCkaNnt5BwfwySEcWzuEZpq/pub?gid=408327260&single=true&output=csv';
      
      Papa.parse(csvUrl, {
        download: true,
        header: false,
        complete: function(results) {
          if (teamId && teams[teamId]) {
            const team = teams[teamId];
            const rosterBody = document.getElementById('rosterBody');
            const statsBody = document.getElementById('statsBody');
            rosterBody.innerHTML = '';
            statsBody.innerHTML = '';
            
            // Process all players (up to 5)
            const playerRows = [
              team.dataRow,
              team.dataRow2,
              team.dataRow3,
              team.dataRow4,
              team.dataRow5
            ];
            
            // Array to hold player data for sorting
            const players = [];
            
            playerRows.forEach(rowIndex => {
              if (rowIndex !== undefined && results.data.length > rowIndex) {
                const rowData = results.data[rowIndex];
                const playerName = rowData[0] || 'N/A';
                const height = rowData[1] || 'N/A';
                const weight = rowData[2] || 'N/A';
                const wingspan = rowData[3] || 'N/A';
                
                addPlayerToRoster(playerName, height, weight, wingspan, team.color, team);
                
                // Add player to array for stats table
                players.push({
                  name: playerName,
                  // These stats would normally come from your data source
                  // For now we'll leave them empty as requested
                  ppg: '',
                  rpg: '',
                  apg: '',
                  spg: '',
                  bpg: '',
                  tov: '',
                  fg: '',
                  threeP: '',
                  ft: '',
                  orpg: '',
                  drpg: '',
                  fpg: '',
                  plusMinus: '',
                  prf: '',
                  teamColor: team.color
                });
              } else if (rowIndex !== undefined) {
                console.error(`Row ${rowIndex + 1} data not found for ${team.name}`);
              }
            });
            
            // Sort players by PPG (highest first)
            players.sort((a, b) => {
              // Since we're using empty strings for now, this won't actually sort
              // In a real implementation, you would compare the numeric values
              return 0;
            });
            
            // Add players to stats table
            players.forEach(player => {
              addPlayerToStats(player);
            });
          }
        },
        error: function(error) {
          console.error('Error loading CSV:', error);
          if (teamId && teams[teamId]) {
            const rosterBody = document.getElementById('rosterBody');
            const statsBody = document.getElementById('statsBody');
            rosterBody.innerHTML = '';
            statsBody.innerHTML = '';
            addPlayerToRoster('Error loading data', '', '', '', teams[teamId].color, teams[teamId]);
          }
        }
      });
    }

    // Function to add a player row to the roster table
    function addPlayerToRoster(playerName, height, weight, wingspan, teamColor, teamData) {
      const rosterBody = document.getElementById('rosterBody');
      
      const row = document.createElement('tr');
      
      // Player Name cell with link
      const nameCell = document.createElement('td');
      const nameLink = document.createElement('a');
      nameLink.href = `player_page.html?player=${encodeURIComponent(playerName)}&height=${encodeURIComponent(height)}&weight=${encodeURIComponent(weight)}&wingspan=${encodeURIComponent(wingspan)}&team=${encodeURIComponent(teamData.name)}&teamLogo=${encodeURIComponent(teamData.logo)}&teamColor=${encodeURIComponent(teamData.color)}&teamOwner=${encodeURIComponent(teamData.owner)}`;
      nameLink.className = 'player-name-link';
      nameLink.textContent = playerName;
      nameLink.style.color = teamColor;
      nameCell.appendChild(nameLink);
      row.appendChild(nameCell);
      
      // Other cells
      [height, weight, wingspan].forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        cell.style.color = teamColor;
        row.appendChild(cell);
      });
      
      rosterBody.appendChild(row);
    }

    // Function to add a player row to the stats table
    function addPlayerToStats(player) {
      const statsBody = document.getElementById('statsBody');
      const row = document.createElement('tr');
      
      // Player Name cell
      const nameCell = document.createElement('td');
      nameCell.textContent = player.name;
      nameCell.style.color = player.teamColor;
      nameCell.style.textAlign = 'left';
      row.appendChild(nameCell);
      
      // Stats cells
      const stats = [
        player.ppg, player.rpg, player.apg, player.spg, player.bpg,
        player.tov, player.fg, player.threeP, player.ft,
        player.orpg, player.drpg, player.fpg, player.plusMinus, player.prf
      ];
      
      stats.forEach(stat => {
        const cell = document.createElement('td');
        cell.textContent = stat;
        cell.style.color = player.teamColor;
        row.appendChild(cell);
      });
      
      statsBody.appendChild(row);
    }

    // Initialize the page
    if (teamId && teams[teamId]) {
      const team = teams[teamId];
      document.getElementById('teamName').textContent = team.name;
      document.getElementById('teamOwner').textContent = `Owned by: ${team.owner}`;
      document.getElementById('teamLogo').src = team.logo;
      document.getElementById('teamLogo').alt = team.name + " Logo";
      document.getElementById('teamName').style.color = team.color;
      document.getElementById('teamOwner').style.color = team.color;
      document.title = team.name;
      
      fetchRosterData();
    } else {
      document.getElementById('teamHeader').innerHTML = `<h2 style="color: red;">Team not found</h2>`;
    }
