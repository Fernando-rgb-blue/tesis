<!DOCTYPE html>
<html>

<head>
    <title>Laravel 10 Import Export Excel to Database Example - ItSolutionStuff.com</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="container">
        <div class="card bg-light mt-3">
            <div class="card-header">
                Laravel 10 Import Export Excel to Database Example - ItSolutionStuff.com
            </div>
            <div class="card-body">
                <table class="table table-bordered mt-3">
                    <tr>
                        <th colspan="3">
                            List Of Users
                            <a class="btn btn-warning float-end" href="{{ route('libros.export') }}">Export User Data</a>
                        </th>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</body>

</html>
