from odoo import models, fields


class PosConfig(models.Model):
    _inherit = 'pos.config'
    iface_tare_label_zpl = fields.Boolean(
        'Tare label ZPL', 
        help="Print tare labels by ZPL printer, this will require to identify printers which printing zpl label or html receipt"
        )
    iface_zpl_label_printer = fields.Char('ZPL Label Printer Identifier', help="Target printer identifier for printing label")
    iface_receipt_printer = fields.Char('Receipt Identifier', help="Target printer identifier for printing receipt")
