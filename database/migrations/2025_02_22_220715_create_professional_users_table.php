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
        Schema::create('professional_users', function (Blueprint $table) {
            $table->id();
            $table->string('professional_id')->unique(); // Unique ID for professionals
            $table->string('name');
            $table->string('field'); // Medical field or specialization
            $table->string('phone_number')->unique();
            $table->integer('grade')->default(0);
            $table->string('email')->unique();
            $table->string('password');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professional_users');
    }
};
