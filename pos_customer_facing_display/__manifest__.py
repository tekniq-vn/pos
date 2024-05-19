# @author: François Kawala
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
{
    'name': "POS Customer Display",
    'version': '14.0.1.0.0',
    'category': 'Point of Sale',
    'summary': """Point of Sale - Customer facing display without IoT box""",
    'description': """ 
backward patch commit for odoo 14
https://github.com/odoo/odoo/commit/ec56f40da294a41249c0fbab58e77bd72a442577
    """,
    'author': "Tekniq",
    'website': "https://tekniq.vn",
    'license': 'AGPL-3',
    'depends': ['point_of_sale'],
    'data': [
        'views/templates.xml',
        'views/pos_config_view.xml'
    ],
    'qweb': [
        'static/src/xml/CustomerFacingDisplay/CustomerFacingDisplayOrder.xml',
    ],
    'installable': True,
}
