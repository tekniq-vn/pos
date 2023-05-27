odoo.define("pos_tare.ProductScreen", function (require) {
    "use strict";

    const {useState} = owl.hooks;
    const { round_precision: round_pr } = require('web.utils');
    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");
    const { useBarcodeReader } = require('point_of_sale.custom_hooks');

    const TareProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            /**
             * @override
             */
            constructor() {
                super(...arguments);
                if (this.env.pos.config.iface_tare_method !== 'manual') {
                    useBarcodeReader({
                        tare: this._barcodeTareAction,
                    });
                }
            }
            _setValue(val) {
                var selected_orderline = this.currentOrder.get_selected_orderline();
                if (selected_orderline && this.state.numpadMode === 'quantity') {
                    var tare = selected_orderline.get_tare();
                    selected_orderline.reset_tare();
                    selected_orderline.set_quantity(val);
                    if (tare > 0) selected_orderline.set_tare(tare, true);
                } else if (selected_orderline && this.state.numpadMode === 'tare') {
                    if (this.env.pos.config.iface_tare_method === 'barcode') {
                        this.showPopup('ErrorPopup', {
                            title: this.env._t('Feature Disabled'),
                            body: this.env._t('You can not set the tare.' +
                                ' To be able to set the tare manually' +
                                ' you have to change the tare input method' +
                                ' in the POS configuration.'),
                        });
                    } else {
                        try {
                            selected_orderline.set_tare(val, true);
                        } catch (error) {
                            this.showPopup('ErrorPopup', {
                                title: this.env._t('We can not apply this tare.'),
                                body: error.message,
                            });
                        }
                    }
                } else super._setValue(...arguments);

            }
            async _getAddProductOptions(product) {
                let weight, tare;
                if (product.to_weight && this.env.pos.config.iface_electronic_scale) {
                    // Show the ScaleScreen to weigh the product.
                    if (this.isScaleAvailable) {
                        const { confirmed, payload } = await this.showTempScreen('ScaleScreen', {
                            product,
                        });
                        if (confirmed) {
                            weight = payload.weight;
                            tare = payload.tare;
                        } else {
                            // do not add the product;
                            return;
                        }
                    } else {
                        await this._onScaleNotAvailable();
                    }
                    product.to_weight = false;
                }
                var options = await super._getAddProductOptions(...arguments);
                options.tare = tare;
                options.quantity = weight;
                product.to_weight = true;
                return options;
            }
            _barcodeTareAction(code) {
                if (!this.props.isShown) return;
                var last_orderline = this.currentOrder.get_last_orderline();
                if (last_orderline) {
                    last_orderline.set_tare(code.value, true);
                }
            }
        };
    Registries.Component.extend(ProductScreen, TareProductScreen);
    return ProductScreen;
});
