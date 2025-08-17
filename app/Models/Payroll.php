<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payroll extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'payroll_period',
        'total_pendapatan',
        'total_potongan',
        'gaji_bersih',
        'status',
        'tanggal_pembayaran',
    ];

    /**
     * Mendapatkan data pegawai yang memiliki payroll ini.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Mendapatkan rincian item dari payroll ini.
     */
    public function items(): HasMany
    {
        return $this->hasMany(PayrollItem::class);
    }
}
