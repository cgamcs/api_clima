const container = document.querySelector('.container')
const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')

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
    const { main: { temp, temp_max, temp_min } } = datos

    const actual = document.createElement('P')
    actual.innerHTML = `${kelvinACentigrados(temp)} &#8451;`
    actual.classList.add('font-bold', 'text-6xl')

    const resultadoDiv = document.createElement('DIV')
    resultadoDiv.classList.add('text-center', 'text-white')
    resultadoDiv.appendChild(actual)

    resultado.appendChild(resultadoDiv)
}

const kelvinACentigrados = grados => parseInt(grados - 273.15)

function mostrarAlerta(mensaje) {
    const alerta = document.querySelector('.alerta')
    
    if(!alerta) {
        const alerta = document.createElement('p')
        alerta.classList.add('bg-red-500', 'text-white', 'p-2', 'text-center', 'rounded-lg', 'mt-5', 'alerta')
        alerta.textContent = mensaje
        formulario.appendChild(alerta)

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