from odoo import models, fields


class PosConfig(models.Model):
    _inherit = 'pos.config'
    iface_printer_identifier = fields.Char('Receipt Identifier', help="Target printer identifier for printing receipt")
