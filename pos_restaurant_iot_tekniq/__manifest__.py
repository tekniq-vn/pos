# @author: François Kawala
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
{
    'name': "POS Restaurant - Printer Identifier",
    'version': '14.0.1.0.0',
    'category': 'Point of Sale',
    'summary': """POS Restaurant - target printer using identifier""",
    'author': "Tekniq",
    'website': "https://tekniq.vn",
    'license': 'AGPL-3',
    'depends': ['pos_restaurant', 'pos_iot_tekniq'],
    'data': [
        'views/templates.xml',
        'views/restaurant_printer_views.xml',
    ],
    'installable': True,
}
