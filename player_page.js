       // Toggle loading overlay
       const loadingOverlay = document.getElementById('loadingOverlay');

       function showLoading() {
           loadingOverlay.classList.add('active');
       }

       function hideLoading() {
           loadingOverlay.classList.remove('active');
       }

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

       // Helper to clean up #DIV/0! and empty values
       function cleanStat(value) {
           return (!value || value === '#DIV/0!') ? '0%' : value;
       }

       // Find player row index by name
       function findPlayerByName(csvData, playerName) {
           const hasHeader = csvData.length > 0 && typeof csvData[0][0] === 'string' && csvData[0][0].toLowerCase().includes('name');
           const startRow = hasHeader ? 1 : 0;
           for (let i = startRow; i < csvData.length; i++) {
               const row = csvData[i];
               if (row && row[0] && row[0].toLowerCase().trim() === playerName.toLowerCase().trim()) {
                   return i;
               }
           }
           return -1;
       }

       // Function to darken color
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

       // Fetch season averages and populate table
       // Fetch season averages and populate table
       function fetchSeasonAverages(dataRow, playerName = null) {
           const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUXxv2LI_CXHUr7EQM5gX5ddG9fRA2oeMbfnC5_ruhTjWC2WjIYBhGJ91-qPoioyf2y5k5K6gBngEt/pub?gid=1444984150&single=true&output=csv';
           const params = getUrlParams();
           const teamColor = params.teamColor ? decodeURIComponent(params.teamColor) : '#ffc000'; // Default to gold if no color

           Papa.parse(csvUrl, {
               download: true,
               header: false,
               complete: function(results) {
                   let targetRow = dataRow;
                   if (targetRow === null && playerName) {
                       targetRow = findPlayerByName(results.data, playerName);
                   }

                   if (targetRow >= 0 && results.data.length > targetRow) {
                       const row = results.data[targetRow];

                       const stats = {
                           ppg: cleanStat(row[2]),
                           rpg: cleanStat(row[3]),
                           apg: cleanStat(row[4]),
                           spg: cleanStat(row[5]),
                           bpg: cleanStat(row[6]),
                           fg: cleanStat(row[7]),
                           threeP: cleanStat(row[8]),
                           ft: cleanStat(row[9])
                       };

                       const tbody = document.getElementById('statsBody');
                       if (tbody) {
                           tbody.innerHTML = ''; // Clear any previous data
                           const tr = document.createElement('tr');
                           Object.values(stats).forEach(val => {
                               const td = document.createElement('td');
                               td.textContent = val;
                               td.style.color = teamColor; // Use team color here
                               tr.appendChild(td);
                           });
                           tbody.appendChild(tr);
                       }
                   }
               },
               error: function(error) {
                   console.error('Error loading season averages:', error);
               }
           });
       }

       // (unchanged) Fetch player attributes
       function fetchPlayerAttributes(dataRow, playerName = null) {
           showLoading();
           const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQJJKiG4UE5nmSlrtKQ79eKhNaxqnWEUpwKMlOrmiCgRSBe9uFsJ1ywQGCkaNnt5BwfwySEcWzuEZpq/pub?gid=408327260&single=true&output=csv';

           Papa.parse(csvUrl, {
               download: true,
               header: false,
               complete: function(results) {
                   let targetRow = dataRow;
                   if (targetRow === null && playerName) {
                       targetRow = findPlayerByName(results.data, playerName);
                   }

                   if (targetRow >= 0 && results.data.length > targetRow) {
                       const rowData = results.data[targetRow];
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
                           const el = document.getElementById(id);
                           if (el) el.textContent = attributes[id] || '-';
                       });
                   } else {
                       showNoDataMessage();
                   }
                   hideLoading();
               },
               error: function() {
                   showNoDataMessage();
                   hideLoading();
               }
           });
       }

       // (unchanged) Fetch badge and apply color logic
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

       // Show N/A if data is missing
       function showNoDataMessage() {
           document.querySelectorAll('.attribute-value').forEach(el => {
               if (el.textContent === '-') {
                   el.textContent = 'N/A';
                   el.style.color = '#666';
               }
           });
       }

       // Populate UI with all player data
       function populatePlayerData() {
           const params = getUrlParams();

           if (params.player) {
               const name = decodeURIComponent(params.player);
               document.getElementById('playerName').textContent = name;
               document.title = name;
           }

           if (params.height) document.getElementById('playerHeight').textContent = decodeURIComponent(params.height);
           if (params.weight) document.getElementById('playerWeight').textContent = decodeURIComponent(params.weight);
           if (params.wingspan) document.getElementById('playerWingspan').textContent = decodeURIComponent(params.wingspan);
           if (params.team) document.getElementById('playerTeam').textContent = decodeURIComponent(params.team);

           if (params.teamLogo) {
               const logo = document.getElementById('teamLogo');
               logo.src = decodeURIComponent(params.teamLogo);
               logo.onerror = () => logo.src = 'https://via.placeholder.com/160?text=No+Logo';
           }

           if (params.teamColor) {
               const color = decodeURIComponent(params.teamColor);
               ['playerName', 'playerTeam', 'playerHeight', 'playerWeight', 'playerWingspan'].forEach(id => {
                   const el = document.getElementById(id);
                   if (el) el.style.color = color;
               });
           }

           const row = params.dataRow ? parseInt(params.dataRow) : null;
           const name = params.player ? decodeURIComponent(params.player) : null;

           fetchPlayerAttributes(row, name);
           fetchAndColorBadges(row, name);
           fetchSeasonAverages(row, name);
           setupTabs();
       }

       // Tabs
       function setupTabs() {
           const tabs = document.querySelectorAll('.master-player-tab');
           tabs.forEach(tab => {
               tab.addEventListener('click', () => {
                   document.querySelectorAll('.master-player-tab').forEach(t => t.classList.remove('active'));
                   document.querySelectorAll('.master-player-content').forEach(c => c.classList.remove('active'));
                   tab.classList.add('active');
                   document.getElementById(`${tab.getAttribute('data-tab')}-content`).classList.add('active');
               });
           });
       }

       // Initialize
       document.addEventListener('DOMContentLoaded', function() {
           showLoading();
           const params = getUrlParams();
           if (!params.player) {
               document.getElementById('playerName').textContent = "Player Not Found";
               document.getElementById('teamLogo').src = "https://via.placeholder.com/160?text=No+Player";
               hideLoading();
           } else {
               populatePlayerData();
           }
       });
