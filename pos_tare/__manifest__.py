# @author: François Kawala
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
{
    "name": "Point Of Sale - Tare",
    "summary": "Manage Tare in Point Of Sale module",
    "version": "14.0.1.0.0",
    "category": "Point of Sale",
    "author": "Tekniq, Odoo Community Association (OCA)",
    "website": "https://github.com/OCA/pos",
    "license": "AGPL-3",
    "depends": [
        "point_of_sale",
    ],
    "data": [
        "views/templates.xml",
        "views/view_pos_config.xml",
        "views/view_pos_order.xml",
        "views/view_product_template.xml",
        "data/barcode_rule.xml",
    ],
    "qweb": [
        #"static/src/xml/pos_tare.xml",
        "static/src/xml/ScaleScreen.xml",
        "static/src/xml/Orderline.xml",
        "static/src/xml/OrderReceipt.xml",
        "static/src/xml/NumpadWidget.xml",
    ],
    "demo": [
        #"demo/product_product.xml",
    ],
    "installable": True,
}
