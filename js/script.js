document.addEventListener("DOMContentLoaded", function () {
    activarMenuHamburguesa();
    activarNavbarScroll();
    activarAnimacionesScroll();
    activarContadorEstadisticas();
    cargarProductosDesdeBD();
    cargarServiciosDesdeBD();
    activarBuscadorProductos();
    activarFiltrosProductos();
    activarFormularioContacto();
    activarDetalleProducto();
});

function activarMenuHamburguesa() {
    var botonMenu = document.getElementById("menuToggle");
    var listaNav  = document.getElementById("navLinks");
    if (!botonMenu || !listaNav) return;

    botonMenu.addEventListener("click", function () {
        listaNav.classList.toggle("abierto");
        botonMenu.innerHTML = listaNav.classList.contains("abierto")
            ? "&#10005;"
            : "&#9776;";
    });

    document.addEventListener("click", function (evento) {
        var fueraMen = !botonMenu.contains(evento.target) && !listaNav.contains(evento.target);
        if (fueraMen && listaNav.classList.contains("abierto")) {
            listaNav.classList.remove("abierto");
            botonMenu.innerHTML = "&#9776;";
        }
    });
}

function activarNavbarScroll() {
    var navbar = document.getElementById("navbar");
    if (!navbar) return;

    window.addEventListener("scroll", function () {
        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
}

function activarAnimacionesScroll() {
    var elementos = document.querySelectorAll(".animar-scroll");
    if (elementos.length === 0) return;

    // Si el navegador no soporta IntersectionObserver, mostrar todo de inmediato
    if (!("IntersectionObserver" in window)) {
        elementos.forEach(function (el) { el.classList.add("visible"); });
        return;
    }

    var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });

    elementos.forEach(function (elemento) {
        observador.observe(elemento);
    });

    // Activar inmediatamente los que ya están en pantalla al cargar
    setTimeout(function () {
        elementos.forEach(function (elemento) {
            var rect = elemento.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                elemento.classList.add("visible");
            }
        });
    }, 100);
}

function activarContadorEstadisticas() {
    var numeros = document.querySelectorAll(".stat-numero[data-objetivo]");
    if (numeros.length === 0) return;

    var observadorContador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                var elemento     = entrada.target;
                var objetivo     = parseInt(elemento.getAttribute("data-objetivo"));
                var duracion     = 1800;
                var tiempoInicio = null;

                function animar(tiempoActual) {
                    if (!tiempoInicio) tiempoInicio = tiempoActual;
                    var progreso    = Math.min((tiempoActual - tiempoInicio) / duracion, 1);
                    var valorActual = Math.floor(easeOut(progreso) * objetivo);
                    elemento.textContent = valorActual.toLocaleString("es-MX");

                    if (progreso < 1) {
                        requestAnimationFrame(animar);
                    } else {
                        elemento.textContent = objetivo.toLocaleString("es-MX");
                    }
                }

                requestAnimationFrame(animar);
                observadorContador.unobserve(elemento);
            }
        });
    }, { threshold: 0.5 });

    numeros.forEach(function (numero) {
        observadorContador.observe(numero);
    });
}

function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
}

function activarBuscadorProductos() {
    var buscador = document.getElementById("buscador");
    if (!buscador) return;

    buscador.addEventListener("input", function () {
        var textoBuscado = buscador.value.toLowerCase().trim();
        filtrarProductos(textoBuscado, obtenerCategoriaActiva());
    });
}

function activarFiltrosProductos() {
    var botonesFiltro = document.querySelectorAll(".filtro-btn");
    if (botonesFiltro.length === 0) return;

    botonesFiltro.forEach(function (boton) {
        boton.addEventListener("click", function () {
            botonesFiltro.forEach(function (b) { b.classList.remove("activo-filtro"); });
            boton.classList.add("activo-filtro");

            var categoria    = boton.getAttribute("data-categoria");
            var buscador     = document.getElementById("buscador");
            var textoBuscado = buscador ? buscador.value.toLowerCase().trim() : "";
            filtrarProductos(textoBuscado, categoria);
        });
    });
}

function obtenerCategoriaActiva() {
    var botonActivo = document.querySelector(".filtro-btn.activo-filtro");
    return botonActivo ? botonActivo.getAttribute("data-categoria") : "todos";
}

function filtrarProductos(textoBuscado, categoria) {
    var productos      = document.querySelectorAll(".producto[data-categoria]");
    var sinResultados  = document.getElementById("sinResultados");
    var productosVisibles = 0;

    productos.forEach(function (producto) {
        var nombreProducto    = producto.getAttribute("data-nombre") || "";
        var categoriaProducto = producto.getAttribute("data-categoria") || "";
        var coincideTexto     = nombreProducto.includes(textoBuscado);
        var coincideCategoria = (categoria === "todos") || (categoriaProducto === categoria);

        if (coincideTexto && coincideCategoria) {
            mostrarProducto(producto);
            productosVisibles++;
        } else {
            ocultarProducto(producto);
        }
    });

    if (sinResultados) {
        if (productosVisibles === 0) {
            sinResultados.classList.remove("oculto");
        } else {
            sinResultados.classList.add("oculto");
        }
    }
}

