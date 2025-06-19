 // Toggle loading overlay
      const loadingOverlay = document.getElementById('loadingOverlay');
      function showLoading() { loadingOverlay.classList.add('active'); }
      function hideLoading() { loadingOverlay.classList.remove('active'); }

      // Function to get URL parameters
      function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
          player: params.get('player'),
          height: params.get('height'),
          weight: params.get('weight'),
          wingspan: params.get('wingspan'),
          team: params.get('team'),
          teamLogo: params.get('teamLogo'),
          teamColor: params.get('teamColor'),
          teamOwner: params.get('teamOwner'),
          dataRow: params.get('dataRow')
        };
      }

      // Function to find player by name in CSV data
      function findPlayerByName(csvData, playerName) {
        console.log("Searching for player:", playerName);

        // Check if we have a header row by looking at the first row
        const hasHeader = csvData.length > 0 && (
          typeof csvData[0][0] === 'string' && 
          csvData[0][0].toLowerCase().includes('name')
        );

        const startRow = hasHeader ? 1 : 0;
        console.log("Has header row:", hasHeader, "Starting search from row:", startRow);

        for (let i = startRow; i < csvData.length; i++) {
          const row = csvData[i];
          if (row && row.length > 0) {
            const csvPlayerName = row[0];
            if (csvPlayerName && csvPlayerName.toString().toLowerCase().trim() === playerName.toLowerCase().trim()) {
              console.log("Found player at row:", i, "Player name:", csvPlayerName);
              return i;
            }
          }
        }

        console.log("Player not found in CSV data");
        return -1;
      }

      // Helper function to darken colors for borders
      function darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return `#${(
          0x1000000 +
          (R < 0 ? 0 : R) * 0x10000 +
          (G < 0 ? 0 : G) * 0x100 +
          (B < 0 ? 0 : B)
        ).toString(16).slice(1)}`;
      }

      // Function to fetch player attributes from CSV
      function fetchPlayerAttributes(dataRow, playerName = null) {
        showLoading();
        console.log("fetchPlayerAttributes called with dataRow:", dataRow, "playerName:", playerName);
        const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQJJKiG4UE5nmSlrtKQ79eKhNaxqnWEUpwKMlOrmiCgRSBe9uFsJ1ywQGCkaNnt5BwfwySEcWzuEZpq/pub?gid=408327260&single=true&output=csv';

        Papa.parse(csvUrl, {
          download: true,
          header: false,
          complete: function(results) {
            console.log("CSV data loaded, total rows:", results.data.length);

            let targetRow = dataRow;

            if (targetRow === null && playerName) {
              targetRow = findPlayerByName(results.data, playerName);
            }

            console.log("Target row:", targetRow);

            if (targetRow >= 0 && results.data.length > targetRow) {
              const rowData = results.data[targetRow];
              console.log("Raw row data:", rowData);

              const attributes = {
                'driving-layup': rowData[5],
                'post-fade': rowData[6],
                'post-hook': rowData[7],
                'post-moves': rowData[8],
                'draw-foul': rowData[9],
                'close-shot': rowData[10],
                'mid-range': rowData[11],
                'three-pt': rowData[12],
                'free-throw': rowData[13],
                'ball-control': rowData[14],
                'pass-iq': rowData[15],
                'pass-accuracy': rowData[16],
                'off-rebound': rowData[17],
                'standing-dunk': rowData[18],
                'driving-dunk': rowData[19],
                'shot-iq': rowData[20],
                'pass-vision': rowData[21],
                'hands': rowData[22],
                'def-rebound': rowData[23],
                'interior-defense': rowData[24],
                'perimeter-defense': rowData[25],
                'block': rowData[26],
                'steal': rowData[27],
                'speed': rowData[28],
                'speed-with-ball': rowData[29],
                'vertical': rowData[30],
                'strength': rowData[31],
                'hustle': rowData[32],
                'agility': rowData[33],
                'pass-perception': rowData[34],
                'def-consistency': rowData[35],
                'help-defense-iq': rowData[36],
                'off-consistency': rowData[37],
                'intangibles': rowData[38]
              };

              Object.keys(attributes).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                  const value = attributes[id];
                  element.textContent = (value !== undefined && value !== null && value !== '') ? value : '-';
                }
              });

            } else {
              console.error("Row not found. Requested row:", targetRow, "Total rows:", results.data.length);
              showNoDataMessage();
            }
            hideLoading();
          },
          error: function(error) {
            console.error('Error loading player attributes:', error);
            showNoDataMessage();
            hideLoading();
          }
        });
      }

      // Function to fetch and color badges based on their values
      function fetchAndColorBadges(dataRow, playerName = null) {
        showLoading();
        console.log("fetchAndColorBadges called with dataRow:", dataRow, "playerName:", playerName);
        const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQJJKiG4UE5nmSlrtKQ79eKhNaxqnWEUpwKMlOrmiCgRSBe9uFsJ1ywQGCkaNnt5BwfwySEcWzuEZpq/pub?gid=408327260&single=true&output=csv';

        Papa.parse(csvUrl, {
          download: true,
          header: false,
          complete: function(results) {
            console.log("CSV data loaded for badges, total rows:", results.data.length);

            let targetRow = dataRow;

            if (targetRow === null && playerName) {
              targetRow = findPlayerByName(results.data, playerName);
            }

            console.log("Target row for badges:", targetRow);

            if (targetRow >= 0 && results.data.length > targetRow) {
              const rowData = results.data[targetRow];
              console.log("Raw row data for badges:", rowData);

              const badgeColumns = {
                                'Aerial Wizard': rowData[56],
                'Float Game': rowData[65],
                'Hook Specialist': rowData[69],
                'Layup Mixmaster': rowData[72],
                'Paint Prodigy': rowData[78],
                'Physical Finisher': rowData[80],
                'Post Fade Phenom': rowData[84],
                'Post Powerhouse': rowData[86],
                'Post Up Poet': rowData[87],
                'Posterizer': rowData[83],
                'Rise Up': rowData[89],
                'Deadeye': rowData[63],
                'Limitless Range': rowData[74],
                'Mini Marksman': rowData[75],
                'Set Shot Specialist': rowData[90],
                'Shifty Shooter': rowData[91],
                'Ankle Assassin': rowData[57],
                'Bail Out': rowData[58],
                'Break Starter': rowData[60],
                'Dimer': rowData[64],
                'Lightning Launch': rowData[73],
                'Strong Handle': rowData[93],
                'Unpluckable': rowData[94],
                'Versatile Visionary': rowData[94],
                'Challenger': rowData[62],
                'Glove': rowData[66],
                'Interceptor': rowData[71],
                'High Flying Denier': rowData[68],
                'Immovable Enforcer': rowData[70],
                'Off Ball Pest': rowData[76],
                'On-Ball Menace': rowData[77],
                'Paint Patroller': rowData[79],
                'Pick Dodger': rowData[81],
                'Post Lockdown': rowData[85],
                'Boxout Beast': rowData[59],
                'Rebound Chaser': rowData[88],
                'Brick Wall': rowData[61],
                'Slippery Off Ball': rowData[92],
                'Pogo Stick': rowData[82]
              };

              const badgeColors = {
                'Bronze': '#996633',
                'Silver': '#a5a5a5',
                'Gold': '#ffc000',
                'Hall of Fame': '#7030a0',
                'Legend': '#7030a0'
              };

              // Apply colors to entire badge blocks
              Object.keys(badgeColumns).forEach(badgeName => {
                const badgeValue = badgeColumns[badgeName];
                if (badgeValue && badgeValue !== 'Null' && badgeValue.trim() !== '') {
                  const color = badgeColors[badgeValue.trim()];
                  if (color) {
                    const badgeElements = document.querySelectorAll(`.badge-item`);
                    badgeElements.forEach(element => {
                      if (element.querySelector('.attribute-label').textContent === badgeName) {
                        element.style.backgroundColor = color;
                        element.querySelector('.attribute-label').style.color = 'white';
                      }
                    });
                  }
                }
              });

            } else {
              console.error("Row not found for badges. Requested row:", targetRow, "Total rows:", results.data.length);
            }
            hideLoading();
          },
          error: function(error) {
            console.error('Error loading player badges:', error);
            hideLoading();
          }
        });
      }

      function showNoDataMessage() {
        const attributeElements = document.querySelectorAll('.attribute-value');
        attributeElements.forEach(element => {
          if (element.textContent === '-') {
            element.textContent = 'N/A';
            element.style.color = '#666';
          }
        });
      }

      function populatePlayerData() {
        const params = getUrlParams();

        if (params.player) {
          const playerName = decodeURIComponent(params.player);
          document.getElementById('playerName').textContent = playerName;
          document.title = playerName + " | LBA";
        }

        if (params.height) {
          document.getElementById('playerHeight').textContent = decodeURIComponent(params.height);
        }
        if (params.weight) {
          document.getElementById('playerWeight').textContent = decodeURIComponent(params.weight);
        }
        if (params.wingspan) {
          document.getElementById('playerWingspan').textContent = decodeURIComponent(params.wingspan);
        }

        if (params.team) {
          const teamName = decodeURIComponent(params.team);
          document.getElementById('playerTeam').textContent = teamName;
        }

        if (params.teamLogo) {
          const logoUrl = decodeURIComponent(params.teamLogo);
          const img = document.getElementById('teamLogo');
          img.src = logoUrl;
          img.onerror = function() {
            console.error("Failed to load team logo:", logoUrl);
            this.src = "https://via.placeholder.com/160?text=No+Logo";
          };
        }

        if (params.teamColor) {
          const color = decodeURIComponent(params.teamColor);
          const elements = ['playerName', 'playerTeam', 'playerHeight', 'playerWeight', 'playerWingspan'];
          elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
              element.style.color = color;
            }
          });
        }

        const dataRow = params.dataRow ? parseInt(params.dataRow) : null;
        const playerName = params.player ? decodeURIComponent(params.player) : null;

        if (dataRow !== null || playerName) {
          console.log("Fetching player data - dataRow:", dataRow, "playerName:", playerName);
          fetchPlayerAttributes(dataRow, playerName);
          fetchAndColorBadges(dataRow, playerName);
        } 
      }

      function setupTabs() {
        const tabs = document.querySelectorAll('.master-player-tab');

        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            document.querySelectorAll('.master-player-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.master-player-content').forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const tabName = tab.getAttribute('data-tab');
            const content = document.getElementById(`${tabName}-content`);
            if (content) {
              content.classList.add('active');
            }
          });
        });
      }

      document.addEventListener('DOMContentLoaded', function() {
        console.log("DOM fully loaded");
        showLoading();

        const params = getUrlParams();
        console.log("URL Parameters:", params);

        populatePlayerData();
        setupTabs();

        if (!params.player) {
          console.warn("No player data in URL, using fallback");
          document.getElementById('playerName').textContent = "Player Not Found";
          document.getElementById('teamLogo').src = "https://via.placeholder.com/160?text=No+Player";
          hideLoading();
        }
      });
