<?php


header("Content-Type: audio/mpeg");

/*$txt = "Hola";
$voice = file_get_contents('http://translate.google.com/translate_tts?tl=es&q='.$txt);
echo $voice;
*/

$txt = $_GET['txt'];

//$txt = "Hola niño!";
//$voice = file_get_contents('http://translate.google.com/translate_tts?tl=es&q='.$txt); //urlencode($txt));


$base_url = 'http://translate.google.com/translate_tts?';
$qs = http_build_query(array(
    'tl' => 'es',
    'ie' => 'UTF-8',
    'q' => $txt
));
$voice = file_get_contents($base_url . $qs);

echo $voice;


/*
$transtext = "t\xe9l\xe9phone"; // ISO-8859-1 string to be encoded in UTF-8
$base_url = 'http://translate.google.com/translate_tts?';
$qs = http_build_query(array(
    'tl' => 'fr',
    'ie' => 'UTF-8',
    'q' => utf8_encode($transtext)
));
$contents = file_get_contents($base_url . $qs);
*/

?>

