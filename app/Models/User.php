<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Lab404\Impersonate\Models\Impersonate;
use Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, Impersonate, HasRecursiveRelationships;

    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function embaixador()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function embaixados()
    {
        return $this->hasMany(User::class);
    }

    public function getEmbaixadorNomeAttribute()
    {
        return $this->embaixador ? $this->embaixador->name . ' (' . $this->embaixador->referral_code . ')' : '-';
    }

    public function getParentKeyName()
    {
        return 'user_id';
    }
}
