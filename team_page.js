// Toggle loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');

    function showLoading() {
        loadingOverlay.classList.add('active');
    }

    function hideLoading() {
        loadingOverlay.classList.remove('active');
    }

    // Parse the query param
    const teamId = window.location.search.substring(1) || null;

    // Team data
    const teams = {
        ColumbusRiverhawks: {
            name: "Columbus Riverhawks",
            owner: "Kay Rivers",
            color: "#684428",
            logo: "https://drive.google.com/thumbnail?id=1E-WHv0i16L6ViK2AhLsY3tyduxo7j2nS&sz=w250-h180",
            dataRow: 38,
            dataRow2: 7,
            dataRow3: 49,
            dataRow4: 17,
            dataRow5: 53
        },
        DallasSteers: {
            name: "Dallas Steers",
            owner: "Keyon Hens",
            color: "silver",
            logo: "https://drive.google.com/thumbnail?id=1pIxyc3TwFKx0fEkhk7Tyc_ae4E0kRiuk&sz=w250-h180",
            dataRow: 40,
            dataRow2: 5,
            dataRow3: 11,
            dataRow4: 51,
            dataRow5: 8
        },
        DenverMountaineers: {
            name: "Denver Mountaineers",
            owner: "Hunter Jackson",
            color: "#E1A80E",
            logo: "https://drive.google.com/thumbnail?id=1wkB6z3U6EwTGnYjad__52dR84KWMloL2&sz=w250-h180",
            dataRow: 24,
            dataRow2: 35,
            dataRow3: 13,
            dataRow4: 12,
            dataRow5: 57
        },
        MaineMobsters: {
            name: "Maine Mobsters",
            owner: "AK Abass",
            color: "gold",
            logo: "https://drive.google.com/thumbnail?id=1qZk64ky90r0Ddg_uhH7NOPQg5-vSHDjZ&sz=w250-h180",
            dataRow: 6,
            dataRow2: 45,
            dataRow3: 18,
            dataRow4: 58,
            dataRow5: 31
        },
        MiamiViceSinners: {
            name: "Miami Vice Sinners",
            owner: "Kenan Kurt",
            color: "pink",
            logo: "https://drive.google.com/thumbnail?id=1qUSjUwrpWiHvExokwTkJWDCR0TZ9hlwT&sz=w250-h180",
            dataRow: 39,
            dataRow2: 16,
            dataRow3: 9,
            dataRow4: 19,
            dataRow5: 22
        },
        NewYorkCitySlickers: {
            name: "New York City Slickers",
            owner: "Maverick Doncic",
            color: "#263D4E",
            logo: "https://drive.google.com/thumbnail?id=1N0ZekAA21kXlQ9tnbyAseBePJJw79vy2&sz=w250-h180",
            dataRow: 46,
            dataRow2: 59,
            dataRow3: 3,
            dataRow4: 62,
            dataRow5: 26
        },
        PhoenixHeat: {
            name: "Phoenix Heat",
            owner: "Razor Blades",
            color: "orange",
            logo: "https://drive.google.com/thumbnail?id=1h-vWWI_naDdsmKz2lsvfsPgFowBJQIWO&sz=w250-h180",
            dataRow: 55,
            dataRow2: 48,
            dataRow3: 50,
            dataRow4: 65,
            dataRow5: 52
        },
        UtahRaptors: {
            name: "Utah Raptors",
            owner: "King Beowulf",
            color: "antiquewhite",
            logo: "https://drive.google.com/thumbnail?id=1zRbm7lk35HC9XMiOBEUhcBc_UMMhZ7t5&sz=w250-h180",
            dataRow: 41,
            dataRow2: 23,
            dataRow3: 2,
            dataRow4: 44,
            dataRow5: 47
        }
    };

    function cleanStat(value) {
        return (value === '#DIV/0!' || value === undefined || value === null) ? '0%' : value;
    }

    function fetchRosterData() {
        showLoading();

        const rosterUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQJJKiG4UE5nmSlrtKQ79eKhNaxqnWEUpwKMlOrmiCgRSBe9uFsJ1ywQGCkaNnt5BwfwySEcWzuEZpq/pub?gid=802365237&single=true&output=csv';
        const statsUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUXxv2LI_CXHUr7EQM5gX5ddG9fRA2oeMbfnC5_ruhTjWC2WjIYBhGJ91-qPoioyf2y5k5K6gBngEt/pub?gid=1692713008&single=true&output=csv';

        Promise.all([
                new Promise(resolve => Papa.parse(rosterUrl, {
                    download: true,
                    complete: resolve
                })),
                new Promise(resolve => Papa.parse(statsUrl, {
                    download: true,
                    complete: resolve
                }))
            ])
            .then(([rosterResult, statsResult]) => {
                if (teamId && teams[teamId]) {
                    const team = teams[teamId];
                    const rosterBody = document.getElementById('rosterBody');
                    const statsBody = document.getElementById('statsBody');
                    rosterBody.innerHTML = '';
                    statsBody.innerHTML = '';

                    const rows = [team.dataRow, team.dataRow2, team.dataRow3, team.dataRow4, team.dataRow5];
                    const players = [];

                    rows.forEach(idx => {
                        const r = rosterResult.data[idx] || [];
                        const s = statsResult.data[idx] || [];

                        const name = r[0] || 'N/A';
                        const h = r[1] || 'N/A';
                        const w = r[2] || 'N/A';
                        const ws = r[3] || 'N/A';

                        const playerStats = {
                            ppg: cleanStat(s[1]),
                            rpg: cleanStat(s[2]),
                            apg: cleanStat(s[3]),
                            spg: cleanStat(s[4]),
                            bpg: cleanStat(s[5]),
                            tov: cleanStat(s[6]),
                            fg: cleanStat(s[7]),
                            threeP: cleanStat(s[8])
                        };

                        // Roster table row
                        const tr = document.createElement('tr');
                        [name, h, w, ws].forEach((val, i) => {
                            const td = document.createElement('td');
                            if (i === 0) {
                                const a = document.createElement('a');
                                a.href = `player_page.html?player=${encodeURIComponent(name)}&height=${h}&weight=${w}&wingspan=${ws}&team=${encodeURIComponent(team.name)}&teamLogo=${encodeURIComponent(team.logo)}&teamColor=${encodeURIComponent(team.color)}&teamOwner=${encodeURIComponent(team.owner)}`;
                                a.textContent = name;
                                a.className = 'player-name-link';
                                a.style.color = team.color;
                                td.appendChild(a);
                            } else {
                                td.textContent = val;
                                td.style.color = team.color;
                            }
                            tr.appendChild(td);
                        });
                        rosterBody.appendChild(tr);

                        players.push({
                            name,
                            teamColor: team.color,
                            ...playerStats
                        });
                    });

                    // Stats table rows
                    players.forEach(pl => {
                        const tr = document.createElement('tr');
                        const tdName = document.createElement('td');
                        tdName.textContent = pl.name;
                        tdName.style.color = pl.teamColor;
                        tdName.style.textAlign = 'left';
                        tr.appendChild(tdName);

                        ['ppg', 'rpg', 'apg', 'spg', 'bpg', 'tov', 'fg', 'threeP'].forEach(stat => {
                            const td = document.createElement('td');
                            td.textContent = pl[stat];
                            td.style.color = pl.teamColor;
                            tr.appendChild(td);
                        });

                        statsBody.appendChild(tr);
                    });
                }
                hideLoading();
            })
            .catch(() => hideLoading());
    }

    // Initialize page
    if (teamId && teams[teamId]) {
        const t = teams[teamId];
        document.getElementById('teamName').textContent = t.name;
        document.getElementById('teamOwner').textContent = `Owned by: ${t.owner}`;
        document.getElementById('teamLogo').src = t.logo;
        document.getElementById('teamLogo').alt = `${t.name} Logo`;
        document.getElementById('teamName').style.color = t.color;
        document.getElementById('teamOwner').style.color = t.color;
        document.title = t.name;
        fetchRosterData();
    } else {
        document.getElementById('teamHeader').innerHTML = '<h2 style="color:red;">Team not found</h2>';
    }
