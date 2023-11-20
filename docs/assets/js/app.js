const miModulo = (() => {
    'use strict'

    let deck = [];
    const
        tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores;

    // referencias del DOM
    const
        btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo'),
        puntosMostrador = document.querySelectorAll('small');
    let divCartasJugadores = document.querySelectorAll('.divCartas');


    // funcion para inicializar el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = crearJugadores(numJugadores);
        puntosMostrador.forEach(e => e.innerText = '');
        divCartasJugadores.forEach(e => e.innerHTML = '');
        btnPedir.disabled = false;
        btnDetener.disabled = false;

    };

    const crearDeck = () => {

        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }
        for (let tipo of tipos) {
            especiales.forEach(e => deck.push(e + tipo))
        }
        return _.shuffle(deck);
    };

    // funcion que establece el espacio para cada jugador
    const crearJugadores = (numJugadores) => {
        let listaJugadores = new Array(numJugadores);
        for (let i = 0; i < listaJugadores.length; i++) {
            listaJugadores[i] = 0;
        }
        return listaJugadores;
    }


    // Funcion para tomar una carta
    const pedirCarta = () => {
        if (deck.length !== 0) {
            return deck.pop();
        }
        throw 'No hay cartas en el deck';
    };

    const valorCarta = (carta) => {

        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ?
            (valor === 'A') ? 11 : 10
            : parseInt(valor);
    }

    // Turno: 0 = primer jugador, ..., ultimo = computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] += valorCarta(carta);
        puntosMostrador[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    };

    const determinarGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores;
        setTimeout(() => {
            if (puntosComputadora === puntosMinimos) {
                alert('Nadie gana, :(');
            } else if (puntosMinimos > 21) {
                alert('La computadora gana');
            } else if (puntosComputadora > 21) {
                alert('Jugador gana');
            } else {
                alert('Computadora gana');
            }
        }, 10);
    }

    // turno de la computadora
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1)
        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador()
    };

    // Eventos
    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        let puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            console.warn('Perdiste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            console.warn('21!!!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;

        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });

    return {
        nuevoJuego: inicializarJuego,
    };

})();
