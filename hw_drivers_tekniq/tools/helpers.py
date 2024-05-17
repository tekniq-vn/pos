from importlib import util
import logging
from pathlib import Path

from odoo import _, http, service
from odoo.tools.func import lazy_property
from odoo.tools.misc import file_path

from odoo.addons.hw_drivers.tools.helpers import compute_iot_handlers_addon_name, list_file_by_os, load_iot_handlers
from odoo.addons.hw_drivers.tools import helpers

_logger = logging.getLogger(__name__)

def patch_load_iot_handlers():
    load_iot_handlers()
    """
    This method loads local files: 'odoo/addons/hw_drivers_tekniq/iot_handlers/drivers' and
    'odoo/addons/hw_drivers_tekniq/iot_handlers/interfaces'
    And execute these python drivers and interfaces
    """
    for directory in ['interfaces', 'drivers']:
        path = file_path(f'hw_drivers_tekniq/iot_handlers/{directory}')
        filesList = list_file_by_os(path)
        for file in filesList:
            spec = util.spec_from_file_location(compute_iot_handlers_addon_name(directory, file), str(Path(path).joinpath(file)))
            if spec:
                module = util.module_from_spec(spec)
                try:
                    spec.loader.exec_module(module)
                except Exception as e:
                    _logger.error('Unable to load file: %s ', file)
                    _logger.error('An error encountered : %s ', e)
    lazy_property.reset_all(http.root)

helpers.load_iot_handlers = patch_load_iot_handlers
