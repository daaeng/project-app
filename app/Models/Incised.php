<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incised extends Model
{
    protected $fillable = [
        'product', 
        'date', 
        'no_invoice', 
        'lok_kebun', 
        'j_brg',
        'desk',
        
        'qty_kg', 
        'price_qty', 
        'amount', 
        'keping', 
        'kualitas',
    
    ];

    public function incisor()
    {
        return $this->belongsTo(Incisor::class, 'no_invoice', 'no_invoice');
    }
}
