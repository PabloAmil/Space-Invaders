const grid = document.querySelector('.grid')
const width = 15; // es 15 porque la grilla es de 15 x 15
let currentShooterIndex = 202 // le da una posicion inicial al shooter
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let paused = false

const sound = new Audio('./assets/shooting.wav') // para mas adelante...


for (let i = 0; i < 225; i++) { // con un ciclo for recorre toda la grilla y crea un square de 20 x 20 (porque los divs que esten dentro del grid son de 20 x 20) son 15 x 15
    const square = document.createElement('div')
    grid.appendChild(square) // con esto los mete como childs del grid
};

const squares = Array.from(document.querySelectorAll('.grid div')) // con array.from hace un array de todos los div que estan dentro de la grilla y los asigna a squares

const alienInvaders = [ // estos son los indices donde van a estar las naves enemigas
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];



function draw() {
    for (let i = 0; i < alienInvaders.length; i++) { // recorre el array alienInvaders y a cada uno le agrega la clase "invader"

        if (!aliensRemoved.includes(i)) { // si aliensRemoved NO incluye el indice al que se le disparo, se agrega la clase 'invader', sino ya no lo dibuja
            squares[alienInvaders[i]].classList.add('invader') // dentro del array squares, busca todos los indices de alienInvaders se les agrega la clase 'invader' 
            //para entenderlo bien: alienInvaders[10] es el indice 11 de alienInvaders y su valor es el numero 15 en ese array; para saquares , va a tomar ese numero 15 y lo va a pasar como un indice, que seria el cuadro 16 porque cuenta desde 0
        }
    }
}
draw()

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

squares[currentShooterIndex].classList.add('shooter') // toma la posicion actual y le agregar la clase shooter

for (let i = 0; i < 15; i++) {
    squares[i].classList.add('limit')

}

function moveShooter(e) { // para mover y limitar el movimiento del jugador

    squares[currentShooterIndex].classList.remove('shooter')

    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1 // si el numero NO es divisible por 15 se puede mover a la izquierda
            console.log(currentShooterIndex)
            break
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1 // si al dividirlo por 15, el resto es menor a 14 entonces se puede mover a la derecha, si es 14 entonces NO puede como seria el caso de un supuesto indice 209
            console.log(currentShooterIndex)
            break
    }
    squares[currentShooterIndex].classList.add('shooter')
}

document.addEventListener('keydown', moveShooter)


function moveInvaders() {

    const leftEdge = alienInvaders[0] % width === 0 // cualquier alien que tenga el primer indice de la izquierda y que el indice de la izquierda al ser dividido por 15 de 0 de resto
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1 // cualquier alien que tenga el ultimo indice de la derecha y que al dividir por 15 da 14 de resto  
    remove() // los quita a todos

    if (rightEdge && goingRight) { // si el indice del ultimo de la derecha al dividirse por 15 el resto es 14 y ademas goingRight es true, pasa esto:
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1 // a cada uno le suma 16, haciendolo bajar paralelo al limite derecho
            direction = -1 // redefine la direccion
            goingRight = false // cambien el goingRight a false
        }
    }

    if (leftEdge && !goingRight) { // si no esta yendo a hacia la derecha, es decir, si goingRight es false
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1 // a cada uno le suma 14, esto hace que baje paralelo al limite izquierdo
            direction = 1 // redefine la direccion
            goingRight = true // reestablece el goingRight como true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction // la proxima vez que los dibuje, va a ser aumentando o disminuyendo el indice de todos los que estan dentro del array de alienInvaders. nota: el nuevo valor se asigna a alienInvaders aun si es dentro de una funcion, lo devuelve
    }
    draw() // los vuelve a dibujar aplicandoles el valor de direccion al indice de cada uno para que de desplacen a la derecha o izquierda, cada medio segundo vuelve a comprobar

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) { // si el cuadro que contiene al personaje tambien contiene al invasor, se detiene el movimiento y desp veo que hago
        clearInterval(invadersId)
        squares[currentShooterIndex].classList.add('boom')
        document.removeEventListener('keydown', moveShooter)
        document.removeEventListener('keydown', shoot)
        Swal.fire({
            title: 'Game Over',
            showDenyButton: true,
            confirmButtonText: 'Play again',
            denyButtonText: `Quit`,
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(location.reload())
            } else if (result.isDenied) {
                window.location.href = "http://www.google.com"
            }
        })
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] + width > width * width) {
            clearInterval(invadersId)
            document.removeEventListener('keydown', moveShooter)
            document.removeEventListener('keydown', shoot)
            Swal.fire({
                title: 'Game Over',
                showDenyButton: true,
                confirmButtonText: 'Play again',
                denyButtonText: `Quit`,
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(location.reload())
                } else if (result.isDenied) {
                    window.location.href = "http://www.google.com"
                }
            })
        }
    }

    if (aliensRemoved.length === alienInvaders.length) {
        clearInterval(invadersId)
        document.removeEventListener('keydown', moveShooter)
        document.removeEventListener('keydown', shoot)
        Swal.fire({
            title: 'You won!!',
            showDenyButton: true,
            confirmButtonText: 'Play again',
            denyButtonText: `Quit`,
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(location.reload())
            } else if (result.isDenied) {
                window.location.href = "http://www.google.com"
            }
        })
    }
}

console.log(squares.length)
invadersId = setInterval(moveInvaders, 250)

function shoot(e) {

    
    let laserId
    let currentLaserIndex = currentShooterIndex // toma el mismo indice que el shooter

    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser') // siempre lo tiene que remover porque sino queda el rastro
        currentLaserIndex -= width // el movimiento del laser
        squares[currentLaserIndex].classList.add('laser')


        if (squares[currentLaserIndex].classList.contains('invader', 'laser')) {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')


            clearInterval(laserId)
            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300) // despues de 300 milisegundos quita la explosion

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
        }
        if (squares[currentLaserIndex].classList.contains('limit', 'laser')) {
            squares[currentLaserIndex].classList.remove('laser')
            clearInterval(laserId)
        }
    }
    switch (e.key) {
        case 'ArrowUp':
            laserId = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keydown', shoot)
document.addEventListener('keydown', pause)

function pause(e) {

    if (e.key === "Enter" && paused === false) {
        clearInterval(invadersId)
        document.removeEventListener('keydown', moveShooter)
        document.removeEventListener('keydown', shoot)
        paused = true

    } else if (e.key === "Enter" && paused === true) {
        invadersId = setInterval(moveInvaders, 200)
        document.addEventListener('keydown', moveShooter)
        document.addEventListener('keydown', shoot)
        paused = false
    }
}