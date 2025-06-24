<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Kasbon extends Model
{
    protected $fillable = [
        'incisor_id', 'incised_id', 'kasbon', 'status', 'reason'
    ];

    public function incisor()
    {
        return $this->belongsTo(Incisor::class);
    }

    public function incised()
    {
        return $this->belongsTo(Incised::class);
    }

    // Accessor untuk menghitung gaji berdasarkan amount per bulan
    // public function getGajiAttribute()
    // {
    //     // Ambil incised_id dari kasbon
    //     $incised = $this->incised;
    //     if (!$incised) {
    //         return 0; // Jika tidak ada incised terkait
    //     }

    //     // Ambil bulan dan tahun dari date di incised
    //     $month = $incised->date->format('m');
    //     $year = $incised->date->format('Y');

    //     // Hitung total amount untuk incisor_id di bulan dan tahun yang sama
    //     $totalAmount = Incised::where('no_invoice', $incised->no_invoice)
    //         ->whereMonth('date', $month)
    //         ->whereYear('date', $year)
    //         ->sum('amount');

    //     // Gaji = 50% dari total amount
    //     return $totalAmount * 0.5;
    // }
}