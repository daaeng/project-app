<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kasbon extends Model
{
    use HasFactory;

    protected $fillable = [
        'incisor_id', //untuk penoreh
        'incised_id', //untuk penoreh
        'kasbonable_id',
        'kasbonable_type',
        'kasbon',
        'status',
        'reason',
        'gaji', 
    ];

    public function incisor(): BelongsTo
    {
        return $this->belongsTo(Incisor::class);
    }

    public function incised(): BelongsTo
    {
        return $this->belongsTo(Incised::class);
    }

    public function kasbonable(): MorphTo
    {
        return $this->morphTo();
    }

    // Anda bisa tetap menyimpan relasi lama untuk data yang sudah ada
    // public function incisor()
    // {
    //     return $this->belongsTo(Incisor::class);
    // }

}

