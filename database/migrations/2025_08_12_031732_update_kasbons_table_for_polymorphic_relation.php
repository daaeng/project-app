<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kasbons', function (Blueprint $table) {
            // Tambahkan kolom untuk relasi polimorfik setelah 'id'
            // 'nullable' agar data lama tidak error
            $table->morphs('kasbonable'); 
        });
    }

    public function down(): void
    {
        Schema::table('kasbons', function (Blueprint $table) {
            $table->dropMorphs('kasbonable');
        });
    }
};
