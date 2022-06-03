from odoo.addons.hw_drivers.iot_handlers.drivers.SerialScaleDriver import AdamEquipmentDriver
AdamEquipmentDriver._protocol = AdamEquipmentDriver._protocol._replace(measureRegexp=b"\s*([0-9.]+)\s?kg")

