document.addEventListener('DOMContentLoaded', function () {
      const loadingOverlay = document.getElementById('loadingOverlay');

      // Show loading overlay
      function showLoading() {
        loadingOverlay.classList.add('active');
      }

      // Hide loading overlay
      function hideLoading() {
        loadingOverlay.classList.remove('active');
      }

      // Navbar toggle active class
      document.querySelectorAll('.navbar-link').forEach(link => {
        link.addEventListener('click', function (e) {
          if (this.getAttribute('href') === '#') {
            e.preventDefault();
          }
          document.querySelectorAll('.navbar-link').forEach(l => l.classList.remove('active'));
          this.classList.add('active');
        });
      });

      const newsCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRrPYMiVIxReGjcTtka2STWnIKXx9H55SS6UOrTIJoCJfmkCARaRe4eEJdzC498tvnzScwhGAkBAVcg/pub?gid=0&single=true&output=csv';
      const ticker = document.getElementById('newsTicker'),
        prevBtn = document.getElementById('prevBtn'),
        nextBtn = document.getElementById('nextBtn');

      let currentSlide = 0, slideInterval;
      const slideDuration = 3000;
      const placeholder = 'https://via.placeholder.com/1200x720/1e1e1e/FFD700?text=No+Image';

      function showError(msg) {
        ticker.innerHTML = `<div class="error">${msg}</div>`;
      }

      function processDriveUrl(url) {
        const m = url.match(/[-\w]{25,}/);
        return m ? `https://lh3.googleusercontent.com/d/${m[0]}=s800` : url;
      }

      function createSlide({ imageUrl, text }) {
        const div = document.createElement('div');
        div.className = 'news-slide';
        div.style.display = 'none';

        const img = document.createElement('img');
        img.className = 'news-image';
        img.src = processDriveUrl(imageUrl);
        img.onerror = () => img.src = placeholder;

        div.appendChild(img);

        const caption = document.createElement('div');
        caption.className = 'news-content';
        caption.innerHTML = `
          <p class="news-text">${text}</p>
          <div class="news-date">${new Date().toLocaleDateString()}</div>
        `;
        div.appendChild(caption);

        return div;
      }

      function showSlide(i) {
        if (!ticker.children.length) return;
        Array.from(ticker.children).forEach((slide, idx) => {
          slide.style.display = idx === i ? 'block' : 'none';
        });
        currentSlide = i;
      }

      function nextSlide() {
        showSlide((currentSlide + 1) % ticker.children.length);
      }

      function prevSlide() {
        showSlide((currentSlide - 1 + ticker.children.length) % ticker.children.length);
      }

      function startSlideshow() {
        clearInterval(slideInterval);
        if (ticker.children.length > 1) {
          slideInterval = setInterval(nextSlide, slideDuration);
        }
      }

      function loadNews() {
        return new Promise((resolve, reject) => {
          ticker.innerHTML = '<div class="loading">Loading news...</div>';
          Papa.parse(newsCsvUrl, {
            download: true,
            header: false,
            skipEmptyLines: true,
            complete({ data }) {
              try {
                if (data.length < 8) throw new Error('Need at least 8 rows for A2/A4/A6/A8');
                const items = [
                  { imageUrl: data[1][0], text: data[3][0] },
                  { imageUrl: data[5][0], text: data[7][0] }
                ];
                if (!items.every(i => i.imageUrl && i.text)) {
                  throw new Error('Missing image or text content');
                }

                ticker.innerHTML = '';
                items.forEach(item => {
                  const slide = createSlide(item);
                  ticker.appendChild(slide);
                });

                showSlide(0);
                startSlideshow();
                resolve();
              } catch (err) {
                showError(err.message);
                console.error('News loading error:', err);
                reject(err);
              }
            },
            error(err) {
              showError('Failed to load news');
              console.error(err);
              reject(err);
            }
          });
        });
      }

     function loadStandingsData() {
  return new Promise(async (resolve, reject) => {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUXxv2LI_CXHUr7EQM5gX5ddG9fRA2oeMbfnC5_ruhTjWC2WjIYBhGJ91-qPoioyf2y5k5K6gBngEt/pub?gid=341899210&single=true&output=csv';
    try {
      const txt = await (await fetch(url)).text();
      const data = Papa.parse(txt.trim(), { skipEmptyLines: true }).data;

      const headers = ['Team', 'Games Played', 'Wins', 'Losses', 'Win%'];
      const columnIndexes = [0, 1, 2, 3, 7];

      const rows = data.slice(1, 9);

      // Fix incorrect team name if it appears
      rows.forEach(row => {
        if (row[0] && row[0].trim() === "Columbus RiverHawks") {
          row[0] = "Columbus Riverhawks";
        }
      });

      const thead = document.getElementById('standingsHeader'),
            tbody = document.getElementById('standingsBody');
      thead.innerHTML = '';
      tbody.innerHTML = '';

      // Create header row
      headers.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        thead.appendChild(th);
      });

      // Create body rows
      rows.forEach(row => {
        const tr = document.createElement('tr');
        columnIndexes.forEach(i => {
          const td = document.createElement('td');
          td.textContent = row[i] || '-';
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      resolve();
    } catch (e) {
      console.error(e);
      document.getElementById('standingsBody').innerHTML =
        `<tr><td colspan="5" class="error">Failed to load standings data.</td></tr>`;
      reject(e);
    }
  });
}

      // Slideshow buttons
      prevBtn.onclick = () => { prevSlide(); startSlideshow(); };
      nextBtn.onclick = () => { nextSlide(); startSlideshow(); };
      ticker.onmouseenter = () => clearInterval(slideInterval);
      ticker.onmouseleave = startSlideshow;

      // Main loader
      async function loadAllContent() {
        showLoading();
        try {
          await Promise.all([loadNews(), loadStandingsData()]);
        } catch (err) {
          console.error('One or more components failed to load.');
        } finally {
          hideLoading();
        }
      }

      loadAllContent();
    });
    document.querySelector('.news-ticker-container').style.display = 'none';
