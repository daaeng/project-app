<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Requested extends Model
{
    protected $fillable = 
    [
        'name', 'date', 'devisi', 'j_pengajuan', 'mengetahui', 'desk', 'file', 'status', 'reason', 'file_hash'
    ];
}
