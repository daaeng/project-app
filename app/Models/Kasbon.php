<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Kasbon extends Model
{
    use HasFactory;

    protected $table = 'kasbons';

    protected $primaryKey = 'id';

    protected $fillable = [
        'incisor_id',
        'gaji',
        'kasbon',
        'status',
        'reason',
        'month',
        'year',
        'kasbonable_type',
        'kasbonable_id',
    ];

    public $timestamps = true;

    public function kasbonable(): MorphTo
    {
        return $this->morphTo();
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function incisor(): BelongsTo
    {
        return $this->belongsTo(Incisor::class, 'incisor_id');
    }

    public function incised(): BelongsTo
    {
        return $this->belongsTo(Incised::class, 'incised_id');
    }
}
