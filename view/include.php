<?php
$content = '';
$fileIterator = new FilesystemIterator(__DIR__.'\css');
foreach($fileIterator as $fileInfo){
    if(!$fileInfo->isDir()){
        $content .= '../../css/'.$fileInfo->getFileName()."\n";
    }
}
$fileIterator = new FilesystemIterator(__DIR__.'\js');
foreach($fileIterator as $fileInfo){
    if(!$fileInfo->isDir()){
        $content .= '../../js/'.$fileInfo->getFileName()."\n";
    }
}
//$fileIterator = new FilesystemIterator(__DIR__.'\img');
//foreach($fileIterator as $fileInfo){
//    if(!$fileInfo->isDir()){
//        $content .= './img/'.$fileInfo->getFileName()."\n";
//    }
//}
$project = 'main_soft';

$fileIterator = new FilesystemIterator(__DIR__.'\projects\\'.$project.'\css');
foreach($fileIterator as $fileInfo){
    if(!$fileInfo->isDir()){
        $content .= './css/'.$fileInfo->getFileName()."\n";
    }
}
$fileIterator = new FilesystemIterator(__DIR__.'\projects\\'.$project.'\img');
foreach($fileIterator as $fileInfo){
    if(!$fileInfo->isDir()){
        $content .= './img/'.$fileInfo->getFileName()."\n";
    }
}

$fileIterator = new FilesystemIterator(__DIR__.'\projects\\'.$project.'\js');
foreach($fileIterator as $fileInfo){
    if(!$fileInfo->isDir()){
        $content .= './js/'.$fileInfo->getFileName()."\n";
    }
}

$version = mt_rand(10,500);
$c = <<<EOF
CACHE MANIFEST
#change {$version}
./index.html
{$content}
NETWORK:
*
EOF;

file_put_contents(__DIR__.'\projects\\'.$project.'\phone.manifest',$c);
var_dump($c,$version);