@extends('layouts.app')

@section('content')
<div class="py-3">

    
    <div class="container">
        <div class="row">
            @include('flash-message') 
            <div class="col-12">
                <h2 class="pb-2 border-bottom">My Blogs</h2>
                <a href="{{ route('home') }}" class="btn btn-primary rounded-pill px-3 mb-3 mt-2" type="button">Back to Home</a>
                <a href="{{ route('blogs.create') }}" class="btn btn-primary rounded-pill px-3 mb-3 mt-2" type="button">Add New Blog</a>
            </div>
        </div>

      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        @if(count($blogs) > 0)
            @foreach($blogs as $key => $value) 
            <div class="col-lg-4">
                <div class="card">
                <img src="{{ $value->image }}" class="card-img-top" alt="..." style="height: 300px;">
                <div class="card-body">
                  <h5 class="card-title">{{ $value->title }}</h5>
                  <p class="card-text">
                    {{ (strlen($value->body) > 50)?substr($value->body, 0, 50)."...":$value->body;  }}
                  </p>
                  <a href="{{ route('blogs.show', ['blog' => $value->id ]) }}" class="btn btn-primary">View Detail</a>
                </div>
                <div class="card-footer text-muted">
                  {{ "Published by " }} {{ $value->user->name }} {{ " on ". $value->created_at_formatted}}
                </div>
              </div>
            </div>
            
            @endforeach
        @else
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        No data found, <a href="{{ route('blogs.create') }}">Click here</a> to start blogging
                    </div>
                </div>
            </div>
        @endif
      </div>
    </div>
  </div>
@endsection
