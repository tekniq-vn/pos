odoo.define('pos_restaurant_iot_tekniq.multiprint', function (require) {
"use strict";

var models = require('point_of_sale.models');
var core = require('web.core');
var Printer = require('point_of_sale.Printer').Printer;

var QWeb = core.qweb;

models.PosModel = models.PosModel.extend({
    create_printer: function (config) {
        var url = config.proxy_ip || '';
        if(url.indexOf('//') < 0) {
            url = window.location.protocol + '//' + url;
        }
        if(url.indexOf(':', url.indexOf('//') + 2) < 0 && window.location.protocol !== 'https:') {
            url = url + ':8069';
        }
        if (config.printer_identifier) return new Printer(url, this, config.printer_identifier);
        else return new Printer(url, this);
    },
});
models.load_models({
    model: 'restaurant.printer',
    fields: ['name','proxy_ip','product_categories_ids', 'printer_type', 'printer_identifier'],
    domain: null,
    loaded: function(self,printers){
        var active_printers = {};
        for (var i = 0; i < self.config.printer_ids.length; i++) {
            active_printers[self.config.printer_ids[i]] = true;
        }

        self.printers = [];
        self.printers_categories = {}; // list of product categories that belong to
                                       // one or more order printer

        for(var i = 0; i < printers.length; i++){
            if(active_printers[printers[i].id]){
                var printer = self.create_printer(printers[i]);
                printer.config = printers[i];
                self.printers.push(printer);

                for (var j = 0; j < printer.config.product_categories_ids.length; j++) {
                    self.printers_categories[printer.config.product_categories_ids[j]] = true;
                }
            }
        }
        self.printers_categories = _.keys(self.printers_categories);
        self.config.iface_printers = !!self.printers.length;
    },
});
});
