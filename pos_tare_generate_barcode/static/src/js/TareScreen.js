odoo.define("pos_tare_generate_barcode.TareScreen", function (require) {
    "use strict";

    const {useState} = owl.hooks;
    const { round_precision: round_pr } = require('web.utils');
    const ScaleScreen = require("point_of_sale.ScaleScreen");
    const Registries = require("point_of_sale.Registries");

    var tools = require('pos_tare.tools');
    var convert_mass = tools.convert_mass;


    //var scale_screen_super = ScaleScreen.prototype;
    class TareScreen extends ScaleScreen {
        constructor() {
            super(...arguments);
            console.log(this);
        }

    }

    TareScreen.template = 'TareScreen';

    Registries.Component.add(TareScreen);

    return TareScreen;
});
