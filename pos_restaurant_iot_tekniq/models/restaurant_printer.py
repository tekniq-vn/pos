from odoo import api, fields, models, _

class RestaurantPrinter(models.Model):
    _inherit = 'restaurant.printer'

    printer_identifier = fields.Char('Identifier', help="Target printer identifier for printing")
