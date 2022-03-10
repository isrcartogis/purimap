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