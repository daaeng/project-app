<<<<<<< HEAD
=======

>>>>>>> 025c70bc001d36eb15bc67f4399dce97378d16de
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kasbons', function (Blueprint $table) {
<<<<<<< HEAD
            // Tambahkan kolom untuk relasi polimorfik setelah 'id'
            // 'nullable' agar data lama tidak error
            $table->morphs('kasbonable'); 
=======
            // 1. Tambahkan kolom polimorfik setelah 'id'
            // Nama relasinya adalah 'kasbonable'
            $table->morphs('kasbonable');

            // 2. Hapus kolom foreign key yang lama (opsional tapi sangat direkomendasikan)
            // Pastikan Anda sudah mem-backup data jika diperlukan.
            // Kolom ini tidak lagi dibutuhkan karena sudah di-handle oleh morphs.
            if (Schema::hasColumn('kasbons', 'incisor_id')) {
                // $table->dropForeign(['incisor_id']); // Hapus foreign key constraint jika ada
                $table->dropColumn('incisor_id');
            }
            if (Schema::hasColumn('kasbons', 'incised_id')) {
                // $table->dropForeign(['incised_id']); // Hapus foreign key constraint jika ada
                $table->dropColumn('incised_id');
            }
>>>>>>> 025c70bc001d36eb15bc67f4399dce97378d16de
        });
    }

    public function down(): void
    {
        Schema::table('kasbons', function (Blueprint $table) {
            $table->dropMorphs('kasbonable');
<<<<<<< HEAD
        });
    }
};
=======
            // Jika rollback, kembalikan kolom lama
            $table->foreignId('incisor_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('incised_id')->nullable()->constrained()->onDelete('cascade');
        });
    }
};
>>>>>>> 025c70bc001d36eb15bc67f4399dce97378d16de
