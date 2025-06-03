<?php

namespace App\Exports;

use App\Models\Libro;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Illuminate\Support\Facades\DB;

class LibrosExport implements FromCollection, WithHeadings, WithCustomStartCell, WithEvents
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
        $subqueryCantidad = DB::table('ejemplars')
            ->select('codigolibroID', DB::raw('COUNT(*) as cantidad'))
            ->groupBy('codigolibroID');

        $query = DB::table('ejemplars')
            ->join('libros', 'ejemplars.codigolibroID', '=', 'libros.codigolibroID')
            ->leftJoin('editorials', 'libros.editorialID', '=', 'editorials.editorialID')
            ->leftJoin('autor_libro', 'libros.id', '=', 'autor_libro.libro_id')
            ->leftJoin('autors', 'autor_libro.autor_id', '=', 'autors.autorID')
            ->joinSub($subqueryCantidad, 'cantidades', function ($join) {
                $join->on('ejemplars.codigolibroID', '=', 'cantidades.codigolibroID');
            })
            ->select(
                'ejemplars.ningresoID',                            // CONTROL TOPOGR.
                'ejemplars.codigolibroID',                         // CÓDIGO
                DB::raw('GROUP_CONCAT(DISTINCT autors.nombre SEPARATOR ", ") as autor_libro'), // AUTOR PERSONAL
                'libros.titulo',                                   // TITULO
                'libros.resumen',                                  // RESUMEN
                'libros.numeropaginas',                            // TOTAL DE PÁGINAS
                'libros.voltomejemp',                              // Volu. Tomo o Ejemplar
                'libros.edicion',                                  // EDICIÓN
                'libros.isbn',                                     // ISBN
                'editorials.nombre as editorial',                  // EDITORIAL
                'libros.pais',                                     // CIUD/PAÍS
                'libros.idioma',                                   // IDIOMA
                'libros.aniopublicacion',                          // FECHA PUBL.
                'libros.formadeadquisicion',                       // FORMA DE ADQUISIC.
                'ejemplars.precio',                                // PRECIO
                'libros.procedenciaproovedor',                     // PROCEDENCIA O PROVEEDOR
                'ejemplars.anioingreso',                           // FECHA DE ADQUISICIÓN
                DB::raw('1 as cantidad_de_ejemplares'),     // DISP.
                'ejemplars.estadolibro'                            // ESTAD. FISICO Y DE CONSERVAC.
            )
            ->groupBy(
                'ejemplars.ningresoID',
                'ejemplars.codigolibroID',
                'libros.titulo',
                'libros.resumen',
                'libros.numeropaginas',
                'libros.voltomejemp',
                'libros.edicion',
                'libros.isbn',
                'editorials.nombre',
                'libros.pais',
                'libros.idioma',
                'libros.aniopublicacion',
                'libros.formadeadquisicion',
                'ejemplars.precio',
                'libros.procedenciaproovedor',
                'ejemplars.anioingreso',
                'cantidades.cantidad',
                'ejemplars.estadolibro'
            );

        if (isset($this->filters['time'])) {
            $query->where('ejemplars.created_at', '>=', now()->subMinutes((int) $this->filters['time']));
        }

        if (isset($this->filters['limit'])) {
            $query->orderBy('ejemplars.created_at', 'desc')->limit($this->filters['limit']);
        } else {
            $query->orderBy('ejemplars.codigolibroID');
        }

        return $query->get();
    }


    public function headings(): array
    {
        return [
            'CONTROL TOPOGR.',
            'CÓDIGO',
            'AUTOR PERSONAL',
            'TITULO',
            'RESUMEN',
            'TOTAL DE PÁGINAS',
            'Volu. Tomo o Ejemplar',
            'EDICIÓN',
            'ISBN',
            'EDITORIAL',
            'CIUD/PAÍS',
            'IDIOMA',
            'FECHA PUBL.',
            'FORMA DE ADQUISIC.',
            'PRECIO',
            'PROCEDENCIA O PROVEEDOR',
            'FECHA DE ADQUISICIÓN',
            'DISP.',
            'ESTAD. FISICO Y DE CONSERVAC.',
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

                // Título
                $sheet->mergeCells("A1:$endColumn" . '1');
                $sheet->setCellValue('A1', 'Listado de Libros');
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
                    'font' => ['bold' => true],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                        'wrapText' => true,
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
                        'wrapText' => true,
                    ],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                        ],
                    ],
                ]);

                // Ajustar ancho de columnas a 35.00 y activar ajuste de texto
                $columns = range('A', $endColumn);
                foreach ($columns as $column) {
                    $sheet->getColumnDimension($column)->setWidth(35);
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