function mostrarProducto(elemento) {
    elemento.style.display = "block";
    setTimeout(function () {
        elemento.style.opacity   = "1";
        elemento.style.transform = "translateY(0)";
    }, 10);
}

function ocultarProducto(elemento) {
    elemento.style.opacity   = "0";
    elemento.style.transform = "translateY(20px)";
    setTimeout(function () { elemento.style.display = "none"; }, 300);
}

function activarFormularioContacto() {
    var formulario = document.getElementById("formularioContacto");
    if (!formulario) return;

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        var esValido = true;
        esValido = validarCampo("nombre",  "Por favor escribe tu nombre completo.")                        && esValido;
        esValido = validarEmail("email",   "Por favor ingresa un correo válido.")                          && esValido;
        esValido = validarCampo("asunto",  "Por favor selecciona un asunto.")                              && esValido;
        esValido = validarCampo("mensaje", "Por favor escribe tu mensaje (mínimo 10 caracteres).", 10)     && esValido;

        if (esValido) {
            var mensajeExito = document.getElementById("mensajeExito");
            if (mensajeExito) {
                mensajeExito.classList.remove("oculto");
                formulario.reset();
                setTimeout(function () { mensajeExito.classList.add("oculto"); }, 5000);
            }
        }
    });

    formulario.querySelectorAll("input, select, textarea").forEach(function (campo) {
        campo.addEventListener("input", function () {
            campo.classList.remove("invalido");
            var errorEl = document.getElementById("error-" + campo.id);
            if (errorEl) errorEl.textContent = "";
        });
    });
}

function validarCampo(idCampo, mensajeError, longitudMinima) {
    var campo  = document.getElementById(idCampo);
    var error  = document.getElementById("error-" + idCampo);
    var minimo = longitudMinima || 1;
    if (!campo) return true;

    if (campo.value.trim().length < minimo) {
        campo.classList.add("invalido");
        if (error) error.textContent = mensajeError;
        return false;
    }
    campo.classList.remove("invalido");
    if (error) error.textContent = "";
    return true;
}

function validarEmail(idCampo, mensajeError) {
    var campo  = document.getElementById(idCampo);
    var error  = document.getElementById("error-" + idCampo);
    if (!campo) return true;

    var formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(campo.value.trim())) {
        campo.classList.add("invalido");
        if (error) error.textContent = mensajeError;
        return false;
    }
    campo.classList.remove("invalido");
    if (error) error.textContent = "";
    return true;
}

