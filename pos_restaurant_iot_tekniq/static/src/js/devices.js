odoo.define('pos_printer_identifier.devices', function (require) {
'use strict';

var ProxyDevice = require('point_of_sale.devices').ProxyDevice;
var Printer = require('point_of_sale.Printer').Printer;

ProxyDevice.include({
    connect_to_printer: function () {
        if (this.pos.config.iface_printer_identifier) {
            this.printer = new Printer(this.host, this.pos, this.pos.config.iface_printer_identifier);
        } else this._super.apply(this, arguments);
    },

     set_connection_status: function(status, drivers, msg=''){
         console.log(status);
         console.log(drivers);
         console.log(msg);
         this._super.apply(this, arguments);
     }

});

});
