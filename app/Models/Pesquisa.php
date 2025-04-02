<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;

class Pesquisa extends Model implements Sortable
{
    use HasFactory;
    use SortableTrait;

    protected $guarded = [];

    public $sortable = [
        'order_column_name' => 'order_column',
        'sort_when_creating' => true,
    ];

    public function opcoes()
    {
        return $this->hasMany(Resposta::class);
    }

    public function respostas()
    {
        return $this->belongsToMany(Resposta::class, 'pesquisa_respostas');
    }

    public function getRespostasCountAttribute()
    {
        return $this->respostas->count();
    }
}
