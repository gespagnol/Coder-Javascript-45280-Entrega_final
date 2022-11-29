const productos = [
  {
    id: 1,
    imagen: "a13-negro-frente_3.png",
    name: "Galaxy A13 - 64GB",
    precio: 59990,
    cantidad: 1,
  },
  {
    id: 2,
    imagen: "g41-negro-frente_2.png",
    name: "Moto G41",
    precio: 49900,
    cantidad: 1,
  },
  {
    id: 3,
    imagen: "g52-negro-frente.png",
    name: "Moto G52",
    precio: 58990,
    cantidad: 1,
  },
  {
    id: 4,
    imagen: "a03-128-negro-frente_2.png",
    name: "Galaxy A03",
    precio: 41999,
    cantidad: 1,
  },
  {
    id: 5,
    imagen: "a13-negro-frente_3.png",
    name: "Galaxy A13",
    precio: 59990,
    cantidad: 1,
  },
  
];

function guardarCarritoLS(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
function renderizarCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

const seccion = document.getElementsByClassName("section");
const divContenedor = document.createElement("div");
divContenedor.id = "productosIndex";
const contenedorCarrito = document.getElementById("carrito-contenedor");
const botonVaciar = document.getElementById("vaciar-carrito");
const contadorCarrito = document.getElementById("contadorCarrito");
const precioTotal = document.getElementById("precioTotal");
let carrito = [];

function renderProductos() {
  for (let cardItem of productos) {
    let cards = document.createElement("div");
    cards.className = "cardsStyle";
    cards.innerHTML = `<img class= cardImage src= assets/${cardItem.imagen}
/>
<h3 class = "card__title"> ${cardItem.name}</h3> 
<p class = "card__precio" >  $${cardItem.precio}</p>
<button class= "card__btn" id= "${cardItem.id}">Agregar al carrito</button>
<div class = "confirmacion_carrito"></div>
`;
    seccion[0].appendChild(cards);
    const botonAgregarAlCarrito = document.getElementById(`${cardItem.id}`);
    botonAgregarAlCarrito.addEventListener("click", () => {
      agregarAlCarrito(cardItem.id);
    });
  }
}

const agregarAlCarrito = (prodId) => {
  let carrito = renderizarCarrito();
  const item = productos.find((elemento) => elemento.id == prodId);
  item.cantidad = 1;
  const existe = carrito.findIndex((objeto) => item.id === objeto.id);

  if (existe === -1) {
    carrito.push(item);
    guardarCarritoLS(carrito);
    actualizarCarrito();
  } else {
    carrito[existe].cantidad++;
    guardarCarritoLS(carrito);
    actualizarCarrito();
  }
};

const disminuir = (prodId) => {
  let carrito = renderizarCarrito();
  const item = carrito.find((elemento) => elemento.id == prodId);
  if (item.cantidad > 1) {
    item.cantidad--;
  } else {
    eliminarDelCarrito();
  }
  guardarCarritoLS(carrito);
  actualizarCarrito();
};

const actualizarCarrito = () => {
  let carrito = renderizarCarrito();
  console.log(carrito);
  contenedorCarrito.innerHTML = "";
  carrito.forEach((prod) => {
    const div = document.createElement("div");
    div.className = "productoEnCarrito";
    div.innerHTML = `<p>Art: ${prod.name}</p>
<p>Precio unidad: ${prod.precio}</p>
<p>Cantidad: <span id = "cantidad">${prod.cantidad}</span><p>
<p>Precio: <span id = "precioPorProducto">$${
      prod.precio * prod.cantidad
    }</span></p>
<button id="EliminarCart${prod.id}"  class="boton-eliminar">Eliminar artículo</button>
<button id= "aumentar${prod.id}" class = "btn-aumentar-cantidad">+</button>
<button id= "disminuir${prod.id}" class ="btn-disminuir-cantidad">&nbsp;-&nbsp;</button>`;
    contenedorCarrito.appendChild(div);
    document
      .getElementById(`EliminarCart${prod.id}`)
      .addEventListener("click", eliminarDelCarrito);
    document
      .getElementById(`aumentar${prod.id}`)
      .addEventListener("click", () => {
        agregarAlCarrito(prod.id);
      });
    const botonDisminuir = document.getElementById(`disminuir${prod.id}`);
    botonDisminuir.addEventListener("click", () => {
      disminuir(prod.id);
    });
  });

  contadorCarrito.innerText = carrito.reduce(
    (acc, prod) => acc + prod.cantidad,
    0
  );
  precioTotal.innerText = carrito.reduce(
    (acc, prod) => acc + prod.precio * prod.cantidad,
    0
  );
};
botonVaciar.addEventListener("click", () => {
  localStorage.removeItem("carrito");
  actualizarCarrito();
});

const eliminarDelCarrito = (prodId) => {
  let carrito = renderizarCarrito();
  const item = carrito.find((prod) => prod.id == prodId);
  const indice = carrito.indexOf(item);
  carrito.splice(indice, 1);
  guardarCarritoLS(carrito);
  actualizarCarrito();
};

renderProductos();
actualizarCarrito();