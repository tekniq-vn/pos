odoo.define('pos_tare_generte_barcode_zpl.Printer', function (require) {
"use strict";

var Printer = require('point_of_sale.Printer').Printer;

Printer.include({
    init: function (url, pos, _identifier) {
        this._super.apply(this, [url, pos]);
        this.raw_queue = [];
        this._identifier = _identifier;
    },

    print_raw: async function(data) {
        if (data) {
            this.raw_queue.push(data);
        }
        let sendPrintResult;
        while (this.raw_queue.length > 0) {
            data = this.raw_queue.shift();
            try {
                sendPrintResult = await this.send_raw_printing_job(data);
            } catch (error) {
                // Error in communicating to the IoT box.
                this.raw_queue.length = 0;
                return this.printResultGenerator.IoTActionError();
            }
            // rpc call is okay but printing failed because
            // IoT box can't find a printer.
            if (!sendPrintResult || sendPrintResult.result === false) {
                this.raw_queue.length = 0;
                return this.printResultGenerator.IoTResultError();
            }
        }
        return this.printResultGenerator.Successful();
    },

    open_cashbox: function () {
        if (this._identifier) {
            var self = this;
            return this.connection.rpc('/hw_drivers/action', {
                session_id: 'POS',
                device_identifier: this._identifier,
                data: {
                    action: 'cashbox'
                }   
            }).then(self._onIoTActionResult.bind(self))
                .guardedCatch(self._onIoTActionFail.bind(self));
        } else return this._super.apply(this, arguments);
    },

    send_printing_job: function (img) {
        if (this._identifier) {
            return this.connection.rpc('/hw_drivers/action', {
                session_id: 'POS',
                device_identifier: this._identifier,
                data: JSON.stringify({
                    action: 'print_receipt',
                    receipt: img,
                })
            });
        } else return this._super.apply(this, arguments);
    },

    send_raw_printing_job: function(data) {
        if (this._identifier) {
            return this.connection.rpc('/hw_drivers/action', {
                session_id: 'POS',
                device_identifier: this._identifier,
                data: JSON.stringify({document: data}),
            });
        } else return this.printResultGenerator.IoTResultError();
    },
});
});
