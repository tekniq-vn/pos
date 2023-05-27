odoo.define('pos_tare_generate_barcode_zpl.devices', function (require) {
'use strict';

var ProxyDevice = require('point_of_sale.devices').ProxyDevice;
var Printer = require('point_of_sale.Printer').Printer;

ProxyDevice.include({
    connect_to_printer: function () {
        if (this.pos.config.iface_tare_label_zpl) {
            if (this.pos.config.iface_receipt_printer) {
                this.printer = new Printer(this.host, this.pos, this.pos.config.iface_receipt_printer);
            }
            if (this.pos.config.iface_zpl_label_printer) {
                this.zpl_printer = new Printer(this.host, this.pos, this.pos.config.iface_zpl_label_printer);
            }
        } else this._super.apply(this, arguments);
    },

});

});
