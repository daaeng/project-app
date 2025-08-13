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
                $table->string('payroll_period'); // Format: 'YYYY-MM', contoh: '2025-08'
                $table->decimal('base_salary', 15, 2); // Gaji Pokok
                $table->decimal('total_allowance', 15, 2)->default(0); // Total Tunjangan
                $table->decimal('total_deduction', 15, 2)->default(0); // Total Potongan (termasuk kasbon)
                $table->decimal('net_salary', 15, 2); // Gaji Bersih
                $table->date('payment_date')->nullable();
                $table->string('status')->default('unpaid'); // Status: unpaid, paid
                $table->timestamps();
            });
        }

        public function down(): void
        {
            Schema::dropIfExists('payrolls');
        }
    };
    