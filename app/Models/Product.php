<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'product', 
        'date', 
        'no_invoice', 
        'nm_supplier', 
        'j_brg','desk', 
        'qty_kg', 
        'price_qty', 
        'amount', 
        'keping', 
        'kualitas',
        'qty_out', 
        'price_out', 
        'amount_out', 
        'keping_out', 
        'kualitas_out',
        'status',

    ];
}
