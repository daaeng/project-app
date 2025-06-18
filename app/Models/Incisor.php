<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incisor extends Model
{
    protected $fillable = 
    [
        'name', 
        'ttl', 
        'gender', 
        'address', 
        'agama', 
        'status', 
        'no_invoice', 
        'lok_toreh',
    ];

    public function inciseds()
    {
        return $this->hasMany(Incised::class, 'no_invoice', 'no_invoice');
    }
}
