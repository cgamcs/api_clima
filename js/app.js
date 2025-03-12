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
            console.log(datos)
            if(datos.cod === "404") {
                mostrarAlerta('Ciudad no encontrada')
                return
            }
            mostrarClima(datos)
        })
}

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