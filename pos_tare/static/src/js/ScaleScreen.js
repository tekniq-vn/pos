odoo.define("pos_tare.ReceiptScreen", function (require) {
    "use strict";

    const {useState} = owl.hooks;
    const { round_precision: round_pr } = require('web.utils');
    const ScaleScreen = require("point_of_sale.ScaleScreen");
    const Registries = require("point_of_sale.Registries");
    const { useBarcodeReader } = require('point_of_sale.custom_hooks');

    var scale_screen_super = ScaleScreen.prototype;
    const TareScaleScreen = (ScaleScreen) =>
        class extends ScaleScreen {
            /**
             * @override
             */
            constructor() {
                super(...arguments);
                this.state = useState({
                    tare: this.props.product.tare_weight,
                    gross_weight: 0,
                });
                if (this.env.pos.config.iface_tare_method !== 'manual') {
                    useBarcodeReader({
                        tare: this._barcodeTareAction,
                    });
                }
            }
            confirm() {
                var self = this;
                if (this.state.tare === undefined) {
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Incorrect Tare Value'),
                        body: this.env._t('Please set a numeric value' +
                            ' in the tare field, or let empty.'),
                    });
                } else if (isNaN(this.state.gross_weight)) {
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Incorrect Gross Weight Value'),
                        body: this.env._t('Please set a numeric value' +
                        ' in the gross weight field.'),
                    });
                } else if (this.state.weight <= 0) {
                    this.showPopup('ConfirmPopup', {
                        title: this.env._t('Quantity lower or equal to zero'),
                        body: this.env._t(
                            "The quantity is lower or equal to" +
                            " zero. Are you sure you want to continue ?"),
                    }).then(function ({ confirmed }) {
                        if (confirmed) {
                            if (self.state.tare > 0.0) {
                                self.props.resolve({
                                    confirmed: true,
                                    payload: {
                                        weight: self.state.weight,
                                        tare: self.state.tare,
                                    },
                                });
                                self.trigger('close-temp-screen');
                            } else scale_screen_super.confirm.apply(self);
                        }
                    });
                } else {
                    if (this.state.tare > 0.0) {
                        this.props.resolve({
                            confirmed: true,
                            payload: {
                                weight: this.state.weight,
                                tare: this.state.tare,
                            },
                        });
                        this.trigger('close-temp-screen');
                    } else super.confirm();
                }
            }
            _readScale() {
                if (this.env.pos.config.iface_gross_weight_method === 'scale') super._readScale();
            }
            async _setWeight() {
                await super._setWeight(); 
                this.state.gross_weight = this.state.weight;
                this.state.weight = this.state.gross_weight - (this.state.tare || 0);
            }

            /**
             * @custom
             */
            onKeyup(event) {
                this.state.weight = this.state.gross_weight - this.state.tare;
            }
            onClick(event) {
                if (event.target.value == 0) event.target.value = "";
            }
            check_sanitize_value(target) {
                var res = target.value.replace(',', '.').trim();
                if (isNaN(res)) {
                    target.style.backgroundColor = "#F66";
                    return undefined;
                }
                target.style.backgroundColor = "#FFF";
                return parseFloat(res, 10);
            }
            
            get productGrossWeightString() {
                const defaultstr = (this.state.gross_weight || 0).toFixed(3) + ' Kg';
                if (!this.props.product || !this.env.pos) {
                    return defaultstr;
                }
                const unit_id = this.props.product.uom_id;
                if (!unit_id) {
                    return defaultstr;
                }
                const unit = this.env.pos.units_by_id[unit_id[0]];
                const weight = round_pr(this.state.gross_weight || 0, unit.rounding);
                let weightstr = weight.toFixed(Math.ceil(Math.log(1.0 / unit.rounding) / Math.log(10)));
                weightstr += ' ' + unit.name;
                return weightstr;
            }
            get productTareWeightString() {
                const defaultstr = (this.state.tare || 0).toFixed(3) + ' Kg';
                if (!this.props.product || !this.env.pos) {
                    return defaultstr;
                }
                const unit_id = this.props.product.uom_id;
                if (!unit_id) {
                    return defaultstr;
                }
                const unit = this.env.pos.units_by_id[unit_id[0]];
                const weight = round_pr(this.state.tare || 0, unit.rounding);
                let weightstr = weight.toFixed(Math.ceil(Math.log(1.0 / unit.rounding) / Math.log(10)));
                weightstr += ' ' + unit.name;
                return weightstr;
            }
            _barcodeTareAction(code) {
                this.state.tare = code.value;
            }
        };
    Registries.Component.extend(ScaleScreen, TareScaleScreen);
    return ScaleScreen;
});
