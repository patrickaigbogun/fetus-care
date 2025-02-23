<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('professional_id')->constrained('professional_users')->onDelete('cascade');
            $table->dateTime('appointment_date');
            $table->string('appointment_type'); // e.g., "Consultation", "Check-up"
            $table->text('notes')->nullable();
            $table->string('status')->default('pending'); // ["pending", "confirmed", "canceled"]
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
