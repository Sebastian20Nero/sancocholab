import { Injectable, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { BulkUploadRowDto } from './dto/bulk-upload.dto';

@Injectable()
export class ExcelService {
    /**
     * Generates a quotations template Excel file
     * Returns a buffer that can be sent as a download
     */
    async generateQuotationsTemplate(): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cotizaciones');

        // Define columns
        worksheet.columns = [
            { header: 'NIT Proveedor', key: 'nitProveedor', width: 18 },
            { header: 'Nombre Proveedor', key: 'nombreProveedor', width: 30 },
            { header: 'Nombre Producto', key: 'nombreProducto', width: 30 },
            { header: 'Categoría Producto', key: 'categoriaProducto', width: 25 },
            { header: 'Precio Unitario', key: 'precioUnitario', width: 18 },
            { header: 'Cantidad', key: 'cantidad', width: 12 },
            { header: 'Unidad', key: 'unidad', width: 12 },
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Observación', key: 'observacion', width: 40 },
        ];

        // Style header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, size: 11 };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' }, // Blue background
        };
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // White text
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 20;

        // Add example row
        worksheet.addRow({
            nitProveedor: '900123456-1',
            nombreProveedor: 'Distribuidora Ejemplo',
            nombreProducto: 'Zanahoria',
            categoriaProducto: 'Verduras',
            precioUnitario: 2500,
            cantidad: 10,
            unidad: 'KG',
            fecha: '15/01/2024',
            observacion: 'Producto fresco de alta calidad',
        });

        // Add a second example with different data
        worksheet.addRow({
            nitProveedor: '800987654-2',
            nombreProveedor: 'Carnes Premium',
            nombreProducto: 'Pechuga de Pollo',
            categoriaProducto: 'Carnes',
            precioUnitario: 12000,
            cantidad: 5,
            unidad: 'KG',
            fecha: '16/01/2024',
            observacion: '',
        });

        // Add instructions in a separate sheet
        const instructionsSheet = workbook.addWorksheet('Instrucciones');
        instructionsSheet.columns = [
            { header: 'Campo', key: 'field', width: 25 },
            { header: 'Descripción', key: 'description', width: 60 },
            { header: 'Requerido', key: 'required', width: 12 },
            { header: 'Ejemplo', key: 'example', width: 25 },
        ];

        // Style instructions header
        const instrHeaderRow = instructionsSheet.getRow(1);
        instrHeaderRow.font = { bold: true };
        instrHeaderRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF70AD47' },
        };
        instrHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };

        // Add instructions
        const instructions = [
            {
                field: 'NIT Proveedor',
                description: 'NIT del proveedor. Si no existe, se creará automáticamente.',
                required: 'Sí',
                example: '900123456-1',
            },
            {
                field: 'Nombre Proveedor',
                description: 'Nombre del proveedor para crear si no existe.',
                required: 'Sí',
                example: 'Distribuidora XYZ',
            },
            {
                field: 'Nombre Producto',
                description: 'Nombre del producto. Si no existe, se creará automáticamente.',
                required: 'Sí',
                example: 'Zanahoria',
            },
            {
                field: 'Categoría Producto',
                description: 'Categoría del producto. Si no existe, se creará automáticamente.',
                required: 'No',
                example: 'Verduras',
            },
            {
                field: 'Precio Unitario',
                description: 'Precio por unidad en pesos colombianos. Debe ser mayor a 0.',
                required: 'Sí',
                example: '2500',
            },
            {
                field: 'Cantidad',
                description: 'Cantidad cotizada. Debe ser mayor a 0.',
                required: 'Sí',
                example: '10',
            },
            {
                field: 'Unidad',
                description: '⚠️ SOLO se aceptan: KG, L, UND (kilogramos, litros, unidades). Cualquier otra unidad será rechazada.',
                required: 'Sí',
                example: 'KG',
            },
            {
                field: 'Fecha',
                description: 'Fecha de la cotización en formato DD/MM/YYYY',
                required: 'Sí',
                example: '15/01/2024',
            },
            {
                field: 'Observación',
                description: 'Notas adicionales sobre la cotización.',
                required: 'No',
                example: 'Producto fresco',
            },
        ];

        instructions.forEach((instr) => {
            instructionsSheet.addRow(instr);
        });

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    /**
     * Parses an uploaded Excel file and extracts quotation data
     * @param buffer The Excel file buffer
     * @returns Array of row data
     */
    async parseQuotationsFile(buffer: Buffer): Promise<BulkUploadRowDto[]> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer as any); // Cast to any for ExcelJS compatibility

        // Get first worksheet
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            throw new BadRequestException('El archivo Excel está vacío');
        }

        // Validate headers (row 1)
        const headerRow = worksheet.getRow(1);
        const expectedHeaders = [
            'NIT Proveedor',
            'Nombre Proveedor',
            'Nombre Producto',
            'Categoría Producto',
            'Precio Unitario',
            'Cantidad',
            'Unidad',
            'Fecha',
            'Observación',
        ];

        const actualHeaders = headerRow.values as any[];
        for (let i = 0; i < expectedHeaders.length; i++) {
            const expected = expectedHeaders[i].toLowerCase().trim();
            const actual = String(actualHeaders[i + 1] || '').toLowerCase().trim();
            if (!actual.includes(expected.split(' ')[0])) {
                throw new BadRequestException(
                    `Columna ${i + 1} esperaba "${expectedHeaders[i]}" pero encontró "${actualHeaders[i + 1]}"`,
                );
            }
        }

        // Parse data rows (starting from row 2)
        const rows: BulkUploadRowDto[] = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header

            const values = row.values as any[];

            // Skip empty rows
            if (!values[1] && !values[2] && !values[3]) return;

            rows.push({
                nitProveedor: this.getCellValue(values[1]),
                nombreProveedor: this.getCellValue(values[2]),
                nombreProducto: this.getCellValue(values[3]),
                categoriaProducto: this.getCellValue(values[4]),
                precioUnitario: this.getCellValue(values[5]),
                cantidad: this.getCellValue(values[6]),
                unidad: this.getCellValue(values[7]),
                fecha: this.getCellValue(values[8]),
                observacion: this.getCellValue(values[9]),
            });
        });

        if (rows.length === 0) {
            throw new BadRequestException('El archivo no contiene datos para procesar');
        }

        return rows;
    }

    /**
     * Helper to extract cell value handling different Excel data types
     */
    private getCellValue(cell: any): string {
        if (cell === null || cell === undefined) return '';

        // Handle different cell types
        if (typeof cell === 'object') {
            if (cell.text) return String(cell.text).trim();
            if (cell.result !== undefined) return String(cell.result).trim();
            if (cell.value !== undefined) return String(cell.value).trim();
        }

        return String(cell).trim();
    }
}
