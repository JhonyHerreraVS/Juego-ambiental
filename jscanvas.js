const canvas = document.getElementById("rutaCanvas");
const ctx = canvas.getContext("2d");
const logDiv = document.getElementById("log");
const eppSelectionDiv = document.getElementById("eppSelection");

const paradas = ["Parada 1", "Parada 2", "Parada 3", "Parada 4", "Parada 5"];
const recolectores = {
    "Recolector 1": [],
    "Recolector 2": [],
    "Recolector 3": []
};

const epps = [
    { name: "Casco", img: "resource/img/cascoverde.png" },
    { name: "Guantes", img: "resource/img/guantes.webp" },
    { name: "Chaleco Reflectante", img: "resource/img/chaleco.png" },
    { name: "Gafas de Seguridad", img: "resource/img/gafas.jpg" },
    { name: "Mascarilla", img: "resource/img/mascarilla.png" }
];

const paradaPosiciones = [
    { x: 50, y: 100 },
    { x: 150, y: 200 },
    { x: 250, y: 100 },
    { x: 350, y: 200 },
    { x: 450, y: 100 }
];

let currentParadaIndex = 0;
let currentRecolector = "";

function drawRuta() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "springgreen";
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    // Dibujar las líneas de ruta
    for (let i = 0; i < paradaPosiciones.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(paradaPosiciones[i].x, paradaPosiciones[i].y);
        ctx.lineTo(paradaPosiciones[i + 1].x, paradaPosiciones[i + 1].y);
        ctx.stroke();
    }

    // Dibujar las paradas
    for (let i = 0; i < paradaPosiciones.length; i++) {
        ctx.beginPath();
        ctx.arc(paradaPosiciones[i].x, paradaPosiciones[i].y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeText(paradas[i], paradaPosiciones[i].x - 20, paradaPosiciones[i].y - 15);
    }

    // Dibujar el camión de basura en la parada actual
    ctx.fillStyle = "red";
    const pos = paradaPosiciones[currentParadaIndex];
    ctx.fillRect(pos.x - 10, pos.y - 20, 20, 20);
}

function logMessage(message) {
    logDiv.innerHTML += `<p>${message}</p>`;
    logDiv.scrollTop = logDiv.scrollHeight;
}

function verificarEPP() {
    for (let recolector in recolectores) {
        let missingEpps = epps.map(epp => epp.name).filter(epp => !recolectores[recolector].includes(epp));
        if (missingEpps.length > 0) {
            logMessage(`Error: ${recolector} no está usando ${missingEpps.join(", ")} correctamente.`);
            return false;
        }
    }
    return true;
}

function selectRecolector(recolector) {
    currentRecolector = recolector;
    eppSelectionDiv.innerHTML = `<h3>Seleccione los EPPs para ${recolector}</h3>`;

    epps.forEach(epp => {
        const eppImg = document.createElement("img");
        eppImg.src = epp.img;
        eppImg.alt = epp.name;
        eppImg.title = epp.name;
        eppImg.classList.add("eppImg");

        if (recolectores[recolector].includes(epp.name)) {
            eppImg.classList.add("selected");
        }

        eppImg.addEventListener("click", () => {
            if (eppImg.classList.contains("selected")) {
                eppImg.classList.remove("selected");
                recolectores[recolector] = recolectores[recolector].filter(selectedEpp => selectedEpp !== epp.name);
            } else {
                eppImg.classList.add("selected");
                recolectores[recolector].push(epp.name);
            }
        });

        const eppContainer = document.createElement("div");
        eppContainer.classList.add("recolectorEpp");
        eppContainer.appendChild(eppImg);

        eppSelectionDiv.appendChild(eppContainer);
    });

    const nextButton = document.createElement("button");
    nextButton.textContent = "Confirmar y Continuar";
    nextButton.setAttribute('class','confirm');
    nextButton.addEventListener("click", () => iniciarRuta());
    eppSelectionDiv.appendChild(nextButton);
}

function iniciarRuta() {
    eppSelectionDiv.innerHTML = "";

    if (currentParadaIndex < paradas.length) {
        logMessage(`Llegando a la ${paradas[currentParadaIndex]}...`);

        let recolectoresListos = verificarEPP();

        if (recolectoresListos) {
            logMessage("EPP en orden, procediendo con la recolección.");
            drawRuta();
            logMessage(`Recolección de residuos en progreso en la ${paradas[currentParadaIndex]}.`);

            currentParadaIndex++;
            if (currentParadaIndex < paradas.length) {
                setTimeout(() => {
                    const nextRecolector = Object.keys(recolectores)[currentParadaIndex % Object.keys(recolectores).length];
                    selectRecolector(nextRecolector);
                }, 2000);
            } else {
                logMessage("Ruta de recolección completada.");
            }
        } else {
            logMessage("Por favor, ajusten el uso del EPP.");
            selectRecolector(currentRecolector);
        }
    }
}

drawRuta();
selectRecolector("Recolector 1"); // Empieza con el primer recolector
