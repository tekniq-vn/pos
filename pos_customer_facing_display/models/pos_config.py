from odoo import models, fields, api

class PosConfig(models.Model):
    _inherit = 'pos.config'

    iface_customer_facing_display = fields.Boolean(compute='_compute_customer_facing_display')
    iface_customer_facing_display_via_proxy = fields.Boolean(string='Customer Facing Display', help="Show checkout to customers with a remotely-connected screen.")
    iface_customer_facing_display_local = fields.Boolean(string='Local Customer Facing Display', help="Show checkout to customers.")

    @api.depends('iface_customer_facing_display_via_proxy', 'iface_customer_facing_display_local')
    def _compute_customer_facing_display(self):
        for config in self:
            config.iface_customer_facing_display = config.iface_customer_facing_display_via_proxy or config.iface_customer_facing_display_local
            #config.iface_customer_facing_display = config.iface_display_id.id is not False or config.iface_customer_facing_display_local

    @api.onchange('is_posbox')
    def _onchange_is_posbox(self):
        if not self.is_posbox:
            self.proxy_ip = False
            self.iface_scan_via_proxy = False
            self.iface_electronic_scale = False
            self.iface_cashdrawer = False
            self.iface_print_via_proxy = False
            self.iface_customer_facing_display_via_proxy = False
