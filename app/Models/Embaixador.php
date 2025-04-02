<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Embaixador extends Model
{
    use HasFactory;

    protected $table = 'embaixadores';

    protected $guarded = [];

    public function embaixador()
    {
        return $this->belongsTo(Embaixador::class, 'embaixador_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getEmbaixadorNomeAttribute()
    {
        return $this->embaixador ? $this->embaixador->nome . ' (' . $this->embaixador->referral_code . ')' : '-';
    }

    public function scopeForMe(Builder $query): void
    {
        if (!auth()->user()->is_admin) {
            $query->where('embaixador_id', auth()->user()->embaixador->id);
        }
    }
}
