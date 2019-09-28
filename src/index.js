const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
const storage = window.localStorage;

if (storage.getItem('next_fetch')) {
  storage.removeItem('next_fetch')
}

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      if (!response.info.next) {
        intersectionObserver.disconnect();

        let output = `Ya no hay personajes...`;
        let newItem = document.createElement('p');
        newItem.classList.add('Output');
        newItem.innerText = output;
        $app.appendChild(newItem);

        return;
      }

      storage.setItem('next_fetch', response.info.next);

      const characters = response.results;
      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `
      }).join('');
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}

const loadData = async () => {
  if (!storage.getItem('next_fetch')) {
    await getData(API);
    return;
  }

  await getData(storage.getItem('next_fetch'));
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);
