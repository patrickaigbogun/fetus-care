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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id(); // profile_id
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('firstname');
            $table->string('lastname');
            $table->string('profile_image')->nullable();
            $table->string('country');
            $table->string('state');
            $table->integer('age');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
