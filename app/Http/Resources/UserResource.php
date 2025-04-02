<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'whatsapp' => $this->whatsapp,
            'idade' => $this->idade,
            'nascimento' => $this->nascimento,
            'sexo' => $this->sexo,
            'bairro' => $this->bairro,
            'cidade' => $this->cidade,
            'zona_eleitoral' => $this->zona_eleitoral,
            'indications' => 20,
            'rede' => 20,
            'leaders' => 20,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at,
        ];
    }
}
