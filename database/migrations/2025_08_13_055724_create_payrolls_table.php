<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('payroll_period', 7); // Format: 'YYYY-MM'
            $table->unsignedInteger('total_pendapatan');
            $table->unsignedInteger('total_potongan');
            // --- PERBAIKAN DI SINI ---
            // Mengubah 'net_salary' menjadi 'gaji_bersih' agar konsisten
            $table->unsignedInteger('gaji_bersih');
            $table->enum('status', ['draft', 'final', 'paid'])->default('draft');
            $table->date('tanggal_pembayaran')->nullable();
            $table->timestamps();

            $table->unique(['employee_id', 'payroll_period']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
