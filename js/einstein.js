let clueList = Array.from(document.querySelector(".clues").children);

// Tachar pista al hacer click
clueList.forEach(clue => {
    clue.addEventListener("click", e => {
        clue.classList.toggle("checked");
    })
});

// Desactivar "draggable" a las imágenes
const allImages = document.querySelectorAll("img");
for (image of allImages) image.draggable = false;

// Desactivar texto seleccionable en las cartas
const allCards = document.querySelectorAll(".card");
for (card of allCards) card.classList.add("unselectable");



// Filas de categorías reordenables
const allGrippers = document.querySelectorAll(".gripper");
let draggedRow = null;

allGrippers.forEach(gripper => {

    gripper.addEventListener("dragstart", (e) => {
        draggedRow = gripper.parentElement;
        draggedRow.classList.add("dragging");
        draggedRow.style.opacity = "0.5";
        e.dataTransfer.setData("text/plain", ""); // Firefox
    });

    gripper.addEventListener("dragend", () => {
        draggedRow.classList.remove("dragging");
        draggedRow.style.removeProperty("opacity");
        draggedRow = null;
    });

    gripper.addEventListener("dragover", (e) => {
        e.preventDefault();
        gripper.style.backgroundColor = "yellow";
    });

    gripper.addEventListener("dragleave", (e) => {
        e.preventDefault();

        gripper.style.removeProperty("background-color");
    })

    gripper.addEventListener("drop", (e) => {
        e.preventDefault();
        gripper.style.removeProperty("background-color");
        const targetRow = gripper.parentElement;
        if (draggedRow === targetRow) return;
        swapElements(draggedRow, targetRow);
    });
});

function swapElements(el1, el2) {
    const parent = el1.parentNode;
    const next1 = el1.nextSibling;
    const next2 = el2.nextSibling;

    if (next1 === el2) {
        parent.insertBefore(el2, el1);
    }
    else if (next2 === el1) {
        parent.insertBefore(el1, el2);
    }
    else {
        parent.insertBefore(el1, next2);
        parent.insertBefore(el2, next1);
    }
}



// Cartas arrastrables
const allCells = document.querySelectorAll(".cell");
const desk = document.querySelector("#cards-desk");
let startX=0, startY=0, newX=0, newY=0;

allCards.forEach(card => {
    card.addEventListener("mousedown", mouseDown);

    function mouseDown(e){
        card.style.cursor = "grabbing";
        // Guardar coordenadas al hacer clic
        startX = e.clientX;
        startY = e.clientY;

        // Sacar carta del tablero (si es el caso)
        if (card.parentElement.classList.contains("cell")) {
            let cardRect = card.getBoundingClientRect();

            card.removeAttribute("style");
            card.style.cursor = "grabbing";
            card.style.position = "absolute";
            desk.appendChild(card);
            card.style.left = (startX - desk.offsetLeft - (cardRect.width/2)) + "px";
            card.style.top = (startY - desk.offsetTop - (cardRect.height/2)) + "px";
        }

        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
    }

    function mouseMove(e){
        // Mover carta mientras el ratón se mantenga pulsado
        newX = startX - e.clientX;
        newY = startY - e.clientY;

        startX = e.clientX;
        startY = e.clientY;

        card.style.left = (card.offsetLeft - newX) + "px";
        card.style.top  = (card.offsetTop  - newY) + "px";

        // Interactuar con las celdas del tablero
        allCells.forEach(cell => {
            if (areColliding(cell, card)) {
                cell.style.backgroundColor = "yellow";
            } else {
                cell.style.removeProperty("background-color");
            }
        });
    }

    function mouseUp(e){
        // Dejar de mover la carta al dejar de mantener pulsado el ratón
        card.style.removeProperty("cursor");
        document.removeEventListener("mousemove", mouseMove);
        
        // Colocar carta en la celda
        allCells.forEach(cell => {
            if (areColliding(cell, card)) {
                card.style.removeProperty("left");
                card.style.removeProperty("top");
                card.style.position = "relative";
                card.style.width = "100%";
                card.style.height = "100%";
                cell.style.paddingBottom = "0";
                cell.style.backgroundColor = "black";
                cell.appendChild(card);
            }
        });
    }
    
    function areColliding(el1, el2) {
        let a = el1.getBoundingClientRect();
        let b = el2.getBoundingClientRect();
        return !(
            ((a.y + (a.height / 2)) < (b.y)) ||
            (a.y > (b.y + (b.height / 2))) ||
            ((a.x + (a.width / 2)) < b.x) ||
            (a.x > (b.x + (b.width / 2)))
        );
    }
});