function activarDetalleProducto() {
    // Guardar producto al hacer clic en "Ver más" (desde productos.html)
    document.querySelectorAll("a.btn-ver-mas").forEach(function(enlace) {
        enlace.addEventListener("click", function() {
            var href = enlace.getAttribute("href") || "";
            var match = href.match(/producto=([^&]+)/);
            if (match) {
                localStorage.setItem("productoSeleccionado", decodeURIComponent(match[1]));
            }
        });
    });

    
    var nombreProducto = document.getElementById("nombreProducto");
    if (!nombreProducto) return;

    var producto = localStorage.getItem("productoSeleccionado");
    if (!producto) return;

    var catalogoProductos = {
        "filtro-aire":     { nombre: "Filtro de aire", categoria: "Motor", imagen: "img/filtro de aire.png", descripcion: "Mejora el rendimiento de tu motor y lo protege de partículas de polvo. Compatible con Honda, Yamaha, Italika y más.", caracteristicas: ["Compatible con Honda, Yamaha, Italika, Bajaj", "Material de espuma y algodón de alta filtración", "Lavable y reutilizable", "Garantía de 3 meses"] },
        "bujia":           { nombre: "Bujía", categoria: "Motor", imagen: "img/bujía.png", descripcion: "Bujía de iridio con encendido seguro y duración extendida. Ideal para motos de uso diario y largo recorrido.", caracteristicas: ["Punta de iridio de alta durabilidad", "Encendido eficiente en frío y caliente", "Compatible con motores de 50cc a 250cc", "Garantía de 6 meses"] },
        "cadena-pinon":    { nombre: "Kit cadena y piñón", categoria: "Transmisión", imagen: "img/cadena y piñon.png", descripcion: "Kit completo con cadena de transmisión y piñón trasero. Resistente al desgaste y de larga duración.", caracteristicas: ["Acero reforzado de alta resistencia", "Kit completo incluye cadena + piñón", "Para motos de trabajo y urbanas", "Fácil instalación"] },
        "aceite-motor":    { nombre: "Aceite de motor", categoria: "Motor", imagen: "img/aceite de motor.png", descripcion: "Aceite sintético de alta calidad para lubricación óptima del motor. Extiende la vida útil y reduce el desgaste.", caracteristicas: ["Fórmula sintética de alto rendimiento", "Viscosidad 10W-40 multigradual", "Protege en frío y en caliente", "Presentación 1L y 4L"] },
        "carburador":      { nombre: "Carburador", categoria: "Motor", imagen: "img/carburador.png", descripcion: "Carburador de repuesto para reparación o mejora del sistema de combustible de tu motocicleta.", caracteristicas: ["Compatible con modelos populares", "Resistente a la corrosión", "Incluye juntas y tornillería", "Garantía de 3 meses"] },
        "bateria":         { nombre: "Batería", categoria: "Eléctrico", imagen: "img/bateria.png", descripcion: "Batería de 12V para arranque confiable en cualquier condición climática y larga vida de carga.", caracteristicas: ["12V / 5Ah - 9Ah disponibles", "Sin mantenimiento", "Alta capacidad en frío", "Garantía de 6 meses"] },
        "pastillas-freno": { nombre: "Pastillas de freno", categoria: "Frenos", imagen: "img/pastilla de freno.png", descripcion: "Pastillas de freno de disco para frenado potente, progresivo y con baja generación de polvo.", caracteristicas: ["Material semimetálico de alta fricción", "Baja generación de ruido", "Compatibles con disco flotante y fijo", "Garantía de 3 meses"] },
        "clutch":          { nombre: "Kit de clutch", categoria: "Transmisión", imagen: "img/kit de clutch.png", descripcion: "Kit completo de discos de embrague para mayor agarre y rendimiento en la transmisión de potencia.", caracteristicas: ["Discos de fricción y acero incluidos", "Alta resistencia al calor", "Para motos trabajo y sport", "Fácil instalación"] },
        "casco":           { nombre: "Casco integral", categoria: "Accesorios", imagen: "img/cascointegral.png", descripcion: "Casco integral con certificación de seguridad, diseño aerodinámico, visera antirrayaduras y ventilación.", caracteristicas: ["Certificado DOT y ECE 22.05", "Carcasa de policarbonato", "Interior extraíble y lavable", "Visera antirrayaduras"] },
        "faro-led":        { nombre: "Faro LED delantero", categoria: "Eléctrico", imagen: "img/faroled.png", descripcion: "Faro delantero LED de alta luminosidad. Mayor visibilidad nocturna con bajo consumo de energía.", caracteristicas: ["LED 30W de alta potencia", "Luz blanca 6000K", "Bajo consumo energético", "Instalación Plug & Play"] },
        "disco-freno":     { nombre: "Disco de freno", categoria: "Frenos", imagen: "img/disco de freno.png", descripcion: "Disco de freno acanalado para mayor disipación de calor y mejor rendimiento de frenado.", caracteristicas: ["Acero inoxidable de alta resistencia", "Diseño acanalado anti-deformación", "Alta resistencia al calor", "Garantía de 6 meses"] },
        "guantes":         { nombre: "Guantes de moto", categoria: "Accesorios", imagen: "img/guantesdemoto.png", descripcion: "Guantes de motociclismo con protección en nudillos y palma reforzada para uso urbano y carretera.", caracteristicas: ["Cuero sintético resistente al viento", "Protección de nudillos", "Palma antideslizante reforzada", "Ajuste velcro en muñeca"] }
    };

    var datos = catalogoProductos[producto];
    if (!datos) return;

    nombreProducto.textContent = datos.nombre;

    var categoriaEl       = document.getElementById("categoriaProducto");
    var descripcionEl     = document.getElementById("descripcionProducto");
    var imagenEl          = document.getElementById("imagenProducto");
    var caracteristicasEl = document.getElementById("caracteristicasProducto");

    if (categoriaEl)   categoriaEl.textContent   = datos.categoria;
    if (descripcionEl) descripcionEl.textContent  = datos.descripcion;
    if (imagenEl)      { imagenEl.src = datos.imagen; imagenEl.alt = datos.nombre; }

    if (caracteristicasEl && datos.caracteristicas) {
        caracteristicasEl.innerHTML = "";
        datos.caracteristicas.forEach(function (c) {
            var li = document.createElement("li");
            li.textContent = "✔ " + c;
            caracteristicasEl.appendChild(li);
        });
    }

    document.title = "Roda Motos - " + datos.nombre;

    var btnWhatsApp = document.querySelector(".btn-whatsapp");
    if (btnWhatsApp) {
        var mensaje = encodeURIComponent("Hola, me interesa el producto: " + datos.nombre + ". ¿Está disponible?");
        btnWhatsApp.href = "https://wa.me/529531002370?text=" + mensaje;
    }
}

