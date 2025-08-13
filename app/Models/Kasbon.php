<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Kasbon extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'incisor_id',
        'incised_id',
        'employee_id',
        'kasbonable_id',   // Ditambahkan untuk relasi polimorfik
        'kasbonable_type', // Ditambahkan untuk relasi polimorfik
        'kasbon',
        'status',
        'reason',
        'gaji',
    ];

    /**
     * Relasi polimorfik untuk mendapatkan pemilik kasbon (bisa Employee atau Incisor).
     */
    public function kasbonable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Relasi spesifik ke Employee (memudahkan query).
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Relasi spesifik ke Incisor (untuk data lama).
     */
    public function incisor(): BelongsTo
    {
        return $this->belongsTo(Incisor::class);
    }

    public function incised(): BelongsTo
    {
        return $this->belongsTo(Incised::class);
    }
}
