import "./style.css";

//? HEADER 
const headerTemplate = () => {
  return `
    <h1 id="logo">IPS</h1>
    <input type="search" placeholder="Buscar" id="searchinput"/>
    <button id="searchbtn">
      <img src="/public/assets1/buscar.png" alt="Icono de búsqueda"/>
    </button>
    <button id="darkmodebtn">
      <img src="/public/assets1/modo-claro-oscuro.png" alt="Modo Claro, Oscuro" id="darkmodeicon"/>
    </button>
    <img src="/public/assets1/agregar-usuario.png" alt="Imagen de Perfil" class="profileimg"/>
    <div id="menu" class="menu">
      <img src="/public/assets2/menu.png" alt="Icono del menú"/>
      <ul id="menu-items">
        <li id="light-mode">Modo Claro</li>
        <li id="dark-mode">Modo Oscuro</li>
        <li id="user-profile">Perfil de Usuario</li>
      </ul>
    </div>
  `;
};

document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('menu');
  const menuItems = document.getElementById('menu-items');
  const lightModeItem = document.getElementById('light-mode');
  const darkModeItem = document.getElementById('dark-mode');
  const userProfileItem = document.getElementById('user-profile');

  //! Mostrar/ocultar el menú al hacer clic en el contenedor #menu
  menu.addEventListener('click', (event) => {
    event.stopPropagation(); //? Evita que se cierre inmediatamente al hacer clic dentro del menú
    menuItems.style.display =
      menuItems.style.display === 'block' ? 'none' : 'block';
  });

  //! Ocultar el menú al hacer clic fuera de él
  document.addEventListener('click', () => {
    menuItems.style.display = 'none';
  });

  //! Acción para "Modo Claro"
  lightModeItem.addEventListener('click', () => {
    document.body.classList.remove('dark');
  });

  //! Acción para "Modo Oscuro"
  darkModeItem.addEventListener('click', () => {
    document.body.classList.add('dark');
  });

  //! Acción para "Perfil de Usuario"
  userProfileItem.addEventListener('click', () => {
    console.log('Perfil de usuario seleccionado');
  });
});

const themeSwitch = () => {
  document.body.classList.toggle("dark")
}

const listeners = () => {
  const darkmodebtn = document.querySelector("#darkmodebtn")
  darkmodebtn.addEventListener("click", () => {
    themeSwitch()
    const theme = document.body.classList.contains("dark")
    if (theme) {
      document.querySelector("#darkmodeicon").src = "/public/assets2/modo-oscuro.png";
    } else {
      document.querySelector("#darkmodeicon").src = "/public/assets1/modo-claro.png";
    }
  })

  const logo = document.querySelector("#logo")
  logo.addEventListener("click", async () => {
  const images = await searchPhotos ("moom")
    printItems(images.response.results)
  })
}

const printHeaderTemplate = () => {
  document.querySelector("header").innerHTML = headerTemplate()
  listeners()
}

printHeaderTemplate();

//? FOOTER
const templateFooter = () => {
  return `
    <h4>Copyright 2025 - Inspirest - Rock the Code (jmfernaal)</h4>
    `
}

const printFooterTemplate = () => {
  document.querySelector("footer").innerHTML = templateFooter()
}

printFooterTemplate();

const cardTemplate = (item) => {
  return `
    <li class="gallery-item" style="background-image: url(${item.urls.regular}); border: 10px solid ${item.color}">
    <div class="info">
        <div class="save-btn">
            <button>Guardar</button>
        </div>
        <div class="links">
            <a href=${item.links.html} class="full-link">${item.links.html}</a>
            <div>
                <a href=${item.urls.full} target="_blank" class="links-icon">
                    <img src="/public/assets2/imagen.png" alt="Ver Imagen"/>
                </a>
                <a href="#null" class="links-icon">
                    <img src="/public/assets2/signo-de-mas.png" alt="Más imagenes"/>
                </a>    
            </div>
        </div>
    </div>
    </li>
    `
}

import { createApi } from "unsplash-js"

const unsplash = createApi({
  accessKey: import.meta.env.VITE_ACCESS_KEY,
})

const searchPhotos = async (keyword) => {
  try {
    const images = await unsplash.search.getPhotos({
      query: keyword,
      page: 1,
      perPage: 30,
    })
    return images
  } catch (error) {
    console.error("Error fetching photos:", error)
  }
}

const galleryTemplate = () => {
  return `
    <ul class="gallery">
    </ul>
    `
}

const printItems = (items) => {
  const gallery = document.querySelector(".gallery")
  gallery.innerHTML = ""
  for (const item of items) {
    gallery.innerHTML += cardTemplate(item)
  }
}

const galleryListeners = async () => {
  const input = document.querySelector("#searchinput")
  const btn = document.querySelector("#searchbtn")
  const performSearch = async () => {
    const images = await searchPhotos(input.value)
    if (images.response.results.length === 0) {
      const fallbackImages = await searchPhotos("gatos")
      printItems(fallbackImages.response.results)
      alert("No se encontraron imágenes con la frase introducida. Prueba con otra frase o palabra.")
      input.value = ""
    } else {
      printItems(images.response.results)
    }
    input.value = "" //? Limpiar el campo de búsqueda
  }

  btn.addEventListener("click", performSearch)

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      performSearch()
    }
  })
}

const printTemplate = async () => {
  document.querySelector("main").innerHTML = galleryTemplate()
  galleryListeners()

  const images = await searchPhotos("moon")
  printItems(images.response.results)
}

printTemplate();