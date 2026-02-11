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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('product_type', ['original', 'print', 'digital']);
            $table->decimal('price', 15, 2);
            $table->decimal('price_usd', 10, 2)->nullable();
            $table->integer('width')->comment('in cm');
            $table->integer('height')->comment('in cm');
            $table->string('medium');
            $table->year('year_created');
            $table->enum('status', ['available', 'sold'])->default('available');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
