<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Kasbon extends Model
{
    use HasFactory;

    // Tambahkan 'kasbonable_id' dan 'kasbonable_type' ke fillable
    // Hapus 'incisor_id' dan 'incised_id' jika sudah tidak relevan untuk semua kasbon
    protected $fillable = [
        'kasbonable_id',
        'kasbonable_type',
        'kasbon',
        'status',
        'reason',
        'gaji',
        // Hapus incisor_id dan incised_id jika Anda memindahkannya sepenuhnya
        'incisor_id', 
    ];

    /**
     * Get the parent kasbonable model (Incisor or Employee).
     */
    public function kasbonable(): MorphTo
    {
        return $this->morphTo();
    }

    // Anda bisa tetap menyimpan relasi lama untuk data yang sudah ada
    public function incisor()
    {
        return $this->belongsTo(Incisor::class);
    }
}
