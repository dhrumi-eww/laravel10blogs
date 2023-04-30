@extends('layouts.app')

@section('content')
<div class="album py-3">
    <div class="container">

        <div class="row">
            <div class="col-12">
                <h2 class="pb-2 border-bottom">Profile</h2>
                <a href="{{ route('home') }}" class="btn btn-primary rounded-pill px-3 mb-3 mt-2" type="button">Back to Home</a>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-12">
                <div class="card">
                      <div class="card-body">
                        <h5 class="card-title">{{ $user->name }}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">{{ $user->email }}</h6>
                        <p class="card-text">{{ count($blogs) }} blog(s)</p>
                      </div>
                </div>
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
                  {{ "Published by " }} <a href="{{ route('profile.show', ['user' => $value->user_id ]) }}">{{ $value->user->name }}</a> {{ " on ". $value->created_at_formatted}}
                </div>
              </div>
            </div>
            
            @endforeach
        @endif
      </div>
    </div>
  </div>
@endsection
