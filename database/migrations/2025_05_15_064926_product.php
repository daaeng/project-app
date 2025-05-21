<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product');
            $table->date('date');
            $table->integer('no_invoice');
            $table->string('nm_supplier');
            $table->string('j_brg');
            $table->text('desk')->nullable();
            $table->integer('qty_kg');
            $table->decimal('price_qty', 10, 2);
            $table->decimal('amount', 10, 2);
            $table->integer('qty_out');
            $table->decimal('price_out', 10, 2);
            $table->decimal('amount_out', 10, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
