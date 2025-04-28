# @author: François Kawala
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
{
    'name': "IoT Tekniq",
    'version': '14.0.1.0.0',
    'category': 'Point of Sale',
    'summary': """Simple controller allow download iot handlers""",
    'author': "Tekniq",
    'website': "https://tekniq.vn",
    'license': 'AGPL-3',
    'depends': ['web'],
    'data': [
        'security/ir.model.access.csv',
        'views/iot_box_views.xml',
        #'views/templates.xml',
    ],
    'installable': True,
}
