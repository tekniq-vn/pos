odoo.define("pos_tare_generate_barcode.TareScreen", function (require) {
    "use strict";

    const {useState} = owl.hooks;
    const { round_precision: round_pr } = require('web.utils');
    const ScaleScreen = require("point_of_sale.ScaleScreen");
    const Registries = require("point_of_sale.Registries");
    var core = require('web.core');

    var QWeb = core.qweb;
    var tools = require('pos_tare.tools');
    var convert_mass = tools.convert_mass;


    //var scale_screen_super = ScaleScreen.prototype;
    class TareScreen extends ScaleScreen {
        constructor() {
            super(...arguments);
        }

        confirm() {
            return this.printLabel().then(() => {});
        }

        async printLabel() {
            if (this.env.pos.proxy.printer) {
                var label = QWeb.render('TareLabel',{widget:this});
                const printResult = await this.env.pos.proxy.printer.print_receipt(label);
                if (printResult.successful) {
                    return true;
                } else {
                    await this.showPopup('ErrorPopup', {
                        title: this.env._t('Printing failed'),
                        body: this.env._t('Failed in printing the tare label'),
                    });
                    return false;
                }
            } else {
                await this.showPopup('ErrorPopup', {
                    title: this.env._t('No available printer'),
                    body: this.env._t('No printer detected or correctly configured'),
                });
                return false;
            }
        }
        get barcodePrefix() {
            return this.barcodePattern.substr(0, 2);
        }
        get barcodePattern() {
            var rule = this.barcodeRules.filter(
                function (r) {
                    // We select the first (smallest sequence ID) barcode rule
                    // with the expected type.
                    return r.type === "tare";
                })[0];
            return rule.pattern;
        }
        get barcodeRules() {
            return this.env.pos.barcode_reader.barcode_parser.nomenclature.rules;
        }
        _getKilogramUom() {
            var kilogram_uom = this.env.pos.units.filter(
                function (u) {
                    return u.name === "kg";
                })[0];
            if (typeof kilogram_uom === 'undefined') {
                this.showPopup('ErrorPopup', {
                    title: this.env._t('No available printer'),
                    body: this.env._t("You need to setup a kilogram (kg) UOM "+
                         "this UOM is used to encode the tare mass "+
                         "in the tare barcode."),
                });
            }
            return kilogram_uom;
        }
        get weightInTareUnit() {
            //Need to be improved with dynamic measure unit in future
            var kilogram_uom = this._getKilogramUom();
            var measure_unit = kilogram_uom;
            var tare_uom = this.env.pos.config.iface_tare_uom_id[0];
            var tare_unit = this.env.pos.units_by_id[tare_uom];
            return convert_mass(this.state.weight, measure_unit, tare_unit);
        }
        get weightInKilogram() {
            var kilogram_uom = this._getKilogramUom();
            var measure_unit = kilogram_uom;
            return convert_mass(this.state.weight, measure_unit, kilogram_uom);

        }
        get tareWeight() {
            return this.weightInTareUnit || 0;
        }
        get tareWeightInKilogram() {
            return this.weightInKilogram || 0
        }

        _getBarcodeData(weight) {
            // We use EAN13 barcode, it looks like 07 00000 12345 x. First there
            // is the prefix, here 07, that is used to decide which type of
            // barcode we're dealing with. A weight barcode has then two groups
            // of five digits. The first group encodes the product id. Here the
            // product id is 00000. The second group encodes the weight in
            // grams. Here the weight is 12.345kg. The last digit of the barcode
            // is a checksum, here symbolized by x.
            var padding_size = 5;
            var void_product_id = '0'.repeat(padding_size);
            var weight_in_gram = weight * 1e3;

            if (weight_in_gram >= Math.pow(10, padding_size)) {
                throw new RangeError(_t("Maximum tare weight is 99.999kg"));
            }

            // Weight has to be padded with zeros.
            var weight_with_padding = '0'.repeat(padding_size) + weight_in_gram;
            var padded_weight = weight_with_padding.substr(
                weight_with_padding.length - padding_size);
            // Builds the barcode using a placeholder checksum.
            var barcode = this.barcodePrefix
                .concat(void_product_id, padded_weight)
                .concat(0);
            // Compute checksum
            var barcode_parser = this.env.pos.barcode_reader.barcode_parser;
            var checksum = barcode_parser.ean_checksum(barcode);
            // Replace checksum placeholder by the actual checksum.
            return barcode.substr(0, 12).concat(checksum);
        }
        get barcode() {
            return this._getBarcodeData(this.tareWeightInKilogram);
        }

    }

    TareScreen.template = 'TareScreen';

    Registries.Component.add(TareScreen);

    return TareScreen;
});
