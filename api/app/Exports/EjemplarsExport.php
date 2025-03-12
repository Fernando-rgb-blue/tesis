<?php

namespace App\Exports;

use App\Models\Ejemplar;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class EjemplarsExport implements FromCollection, WithHeadings, WithCustomStartCell, WithEvents
{
    /**
     * Filtros para la exportación.
     *
     * @var array
     */

    private $filters;

    /**
     * Constructor que acepta filtros dinámicos.
     *
     * @param array $filters
     */
    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Ejemplar::selectRaw(
            'ejemplars.ningresoID, 
            ejemplars.codigolibroID, 
            libros.titulo, 
            ejemplars.estadolibro'
        )
            ->join('libros', 'ejemplars.codigolibroID', '=', 'libros.codigolibroID');
        
        // Aplica filtros si existen
        if (isset($this->filters['time'])) {
            $query->where('ejemplars.created_at', '>=', now()->subMinutes((int) $this->filters['time']));
        }
        
        if (isset($this->filters['limit'])) {
            $query->orderBy('ejemplars.created_at', 'desc')->limit($this->filters['limit']);
        }
        
        return $query->get();        
    }


    public function headings(): array
    {
        return [
            'N° de Ingreso',
            'Código de Libro ID',
            'Título del Libro',
            'Estado del Libro',
        ];
    }
    

    public function startCell(): string
    {
        return 'A2';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function ($event) {
                $sheet = $event->sheet;
    
                $endColumn = $this->getExcelColumnLetter(count($this->headings()));
                
                $sheet->mergeCells("A1:$endColumn" . '1');
                $sheet->setCellValue('A1', 'Listado de Ejemplares');
                $sheet->getStyle("A1:$endColumn" . '1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 14,
                        'color' => ['rgb' => 'FFFFFF'],
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '4472C4'],
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
    
                // Encabezados
                $sheet->getStyle('A2:' . $endColumn . '2')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'D9E1F2'],
                    ],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                        ],
                    ],
                ]);
    
                // Contenido
                $sheet->getStyle('A3:' . $endColumn . ($sheet->getHighestRow()))->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                        ],
                    ],
                ]);
    
                // Ajustar el ancho de las columnas
                $columns = range('A', $endColumn);
                foreach ($columns as $column) {
                    if ($column === 'C') { // Título del libro
                        $sheet->getColumnDimension($column)->setWidth(50);
                    } else {
                        $sheet->getColumnDimension($column)->setWidth(20);
                    }
                }
            },
        ];
    }
    

    private function getExcelColumnLetter($columnNumber)
    {
        $columnName = '';
        while ($columnNumber > 0) {
            $remainder = ($columnNumber - 1) % 26;
            $columnName = chr(65 + $remainder) . $columnName;
            $columnNumber = (int)(($columnNumber - $remainder) / 26);
        }
        return $columnName;
    }
}
