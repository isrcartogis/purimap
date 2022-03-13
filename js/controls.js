L.Control.Logo = L.Control.extend({
    onAdd: function(map) {
        this._container = L.DomUtil.create('a');
        this._container.href = "https://isrcartogis.wixsite.com/isrcartogis";
        this._container.style.cursor = "pointer";
        this._container.target = "_blank";
        this._container.rel="noreferrer noopener"

        let img =  L.DomUtil.create('img');
        img.src = '../logo.png';
        img.style.width = '150px';

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
        score:0
    },

    onAdd: function(map) {

        this._container = L.DomUtil.create('div','leaflet-bar continue');
        let header = L.DomUtil.create('h2');
        header.innerText = "התוצאה שלך"
        this._container.append(header)

        let score = L.DomUtil.create('h1');
        score.innerText = this.options.score;
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

L.Control.Leaderboard = L.Control.extend({
    onAdd: function(map) {
        let topPlayers = getUpdatedLeaderboard()
        this._container = L.DomUtil.create('div');
        this._container.id = "leaderboard"

        /*
        <div id="container">
            <div class="row">
                <div class="name">Player1</div><div class="score">430</div>
            </div>

            <div class="row">
                <div class="name">Player2</div><div class="score">580</div>
            </div>

            <div class="row">
                <div class="name">Player3</div><div class="score">310</div>
            </div>

            <div class="row">
                <div class="name">Player4</div><div class="score">640</div>
            </div>

            <div class="row">
                <div class="name">Player5</div><div class="score">495</div>
            </div>
            </div>
        */

        

        let img =  L.DomUtil.create('img');
        img.src = '../logo.png';
        img.style.width = '150px';

        this._container.append(img)

        return this._container;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

