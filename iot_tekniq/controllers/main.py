# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

import io
import itertools
import json
import logging
import pathlib
import textwrap
import zipfile

from odoo import http
from odoo.http import request, Response
from odoo.modules import get_module_path
from odoo.tools.misc import str2bool

_iot_logger = logging.getLogger(__name__ + '.iot_log')
# We want to catch any log level that the IoT send
_iot_logger.setLevel(logging.DEBUG)

class IoTController(http.Controller):

    @http.route('/iot/get_handlers', type='http', auth='public', csrf=False)
    def download_iot_handlers(self, mac, auto):
        # Check mac is of one of the IoT Boxes
        box = request.env['iot.box'].sudo().search([('identifier', '=', mac)], limit=1)
        if not box or (auto == 'True' and not box.drivers_auto_update):
            return ''
        module_ids = request.env['ir.module.module'].sudo().search([('state', '=', 'installed')])
        fobj = io.BytesIO()
        with zipfile.ZipFile(fobj, 'w', zipfile.ZIP_DEFLATED) as zf:
            # install hw_drivers first to allow any modification on custom addons
            for module in ['hw_drivers'] + module_ids.mapped('name'):
                module_path = get_module_path(module)
                if module_path:
                    iot_handlers = pathlib.Path(module_path) / 'iot_handlers'
                    for handler in iot_handlers.glob('*/*'):
                        if handler.is_file() and not handler.name.startswith(('.', '_')):
                            # In order to remove the absolute path
                            zf.write(handler, handler.relative_to(iot_handlers))

        return fobj.getvalue()

    #@http.route('/iot/keyboard_layouts', type='http', auth='public', csrf=False)

    #@http.route('/iot/box/<string:identifier>/display_url', type='http', auth='public')

    #@http.route('/iot/printer/status', type='json', auth='public')

    #@http.route('/iot/setup', type='json', auth='public')

    #@http.route('/iot/log', type='http', auth='public', csrf=False)
