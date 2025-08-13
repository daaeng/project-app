<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
<<<<<<< HEAD
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
=======
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Employee extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function kasbons(): MorphMany
    {
        return $this->morphMany(Kasbon::class, 'kasbonable');
>>>>>>> 025c70bc001d36eb15bc67f4399dce97378d16de
    }
}
