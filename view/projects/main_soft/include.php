<?php
$content = '';
$fileIterator = new FilesystemIterator(__DIR__.'\css');
foreach($fileIterator as $fileInfo){
    if(!$fileInfo->isDir()){
        $content .= './css/'.$fileInfo->getFileName()."\n";
    }
}
$fileIterator = new FilesystemIterator(__DIR__.'\js');
foreach($fileIterator as $fileInfo){
    if(!$fileInfo->isDir()){
        $content .= './js/'.$fileInfo->getFileName()."\n";
    }
}
$fileIterator = new FilesystemIterator(__DIR__.'\img');
foreach($fileIterator as $fileInfo){
    if(!$fileInfo->isDir()){
        $content .= './img/'.$fileInfo->getFileName()."\n";
    }
}

foreach($fileIterator as $fileInfo){
    if(!$fileInfo->isDir()){
        $content .= '../css/'.$fileInfo->getFileName()."\n";
    }
}


$c = <<<EOF
CACHE MANIFEST
#change 6
{$content}
NETWORK:
*
EOF;

var_dump($c);