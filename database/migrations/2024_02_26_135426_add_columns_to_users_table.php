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
        Schema::table('users', function (Blueprint $table) {
            $table->string('whatsapp')->nullable();
            $table->unsignedInteger('idade')->nullable();
            $table->date('nascimento')->nullable();
            $table->string('sexo')->nullable();
            $table->string('bairro')->nullable();
            $table->string('cidade')->nullable();
            $table->foreignId('user_id')->nullable()->index()->constrained('users')->nullOnDelete();
            $table->string('referral_code')->nullable();
            $table->string('pass')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('whatsapp', 'idade', 'nascimento', 'sexo', 'bairro', 'cidade', 'user_id', 'referral_code', 'pass');
        });
    }
};
