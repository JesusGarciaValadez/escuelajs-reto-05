# Escuelajs-reto-05
Reto 5 Septiembre 28: Curso de Fundamentos de JavaScript

# 100tifi.co

![100tifico](https://raw.githubusercontent.com/platzi/escuelajs-reto-05/master/screenshot.png?token=ACQQY5SNIXZ7QAVA5XIHPSC5TADSY)

Somos un directorio de personajes de la serie animada "Rick and Morty". Estamos por lanzar nuestra implementación y necesitamos resolver los problemas que presenta nuestra aplicación.

https://100tifi.co tiene un Bug, al llegar al final del listado de personajes se realiza una petición a la API ya que implementamos un "intersection observer" pero vuelve a obtener los mismos personajes y necesitamos cargar la lista completa de 468 personajes conforme hagamos scroll.

### Debug

Visita el sitio web: https://100tifi.co

### Instalación

```
npm install
```

### Ejecución

```
npm run start
```

### Documentación


- Variable llamada $app donde haremos render de nuestra app.
- Elemento del DOM que sera Observado.
- Constante 'API': Utilizamos la API de Rick and Morty.

```javascript
const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
```

Función llamada 'getData' que se encarga de hacer Fetch a una API y construye un elemento nuevo en el DOM.

```javascript
const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
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
```

Función encargada de hacer Fetch de los personajes.

```javascript
const loadData = () => {
  getData(API);
}
```

Intersection Observer
```javascript

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);
```

# Service Worker
Se encarga de cachear gran parte de los assets estáticos o externos. No se requiere nada más para la instalación del 
Service Worker, excepto un navegador moderno que sea capáz de ejecutar el Service Worker en su API.

``` /src/index.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .catch(error => {
      console.error(error);
    });
}
```

Se importa un script de Google que se encarga de manejar el registro y manejo del Service Worker. Una vez importado el 
script, se especifica que tipo de recursos van a ser cacheados, y se agrupan por nombres específicos. Los recursos 
serán cacheados una vez que sean cargados en el navegador, haciéndolos disponibles aún offline.

``` /sw.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.1.1/workbox-sw.js');

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    new workbox.strategies.CacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 10,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /\/$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources',
    })
);

workbox.routing.registerRoute(
    /\.(?:js|html|css|json)$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources',
    })
);

workbox.routing.registerRoute(
    /^https\:\/\/rickandmortyapi\.com\/*(.*)$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'rickandmortyapi-resources',
    })
);

workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-resources',
    }),
);
```

## RETO

### Primer problema

1. Guarda en localStorage la URL de la siguiente petición de personajes obtenida en la primera llamada a la API.
2. Utiliza el nombre para la llave: 'next_fetch'.
3. Comprueba que se ha guardado el valor 'next_fetch' en localStorage.

### Segundo Problema

1. Obten los datos almacenados en localStorage de la llave: 'next_fetch'.
2. Valida que exista un valor en 'next_fetch' o regresa el primer llamado de la API.
3. Actualiza la función loadData() a Async/Await.

### Tercer Problema

Cuando cerramos la pestaña o recargamos la pagina se debe de volver a mostrar los primeros 20 personajes.

1. Mostrar los primeros 20 personajes al recargar
2. Eliminar el localStorage.

### Cuarto Problema (Opcional)

La API utilizada "RickAndMortyApi.com" tiene 25 paginas de 20 personajes cada una, cuando la ultima petición sea ejecutada y el valor 'next' no sea entregado debes de mostrar un mensaje "Ya no hay personajes", a su vez debes de destruir el intersection observer.

1. Implementar mensaje: "Ya no hay personajes...".
2. Deja de observar el elemento "observe".

### Enviar solución de reto

Debes de crear un "Fork" de este proyecto, revolver los problemas y crear un Pull Request hacia este repositorio.

### Contribuir
Si alguien quiere agregar o mejorar algo, lo invito a colaborar directamente en este repositorio: [escuelajs-reto-05](https://github.com/platzi/escuelajs-reto-05/)

### Licencia
escuelajs-reto-05 se lanza bajo la licencia [MIT](https://opensource.org/licenses/MIT).
