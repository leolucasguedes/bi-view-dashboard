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
        Schema::table('embaixadores', function (Blueprint $table) {
            $table->string('referral_code')->nullable()->after('cidade');
            $table->foreignId('user_id')->nullable()->index()->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('embaixadores', function (Blueprint $table) {
            $table->dropColumn('referral_code');
            $table->dropColumn('user_id');
        });
    }
};
