var gestioneOstacoli = {
    lista: [],

    genera: function () {
        let frequenza = (mondo === 1) ? 50 : 40;

        if (frameNo % frequenza === 0) {
            let x = canvas.width;
            let base = canvas.height - ground;
            let scelta = Math.floor(Math.random() * 3);
            let coloreTubi = (mondo === 2) ? "#1b5e20" : "green";

            if (scelta == 0) {
                this.lista.push(new obstacleComponent(45, 70, x, base - 70, coloreTubi, "tubo"));
            } else if (scelta == 1) {
                let numeroCubi = (mondo === 1) ? 3 : 4; 
                for (let i = 0; i < numeroCubi; i++) {
                    this.lista.push(new obstacleComponent(35, 35, x + (i * 35), base - 80, "#CD853F", "cubo"));
                }
            } else if (scelta == 2) {
                this.lista.push(new obstacleComponent(30, 30, x, base - 40, "darkred", "nemico"));
            }
        }
    },

    aggiorna: function () {
        for (let obs of this.lista) {
            let velocita = (mondo === 1) ? 5 : 7;
            obs.x -= velocita;

            if (!obs.passed && obs.x + obs.width < player.x) {
                obs.passed = true;
                score += 10;
            }
            this.disegna(obs);
        }
        this.lista = this.lista.filter(o => o.x + o.width > 0);
    },

    disegna: function (obs) {
        ctx.fillStyle = "black";
        ctx.fillRect(obs.x - 2, obs.y - 2, obs.width + 4, obs.height + 4);
        ctx.fillStyle = obs.colore;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        if (obs.tipo == "cubo") {
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(obs.x + 5, obs.y + 5, obs.width - 10, obs.height - 10);
        }
        if (obs.tipo == "tubo") {
            ctx.fillStyle = "black";
            ctx.fillRect(obs.x - 6, obs.y, obs.width + 12, 15);
            ctx.fillStyle = obs.colore;
            ctx.fillRect(obs.x - 4, obs.y + 2, obs.width + 8, 11);
        }
    }
};

function obstacleComponent(width, height, x, y, colore, tipo) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.colore = colore;
    this.tipo = tipo;
    this.passed = false;
}