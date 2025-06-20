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
            $table->string('no_invoice');
            $table->string('nm_supplier');
            $table->string('j_brg');
            $table->text('desk')->nullable();
            $table->integer('qty_kg');
            $table->decimal('price_qty', 12, 2);
            $table->decimal('amount', 12, 2);
            $table->integer('keping');
            $table->string('kualitas');
            $table->integer('qty_out');
            $table->decimal('price_out', 12, 2);
            $table->decimal('amount_out', 12, 2);
            $table->integer('keping_out');
            $table->string('kualitas_out');

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
