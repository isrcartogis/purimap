L.Control.Logo = L.Control.extend({
    onAdd: function(map) {
        this._container = L.DomUtil.create('a');
        this._container.href = "https://isrcartogis.wixsite.com/isrcartogis";
        this._container.style.cursor = "pointer";
        this._container.target = "_blank";
        this._container.rel="noreferrer noopener"
        L.DomEvent.disableScrollPropagation(this._container)

        let img =  L.DomUtil.create('img');
        img.src = '../logo.png';
        img.style.width = '150px';
        img.style.marginBottom = "10%"

        this._container.append(img)

        return this._container;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

L.control.logo = function(opts) {
    return new L.Control.Logo(opts);
}

L.Control.Question = L.Control.extend({
    options: {
        ids: [9000,3000,5000,2000]
    },
    onAdd: function(map){
        this._container = L.DomUtil.create('div','leaflet-bar questions');
        L.DomEvent.disableScrollPropagation(this._container)

        let header = L.DomUtil.create('h3');
        header.innerText = "מי אני?"
        this._container.append(header)

        for(var i=0;i<this.options.ids.length;i++){
            let cityName = L.DomUtil.create('input');
            cityName.type = "button";
            cityName.name = "citySelect";
            cityName.id = features.filter(x => x.properties.SEMEL_YISH === this.options.ids[i])[0].properties.SEMEL_YISH
            cityName.value = features.filter(x => x.properties.SEMEL_YISH === this.options.ids[i])[0].properties.Shem_Yishu
            cityName.onclick = getAnswer
            this._container.append(cityName,L.DomUtil.create('br'))
        }

        return this._container;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
})
L.control.question = function(opts) {
    return new L.Control.Question(opts);
}

L.Control.Continue = L.Control.extend({
    options : {
        score:0,
        tries:0
    },

    onAdd: function(map) {

        this._container = L.DomUtil.create('div','leaflet-bar continue');
        L.DomEvent.disableScrollPropagation(this._container)

        let header = L.DomUtil.create('h2');
        header.innerText = "התוצאה שלך"
        this._container.append(header)

        let score = L.DomUtil.create('h1');
        score.innerText = ` ${this.options.score} / ${this.options.tries} `;
        this._container.append(score);


        let again = L.DomUtil.create('input');
        again.type = "button"
        again.id = "again";
        again.value = "נשחק שוב?"
        again.onclick = getNewRandoms;

        let seeScores = L.DomUtil.create('input');
        seeScores.type = "button"
        seeScores.id = "seeScores";
        seeScores.value = "נסיים ונשלח את התוצאה"
        seeScores.onclick = getUserName;

        this._container.append(again, seeScores);


        return this._container;

    },
    onRemove: function(map) {
        // Nothing to do here
    }
})
L.control.continue = function(opts) {
    return new L.Control.Continue(opts);
}

L.Control.WhatsYourName = L.Control.extend({
    onAdd: function(map) {
        this._container = L.DomUtil.create('div', 'leaflet-bar name-input');
        L.DomEvent.disableScrollPropagation(this._container);
        this._container.id = "whatsyourname";

        let nameInput = L.DomUtil.create('input');
        nameInput.type = "text";
        nameInput.id = "nameInput";

        let nameLabel = L.DomUtil.create('label');
        nameLabel.innerText = "שם: ";

        let sendInput = L.DomUtil.create('input');
        sendInput.type = "button";
        sendInput.value = "שליחת תוצאה"
        sendInput.onclick = async function(){
            userName = document.getElementById("nameInput").value ? document.getElementById("nameInput").value : "";
            updated = await sendScore(userName,userPoints,tries)
            Promise.all([updated])
            .then(openScoreboard())
            
        }

        this._container.append(nameLabel,nameInput,L.DomUtil.create('br'),sendInput);
        return this._container;
    },
    onRemove: function(map) {}
})
L.control.whatsyourname = function(opts) {
    return new L.Control.WhatsYourName(opts);
}

L.Control.Leaderboard = L.Control.extend({
    onAdd: function(map) {
        //let topPlayers = await getUpdatedLeaderboard()
        console.log(playersList)
        this._container = L.DomUtil.create('div', 'leaflet-bar');
        L.DomEvent.disableScrollPropagation(this._container)
        this._container.id = "leaderboard"
        topPlayers = playersList.sort(function (a, b) {return b.score - a.score});
        let trophy = L.DomUtil.create('h1')
        trophy.innerText = "  🏆  "
        this._container.append(trophy)
        
        for(var i=0;i<10;i++){
            let player = topPlayers[i]
            if(player && player.user && player.score){
                let row = L.DomUtil.create('div','row');
                let name = L.DomUtil.create('div','name');
                if(i === 0){
                    name.innerText = " 🥇 " + player.user 
                }else if(i === 1){
                    name.innerText = " 🥈 " + player.user 
                }else if(i === 2){
                    name.innerText = " 🥉 " + player.user 
                }else{
                    name.innerText = player.user
                }
                
                let score = L.DomUtil.create('div','score');
                score.innerText = player.score
                row.append(name,score)
                
                this._container.append(row)
            }
        }

        let playAgain = L.DomUtil.create('input','refresh');
        playAgain.type = "button";
        playAgain.value = "משחק נוסף?"
        playAgain.onclick = function(){
            window.location.reload()
        }

        this._container.append(playAgain)
        
        return this._container;
        
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});
L.control.leaderboard = function(opts) {
    return new L.Control.Leaderboard(opts);
}

