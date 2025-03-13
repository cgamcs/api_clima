const container = document.querySelector('.container')
const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')
const buscador = document.querySelector('#buscador')

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima)
})

function buscarClima(e) {
    e.preventDefault()

    // Validar
    const ciudad = document.querySelector('#ciudad').value
    const pais = document.querySelector('#pais').value

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

            if(datos.cod === "404") {
                mostrarAlerta('Ciudad no encontrada')
                return
            }

            // Imprime la respuesta en el HTML
            mostrarClima(datos)
        })
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min } } = datos

    // Temperatura actual
    const actual = document.createElement('P')
    actual.innerHTML = `${kelvinACentigrados(temp)}°`
    actual.classList.add('font-semibold', 'text-9xl')

    // Titulo
    const nombreCiudad = document.createElement('P')
    nombreCiudad.textContent = `${name}`
    nombreCiudad.classList.add('font-semibold', 'text-6xl', 'mb-1')

    // Temperatura actual
    const tempMaxima = document.createElement('P')
    tempMaxima.innerHTML = `Max: ${kelvinACentigrados(temp_max)} &#8451;`
    tempMaxima.classList.add('text-xl')

    // Temperatura actual
    const tempMinima = document.createElement('P')
    tempMinima.innerHTML = `Min: ${kelvinACentigrados(temp_min)} &#8451;`
    tempMinima.classList.add('text-xl')

    // Div de temperatura maxima y minima
    const resultadoMaxMin = document.createElement('DIV')
    resultadoMaxMin.classList.add('flex', 'gap-5', 'text-sm')
    resultadoMaxMin.appendChild(tempMaxima)
    resultadoMaxMin.appendChild(tempMinima)

    // Div con la informacion
    const infoDiv = document.createElement('DIV')
    infoDiv.appendChild(nombreCiudad)
    infoDiv.appendChild(resultadoMaxMin)

    // Div contenedor
    const resultadoDiv = document.createElement('DIV')
    resultadoDiv.classList.add('text-white', 'flex', 'gap-5', 'items-end')
    resultadoDiv.appendChild(actual)
    resultadoDiv.appendChild(infoDiv)

    resultado.appendChild(resultadoDiv)
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