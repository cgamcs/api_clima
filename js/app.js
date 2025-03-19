document.addEventListener("DOMContentLoaded", () => {
    const resultado = document.querySelector('#weather-card');
    const formulario = document.querySelector('#search-form');

    if (!resultado || !formulario) {
        console.error("No se encontraron los elementos principales en el DOM.");
        return;
    }

    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
    e.preventDefault();

    const ciudad = document.querySelector('#location-input').value;
    const pais = document.querySelector('#country-select').value;

    if (ciudad === '' || pais === '') {
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }

    consultarAPI(ciudad, pais);
}

function consultarAPI(ciudad, pais) {
    const appId = config.API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}&units=metric&lang=es`;

    spinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML();

            console.log(datos)
            if (datos.cod === "404") {
                mostrarAlerta('Ciudad no encontrada');
                return;
            }

            mostrarClima(datos);

            eliminarSpinner();
        })
        .catch(error => console.error('Error en la API:', error));
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min, humidity }, weather, sys: { sunrise, sunset }, wind: { speed } } = datos;

    // Validar que el array `weather` tiene al menos un elemento
    const condition = weather.length > 0 ? weather[0].main : "Desconocido";
    const icon = weather.length > 0 ? weather[0].icon : "01d"; // Usa un ícono por defecto si no hay datos

    console.log(name);
    console.log(temp);
    console.log(temp_max);
    console.log(temp_min);
    console.log(humidity);
    console.log(condition);
    console.log(sunrise);
    console.log(sunset);

    // Validar que los elementos existen antes de modificar sus propiedades
    actualizarElemento('#location-display', name);
    actualizarElemento('#temperature-display', `${Math.round(temp)}`);
    actualizarElemento('#min-temp-display', `${Math.round(temp_min)}°C`);
    actualizarElemento('#max-temp-display', `${Math.round(temp_max)}°C`);
    actualizarElemento('#humidity-display', `${humidity}%`);
    actualizarElemento('#condition-display', condition);
    actualizarElemento('#sunrise-display', convertirHora(sunrise));
    actualizarElemento('#sunset-display', convertirHora(sunset));
    actualizarElemento('#updated-display', `${speed} mtr/seg`);

    actualizarIconoClima(icon);

    // Llamar a la función para actualizar las animaciones según la condición del clima
    updateWeatherAnimation(condition.toLowerCase());
}

function updateWeatherAnimation(condition) {
    // Limpiar animaciones anteriores
    weatherAnimation.innerHTML = '';

    // Mapear condiciones de la API a tus animaciones
    const conditionMap = {
        'clear': 'soleado',
        'clouds': 'parcialmente nublado',
        'rain': 'lluvioso',
        'thunderstorm': 'tormenta',
        'snow': 'nieve',
        'mist': 'niebla',
        // Agrega más mapeos según sea necesario
    };

    const mappedCondition = conditionMap[condition] || 'soleado'; // Usa 'soleado' como valor por defecto

    switch(mappedCondition) {
        case 'clear': // Si la API devuelve "clear" para un día soleado
        case 'soleado':
            // Crear rayos de sol
            for (let i = 0; i < 10; i++) {
                const ray = document.createElement('div');
                ray.className = 'sun-ray';
                ray.style.width = `${100 + Math.random() * 150}px`;
                ray.style.height = `${100 + Math.random() * 150}px`;
                ray.style.left = `${Math.random() * 100}%`;
                ray.style.top = `${Math.random() * 100}%`;
                ray.style.animationDelay = `${Math.random() * 4}s`;
                weatherAnimation.appendChild(ray);
            }
            break;
        case 'clouds': // Si la API devuelve "clouds" para nublado
        case 'parcialmente nublado':
            // Crear nubes
            for (let i = 0; i < 6; i++) {
                const cloud = document.createElement('div');
                cloud.className = 'cloud';
                cloud.style.width = `${100 + Math.random() * 100}px`;
                cloud.style.height = `${60 + Math.random() * 40}px`;
                cloud.style.top = `${20 + i * 30}px`;
                cloud.style.animationDuration = `${20 + i * 5}s`;
                cloud.style.animationDelay = `${Math.random() * 10}s`;
                weatherAnimation.appendChild(cloud);
            }
            break;
        case 'rain': // Si la API devuelve "rain" para lluvioso
        case 'lluvioso':
            // Crear gotas de lluvia
            for (let i = 0; i < 40; i++) {
                const drop = document.createElement('div');
                drop.className = 'rain-drop';
                drop.style.height = `${10 + Math.random() * 15}px`;
                drop.style.left = `${Math.random() * 100}%`;
                drop.style.animationDuration = `${0.6 + Math.random() * 0.5}s`;
                drop.style.animationDelay = `${Math.random() * 2}s`;
                weatherAnimation.appendChild(drop);
            }
            break;
        default:
            // No hacer nada o agregar una animación por defecto
            break;
    }
}

// Función auxiliar para actualizar elementos sin errores
function actualizarElemento(selector, valor) {
    const elemento = document.querySelector(selector);
    if (elemento) {
        elemento.textContent = valor;
    } else {
        console.error(`Elemento no encontrado: ${selector}`);
    }
}

function actualizarIconoClima(iconCode) {
    const weatherIcon = document.querySelector('#weather-icon');

    if (weatherIcon) {
        weatherIcon.innerHTML = ''; // 💡 Borra el ícono anterior
        const img = document.createElement('img');
        img.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        img.alt = "Condición del clima";
        img.classList.add('w-20', 'h-20'); // Ajusta el tamaño si es necesario
        weatherIcon.appendChild(img);

        // Cambia el contenido del :before a vacío
        weatherIcon.style.setProperty('--before-content', 'none');
    }
}

function convertirHora(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function mostrarAlerta(mensaje) {
    const alerta = document.querySelector('.alerta');
    if (!alerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-500', 'text-white', 'p-2', 'text-center', 'rounded-lg', 'mt-5', 'alerta');
        alerta.textContent = mensaje;
        document.querySelector('#search-form').appendChild(alerta);
        setTimeout(() => alerta.remove(), 3000);
    }
}

const resultado = document.querySelector('#weather-card');

function limpiarHTML() {
    const elementosActualizar = [
        '#location-display',
        '#temperature-display',
        '#min-temp-display',
        '#max-temp-display',
        '#humidity-display',
        '#condition-display',
        '#sunrise-display',
        '#sunset-display',
        '#updated-display',
        '#weather-icon'
    ];

    elementosActualizar.forEach(selector => {
        const elemento = document.querySelector(selector);
        if (elemento) {
            if (selector === '#weather-icon') {
                elemento.innerHTML = ''; // Solo limpia el ícono
            } else {
                elemento.textContent = ''; // Borra solo el contenido de texto
            }
        }
    });
}


function spinner() {
    limpiarHTML();
    const spinnerDiv = document.createElement('DIV');
    spinnerDiv.classList.add('spinner');
    spinnerDiv.innerHTML = `<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>`;
    resultado.appendChild(spinnerDiv);
}

function eliminarSpinner() {
    const spinner = document.querySelector('.spinner');
    if (spinner) {
        spinner.remove(); // Elimina el spinner del DOM
    }
}

// Función para obtener la ubicación del usuario
function obtenerUbicacionUsuario() {
    if (navigator.geolocation) {
        // Si el navegador soporta geolocalización
        navigator.geolocation.getCurrentPosition(
            (posicion) => {
                const latitud = posicion.coords.latitude;
                const longitud = posicion.coords.longitude;
                console.log("Coordenadas:", latitud, longitud);

                // Obtener el clima usando las coordenadas
                obtenerClimaPorCoordenadas(latitud, longitud);
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error);
                // Si hay un error, mostrar un clima por defecto
                consultarAPI("Monterrey", "MX");
            }
        );
    } else {
        console.error("Geolocalización no soportada por el navegador.");
        // Si el navegador no soporta geolocalización, mostrar un clima por defecto
        consultarAPI("Monterrey", "MX");
    }
}

// Función para obtener el clima usando coordenadas
function obtenerClimaPorCoordenadas(latitud, longitud) {
    const appId = config.API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${appId}&units=metric&lang=es`;

    fetch(url)
        .then((respuesta) => respuesta.json())
        .then((datos) => {
            if (datos.cod === "404") {
                mostrarAlerta("Ubicación no encontrada");
                return;
            }

            console.log(datos)

            // Mostrar el clima en la interfaz
            mostrarClima(datos);
        })
        .catch((error) => {
            console.error("Error al obtener el clima:", error);
            mostrarAlerta("Error al obtener el clima");
        });
}

// Función para mostrar un clima por defecto
function obtenerClimaPorDefecto() {
    const ciudadPorDefecto = "Madrid";
    const paisPorDefecto = "España";
    consultarAPI(ciudadPorDefecto, paisPorDefecto); // Usa la función existente para obtener el clima
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    obtenerUbicacionUsuario(); // Obtener la ubicación del usuario al cargar la página
});