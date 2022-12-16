// Conecto a archivo json y Abro fetch

fetch("./data.json")
  .then(respuesta => respuesta.json())
  .then(productos => {

    // Código JS carrito

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

          Toastify({
            text: "Se Agregó un articulo al carrito",
            duration: 3000
          }).showToast();

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
<p>Precio: <span id = "precioPorProducto">$${prod.precio * prod.cantidad
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

      Toastify({
        text: "Tu carrito está vacío",
        duration: 3000
      }).showToast();

    });

    const eliminarDelCarrito = (prodId) => {
      let carrito = renderizarCarrito();
      const item = carrito.find((prod) => prod.id == prodId);
      const indice = carrito.indexOf(item);
      carrito.splice(indice, 1);
      guardarCarritoLS(carrito);
      actualizarCarrito();

      Toastify({
        text: "Se quitó un articulo del carrito",
        duration: 3000
      }).showToast();

    };

    renderProductos();
    actualizarCarrito();

    // Fin código JS carrito

    // Cierro fetch
  })