odoo.define('pos_customer_facing_display.Chrome', function(require) {
    'use strict';

    const Registries = require('point_of_sale.Registries');
    const Chrome = require('point_of_sale.Chrome');

    const ChromeExtend = (Chrome) => 
        class extends Chrome {
            get clientScreenButtonIsShown() {
                return this.env.pos.config.iface_customer_facing_display;
            }
        };
    Registries.Component.extend(Chrome, ChromeExtend);

    return Chrome;
});
