import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('#searchBar');
  const searchButton = document.querySelector('button');
  const gallery = document.querySelector('#gallery');

  let lightbox = new SimpleLightbox('.gallery-link', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
    enableKeyboard: true,
    showCounter: true,
    animationSpeed: 250,
    preloading: true,
    overlayOpacity: 0.7,
    className: 'simple-lightbox',
  });

  lightbox.on('show.simplelightbox', () => {
    console.log('Lightbox opened');
  });

  lightbox.on('error.simplelightbox', e => {
    console.error('Lightbox error:', e);
  });

  const showIziToast = message => {
    iziToast.show({
      message,
      messageSize: '16px',
      backgroundColor: 'rgba(239, 64, 64, 1)',
      messageColor: 'white',
      iconColor: 'white',
      progressBarColor: 'rgba(181, 27, 27, 1)',
      close: true,
      position: 'topRight',
    });
  };

  const loader = document.querySelector('.loader');

  const fetchImages = () => {
    const query = searchInput.value.trim();
    if (!query) return;

    const apiUrl = `https://pixabay.com/api/?key=21797660-d1d29527b0a34b4e6394998e6&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;

    gallery.innerHTML = '';

    loader.classList.remove('hidden');

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        loader.classList.add('hidden');

        gallery.innerHTML = '';

        if (data.totalHits === 0) {
          showIziToast(
            'Sorry, there are no images matching your search query. Please try again!'
          );
          return;
        }

        const createImagePropertyElement = (
          className,
          labelText,
          valueText
        ) => {
          const li = document.createElement('li');
          li.className = className;

          const textSpan = document.createElement('span');
          textSpan.className = `${className}Text`;
          textSpan.textContent = labelText;

          const valueSpan = document.createElement('span');
          valueSpan.className = `${className}Value`;
          valueSpan.textContent = valueText;

          li.appendChild(textSpan);
          li.appendChild(valueSpan);

          return li;
        };

        const imageElements = data.hits.map(
          ({
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          }) => {
            const li = document.createElement('li');
            li.className = 'gallery-item';

            const link = document.createElement('a');
            link.className = 'gallery-link';
            link.href = largeImageURL;

            const img = document.createElement('img');
            img.src = webformatURL;
            img.alt = tags;
            img.className = 'gallery-image';

            link.appendChild(img);
            li.appendChild(link);

            const imageProperties = document.createElement('ul');
            imageProperties.className = 'image-properties';

            imageProperties.appendChild(
              createImagePropertyElement('likes', 'Likes', likes)
            );
            imageProperties.appendChild(
              createImagePropertyElement('views', 'Views', views)
            );
            imageProperties.appendChild(
              createImagePropertyElement('comments', 'Comments', comments)
            );
            imageProperties.appendChild(
              createImagePropertyElement('downloads', 'Downloads', downloads)
            );

            li.appendChild(imageProperties);
            return li;
          }
        );

        imageElements.forEach(element => gallery.appendChild(element));

        lightbox.refresh();

        console.log({ totalHits: data.totalHits, images: data.hits });
      })
      .catch(error => {
        loader.classList.add('hidden');
        console.error('Error fetching images:', error);
      });
  };

  searchButton.addEventListener('click', event => {
    event.preventDefault();
    fetchImages();
  });
});
