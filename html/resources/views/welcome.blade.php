<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Easy order</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{mix('/css/app.css')}}">
    <link rel="manifest" href="{{ asset('manifest.json') }}">
    <script>if ('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/service-worker.js')})}</script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
</head>
    <body>
        <div id="root"></div>
        <script src="{{mix('/js/app.js')}}"></script>
    </body>
</html>
