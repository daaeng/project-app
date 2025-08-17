<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_payroll_items_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_id')->constrained('payrolls')->onDelete('cascade');
            $table->string('deskripsi'); // Contoh: "Gaji Pokok", "Uang Makan (22 hari)", "Insentif Kinerja"
            $table->enum('tipe', ['pendapatan', 'potongan']);
            $table->unsignedInteger('jumlah');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_items');
    }
};
