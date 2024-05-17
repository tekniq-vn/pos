from odoo.addons.hw_drivers.iot_handlers.interfaces.PrinterInterface_W import PrinterInterface

import win32print

def get_devices(self):
    printer_devices = {}
    printers = win32print.EnumPrinters(win32print.PRINTER_ENUM_LOCAL)

    for printer in printers:
        identifier = printer[2]
        handle_printer = win32print.OpenPrinter(identifier)
        device_class = 'network'
        info = win32print.GetPrinter(handle_printer, 2)
        if any([port.lower().startswith('usb') for port in info['pPortName'].split(',')]):
            device_class = 'direct'
        printer_devices[identifier] = {
            'identifier': identifier,
            'printer_handle': handle_printer,
            'device_connection': device_class,
        }
        return printer_devices

PrinterInterface.get_devices = get_devices
