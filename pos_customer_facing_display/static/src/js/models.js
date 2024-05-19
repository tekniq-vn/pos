odoo.define('pos_customer_facing_display.models', function (require) {
"use strict";

var core = require('web.core');
var models = require('point_of_sale.models');
var QWeb = core.qweb;

models.PosModel = models.PosModel.extend({
    //models

    send_current_order_to_customer_facing_display: function() {
        var self = this;
        this.render_html_for_customer_facing_display().then(function (rendered_html) {
            if (self.env.pos.customer_display) {
                var $renderedHtml = $('<div>').html(rendered_html);
                $(self.env.pos.customer_display.document.body).html($renderedHtml.find('.pos-customer_facing_display'));
                var orderlines = $(self.env.pos.customer_display.document.body).find('.pos_orderlines_list');
                orderlines.scrollTop(orderlines.prop("scrollHeight"));
            } else if (self.env.pos.proxy.posbox_supports_display) {
                self.proxy.update_customer_facing_display(rendered_html);
            }
        });
    },

    render_html_for_customer_facing_display: function () {
        var self = this;
        var order = this.get_order();

        // If we're using an external device like the IoT Box, we
        // cannot get /web/image?model=product.product because the
        // IoT Box is not logged in and thus doesn't have the access
        // rights to access product.product. So instead we'll base64
        // encode it and embed it in the HTML.
        var get_image_promises = [];

        if (order) {
            order.get_orderlines().forEach(function (orderline) {
                var product = orderline.product;
                var image_url = `/web/image?model=product.product&field=image_128&id=${product.id}&write_date=${product.write_date}&unique=1`;

                // only download and convert image if we haven't done it before
                if (! product.image_base64) {
                    get_image_promises.push(self._convert_product_img_to_base64(product, image_url));
                }
            });
        }

        return Promise.all(get_image_promises).then(function () {
            return QWeb.render('CustomerFacingDisplayOrder', {
                pos: self.env.pos,
                origin: window.location.origin,
                order: order,
            });
        });
    },

});

var order_super = models.Order.prototype;
models.Order = models.Order.extend({
    initialize: function(attributes, options) {
        var res = order_super.initialize.apply(this, arguments);
        if (this.pos.config.iface_customer_facing_display) {
            this.orderlines.on('change', this.pos.send_current_order_to_customer_facing_display, this.pos);
            this.orderlines.on('add', this.pos.send_current_order_to_customer_facing_display, this.pos);
            this.orderlines.on('remove', this.pos.send_current_order_to_customer_facing_display, this.pos);
        }
        return res;
    },
});
});

