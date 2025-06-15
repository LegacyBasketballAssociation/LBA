document.addEventListener('DOMContentLoaded', function () {
      const loadingOverlay = document.getElementById('loadingOverlay');

      loadingOverlay.classList.add('active');
      setTimeout(function() {
        loadingOverlay.classList.remove('active');
      }, 1000);

      // Navbar active link handling
      const currentPage = location.pathname.split('/').pop();
      document.querySelectorAll('.navbar-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
          link.classList.add('active');
        }

        link.addEventListener('click', function(e) {
          if (!this.classList.contains('active')) {
            document.querySelectorAll('.navbar-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
          }
        });
      });
    });
