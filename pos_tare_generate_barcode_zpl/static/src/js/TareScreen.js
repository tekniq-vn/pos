odoo.define("pos_tare_generate_barcode_zpl.TareScreen", function (require) {
    "use strict";

    const {useState} = owl.hooks;
    const { nextFrame } = require('point_of_sale.utils');
    const TareScreen = require("pos_tare_generate_barcode.TareScreen");
    const Registries = require("point_of_sale.Registries");
    var core = require('web.core');

    var QWeb = core.qweb;
    var tools = require('pos_tare.tools');
    var convert_mass = tools.convert_mass;


    const TareScreenZpl = TareScreen => 
        class extends TareScreen {
            //constructor() {
            //    super(...arguments);
            //}

            async printLabel() {
                if (this.env.pos.proxy.zpl_printer) {
                    var label = QWeb.render('TareLabelZpl',{widget:this});
                    var raw = btoa(label);
                    const printResult = await this.env.pos.proxy.zpl_printer.print_raw(raw);
                    if (printResult.successful) {
                        return true;
                    } else {
                        const { confirmed } = await this.showPopup('ConfirmPopup', {
                            title: printResult.message.title,
                            body: 'Do you want to print using the receipt printer?',
                        });
                        if (confirmed) {
                            await nextFrame();
                            return await super.printLabel();
                        }
                        return false;
                    }
                } else await super.printLabel();
            }
        };

    Registries.Component.extend(TareScreen, TareScreenZpl);

    return TareScreen;
});
