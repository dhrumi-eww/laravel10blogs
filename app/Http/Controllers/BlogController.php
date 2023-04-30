<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {   
        $params['blogs'] = Blog::where('user_id', auth()->user()->id)->with(['user'])->orderBy('id', 'desc')->get();
        return view('blog.index', $params);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('blog.post');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'title' => 'required',
            'body' => 'required',
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);


        if(isset($request->image)){
            $imageName = time().rand (1000,9999).'.'.$request->image->extension();  
            $request->image->move(public_path('images'), $imageName);
        }else{
            $imageName = '';
        }
        

        $Blog = Blog::create([
            'user_id' => auth()->user()->id,
            'title' => $request->title,
            'body' => $request->body,
            'image' => $imageName
        ]);

        return redirect()->route('blogs.index')->with('success', 'Blog added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {   
        $params['blog'] = Blog::with('user')->where('id', $blog->id)->first();
        return view('blog.view', $params);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blog $blog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blog $blog)
    {
        //
    }
}
