@extends('layouts.app')

@section('content')
<div class="py-3">
    <div class="container">

        <div class="row">
            @include('flash-message') 
            <div class="mb-2">
                <a href="{{ url()->previous() }}" class="pb-2 btn btn-primary">Back</a>
            </div>
        </div>

        <div class="row">
          <div class="card">
            <div class="card-body">
                <h4 class="mb-3 mt-2 card-title">View Blog</h4>
                <hr class="my-4">
                
                <div class="col-md-12">
                  <img src="{{ $blog->image }}" class="" alt="" style="height: 300px;">
                  <div class="h-100 bg-body-tertiary mt-3">
                    <h2>{{ $blog->title }}</h2>
                    <p>{{ $blog->body }}</p>
                    <p class="text-muted">Published By {{ $blog->user->name }}</p>
                  </div>
                </div>

            </div>
          </div>
        </div>

    </div>
  </div>
@endsection
