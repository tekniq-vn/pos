# -*- coding: utf-8 -*-

import secrets

from odoo import api, fields, models


class IotBox(models.Model):
    _name = 'iot.box'
    _description = 'IoT Box'

    name = fields.Char('Name')
    identifier = fields.Char(string='Identifier (Mac Address)')
    ip = fields.Char('Domain Address')
    ip_url = fields.Char('IoT Box Home Page', readonly=True, compute='_compute_ip_url')
    drivers_auto_update = fields.Boolean('Automatic drivers update', help='Automatically update drivers when the IoT Box boots', default=True)
    company_id = fields.Many2one('res.company', 'Company')

    def _compute_ip_url(self):
        for box in self:
            if not box.ip:
                box.ip_url = False
            else:
                url = 'https://%s' if box.get_base_url()[:5] == 'https' else 'http://%s:8069'
                box.ip_url = url % box.ip


