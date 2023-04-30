<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Blog extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'blogs';
    protected $fillable = [
        'user_id',
        'title',
        'body',
        'image'

    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected $appends = array('created_at_formatted');

    public function getImageAttribute($image) {
        if($image != ''){
            return url('images').'/'.$image;
        }else{
            return url('images').'/default.png';
        }
        

    }

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'id');
    }

    public function getCreatedAtFormattedAttribute()
    {
        $created_at = Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at);
        return $created_at->format('d-m-Y h:i A');
    }
}
