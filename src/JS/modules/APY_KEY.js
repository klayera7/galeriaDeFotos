export default function initApiKey() {
    const apiKey = 'lbLq1GVy0oZIO8LcFZncQhCrelD1XaOqJQx3v4FQXM021JbCSYCeyXXK';
    const gallery = document.getElementById('gallery');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const noResultsMsg = document.getElementById('no-results');
    
    const loadingElement = document.getElementById('loading');

    async function fetchPhotos(url) {
        loadingElement.style.display = 'block';
        gallery.innerHTML = ''; 
        noResultsMsg.style.display = 'none';

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const data = await response.json();
            
            loadingElement.style.display = 'none';
            
            displayPhotos(data.photos);
        } catch (error) {
            loadingElement.style.display = 'none';
            
            console.error('Erro ao buscar fotos:', error);
            gallery.innerHTML = '<p style="text-align:center; width:100%;">Erro ao carregar imagens. Verifique sua chave de API.</p>';
        }
    }

    function displayPhotos(photos) {
        gallery.innerHTML = '';
        
        if (photos.length === 0) {
            noResultsMsg.style.display = 'block';
            return;
        } else {
            noResultsMsg.style.display = 'none';
        }

        photos.forEach(photo => {
            const article = document.createElement('article');
            article.classList.add('photo-item');
            
            article.innerHTML = `
                <div class="img-wrapper">
                    <img src="${photo.src.large}" alt="${photo.alt}" loading="lazy">
                </div>
                <h2>${photo.alt || 'Foto sem título'}</h2>
                <p style="font-size: 0.8rem; color: #bb86fc; padding-bottom: 10px;">Por: ${photo.photographer}</p>
            `;
            
            gallery.appendChild(article);
        });
    }

    function loadInitialPhotos() {
        const url = 'https://api.pexels.com/v1/curated?per_page=15';
        fetchPhotos(url);
    }

    function searchPhotos() {
        const query = searchInput.value.trim();
        if (query) {
            const url = `https://api.pexels.com/v1/search?query=${query}&per_page=15&locale=pt-BR`;
            fetchPhotos(url);
        } else {
            loadInitialPhotos();
        }
    }

    searchBtn.addEventListener('click', searchPhotos);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchPhotos();
        }
    });

    loadInitialPhotos();
}