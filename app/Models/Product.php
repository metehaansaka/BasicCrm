<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function images(){
       return $this->HasMany(Images::class,'objectId','id');
    }
    public function property(){
        return $this->HasMany(Property::class,'objectId','id');
    }
}
