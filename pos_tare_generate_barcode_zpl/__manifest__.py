# @author: François Kawala
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
{
    'name': "Point of Sale - Tare generate barcode zpl",
    'version': '14.0.1.0.0',
    'category': 'Point of Sale',
    'summary': """Point of Sale - print tare \
                  barecodes zpl labels.""",
    'author': "Tekniq, Odoo Community Association (OCA)",
    'website': "https://github.com/OCA/pos",
    'license': 'AGPL-3',
    'depends': ['pos_tare_generate_barcode'],
    'data': [
        'pos_tare_generate_barcode_zpl.xml',
        'views/pos_config_view.xml'
    ],
    'qweb': [
        'static/src/xml/TareLabelZpl.xml',
    ],
    'installable': True,
}
