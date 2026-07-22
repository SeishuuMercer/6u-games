const allFrogs = document.querySelector(".frogs-container").children;
const allNenuphars = document.querySelectorAll(".nenuphar");

// Botón "Reiniciar"
const frogsContainer = document.querySelector(".frogs-container");
const originalFrogs = frogsContainer.innerHTML;

function resetFrogs() {
    frogsContainer.innerHTML = originalFrogs;
}



// Animación de salto
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



function jump(frog, side, steps) {
    // Cambio de pose y z-index
    Array.from(frog.children).forEach(pose => {
        pose.classList.toggle("invisible");
    });
    frog.style.zIndex = "1";

    // Animación de salto
    if (side === "left" && steps === "one") {
        frog.classList.add("jumpingOne");
        frog.style.transform = "translate(120%)";
        duration = 200;
    } else if (side === "left"  && steps === "two") {
        frog.classList.add("jumpingTwo");
        frog.style.transform = "translate(240%)";
        duration = 400;
    } else if (side === "right"  && steps === "one") {
        frog.classList.add("jumpingOne");
        frog.style.transform = "translate(-120%)";
        duration = 200;
    } else {
        frog.classList.add("jumpingTwo");
        frog.style.transform = "translate(-240%)";
        duration = 400;
    }

    setTimeout(function() {
        frog.style.removeProperty("transform");
        frog.classList.remove("jumping");

        // Cambio de pose y z-index
        Array.from(frog.children).forEach(pose => {
            pose.classList.toggle("invisible");
        });
        frog.style.removeProperty("z-index");

        // Intercambio rana <-> espacio
        let space = document.querySelector(".space");
        swapElements(frog, space);

        // Comprobación de resultado
        isCompleted();
    }, duration);
}

frogsContainer.addEventListener("mousedown", (e) => {
    const frog = e.target.closest(".frog");
    if (!frog) return;
    let allFrogsArray = Array.from(allFrogs);
        if (frog.classList.contains("left")) {
            if (allFrogs[Array.from(allFrogs).indexOf(frog)+1].classList.contains("space")) {
                jump(frog, "left", "one");
            } else if (allFrogs[Array.from(allFrogs).indexOf(frog)+2].classList.contains("space")) {
                jump(frog, "left", "two");
            }
        } else if (frog.classList.contains("right")) {
            if (allFrogs[Array.from(allFrogs).indexOf(frog)-1].classList.contains("space")) {
                jump(frog, "right", "one");
            } else if (allFrogs[Array.from(allFrogs).indexOf(frog)-2].classList.contains("space")) {
                jump(frog, "right", "two");
            }
        }
});



// Array.from(allFrogs).forEach(frog => {
//     frog.addEventListener("mousedown", (e) => {
//         let allFrogsArray = Array.from(allFrogs);
//         if (frog.classList.contains("left")) {
//             if (allFrogs[Array.from(allFrogs).indexOf(frog)+1].classList.contains("space")) {
//                 jump(frog, "left", "one");
//             } else if (allFrogs[Array.from(allFrogs).indexOf(frog)+2].classList.contains("space")) {
//                 jump(frog, "left", "two");
//             }
//         } else if (frog.classList.contains("right")) {
//             if (allFrogs[Array.from(allFrogs).indexOf(frog)-1].classList.contains("space")) {
//                 jump(frog, "right", "one");
//             } else if (allFrogs[Array.from(allFrogs).indexOf(frog)-2].classList.contains("space")) {
//                 jump(frog, "right", "two");
//             }
//         }
//     });
// });



// Rotar nenúfares
window.addEventListener("load", (e) => {
    allNenuphars.forEach(nenuphar => {
        nenuphar.style.rotate = Math.floor(Math.random() * 360) + "deg";
    });
});



// Reglas del puzzle
const rulesBtn = document.getElementById("rules-button");
const overlay = document.getElementById("overlay");
const closeBtn = document.querySelector(".close");

rulesBtn.addEventListener("click", () => {
    overlay.classList.add("show");
});

closeBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
});

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.classList.remove("show");
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        rulesOverlay.classList.remove("show");
    }
})



// Comprobación de resultado
function isCorrect() {

}

function isCompleted() {
    let allFrogsArray = Array.from(allFrogs);
    if (
        allFrogsArray[0].classList.contains("right") &&
        allFrogsArray[1].classList.contains("right") &&
        allFrogsArray[2].classList.contains("right") &&
        allFrogsArray[4].classList.contains("left") &&
        allFrogsArray[5].classList.contains("left") &&
        allFrogsArray[6].classList.contains("left")
    ) {
        allNenuphars.forEach(nenuphar => {
            nenuphar.classList.add("dance");
        });
    }
}