(function activarEfectoTyping() {
    var elemento = document.querySelector(".typing-texto");
    if (!elemento) return;

    var textos       = ["Filtros de aire", "Bujías", "Cadenas y piñones", "Aceite de motor", "Frenos y pastillas"];
    var indiceTexto  = 0;
    var indiceLetra  = 0;
    var borrando     = false;

    function escribir() {
        var textoActual = textos[indiceTexto];

        if (!borrando) {
            elemento.textContent = textoActual.substring(0, indiceLetra + 1);
            indiceLetra++;

            if (indiceLetra === textoActual.length) {
                borrando = true;
                setTimeout(escribir, 1600);
                return;
            }
        } else {
            elemento.textContent = textoActual.substring(0, indiceLetra - 1);
            indiceLetra--;

            if (indiceLetra === 0) {
                borrando = false;
                indiceTexto = (indiceTexto + 1) % textos.length;
            }
        }

        setTimeout(escribir, borrando ? 60 : 110);
    }

    escribir();
})();
var productosBD = [];

function normalizarTexto(texto) {
    return (texto || "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function escaparHTML(valor) {
    return (valor || "")
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function cargarJSON(ruta) {
    return fetch(ruta, { cache: "no-store" }).then(function (respuesta) {
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar " + ruta);
        }
        return respuesta.json();
    });
}

function cargarProductosDesdeBD() {
    var contenedor = document.getElementById("listaProductos");
    if (!contenedor) return;

    cargarJSON("data/productos.json")
        .then(function (productos) {
            productosBD = productos;
            renderizarProductos(productos);
            filtrarProductos("", obtenerCategoriaActiva());
        })
        .catch(function (error) {
            console.warn("Se usará el catálogo escrito en HTML porque no cargó productos.json:", error);
        });
}

function renderizarProductos(productos) {
    var contenedor = document.getElementById("listaProductos");
    if (!contenedor) return;

    contenedor.innerHTML = productos.map(function (producto) {
        var etiqueta = producto.etiqueta
            ? '<span class="etiqueta-producto">' + escaparHTML(producto.etiqueta) + '</span>'
            : '';

        var busqueda = normalizarTexto([
            producto.nombre,
            producto.categoria,
            producto.busqueda,
            producto.descripcionCorta
        ].join(" "));

        return '' +
            '<div class="producto" data-id="' + escaparHTML(producto.id) + '" data-categoria="' + escaparHTML(producto.categoriaClave) + '" data-nombre="' + escaparHTML(busqueda) + '">' +
                '<div class="producto-imagen-contenedor">' +
                    '<img src="' + escaparHTML(producto.imagen) + '" alt="' + escaparHTML(producto.alt || producto.nombre) + '">' +
                    etiqueta +
                '</div>' +
                '<div class="producto-info">' +
                    '<span class="producto-categoria">' + escaparHTML(producto.categoria) + '</span>' +
                    '<h3>' + escaparHTML(producto.nombre) + '</h3>' +
                    '<p>' + escaparHTML(producto.descripcionCorta) + '</p>' +
                    '<a href="#detalle" onclick="verDetalleProductoBD(\'' + escaparHTML(producto.id) + '\')" class="btn-ver-mas">Ver más →</a>' +
                '</div>' +
            '</div>';
    }).join("");
}

function verDetalleProductoBD(idProducto) {
    var producto = productosBD.find(function (item) { return item.id === idProducto; });
    if (!producto) return;

    if (typeof verDetalle === "function") {
        verDetalle(
            producto.nombre,
            producto.categoria,
            producto.imagen,
            producto.descripcion,
            producto.caracteristicas || []
        );
    }
}

function cargarServiciosDesdeBD() {
    var contenedor = document.getElementById("listaServicios");
    if (!contenedor) return;

    cargarJSON("data/servicios.json")
        .then(function (servicios) {
            contenedor.innerHTML = servicios.map(function (servicio) {
                var detalles = (servicio.detalles || []).map(function (detalle) {
                    return '<li>' + escaparHTML(detalle) + '</li>';
                }).join("");

                return '' +
                    '<div class="servicio-card">' +
                        '<div class="servicio-icono">' + escaparHTML(servicio.icono) + '</div>' +
                        '<h3>' + escaparHTML(servicio.nombre) + '</h3>' +
                        '<p>' + escaparHTML(servicio.descripcion) + '</p>' +
                        '<ul class="servicio-lista">' + detalles + '</ul>' +
                    '</div>';
            }).join("");
        })
        .catch(function (error) {
            console.warn("Se usará la sección escrita en HTML porque no cargó servicios.json:", error);
        });
}
