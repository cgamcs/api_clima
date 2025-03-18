const container = document.querySelector('.container')
const resultado = document.querySelector('#weather-card')
const formulario = document.querySelector('#search-form')
const buscador = document.querySelector('#buscador')

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima)
})

function buscarClima(e) {
    e.preventDefault()

    // Validar
    const ciudad = document.querySelector('#location-input').value
    const pais = document.querySelector('#country-select').value

    console.log(ciudad)
    console.log(pais)

    if(ciudad === '' || pais === '') {
        mostrarAlerta('Todos los campos son obligatorios')
        return
    }

    // Consultar API
    consultarAPI(ciudad, pais)
}

function consultarAPI(ciudad, pais) {
    const appId = config.API_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    // Muestra un spinner de carga
    spinner()

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML()

            console.log(datos)
            if(datos.cod === "404") {
                mostrarAlerta('Ciudad no encontrada')
                return
            }

            // Imprime la respuesta en el HTML
            mostrarClima(datos)
        })
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min, humidity }, sys: { sunrise, sunset } } = datos

    // Temperatura actual
    const actual = document.querySelector('#temperature-display')
    actual.innerHTML = `${kelvinACentigrados(temp)}`
}

const kelvinACentigrados = grados => parseInt(grados - 273.15)

function mostrarAlerta(mensaje) {
    const alerta = document.querySelector('.alerta')
    
    if(!alerta) {
        const alerta = document.createElement('p')
        alerta.classList.add('bg-red-500', 'text-white', 'p-2', 'text-center', 'rounded-lg', 'mt-5', 'alerta')
        alerta.textContent = mensaje
        buscador.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000)
    }
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function spinner() {
    limpiarHTML()

    const spinnerDiv = document.createElement('DIV')
    spinnerDiv.classList.add('spinner')
    spinnerDiv.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `

    resultado.appendChild(spinnerDiv)
}