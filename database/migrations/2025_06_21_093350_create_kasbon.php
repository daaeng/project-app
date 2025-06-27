<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kasbons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incisor_id')->constrained('incisors')->onUpdate('cascade')->onDelete('restrict');
            // $table->foreignId('incised_id')->constrained('inciseds')->onUpdate('cascade')->onDelete('restrict');
            $table->decimal('gaji', 12, 2)->nullable(); // Tambah kolom gaji
            $table->decimal('kasbon', 12, 2)->default(500000);
            $table->string('status')->default('Belum ACC');
            $table->string('reason')->nullable();
            $table->integer('month')->nullable();
            $table->integer('year')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kasbons');
    }
};