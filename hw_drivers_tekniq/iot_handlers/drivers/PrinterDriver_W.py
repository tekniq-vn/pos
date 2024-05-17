from odoo.addons.hw_drivers.iot_handlers.drivers import PrinterDriver_W

class PrinterDriver(PrinterDriver_W.PrinterDriver):
    def __init__(self, identifier, device):
        super().__init__(identifier, device)
        self.device_connection = device.get('device_connection')

PrinterDriver_W.proxy_driver['printer'] = PrinterDriver
