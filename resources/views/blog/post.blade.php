@extends('layouts.app')

@section('content')
<div class="py-3">
    <div class="container">

        <div class="row">
          <div class="card">
            <div class="card-body">
                <h4 class="mb-3 mt-2 card-title">Add New Blog</h4>
                <hr class="my-4">
              <form class="needs-validation" novalidate="" action="{{ route('blogs.store') }}" method="POST"  enctype="multipart/form-data">
                  @csrf
                  @method('POST')
                  <div class="row g-3">
                    <div class="col-sm-12">
                      <label for="title" class="form-label">Title *</label>
                      <input type="text" class="form-control" name="title" id="title" placeholder="" required value="{{old('title')}}">
                      @error('title')
                          <ul class="parsley-errors-list filled" aria-hidden="false">
                            <li class="parsley-required">{{ $message }}</li>
                          </ul>
                      @enderror
                    </div>

                    <div class="col-sm-12">
                      <label for="body" class="form-label">Description *</label>
                      <textarea class="form-control" name="body" id="body" placeholder="" required>{{old('body')}}</textarea>
                      @error('body')
                          <ul class="parsley-errors-list filled" aria-hidden="false">
                            <li class="parsley-required">{{ $message }}</li>
                          </ul>
                      @enderror
                    </div>

                    <div class="col-sm-12">
                      <label for="image" class="form-label">Image</label>
                      <input type="file" class="form-control" name="image" data-parsley-filemimetypes="image/jpg, image/jpeg, image/png, image/heic" accept=".jpg, .jpeg, .png, .heic" data-parsley-file-mime-types-message="Please upload the image format jpg, jpeg, png, heic etc" data-parsley-fileextension='jpeg,jpg,png' id="image">
                      @error('image')
                          <ul class="parsley-errors-list filled" aria-hidden="false">
                            <li class="parsley-required">{{ $message }}</li>
                          </ul>
                      @enderror
                    </div>

                  </div>

                  <hr class="my-4">

                  <button class="btn btn-primary btn-lg" type="submit">Submit</button>
                  <a href="{{ route('blogs.index') }}" class="btn btn-secondary btn-lg m-l-5">Cancel</a>
                </form>
            </div>
          </div>
        </div>

    </div>
  </div>
@endsection
