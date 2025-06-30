<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kasbon extends Model
{
    use HasFactory;

    protected $fillable = [
        'incisor_id',
        'incised_id', 
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
}

