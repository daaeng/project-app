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
        'tgl_kirim',    
        'tgl_sampai', 
        'qty_sampai',
        
        // [BARU] Field Tambahan
        'customer_name',    // Nama/Customer
        'shipping_method',  // Via Pengiriman
        'pph_value',        // PPH 0.25% (Nominal)
        'ob_cost',          // OB (Nominal)
        'extra_cost',       // Biaya Tambahan
        'due_date',         // Tgl Jatuh Tempo
        'person_in_charge', // Penanggung Jawab
    ];
}