odoo.define('pos_tare_generate_barcode.TareScreenButton', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');

    class TareScreenButton extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('click', this.onClick);
        }
        async onClick() {
            await this.showTempScreen('TareScreen');
        }
    }
    TareScreenButton.template = 'TareScreenButton';

    ProductScreen.addControlButton({
        component: TareScreenButton,
        condition: function() {
            return this.env.pos.config.iface_tare_label;
        },
    });

    Registries.Component.add(TareScreenButton);

    return TareScreenButton;
});