// Convertir cartas a "position: absolute" tras haberse ordenado mediante "flex-wrap"
window.addEventListener("load", () => {
    const deskRect = desk.getBoundingClientRect();

    // Guardar posiciones antes de aplicar "absolute"
    const positions = [];

    allCards.forEach(card => {
        const cardRect = card.getBoundingClientRect();

        positions.push({
            card,
            left: cardRect.left - deskRect.left,
            top: cardRect.top - deskRect.top
        });
    });

    // Después cambiar a "absolute"
    positions.forEach(({ card, left, top }) => {
        card.style.position = "absolute";
        card.style.left = `${left}px`;
        card.style.top = `${top}px`;
    });
});



// Comprobar resultado
function isResultCorrect() {
    const colorCells = document.querySelectorAll("#colors-row .cell");
    const nationCells = document.querySelectorAll("#nationalities-row .cell");
    const petCells = document.querySelectorAll("#pets-row .cell");
    const drinkCells = document.querySelectorAll("#drinks-row .cell");
    const tobaccoCells = document.querySelectorAll("#tobaccos-row .cell");

    // Comprobar que todas las celdas están ocupadas
    if (
        colorCells[0].firstChild &&
        colorCells[1].firstChild &&
        colorCells[2].firstChild &&
        colorCells[3].firstChild &&
        colorCells[4].firstChild &&

        nationCells[0].firstChild &&
        nationCells[1].firstChild &&
        nationCells[2].firstChild &&
        nationCells[3].firstChild &&
        nationCells[4].firstChild &&

        petCells[0].firstChild &&
        petCells[1].firstChild &&
        petCells[2].firstChild &&
        petCells[3].firstChild &&
        petCells[4].firstChild &&

        drinkCells[0].firstChild &&
        drinkCells[1].firstChild &&
        drinkCells[2].firstChild &&
        drinkCells[3].firstChild &&
        drinkCells[4].firstChild &&

        tobaccoCells[0].firstChild &&
        tobaccoCells[1].firstChild &&
        tobaccoCells[2].firstChild &&
        tobaccoCells[3].firstChild &&
        tobaccoCells[4].firstChild
    ) {
        // Comprobar que cada carta está en su celda correcta
        if (
        colorCells[0].firstChild.id === "yellow" &&
        colorCells[1].firstChild.id === "blue" &&
        colorCells[2].firstChild.id === "red" &&
        colorCells[3].firstChild.id === "green" &&
        colorCells[4].firstChild.id === "white" &&
        
        nationCells[0].firstChild.id === "norway" &&
        nationCells[1].firstChild.id === "denmark" &&
        nationCells[2].firstChild.id === "united-kingdom" &&
        nationCells[3].firstChild.id === "germany" &&
        nationCells[4].firstChild.id === "sweden" &&

        petCells[0].firstChild.id === "cat" &&
        petCells[1].firstChild.id === "horse" &&
        petCells[2].firstChild.id === "bird" &&
        petCells[3].firstChild.id === "fish" &&
        petCells[4].firstChild.id === "dog" &&

        drinkCells[0].firstChild.id === "water" &&
        drinkCells[1].firstChild.id === "tea" &&
        drinkCells[2].firstChild.id === "milk" &&
        drinkCells[3].firstChild.id === "coffee" &&
        drinkCells[4].firstChild.id === "beer" &&

        tobaccoCells[0].firstChild.id === "dunhill" &&
        tobaccoCells[1].firstChild.id === "blends" &&
        tobaccoCells[2].firstChild.id === "pall-mall" &&
        tobaccoCells[3].firstChild.id === "prince" &&
        tobaccoCells[4].firstChild.id === "blue-master" 
        ) {
            console.log(true);
            correctResult();
        } else {
            console.log(false);
            wrongResult();
        }
    } else {
        console.log(false);
        wrongResult();
    }
}

const table = document.querySelector("#all-categories");
const correct = document.querySelector(".correct");
const wrong = document.querySelector(".wrong");

function correctResult() {
    table.style.transition = "0.3s ease";
    table.style.backgroundColor = "#0e0";
    correct.classList.add("active");
    // Esperar 1 segundo antes de ejecutar la función
    setTimeout(function() {
        table.style.removeProperty("background-color");
        correct.classList.remove("active");
    }, 5000);
}

function wrongResult() {
    table.style.transition = "0.3s ease";
    table.style.backgroundColor = "red";
    wrong.classList.add("active");
    // Esperar 1 segundo antes de ejecutar la función
    setTimeout(function() {
        table.style.removeProperty("background-color");
        wrong.classList.remove("active");
    }, 1500);
}
