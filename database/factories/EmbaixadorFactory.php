<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Embaixador>
 */
class EmbaixadorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => $this->faker->uuid,
            'nome' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'whatsapp' => $this->faker->phoneNumber,
            'idade' => $this->faker->numberBetween(18, 100),
            'nascimento' => $this->faker->date(),
            'sexo' => $this->faker->randomElement(['M', 'F']),
            'cep' => $this->faker->postcode,
            'bairro' => $this->faker->city,
            'cidade' => $this->faker->state,
            'embaixador_id' => null,
            'referral_code' => strtoupper(\Illuminate\Support\Str::random(6)),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
