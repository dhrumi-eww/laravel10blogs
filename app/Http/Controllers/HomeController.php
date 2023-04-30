<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\User;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $params['blogs'] = Blog::orderBy('id', 'desc')->get();
        return view('home', $params);
    }

    public function profile_show(Request $request)
    {
        $params['blogs'] = Blog::where('user_id', request()->user)->orderBy('id', 'desc')->get();
        $params['user'] = User::find(request()->user);
        return view('profile', $params);
    }
}
